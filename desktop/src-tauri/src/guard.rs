// A remote page runs in the same WebView as the local setup page. Command
// permissions are split by origin, but anything that stays reachable from the
// official site (写入本机 Agent 配置、打开下载页) must also pass a prompt the
// page cannot draw or dismiss: a native message box owned by the desktop.
use tauri::WebviewWindow;

pub fn origin_is_local(window: &WebviewWindow) -> bool {
    let Ok(url) = window.url() else {
        return false;
    };
    url_is_local(&url)
}

fn url_is_local(url: &url::Url) -> bool {
    match url.scheme() {
        "tauri" => true,
        "http" | "https" => matches!(
            url.host_str(),
            Some("tauri.localhost") | Some("localhost") | Some("127.0.0.1") | Some("::1")
        ),
        _ => false,
    }
}

/// Local pages are the operator's own UI, so no prompt. A remote origin gets a
/// native confirmation every time; refusing to show one denies the action.
pub fn confirm(window: &WebviewWindow, action: &str, detail: &str) -> Result<(), String> {
    if origin_is_local(window) {
        return Ok(());
    }
    let origin = window
        .url()
        .map(|url| origin_of(&url))
        .unwrap_or_else(|_| "未知来源".to_string());
    decide(ask_native(action, detail, &origin), action)
}

/// A native prompt has three outcomes. Keeping them apart means the decision is
/// one small function that can be tested without a window or a dialog:
/// "could not ask" must never be mistaken for "the operator said yes".
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum PromptAnswer {
    Approved,
    Refused,
    // Windows always has a message box to draw; only the other platforms can
    // end up with no way to ask.
    #[cfg_attr(windows, allow(dead_code))]
    Unavailable,
}

fn decide(answer: PromptAnswer, action: &str) -> Result<(), String> {
    match answer {
        PromptAnswer::Approved => Ok(()),
        // Same wording as before the platform split: callers already surface it.
        PromptAnswer::Refused => Err("操作已取消".into()),
        // No dialog on this platform (or the one that exists failed to start).
        // A remote page then cannot perform the action at all; the local setup
        // page is unaffected.
        PromptAnswer::Unavailable => Err(format!(
            "{action} 只能从本地页面执行；请在桌面端的「服务器设置」中操作"
        )),
    }
}

/// The origin only: a path or query could carry a token worth leaking into a
/// dialog, and the operator only needs to know which site is asking.
fn origin_of(url: &url::Url) -> String {
    let Some(host) = url.host_str() else {
        return url.scheme().to_string();
    };
    match url.port() {
        Some(port) => format!("{}://{}:{}", url.scheme(), host, port),
        None => format!("{}://{}", url.scheme(), host),
    }
}

/// The dialog text for the platforms added here: the action, what it will do,
/// and which site asked. Windows keeps its existing two-line body.
#[cfg(any(test, not(windows)))]
fn dialog_body(action: &str, detail: &str, origin: &str) -> String {
    format!("{action}\n\n{detail}\n\n来源：{origin}")
}

#[cfg(windows)]
fn ask_native(action: &str, detail: &str, _origin: &str) -> PromptAnswer {
    use windows::core::{HSTRING, PCWSTR};
    use windows::Win32::UI::WindowsAndMessaging::{
        MessageBoxW, IDYES, MB_DEFBUTTON2, MB_ICONWARNING, MB_YESNO,
    };

    let title = HSTRING::from("Secrets Broker");
    let body = HSTRING::from(format!("{action}\n\n{detail}"));
    // The default button is "No", so a stray Enter cannot approve a request the
    // page made behind the operator's back.
    let answer = unsafe {
        MessageBoxW(
            None,
            PCWSTR(body.as_ptr()),
            PCWSTR(title.as_ptr()),
            MB_YESNO | MB_ICONWARNING | MB_DEFBUTTON2,
        )
    };
    if answer == IDYES {
        PromptAnswer::Approved
    } else {
        PromptAnswer::Refused
    }
}

// macOS: the system alert, driven through AppleScript's `display dialog`.
// AppleScript renders it with NSAlert, which keeps this dependency-free and
// callable from the IPC thread the command runs on: linking objc2-app-kit's
// NSAlert would need a main-thread hop and could not be compiled anywhere in
// this repository's CI (desktop.yml only builds Windows).
#[cfg(target_os = "macos")]
fn ask_native(action: &str, detail: &str, origin: &str) -> PromptAnswer {
    use std::process::Command;

    let body = escape_applescript(&dialog_body(action, detail, origin));
    let title = escape_applescript("Secrets Broker");
    // "拒绝" is added first and named as the default: Return and a dismissed
    // dialog both refuse, so only an explicit click on "允许" approves.
    let deny = escape_applescript("拒绝");
    let script = format!(
        "display dialog \"{body}\" with title \"{title}\" buttons {{\"{deny}\", \"允许\"}} default button \"{deny}\" with icon caution"
    );
    let output = match Command::new("osascript").arg("-e").arg(script).output() {
        Ok(output) => output,
        Err(error) => {
            eprintln!("[guard] osascript unavailable: {error}");
            return PromptAnswer::Unavailable;
        }
    };
    if !output.status.success() {
        // Escape / window closed: AppleScript exits non-zero. Treat as a refusal.
        return PromptAnswer::Refused;
    }
    let stdout = String::from_utf8_lossy(&output.stdout);
    if stdout.contains("允许") {
        PromptAnswer::Approved
    } else {
        PromptAnswer::Refused
    }
}

