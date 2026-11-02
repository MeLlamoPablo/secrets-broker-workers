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
    confirm_native(action, detail)
}

#[cfg(windows)]
fn confirm_native(action: &str, detail: &str) -> Result<(), String> {
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
        Ok(())
    } else {
        Err("操作已取消".into())
    }
}

#[cfg(not(windows))]
fn confirm_native(action: &str, _detail: &str) -> Result<(), String> {
    // No native prompt is wired up for this platform, so a remote page cannot
    // perform the action at all. The local setup page is unaffected.
    Err(format!(
        "{action} 只能从本地页面执行；请在桌面端的「服务器设置」中操作"
    ))
}

#[cfg(test)]
mod tests {
    use super::url_is_local;

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
}