// Linux: zenity first because it can mark Cancel as the default button; kdialog
// is the KDE equivalent and asks for "no" as the default. Anything this cannot
// draw is a refusal, never an approval.
#[cfg(target_os = "linux")]
fn ask_native(action: &str, detail: &str, origin: &str) -> PromptAnswer {
    use std::process::{Command, Stdio};

    let body = dialog_body(action, detail, origin);
    let zenity = Command::new("zenity")
        .args([
            "--question",
            "--title",
            "Secrets Broker",
            "--text",
            body.as_str(),
            "--ok-label",
            "允许",
            "--cancel-label",
            "拒绝",
            "--default-cancel",
            "--icon=warning",
        ])
        .stdin(Stdio::null())
        .output();
    match zenity {
        Ok(output) => {
            return if output.status.success() {
                PromptAnswer::Approved
            } else {
                PromptAnswer::Refused
            }
        }
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {}
        Err(error) => {
            eprintln!("[guard] zenity failed: {error}");
            return PromptAnswer::Unavailable;
        }
    }
    let kdialog = Command::new("kdialog")
        .args([
            "--title",
            "Secrets Broker",
            "--warningyesno",
            body.as_str(),
            "--yes-label",
            "允许",
            "--no-label",
            "拒绝",
            "--default",
            "no",
        ])
        .stdin(Stdio::null())
        .output();
    match kdialog {
        Ok(output) => {
            if output.status.success() {
                PromptAnswer::Approved
            } else {
                PromptAnswer::Refused
            }
        }
        Err(error) => {
            eprintln!("[guard] no native confirmation available (zenity or kdialog): {error}");
            PromptAnswer::Unavailable
        }
    }
}

#[cfg(not(any(windows, target_os = "macos", target_os = "linux")))]
fn ask_native(_action: &str, _detail: &str, _origin: &str) -> PromptAnswer {
    eprintln!("[guard] no native confirmation is wired up for this platform");
    PromptAnswer::Unavailable
}

/// AppleScript string literals: backslash and quote would otherwise end the
/// literal, and a raw newline is not portable inside one.
#[cfg(any(test, target_os = "macos"))]
fn escape_applescript(text: &str) -> String {
    let mut out = String::with_capacity(text.len());
    for ch in text.chars() {
        match ch {
            '\\' => out.push_str("\\\\"),
            '"' => out.push_str("\\\""),
            '\n' => out.push_str("\\n"),
            '\r' => {}
            _ => out.push(ch),
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use super::{
        decide, dialog_body, escape_applescript, origin_of, url_is_local, PromptAnswer,
    };

    fn parse(value: &str) -> url::Url {
        url::Url::parse(value).unwrap()
    }

    #[test]
    fn the_local_setup_page_is_local() {
        assert!(url_is_local(&parse("http://tauri.localhost/setup.html")));
        assert!(url_is_local(&parse("https://localhost/setup.html")));
        assert!(url_is_local(&parse("tauri://localhost/setup.html")));
    }

    #[test]
    fn the_official_site_is_not_local() {
        assert!(!url_is_local(&parse("https://sb.otscup.com/")));
        // A host that merely ends with localhost must not inherit the exemption.
        assert!(!url_is_local(&parse("https://notlocalhost.example.com/")));
    }

    #[test]
    fn only_an_explicit_approval_passes() {
        assert!(decide(PromptAnswer::Approved, "打开下载页面").is_ok());
        assert_eq!(
            decide(PromptAnswer::Refused, "接入本机 Agent"),
            Err("操作已取消".to_string())
        );
    }

    #[test]
    fn a_prompt_that_cannot_be_shown_refuses() {
        let message = decide(PromptAnswer::Unavailable, "更改服务器地址").unwrap_err();
        assert!(message.contains("更改服务器地址"));
        assert!(message.contains("本地页面"));
    }

    #[test]
    fn the_prompt_names_the_action_and_the_source() {
        let body = dialog_body(
            "更改服务器地址",
            "该请求来自非本地页面，可能把桌面端指向另一台服务器。",
            "https://sb.otscup.com",
        );
        assert!(body.contains("更改服务器地址"));
        assert!(body.contains("非本地页面"));
        assert!(body.contains("https://sb.otscup.com"));
    }

    #[test]
    fn the_source_is_an_origin_without_path_or_query() {
        assert_eq!(
            origin_of(&parse("https://sb.example/path?token=secret")),
            "https://sb.example"
        );
        assert_eq!(
            origin_of(&parse("http://127.0.0.1:8787/login")),
            "http://127.0.0.1:8787"
        );
    }

    #[test]
    fn apple_script_literals_cannot_break_out() {
        let escaped = escape_applescript("a \" b \\ c\nd");
        assert!(!escaped.contains('\n'));
        assert!(escaped.contains("\\\""));
        assert!(escaped.contains("\\\\"));
    }
}
