export const uiHtml = String.raw`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" type="image/x-icon" href="/favicon.ico?v=2">
<link rel="icon" type="image/png" sizes="192x192" href="/logo.png?v=2">
<link rel="apple-touch-icon" href="/logo.png?v=2">
<title>Secrets Broker · Cloudflare Workers</title>
<style>
*{box-sizing:border-box}
body{margin:0}
header{margin-bottom:18px;flex-wrap:wrap}
h1{margin:0}
nav button{border:0;font:inherit;cursor:pointer}
.user{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:12px}
.user-wrap{position:relative;margin-left:auto}
.avatar{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:600;padding:0;line-height:1;cursor:pointer;overflow:hidden;flex:0 0 auto}
.avatar img{display:block;width:100%;height:100%;object-fit:cover;border-radius:50%}
.theme-cycle{border:0;line-height:1;padding:4px 6px;cursor:pointer;flex:0 0 auto;opacity:.7}
.theme-cycle:hover{opacity:1}
nav .icon-btn{width:30px;height:30px;margin-left:4px}
.user .email{display:none}
.user .who-name{display:inline;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.icon-btn{display:grid;place-items:center;width:32px;height:32px;border:0;background:transparent;text-decoration:none;transition:background-color var(--dur-fade) var(--ease),color var(--dur-fade) var(--ease),transform var(--dur-fade) var(--ease)}
.icon-btn:hover{color:var(--text)}
.icon-btn:active{transform:scale(.94)}
.account-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:60;min-width:160px;max-width:min(220px,calc(100vw - 24px))}
.account-menu button{display:block;width:100%;text-align:left;background:transparent}
html[data-theme="dark"] .modal{background:rgba(0,0,0,.6)}
label.field{display:block}
input,select,textarea{width:100%;font:inherit;outline:none}
input[type=checkbox]{min-width:0;accent-color:var(--ok)}
.chk{display:inline-flex;align-items:center;gap:7px;font-size:12px;color:var(--text);min-width:0;margin:8px 0}
.row .chk{flex:0 0 auto;min-width:auto}
button{border:0;font:inherit;cursor:pointer}
button.small{white-space:nowrap}
.notice-bar{display:flex;align-items:center;gap:10px;padding:8px 14px;border-radius:12px;margin-bottom:6px;cursor:pointer;border:1px solid transparent;font-size:13px;overflow:hidden;transition:transform var(--dur-fade) var(--ease)}
.notice-bar:active{transform:translateY(1px)}
.notice-bar .notice-text{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.notice-bar .notice-count{flex:0 0 auto;font-family:inherit;font-size:12px;line-height:18px;padding:2px 8px;border:0;border-radius:999px;background:rgba(0,0,0,.06);color:inherit;cursor:pointer}
.notice-bar .notice-count[data-kind="pending"]{background:color-mix(in srgb,var(--orange) 16%,transparent);color:var(--warn-text)}
.notice-bar .notice-dot{flex:0 0 auto;width:8px;height:8px;border-radius:50%}
.notice-bar .notice-more{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;border:0;background:transparent;color:inherit;font:inherit;font-size:12px;line-height:18px;padding:6px 8px;border-radius:8px;cursor:pointer;opacity:.75;white-space:nowrap}
.notice-bar .notice-more:hover{opacity:1;background:rgba(0,0,0,.06)}
.notice-bar [data-notice-dismiss]{font-size:15px;line-height:16px;padding:8px 10px}
html[data-theme="dark"] .notice-bar .notice-more:hover{background:rgba(255,255,255,.12)}
.notice-dismiss{flex:0 0 auto}
/* The approval panel floats below the bar: it must never push row1/row2 down,
   so it is positioned out of flow and capped with its own scroll. */
#notice-bar{position:relative;overflow:visible}
.notice-approve{position:absolute;left:0;right:0;top:calc(100% + 4px);z-index:45;display:flex;flex-direction:column;gap:2px;padding:6px 10px;background:var(--surface);border:1px solid var(--hair);border-radius:12px;box-shadow:var(--shadow-2);color:var(--ink-1);cursor:default;max-height:132px;overflow-y:auto}
.notice-approve .na-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px;line-height:18px;color:var(--ink-2)}
.notice-approve .na-head>span[role="status"]{flex:1;min-width:120px}
.notice-approve .na-row{display:flex;align-items:center;gap:6px;min-height:28px;font-size:12px}
.notice-approve .na-who{flex:0 0 auto;max-width:36%;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.notice-approve .na-what{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--ink-2)}
.notice-approve .na-what b{color:var(--ink-1);font-weight:600}
.notice-approve .na-actions{flex:0 0 auto;display:flex;gap:4px}
.notice-approve button{min-height:24px;padding:2px 8px;border:1px solid var(--hair);border-radius:8px;background:var(--surface-2);color:var(--ink-1);font:inherit;font-size:12px;line-height:18px;cursor:pointer}
.notice-approve button[data-quick-decide="1h"]{background:var(--brand-strong);border-color:transparent;color:#fff}
.notice-approve button[data-quick-decide="deny"]{color:var(--danger)}
.notice-approve button.na-notify{background:var(--brand-soft);border-color:transparent;color:var(--brand-text)}
.notice-approve button.na-more{padding:2px 4px;background:transparent;border-color:transparent;color:var(--brand-text)}
.notice-approve .na-blocked{flex:0 0 auto;font-size:12px;color:var(--danger)}
@media(max-width:720px){
.notice-approve{max-height:190px;padding:8px 10px}
.notice-approve .na-row{flex-wrap:wrap;min-height:40px;gap:4px}
.notice-approve .na-who{max-width:none}
.notice-approve .na-what{flex:1 1 60%}
.notice-approve .na-actions{width:100%}
.notice-approve button{min-height:40px;padding:8px 10px;font-size:13px}
}
@media(max-width:720px){
.notice-bar{flex-wrap:wrap}
.notice-bar .notice-more{min-width:40px;min-height:40px;padding:8px 10px}
.notice-dismiss{min-width:40px;min-height:40px;padding:8px 10px}
}
/* A first connection is approved in the same queue as a read request, so its
   card lives in the pending sheet. The form caps its own height and scrolls: a
   long item list must never stretch the modal past the viewport. */
.conn-card{border:1px solid var(--line);border-radius:10px;padding:10px;margin-bottom:8px;display:flex;flex-direction:column;gap:6px}
.conn-head{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.conn-name{font-weight:600}
.conn-meta{font-size:12px;line-height:18px;color:var(--muted)}
.conn-form{display:flex;flex-direction:column;gap:8px;border-top:1px solid var(--line);padding-top:8px}
.conn-scope{display:flex;gap:12px;flex-wrap:wrap;font-size:13px}
.conn-scope label,.conn-items label{display:flex;align-items:center;gap:6px;white-space:nowrap}
/* The global input rule is width:100%, which would squeeze a radio's label to
   one character per line; give the control its natural size back. */
.conn-scope input,.conn-items input{width:auto;flex:0 0 auto}
.conn-items{display:flex;flex-direction:column;border:1px solid var(--hair);border-radius:8px;padding:4px 8px;max-height:150px;overflow-y:auto}
.conn-items label{min-height:28px;font-size:12px}
.conn-items input{flex:0 0 auto}
.conn-actions{display:flex;gap:8px;flex-wrap:wrap}
.conn-actions button{min-height:32px;padding:4px 12px}
.conn-hint{font-size:12px;line-height:18px}
.conn-hint[data-state="error"]{color:var(--danger)}
@media(max-width:720px){
.conn-items label{min-height:40px}
.conn-actions button{min-height:40px}
}
.notice-bar[data-tone="red"]{background:#fdecec;border-color:#f5c2c2;color:#a12b2b}
.notice-bar[data-tone="red"] .notice-dot{background:var(--red)}
.notice-bar[data-tone="orange"]{background:#fff4e5;border-color:#f5d9ae;color:#8a5a00}
.notice-bar[data-tone="orange"] .notice-dot{background:#c2760b}
.notice-bar[data-tone="blue"]{background:#eef4ff;border-color:#cddcf7;color:#2b4f8a}
.notice-bar[data-tone="blue"] .notice-dot{background:#3f6ec4}
html[data-theme="dark"] .notice-bar[data-tone="red"]{background:color-mix(in srgb,var(--red) 18%,transparent);border-color:color-mix(in srgb,var(--red) 40%,transparent);color:#ffb4ad}
html[data-theme="dark"] .notice-bar[data-tone="orange"]{background:color-mix(in srgb,var(--orange) 18%,transparent);border-color:color-mix(in srgb,var(--orange) 40%,transparent);color:#ffd08a}
html[data-theme="dark"] .notice-bar[data-tone="blue"]{background:color-mix(in srgb,var(--blue) 18%,transparent);border-color:color-mix(in srgb,var(--blue) 40%,transparent);color:#a9c8ff}
.health{display:flex;flex-direction:column}
.health-row{background:none;border:0;border-top:1px solid var(--separator);font:inherit;color:inherit;text-align:left;cursor:pointer}
.health-row:first-child{border-top:0}
.health-bar{display:block;border-radius:3px;background:var(--fill);overflow:hidden}
.health-bar i{display:block;height:100%;border-radius:3px;background:var(--blue)}
.health-bar i[data-tone="purple"]{background:var(--purple)}
.health-bar i[data-tone="orange"]{background:var(--orange)}
.health-bar i[data-tone="green"]{background:var(--green)}
.health-label{font-weight:500}
.health-value{font-weight:600}
.ov-clear{display:flex;align-items:center;gap:var(--sp-3);padding:var(--sp-2) 0}
.ov-clear-mark{flex:0 0 auto;display:flex;width:34px;height:34px;align-items:center;justify-content:center;border-radius:50%;background:color-mix(in srgb,var(--green) var(--mix-badge),transparent);color:var(--green)}
.ov-clear-mark svg{width:22px;height:22px}
html[data-theme="dark"] .notice-bar[data-level="pending"]{background:color-mix(in srgb,var(--orange) 18%,transparent);border-color:color-mix(in srgb,var(--orange) 32%,transparent);color:var(--orange)}
html[data-theme="dark"] .notice-bar[data-level="critical"]{background:color-mix(in srgb,var(--red) 18%,transparent);border-color:color-mix(in srgb,var(--red) 32%,transparent);color:#FF8A80}
html[data-theme="dark"] .notice-bar .notice-count{background:rgba(255,255,255,.12)}
.notice-bar[data-level="pending"] .notice-dot{background:#c2760b}
.notice-bar[data-level="critical"]{background:#fdecec;border-color:#f5c2c2;color:#a12b2b}
.notice-bar[data-level="critical"] .notice-dot{background:var(--danger)}
.notice-bar[data-level="warning"]{background:#fff7e8;border-color:#f7e0b5;color:#8a5f00}
.notice-bar[data-level="warning"] .notice-dot{background:#d08a00}
.notice-bar[data-level="notice"] .notice-dot{background:#3f6ec4}
.notice-bar[data-level="pending"]{background:color-mix(in srgb,var(--orange) 10%,var(--surface));border-color:color-mix(in srgb,var(--orange) 30%,var(--hair));color:var(--warn-text)}
.notice-bar[data-level="notice"]{background:color-mix(in srgb,var(--brand) 8%,var(--surface));border-color:color-mix(in srgb,var(--brand) 24%,var(--hair));color:var(--brand-text)}
.globe-box{position:relative;height:210px;margin-top:8px;border-radius:12px;overflow:hidden;background:transparent;border:1px solid var(--line);touch-action:none}
.globe-pause{margin-left:4px;padding:2px 7px;font-size:11px;line-height:1.2}
.globe-expand{position:absolute;top:6px;right:6px;z-index:3;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:3px 8px;font-size:13px;line-height:1.2;cursor:pointer}
.globe-expand:hover{background:var(--btn)}
html[data-theme="dark"] .globe-box{background:transparent}
.globe-box.globe-full{position:fixed;inset:16px;z-index:60;height:auto;margin:0;border-radius:16px;box-shadow:0 24px 60px rgba(10,20,40,.35)}
.globe-box.globe-full canvas{cursor:grab}
.globe-big{position:fixed;inset:6%;z-index:80;background:var(--card);border:1px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:0 24px 70px rgba(8,16,32,.35);display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,320px);gap:0}
.globe-big-stage{min-width:0;position:relative;background:var(--bg)}
.globe-box-big{position:absolute;inset:0;height:100%;margin-top:0;border:0;border-radius:0;background:transparent}
.globe-big-side{min-width:0;display:flex;flex-direction:column;padding:16px;border-left:1px solid var(--line);background:var(--card);overflow:hidden}
.globe-big-side .danmu-feed{flex:1;max-height:none;overflow-y:auto}
.globe-big-close{position:absolute;top:12px;right:12px;z-index:5}
@media(max-width:900px){
.globe-big{inset:4%;grid-template-columns:1fr;grid-template-rows:1fr auto}
.globe-big-side{border-left:0;border-top:1px solid var(--line);max-height:42vh}
.globe-box-big{position:relative;inset:auto;height:52vh}
}
#globe-overlay{position:fixed;inset:0;z-index:80;display:none}
#globe-overlay.globe-overlay-on{display:block}
.danmu-title{font-size:12px;color:var(--muted);margin-bottom:6px}
.danmu-feed{max-height:180px;overflow:hidden;border:1px solid var(--line);border-radius:10px;padding:6px 10px;background:var(--btn);display:flex;flex-direction:column-reverse}
.danmu-row{display:flex;gap:8px;align-items:center;font-size:12px;padding:4px 0;border-bottom:1px dashed var(--line);white-space:nowrap;overflow:hidden}
.danmu-row:last-child{border-bottom:0}
.danmu-time{color:var(--muted);flex:0 0 auto;font-variant-numeric:tabular-nums}
.danmu-agent{flex:0 0 auto;max-width:96px;overflow:hidden;text-overflow:ellipsis}
.danmu-where{flex:0 0 auto;color:var(--muted)}
.danmu-act{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;color:var(--muted)}
.danmu-empty{font-size:12px;color:var(--muted);padding:6px 0}
.danmu-new{animation:danmuIn var(--dur-push) var(--ease)}
@keyframes danmuIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion: reduce){
.danmu-new{animation:none}
}
.globe-box canvas{cursor:grab}
.globe-box canvas:active{cursor:grabbing}
.globe-empty{position:absolute;inset:0;display:flex;align-items:flex-start;justify-content:center;padding:16px;pointer-events:none;color:var(--muted);font-size:12px;text-align:center;overflow-wrap:anywhere;word-break:break-word;overflow:hidden}
#globe-status{overflow-wrap:anywhere;word-break:break-word;font-size:11px;line-height:1.4;max-height:34px;overflow:hidden}
.globe-box canvas{display:block;max-width:100%}
@media(max-width:720px){
.globe-box{height:200px}
.user-wrap{position:relative}
.account-menu{position:fixed;left:12px;right:12px;top:auto;transform:none;min-width:0;max-width:none}
.table-wrap{-webkit-overflow-scrolling:touch}
.globe-big{inset:3%}
.globe-big-side{max-height:38vh}
}
@media (prefers-reduced-motion: reduce){
#globe-card .globe-box{scroll-behavior:auto}
}
.agent-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-flow:column;gap:10px;margin:10px 0;width:100%}
.agent-stats::after{content:none}
.agent-stat{padding:10px 14px;display:flex;flex-direction:column;justify-content:center;min-height:64px;min-width:0}
html[data-theme="dark"] .agent-stat{box-shadow:none;background:#151f31}
.agent-stat b{line-height:1.1;display:block}
.agent-stat span{display:block;margin-top:2px}
.agent-stat i{display:block;margin-top:6px;font-size:11px;color:var(--muted);font-style:normal;opacity:.8}
@media(max-width:600px){
.agent-stat{padding:8px 10px;min-height:64px}
.agent-stat i{display:none}
}
.agent-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 16px}
.agent-detail-grid>div{display:flex;flex-direction:column;gap:2px}
.agent-detail-grid span{font-size:11px;color:var(--muted)}
.agent-detail-grid b{font-size:13px;font-weight:500}
@media(max-width:420px){
.agent-detail-grid{grid-template-columns:1fr}
}
.row{display:flex;gap:9px;flex-wrap:wrap;align-items:end}
.row>*{flex:1;min-width:140px}
.row button{flex:0 0 auto}
.hidden{display:none!important}
.status{min-height:18px;margin-top:8px}
.card.collapsible>.card-toggle{cursor:pointer;user-select:none;display:flex;align-items:center;gap:6px;margin:0 0 5px}
.card.collapsible>.card-toggle .card-caret{color:var(--muted);font-size:11px;transition:transform var(--dur-fade) var(--ease);display:inline-block}
.card.collapsible.collapsed>.card-toggle .card-caret{transform:rotate(0)}
.card.collapsible:not(.collapsed)>.card-toggle .card-caret{transform:rotate(90deg)}
.card.collapsible.collapsed>.card-body{display:none}
.kpis{display:grid}
.kpi[data-kpi]{cursor:pointer;transition:background-color var(--dur-fade) var(--ease),border-color var(--dur-fade) var(--ease),transform var(--dur-fade) var(--ease)}
.kpi[data-kpi]:active{transform:translateY(1px)}
.kpi.warn .value{color:var(--warn)}
.toolbar{display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap}
.spacer{flex:1}
.seg{display:flex}
.grid3{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);grid-template-rows:auto auto;gap:14px;align-items:start}
.grid3>.card{display:flex;flex-direction:column;min-width:0;height:300px;overflow:hidden}
.grid3>.card>h2{margin:0 0 4px;flex:0 0 auto}
.grid3 .trend-box{flex:1 1 auto;min-height:0;overflow:hidden}
.grid3 .globe-box{flex:1 1 auto;min-height:0;height:auto}
.grid3 .donut-wrap{flex:1 1 auto;min-height:0;height:auto;justify-content:center;align-content:center;overflow:hidden}
.grid3 .rank-box{flex:1 1 auto;min-height:0;height:auto;overflow-y:scroll;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
.grid3 .rank-box::-webkit-scrollbar{width:0;height:0;display:none}
.grid3 .rank-box table{width:100%}
@media(max-width:1000px){
.grid3{grid-template-columns:1fr}
}
table{width:100%}
.table-wrap table{min-width:520px}
th{text-align:left;white-space:nowrap}
td{vertical-align:middle}
td.actions{white-space:nowrap}
td.actions button+button{margin-left:6px}
th.nowrap{white-space:nowrap}
.table-wrap{overflow-x:auto;max-width:100%}
.scroll-list{max-height:620px;overflow-y:auto;scrollbar-width:none;-ms-overflow-style:none}
.scroll-list::-webkit-scrollbar{width:0;height:0;display:none}
.gs-box{max-height:400px;overflow-y:auto;scrollbar-width:none;-ms-overflow-style:none}
.gs-box::-webkit-scrollbar{width:0;height:0;display:none}
#global-search-results{margin-bottom:12px}
.gs-group-title{margin:6px 2px 2px}
.gs-row{display:flex;gap:8px;align-items:center;width:100%;text-align:left;background:transparent;padding:6px 8px}
.gs-row b{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gs-sub{color:var(--muted);font-size:11px;flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gs-more{font-size:11px;color:var(--muted);padding:2px 8px 4px}
.toolbar .gs-input{flex:0 1 280px;width:280px;min-width:0}
@media(max-width:720px){
.toolbar .gs-input{flex:1 1 100%;width:100%}
}
.pill{display:inline-block;border:0;cursor:pointer}
.pill:hover{background:#dff3ee}
.kind-tag{display:inline-block;white-space:nowrap}
.kind-api{border-color:#bfe6dd}
.kind-web{border-color:#c6d9f7}
.kind-none{border-color:#f2c4c0}
html[data-theme="dark"] .kind-api{background:#0d3b36;color:#5fd8c4;border-color:#1c5c54}
html[data-theme="dark"] .kind-web{background:#152b4d;color:#7fb0f5;border-color:#26476f}
html[data-theme="dark"] .kind-none{background:#3b1d1d;color:#f08f86;border-color:#5c2a2a}
.link-button{display:inline-block;text-decoration:none}
.donut-wrap{display:flex;gap:12px;align-items:flex-start;flex-wrap:nowrap;min-width:0;overflow:hidden}
.donut-svg{position:relative;width:140px;height:140px;flex:0 0 auto;max-width:45%;align-self:flex-start}
.donut-svg svg{width:140px;height:140px;transform:rotate(-90deg)}
.donut-svg .donut-center{inset:31px}
.donut-center{position:absolute;inset:25px;background:#fff;border-radius:50%;display:grid;place-items:center;font-weight:650;font-size:17px;text-align:center;padding:6px}
.legend div.active{background:var(--btn);font-weight:600}
.legend{font-size:12px;flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px;align-content:flex-start;overflow-y:auto;max-height:100%;scrollbar-width:none;-ms-overflow-style:none}
.legend::-webkit-scrollbar{width:0;height:0;display:none}
.legend div{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0;cursor:pointer;border-radius:6px;padding:1px 4px;min-width:0;width:100%;transition:background-color var(--dur-fade) var(--ease),transform var(--dur-fade) var(--ease)}
.legend div:hover{background:var(--surface-2)}
.legend div:active{background:var(--fill-2);transform:translateY(1px)}
.legend div span{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.legend div b{flex:0 0 auto;font-weight:500}
.dot{display:inline-block;width:8px;height:8px;border-radius:99px;margin-right:6px;flex:0 0 auto}
.legend-pager{display:flex;gap:6px;justify-content:flex-end;align-items:center;margin-top:4px;font-size:11px;color:var(--muted)}
.legend-pager button{border:1px solid var(--line);background:var(--card);border-radius:6px;padding:1px 7px;font-size:11px;cursor:pointer}
ul.items{list-style:none;margin:0;padding:0}
ul.items li{display:flex;align-items:center;gap:10px}
ul.items li:last-child{border-bottom:0}
ul.items .name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.secret{padding:12px;margin-top:8px;word-break:break-all;font-family:ui-monospace,monospace}
.modal{position:fixed;inset:0;place-items:center;overflow-y:auto}
.modal .card{position:relative;width:100%;margin:0;max-height:calc(100vh - 40px);overflow:hidden;display:flex;flex-direction:column}
#modal-body{overflow-y:auto;min-height:0;flex:1 1 auto;padding-right:4px;scrollbar-width:thin;scrollbar-color:#cbd5e1 transparent}
#modal-body::-webkit-scrollbar{width:8px}
#modal-body::-webkit-scrollbar-track{background:transparent}
#modal-body::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px;border:2px solid transparent;background-clip:padding-box}
.modal-x{border:0;cursor:pointer}
.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(12px);z-index:60;opacity:0;pointer-events:none;max-width:calc(100vw - 32px)}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.chart-tip{position:fixed;z-index:70;pointer-events:none;color:#fff;padding:6px 9px;line-height:1.4;opacity:0;transform:translateY(4px);transition:opacity var(--dur-fade) var(--ease),transform var(--dur-fade) var(--ease)}
.chart-tip.show{opacity:1;transform:translateY(0);animation:tipShake var(--dur-base) var(--ease)}
@keyframes tipShake{0%,100%{margin-left:0}25%{margin-left:2px}75%{margin-left:-2px}}
.donut-seg{cursor:pointer;transition:stroke-width var(--dur-fade) var(--ease),opacity var(--dur-fade) var(--ease)}
.donut-seg:hover,.donut-seg.active{stroke-width:25;opacity:1!important}
.modal .secret{max-height:120px;overflow:auto}
@media(max-width:620px){
.user .email{display:none}
}
@media(max-width:720px){
nav{overflow-x:auto;padding-bottom:2px}
.user-wrap{margin-left:0}
.row>*{min-width:100%}
.row button{width:100%}
.chart{overflow-x:auto}
}
:root{/* surfaces */
  --bg-grouped:#F2F2F7;--tabbar-bg:#F7F7F8;/* labels */
  --label:#000000;/* separators and fills */
  --separator:rgba(60,60,67,.29);/* system colours */
  --blue:#007AFF;--mix-icon:14%;--mix-badge:15%;--mix-tint:12%;/* aliases kept so older rules keep resolving */
  --bg:var(--bg-grouped);--kpi-bg:var(--card);/* type */
  --font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display","Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;--lh-body-lg:22px;--lh-sub:18px;--text-tab:10px;/* space */
  --sp-1:4px;--sp-2:8px;--sp-3:12px;--sp-4:16px;--sp-5:20px;--sp-6:24px;--sp-7:32px;/* radius */
  --r-sm:4px;--r-md:8px;--r-lg:12px;--r-xl:16px;/* structure + motion */
  --nav-h:44px;--row-h:52px;--tabbar-h:62px;--ease:cubic-bezier(.2,.7,.3,1);--dur-fade:120ms;--dur-base:200ms;--dur-push:280ms;--dur-sheet:280ms}
html[data-theme="dark"]{--tabbar-bg:#161618;--blue:#0A84FF;--green:#30D158;--orange:#FF9F0A;--red:#FF453A;--purple:#BF5AF2;--mix-icon:26%;--mix-badge:24%;--mix-tint:20%;--kpi-bg:var(--card);--ios-shadow:none}
body{-webkit-font-smoothing:antialiased}
html[data-theme="dark"] body{background:var(--bg-grouped);color:var(--label)}
html[data-theme="dark"] .card,html[data-theme="dark"] .kpi,html[data-theme="dark"] .ios-card,html[data-theme="dark"] .account-menu,html[data-theme="dark"] .donut-center,html[data-theme="dark"] #global-search-results{background:var(--card);box-shadow:none}
html[data-theme="dark"] tbody tr:hover td{background:transparent}
html[data-theme="dark"] .seg{background:var(--fill)}
input[type=checkbox]{appearance:none;-webkit-appearance:none;width:22px;height:22px;border:1.5px solid var(--separator);border-radius:50%;background:transparent;min-height:0;padding:0;flex:0 0 auto;display:inline-grid;place-items:center;transition:background var(--dur-fade) var(--ease),border-color var(--dur-fade) var(--ease)}
input[type=checkbox]:checked{background:var(--blue);border-color:var(--blue)}
input[type=checkbox]:checked::after{content:"";width:6px;height:11px;border:2px solid #fff;border-top:0;border-left:0;transform:translateY(-1.5px) rotate(40deg)}
input[type=checkbox]:disabled{opacity:.4}
input[type=checkbox]:focus{box-shadow:none}
h1{font-size:var(--text-title);line-height:var(--lh-title);font-weight:700;letter-spacing:-.4px}
.badge{background:color-mix(in srgb,var(--blue) var(--mix-badge),transparent);color:var(--brand-text);font-size:var(--text-caption);padding:2px var(--sp-2);border-radius:999px}
nav{margin-left:var(--sp-2)}
.theme-cycle,.icon-btn{color:var(--label-2);border-radius:var(--r-md)}
.theme-cycle:hover,.icon-btn:hover{background:var(--fill)}
.avatar{background:var(--fill);border:0;color:var(--label)}
.account-menu{background:var(--card);border:0;border-radius:var(--r-lg);box-shadow:0 12px 32px rgba(0,0,0,.24);padding:var(--sp-1)}
.account-menu button{font-size:var(--text-body);padding:10px 12px;border-radius:var(--r-md)}
.account-menu button:hover{background:var(--fill)}
input::placeholder,textarea::placeholder{color:var(--label-3)}
input:focus,select:focus,textarea:focus{border:0}
button{padding:10px 16px;background:var(--fill);color:var(--label);transition:background-color var(--dur-fade) var(--ease),color var(--dur-fade) var(--ease),transform var(--dur-fade) var(--ease),opacity var(--dur-fade) var(--ease)}
button:active{transform:scale(.97)}
button.small{border-radius:var(--r-md)}
.link-button{border-radius:var(--r-md);font-size:var(--text-body-lg);padding:10px 16px}
.link-button.primary{background:var(--brand-strong);color:#fff}
.seg{background:var(--fill);border:0;border-radius:9px;padding:2px;gap:2px}
#globe-range{display:flex;align-items:center;gap:2px;flex:0 1 auto;min-width:0}
#globe-range button{flex:0 0 auto;width:auto;min-width:0;padding:6px 10px}
.seg button{background:transparent;color:var(--label);padding:6px 12px;font-size:var(--text-sub);border-radius:7px;font-weight:500;transition:background-color var(--dur-fade) var(--ease),color var(--dur-fade) var(--ease),transform var(--dur-fade) var(--ease)}
.seg button:hover{background:var(--surface-2)}
.seg button:active{background:var(--fill-2)}
.seg button.on{background:var(--card);color:var(--label);box-shadow:0 3px 8px rgba(0,0,0,.12)}
html[data-theme="dark"] .seg button.on{background:#636366}
html[data-theme="dark"] .seg--vert{background:transparent}
html[data-theme="dark"] .globe-side .globe-pause{background:transparent;border:0}
table{font-size:var(--text-body);border-collapse:separate;border-spacing:0}
th{font-size:var(--text-sub);font-weight:400;color:var(--label-2);padding:var(--sp-2) var(--sp-3);border-bottom:1px solid var(--separator)}
td{padding:var(--sp-3);border-bottom:1px solid var(--separator);font-size:var(--text-body)}
tr:last-child td{border-bottom:0}
tbody tr:hover td{background:transparent}
tbody tr:active td{background:var(--fill-2)}
.pill{background:color-mix(in srgb,var(--green) var(--mix-badge),transparent);color:var(--green);font-size:var(--text-caption);padding:2px var(--sp-2);border-radius:999px}
.pill:hover{filter:brightness(.96)}
.pill.off{background:var(--fill);color:var(--label-2)}
.kind-tag{border:0;margin-left:var(--sp-2)}
.kind-api{background:color-mix(in srgb,var(--green) var(--mix-badge),transparent);color:var(--green)}
.kind-web{background:color-mix(in srgb,var(--blue) var(--mix-badge),transparent);color:var(--brand-text)}
.kind-none{background:color-mix(in srgb,var(--orange) var(--mix-badge),transparent);color:var(--orange)}
html[data-theme="dark"] .kind-api,html[data-theme="dark"] .kind-web,html[data-theme="dark"] .kind-none{border:0}
.kpi .value{margin-top:2px}
.agent-stat{background:var(--card);border:0;border-radius:var(--r-lg);box-shadow:var(--ios-shadow)}
.agent-stat b{font-size:19px;font-weight:700}
.agent-stat span{font-size:var(--text-sub);color:var(--label-2)}
.secret{background:var(--fill-2);color:var(--label);border-radius:var(--r-md);font-size:var(--text-sub)}
.modal{background:rgba(0,0,0,.4);padding:var(--sp-5);z-index:80;display:flex;align-items:center;justify-content:center}
.modal .card{max-width:620px;border-radius:var(--r-xl);padding:var(--sp-4) var(--sp-4) var(--sp-5);box-shadow:0 24px 60px rgba(0,0,0,.28)}
#modal-body{border-radius:var(--r-lg)}
.modal .card .hint{font-size:var(--text-caption)}
.modal .table-wrap table{min-width:0}
.modal .table-wrap th,.modal .table-wrap td{padding:var(--sp-2);font-size:var(--text-sub)}
.modal-x{position:absolute;top:var(--sp-3);right:var(--sp-3);width:32px;height:32px;display:grid;place-items:center;background:var(--fill);color:var(--label-2);border-radius:999px;font-size:17px;line-height:1;padding:0;margin:0;float:none;z-index:3}
.modal .card{padding-top:var(--sp-5)}
.modal .card>h2{padding-right:44px}
.toast{background:rgba(28,28,30,.92);color:#fff;border-radius:999px;padding:12px 18px;font-size:var(--text-body);box-shadow:0 10px 30px rgba(0,0,0,.28);transition:opacity var(--dur-fade) var(--ease),transform var(--dur-fade) var(--ease)}
.toast.error{background:var(--red)}
.chart-tip{background:rgba(28,28,30,.92);border-radius:var(--r-md);font-size:var(--text-caption);box-shadow:0 8px 22px rgba(0,0,0,.28)}
.status{font-size:var(--text-sub);color:var(--label-2)}
.error{color:var(--red)}
.ok{color:var(--green)}
.app-version{text-align:center;font-size:var(--text-caption);line-height:18px;color:var(--label-3);padding:14px 0 0}
.about-row{display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid var(--separator);font-size:var(--text-sub)}
.about-row span{color:var(--label-2);flex:0 0 auto}
.about-row b{font-weight:600;color:var(--label);text-align:right;word-break:break-all;font-variant-numeric:tabular-nums}
.extend-error{margin-top:12px;padding:10px 12px;border-radius:var(--r-md);font-size:var(--text-sub);line-height:18px;color:var(--red);background:color-mix(in srgb,var(--red) 10%,transparent);border:1px solid color-mix(in srgb,var(--red) 30%,transparent)}
ul.items li{border-bottom:1px solid var(--separator);padding:12px 0}
ul.items .name{font-weight:600;font-size:var(--text-body-lg)}
ul.items .type{font-size:var(--text-caption);color:var(--label-2)}
.gs-row{border-radius:var(--r-md);font-size:var(--text-body)}
.gs-row:hover,.gs-row:focus-visible{background:var(--fill-2)}
.gs-group-title{font-size:var(--text-caption);color:var(--label-2);text-transform:none}
#global-search-results{background:var(--card);border:0;border-radius:var(--r-lg);padding:var(--sp-2)}
@media(max-width:720px){
body{padding-bottom:calc(var(--tabbar-h) + 14px + env(safe-area-inset-bottom))}
nav{position:fixed;left:0;right:0;bottom:0;z-index:50;order:0;width:auto;justify-content:space-around;min-height:var(--tabbar-h);-webkit-backdrop-filter:blur(20px) saturate(180%);backdrop-filter:blur(20px) saturate(180%);border-top:1px solid var(--separator);overflow:visible}
nav button{flex:1 1 0;justify-content:center;min-height:var(--nav-h);background:transparent !important;box-shadow:none !important}
nav .icon-btn{flex:1 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:var(--nav-h);padding:2px 0;font-size:var(--text-tab);font-weight:500;color:var(--label-2);background:transparent !important;box-shadow:none !important;border-radius:0}
nav button.active{background:transparent !important;box-shadow:none !important}
header{margin-bottom:var(--sp-3)}
.modal{display:flex;align-items:flex-end;justify-content:stretch;padding:0;overflow:hidden}
.modal .card{max-width:none;width:100%;max-height:92vh;border-radius:var(--r-xl) var(--r-xl) 0 0;padding:var(--sp-4) var(--sp-4) calc(var(--sp-5) + env(safe-area-inset-bottom));box-shadow:0 -8px 40px rgba(0,0,0,.28)}
.toast{bottom:calc(var(--tabbar-h) + var(--sp-4))}
td{padding:var(--sp-2) var(--sp-2)}
th{padding:6px var(--sp-2)}
}
@media (prefers-reduced-motion: reduce){
*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important;scroll-behavior:auto !important}
}
.ios-group{--ios-lead:0px}
.ios-group.selecting{--ios-lead:34px}
.ios-group:not(.selecting) .ios-check{display:none}
.ios-group-head{display:flex;align-items:center;gap:var(--sp-2)}
.ios-card{overflow:hidden}
.ios-row{display:flex;align-items:center;position:relative}
.ios-row+.ios-row::before{content:"";position:absolute;right:0;top:0;height:1px;background:var(--separator)}
.ios-row:active{background:var(--fill-2);transform:translateY(1px)}
.ios-check{width:20px;height:20px;flex:0 0 auto;accent-color:var(--blue);min-height:0}
.ios-ico{display:grid;place-items:center;flex:0 0 auto}
.ios-ico[data-kind=api]{background:color-mix(in srgb,var(--blue) var(--mix-icon),transparent);color:var(--blue)}
.ios-ico[data-kind=web]{background:color-mix(in srgb,var(--purple) var(--mix-icon),transparent);color:var(--purple)}
.ios-ico[data-kind=none]{background:color-mix(in srgb,var(--orange) var(--mix-icon),transparent);color:var(--orange)}
.ios-main{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px;cursor:pointer;padding:var(--sp-1) 0;border-radius:var(--r-md)}
.ios-title{display:flex;align-items:center;min-width:0;gap:var(--sp-1)}
.ios-title b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ios-title .kind-tag{margin-left:0;flex:0 0 auto}
.ios-sub{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ios-trail{display:flex;align-items:center;gap:var(--sp-1);flex:0 0 auto}
.ios-pill{border-radius:999px}
.ios-sub .ios-expired{color:var(--red);font-weight:500}
.ios-sub .ios-soon{color:var(--orange);font-weight:500}
.ios-sub .ios-rotate{color:var(--muted);opacity:.85}
.pick-list{border:1px solid var(--separator);border-radius:var(--r-md);overflow:hidden;margin-bottom:var(--sp-3)}
.pick-row{display:flex;align-items:center;gap:var(--sp-3);min-height:var(--row-h);padding:0 var(--sp-3);font-size:var(--text-body-lg);color:var(--label)}
.pick-row+.pick-row{border-top:1px solid var(--separator)}
.pick-row .ios-check{flex:0 0 auto}
.ios-pill.ok{background:color-mix(in srgb,var(--green) var(--mix-badge),transparent);color:var(--green)}
button.ios-pill{border:0;cursor:pointer;min-width:0}
.ios-pill.plain{color:var(--brand-text)}
.pm-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
#modal > .card.pm-wide{width:min(1180px,calc(100vw - 24px));max-width:none}
.pm-table{min-width:680px;border-collapse:collapse;font-size:var(--text-caption)}
.pm-table th,.pm-table td{padding:7px 9px;border-bottom:1px solid var(--line);text-align:left;white-space:nowrap}
.pm-table th{position:sticky;top:0;background:var(--card);z-index:1;font-weight:600}
.pm-table tbody tr:last-child td{border-bottom:0}
.pm-cell{cursor:pointer;min-width:96px}
.pm-cell:hover{background:var(--btn)}
.pm-cell[aria-disabled="true"]{cursor:default}
.pm-legend{display:flex;gap:12px;flex-wrap:wrap;font-size:var(--text-caption);color:var(--label-2);margin-top:10px}
.pm-detail-row{display:flex;gap:8px;align-items:center;justify-content:space-between;padding:8px 0;border-top:1px solid var(--line);flex-wrap:wrap}
.pm-detail-row:first-child{border-top:0}
.pm-detail-meta{display:flex;gap:6px;align-items:center;flex-wrap:wrap;min-width:0}
.pm-sub{color:var(--label-2);font-size:var(--text-caption)}
.pm-agent{display:flex;flex-direction:column;gap:2px}
.pm-agent b{font-weight:600}
.ios-title .ios-name{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ios-flag{font-size:var(--text-caption);padding:2px 8px;border-radius:999px}
.ios-flag.bad{background:color-mix(in srgb,var(--red) var(--mix-badge),transparent)}
.ios-flag.warn{background:color-mix(in srgb,var(--orange) var(--mix-badge),transparent)}
.ios-row--stack{align-items:flex-start}
.ios-row--log{align-items:flex-start;min-height:0;padding-top:var(--sp-2);padding-bottom:var(--sp-2)}
.ios-log-time{font-size:var(--text-caption);color:var(--label-3);font-variant-numeric:tabular-nums}
.ios-log-text{font-size:var(--text-body);line-height:var(--lh-body);color:var(--label)}
.ios-log-text.bad{color:var(--red)}
.ios-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:var(--sp-2)}
.ios-chip{font-size:var(--text-sub);border-radius:var(--r-md);background:var(--fill);color:var(--brand-text);border:0;font-weight:500}
.ios-actions .ios-chip:first-child{background:var(--brand-strong);color:#fff}
.ios-more{width:44px;height:44px;display:grid;place-items:center;background:transparent;color:var(--label-3);font-size:18px;padding:0;border-radius:var(--r-md)}
.ios-more:hover{background:var(--fill-2);color:var(--label-2)}
nav button svg{fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
nav button{display:inline-flex;align-items:center;gap:6px}
.page{position:fixed;inset:0;z-index:70;display:flex;flex-direction:column;transform:translateX(100%);transition:transform var(--dur-push) var(--ease);will-change:transform}
.page.in{transform:translateX(0)}
.page-nav{flex:0 0 auto;display:flex;align-items:center;position:relative}
.page-title{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.page-back{display:flex;align-items:center;gap:2px;background:none;border:0;padding:0}
.page-action{display:flex;align-items:center;gap:2px}
.page-back svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.page-action{justify-content:flex-end}
.page-close{display:none;align-items:center;justify-content:center;width:30px;height:30px;flex:0 0 auto;border:0;border-radius:50%;background:var(--fill);color:var(--label-2);padding:0}
.page-close svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round}
.page-body{flex:1 1 auto;min-height:0;overflow-y:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.page-body>.card{margin:0 auto}
body.page-open{overflow:hidden}
@media (min-width:1000px){
body.page-open{overflow:auto}
body.page-open #item-page{left:auto;right:0;width:min(680px,54vw);border-left:1px solid var(--separator);box-shadow:-1px 0 30px rgba(0,0,0,.07)}
body.page-open .page-back{visibility:hidden;pointer-events:none}
body.page-open #item-page-close{display:flex}
body.page-open .wrap{max-width:none;padding-right:calc(min(680px,54vw) + var(--sp-3))}
body.page-open #view-items .row{display:flex;flex-wrap:wrap;gap:var(--sp-2);align-items:center}
body.page-open #view-items .row>input{flex:1 1 100%;min-width:0}
body.page-open #view-items .row>#item-filter{flex:0 0 auto}
body.page-open #view-items .row>button{min-width:0;padding:0 var(--sp-2);font-size:var(--text-body)}
}
.kv>span{flex:0 0 auto}
.kv>b{margin-left:auto;text-overflow:ellipsis}
.card.edit-only{display:none}
.ios-field{display:flex;align-items:center;gap:var(--sp-3);min-height:var(--row-h);padding:0 var(--sp-4);border-bottom:1px solid var(--separator)}
.ios-field:last-child{border-bottom:0}
.card>.ios-field{margin:0 calc(-1 * var(--sp-4))}
.ios-head{display:flex;align-items:center;justify-content:space-between;gap:var(--sp-2)}
.ios-field>label{flex:1 1 auto;min-width:0;font-size:var(--text-body-lg);color:var(--label)}
.ios-field>label small{display:block;font-size:var(--text-sub);line-height:var(--lh-sub);color:var(--label-2);margin-top:1px}
.ios-field>select{flex:0 1 auto;max-width:60%;text-align:right;background:transparent;border:0;padding:0;font-size:var(--text-body-lg);appearance:none}
.ios-field>input[type="date"]{flex:0 1 auto;max-width:60%;text-align:right;background:transparent;border:0;padding:0;font-size:var(--text-body-lg);color:var(--label-2);appearance:none}
html[data-theme="dark"] .ios-field>select,html[data-theme="dark"] .ios-field>input[type="date"]{background-color:transparent;border:0;color:var(--brand-text)}
html[data-theme="dark"] .ios-field>select{background-repeat:no-repeat;background-position:right center;background-size:9px 9px;background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238e8e93' stroke-width='2.6' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")}
.ios-field>select{color:var(--brand-text);padding-right:18px;background-repeat:no-repeat;background-position:right center;background-size:9px 9px;background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2.6' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")}
.ios-field--stack{display:block;padding-top:var(--sp-3);padding-bottom:var(--sp-3)}
.ios-field--stack textarea{width:100%;margin-top:var(--sp-2);min-height:74px}
input.ios-switch{appearance:none;-webkit-appearance:none;flex:0 0 auto;width:51px;height:31px;min-width:51px;border:0;border-radius:16px;background:var(--fill-2);position:relative;transition:background var(--dur-fade) var(--ease);cursor:pointer;margin:0;padding:0}
input.ios-switch::after{content:"";position:absolute;top:2px;left:2px;width:27px;height:27px;border-radius:50%;background:#fff;border:0;box-shadow:0 2px 5px rgba(0,0,0,.22);transform:none;transition:transform var(--dur-fade) var(--ease)}
input.ios-switch:checked{background:var(--green);border-color:var(--green)}
input.ios-switch:checked::after{transform:translateX(20px);border:0}
.page .row>button{flex:1 1 auto;min-width:0;font-weight:500}
.page .row>button.primary{background:var(--brand-strong);color:#fff}
.page .row>button.danger{background:color-mix(in srgb,var(--red) var(--mix-badge),var(--card));color:var(--red)}
html[data-theme="dark"] .page .row>button.danger{background:color-mix(in srgb,var(--red) 16%,var(--card))}
.page .row>button:not(.primary):not(.danger){background:var(--fill);color:var(--label)}
.page[data-editing="true"] .card.edit-only{display:block}
.hdr-actions{margin-left:auto}
.hdr-actions .small{font-size:var(--text-sub);padding:6px 12px}
.theme-cycle{width:36px;height:36px;display:grid;place-items:center;font-size:16px;background:transparent}
@media(max-width:720px){
header{flex-wrap:nowrap}
header h1{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
h1{font-size:22px;line-height:28px}
header .badge{display:none}
.brand #header-version{display:inline-block;background:transparent;border:0;padding:0 0 0 4px;font-size:11px;color:var(--label-2);font-variant-numeric:tabular-nums}
.hdr-actions #ai-help,.hdr-actions .icon-btn,.hdr-actions #page-refresh{display:none}
.hdr-actions .small{font-size:var(--text-caption);padding:6px 10px;min-height:36px}
}
#view-items .row{align-items:center}
#view-items .row>button{flex:0 0 auto;min-width:0}
@media(max-width:720px){
.hdr-actions .who-name,.user .who-name{display:none}
}
@media(max-width:720px){
nav button{flex-direction:column;gap:3px}
nav button svg{display:block;width:22px;height:22px;stroke-width:1.7}
#globe-range{flex:1 1 100%;justify-content:space-between}
#view-agents .row>select,#view-logs .row>select{width:auto;flex:1 1 0;min-width:0}
#view-logs .row>input{flex:1 1 100%}
#view-logs .row>button{flex:1 1 100%}
.grid3>.card{height:auto}
.grid3 .trend-box{flex:0 0 auto}
.ios-trail .ios-pill.plain{display:none}
#view-items .row{gap:6px}
#view-items .row button{width:auto;flex:0 0 auto;padding:8px 11px;font-size:var(--text-body);min-height:38px}
#view-items .row>*{min-width:0}
#view-items .row input#item-filter{flex:1 1 100%;width:100%}
.ios-flag{display:none}
}
.ov-head{display:flex;justify-content:space-between;gap:var(--sp-3);flex-wrap:wrap}
#updated{margin-top:2px}
.ov-controls{display:flex;align-items:center;justify-content:flex-end;gap:var(--sp-2);flex:1 1 260px;margin-bottom:var(--sp-3)}
.ov-search{margin:0;flex:1 1 180px;max-width:320px;min-width:0}
.card-head{display:flex;align-items:center;justify-content:space-between;gap:var(--sp-2)}
.trend-nav{display:flex;align-items:center;gap:2px;flex:0 0 auto}
.trend-arrow{width:28px;height:28px;min-height:0;padding:0;border:0;border-radius:50%;background:var(--fill);color:var(--label-2);font-size:15px;line-height:1;display:grid;place-items:center;cursor:pointer}
.trend-arrow:hover{color:var(--label)}
.trend-count{font-size:11px;font-variant-numeric:tabular-nums;min-width:22px;text-align:center}
.heat{display:grid;grid-template-columns:44px repeat(24,minmax(0,1fr));gap:3px;align-items:center}
.heat__corner{grid-column:1}
.heat__hour{font-size:10px;color:var(--label-3);text-align:center;font-variant-numeric:tabular-nums}
.heat__day{font-size:12px;color:var(--label-2);padding-right:6px;text-align:right}
.heat__cell{height:auto;min-height:14px;aspect-ratio:1;border-radius:4px;background:var(--fill);display:grid;place-items:center;font-size:10px;color:#fff;font-weight:600}
.heat__legend{display:flex;align-items:center;gap:5px;margin-top:10px;font-size:11px;color:var(--label-2)}
.heat__legend i{width:12px;height:12px;border-radius:3px;display:block}
.heat__total{margin-left:auto}
.aa-pick{width:34px;padding-right:0}
.aa-pick .ios-check{display:inline-grid;vertical-align:middle}
.health-item{display:flex;flex-direction:column}
.health-row .health-chev{color:var(--label-3);font-size:15px;transition:transform var(--dur-base) var(--ease)}
.health-row.open .health-chev{transform:rotate(90deg)}
.health{max-height:198px;overflow-y:auto;gap:0}
.health-row{box-sizing:border-box;display:flex;align-items:center;gap:var(--sp-2);min-height:36px;padding:3px 0;grid-template-columns:none;border-radius:var(--r-md);transition:background-color var(--dur-fade) var(--ease),transform var(--dur-fade) var(--ease)}
.health-row:hover{background:var(--surface-2)}
.health-row:active{background:var(--fill-2);transform:scale(.99)}
.health-bar{flex:0 0 40px;height:5px;grid-column:auto;grid-row:auto}
.health-label{flex:0 0 auto;grid-column:auto;grid-row:auto;font-size:var(--text-body)}
.health-hint{flex:1 1 auto;grid-column:auto;grid-row:auto;font-size:var(--text-caption);color:var(--label-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.health-value{flex:0 0 auto;margin-left:auto;grid-column:auto;grid-row:auto;font-size:var(--text-body-lg);font-variant-numeric:tabular-nums}
.health-row .health-chev{grid-column:auto;grid-row:auto;flex:0 0 12px}
.health-list{display:flex;flex-direction:column;padding:0 0 var(--sp-2) 0}
.health-cred{display:flex;align-items:baseline;gap:var(--sp-2);background:none;border:0;border-top:1px solid var(--separator);padding:6px 0 6px 52px;font:inherit;font-size:var(--text-sub);color:inherit;text-align:left;cursor:pointer}
.health-cred:hover{color:var(--brand-text)}
.health-cred b{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.health-cred span{color:var(--label-2);font-size:var(--text-caption);flex:0 0 auto;margin-left:auto}
.health-more{padding:6px 0 6px 52px;font-size:var(--text-caption);color:var(--label-2)}
@media(max-width:720px){
.health-row{grid-template-columns:40px 1fr auto 12px}
}
.ask{position:fixed;left:0;right:0;bottom:0;z-index:120;display:flex;flex-direction:column;gap:var(--sp-3);padding:var(--sp-4) var(--sp-4) calc(var(--sp-4) + env(safe-area-inset-bottom));background:var(--card);border-top:1px solid var(--separator);box-shadow:0 -8px 32px rgba(0,0,0,.18);animation:ask-in var(--dur-push) var(--ease)}
@keyframes ask-in{from{transform:translateY(100%)}to{transform:translateY(0)}}
.ask__text{font-size:var(--text-body);color:var(--label);line-height:1.4}
.ask__row{display:flex;gap:var(--sp-2)}
.ask__row button{flex:1 1 0;min-height:44px;border-radius:var(--r-md);border:0;font-size:var(--text-body);font-weight:500;background:var(--fill);color:var(--label)}
.ask__row button.ask__yes{background:var(--red);color:#fff}
@media(min-width:721px){
.ask{left:50%;right:auto;bottom:24px;transform:translateX(-50%);width:420px;border:1px solid var(--separator);border-radius:var(--r-lg);box-shadow:0 12px 40px rgba(0,0,0,.22);animation:none}
}
@media(max-width:720px){
.ask{bottom:calc(var(--tabbar-h) + env(safe-area-inset-bottom))}
}
.ov-action{display:flex;align-items:center;justify-content:space-between;gap:var(--sp-3)}
.ov-action>div{min-width:0}
.ov-action button{flex:0 0 auto;white-space:nowrap}
.ov-pair{margin-bottom:var(--sp-3)}
#globe-card .globe-box{height:150px}
.dash #globe-card{display:flex;flex-direction:column;min-height:0}
.globe-split{display:flex;align-items:center;gap:var(--sp-3);flex:1 1 auto;min-height:0;margin-top:var(--sp-2)}
#globe-card.globe-off .globe-side,#globe-card.globe-off #globe-open,#globe-card.globe-off #globe-full{display:none}
.globe-still{position:absolute;inset:0;z-index:1;display:flex;align-items:center;justify-content:center;border-radius:12px;overflow:hidden}
#globe-card.globe-live .globe-still{display:none}
.globe-still img{width:128px;height:128px;border-radius:50%;object-fit:cover;object-position:50% 45%;box-shadow:0 10px 24px rgba(8,20,40,.26),inset 0 0 0 1px rgba(255,255,255,.1)}
html[data-theme="dark"] .globe-still img{filter:brightness(.86) saturate(.95)}
.globe-cap{margin-top:auto;padding-top:6px;border-top:1px solid var(--separator);font-size:var(--text-caption);color:var(--label-2);display:flex;flex-wrap:wrap;gap:2px 8px;min-height:16px}
.dash #globe-card .globe-split .globe-box{width:196px;height:140px;flex:0 0 auto;min-height:0;margin:0}
.globe-side{display:flex;flex-direction:column;justify-content:center;align-items:flex-end;gap:4px;min-width:0;flex:1 1 auto;height:140px}
.seg--vert{flex-direction:column;gap:2px;width:92px;max-width:100%;flex:0 0 auto;background:transparent;padding:0}
.seg--vert button{width:100%;min-width:0;min-height:24px;padding:2px 8px;font-size:var(--text-sub);line-height:18px;text-align:center}
.globe-side .globe-pause{width:92px;max-width:100%;margin:0;min-height:26px;padding:2px 8px;font-size:var(--text-sub);background:transparent;border:0;box-shadow:none;color:var(--label-2)}
.globe-side .globe-pause:hover{color:var(--label);background:transparent}
.dash #globe-card>#globe-status{margin:var(--sp-2) 0 0;font-size:11px;line-height:1.3}
.dash #globe-card .globe-box{flex:1 1 0;height:auto;min-height:0}
.dash #globe-card{overflow:hidden}
.dash .trend-box svg{height:130px}
.dash>#ov-actions>.health{margin:auto 0}
.dash>#ov-actions .health-row:first-child{border-top:1px solid var(--separator)}
.dash>.card>#donut-box{margin:auto 0}
.dash>#globe-card .globe-split{margin:auto 0}
.dash #chart-box svg{display:block;width:100%;height:auto}
.dash .span2{grid-column:span 2}
.dash .span3{grid-column:span 3}
.dash .trend-box{height:auto}
.dash .rank-box{overflow:auto}
.dash .rank{gap:10px}
.dash #recent-box{overflow-y:auto}
@media(max-width:900px){
.dash .span2,.dash .span3{grid-column:auto}
}
.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:stretch}
.kpi{display:flex;flex-direction:column;justify-content:space-between}
.kpi-spark{display:flex;align-items:flex-end;gap:2px;height:22px;margin:6px 0}
.kpi-spark i{flex:1 1 0;background:color-mix(in srgb,var(--blue) 55%,transparent);border-radius:2px;min-width:2px}
.rank{display:flex;flex-direction:column;gap:var(--sp-3)}
.rank__head{display:flex;justify-content:space-between;gap:var(--sp-3);font-size:var(--text-body)}
.rank__name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rank__count{color:var(--label-2);flex:0 0 auto}
.rank__track{height:6px;border-radius:3px;background:var(--fill);margin-top:6px;overflow:hidden}
.rank__fill{height:100%;border-radius:3px;background:var(--blue)}
@media(max-width:720px){
#globe-card .globe-box{height:160px;min-height:0}
}
@media(max-width:720px){
.ov-controls{flex:1 1 100%;flex-wrap:wrap;justify-content:flex-start}
.ov-controls .seg{flex:1 1 100%}
.ov-search{flex:1 1 100%;max-width:none}
}
@media(max-width:720px){
.kpi-spark{height:16px;margin:4px 0}
}
:root{--danger-soft:color-mix(in srgb,var(--red,#c0281f) 12%,transparent);--state-bg:var(--fill-2);/* System orange is a fill colour, not a text colour: at 13px on white it
     misses 4.5:1. These are the readable versions of the same hues. */
  --warn-text:#8a5a00}
html[data-theme="dark"]{--danger-soft:color-mix(in srgb,var(--red,#ff453a) 24%,transparent);--state-bg:#1c1c1e}
html{color-scheme:light}
html[data-theme="dark"]{color-scheme:dark}
.sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.trend-count,.heat-hours,.health-chev{color:var(--label-muted)}
.rank__count,.ios-pill{font-variant-numeric:tabular-nums}
button.primary{border-color:transparent}
button.danger{border-color:transparent}
button.danger:hover{background:color-mix(in srgb,var(--red,#c0281f) 18%,transparent)}
.ios-chip{min-height:40px;padding:0 14px}
.ios-chip.primary{background:var(--brand-strong);color:#fff}
.ios-chip.danger{background:var(--danger-soft);color:var(--danger-text)}
@media(pointer:coarse){
.ios-chip{min-height:44px}
}
#view-items .row>#item-filter{width:auto;flex:1 1 220px;min-width:170px}
button:focus-visible,a:focus-visible,select:focus-visible,textarea:focus-visible,input:focus-visible,[tabindex]:focus-visible,.ios-main:focus-visible,.kpi:focus-visible,.health-row:focus-visible,.aging-row-btn:focus-visible,.legend div:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.ask__code{display:block;width:100%;box-sizing:border-box;margin:10px 0;padding:10px 12px;border:1px solid var(--line);border-radius:10px;font-size:15px;background:var(--card);color:var(--label)}
.state__title{letter-spacing:-.01em}
.deny__title{margin-top:6px;font-size:14px;font-weight:600;color:var(--label)}
.deny-reason{display:flex;flex-wrap:wrap;gap:6px;align-items:baseline;margin-top:4px;font-size:13px;line-height:1.5;color:var(--label-2)}
.deny-reason b{color:var(--label);font-weight:600}
.deny[data-kind="not-in-scope"] .deny-reason b{color:var(--warn-text)}
.deny[data-kind="item-not-found"] .deny-reason b{color:var(--danger-text)}
#denied-list .ios-main{cursor:default}
.ios-flag.bad{color:var(--danger-text)}
.ios-flag.warn{color:var(--warn-text)}
html[data-theme="dark"] .notice-bar[data-level="warning"]{background:color-mix(in srgb,#c98a00 20%,transparent);color:#f3d08a}
html[data-theme="dark"] .notice-bar[data-level="notice"]{background:color-mix(in srgb,var(--blue) 20%,transparent);color:#c3d7ff}
.card>h2{margin-bottom:4px}
.table-wrap thead th{position:sticky;top:0;z-index:1;background:var(--card)}
.status{line-height:1.45}
.status.error{color:var(--danger-text)}
.status.ok{color:var(--ok-text)}
.page-state{display:flex;align-items:center;gap:8px;min-height:0;padding:6px var(--sp-3);font-size:13px;line-height:1.45;color:var(--label-2)}
.page-state:empty{display:none}
.page-state[data-tone="dirty"]{padding:8px var(--sp-3);color:var(--warn-text);background:color-mix(in srgb,var(--orange) 12%,transparent);border-bottom:1px solid var(--separator)}
.page-state[data-tone="dirty"]::before{content:"";flex:0 0 auto;width:8px;height:8px;border-radius:50%;background:var(--orange)}
.page-back,.page-action{flex:0 0 auto;white-space:nowrap}
#items-box[data-density="compact"] .ios-row{min-height:40px;padding-block:4px;gap:8px}
#items-box[data-density="compact"] .ios-main{gap:0;padding-block:2px}
#items-box[data-density="compact"] .ios-sub{font-size:12px;line-height:15px}
#items-box[data-density="compact"] .ios-sub+.ios-sub{display:none}
@media (prefers-reduced-motion: reduce){
.page,.page-nav,.modal .card,.ask,.toast,input.ios-switch::after,.card-caret,.health-chev{transition:none !important;animation:none !important}
.page{transform:none !important}
}
:root{--ink-1:#000000;--ink-2:#48484A;--ink-3:#5C5C61;--canvas:#F2F2F7;--surface:#FFFFFF;--surface-2:#F5F5F7;--hair:#E5E5EA;--hair-strong:#D1D1D6;--brand:#007AFF;/* #007AFF is 4.0:1 on white: fills, icons and large titles only. Body-size blue text uses --brand-text. */--brand-strong:#0066CC;--brand-text:#0066CC;--brand-soft:#EAF2FF;--warn-ink:#8a5a00;--danger-ink:#b3261e;--ok-ink:#0b6b58;--t-title:34px;--lh-title:40px;--t-headline:20px;--lh-headline:26px;--t-subtitle:15px;--lh-subtitle:22px;--t-body:15px;--lh-body:20px;--t-caption:13px;--lh-caption:18px;--r-card:20px;--r-control:8px;--r-pill:999px;--shadow-1:0 1px 2px rgba(20,40,80,.04),0 8px 24px rgba(20,40,80,.04);--shadow-2:0 1px 2px rgba(20,40,80,.04),0 12px 32px rgba(20,40,80,.06);/* aliases the older layers resolve against */
  --label:var(--ink-1);--label-2:var(--ink-2);--label-3:var(--ink-3);--label-muted:var(--ink-2);--bg-grouped:var(--canvas);--bg:var(--canvas);--card:var(--surface);--card-2:var(--surface-2);--separator:var(--hair);--line:var(--hair);--fill:#eceff3;--fill-2:#f3f5f8;--blue:var(--brand);--green:#0f7a5c;--orange:#b45309;--red:#b3261e;--purple:#6d4bb8;--ok:var(--green);--warn:var(--orange);--danger:var(--red);--text:var(--ink-1);--muted:var(--ink-2);--btn:#eceff3;--accent:var(--brand);--text-title:var(--t-title);--text-headline:var(--t-headline);--text-body-lg:var(--t-subtitle);--text-body:var(--t-body);--text-sub:var(--t-caption);--text-caption:12px;--radius-card:var(--r-card);--ios-radius:var(--r-card);--ios-shadow:var(--shadow-1);--warn-text:var(--warn-ink);--danger-text:var(--danger-ink);--ok-text:var(--ok-ink)}
html[data-theme="dark"]{--ink-1:#FFFFFF;--ink-2:#AEAEB2;--ink-3:#8E8E93;--canvas:#000000;--surface:#1C1C1E;--surface-2:#2C2C2E;--hair:#38383A;--hair-strong:#48484A;--brand:#0A84FF;--brand-strong:#1F6FD0;--brand-text:#0A84FF;--brand-soft:#0B2A45;--warn-ink:#f0b45a;--danger-ink:#ff9a92;--ok-ink:#5fd8b6;--fill:#2C2C2E;--fill-2:#242426;--label:var(--ink-1);--label-2:var(--ink-2);--label-3:var(--ink-3);--label-muted:var(--ink-2);--bg-grouped:var(--canvas);--bg:var(--canvas);--card:var(--surface);--card-2:var(--surface-2);--separator:var(--hair);--line:var(--hair);--text:var(--ink-1);--muted:var(--ink-2);--btn:#2C2C2E;--ok:#5fd8b6;--warn:#f0a94a;--danger:#ff8a80;--accent:var(--brand);--warn-text:var(--warn-ink);--danger-text:var(--danger-ink);--ok-text:var(--ok-ink);--shadow-1:none;--shadow-2:0 1px 0 rgba(255,255,255,.03)}
body{background:var(--canvas);color:var(--ink-1);font:var(--t-body)/var(--lh-body) var(--font-family)}
.wrap{max-width:1200px;margin:0 auto;padding:0 28px 56px}
header{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"brand actions" "tabs tabs";align-items:center;gap:6px 18px;position:sticky;top:0;z-index:45;margin:0 0 16px;padding:6px 0 0;background:color-mix(in srgb,var(--canvas) 90%,transparent);backdrop-filter:blur(14px);border-bottom:1px solid var(--hair)}
.brand{grid-area:brand;display:flex;align-items:center;gap:10px;min-width:0}
.brand img{width:30px;height:30px;border-radius:8px;object-fit:cover}
.brand h1{font-size:20px;line-height:26px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.brand .badge{flex:0 0 auto;background:var(--brand-soft);color:var(--brand-text);border:1px solid color-mix(in srgb,var(--brand) 22%,transparent);font-size:12px;padding:2px 8px;border-radius:var(--r-pill)}
.hdr-actions{grid-area:actions;display:flex;align-items:center;gap:6px;justify-content:flex-end;flex-wrap:wrap}
nav{grid-area:tabs;display:flex;align-items:center;gap:2px;margin:0;padding:0;background:none;border-radius:0;flex-wrap:wrap}
nav button{position:relative;padding:7px 14px 9px;border-radius:0;background:transparent;color:var(--ink-2);font-size:13px;font-weight:500;line-height:18px}
nav button:hover{color:var(--ink-1);background:transparent}
nav button.active{color:var(--ink-1);background:transparent;box-shadow:none;border-bottom:2px solid var(--brand)}
html[data-theme="dark"] nav button.active{background:transparent;color:var(--ink-1)}
@media(min-width:721px){nav button svg{display:none}}
.card{border:0;border-radius:var(--r-card);box-shadow:var(--shadow-1);background:var(--surface);padding:16px;margin-bottom:16px}
.card>h2,h2{font-size:17px;line-height:24px;font-weight:600;letter-spacing:-.01em;margin:0 0 4px;color:var(--ink-1)}
.hint{font-size:13px;line-height:18px;color:var(--ink-2)}
.ov-head{align-items:center;margin-bottom:6px}
.ov-title{font-size:var(--t-title);line-height:var(--lh-title);font-weight:600;letter-spacing:-.025em;margin:0}
.ov-sub{margin-top:4px;font-size:13px;color:var(--ink-2)}
#updated{color:var(--ink-3);font-size:12px}
.kpis{grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-bottom:4px}
.kpi{min-height:96px;padding:14px 16px;border:0;border-radius:var(--r-card);box-shadow:var(--shadow-1);background:var(--surface)}
.kpi .label{font-size:12px;font-weight:500;letter-spacing:.06em;color:var(--ink-2)}
.kpi .value{font-size:30px;line-height:36px;font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.kpi .sub{font-size:13px;color:var(--ink-2)}
.kpi[data-kpi]:hover{border-color:var(--hair-strong);background:var(--surface-2);transform:none}
.dash{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:16px;align-items:stretch;margin-bottom:16px}
.dash>.card{margin:0;min-width:0}
.dash>.span2{grid-column:span 7;height:240px;min-height:240px;display:flex;flex-direction:column;overflow:hidden}
.dash .rank-card{grid-column:span 5;height:240px;min-height:240px;display:flex;flex-direction:column;overflow:hidden}
.dash #ov-actions{grid-column:span 4;height:240px;min-height:240px;overflow:hidden;padding:14px 16px}
.dash>#ov-actions{display:flex;flex-direction:column;gap:var(--sp-2)}
#ov-actions:empty{display:none}
.dash .donut-card{grid-column:span 4;height:240px;min-height:240px;display:flex;flex-direction:column;overflow:hidden}
.dash #aging-card{grid-column:span 4;height:276px;min-height:276px;display:flex;flex-direction:column;overflow:hidden}
#aging-card .card-head{flex:0 0 auto}
.aging-count{flex:0 0 auto;min-height:24px;padding:2px 9px;border:1px solid var(--hair);border-radius:999px;background:var(--surface-2);color:var(--ink-1);font-size:12px;font-weight:600;line-height:18px;font-variant-numeric:tabular-nums}
.aging-count[data-warn="1"]{background:color-mix(in srgb,var(--orange) 14%,transparent);border-color:color-mix(in srgb,var(--orange) 32%,transparent);color:var(--warn-text)}
.aging-wrap{flex:1 1 auto;min-height:0;margin-top:2px;overflow:auto;scrollbar-width:none;-ms-overflow-style:none}
.aging-wrap::-webkit-scrollbar{width:0;height:0;display:none}
.aging-table{width:100%;min-width:300px;table-layout:fixed;border-collapse:collapse;font-size:12px;font-variant-numeric:tabular-nums}
.aging-table caption{text-align:left;font-size:11px;line-height:15px;color:var(--ink-2);padding:0 0 3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aging-table th{position:sticky;top:0;z-index:1;background:var(--surface);text-align:left;font-size:11px;font-weight:600;color:var(--ink-2);padding:4px 5px;border-bottom:1px solid var(--hair);white-space:nowrap}
.aging-table th:nth-child(1){width:30%}
.aging-table th:nth-child(2){width:18%}
.aging-table th:nth-child(3){width:18%}
.aging-table th:nth-child(4){width:19%}
.aging-table th:nth-child(5){width:15%}
.aging-table th button{border:0;background:transparent;color:inherit;font:inherit;cursor:pointer;padding:0;display:inline-flex;gap:2px;align-items:center}
.aging-table th button:hover{color:var(--ink-1)}
.aging-table th[aria-sort="ascending"] button,.aging-table th[aria-sort="descending"] button{color:var(--ink-1)}
.aging-table td{padding:5px;border-bottom:1px solid var(--hair);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--ink-2)}
.aging-table tbody tr:last-child td{border-bottom:0}
.aging-table tbody tr:hover{background:var(--surface-2)}
.aging-table tbody tr:active{background:var(--fill-2)}
.aging-row-btn{border:0;background:transparent;color:var(--ink-1);font:600 12px/1.4 inherit;text-align:left;cursor:pointer;padding:0;display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aging-table tbody tr:hover .aging-row-btn{text-decoration:underline}
.aging-tag{display:inline-block;padding:1px 6px;border-radius:999px;background:var(--surface-2);color:var(--ink-2);font-size:11px;font-weight:600}
.aging-tag[data-tone="green"]{background:color-mix(in srgb,var(--green) 12%,transparent);color:var(--ok-text)}
.aging-tag[data-tone="orange"]{background:color-mix(in srgb,var(--orange) 12%,transparent);color:var(--warn-text)}
.aging-tag[data-tone="red"]{background:color-mix(in srgb,var(--red) 10%,transparent);color:var(--danger-text)}
.aging-table td.aging-msg{color:var(--ink-2);font-size:12px;line-height:17px;padding:8px 5px;white-space:normal;text-overflow:clip}
.aging-table td.aging-msg b{color:var(--ink-1);font-weight:600;display:block}
.aging-table td.aging-msg .row{margin-top:6px}
.aging-foot{flex:0 0 auto;display:flex;align-items:center;gap:8px;margin-top:4px;padding-top:5px;border-top:1px solid var(--hair)}
.aging-more{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;color:var(--ink-2)}
.dash .recent-card{grid-column:span 12}
/* Wide placement: row 1 keeps the 7/5 trend+ranking pair, row 2 is the three
   cards that fit above a 900px fold (health 5, share 3, aging table 4), and the
   feed takes the last row alone. The table used to sit in row 3, 17px below the
   fold at 1280x900; it now shares row 2 with health/share. The row is 276px so
   the table still shows three rows plus its footer, and row 1 is 220px so the
   chart is not clipped. Narrower layouts keep the auto flow, so the phone order
   stays trend, ranking, health, share, table, feed — the table never jumps to
   the top. */
@media(min-width:1101px){
.dash{gap:12px}
.dash>.span2{grid-column:span 7;grid-row:1;height:220px;min-height:220px}
.dash .rank-card{grid-column:span 5;grid-row:1;height:220px;min-height:220px}
.dash #ov-actions{grid-column:span 5;grid-row:2;height:276px;min-height:276px}
.dash .donut-card{grid-column:span 3;grid-row:2;height:276px;min-height:276px}
.dash .recent-card{grid-column:1/span 12;grid-row:3}
.dash #aging-card{grid-column:span 4;grid-row:2;height:276px;min-height:276px}
.dash #chart-box svg{height:130px}
}
.dash .rank-box{max-height:none;flex:1 1 auto;min-height:0;overflow-y:auto;scrollbar-width:none;-ms-overflow-style:none}
.dash .rank-box::-webkit-scrollbar{width:0;height:0;display:none}
.dash #ov-actions .health{max-height:170px;overflow-y:auto;scrollbar-width:none;mask-image:linear-gradient(to bottom,#000 calc(100% - 18px),transparent)}
.dash>#ov-actions .health{max-height:none;overflow:visible;mask-image:none;padding-top:0}
.dash>#ov-actions .health-row{min-height:30px;padding:0}
.dash #ov-actions .health::-webkit-scrollbar{width:0;height:0;display:none}
.dash #recent-box{max-height:288px;overflow-y:auto;scrollbar-width:none;-ms-overflow-style:none}
.dash #recent-box::-webkit-scrollbar{width:0;height:0;display:none}
.dash .trend-box{flex:1 1 auto;min-height:0}
@media(max-width:1100px){
.dash{grid-template-columns:repeat(6,minmax(0,1fr))}
.dash>.span2,.dash .rank-card{grid-column:span 6}
.dash #ov-actions,.dash .donut-card,.dash #aging-card{grid-column:span 2}
.dash .recent-card{grid-column:span 6}
}
@media(max-width:900px){
.dash{grid-template-columns:1fr}
.dash>.span2,.dash .rank-card,.dash #ov-actions,.dash .donut-card,.dash #aging-card{grid-column:auto;height:auto}
.dash .recent-card{grid-column:auto;height:auto;min-height:0}
.dash>.span2,.dash .rank-card{min-height:260px}
.dash #ov-actions,.dash .donut-card,.dash #aging-card{min-height:220px}
}
.ios-group{margin-top:24px}
.ios-group-head{padding:0 4px 8px;font-size:12px;font-weight:600;letter-spacing:.04em;color:var(--ink-2)}
.ios-card{border:1px solid var(--hair);border-radius:var(--r-card);box-shadow:var(--shadow-1);background:var(--surface)}
.ios-row{min-height:60px;padding:10px 14px;gap:12px;transition:background-color var(--dur-fade) var(--ease),transform var(--dur-fade) var(--ease)}
.ios-row+.ios-row::before{left:calc(14px + var(--ios-lead) + 36px + 12px)}
.ios-row:hover{background:var(--surface-2)}
.ios-row.current{background:var(--brand-soft)}
.ios-row.current::after{content:"";position:absolute;left:0;top:8px;bottom:8px;width:3px;border-radius:0 3px 3px 0;background:var(--brand)}
.ios-ico{width:36px;height:36px;border-radius:var(--r-control);border:1px solid var(--hair)}
.ios-title{font-size:15px;line-height:20px;font-weight:600;color:var(--ink-1)}
.ios-title b{font-weight:600}
.ios-sub{font-size:13px;line-height:18px;color:var(--ink-2)}
.ios-pill{font-size:12px;min-height:26px;padding:2px 9px;border:1px solid var(--hair);background:var(--surface-2);color:var(--ink-2);font-weight:500}
.ios-pill.on{background:color-mix(in srgb,var(--green) 14%,transparent);border-color:color-mix(in srgb,var(--green) 30%,transparent);color:var(--ok-text)}
.ios-pill.web{background:color-mix(in srgb,var(--purple) 14%,transparent);border-color:color-mix(in srgb,var(--purple) 30%,transparent);color:color-mix(in srgb,var(--purple) 80%,var(--ink-1))}
.ios-pill.bad{background:color-mix(in srgb,var(--red) 12%,transparent);border-color:color-mix(in srgb,var(--red) 28%,transparent);color:var(--danger-text)}
.ios-pill.none,.ios-pill.warn{background:color-mix(in srgb,var(--orange) 12%,transparent);border-color:color-mix(in srgb,var(--orange) 28%,transparent);color:var(--warn-text)}
.kind-tag{border-radius:var(--r-pill);padding:1px 8px;font-size:11px;font-weight:600}
.page{background:var(--canvas)}
.page-nav{height:60px;padding:0 20px;gap:12px;background:var(--surface);border-bottom:1px solid var(--hair)}
.page-title{text-align:left;font-size:20px;line-height:26px;font-weight:650;letter-spacing:-.01em;color:var(--ink-1)}
.page-back{font-size:14px;font-weight:500;color:var(--brand-text);min-height:44px;min-width:44px}
.page-action{font-size:14px;font-weight:500;min-width:44px}
.page-action{border:1px solid var(--hair);border-radius:var(--r-control);padding:0 14px;min-height:36px;background:var(--surface);color:var(--ink-1)}
.page-action:hover{background:var(--surface-2)}
.page-body{padding:20px 24px 40px}
.page-body>.card{max-width:760px;border-radius:var(--r-card);padding:20px 24px;margin-bottom:16px}
.kv{display:grid;grid-template-columns:112px minmax(0,1fr);gap:16px;align-items:start;padding:12px 0;border-bottom:1px solid var(--hair);font-size:14px;line-height:22px}
.kv:last-child{border-bottom:0}
.kv>span{color:var(--ink-2);font-size:13px;line-height:22px}
.kv>b{margin:0;text-align:right;font-weight:500;min-width:0;white-space:normal;overflow:visible;overflow-wrap:anywhere}
.kv a{color:var(--brand-text);text-decoration:none}
.kv code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px}
.page[data-editing="true"] .read-card{display:none}
.card.edit-only{border-top:2px solid var(--brand)}
.editor-zone{padding-bottom:8px}
.card.edit-only.danger-zone{display:none;align-items:center;justify-content:space-between;gap:16px;padding:14px 18px;border:1px solid color-mix(in srgb,var(--red) 30%,var(--hair));border-top:1px solid color-mix(in srgb,var(--red) 30%,var(--hair));background:color-mix(in srgb,var(--red) 6%,var(--surface));border-radius:var(--r-card)}
.page[data-editing="true"] .card.edit-only.danger-zone{display:flex}
.danger-zone__text{min-width:0}
.danger-zone__text b{display:block;font-size:14px;color:var(--ink-1)}
.danger-zone__text .hint{font-size:12px;margin-top:2px}
.danger-zone button.danger{flex:0 0 auto;min-height:40px;background:var(--red);color:#fff;border:0}
.danger-zone button.danger:hover{background:color-mix(in srgb,var(--red) 86%,#000)}
.page .row>button{min-height:44px;border-radius:var(--r-control);font-size:14px}
.page-body .card>.row>button{flex:0 0 auto;min-width:104px}
input,select,textarea{min-height:42px;border:1px solid var(--hair);border-radius:var(--r-control);background:var(--surface);padding:9px 12px;font-size:14px;color:var(--ink-1)}
html[data-theme="dark"] input,html[data-theme="dark"] select,html[data-theme="dark"] textarea{background:var(--surface-2);border-color:var(--hair);color:var(--ink-1)}
input:focus,select:focus,textarea:focus{border-color:var(--brand);box-shadow:0 0 0 3px color-mix(in srgb,var(--brand) 26%,transparent);outline:none}
label.field{font-size:13px;color:var(--ink-2);margin:12px 0 6px}
button{border-radius:var(--r-control);font-size:14px;font-weight:500}
button.primary{background:var(--brand-strong);color:#fff;border:1px solid transparent}
button.primary:hover{background:var(--brand-strong);filter:brightness(.93)}
button.danger{background:color-mix(in srgb,var(--red) 10%,transparent);color:var(--danger-text);border:1px solid color-mix(in srgb,var(--red) 24%,transparent)}
button.small{min-height:34px;padding:6px 12px;font-size:13px}
.state{display:flex;flex-direction:column;align-items:center;gap:6px;margin:16px 0;padding:36px 20px;border:1px solid var(--hair);border-radius:var(--r-card);background:var(--surface-2);text-align:center}
.state__title{display:flex;align-items:center;gap:8px;margin:0;font-size:15px;line-height:22px;font-weight:600;color:var(--ink-1)}
.state__body{margin:0 auto 10px;max-width:52ch;color:var(--ink-2);font-size:13px;line-height:20px}
.state__actions{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.state[data-tone="error"]{border-color:color-mix(in srgb,var(--red) 30%,var(--hair));background:color-mix(in srgb,var(--red) 6%,var(--surface))}
.state[data-tone="error"] .state__title{color:var(--danger-text)}
.state[data-tone="loading"] .state__title::before{content:"";width:14px;height:14px;border-radius:50%;border:2px solid color-mix(in srgb,var(--brand) 30%,transparent);border-top-color:var(--brand);animation:state-spin .9s linear infinite}
@keyframes state-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion: reduce){
.state[data-tone="loading"] .state__title::before{animation:none}
}
body.auth-mode{overflow:auto}
.auth{position:fixed;inset:0;z-index:55;display:flex;align-items:center;justify-content:center;padding:40px 20px;background:radial-gradient(1200px 600px at 50% -10%,color-mix(in srgb,var(--brand) 8%,transparent),transparent 60%),var(--canvas);overflow-y:auto}
.auth.hidden{display:none}
.auth__panel{width:100%;max-width:420px}
.auth__brand{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;margin-bottom:14px}
.auth__lead{text-align:center;margin:0 auto 20px;max-width:340px;font-size:13px;line-height:19px;color:var(--ink-2)}
.auth__brand img{width:64px;height:64px;border-radius:16px;object-fit:cover;box-shadow:var(--shadow-1)}
.auth__name{display:block;font-size:20px;line-height:26px;font-weight:700;letter-spacing:-.01em;color:var(--ink-1);text-align:center}
.auth__tag{display:block;font-size:12px;line-height:16px;letter-spacing:.06em;color:var(--ink-3);margin-top:2px;text-align:center}
.auth__card{background:var(--surface);border:0;border-radius:16px;box-shadow:var(--shadow-2);padding:24px;margin:0}
.auth__card>h2{font-size:20px;line-height:26px;font-weight:600;letter-spacing:-.01em;margin:0 0 8px;text-align:center}
.auth__card .hint{font-size:13px;line-height:19px;text-align:center}
.auth__card .status{min-height:20px;margin-top:10px;font-size:13px;text-align:center}
.auth__card input{min-height:44px;font-size:15px}
.auth__card .row>button{width:100%;min-height:50px;border-radius:12px;font-size:17px;font-weight:600}
#login-oidc{display:flex;flex-direction:column;gap:8px;margin-top:10px}
#login-oidc a{display:block;margin:0 !important}
#login-oidc button{width:100%;min-height:50px;border-radius:12px;font-size:17px;font-weight:600;background:var(--surface);color:var(--ink-1);border:1px solid var(--hair);box-shadow:0 1px 2px rgba(20,40,80,.04)}
#login-oidc button:hover{background:var(--surface-2)}
.auth__card .row{gap:8px;margin-top:16px}
.auth__card .row>#lock2{flex:0 0 auto;width:auto;background:transparent;border:1px solid var(--hair)}
.auth__card .row.auth__secondary{margin-top:10px}
.auth__card .row>#init-v2{width:auto;min-height:38px;background:transparent;border:1px solid var(--hair);color:var(--ink-2);font-size:13px;font-weight:500}
.auth__trust{display:flex;gap:8px;margin:20px 0 0;padding-top:14px;border-top:1px solid var(--hair);font-size:13px;line-height:19px;color:var(--ink-2)}
.auth__trust svg{flex:0 0 auto;width:16px;height:16px;margin-top:2px;stroke:var(--ink-3);fill:none}
.auth__foot{display:flex;align-items:center;justify-content:flex-end;margin-top:10px}
.auth__theme{background:transparent;border:0;color:var(--ink-2);font-size:13px;padding:6px 8px;min-height:36px}
.auth__theme:hover{color:var(--ink-1);background:var(--surface-2)}
body.auth-mode header{display:none}
@media(max-width:720px){
.auth{position:static;min-height:100svh;padding:24px 16px;align-items:flex-start}
.auth__panel{max-width:none}
.auth__brand{margin-bottom:20px}
.auth__card{padding:20px 18px}
header{position:static;grid-template-columns:1fr auto;padding-top:8px;backdrop-filter:none;-webkit-backdrop-filter:none;background:var(--canvas)}
nav{grid-area:tabs}
.wrap{padding:0 16px 40px}
.kpi{min-height:88px;padding:12px 14px}
.kpi .value{font-size:26px;line-height:30px}
.ov-title{font-size:24px;line-height:30px}
.page-nav{padding:0 12px}
.page-body{padding:14px 12px 28px}
.page-body>.card{padding:16px}
.kv{grid-template-columns:88px minmax(0,1fr);gap:10px}
.kpis{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.card{padding:16px}
.dash{gap:12px}
.table-wrap table{min-width:560px}
}
@media(pointer:coarse){
.seg button{min-height:36px;padding:0 12px}
.aging-table tbody tr,.health-row{min-height:44px}
}
</style></head><body><div class="wrap">
<div id="db-down" class="notice-bar hidden" data-level="critical"><span class="notice-dot"></span><span class="notice-text"></span></div>
<header><div class="brand"><img id="site-logo" src="/logo.png" alt="" style="cursor:pointer"><h1 id="site-title" style="cursor:pointer">Secrets Broker</h1><span class="badge">Cloudflare Workers</span><span class="badge" id="header-version" title="App version">Version unknown</span></div>
<div class="hdr-actions">
<button id="theme-cycle" class="theme-cycle" title="Switch theme: Light / Dark / System" aria-label="Switch theme (current: Light)">☀️</button>
<button id="ai-help" class="small" title="Use AI to explain the current state">Ask AI</button>
<a class="icon-btn" href="https://github.com/otscup/secrets-broker-workers" target="_blank" rel="noreferrer" title="GitHub"><svg viewBox="0 0 16 16" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg></a>
<button id="page-refresh" class="small" title="Refresh this page">Refresh</button>
<div class="user-wrap"><span class="user"><span class="who-name" id="who"></span><button id="avatar" class="avatar" title="Account" aria-label="Account menu" aria-haspopup="menu" aria-expanded="false">SB</button></span>
<div id="account-menu" class="account-menu hidden"><button data-view="profile">Profile</button><button data-view="settings">Settings</button><button id="account-about">About</button><button id="account-logout">Log out</button><button id="lock" class="danger">Lock</button></div></div>
</div>
<nav id="nav"><button data-view="overview" class="active"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.5 12 4l8 7.5"/><path d="M6.5 10.5V20h11v-9.5"/></svg><span>Overview</span></button><button data-view="items"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="3.6"/><path d="M10.6 10.6 20 20"/><path d="M15.6 15.6l2-2"/><path d="M17.8 17.8l2-2"/></svg><span>Secrets</span></button><button data-view="devices"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.5" width="18" height="12" rx="1.6"/><path d="M9 20h6"/><path d="M12 16.5V20"/></svg><span>Devices</span></button><button data-view="agents"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8.4" r="3"/><path d="M3.5 19c0-2.9 2.5-4.6 5.5-4.6s5.5 1.7 5.5 4.6"/><path d="M16.2 6.6a2.6 2.6 0 0 1 0 5"/><path d="M17.6 14.6c2 .6 3.4 2.2 3.4 4.4"/></svg><span>Agents</span></button><button data-view="grants"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.6 5 6.4v5c0 4.3 2.9 7.4 7 8.9 4.1-1.5 7-4.6 7-8.9v-5z"/><path d="M9 12.1l2.1 2.1 4-4.4"/></svg><span>Grants</span></button><button data-view="logs"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 6.5h11"/><path d="M8.5 12h11"/><path d="M8.5 17.5h11"/><circle cx="4.6" cy="6.5" r="1.1"/><circle cx="4.6" cy="12" r="1.1"/><circle cx="4.6" cy="17.5" r="1.1"/></svg><span>Logs</span></button></nav>
</header>

<div id="auth-shell" class="auth hidden">
<div class="auth__panel">
  <div class="auth__brand"><img id="auth-logo" src="/logo.png" alt=""><div><span class="auth__name" id="auth-site-name">Secrets Broker</span><span class="auth__tag">SELF-HOSTED SECRETS BROKER</span></div></div>
  <p class="auth__lead">Give each Agent time-limited, scoped grants to read secrets, and record every read in the audit log.</p>
  <section id="login-card" class="auth__card card hidden" aria-labelledby="login-title">
    <h2 id="login-title">Log in to the admin console</h2>
    <div class="hint">The console password only protects this console. Each Agent uses its own separately issued access token.</div>
    <label class="field" for="admin-password">Console password</label><input id="admin-password" type="password" autocomplete="current-password" enterkeyhint="go">
    <div id="totp-row" class="hidden"><label class="field" for="totp-code">Two-factor code</label><input id="totp-code" inputmode="numeric" autocomplete="one-time-code" placeholder="6-digit code"></div>
    <div class="row"><button class="primary" id="login">Log in</button></div><div class="status" id="login-status" role="status" aria-live="polite"></div><div id="login-oidc"></div>
  </section>

  <section id="unlock-card" class="auth__card card hidden" aria-labelledby="unlock-title">
    <h2 id="unlock-title">Unlock Vault</h2><div class="hint">The Vault master password is the one you set when initializing the Vault, not the console password. It only goes through PBKDF2/HKDF on this device; the server only receives the derived session key.</div>
    <label class="field" for="master-password">Vault master password</label><input id="master-password" type="password" autocomplete="current-password" enterkeyhint="go">
    <div id="unlock-totp-row" class="hidden"><label class="field" for="unlock-totp-code">Two-factor code</label><input id="unlock-totp-code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="6-digit code" aria-label="Two-factor code: enter the 6-digit code from your phone to show item names"></div>
    <label class="field" for="ttl">Unlock duration</label><select id="ttl"><option value="12h" selected>12 hours (default)</option><option value="7d">7 days</option><option value="30d">30 days</option><option value="device">Long-term (bound to this device)</option></select>
    <div class="hint" id="ttl-risk">The longer the duration, the longer anyone who gets hold of this session can read. With “Long-term”, the key is sealed in this device’s browser storage instead of staying on the server; only revoking the device invalidates it.</div>
    <div class="row"><button class="primary" id="unlock">Unlock</button><button id="lock2">Lock</button><button id="unlock-browse">Continue locked (approvals still work)</button></div><div class="status" id="unlock-status" role="status" aria-live="polite"></div>
    <div class="row auth__secondary"><button id="init-v2">Initialize Vault 2.0 (at least 12 characters)</button></div>
  </section>
  <p class="auth__trust"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 5.5 6v5.2c0 4 2.7 7 6.5 8.3 3.8-1.3 6.5-4.3 6.5-8.3V6z" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 11.8l2 2 4-4.2" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Your secrets stay in your own Cloudflare Worker, not with a third-party host; your login session exists only in this browser.</span></p>
  <div class="auth__foot"><button id="auth-theme" class="auth__theme" type="button" aria-label="Switch theme (current: Light)">Switch theme</button></div>
</div>
</div>

<section id="dashboard" class="hidden">
  <div id="locked-bar" class="notice-bar hidden" data-level="notice" role="status" aria-live="polite"><span class="notice-dot"></span><span class="notice-text" id="locked-text">Locked · item names are redacted, approvals still work</span><button class="notice-more" id="locked-unlock" type="button">Unlock</button></div>
  <section id="view-overview" class="view">
    <div class="ov-head"><div class="ov-titles"><h2 class="ov-title">Overview</h2><div class="ov-sub" id="ov-sub"></div><span class="hint" id="updated"></span></div><div class="ov-controls"><div class="seg" id="range-row"><button data-range="24h" class="on">24 hours</button><button data-range="7d">7 days</button><button data-range="30d">30 days</button></div><input id="global-search" class="gs-input ov-search" placeholder="Search Agent names, secrets, grants, logs…" autocomplete="off" aria-label="Global search"></div></div>
    <div id="global-search-results" class="gs-box hidden"></div>
    <div id="notice-bar" class="notice-bar hidden" role="button" tabindex="0" title="Click to see all notifications"></div>
    <div id="kpis" class="kpis"></div>
    <div class="dash">
      <div class="card span2"><div class="card-head"><h2 id="trend-title">Read trend</h2><div class="trend-nav"><button class="trend-arrow" id="trend-prev" title="Previous" aria-label="Previous">‹</button><span class="trend-count" id="trend-count">1/2</span><button class="trend-arrow" id="trend-next" title="Next" aria-label="Next">›</button></div></div><div class="hint" id="trend-hint" style="margin-bottom:6px">Grouped by time · hover for values</div><div id="chart-box" class="trend-box"></div><div id="heat-box" class="hidden"></div></div>
      <div class="card rank-card"><h2>Most-read items</h2><div class="hint" style="margin-bottom:6px">Sorted by read count</div><div id="top-box" class="rank-box"></div></div>
      <div id="ov-actions" class="card ov-actions"></div>
      <div class="card donut-card"><h2>Reads by Agent</h2><div class="hint" style="margin-bottom:6px">Grouped by agent · click a slice for details</div><div id="donut-box" class="donut-wrap"></div></div>
      <div class="card" id="aging-card" role="region" aria-labelledby="aging-title">
        <div class="card-head">
          <h2 id="aging-title">Expiry and rotation</h2>
          <span class="aging-count" id="aging-count" aria-live="polite">—</span>
        </div>
        <div class="aging-wrap">
          <table class="aging-table" id="aging-table">
            <caption>Last rotation, expiry and days left; the health card only shows aggregate counts.</caption>
            <thead><tr>
              <th scope="col" data-sort-key="name" aria-sort="none"><button type="button" data-sort="name">Item<span class="aging-arrow" aria-hidden="true"></span></button></th>
              <th scope="col" data-sort-key="rotated" aria-sort="none"><button type="button" data-sort="rotated">Last rotated<span class="aging-arrow" aria-hidden="true"></span></button></th>
              <th scope="col" data-sort-key="expires" aria-sort="none"><button type="button" data-sort="expires">Expires<span class="aging-arrow" aria-hidden="true"></span></button></th>
              <th scope="col" data-sort-key="days" aria-sort="none"><button type="button" data-sort="days">Days left<span class="aging-arrow" aria-hidden="true"></span></button></th>
              <th scope="col">Status</th>
            </tr></thead>
            <tbody id="aging-rows"><tr><td colspan="5" class="aging-msg"><b>Loading items…</b> The list comes only from this server; no third parties are contacted.</td></tr></tbody>
          </table>
        </div>
        <div class="aging-foot hidden" id="aging-foot">
          <span class="aging-more" id="aging-more"></span>
          <button class="small" id="aging-all" type="button">View all</button>
        </div>
      </div>
      <div class="card span3 recent-card"><h2>Recent activity</h2><div id="recent-box" class="recent"></div></div>
    <div id="chart-tip" class="chart-tip"></div>
    </div>
  </section>

  <section id="view-items" class="view hidden"><div class="card"><h2>Secret items</h2><div class="hint">Secret items synced to this server. Open one to view its plaintext, set whether it skips approval, or share it with an Agent; select several for bulk actions.</div><div class="row" style="margin-top:10px"><input id="item-filter" aria-label="Search items" placeholder="Search name, group or URL…"><select id="item-sort" aria-label="Sort by" title="Sort by" style="flex:0 0 auto"><option value="name">By name</option><option value="activity">By recent activity</option><option value="access">By grant count</option><option value="expiry">By expiry</option></select><button id="item-density" aria-pressed="false" title="List spacing: switch between comfortable and compact">Spacing: comfortable</button><button id="items-refresh">Refresh</button><button id="items-select">Select</button><button id="item-create">New</button><button id="item-import">Import</button><button id="item-export">Export</button><input id="import-file" type="file" accept="application/json,.json" class="hidden"></div><div id="bulk-bar" class="row hidden" style="margin-top:8px;background:var(--btn);padding:8px;border-radius:10px"><span id="bulk-count" class="hint" style="flex:0 0 auto"></span><span id="bulk-progress" class="hint" role="status" aria-live="polite" style="flex:0 0 auto"></span><button id="bulk-share" class="primary">Share selected</button><button id="bulk-kind" title="Mark the selected credentials as API Key or website login">Classify selected</button><button class="danger" id="bulk-delete">Delete selected</button><button id="bulk-clear">Clear selection</button></div><div id="items-box" class="table-wrap" style="margin-top:10px"></div><div id="item-status" class="status"></div></div>
    <div class="card" id="card-vault2"><div class="row" style="justify-content:space-between;align-items:center"><div><h2 style="margin:0">Vault 2.0</h2><div class="hint" style="margin-top:4px">The zero-knowledge vault lives in a separate database and is independent of the encrypted vault above. When unlocked it shows item names; when locked, only its status.</div></div><span id="v2-badge" class="kind-tag kind-none" style="flex:0 0 auto">Loading…</span></div><div id="v2-status" class="hint" style="margin-top:10px"></div><div class="row" id="v2-unlock-row" style="margin-top:10px"><input id="v2-password" type="password" placeholder="Vault 2.0 master password (at least 12 characters)"><button id="v2-unlock" class="primary">Unlock</button><button id="v2-lock">Lock</button><input id="v2-legacy-password" type="password" placeholder="Old master password (import only)" autocomplete="off"><button id="v2-import">Import from old vault</button><button id="v2-refresh">Refresh</button></div><div class="hint" style="margin-top:8px">Paired devices, their online status and revoke buttons are on the “Devices” tab.</div><div class="hint" style="margin-top:6px">Risk: the longer the unlock lasts, the longer a stolen session can read. “Long-term” doesn’t leave the key on the server, but this browser stores the unsealing material; only revoking this device truly invalidates it.</div><div id="v2-box" class="table-wrap scroll-list hidden" style="margin-top:10px"></div><div id="v2-msg" class="status"></div></div>
<div class="card hidden" id="card-fill-policies" aria-hidden="true"><h2>Classified credentials</h2><div class="hint">Click ⋮ in the list to open an item and set it individually, or select several and click “Classify selected”. Mark as <b>api</b> (API Key) to optionally let an Agent read the plaintext; mark as <b>web</b> (website login) to allow filling into specific sites only, so an Agent never gets the plaintext. Unclassified credentials are denied reads by default.</div><div class="hint" id="fp-exec-note" style="margin-top:6px"></div><div id="fp-list" class="table-wrap scroll-list" style="margin-top:10px"></div></div>
    <div class="card" id="card-denied"><h2>Blocked requests</h2><div class="hint">Items an Agent tried to read that failed the permission check. This is only a record; nothing was let through. Click “Authorize” to actually allow access.</div><div id="denied-list" class="table-wrap scroll-list" style="margin-top:10px"></div></div>
    
  </section>

  <section id="view-devices" class="view hidden"><div class="card"><div class="row" style="justify-content:space-between;align-items:center"><div><h2 style="margin:0">Devices</h2><div class="hint" style="margin-top:4px">Every machine that has run secrets-broker pair is listed here. A device counts as online if it pulled in the last 5 minutes. Revoking only stops future pulls; keys it already has stay valid until you re-encrypt.</div></div><button id="devices-refresh">Refresh</button></div><div id="devices-status" class="hint" style="margin-top:10px"></div><div id="v2-devices" class="hidden" style="margin-top:10px"></div><div id="devices-msg" class="status"></div></div><div class="card"><h2>Pair a new device</h2><div class="hint">Run this command in a terminal on the other machine (PowerShell / CMD, not the browser console). It prints an approval link, a pairing code and a public-key fingerprint, then waits for approval. If there is no global secrets-broker command, use node cli/index.mjs from the repo root instead.</div><div class="secret" id="pair-command" style="margin-top:8px">secrets-broker pair --url …</div><div class="hint" style="margin-top:8px">Open the link from the terminal, check that the public-key fingerprint matches, then click Approve. The pairing code expires after five minutes. Once approved, the device appears in the list above, where you can toggle read-only/read-write or revoke it.</div></div></section>
  <section id="view-agents" class="view hidden">
    <div class="card">
      <div class="row" style="justify-content:space-between;align-items:center">
        <div><h2 style="margin:0">Manage Agents</h2><div class="hint" style="margin-top:4px">Recent activity is based on the audit log, not live online status.</div></div>
        <div class="row" style="gap:8px;flex:0 0 auto"><button id="agent-matrix">Permission matrix</button><button class="primary" id="agent-new">New Agent</button></div>
      </div>
      <div class="agent-stats" id="agent-stats"></div>
      <div class="row" style="margin-top:12px;gap:8px">
        <input id="agent-search" placeholder="Search name, alias, notes…" style="flex:1;min-width:180px">
        <select id="agent-type-filter" style="flex:0 0 auto">
          <option value="">All types</option>
          <option value="oauth">OAuth</option>
          <option value="token">Token</option>
        </select>
        <select id="agent-sort" style="flex:0 0 auto">
          <option value="default">Default order</option>
          <option value="expiry">By expiry</option>
          <option value="activity">By recent activity</option>
          <option value="name">By name</option>
          <option value="rights">By readable item count</option>
        </select>
      </div>
      <div id="agents-box" class="scroll-list" style="margin-top:var(--sp-3)"></div>
      <div class="status" id="agent-status"></div>
    </div>
  </section>

  <section id="view-grants" class="view hidden">
    <div class="card" id="transfers-card"><h2>Pending copies to other accounts</h2><div class="hint">Shares from the main account are queued first. Once you switch to the target account and unlock, they are copied to the chosen folder and a grant is created automatically.</div><div id="transfers-box" class="table-wrap scroll-list" style="margin-top:10px"></div></div>
    <div class="card"><h2>Pending requests</h2><div class="hint">Click a button to authorize: once/1h/24h/7d/permanent, same as the Docker version.</div><div id="pending-box" class="scroll-list" style="margin-top:10px"></div></div>
    <div class="card"><h2>Active grants</h2><div class="hint">Expired grants drop off the list on the next refresh (the audit log keeps them). Click a row’s duration to change it. Use “Select” to delete in bulk or restore in bulk with a new duration.</div><div class="row" style="margin-top:8px"><button id="grants-select">Select</button></div><div id="grants-bulk" class="row hidden" style="margin-top:8px;background:var(--fill);padding:8px;border-radius:10px;flex-wrap:wrap"><span id="grants-bulk-count" class="hint" style="flex:0 0 auto"></span><select id="grants-bulk-seconds" title="Duration after restore (from now)" style="flex:0 0 auto"><option value="3600">1 hour</option><option value="86400">24 hours</option><option value="604800" selected>7 days</option><option value="2592000">30 days</option><option value="0">Permanent</option></select><button id="grants-bulk-restore" class="primary">Restore selected</button><button class="danger" id="grants-bulk-delete">Delete selected</button><button id="grants-bulk-clear">Clear selection</button></div><div id="grants-box" class="scroll-list" style="margin-top:10px"></div></div>
  </section>

  <section id="view-logs" class="view hidden"><div class="card"><h2>Audit log</h2><div class="hint">Latest 500 entries, stored in the Durable Object.</div>
    <div class="row" style="margin-top:12px;gap:8px">
      <select id="logs-item-filter" style="flex:0 0 auto"><option value="">Any item</option></select>
      <select id="logs-agent-filter" style="flex:0 0 auto"><option value="">Any Agent</option></select>
      <select id="logs-event-filter" style="flex:0 0 auto"><option value="">Any event type</option></select>
      <input id="logs-search" placeholder="Search event, Agent, item, reason…" style="flex:1;min-width:180px">
      <label class="field" style="margin:0">From <input id="logs-from" type="datetime-local" style="width:auto"></label>
      <label class="field" style="margin:0">To <input id="logs-to" type="datetime-local" style="width:auto"></label>
      <button id="logs-reset" style="flex:0 0 auto">Clear filters</button>
    <button id="logs-export" style="flex:0 0 auto">Export CSV</button>
    </div>
    <div class="hint" id="logs-count" style="margin-top:8px"></div>
    <div id="logs-box" class="scroll-list" style="margin-top:var(--sp-3)"></div>
    <div class="row" id="logs-more-wrap" style="margin-top:10px"><button id="logs-more" class="small">Load more</button></div>
  </div></section>

  <section id="view-profile" class="view hidden">
    <div class="card"><h2>Profile</h2><div class="hint">Shown in the console. OIDC login syncs name/email/avatar.</div>
      <label class="field">Name</label><input id="profile-name" placeholder="Your name">
      <label class="field">Email</label><input id="profile-email" placeholder="you@example.com">
      <label class="field">Avatar URL</label><input id="profile-avatar" placeholder="https://...">
      <div class="row" style="margin-top:10px"><button class="primary" id="profile-save">Save profile</button></div><div class="status" id="profile-status"></div>
    </div>
    <div class="card"><h2>Login and linked accounts</h2><div class="hint">OIDC can be used to log in to the console; once configured, just click a button below.</div><div id="oidc-box" style="margin-top:10px"></div><div class="status" id="oidc-status"></div></div>
    <div class="card"><h2>Change password</h2><div class="hint" id="password-source"></div><label class="field">Current password</label><input id="current-password" type="password" autocomplete="current-password"><label class="field">New password (at least 8 characters)</label><input id="new-password" type="password" autocomplete="new-password"><div style="margin-top:10px"><button class="primary" id="password-save">Change password</button></div><div class="status" id="password-status"></div></div>
    <div class="card"><h2>Two-factor authentication (TOTP)</h2><div id="totp-status" class="hint"></div><div id="totp-setup-box" class="hidden"><div class="hint">Scan the key below with your authenticator app or enter it manually, then enter the 6-digit code to enable it.</div><div class="secret" id="totp-secret"></div><label class="field">Code</label><input id="totp-enable-code" inputmode="numeric" placeholder="6-digit code"><div style="margin-top:10px"><button class="primary" id="totp-enable">Enable 2FA</button></div></div><div class="row" style="margin-top:10px"><button id="totp-setup">Generate/regenerate key</button><button class="danger hidden" id="totp-disable">Disable 2FA</button></div><div class="status" id="totp-message"></div></div>

    <div class="card"><h2>Local write allowlist</h2><p class="hint">Target paths allowed for “write an item to a local file”, one per line. End a path with <code>/</code> to allow the whole directory.</p><textarea id="mat-paths" rows="3" placeholder="/srv/app/secrets.env"></textarea><div class="row" style="margin-top:10px"><button class="primary" id="mat-save">Save allowlist</button></div><div class="status" id="mat-status"></div></div>
    <div class="card"><h2>Safety settings</h2><p class="hint">Every option defaults to the most conservative choice. Permissions set on a specific Agent or item take precedence.</p>
      <div class="ios-field"><label>Allow reading website login plaintext<div class="hint">When off, website passwords can only be filled into their specified sites, and no Agent can get the plaintext.</div></label><input type="checkbox" class="ios-switch" id="bs-web"></div>
      <div class="ios-field"><label>Allow reading plaintext of unclassified items<div class="hint">When off, unclassified credentials are denied even if granted.</div></label><input type="checkbox" class="ios-switch" id="bs-unclassified"></div>
      <div class="ios-field"><label>Allow Agent proxied calls to any host<div class="hint">When off, only sites registered in the item can be called. When on, each call still needs approval.</div></label><input type="checkbox" class="ios-switch" id="bs-target"></div>
      <div class="ios-field"><label>Block Agent reads after expiry<div class="hint">Off by default: expiry only triggers a reminder. When on, secret.read is denied, but fill and proxied calls still follow their own policies. This explicitly tightens grants, so existing Agent grants are affected immediately.</div></label><input type="checkbox" class="ios-switch" id="bs-expiry"></div>
      <div class="ios-field"><label>Days without rotation before a health card reminder<div class="hint">Only a reminder; it doesn’t change any grants. Default 180 days. Items never rotated count from when they were created.</div></label><input id="bs-rotate-days" type="number" min="30" max="3650" step="30" inputmode="numeric" placeholder="180"></div>
      <div class="row" style="margin-top:10px"><button class="primary" id="bs-save">Save safety settings</button></div>
      <div class="status" id="bs-status"></div>
    </div>
    <div class="card"><h2>Online clients and login history</h2><div class="hint">This browser session stays online once unlocked; recent logins come from the audit log.</div><div id="sessions-box" style="margin-top:10px"></div><div id="login-history" style="margin-top:10px"></div></div>
  </section>

  <section id="view-settings" class="view hidden">
    <div class="card"><h2>Site</h2><label class="field">Site name</label><input id="site-name" placeholder="Secrets Broker"><div class="hint">Shown in the top-left corner; click it to go home.</div></div>
    <div class="card collapsible" id="card-ai"><h2 class="card-toggle" data-collapse="card-ai">AI assistant <span class="card-caret">▾</span></h2>
      <div class="card-body">
      <div class="hint">Explains things like “why can’t this Agent read it?” or “which grant expired?”. It only reads summaries (Agent, item names, grant status, logs), <b>never sees secret values, usernames or TOTP</b> and <b>can’t change anything</b>. You still make every fix yourself in the UI.</div>
      <label class="chk" style="margin-top:10px"><input type="checkbox" id="ai-enabled"> Enable AI assistant</label>
      <div id="ai-custom-box">
        <label class="field">Endpoint (Base URL)</label><input id="ai-endpoint" placeholder="https://api.openai.com/v1">
        <div class="hint">Enter the URL up to <code>/v1</code> and <code>/chat/completions</code> is added automatically; you can also enter the full path.</div>
        <label class="field">API Key</label><input id="ai-apikey" type="password" placeholder="Leave blank to keep the current value; enter null to clear">
        <div class="hint" id="ai-key-status"></div>
        <label class="field">Model</label>
        <div class="row" style="gap:6px;margin-top:4px">
          <input id="ai-model" list="ai-model-list" placeholder="Click “Fetch models” to list them" style="flex:1;min-width:0">
          <button class="small" id="ai-model-fetch" style="flex:0 0 auto">Fetch models</button>
        </div>
        <datalist id="ai-model-list"></datalist>
        <div class="hint" id="ai-model-status">Fill in the endpoint and key first; “Fetch models” then calls GET /models on it.</div>
      </div>
      <label class="field">Timeout (ms)</label><input id="ai-timeout" type="number" min="5000" max="60000" value="25000">
      <div class="row" style="margin-top:12px"><button class="primary" id="ai-save">Save AI settings</button><button id="ai-test">Test</button></div>
      <div class="status" id="ai-status"></div>
      </div></div>
    <div class="card collapsible collapsed" id="card-notify-channels"><h2 class="card-toggle" data-collapse="card-notify-channels">Notification channels <span class="card-caret">▸</span></h2><div class="hint">Pending requests are pushed to these channels. A blank token keeps the current value. With “Enable this channel” off, neither automatic pushes nor “Send test notification” go to that channel.</div>
      <div class="card-body">
      <div class="grid2" style="margin-top:10px">
        <div><h2 style="font-size:13px">Telegram</h2><label class="chk"><input type="checkbox" id="tg-enabled"> Enable this channel</label><label class="field">Bot Token</label><input id="tg-token" type="password" placeholder="Leave blank to keep current value"><label class="field">Chat ID</label><input id="tg-chat" placeholder="e.g. 123456789"><div class="hint" id="tg-status"></div></div>
        <div><h2 style="font-size:13px">ntfy</h2><label class="chk"><input type="checkbox" id="ntfy-enabled"> Enable this channel</label><label class="field">Server URL</label><input id="ntfy-url" placeholder="https://ntfy.example.com"><label class="field">Topic</label><input id="ntfy-topic" placeholder="secrets-broker-xxxx"><div class="hint" id="ntfy-status"></div></div>
        <div><h2 style="font-size:13px">Gotify</h2><label class="chk"><input type="checkbox" id="gotify-enabled"> Enable this channel</label><label class="field">Server URL</label><input id="gotify-url" placeholder="https://gotify.example.com"><label class="field">App Token</label><input id="gotify-token" type="password" placeholder="Leave blank to keep current value"><div class="hint" id="gotify-status"></div></div>
        <div><h2 style="font-size:13px">Webhook (generic / wxpush-compatible)</h2><label class="chk"><input type="checkbox" id="wxpush-enabled"> Enable this channel</label><label class="field">URL</label><input id="wxpush-url" placeholder="https://example.com/webhook"><label class="field">Token</label><input id="wxpush-token" type="password" placeholder="Leave blank to keep current value"><label class="field">Format</label><select id="wxpush-format"><option value="form">Form (wxpush-compatible)</option><option value="json">JSON + Bearer Token</option></select><div class="hint" id="wxpush-status"></div></div>
      </div>
      <div style="margin-top:12px"><button class="primary" id="settings-save">Save notification settings</button><button id="notify-test" style="margin-left:8px">Send test notification</button><button id="notify-test-approval" style="margin-left:8px">Send sample approval request</button></div><div class="status" id="settings-status"></div>
      </div>
    </div>
    <div class="card collapsible collapsed" id="card-notify-templates"><h2 class="card-toggle" data-collapse="card-notify-templates">Notification templates <span class="card-caret">▸</span></h2><div class="hint">All four channels share one set of approval templates. Changes apply as soon as you save, no redeploy needed. Placeholders: approvals use {agent}, {name}, {time}, {origin}; reminders use {lines}, {origin}. Clear a field and save to restore the built-in default text. WeChat (wxpush) has no buttons, so a signed approval link is appended to the body automatically.</div>
      <div class="card-body">
      <h2 style="font-size:13px;margin-top:10px">Grant approval notification</h2>
      <label class="field">Title</label><input id="tpl-ap-title">
      <label class="field">Body</label><textarea id="tpl-ap-body" rows="5" style="width:100%"></textarea>
      <div class="grid2">
        <div><label class="field">Button · Once</label><input id="tpl-lb-once"></div>
        <div><label class="field">Button · 24 hours</label><input id="tpl-lb-24h"></div>
        <div><label class="field">Button · Deny</label><input id="tpl-lb-deny"></div>
        <div><label class="field">Button · Permanent</label><input id="tpl-lb-always"></div>
      </div>
      <h2 style="font-size:13px;margin-top:12px">Grant expiry reminder</h2>
      <label class="field">Title</label><input id="tpl-rm-title">
      <label class="field">Body</label><textarea id="tpl-rm-body" rows="5" style="width:100%"></textarea>
      </div>
    </div>
    <div class="card"><h2>Bitwarden folder</h2><div class="hint">Only the chosen folder is synced; leave blank for all. The folder list comes from NodeWarden folders.</div><div class="row" style="margin-top:8px"><select id="vault-folder" style="flex:1"><option value="">All folders</option></select><button id="vault-folder-save" class="primary">Save folder</button></div><div class="hint" id="vault-folder-status" style="margin-top:8px"></div></div>
    <div class="card"><h2>Bitwarden account</h2><div class="hint">Choose which NodeWarden user to read from. Switching clears the current unlock session, so you’ll need to unlock again with that user’s master password.</div><div class="row" style="margin-top:8px"><select id="vault-email" style="flex:1"></select><button id="vault-switch" class="primary">Switch account</button></div><div class="hint" id="vault-email-status" style="margin-top:8px"></div></div>
    <div class="card"><h2>OIDC login</h2><div class="hint">You can add several identity providers. Settings are stored in the Durable Object, so no redeploy is needed. A saved client secret is never shown again; leave it blank to keep the current value.</div>
      <div id="oidc-provider-list" style="margin-top:10px"></div>
      <div style="margin-top:12px"><button id="oidc-new">Add provider</button></div>
      <div id="oidc-provider-form" class="hidden" style="margin-top:12px">
        <label class="field">ID (unique, used to link and unlink)</label><input id="op-id" placeholder="corp">
        <label class="field">Display name</label><input id="op-label" placeholder="Company account">
        <label class="field">Issuer</label><input id="op-issuer" placeholder="https://auth.example.com">
        <label class="field">Client ID</label><input id="op-client-id" placeholder="client_xxx">
        <label class="field">Client Secret (can be blank for a public client)</label><input id="op-client-secret" type="password" placeholder="Leave blank to keep current value">
        <label class="field">Redirect URI</label><input id="op-redirect" placeholder="https://your-worker/oidc/callback">
        <label class="field">Scope</label><input id="op-scope" placeholder="openid profile email">
        <label class="field">Authorization Endpoint (advanced; leave blank to auto-discover)</label><input id="op-authorization" placeholder="https://auth.example.com/authorize">
        <label class="field">Token Endpoint</label><input id="op-token" placeholder="https://auth.example.com/token">
        <label class="field">Userinfo Endpoint</label><input id="op-userinfo" placeholder="https://auth.example.com/userinfo">
        <label class="field">JWKS URI</label><input id="op-jwks" placeholder="https://auth.example.com/jwks">
        <label class="chk" style="display:block;margin-top:8px"><input type="checkbox" id="op-enabled" checked> Enable this provider</label>
        <div style="margin-top:10px"><button id="op-discover">Auto-fill from Issuer</button><button id="op-probe">Test this provider</button><button class="primary" id="op-save" style="margin-left:8px">Save</button><button id="op-cancel" style="margin-left:8px">Cancel</button></div>
        <div class="hint" id="op-status" style="margin-top:8px"></div>
        <div id="op-probe-result" style="margin-top:8px"></div>
      </div>
    </div>
    <div class="card"><h2>Browser notifications</h2><div class="hint" id="browser-notify-status"></div><div class="hint" id="webpush-status"></div><div style="margin-top:10px"><button id="enable-browser-notify">Enable browser notifications</button><button id="test-browser-notify">Send test notification</button><button id="enable-webpush">Enable background push</button><button id="test-webpush">Test background push</button></div></div>
    <div class="card"><h2>MCP access</h2><div class="hint">HTTP MCP URL (use an Agent Bearer token):</div><div class="secret" id="mcp-url"></div><div class="hint" style="margin-top:8px">Tools: list_secrets / request_access / get_secret. Codex and Hermes can use HTTP MCP directly.</div></div>
  </section>
</section>

<div id="app-version" class="app-version" aria-live="polite">Version unknown</div>
</div>
<div id="toast" class="toast" role="status" aria-live="polite" aria-atomic="true"></div><div id="live-alert" class="sr-only" role="alert"></div>
<section id="item-page" class="page hidden" tabindex="-1" aria-label="Item details"><div class="page-nav"><button class="page-back" id="item-page-back" aria-label="Back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"></path></svg>Back</button><div class="page-title" id="item-page-title"></div><button class="page-action" id="item-page-edit">Edit</button><button class="page-close" id="item-page-close" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button></div><div class="page-state" id="item-page-state" role="status" aria-live="polite"></div><div class="page-body" id="item-page-body"></div></section><div id="modal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="card"><button class="modal-x" id="modal-close-x" title="Close" aria-label="Close">×</button><h2 id="modal-title"></h2><div id="modal-body"></div><div style="margin-top:12px"><button id="modal-close">Close</button></div></div></div>
<script>
const $ = (id) => document.getElementById(id)
const enc = new TextEncoder()
// Chunked: spreading a long Uint8Array into fromCharCode throws RangeError.
const b64 = (bytes) => { const view = new Uint8Array(bytes); let binary = ''; for (let offset = 0; offset < view.length; offset += 0x8000) binary += String.fromCharCode.apply(null, view.subarray(offset, offset + 0x8000)); return btoa(binary) }
const unb64 = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0))
const cat = (a, b) => { const out = new Uint8Array(a.length + b.length); out.set(a); out.set(b, a.length); return out }
async function hmac(keyBytes, data) { const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return new Uint8Array(await crypto.subtle.sign('HMAC', key, data)) }
async function pbkdf2(password, salt, iterations) { const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']); return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations }, key, 256)) }
async function hkdf(prk, info, length) { const key = await crypto.subtle.importKey('raw', prk, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); const infoBytes = enc.encode(info); const out = new Uint8Array(length); let prev = new Uint8Array(0), offset = 0, counter = 1; while (offset < length) { const input = new Uint8Array(prev.length + infoBytes.length + 1); input.set(prev); input.set(infoBytes, prev.length); input[input.length - 1] = counter; prev = new Uint8Array(await crypto.subtle.sign('HMAC', key, input)); const n = Math.min(prev.length, length - offset); out.set(prev.slice(0, n), offset); offset += n; counter++ } return out }
async function decryptBw(text, encKey, macKey) { const dot = text.indexOf('.'); const type = Number(text.slice(0, dot)); const parts = text.slice(dot + 1).split('|'); const iv = unb64(parts[0]), ct = unb64(parts[1]); if (type === 1 || type === 2) { if (!macKey || !parts[2]) throw new Error('Missing MAC'); const expected = await hmac(macKey, cat(iv, ct)); const mac = unb64(parts[2]); if (!expected.every((b, i) => b === mac[i])) throw new Error('MAC check failed') } else if (type !== 0 && type !== 4) { throw new Error('Unsupported ciphertext type') } const key = await crypto.subtle.importKey('raw', encKey, { name: 'AES-CBC' }, false, ['decrypt']); return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, ct)) }
function setDbDown(message) {
  const el = document.getElementById('db-down')
  if (!el) return
  const text = el.querySelector('.notice-text')
  if (text) text.textContent = 'Database temporarily unavailable; item and vault reads and writes are degraded. The rest of the page still works.' + (message ? ' ' + message : '')
  el.classList.remove('hidden')
}
function clearDbDown() {
  const el = document.getElementById('db-down')
  if (el) el.classList.add('hidden')
}
// A bare "unauthorized" is useless: it means either the cookie expired or the
// page was loaded from a different host than it posts to, and the fix differs.
// Name which one, and what to do about it.
async function api(path, options = {}) {
  const response = await fetch(path, { cache: 'no-store', credentials: 'same-origin', ...options, headers: { 'content-type': 'application/json', ...(options.headers || {}) } })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    let message = body.error || body.reason || body.detail || body.message || ''
    if (typeof message !== 'string') message = ''
    if (!message.trim()) message = 'HTTP ' + response.status
    if (response.status === 401 && message === 'unauthorized') {
      message = 'Your login session has expired, or the page domain doesn’t match the API domain. Log in again. If this keeps happening, check that the address bar shows ' + location.origin + ', not an alias domain.'
    }
    if (response.status === 423) message = 'Vault is locked. Unlock it in “Vault 2.0” first.' + (body.error && body.error !== 'locked' ? ' (' + message + ')' : '')
    const error = new Error(message)
    error.status = response.status
    error.data = body
    error.reason = body.reason || body.detail || body.error || ''
    if (response.status >= 500) setDbDown(message)
    throw error
  }
  const route = path.split('?')[0]
  if (route === '/api/items' || route === '/api/v2/status') clearDbDown()
  return body
}
let app = { me: null, data: { agents: [], policies: {}, grants: [], pending: [], audit: [] }, items: [], itemsLoaded: false, itemsError: '', stateLoaded: false, stateError: '', stats: null, recentAudit: [], range: '24h', token: '' }
// A detail panel answers "what happened in this range", so it reads the same
// audit table /api/stats aggregates. /api/state carries only a 20-row slice for
// the overview and must never stand in for the full window.
async function auditPage(params = {}) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value) !== '') query.set(key, String(value))
  }
  return api('/api/audit' + (query.toString() ? '?' + query.toString() : ''))
}
function rangeStartIso() {
  const ms = app.range === '7d' ? 7 * 86400e3 : app.range === '30d' ? 30 * 86400e3 : 24 * 3600e3
  return new Date(Date.now() - ms).toISOString()
}
const selectedItems = new Set()
// Selection is an explicit mode: iOS lists do not show checkboxes until you ask
// for them, and showing them all the time squeezed the name column.
let itemsSelecting = false
const esc = (text) => String(text ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const status = (id, text, cls = '') => {
  const el = $(id)
  if (!el) return
  el.textContent = text
  el.className = 'status ' + cls
  // Async results were previously silent to assistive technology.
  el.setAttribute('role', cls === 'error' ? 'alert' : 'status')
  el.setAttribute('aria-live', cls === 'error' ? 'assertive' : 'polite')
}
// Opening a dialog used to leave focus on the page behind it, so a keyboard
// user could tab into nothing and Esc closed whatever was underneath first.
let modalReturnFocus = null
function modalFocus(visible) {
  const modal = $('modal')
  if (!modal) return
  if (visible) {
    modalReturnFocus = document.activeElement
    // The close X is the escape hatch, not the first thing you want to press.
    const target = modal.querySelector('#modal-body input,#modal-body select,#modal-body textarea,#modal-body button,#modal-title,#modal-close-x')
    if (target) requestAnimationFrame(() => target.focus())
    return
  }
  const back = modalReturnFocus
  modalReturnFocus = null
  if (back && typeof back.focus === 'function' && document.contains(back)) back.focus()
}
function show(id, visible) { const el = $(id); if (!el) return; const wasHidden = el.classList.contains('hidden'); el.classList.toggle('hidden', !visible); if (id === 'modal' && wasHidden !== Boolean(visible)) modalFocus(visible) }
// Every <label class="field"> in this file sits next to its control instead of
// pointing at it, so clicking the text did nothing and screen readers announced
// a nameless edit box. Associate them once and keep watching for re-rendered
// panels (the item page replaces its body on every open).
let autoFieldId = 0
function associateLabels(root = document) {
  for (const label of root.querySelectorAll('label.field')) {
    if (label.hasAttribute('for')) continue
    const control = label.nextElementSibling
    if (!control || !/^(INPUT|SELECT|TEXTAREA)$/.test(control.tagName)) continue
    if (!control.id) control.id = 'f' + (++autoFieldId)
    label.setAttribute('for', control.id)
  }
}
let toastTimer = null
// confirm() is silently refused inside a sandboxed iframe or a webview without
// allow-modals: the click does nothing at all and the row stays. Ask in the page
// instead - a bar above the tab bar, resolved by whichever button is pressed.
function askYes(message, { yes = 'Delete', no = 'Cancel' } = {}) {
  return new Promise((resolve) => {
    const previous = document.activeElement
    const wrap = document.createElement('div')
    wrap.className = 'ask'
    wrap.setAttribute('role', 'group')
    wrap.setAttribute('aria-label', 'Confirm action')
    wrap.innerHTML = '<div class="ask__text"></div><div class="ask__row"><button class="ask__no"></button><button class="ask__yes danger"></button></div>'
    wrap.querySelector('.ask__text').textContent = message
    wrap.querySelector('.ask__no').textContent = no
    wrap.querySelector('.ask__yes').textContent = yes
    const done = (answer) => { wrap.remove(); document.removeEventListener('keydown', onKey); if (previous && previous.focus) previous.focus(); resolve(answer) }
    const onKey = (event) => { if (event.key === 'Escape') { event.stopImmediatePropagation(); done(false) } }
    wrap.querySelector('.ask__no').onclick = () => done(false)
    wrap.querySelector('.ask__yes').onclick = () => done(true)
    document.addEventListener('keydown', onKey)
    document.body.appendChild(wrap)
    // The safe choice gets the initial focus, so Enter never confirms a delete.
    wrap.querySelector('.ask__no').focus()
  })
}

// Same in-page prompt as askYes, but returns the typed value. prompt() itself
// is unreliable inside the desktop WebView, and the plaintext item list needs a
// 6-digit code the first time it is opened in an unlock session.
function askCode(message, { type = 'text', inputmode = 'numeric', placeholder = '6-digit code', maxlength = 6, label = '', trim = true } = {}) {
  return new Promise((resolve) => {
    const previous = document.activeElement
    const wrap = document.createElement('div')
    wrap.className = 'ask'
    wrap.setAttribute('role', 'group')
    wrap.setAttribute('aria-label', 'Verification')
    wrap.innerHTML = '<div class="ask__text"></div><input class="ask__code"><div class="ask__row"><button class="ask__no">Cancel</button><button class="ask__yes">OK</button></div>'
    wrap.querySelector('.ask__text').textContent = message
    const input = wrap.querySelector('.ask__code')
    input.type = type
    input.setAttribute('inputmode', inputmode)
    input.setAttribute('autocomplete', type === 'password' ? 'current-password' : 'one-time-code')
    input.setAttribute('aria-label', label || placeholder)
    input.placeholder = placeholder
    if (maxlength) input.maxLength = maxlength
    const done = (answer) => { wrap.remove(); document.removeEventListener('keydown', onKey); if (previous && previous.focus) previous.focus(); resolve(answer) }
    const onKey = (event) => { if (event.key === 'Escape') { event.stopImmediatePropagation(); done('') } }
    wrap.querySelector('.ask__no').onclick = () => done('')
    // Codes are typed with spaces by some authenticator apps, so they are
    // stripped; a password must be handed over exactly as typed, spaces included.
    const read = () => (trim ? input.value.replace(/\s+/g, '') : input.value)
    wrap.querySelector('.ask__yes').onclick = () => done(read())
    input.onkeydown = (event) => { if (event.key === 'Enter') done(read()) }
    document.addEventListener('keydown', onKey)
    document.body.appendChild(wrap)
    input.focus()
  })
}

// Sensitive actions ask once, here, regardless of the unlock tier. The server
// independently demands the same proof for the long tiers, so this prompt is
// not the only line of defence.
async function askConfirm(reason) {
  let totp = false
  try { totp = (await api('/api/security')).totpEnabled === true } catch {}
  const value = totp
    ? await askCode(reason + ': enter the 6-digit code from your authenticator app', { label: 'Authenticator code' })
    : await askCode(reason + ': enter the console password', { type: 'password', inputmode: 'text', placeholder: 'Console password', maxlength: 128, label: 'Console password', trim: false })
  if (!value) return null
  return totp ? { confirmCode: value } : { confirmPassword: value }
}
async function sensitiveRequest(url, method, payload, reason) {
  const confirm = await askConfirm(reason)
  if (!confirm) throw new Error('Cancelled')
  return api(url, { method, body: JSON.stringify({ ...payload, ...confirm }) })
}
async function sensitivePost(url, payload, reason) {
  return sensitiveRequest(url, 'POST', payload, reason)
}

function toast(text, error = false) {
  const el = $('toast')
  if (el) {
    el.textContent = text
    el.classList.toggle('error', Boolean(error))
    el.classList.add('show')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => el.classList.remove('show'), 3200)
  }
  // Failures used to disappear into a purely visual toast; the assertive
  // region makes them audible without disturbing polite success messages.
  const live = $('live-alert')
  if (live) live.textContent = error ? text : ''
  const statusEl = $('item-status')
  if (statusEl && !$('view-items').classList.contains('hidden')) status(statusEl.id, text, error ? 'error' : 'ok')
}

// The version endpoint ships with the worker half, which may not be deployed
// yet: a 404 must degrade to "Version unknown" and never block the About dialog.
let versionInfo = null
let versionRequest = null
function loadVersion(force = false) {
  if (versionRequest && !force) return versionRequest
  versionRequest = fetch('/api/version', { cache: 'no-store', credentials: 'same-origin' })
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null)
    .then((data) => {
      versionInfo = data && typeof data === 'object' && !Array.isArray(data) ? data : null
      renderVersion()
      return versionInfo
    })
  return versionRequest
}
function versionLabel() {
  const info = versionInfo || {}
  const number = info.version || info.appVersion || ''
  if (!number) return 'Version unknown'
  const deployed = info.workerVersion || ''
  return 'v' + number + (deployed ? ' · deploy ' + String(deployed).slice(0, 8) : '')
}
function renderVersion() {
  const label = versionLabel()
  const foot = $('app-version')
  if (foot) foot.textContent = label
  const header = $('header-version')
  if (header) header.textContent = versionInfo && (versionInfo.version || versionInfo.appVersion) ? 'v' + (versionInfo.version || versionInfo.appVersion) : 'Version unknown'
  const slot = $('about-version')
  if (!slot) return
  const info = versionInfo || {}
  const rows = [['Version', info.version || info.appVersion || 'Unknown']]
  if (info.commit) rows.push(['Commit', String(info.commit).slice(0, 7)])
  if (info.deployedAt) {
    const built = new Date(info.deployedAt)
    rows.push(['Build time', Number.isNaN(built.getTime()) ? String(info.deployedAt) : built.toLocaleString('en-GB', { hour12: false })])
  }
  if (info.workerVersion) rows.push(['Deployment version', String(info.workerVersion)])
  slot.innerHTML = rows.map(([label, value]) => '<div class="about-row"><span>' + esc(label) + '</span><b>' + esc(String(value)) + '</b></div>').join('')
}
function openAbout() {
  openModal('About', '<div class="hint">Secrets Broker keeps your secrets in your own Cloudflare account, releases them to an Agent on demand and for a limited time, and logs every read.</div><div id="about-version" style="margin-top:10px"></div><div class="hint" style="margin-top:10px"><a href="https://github.com/otscup/secrets-broker-workers" target="_blank" rel="noreferrer">github.com/otscup/secrets-broker-workers</a></div>')
  loadVersion(true).catch(() => {})
}

function renderAvatar(name, avatarUrl) { const el = $('avatar'); if (!el) return; el.textContent = String(name || 'SB').trim().slice(0, 2).toUpperCase(); // Initials are the default. A picture is only used when the profile names one,
  // so the header never shows the site logo twice.
  const url = avatarUrl; if (!url) return; const img = document.createElement('img'); img.alt = ''; img.decoding = 'async'; // Only swap the initials for a picture once one actually decoded: a URL that
  // answers 200 with an empty body would otherwise cover them with nothing.
  img.onload = () => { if (img.naturalWidth > 0) { el.textContent = ''; el.appendChild(img) } }; img.onerror = () => img.remove(); img.src = url }
// ---- Device-bound long-term unlock -----------------------------------------
// The DEK never stays on the server for weeks: this browser keeps the device
// private key plus its one-time token, unwraps locally, and fills the server
// cache for an hour at a time. Losing the browser storage is harmless; revoking
// the device is the real kill switch.
const DEVICE_DB = 'secrets-broker-device'
function deviceDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DEVICE_DB, 1)
    request.onupgradeneeded = () => request.result.createObjectStore('keys')
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
async function deviceGet() {
  try {
    const db = await deviceDb()
    return await new Promise((resolve, reject) => {
      const request = db.transaction('keys', 'readonly').objectStore('keys').get('self')
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  } catch { return null }
}
async function deviceSet(record) {
  const db = await deviceDb()
  await new Promise((resolve, reject) => {
    const request = db.transaction('keys', 'readwrite').objectStore('keys').put(record, 'self')
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
async function deviceClear() {
  try {
    const db = await deviceDb()
    await new Promise((resolve) => {
      const request = db.transaction('keys', 'readwrite').objectStore('keys').delete('self')
      request.onsuccess = () => resolve(); request.onerror = () => resolve()
    })
  } catch {}
}
function b64ToBytes(text) {
  const raw = atob(String(text))
  const bytes = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i)
  return bytes
}
async function unwrapDeviceEnvelope(envelope, privateJwk) {
  const box = typeof envelope === 'string' ? JSON.parse(envelope) : envelope
  if (!box || box.kind !== 'device') throw new Error('not a device envelope')
  const priv = await crypto.subtle.importKey('jwk', privateJwk, { name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveBits'])
  const pub = await crypto.subtle.importKey('jwk', box.ephemeralJwk, { name: 'ECDH', namedCurve: 'P-256' }, false, [])
  const shared = await crypto.subtle.deriveBits({ name: 'ECDH', public: pub }, priv, 256)
  const base = await crypto.subtle.importKey('raw', shared, 'HKDF', false, ['deriveBits'])
  const salt = new TextEncoder().encode(JSON.stringify(box.ephemeralJwk))
  const bits = await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info: new TextEncoder().encode('sb-v2-dek') }, base, 256)
  const kek = await crypto.subtle.importKey('raw', bits, { name: 'AES-GCM' }, false, ['decrypt'])
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToBytes(box.iv) }, kek, b64ToBytes(box.ct))
  return new Uint8Array(plain)
}
async function bindThisDevice() {
  const pair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits'])
  const publicJwk = await crypto.subtle.exportKey('jwk', pair.publicKey)
  const privateJwk = await crypto.subtle.exportKey('jwk', pair.privateKey)
  const paired = await api('/api/v2/device/self-pair', { method: 'POST', body: JSON.stringify({ name: 'This browser', publicJwk }) })
  await deviceSet({ deviceId: paired.deviceId, token: paired.token, privateJwk, createdAt: Date.now() })
  return paired
}
async function tryDeviceOpen() {
  const credential = await deviceGet()
  if (!credential) return false
  try {
    const response = await fetch('/api/v2/device/self', { headers: { authorization: 'Bearer ' + credential.token }, credentials: 'include' })
    if (response.status === 401 || response.status === 404) { await deviceClear(); return false }
    if (!response.ok) return false
    const self = await response.json()
    const dek = await unwrapDeviceEnvelope(self.envelope, credential.privateJwk)
    await api('/api/v2/device/open', { method: 'POST', headers: { authorization: 'Bearer ' + credential.token }, body: JSON.stringify({ dek: Array.from(dek) }) })
    app.me.unlocked = true
    app.me.viaDevice = true
    return true
  } catch { return false }
}
function renderLockedSurface() {
  const bar = $('locked-bar')
  if (!bar) return
  const locked = app.locked === true
  const plainGate = !locked && app.me?.unlocked === true && app.v2?.initialized === true && app.plainOk === false
  bar.classList.toggle('hidden', !locked && !plainGate)
  if (locked) {
    // Only a zero-knowledge vault has names worth hiding; a legacy vault keeps
    // them in plaintext at rest, so the bar must not claim a mask it never applied.
    $('locked-text').textContent = app.data?.masked === true
      ? 'Locked · Item names are redacted. Approvals and viewing still work; unlock before reading plaintext'
      : 'Locked · Approvals still work; unlock to view secrets and plaintext'
    $('locked-unlock').textContent = 'Unlock here'
    $('locked-unlock').dataset.mode = 'unlock'
  } else if (plainGate) {
    $('locked-text').textContent = 'Unlocked · Showing item names needs a code, asked only once per unlock'
    $('locked-unlock').textContent = 'Verify and show'
    $('locked-unlock').dataset.mode = 'plain'
  }
}
async function boot() { try { app.me = await api('/api/me'); show('login-card', false); $('who').textContent = app.me.name || String(app.me.email || '').split('@')[0] || ''; $('site-title').textContent = app.me.siteName || 'Secrets Broker'; renderAvatar(app.me.name || app.me.email, app.me.avatarUrl); show('lock', true); const vault = await api('/api/v2/status').catch(() => null); app.v2 = vault; applyTierAvailability(); app.plainOk = vault?.initialized === true ? vault.plainOk !== false : true; if (!app.me.unlocked && sessionStorage.getItem('broker-lock-intent') !== '1') await tryDeviceOpen().catch(() => false); app.locked = app.me.unlocked !== true; // A vault that exists but is locked opens straight into the console: approvals
  // and masking work without the key. Only an uninitialized vault needs the
  // entry screen, because it has nothing to browse.
  const canBrowse = app.me.unlocked === true || vault?.initialized === true; show('dashboard', canBrowse); show('unlock-card', !canBrowse); if (canBrowse) { await loadAll(); renderLockedSurface(); if (new URLSearchParams(location.search).get('view') === 'profile') { document.querySelectorAll('.view').forEach((section) => section.classList.toggle('hidden', section.id !== 'view-profile')); syncGlobeToView('profile'); document.querySelectorAll('#nav button').forEach((button) => button.classList.remove('active')); await loadProfile(); history.replaceState({}, '', '/') } } } catch { show('login-card', true); show('dashboard', false); show('unlock-card', false); loadOidcLogin() } }
$('page-refresh').onclick = refreshCurrent
$('site-title').onclick = () => { location.href = '/' }
$('site-logo').onclick = () => { location.href = '/' }
async function refreshCurrent() {
  const view = document.querySelector('.view:not(.hidden)')?.id?.replace('view-', '') || 'overview'
  try {
    if (view === 'overview') await Promise.all([loadState(), loadStats(), loadRecent()])
    else if (view === 'items') await Promise.all([loadState(), loadItems()])
    else if (view === 'agents' || view === 'grants') await loadState()
    else if (view === 'logs') { await loadState(); await refreshLogs() }
    else if (view === 'profile') await Promise.all([loadProfile(), loadState()])
    else if (view === 'settings') await loadSettings()
    toast('Refreshed')
  } catch (error) { toast(error.message, true) }
}
async function loadOidcLogin() {
  try {
    const data = await api('/api/oidc/status')
    if (!data.enabled) { $('login-oidc').innerHTML = '<span class="hint">OIDC not configured</span>'; return }
    // One button per provider, so the operator picks the identity to use.
    const providers = data.providers || []
    const buttons = []
    for (const provider of providers) {
      const label = provider.label || provider.id
      buttons.push('<a href="/oidc/login?provider=' + encodeURIComponent(provider.id) + '" style="margin-right:8px"><button class="primary">Log in with ' + esc(label) + '</button></a>')
    }
    $('login-oidc').innerHTML = buttons.join('')
  } catch {}
}
function when(value) {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('en-GB', { hour12: false })
}
$('mat-save').onclick = async () => {
  try {
    const paths = $('mat-paths').value.split('\n').map((line) => line.trim()).filter(Boolean)
    status('mat-status', 'Saving…')
    await api('/api/settings', { method: 'POST', body: JSON.stringify({ materializePaths: paths }) })
    status('mat-status', 'Saved ' + paths.length + ' paths', 'ok')
  } catch (error) { status('mat-status', error.message, 'error') }
}
$('bs-save').onclick = async () => {
  try {
    status('bs-status', 'Saving…')
    await api('/api/settings', { method: 'POST', body: JSON.stringify({ webPlaintext: $('bs-web').checked, unclassifiedPlaintext: $('bs-unclassified').checked, useAnyTarget: $('bs-target').checked, expiryBlocksReads: $('bs-expiry').checked, rotateReminderDays: Number($('bs-rotate-days').value) || 0 }) })
    status('bs-status', 'Saved', 'ok')
  } catch (error) { status('bs-status', error.message, 'error') }
}
$('login').onclick = async () => {
  const button = $('login')
  button.disabled = true
  button.dataset.idle = button.textContent
  button.textContent = 'Logging in…'
  button.setAttribute('aria-busy', 'true')
  status('login-status', 'Logging in…')
  try {
    await api('/api/login', { method: 'POST', body: JSON.stringify({ password: $('admin-password').value, code: $('totp-code').value }) })
    $('admin-password').value = ''
    $('totp-code').value = ''
    show('totp-row', false)
    await boot()
  } catch (error) {
    // The second factor has its own field; reveal it and move the cursor there
    // instead of leaving the operator to guess which box to fill next.
    if (error.status === 401 && error.data?.totpRequired) {
      show('totp-row', true)
      status('login-status', error.data.error || 'Enter your two-factor code', 'error')
      $('totp-code').focus()
    } else {
      status('login-status', error.message, 'error')
      $('admin-password').focus()
    }
  } finally {
    button.disabled = false
    if (button.dataset.idle) button.textContent = button.dataset.idle
    delete button.dataset.idle
    button.removeAttribute('aria-busy')
  }
}
$('avatar').onclick = (event) => { event.stopPropagation(); show('account-menu', $('account-menu').classList.contains('hidden')) }
$('account-about').onclick = () => { show('account-menu', false); openAbout() }
document.addEventListener('click', (event) => { if (!$('account-menu').classList.contains('hidden') && !event.target.closest('#account-menu') && !event.target.closest('#avatar')) show('account-menu', false) })
document.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-revoke-session]'); if (!button) return
  if (!(await askYes('Log this client out?'))) return
  try { await api('/api/sessions/revoke', { method: 'POST', body: JSON.stringify({ id: button.dataset.revokeSession }) }); await loadProfile(); toast('Logged out') } catch (error) { toast(error.message, true) }
})
$('account-logout').onclick = async () => { try { await api('/api/logout', { method: 'POST' }) } catch {} location.reload() }
document.querySelectorAll('#account-menu [data-view]').forEach((button) => { button.onclick = async () => { if (!(await confirmDiscard())) return; if (editor.dirty) closeItemPage(); show('account-menu', false); document.querySelectorAll('#nav button').forEach((b) => b.classList.toggle('active', false)); document.querySelectorAll('.view').forEach((section) => section.classList.toggle('hidden', section.id !== 'view-' + button.dataset.view)); syncGlobeToView(button.dataset.view); if (button.dataset.view === 'settings') loadSettings(); if (button.dataset.view === 'profile') loadProfile() } })
function applyTheme(mode) {
  const next = mode || localStorage.getItem('theme') || 'light'
  const effective = next === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : (next === 'dark' ? 'dark' : 'light')
  document.documentElement.dataset.theme = effective; localStorage.setItem('theme', next)
  const label = next === 'light' ? 'Light' : next === 'dark' ? 'Dark' : 'System'
  const button = $('theme-cycle'); if (button) { button.textContent = next === 'light' ? '☀️' : next === 'dark' ? '🌙' : '💻'; button.title = 'Current: ' + label + ' (click to switch)' }
  // The sign-in screen hides the app bar, so it carries its own theme control.
  const authButton = $('auth-theme'); if (authButton) { authButton.textContent = label + ' · Switch'; authButton.setAttribute('aria-label', 'Switch theme (current: ' + label + ')') }
}
const cycleTheme = () => { const current = localStorage.getItem('theme') || 'auto'; applyTheme(current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light') }
$('theme-cycle').onclick = cycleTheme
$('auth-theme').onclick = cycleTheme
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if ((localStorage.getItem('theme') || 'auto') === 'auto') applyTheme('auto') })
applyTheme()
// Sign-in is a screen of its own. Whenever either auth card is visible the
// shell takes over the viewport; once the dashboard unlocks, it disappears.
// Watching the existing cards keeps every show()/lock() call site unchanged.
// An account with a second factor is asked for the code here, next to the
// password, so the plaintext listing never interrupts with a second prompt
// right after the password was accepted. Accounts without one never see it.
function renderUnlockTotp() {
  const row = $('unlock-totp-row')
  if (!row) return
  const shown = app.me?.totpEnabled === true
  row.classList.toggle('hidden', !shown)
  const input = $('unlock-totp-code')
  if (input && !shown) input.value = ''
}
function syncAuthSurface() {
  const open = !$('login-card').classList.contains('hidden') || !$('unlock-card').classList.contains('hidden')
  $('auth-shell').classList.toggle('hidden', !open)
  document.body.classList.toggle('auth-mode', open)
  if (open) {
    const title = $('site-title').textContent
    if (title) $('auth-site-name').textContent = title
    $('auth-logo').src = $('site-logo').src
    renderUnlockTotp()
  }
}
new MutationObserver(syncAuthSurface).observe($('login-card'), { attributes: true, attributeFilter: ['class'] })
new MutationObserver(syncAuthSurface).observe($('unlock-card'), { attributes: true, attributeFilter: ['class'] })
syncAuthSurface()
// The device tier pairs a browser against the v2 vault, so a legacy vault has
// nothing to bind. Offering it there would promise "long-term" and then expire
// with the one-hour session, so say what is actually available.
function applyTierAvailability() {
  const select = $('ttl')
  const option = select?.querySelector('option[value="device"]')
  if (!option) return
  const supported = app.v2?.initialized === true
  option.disabled = !supported
  option.textContent = supported ? 'Long-term (bind this device)' : 'Long-term (Vault 2.0 only)'
  if (!supported && select.value === 'device') select.value = '12h'
}
function legacyTtlSeconds(tier) {
  if (tier === '12h') return 12 * 60 * 60
  if (tier === '7d') return 7 * 24 * 60 * 60
  if (tier === '30d') return 30 * 24 * 60 * 60
  if (tier === 'device') return 60 * 60
  return 0
}
async function finishUnlock(options = {}) {
  try { sessionStorage.removeItem('broker-lock-intent') } catch {}
  app.locked = false
  app.plainOk = app.v2?.initialized === true ? app.plainOk !== false : true
  if (app.me) app.me.unlocked = true
  show('unlock-card', false); show('dashboard', true)
  if (options.inline) show('modal', false)
  renderLockedSurface()
  await loadAll()
  if (!options.inline) status('unlock-status', 'Unlocked', 'ok')
  // Callers that were mid-approval use this to continue the action they
  // started instead of sending the operator back to find the card again.
  if (typeof options.after === 'function') await options.after()
}
async function unlockV2(password, options = {}) {
  const tier = options.tier || $('ttl')?.value || '12h'
  // "Long-term" is not a longer server cache: it pairs this browser, then asks the
  // server cache for one hour at a time. The other tiers are real expiry values.
  const ttlMs = tier === '7d' ? 7 * 24 * 60 * 60 * 1000
    : tier === '30d' ? 30 * 24 * 60 * 60 * 1000
    : tier === 'device' ? 60 * 60 * 1000
    : 12 * 60 * 60 * 1000
  const code = String(options.code ?? '').replace(/\s+/g, '')
  const payload = { password, ttlMs, duration: tier, confirm: tier !== '12h' }
  // The code rides along with the password so one submit both opens the vault
  // and clears the plaintext listing, instead of asking again right after.
  if (/^\d{6}$/.test(code)) payload.code = code
  const result = await api('/api/v2/unlock', { method: 'POST', body: JSON.stringify(payload) })
  // The response already says whether the plaintext listing is allowed; use it
  // instead of waiting for the next /api/v2/status poll to agree.
  if (typeof result?.plainOk === 'boolean') app.plainOk = result.plainOk
  if (tier === 'device') {
    try { await bindThisDevice() } catch (error) { toast('Couldn’t bind this device: ' + error.message, true) }
  }
  $('master-password').value = ''
  await finishUnlock(options)
}
async function unlockLegacy(password, ttl = '12h', options = {}) {
  // No v2 vault means no device to bind to; a "long-term" pick falls back to
  // the default window instead of quietly expiring after an hour.
  if (ttl === 'device') ttl = '12h'
  const info = await api('/api/bootstrap')
  if (info.kdfType !== 0) throw new Error('This account uses Argon2 KDF (common for imports from NodeWarden/Bitwarden); this console only supports PBKDF2.')
  const masterKey = await pbkdf2(password, String(info.email).toLowerCase(), info.kdfIterations)
  const encKey = await hkdf(masterKey, 'enc', 32), macKey = await hkdf(masterKey, 'mac', 32)
  const userKey = await decryptBw(info.profileKey, encKey, macKey)
  await api('/api/unlock', { method: 'POST', body: JSON.stringify({ symEncKey: b64(userKey.slice(0, 32)), symMacKey: b64(userKey.slice(32, 64)), ttl: legacyTtlSeconds(ttl), duration: ttl, confirm: ttl !== '12h' }) })
  await finishUnlock(options)
}
// The unlock prompt that appears where the user is working. One field, the same
// tier list, and no page swap: approval work continues underneath it.
function inlineUnlockSheet(after) {
  openModal('Unlock here', '<p class="hint">Unlocking only changes whether names and plaintext are visible; you stay on this page, and approvals keep working.</p>'
    + '<label class="field" for="inline-password">Vault master password</label><input id="inline-password" type="password" autocomplete="current-password" enterkeyhint="go">'
    + '<label class="field" for="inline-ttl">Unlock for</label><select id="inline-ttl"><option value="12h" selected>12 hours (default)</option><option value="7d">7 days</option><option value="30d">30 days</option><option value="device">Long-term (bind this device)</option></select>'
    + '<div class="hint">The longer it lasts, the longer anyone who gets hold of this session can read; “Long-term” seals the key on this device until the device is revoked.</div>'
    + '<div class="row"><button class="primary" id="inline-unlock-submit">Unlock</button></div><div class="status" id="inline-unlock-status" role="status" aria-live="polite"></div>')
  $('inline-password').focus()
  $('inline-password').onkeydown = (event) => { if (event.key === 'Enter') $('inline-unlock-submit').click() }
  $('inline-unlock-submit').onclick = async () => {
    const button = $('inline-unlock-submit')
    const password = $('inline-password').value
    if (!password) { status('inline-unlock-status', 'Enter the Vault master password first', 'error'); $('inline-password').focus(); return }
    button.disabled = true; button.setAttribute('aria-busy', 'true'); button.textContent = 'Unlocking…'
    status('inline-unlock-status', 'Deriving the key locally…')
    try {
      const v2 = app.v2 || await api('/api/v2/status').catch(() => null)
      if (v2?.initialized) await unlockV2(password, { inline: true, tier: $('inline-ttl').value, after })
      else await unlockLegacy(password, $('inline-ttl').value, { inline: true, after })
    } catch (error) {
      status('inline-unlock-status', error.message, 'error')
      $('inline-password').focus()
    } finally {
      button.disabled = false; button.removeAttribute('aria-busy'); button.textContent = 'Unlock'
    }
  }
}
$('unlock').onclick = async () => {
  const password = $('master-password').value
  const button = $('unlock')
  const codeField = $('unlock-totp-code')
  const needsCode = app.me?.totpEnabled === true
  const code = needsCode ? String(codeField?.value || '').replace(/\s+/g, '') : ''
  // An empty field used to do literally nothing: no message, no focus, no sign
  // that the click was seen. Say what is missing and put the cursor there.
  if (!password) { status('unlock-status', 'Enter the Vault master password first', 'error'); $('master-password').focus(); return }
  if (needsCode && !/^\d{6}$/.test(code)) { status('unlock-status', 'Enter the 6-digit code from your phone', 'error'); codeField?.focus(); return }
  button.disabled = true
  button.setAttribute('aria-busy', 'true')
  button.textContent = 'Unlocking…'
  status('unlock-status', 'Deriving the key locally in your browser… (about 0.3–1 seconds)')
  try {
    // Vault 2.0 has its own password envelope. If it is active, unlock it
    // directly instead of requiring the legacy NodeWarden KDF metadata.
    const v2 = await api('/api/v2/status').catch(() => null)
    app.v2 = v2
    if (v2?.initialized) return await unlockV2(password, { code })
    await unlockLegacy(password, $('ttl').value)
    $('master-password').value = ''
  } catch (error) {
    // A wrong code must not cost the typed password: say what to fix and send
    // the cursor to the code field instead of the password field.
    const badCode = needsCode && /verification code/i.test(error.message || '')
    status('unlock-status', badCode ? 'Wrong verification code: enter the 6-digit code again (no need to retype the password)' : error.message, 'error')
    if (badCode) codeField?.focus()
    else $('master-password').focus()
  } finally {
    button.disabled = false
    button.removeAttribute('aria-busy')
    button.textContent = 'Unlock'
  }
}
$('master-password').onkeydown = (event) => { if (event.key === 'Enter') $('unlock').click() }
$('unlock-totp-code').onkeydown = (event) => { if (event.key === 'Enter') $('unlock').click() }
$('admin-password').onkeydown = (event) => { if (event.key === 'Enter') $('login').click() }
$('totp-code').onkeydown = (event) => { if (event.key === 'Enter') $('login').click() }
$('init-v2').onclick = async () => {
  const password = $('master-password').value
  if (password.length < 12) return status('unlock-status', 'Password must be at least 12 characters', 'error')
  if (!(await askYes('Initialize Vault 2.0? This creates a separate set of data keys; existing NodeWarden items are not migrated automatically.'))) return
  try {
    await api('/api/v2/init', { method: 'POST', body: JSON.stringify({ password }) })
    await unlockV2(password, { code: $('unlock-totp-code')?.value || '' })
  } catch (error) { status('unlock-status', error.message, 'error') }
}
api('/api/v2/status').then((v2) => { if (v2.initialized) $('init-v2').classList.add('hidden') }).catch(() => {})
async function lock() {
  // prompt() is silently refused inside the desktop WebView, so the lock
  // button did nothing there. Ask in the page instead.
  const password = await askCode('Locking clears the current vault session, and every Agent loses read access at once. To use it again, unlock with the account’s master password.', { type: 'password', inputmode: 'text', placeholder: 'Current console password', maxlength: 0, label: 'Console password' })
  if (!password) return
  try {
    await api('/api/lock', { method: 'POST', body: JSON.stringify({ password }) })
    // Locking ends the key session, not the console session. Stay on the page so
    // pending approvals can still be decided; names fall back to masks.
    // An explicit lock must survive a reload in this tab; otherwise the device
    // credential would silently reopen it and the button would mean nothing.
    try { sessionStorage.setItem('broker-lock-intent', '1') } catch {}
    app.locked = true; app.plainOk = app.v2?.initialized === true ? false : true
    if (app.me) app.me.unlocked = false
    renderLockedSurface(); toast('Locked: names are redacted, approvals still work')
    await loadAll()
  } catch (error) { toast(error.message, true) }
}
$('lock').onclick = lock; $('lock2').onclick = lock
// Browsing while locked is a first-class path now: approvals need no key, and
// this button is the single place that offers to change that.
$('unlock-browse').onclick = async () => {
  show('unlock-card', false); show('dashboard', true)
  app.locked = true
  renderLockedSurface()
  await loadAll()
}
$('locked-unlock').onclick = () => {
  if ($('locked-unlock').dataset.mode === 'plain') loadVault2(true).catch((error) => toast(error.message, true))
  else inlineUnlockSheet()
}
document.addEventListener('click', (event) => {
  // The connection card lives inside the pending modal, so unlocking from it
  // has to rebuild that queue on the way back; the generic form below would
  // leave the operator staring at a closed modal.
  const connTrigger = event.target.closest('[data-conn-unlock]')
  if (connTrigger) {
    event.preventDefault()
    inlineUnlockSheet(() => openPendingSheet())
    return
  }
  const trigger = event.target.closest('[data-inline-unlock]')
  if (!trigger) return
  event.preventDefault()
  inlineUnlockSheet()
})
document.querySelectorAll('#nav button').forEach((button) => { button.onclick = async () => { const view = button.dataset.view
  // Switching tabs replaces what the open detail page was describing, so the
  // same unsaved edits must not vanish just because the exit is a tab.
  if (!(await confirmDiscard())) return
  if (editor.dirty) closeItemPage()
  document.querySelectorAll('#nav button').forEach((b) => b.classList.toggle('active', b === button)); document.querySelectorAll('.view').forEach((section) => section.classList.toggle('hidden', section.id !== 'view-' + view)); syncGlobeToView(view); if (view === 'devices') loadVault2(false); if (view === 'settings') loadSettings(); if (view === 'profile') loadProfile(); if (view === 'logs') refreshLogs() } })
document.querySelectorAll('#range-row button').forEach((button) => { button.onclick = () => { app.range = button.dataset.range; document.querySelectorAll('#range-row button').forEach((b) => b.classList.toggle('on', b === button)); loadStats() } })
// ── Global search ───────────────────────────────────────────────────────────
// One box on the overview searches every source the console already keeps in
// app, so no other page needs its own search field. Groups cap at 8 rows and
// the list at 60, so a one-letter query cannot build thousands of rows.
function globalSearch(query) {
  // '' includes '' would match every row, so the empty guard lives here and not
  // only in the caller. Same for the case fold, so any caller gets one behaviour.
  query = String(query ?? '').trim().toLowerCase()
  if (!query) return []
  const hit = (...values) => values.some((value) => String(value ?? '').toLowerCase().includes(query))
  const groups = []
  const add = (label, view, list) => { if (list.length) groups.push({ label, view, list }) }
  add('Agent', 'agents', (app.data.agents || []).filter((agent) => hit(agent.name, agent.alias, agent.note))
    .map((agent) => ({ title: agentDisplayName(agent), sub: agent.name, name: agent.name })))
  add('Secrets', 'items', (app.items || []).filter((item) => hit(item.name, item.group, item.url))
    .map((item) => ({ title: item.name, sub: item.group || item.url || '', name: item.name })))
  add('Grants', 'grants', (app.data.grants || []).filter((grant) => hit(agentLabel(grant.agent), grant.agent, grant.name))
    .map((grant) => ({ title: grant.name, sub: agentLabel(grant.agent) })))
  add('Pending approval', 'grants', (app.data.pending || []).filter((request) => hit(agentLabel(request.agent), request.agent, request.name))
    .map((request) => ({ title: request.name, sub: agentLabel(request.agent) })))
  add('Logs', 'logs', (app.data.audit || []).filter((entry) => hit(entry.event, entry.agent, entry.name))
    .map((entry) => ({ title: describeEvent(entry) || entry.event, sub: [agentLabel(entry.agent), entry.name].filter(Boolean).join(' · ') })))
  add('Blocked requests', 'grants', (app.data.deniedAttempts || []).filter((entry) => hit(entry.agent, entry.name))
    .map((entry) => ({ title: entry.name, sub: agentLabel(entry.agent) + (entry.reason ? ' · ' + entry.reason : '') })))
  return groups
}
function renderGlobalSearch() {
  const box = $('global-search-results')
  if (!box) return
  const input = $('global-search')
  const query = String((input && input.value) || '').trim().toLowerCase()
  if (!query) { box.innerHTML = ''; box.classList.add('hidden'); return }
  const groups = globalSearch(query)
  const html = []
  let left = 60
  for (const group of groups) {
    if (left <= 0) break
    const shown = group.list.slice(0, Math.min(8, left))
    left -= shown.length
    html.push('<div class="gs-group-title">' + esc(group.label) + ' · ' + group.list.length + '</div>')
    for (const row of shown) {
      html.push('<button class="gs-row" data-goto="' + esc(group.view) + '"' + (row.name ? ' data-name="' + esc(row.name) + '"' : '') + '><b>' + esc(row.title) + '</b>' + (row.sub ? ' <span class="gs-sub">' + esc(row.sub) + '</span>' : '') + '</button>')
    }
    if (group.list.length > shown.length) html.push('<div class="gs-more">' + (group.list.length - shown.length) + ' more</div>')
  }
  box.innerHTML = html.length ? html.join('') : '<div class="hint">Nothing matches “' + esc(query) + '”</div>'
  box.classList.remove('hidden')
}
if ($('global-search')) {
  $('global-search').oninput = renderGlobalSearch
  $('global-search').onkeydown = (event) => { if (event.key === 'Escape') { event.target.value = ''; renderGlobalSearch() } }
}
// A row opens the page that owns the hit; the nav click keeps the active tab and
// the hidden-view toggling in one place instead of duplicating it here.
$('global-search-results').addEventListener('click', (event) => {
  const row = event.target.closest('[data-goto]')
  if (!row) return
  const view = row.dataset.goto
  const tab = document.querySelector('#nav [data-view=' + view + ']')
  if (tab) tab.click()
  if ($('item-sort')) $('item-sort').value = localStorage.getItem('sb-item-sort') || 'name'
  if (view === 'items') { const filter = $('item-filter'); if (filter) { filter.value = row.dataset.name || ''; renderItems() } }
  if (view === 'agents') openAgentDetail(row.dataset.name)
})
$('trend-prev').onclick = () => { trendFace = (trendFace + trendFaces.length - 1) % trendFaces.length; renderTrendFace() }
$('trend-next').onclick = () => { trendFace = (trendFace + 1) % trendFaces.length; renderTrendFace() }
$('items-refresh').onclick = loadItems; $('items-select').onclick = () => { itemsSelecting = !itemsSelecting; if (!itemsSelecting) selectedItems.clear(); $('items-select').textContent = itemsSelecting ? 'Done' : 'Select'; renderItems() }; $('item-filter').oninput = () => { if ($('item-filter').value.trim()) localStorage.setItem('sb-item-filter', $('item-filter').value); else localStorage.removeItem('sb-item-filter'); renderItems() }; $('item-sort').onchange = () => { localStorage.setItem('sb-item-sort', $('item-sort').value); renderItems() }; $('item-density').onclick = () => { const dense = $('item-density').getAttribute('aria-pressed') !== 'true'; if (dense) localStorage.setItem('sb-item-density', 'compact'); else localStorage.removeItem('sb-item-density'); setItemDensity(dense) }; $('item-create').onclick = createItemMenu; $('item-import').onclick = () => $('import-file').click(); $('import-file').onchange = importItems; $('item-export').onclick = exportItems; $('bulk-share').onclick = openBulkShare; $('bulk-kind').onclick = openBulkKind; $('bulk-delete').onclick = bulkDelete; $('bulk-clear').onclick = () => { selectedItems.clear(); renderItems() }; $('settings-save').onclick = saveSettings; $('ai-save').onclick = saveAiSettings; $('ai-model-fetch').onclick = fetchCustomModels; $('ai-help').onclick = () => openAiHelp();; $('ai-test').onclick = async () => { try { status('ai-status', 'Testing…'); const d = await api('/api/ai/ask', { method: 'POST', body: JSON.stringify({ question: 'In one sentence, say what you can see and name the one thing that most needs attention right now.' }) }); status('ai-status', d.ok ? ('Working (' + ('custom API') + '): ' + d.text.slice(0, 120)) : ('Not working: ' + (d.error || '')), d.ok ? 'ok' : 'error') } catch (e) { status('ai-status', e.message, 'error') } }; $('notify-test').onclick = testNotifications; $('notify-test-approval').onclick = () => testNotifications(true); $('oidc-new').onclick = () => showOidcProviderForm(); $('op-save').onclick = saveOidcProvider; $('op-cancel').onclick = () => $('oidc-provider-form').classList.add('hidden'); $('op-discover').onclick = discoverOidcProvider; $('op-probe').onclick = probeOidcProvider; $('profile-save').onclick = saveProfile; $('password-save').onclick = changePassword; $('totp-setup').onclick = setup2fa; $('totp-enable').onclick = enable2fa; $('totp-disable').onclick = disable2fa; $('enable-browser-notify').onclick = enableBrowserNotifications; $('enable-webpush').onclick = enableWebPush; $('test-webpush').onclick = testWebPush; $('test-browser-notify').onclick = () => showBrowserNotification('Test notification', 'Browser notifications are working'); $('vault-switch').onclick = switchAccount; $('vault-folder-save').onclick = saveFolder
// A reload should not silently reset how the list was being looked at: the
// filter, the sort and the density are view state, not one-off input.
{ const savedFilter = localStorage.getItem('sb-item-filter'); if (savedFilter && $('item-filter')) $('item-filter').value = savedFilter }
{ const savedSort = localStorage.getItem('sb-item-sort'); if (savedSort && $('item-sort')) $('item-sort').value = savedSort }
setItemDensity(localStorage.getItem('sb-item-density') === 'compact')
// Labels are written next to their control, not pointed at it; wire them once
// the markup exists and keep watching for panels that render later.
associateLabels()
new MutationObserver(() => associateLabels()).observe(document.body, { childList: true, subtree: true })
$('mcp-url').textContent = location.origin + '/mcp'
$('pair-command').textContent = 'secrets-broker pair --url ' + location.origin
$('v2-refresh').onclick = loadVault2
$('devices-refresh').onclick = () => loadVault2(false)
$('v2-devices').addEventListener('click', async (event) => {
  const write = event.target.closest('[data-v2-write]')
  if (write) {
    const on = write.dataset.write === '1'
    write.disabled = true
    try {
      await api('/api/v2/devices/' + encodeURIComponent(write.dataset.v2Write), { method: 'PATCH', body: JSON.stringify({ canWrite: !on }) })
      await loadVault2(false)
      $('devices-msg').textContent = on ? 'Now read-only: this device can no longer write with push' : 'Writes allowed: this device can push now'
    } catch (error) { $('devices-msg').textContent = error.message; write.disabled = false }
    return
  }
  const purge = event.target.closest('[data-v2-purge]')
  if (purge) {
    const name = purge.closest('[data-device]')?.querySelector('b')?.textContent || ''
    // The desktop WebView drops native confirm(), and the row silently survived
    // the click. Ask in the page: same wording, danger-weighted confirmation.
    if (!(await askYes('Delete the record for device “' + name + '”?\n\n“Delete record” only works on revoked devices. The record and the key envelopes it left behind are removed for good and can’t be recovered.', { yes: 'Delete record', no: 'Cancel' }))) return
    purge.disabled = true
    try {
      await api('/api/v2/devices/' + encodeURIComponent(purge.dataset.v2Purge) + '?purge=1', { method: 'DELETE' })
      await loadVault2(false)
      $('devices-msg').textContent = 'Deleted the record for “' + name + '”'
    } catch (error) { $('devices-msg').textContent = error.message; purge.disabled = false }
    return
  }
  const button = event.target.closest('[data-v2-revoke]')
  if (!button) return
  const name = button.closest('[data-device]')?.querySelector('b')?.textContent || ''
  if (!(await askYes('Revoke device “' + name + '”?\n\n“Revoke” stops it from pulling items. Keys it already holds keep working until you run a re-encryption.', { yes: 'Revoke', no: 'Cancel' }))) return
  button.disabled = true
  try {
    await sensitiveRequest('/api/v2/devices/' + encodeURIComponent(button.dataset.v2Revoke), 'DELETE', {}, 'Revoke device')
    // Revoking this browser's own credential must also drop the local copy,
    // otherwise the console would keep trying a token the server already killed.
    const local = await deviceGet()
    if (local && local.deviceId === button.dataset.v2Revoke) await deviceClear()
    await loadVault2(false)
    $('devices-msg').textContent = 'Revoked “' + name + '”'
  } catch (error) { $('devices-msg').textContent = error.message; button.disabled = false }
})
$('v2-unlock').onclick = async () => {
  const password = $('v2-password').value
  const initialising = $('v2-unlock').textContent === 'Initialize'
  if (!password) { $('v2-msg').textContent = 'Enter the master password first'; return }
  try {
    await api(initialising ? '/api/v2/init' : '/api/v2/unlock', { method: 'POST', body: JSON.stringify({ password, ttlMs: 12 * 60 * 60 * 1000, duration: '12h' }) })
    $('v2-password').value = ''
    app.locked = false
    if (app.me) app.me.unlocked = true
    renderLockedSurface()
    await Promise.all([loadVault2(), loadItems()])
    $('v2-msg').textContent = initialising ? 'Initialized and unlocked' : 'Unlocked'
  } catch (error) { $('v2-msg').textContent = error.message }
}
$('v2-lock').onclick = async () => {
  try { await api('/api/v2/lock', { method: 'POST' }); await Promise.all([loadVault2(), loadItems()]) } catch (error) { $('v2-msg').textContent = error.message }
}
$('v2-import').onclick = async () => {
  const oldPassword = $('v2-legacy-password').value
  if (!oldPassword) { $('v2-msg').textContent = 'Enter the old vault’s master password first'; return }
  // Import copies the whole legacy vault, so the confirmation stays in-page for
  // the same reason as the device buttons: a refused native dialog looks like a
  // dead button.
  if (!(await askYes('Unlock the old vault once with its master password and copy its items into Vault 2.0? The original vault is left untouched.', { yes: 'Start import', no: 'Cancel' }))) return
  $('v2-msg').textContent = 'Unlocking the old vault and importing…'
  try {
    await unlockLegacy(oldPassword)
    const result = await api('/api/v2/import', { method: 'POST' })
    $('v2-legacy-password').value = ''
    await Promise.all([loadVault2(), loadItems()])
    $('v2-msg').textContent = 'Imported ' + result.imported + ' items, skipped ' + result.skipped + ' (' + result.total + ' total)'
  } catch (error) { $('v2-msg').textContent = error.message }
}
// Collapsible settings cards. One delegated handler covers every card, so a
// new collapsible card needs no extra wiring.
document.addEventListener('click', (event) => {
  const toggle = event.target.closest('[data-collapse]')
  if (!toggle) return
  const card = $(toggle.dataset.collapse)
  if (card) card.classList.toggle('collapsed')
})
const copyTokenBtn = $('copy-token'); if (copyTokenBtn) copyTokenBtn.onclick = async () => { try { await navigator.clipboard.writeText(app.token); toast('Copied the token') } catch { toast('Copy failed', true) } }
$('modal-close').onclick = () => show('modal', false)
$('modal-body').addEventListener('click', (event) => { const grantEdit = event.target.closest('[data-item-grant]'); if (grantEdit) { openGrantMenu(grantEdit.dataset.agent, grantEdit.dataset.name); } })
$('modal-close-x').onclick = () => show('modal', false)
$('modal').addEventListener('click', (event) => { if (event.target === $('modal')) show('modal', false) })
// Escape closes the dialog, unless a confirmation sits on top of it. Both
// listeners are on document, so without this guard one key press would take
// the confirmation *and* the dialog underneath.
document.addEventListener('keydown', (event) => { if (event.key !== 'Escape') return; if (document.querySelector('.ask')) return; if (!$('modal').classList.contains('hidden')) show('modal', false) })
// “Blocked requests” lives in its own card, not inside items-box, so the handler is
// bound to that table. Binding it to items-box was why the Grant and Ignore buttons did nothing.
$('denied-list').addEventListener('click', async (event) => {
  const allowDenied = event.target.closest('[data-allow-denied]')
  if (allowDenied) { openAllowDenied(allowDenied.dataset.agent, allowDenied.dataset.name, allowDenied.dataset.action); return }
  // Scope is a different axis from grants: this only opens the door, it does
  // not hand over anything. The agent record carries the allow list, so append
  // to it and leave every other field untouched (the API patches partially).
  const scopeDenied = event.target.closest('[data-scope-denied]')
  if (scopeDenied) {
    const agentName = scopeDenied.dataset.agent
    const name = scopeDenied.dataset.name
    const agent = ((app.data && app.data.agents) || []).find((entry) => entry.name === agentName)
    if (!agent) { toast('Can’t find this Agent; check that it still exists', true); return }
    if (agent.allowAll) { toast('This Agent can already request every item; nothing to add', true); return }
    const allow = Array.from(new Set([...(agent.allow || []), name]))
    scopeDenied.disabled = true
    try {
      await api('/api/agents/update', { method: 'POST', body: JSON.stringify({ name: agent.name, allow }) })
      await refreshAll()
      toast('Added “' + name + '” to the requestable scope of “' + agentName + '”; authorize it next')
    } catch (error) { toast(error.message, true); scopeDenied.disabled = false }
    return
  }
  const allowPlaintext = event.target.closest('[data-allow-plaintext]')
  if (allowPlaintext) {
    const days = Number(allowPlaintext.dataset.days || 1)
    try {
      await api('/api/fill/read-policy', { method: 'POST', body: JSON.stringify({ item: allowPlaintext.dataset.name, allow: true, ttlDays: days }) })
      await refreshAll()
      toast('Plaintext reads allowed for ' + days + ' day(s)')
    } catch (error) { toast(error.message, true) }
    return
  }
  const allowUse = event.target.closest('[data-allow-use]')
  if (allowUse) { openAllowUse(allowUse.dataset.agent, allowUse.dataset.name); return }
  const dismissDenied = event.target.closest('[data-dismiss-denied]')
  if (dismissDenied) {
    try {
      await api('/api/denied/dismiss', { method: 'POST', body: JSON.stringify({ agent: dismissDenied.dataset.agent, name: dismissDenied.dataset.name, action: dismissDenied.dataset.action }) })
      await refreshAll(); toast('Dismissed')
    } catch (error) { toast(error.message, true) }
  }
})
$('items-box').addEventListener('click', async (event) => {
  const grantEdit = event.target.closest('[data-item-grant]'); if (grantEdit) { openGrantMenu(grantEdit.dataset.agent, grantEdit.dataset.name); return } const menu = event.target.closest('[data-item-menu]'); if (menu) { if (!(await confirmDiscard())) return; openItemMenu(menu.dataset.itemMenu); return } const toggle = event.target.closest('[data-policy]'); if (toggle) { const item = app.items.find((entry) => entry.name === toggle.dataset.policy); if (!item) return; try { await sensitivePost('/api/policies', { name: item.name, noApproval: !item.noApproval }, 'Change no-approval policy'); await loadItems(); toast('No-approval policy updated') } catch (error) { toast(error.message, true) } return } const read = event.target.closest('[data-read]'); if (read) reveal(read.dataset.read) })
// The row body is a div with role="button". A click opens it, so Enter and
// Space have to do the same or the row is visible but unreachable by keyboard.
$('items-box').addEventListener('keydown', async (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return
  const row = event.target.closest('[data-item-menu]')
  if (!row || event.target !== row) return
  event.preventDefault()
  if (!(await confirmDiscard())) return
  openItemMenu(row.dataset.itemMenu)
})
$('agents-box').addEventListener('click', (event) => {
  const extend = event.target.closest('[data-agent-extend]')
  if (extend) { event.stopPropagation(); openExtendMenu(extend.dataset.agentExtend); return }
  const menu = event.target.closest('[data-agent-menu]')
  if (menu) { event.stopPropagation(); openAgentMenu(menu.dataset.agentMenu); return }
  const row = event.target.closest('[data-agent-open]')
  if (row) openAgentDetail(row.dataset.agentOpen)
})
const noticeBar = $('notice-bar')
if (noticeBar) {
  // One banner, two kinds. With approvals waiting it opens the approvals
  // panel — the same sheet the KPI card opens — so the two counters agree.
  // With only reminders it opens the reminder sheet.
  // The inline approval buttons live inside the bar, so one dispatcher has to
  // tell them apart from a plain click (which still opens the full queue).
  noticeBar.onclick = (event) => {
    const quick = event.target.closest('[data-quick-decide]')
    if (quick) { event.stopPropagation(); decideQuickApproval(quick); return }
    if (event.target.closest('[data-notice-notify]')) { event.stopPropagation(); askNotifyFromBar(); return }
    if (event.target.closest('[data-notice-push]')) { event.stopPropagation(); enableWebPushFromBar(); return }
    if (event.target.closest('[data-notice-approve-more]')) { event.stopPropagation(); openNotices(); return }
    openNotices()
  }
  noticeBar.onkeydown = (event) => {
    // Keys pressed on a button inside the bar belong to that button, not to the
    // bar's own open-the-sheet shortcut.
    if (event.target.closest('[data-quick-decide],[data-notice-notify],[data-notice-push],[data-notice-approve-more]')) return
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openNotices() }
  }
}
$('agent-new').onclick = openAgentCreate
const agentMatrixButton = $('agent-matrix'); if (agentMatrixButton) agentMatrixButton.onclick = openPermissionMatrix
$('agent-search').oninput = renderAgents
$('agent-type-filter').onchange = renderAgents
$('agent-sort').onchange = renderAgents
// Every filter asks the server for its own window; the browser never holds the
// full trail just to narrow it.
$('logs-item-filter').onchange = () => refreshLogs()
$('logs-agent-filter').onchange = () => refreshLogs()
$('logs-event-filter').onchange = () => refreshLogs()
$('logs-search').oninput = scheduleLogs
$('logs-from').onchange = () => refreshLogs()
$('logs-to').onchange = () => refreshLogs()
$('logs-reset').onclick = resetLogFilters
$('logs-more').onclick = () => refreshLogs(true)
// Export carries the current filter and still asks for the second factor.
const logsExport = $('logs-export'); if (logsExport) logsExport.onclick = () => exportAuditCsv().catch((error) => toast(error.message, true))
// A checkbox list of what actually exists, so the operator picks from real
// item and group names instead of guessing at comma-separated text. Rendered as
// a scrollable box that matches the modal's other fields.
function pickListHtml(id, options, selected, emptyHint) {
  if (!options.length) return '<div class="hint" style="margin:4px 0 8px">' + esc(emptyHint) + '</div>'
  const chosen = new Set(selected || [])
  const boxes = options.map((value) =>
    '<label class="chk pick-row" style="display:flex;width:100%;margin:2px 0"><input type="checkbox" class="' + id + '" value="' + esc(value) + '"' + (chosen.has(value) ? ' checked' : '') + '> ' + esc(value) + '</label>'
  ).join('')
  return '<div id="' + id + '-box" class="pick-box" style="max-height:150px;overflow:auto;border:1px solid var(--line);border-radius:10px;padding:6px 8px;margin:4px 0 8px">' + boxes + '</div>'
}
function pickListValues(id) {
  return [...document.querySelectorAll('.' + id + ':checked')].map((box) => box.value)
}
// The names and groups that exist right now, for the pickers. app.items is only
// populated by the Secrets page, so an Agent dialog opened first would show an empty
// picker and silently save an empty allow list. Callers await ensureItems().
function knownItemNames() {
  return ((app.items || []).map((item) => item.name)).filter(Boolean).sort((a, b) => a.localeCompare(b))
}
function knownGroups() {
  const groups = new Set()
  for (const item of app.items || []) if (item.group) groups.add(item.group)
  return [...groups].sort((a, b) => a.localeCompare(b))
}
// Fetch the item list once, so a picker never renders from nothing.
async function ensureItems() {
  if ((app.items || []).length) return
  try { const result = await api('/api/items'); app.items = result.items || [] } catch {}
}

// Creation moved into a modal so it no longer pushes the list down.
async function openAgentCreate() {
  await ensureItems()
  openModal('New Agent', '<div class="hint">Token is shown only once, right after creation.</div>' +
    '<label class="field">Name</label><input id="ac-name" placeholder="e.g. dsh">' +
    '<label class="field">Display name (optional)</label><input id="ac-alias" placeholder="An easy-to-recognize name">' +
    '<label class="field">Notes (optional)</label><input id="ac-note" placeholder="What it’s for">' +
    '<label class="field">Requestable items (none checked = every request is denied)</label>' + pickListHtml('ac-allow', knownItemNames(), [], 'No items yet. Create one on the “Secrets” page first.') +
    '<label class="field">Requestable groups (none checked = any group)</label>' + pickListHtml('ac-groups', knownGroups(), [], 'No groups yet. Set a group when adding an item, or change it in the item menu.') +
    '<label class="chk" style="margin-top:8px"><input type="checkbox" id="ac-allowall"> Allow all items</label>' +
    '<label class="chk" style="margin-top:8px"><input type="checkbox" id="ac-write"> Allow writes (can call /agent/items/save)</label>' +
    '<div class="row" style="margin-top:14px"><button class="primary" id="ac-create">Create</button></div>' +
    '<div class="status" id="ac-status"></div><div class="secret hidden" id="ac-token"></div>')
  $('ac-create').onclick = async () => {
    const name = $('ac-name').value.trim()
    if (!name) return status('ac-status', 'Enter a name', 'error')
    try {
      status('ac-status', 'Creating…')
      const allow = pickListValues('ac-allow')
      const groups = pickListValues('ac-groups')
      const payload = { name, alias: $('ac-alias').value.trim(), note: $('ac-note').value.trim(), allow, groups, allowAll: $('ac-allowall').checked, write: $('ac-write').checked }
      // Write is an elevated capability, so it is the one checkbox that asks for
      // a fresh proof before the token is minted.
      const result = payload.write
        ? await sensitivePost('/api/agents/create', payload, 'Give the Agent write access')
        : await api('/api/agents/create', { method: 'POST', body: JSON.stringify(payload) })
      $('ac-token').classList.remove('hidden')
      $('ac-token').textContent = result.token
      // Least privilege means the create can legitimately end with an empty
      // requestable set. Say what that implies and where the next step is, so
      // the agent is not stranded on its first request.
      const scopeEmpty = !payload.allowAll && !allow.length && !groups.length
      const nextStep = scopeEmpty ? '. The requestable scope is empty: in the Agent list, open “Permission matrix” and add requestable items, otherwise even its requests will be denied' : ''
      try { await navigator.clipboard.writeText(result.token); status('ac-status', 'Created; token copied to clipboard' + nextStep, 'ok') } catch { status('ac-status', 'Created; copy the token manually' + nextStep, 'ok') }
      await refreshAll()
    } catch (error) { status('ac-status', error.message, 'error') }
  }
}
// The four answers a cell can give, and why they must not collapse into one
// another: a live authority, the legacy direct-read path, "ask and a human
// decides", and "cannot even ask". The fifth is an authority that exists but
// no longer works, which would otherwise look like a grant.
const PM_STATES = {
  granted: { label: 'Full grant', tone: 'on' },
  noapproval: { label: 'No approval needed', tone: 'plain' },
  requestable: { label: 'Requestable', tone: 'warn' },
  none: { label: 'No access', tone: '' },
  blocked: { label: 'Lapsed', tone: 'bad' },
  mixed: { label: 'Mixed', tone: '' },
}
const PM_SOURCES = { capability: 'capability', 'action-grant': 'grant', 'legacy-scope': 'legacy scope', scope: 'requestable scope', none: 'not in scope' }
const PM_ACTION_LABEL = { read: 'Read plaintext', use: 'Proxied call', fill: 'Web fill' }
const PM_ACTION_KEY = { read: 'secret.read', use: 'secret.use', fill: 'secret.fill' }
function pmCellHtml(agent, items, data, action) {
  const states = items.map((item) => ((data.cells?.[agent.name] || {})[item.id] || {})[action]).filter(Boolean)
  const counts = {}
  for (const entry of states) counts[entry.state] = (counts[entry.state] || 0) + 1
  const keys = Object.keys(counts)
  const state = keys.length === 1 ? keys[0] : (keys.length ? 'mixed' : 'none')
  const meta = PM_STATES[state] || PM_STATES.none
  const detail = keys.map((key) => (PM_STATES[key] || PM_STATES.none).label + ' ' + counts[key]).join(' / ')
  return { state, label: meta.label, tone: meta.tone, detail }
}
async function openPermissionMatrix() {
  let data
  try { data = await api('/api/permission-matrix') } catch (error) { return toast(error.message, true) }
  let action = 'read'
  let detail = null
  const groups = []
  const byGroup = new Map()
  for (const item of data.items || []) {
    const key = item.group || 'Ungrouped'
    if (!byGroup.has(key)) { byGroup.set(key, []); groups.push(key) }
    byGroup.get(key).push(item)
  }
  openModal('Agent permission matrix', '<div id="pm-body"></div>')
  const modalCard = document.querySelector('#modal > .card'); if (modalCard) modalCard.classList.add('pm-wide')
  const box = $('pm-body')
  const findAgent = (name) => (data.agents || []).find((agent) => agent.name === name)
  const renderDetail = () => {
    if (!detail) return renderMatrix()
    const agent = findAgent(detail.agentName)
    const items = byGroup.get(groups[detail.index]) || []
    const locked = data.masked === true
    // A readonly cell is a fact, not a button: the exact reason and source are
    // what an operator needs before deciding whether to unlock and change it.
    const rowOf = (item) => {
      const cell = ((data.cells?.[agent.name] || {})[item.id] || {})[action] || { state: 'none' }
      const meta = PM_STATES[cell.state] || PM_STATES.none
      const source = PM_SOURCES[cell.source] || cell.source || '—'
      const expiry = typeof cell.expiresAt === 'number' ? ' · expires ' + new Date(cell.expiresAt).toLocaleString('en-GB', { hour12: false }) + '' : ''
      const note = cell.state === 'blocked' ? ' · Grant revoked, used up or expired; grant again' : ''
      let button = ''
      if (locked) button = '<button class="small" data-inline-unlock>Unlock to edit</button>'
      else if (cell.state === 'granted' || cell.state === 'noapproval') button = '<button class="small danger" data-pm-do="revoke" data-agent="' + esc(agent.name) + '" data-item-id="' + esc(item.id) + '" data-action="' + esc(action) + '">Revoke</button>'
      else if (cell.state === 'requestable') button = '<button class="small primary" data-pm-do="grant" data-agent="' + esc(agent.name) + '" data-item="' + esc(item.name) + '" data-action="' + esc(action) + '">Grant for 7 days</button>'
      else if (cell.state === 'blocked') button = '<button class="small primary" data-pm-do="grant" data-agent="' + esc(agent.name) + '" data-item="' + esc(item.name) + '" data-action="' + esc(action) + '">Re-grant for 7 days</button>'
      else button = '<button class="small" data-pm-do="scope" data-agent="' + esc(agent.name) + '" data-item="' + esc(item.name) + '">Add to requestable scope first</button>'
      return '<div class="pm-detail-row"><div class="pm-detail-meta">'
        + '<b>' + esc(item.name) + '</b><span class="ios-pill ' + meta.tone + '">' + esc(meta.label) + '</span>'
        + '<span class="pm-sub">Source: ' + esc(source) + expiry + note + '</span></div>' + button + '</div>'
    }
    box.innerHTML = '<div class="row" style="justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">'
      + '<div><b>' + esc(agentDisplayName(agent)) + '</b><div class="pm-sub">' + esc(groups[detail.index]) + ' · ' + PM_ACTION_LABEL[action] + '</div></div>'
      + '<button data-pm-back>Back to matrix</button></div>'
      + (locked ? '<div class="notice-bar" data-level="notice" style="margin-top:10px"><span class="notice-dot"></span><span class="notice-text">Locked, so the matrix is read-only; unlock to make changes.</span></div>' : '')
      + '<div style="margin-top:10px">' + (items.length ? items.map(rowOf).join('') : '<div class="hint">No items in this group</div>') + '</div>'
  }
  const renderMatrix = () => {
    const agents = data.agents || []
    const head = '<tr><th>Agent</th>' + groups.map((group) => '<th>' + esc(group) + '<div class="pm-sub">' + byGroup.get(group).length + ' items</div></th>').join('') + '</tr>'
    const rows = agents.map((agent) => {
      const cells = groups.map((group, index) => {
        const cell = pmCellHtml(agent, byGroup.get(group), data, action)
        return '<td class="pm-cell" data-pm-cell="' + esc(agent.name) + '" data-pm-index="' + index + '" title="' + esc(cell.detail) + '">'
          + '<span class="ios-pill ' + cell.tone + '">' + cell.label + '</span></td>'
      }).join('')
      const rowSub = [agent.oauth ? 'OAuth' : agent.legacy ? 'legacy' : 'token', agent.scopeEmpty ? 'requestable scope is empty' : ''].filter(Boolean).join(' · ')
      return '<tr><td><div class="pm-agent"><b>' + esc(agentDisplayName(agent)) + '</b><div class="pm-sub">'
        + esc(rowSub) + '</div></div></td>' + cells + '</tr>'
    }).join('')
    const legend = '<div class="pm-legend">' + Object.entries(PM_STATES).filter(([key]) => key !== 'mixed').map(([, meta]) => '<span class="ios-pill ' + meta.tone + '">' + meta.label + '</span>').join('')
      + '<span>Sources: ' + Object.entries(PM_SOURCES).map(([key, label]) => key + '=' + label).join(' · ') + '</span></div>'
    box.innerHTML = '<div class="row" style="justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">'
      + '<div class="row" style="gap:6px">' + Object.entries(PM_ACTION_LABEL).map(([key, label]) => '<button class="small' + (key === action ? ' primary' : '') + '" data-pm-action="' + key + '">' + label + '</button>').join('') + '</div>'
      + '<span class="pm-sub">' + (data.masked ? 'Locked · read-only' : 'Unlocked · click a cell to change') + (data.expiryBlocksReads ? ' · Block reads after expiry: on' : '') + '</span></div>'
      + (data.masked ? '<div class="hint" style="margin-top:8px">Names are redacted; unlock to see full names and make changes.</div>' : '')
      + '<div class="pm-scroll scroll-list" style="max-height:60vh;margin-top:10px"><table class="pm-table"><thead>' + head + '</thead><tbody>' + (rows || '<tr><td colspan="' + (groups.length + 1) + '" class="hint">Nothing yet: add an Agent or an item</td></tr>') + '</tbody></table></div>'
      + legend
  }
  box.addEventListener('click', async (event) => {
    const actionTab = event.target.closest('[data-pm-action]')
    if (actionTab) { action = actionTab.dataset.pmAction; detail = null; renderMatrix(); return }
    const back = event.target.closest('[data-pm-back]')
    if (back) { detail = null; renderMatrix(); return }
    const cell = event.target.closest('[data-pm-cell]')
    if (cell) { detail = { agentName: cell.dataset.pmCell, index: Number(cell.dataset.pmIndex) }; renderDetail(); return }
    const doIt = event.target.closest('[data-pm-do]')
    if (!doIt) return
    const agentName = doIt.dataset.agent
    const agent = findAgent(agentName)
    if (!agent) return
    doIt.disabled = true
    try {
      if (doIt.dataset.pmDo === 'revoke') {
        await api('/api/action-grants/revoke', { method: 'POST', body: JSON.stringify({ agent: agentName, itemId: doIt.dataset.itemId, action: PM_ACTION_KEY[doIt.dataset.action] }) })
        toast('Revoked')
      } else if (doIt.dataset.pmDo === 'scope') {
        // Scope is the separate question "may this agent even ask"; granting
        // before that would fail, so this button is the missing first step.
        const allow = Array.from(new Set([...(agent.allow || []), doIt.dataset.item]))
        await api('/api/agents/update', { method: 'POST', body: JSON.stringify({ name: agentName, allow }) })
        toast('Added to requestable scope; grant it next')
      } else {
        await api('/api/action-grants', { method: 'POST', body: JSON.stringify({ agent: agentName, item: doIt.dataset.item, actions: [PM_ACTION_KEY[doIt.dataset.action]], terms: { [PM_ACTION_KEY[doIt.dataset.action]]: { duration: '7d' } } }) })
        toast('Granted for 7 days')
      }
      const next = await api('/api/permission-matrix')
      data = next
      if (detail) renderDetail(); else renderMatrix()
    } catch (error) {
      doIt.disabled = false
      toast(error.message, true)
    }
  })
  renderMatrix()
}
// Detail view: Overview / Permissions / Grants / Activity. Read-only display plus the existing actions.
async function openAgentDetail(name) {
  const agent = ((app.data && app.data.agents) || []).find((entry) => entry.name === name)
  if (!agent) return
  const last = lastActivityFor(name)
  const health = agentHealth(agent, last)
  const kind = agent.oauth ? 'OAuth Agent' : 'Token Agent'
  const scope = agent.allowAll ? 'All items' : (agent.allow && agent.allow.length ? agent.allow.join(', ') : (agent.groups && agent.groups.length ? 'Groups: ' + agent.groups.join(', ') : 'No access'))
  const expiry = typeof agent.expiresAt === 'number' ? new Date(agent.expiresAt).toLocaleString('en-GB', { hour12: false }) : 'Long-term'
  const created = agent.createdAt ? new Date(agent.createdAt).toLocaleString('en-GB', { hour12: false }) : '-'
  // The agent's five latest events come from the full trail; the state slice
  // only holds the 20 newest rows of the whole vault.
  let recent = ((app.data && app.data.audit) || []).filter((entry) => entry.agent === name).slice(0, 5)
  try { const data = await auditPage({ agent: name, limit: 5 }); recent = data.entries || recent } catch {}
  const activityRows = recent.length ? recent.map((entry) => '<div class="hint">' + esc(new Date(entry.time).toLocaleString('en-GB', { hour12: false })) + ' · ' + esc(entry.event || '') + (entry.name ? ' · ' + esc(entry.name) : '') + '</div>').join('') : '<div class="hint">No reads yet</div>'
  openModal(agentDisplayName(agent), '<div class="row" style="justify-content:space-between;align-items:center"><div><b>' + esc(agentDisplayName(agent)) + '</b><div class="hint">' + kind + (agentDisplayNote(agent) ? ' · ' + esc(agentDisplayNote(agent)) : '') + '</div></div><span class="agent-health ' + (health.level === 'ok' ? 'ok' : (health.level === 'warn' ? 'warn' : 'bad')) + '">' + esc(health.label) + '</span></div>' +
    '<div class="agent-detail-grid" style="margin-top:14px">' +
    '<div><span>Account</span><b>' + esc(agent.account || '-') + '</b></div>' +
    '<div><span>Connection</span><b>' + (agent.oauth ? 'OAuth' : 'Token') + '</b></div>' +
    '<div><span>requestable scope</span><b>' + esc(scope) + '</b></div>' +
    '<div><span>Write access</span><b>' + (agent.write ? 'Allowed' : 'Not allowed') + '</b></div>' +
    '<div><span>Grant expires</span><b>' + esc(expiry) + '</b></div>' +
    '<div><span>Last read</span><b>' + esc(relativeTime(last)) + '</b></div>' +
    '<div><span>Created</span><b>' + esc(created) + '</b></div>' +
    '</div>' +
    '<div style="margin-top:14px"><b>Recent activity</b>' + activityRows + '</div>' +
    '<div class="row" style="margin-top:14px"><button class="primary" id="ad-extend">Extend grant</button><button id="ad-edit">Edit settings</button><button id="ad-menu">More actions</button></div>')
  $('ad-extend').onclick = () => openExtendMenu(name)
  $('ad-edit').onclick = () => openAgentMenu(name)
  $('ad-menu').onclick = () => openAgentMenu(name)
}
async function extendAgent(name, days) {
  try {
    const result = await api('/api/agents/extend', { method: 'POST', body: JSON.stringify({ name, days }) })
    show('modal', false)
    await refreshAll()
    toast(result.permanent ? 'Set to permanent' : 'Extended to ' + new Date(result.expiresAt).toLocaleString('en-GB', { hour12: false }))
  } catch (error) {
    // Never leave an empty red banner: if the server sends no usable text,
    // fall back to the status code so the operator can tell what happened.
    const message = (error && error.message) || ('Couldn’t extend the grant (HTTP ' + ((error && error.status) || 'unknown') + ')')
    const box = $('extend-error')
    if (box) { box.textContent = message; box.classList.remove('hidden') }
    toast(message, true)
  }
}
function openExtendMenu(name) {
  const agent = (app.data.agents || []).find((entry) => entry.name === name)
  if (!agent) return
  const opts = [['1', '1 day'], ['7', '7 days'], ['30', '30 days'], ['90', '90 days'], ['365', '365 days'], ['permanent', 'Permanent']]
  const now = typeof agent.expiresAt === 'number' ? new Date(agent.expiresAt).toLocaleString('en-GB', { hour12: false }) : 'Permanent'
  openModal('Extend grant · ' + name, '<div class="hint">Current expiry: ' + now + (agent.oauth ? ' (OAuth connection)' : '') + '</div><div class="hint" style="margin-top:6px">Counted from <strong>now</strong>; the clock restarts.</div><div class="row" style="margin-top:12px;flex-wrap:wrap;gap:8px">' + opts.map(([value, label]) => '<button class="small" data-extend-days="' + value + '">' + label + '</button>').join('') + '</div><div id="extend-error" class="extend-error hidden" role="alert" aria-live="assertive"></div>')
  document.querySelectorAll('[data-extend-days]').forEach((button) => {
    button.onclick = () => extendAgent(name, button.dataset.extendDays === 'permanent' ? 'permanent' : Number(button.dataset.extendDays))
  })
}
$('kpis').addEventListener('click', (event) => {
  const card = event.target.closest('[data-kpi]'); if (!card) return
  openKpiModal(card.dataset.kpi)
})
const agingTable = $('aging-table')
if (agingTable) {
  agingTable.addEventListener('click', (event) => {
    const sort = event.target.closest('[data-sort]')
    if (sort) {
      const key = sort.dataset.sort
      agingSort = { key, dir: agingSort.key === key ? -agingSort.dir : 1 }
      renderAging()
      return
    }
    const row = event.target.closest('[data-aging-row]')
    if (row) openItemMenu(row.dataset.agingRow)
  })
}
const agingAll = $('aging-all')
if (agingAll) agingAll.onclick = openAgingAll
document.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-kpi-decide]'); if (!button) return
  try { await api('/api/pending/decide', { method: 'POST', body: JSON.stringify({ id: button.dataset.id, decision: button.dataset.decision }) }); show('modal', false); await loadAll(); toast('Done') } catch (error) { toast(error.message, true) }
})
$('pending-box').addEventListener('click', async (event) => { const button = event.target.closest('[data-decide]'); if (!button) return; try { await api('/api/pending/decide', { method: 'POST', body: JSON.stringify({ id: button.dataset.id, decision: button.dataset.decide }) }); await Promise.all([loadState(), loadStats(), loadItems()]); toast('Done') } catch (error) { toast(error.message, true) } })
// Connection controls live in the overview queue, the pending sheet and the
// banner, so they are delegated once on the document.
document.addEventListener('click', (event) => {
  const quick = event.target.closest('[data-conn-quick]')
  if (quick) { event.preventDefault(); decideConnectionQuick(quick); return }
  const open = event.target.closest('[data-conn-open]')
  if (open) { event.preventDefault(); openPendingSheet(); return }
  const approve = event.target.closest('[data-conn-approve]')
  if (approve) { event.preventDefault(); submitConnectionForm(approve.closest('[data-conn-card]'), 'approve'); return }
  const deny = event.target.closest('[data-conn-deny]')
  if (deny) { event.preventDefault(); submitConnectionForm(deny.closest('[data-conn-card]'), 'deny') }
})
$('grants-box').addEventListener('click', (event) => {
  // While selecting, a tap on a row is a tick. It used to fall through to the
  // grant sheet, which also wiped the selection the user had just made.
  if (grantsSelecting) {
    if (event.target.closest('.grant-select')) return
    const row = event.target.closest('.ios-row')
    const box = row?.querySelector('.grant-select')
    if (!box) return
    box.checked = !box.checked
    box.dispatchEvent(new Event('change', { bubbles: true }))
    return
  }
  const menu = event.target.closest('[data-grant-menu]')
  if (menu) openGrantMenu(menu.dataset.agent, menu.dataset.name)
})
// Bulk actions. “Restore” really restores: the server rebuilds the grant row and its
// read capability, which is what the single-row button always did.
$('grants-select').onclick = () => { grantsSelecting = !grantsSelecting; if (!grantsSelecting) selectedGrants.clear(); renderGrants() }
$('grants-box').addEventListener('change', (event) => {
  const box = event.target.closest('.grant-select')
  if (!box) return
  if (box.checked) selectedGrants.add(box.dataset.key)
  else selectedGrants.delete(box.dataset.key)
  syncGrantsBulk()
})
$('grants-bulk-clear').onclick = () => { selectedGrants.clear(); renderGrants() }
$('grants-bulk-delete').onclick = async () => {
  const keys = selectedGrantList()
  if (!keys.length) return toast('Select the grants to delete first', true)
  if (!(await askYes('Delete the ' + keys.length + ' selected grants? Revoked ones are cleared too.'))) return
  try {
    const result = await api('/api/grants/batch', { method: 'POST', body: JSON.stringify({ action: 'delete', keys }) })
    selectedGrants.clear(); await refreshAll(); toast('Grants deleted: ' + result.changed + '')
  } catch (error) { toast(error.message, true) }
}
$('grants-bulk-restore').onclick = async () => {
  const keys = selectedGrantList()
  if (!keys.length) return toast('Select the grants to restore first', true)
  const pick = $('grants-bulk-seconds')
  const seconds = Number(pick.value)
  if (!(await askYes('Restore the ' + keys.length + ' selected grants as “' + pick.selectedOptions[0].textContent + '”? Read counts reset to zero.'))) return
  try {
    const result = await api('/api/grants/batch', { method: 'POST', body: JSON.stringify({ action: 'restore', keys, seconds }) })
    selectedGrants.clear(); await refreshAll()
    toast('Grants restored: ' + result.changed + '' + (result.missing?.length ? ', ' + result.missing.length + ' not found' : ''))
  } catch (error) { toast(error.message, true) }
}
// "Edit" on a classified credential opens that item's own editor.
$('fp-list').addEventListener('click', (event) => {
  const button = event.target.closest('[data-fp-edit]')
  if (button && button.dataset.fpEdit) openItemMenu(button.dataset.fpEdit)
})
// In-table actions for a legacy grant with no identity binding. The delete path
// uses /api/grants/delete, which is the same one every other row uses.
$('grants-box').addEventListener('click', async (event) => {
  const regrant = event.target.closest('[data-legacy-regrant]')
  if (regrant) {
    const agent = regrant.dataset.agent || ''
    const name = regrant.dataset.name || ''
    try {
      await api('/api/legacy/regrant', { method: 'POST', body: JSON.stringify({ agent, item: name, action: 'secret.read', duration: '7d' }) })
      toast('Re-granted ' + name + ' (7 days)')
      await refreshAll()
    } catch (error) { toast(error.message || 'Re-grant failed', true) }
    return
  }
  const remove = event.target.closest('[data-legacy-delete]')
  if (remove) {
    const agent = remove.dataset.agent || ''
    const name = remove.dataset.name || ''
    if (!(await askYes('Delete the old grant ' + agent + ' → ' + name + '?'))) return
    try {
      await api('/api/grants/delete', { method: 'POST', body: JSON.stringify({ agent, name }) })
      toast('Deleted')
      await refreshAll()
    } catch (error) { toast(error.message || 'Delete failed', true) }
  }
})
async function loadAll() {
  await refreshAll(); startPendingPolling(); updateBrowserNotifyStatus(); offerPushOnce()
  if (/^#\/?pending$/.test(location.hash)) openPendingSheet()
  else if (/^#\/?grants$/.test(location.hash)) openNoticeModal()
  if (/^#\/?(pending|grants)$/.test(location.hash)) history.replaceState({}, '', '/')
}
let pendingTimer = null
// The console polls approvals every 30s while it is on screen. A hidden tab
// cannot show the banner, so it backs off instead of writing to D1 for nobody.
const PENDING_POLL_MS = 30000
const PENDING_POLL_HIDDEN_MS = 120000
let knownPending = new Set()
let pendingInitialized = false
function updateBrowserNotifyStatus() { const el = $('browser-notify-status'); if (!el) return; el.textContent = typeof Notification === 'undefined' ? 'This browser doesn’t support notifications' : 'Current permission: ' + Notification.permission }
function showBrowserNotification(title, body, tag) { if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return; try { const notification = new Notification(title, { body, tag }); notification.onclick = () => { window.focus(); location.hash = '#pending'; openPendingSheet(); notification.close() } } catch {} }
async function enableBrowserNotifications() { if (typeof Notification === 'undefined') return status('settings-status', 'This browser doesn’t support notifications', 'error'); const permission = await Notification.requestPermission(); updateBrowserNotifyStatus(); if (permission === 'granted') { status('settings-status', 'Browser notifications enabled', 'ok'); startPendingPolling() } else status('settings-status', 'Notification permission not granted', 'error') }
function b64urlBytes(value) {
  const normalized = String(value).replace(/-/g, '+').replace(/_/g, '/')
  return Uint8Array.from(atob(normalized + '='.repeat((4 - normalized.length % 4) % 4)), (char) => char.charCodeAt(0))
}
async function enableWebPush(options = {}) {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) throw new Error('This browser doesn’t support background push')
    const registration = await navigator.serviceWorker.register('/sw.js')
    const permission = await Notification.requestPermission()
    updateBrowserNotifyStatus()
    if (permission !== 'granted') throw new Error('Notification permission not granted')
    const { publicKey } = await api('/api/push/vapid')
    const existing = await registration.pushManager.getSubscription()
    const subscription = existing || await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: b64urlBytes(publicKey),
    })
    await api('/api/push/subscribe', { method: 'POST', body: JSON.stringify({ subscription: subscription.toJSON() }) })
    status('webpush-status', 'Background push enabled; approval requests arrive even when the page is closed', 'ok')
    if (options.fromBar) toast('Background push is on: approval requests arrive even when the page is closed')
    return true
  } catch (error) {
    status('webpush-status', error.message, 'error')
    if (options.fromBar) toast(error.message || 'Background push not enabled', true)
    return false
  }
}
async function testWebPush() {
  try {
    const result = await api('/api/push/test', { method: 'POST' })
    status('webpush-status', result.sent ? 'Background pushes sent: ' + result.sent + '' : 'No subscribed browsers', result.sent ? 'ok' : 'error')
  } catch (error) { status('webpush-status', error.message, 'error') }
}
async function checkPendingNotifications() {
  try {
    const data = await api('/api/state'); const pending = data.pending || []; const connections = (data.connections && data.connections.pending) || []
    // One waiting set: a first connection is an approval, so it counts toward
    // the same badge and raises the same notification as a read request.
    const ids = new Set(pending.map((entry) => entry.id).concat(connections.map((entry) => 'connection:' + entry.id)))
    const wasInitialized = pendingInitialized
    const fresh = wasInitialized
      ? pending.filter((entry) => !knownPending.has(entry.id)).concat(connections.filter((entry) => !knownPending.has('connection:' + entry.id)))
      // The first poll can beat loadAll. Treat that queue as new rather than
      // baseline, otherwise a request created while the page was closed is
      // silently accepted as already seen.
      : pending.concat(connections)
    // Only a change in the waiting set needs a new banner; a 30s re-render
    // would restart the rotation timer and rebuild the same DOM for nothing.
    const pendingMoved = fresh.length > 0 || ids.size !== knownPending.size
    if (!wasInitialized && fresh.length) notifyPendingBatch(fresh)
    else for (const entry of fresh) {
      if (entry.name) showBrowserNotification('Secrets Broker access request', (pendingAgentLabel(entry)) + ' wants to read “' + entry.name + '”', entry.id)
      else showBrowserNotification('Secrets Broker connection request', (entry.agent || 'Agent') + ' wants to connect for the first time', 'connection:' + entry.id)
    }
    knownPending = ids; pendingInitialized = true
    // The tab already has a browser notification path for the background case,
    // so the in-page toast is only for someone actually looking at the page.
    if (fresh.length && !document.hidden) {
      const first = fresh[0]
      const label = first.name ? pendingAgentLabel(first) + ' wants to read “' + first.name + '”' : (first.agent || 'Agent') + ' wants to connect for the first time'
      toast(fresh.length === 1 ? label : label + ' (' + fresh.length + ' new approval requests)')
    }
    if (app.data) {
      // Re-render only what moved: rebuilding the log list every 30s would throw
      // away the operator's scroll position while they read it.
      const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null)
      const logsMoved = !same((data.audit || []).slice(0, 1), (app.data.audit || []).slice(0, 1)) || (data.audit || []).length !== (app.data.audit || []).length
      const agentsMoved = !same(data.agents, app.data.agents)
      app.data = data
      app.stateLoaded = true
      app.stateError = ''
      // The title count must follow the queue even when the bar itself did not
      // re-render (no new ids, only a decision elsewhere).
      syncPendingTitle()
      renderPending()
      renderAging()
      if (agentsMoved) renderAgents()
      if (logsMoved) {
        renderLogs()
        // Counts and recent activity aggregate the whole trail; when the
        // overview is on screen they ride the same 30s tick that noticed the
        // new row, so there is no second timer and no request while nothing
        // changed.
        const onOverview = document.querySelector('.view:not(.hidden)')?.id === 'view-overview'
        if (onOverview) { loadStats(); loadRecent() } else renderRecent()
      }
      if (!grantsSelecting) renderGrants()
      if (pendingMoved) renderNoticeBar()
    }
  } catch {}
}
function pendingPollDelay() { return document.hidden ? PENDING_POLL_HIDDEN_MS : PENDING_POLL_MS }
function schedulePendingPoll() {
  clearTimeout(pendingTimer)
  // A timeout chain rather than setInterval: the delay is re-read after every
  // tick, so hiding or showing the tab takes effect without a second timer.
  pendingTimer = setTimeout(async () => { await checkPendingNotifications(); schedulePendingPoll() }, pendingPollDelay())
}
// A queue that was already waiting when the page opened is still news. The
// first look raises one batch notification instead of turning the request
// silent, and a repeated loadAll over the same ids stays quiet.
function notifyPendingBatch(entries) {
  if (!entries.length) return
  const connection = entries.some((entry) => !entry.name)
  const body = entries.length === 1
    ? (connection ? (entries[0].agent || 'Agent') + ' wants to connect for the first time' : pendingAgentLabel(entries[0]) + ' wants to read “' + (entries[0].name || '') + '”')
    : entries.length + ' approval requests waiting'
  showBrowserNotification('Secrets Broker: pending approvals', body, 'pending-batch')
}
// loadAll already fetched /api/state and loadState already rendered the queue.
// Seeding the known set from that result removes the duplicate boot request,
// but it must not pretend the operator has seen a request they have not.
function seedPendingFromState() {
  if (!app.stateLoaded || !app.data) return false
  const pending = app.data.pending || []
  const connections = (app.data.connections && app.data.connections.pending) || []
  const keyed = pending.map((entry) => ({ id: entry.id, entry }))
    .concat(connections.map((entry) => ({ id: 'connection:' + entry.id, entry })))
  const fresh = keyed.filter((item) => !knownPending.has(item.id)).map((item) => item.entry)
  knownPending = new Set(keyed.map((item) => item.id))
  pendingInitialized = true
  if (fresh.length) {
    syncPendingTitle()
    renderNoticeBar()
    notifyPendingBatch(fresh)
  }
  return true
}
let swMessageWired = false
// A push already knows there is something new; waiting up to 30 seconds for the
// next poll is what made the queue look stale until a manual refresh. The
// service worker posts to every open tab, and this makes the bar, the title and
// any open queue move immediately.
function wireServiceWorkerMessages() {
  if (swMessageWired || !('serviceWorker' in navigator)) return
  swMessageWired = true
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'secrets-broker:pending') checkPendingNotifications()
  })
}
function startPendingPolling() { updateBrowserNotifyStatus(); wireServiceWorkerMessages(); if (pendingTimer) return; if (!seedPendingFromState()) checkPendingNotifications(); schedulePendingPoll() }
// Coming back to the tab is when a stale banner is most visible, so refresh
// immediately; going away re-arms the timer with the slower interval.
document.addEventListener('visibilitychange', () => { if (!pendingTimer) return; schedulePendingPoll(); if (!document.hidden) checkPendingNotifications() })
let globeBooted = false
// The card itself is always on screen now; only the live map is gated. A still
// earth plus the access summary fills the slot, so an opt-out deployment never
// shows a bare hole where the globe used to be.
function renderGlobeCap() {
  const el = $('globe-cap')
  if (!el) return
  if (app.locked === true) { el.textContent = 'Locked · names redacted, approvals still work'; return }
  if (!app.itemsLoaded) { el.textContent = 'Loading items…'; return }
  const agents = new Set()
  ;((app.data && app.data.grants) || []).forEach((grant) => { if (grant && grant.agent) agents.add(grant.agent) })
  const pending = ((app.data && app.data.pending) || []).length
  const text = (app.items || []).length + ' items · ' + agents.size + ' Agent readers · ' + pending + ' pending'
  if (el.textContent !== text) el.textContent = text
}
function applyGlobeAvailability(geoOn) {
  const card = $('globe-card')
  if (!card) return
  card.classList.toggle('globe-off', !geoOn)
  const note = $('globe-status')
  if (!note) return
  if (!geoOn) note.textContent = 'Live access is off · Set GEO_ENABLED=1 to show live connections'
  else if (note.textContent.indexOf('Live access is off') === 0) note.textContent = ''
}
async function loadState() { try { app.data = await api('/api/state'); app.stateLoaded = true; app.stateError = ''; app.locked = app.data.masked === true || app.me?.unlocked !== true; app.plainOk = app.locked ? false : (app.v2?.initialized === true ? app.plainOk !== false : true); const geoOn = app.data.geoEnabled === true; applyGlobeAvailability(geoOn); renderGlobeCap(); renderLockedSurface(); renderNoticeBar(); renderAgents(); renderPending(); renderAging(); renderGrants(); renderFillPolicies(); renderTransfers(); renderRecent(); renderLogs(); if ((app.items || []).length) renderItems() } catch (error) { app.stateError = (error && error.message) || 'Couldn’t load state'; renderAging(); if (error.status === 423) { app.locked = true; renderLockedSurface() } } }
async function loadItems() { status('item-status', 'Loading…'); try { const result = await api('/api/items'); app.items = result.items || []; app.itemsLoaded = true; app.itemsError = ''; app.locked = false; renderItems(); renderAging(); renderOverviewActions(); renderGlobeCap(); renderLockedSurface(); status('item-status', '' + app.items.length + ' items'); if (result.completedTransfers?.length) { toast('Copied automatically: ' + result.completedTransfers.join(', ')); await loadState() } } catch (error) { if (error.status === 423) { app.locked = true; app.items = []; app.itemsLoaded = true; app.itemsError = ''; renderItems(); renderAging(); renderOverviewActions(); renderGlobeCap(); renderLockedSurface(); status('item-status', app.data?.masked === true ? 'Locked: item names are redacted, approvals still work' : 'Locked: unlock to view items') } else { app.itemsError = error.message; renderItems(); renderAging(); status('item-status', error.message, 'error') } } }
async function loadStats() { try { app.stats = await api('/api/stats?range=' + app.range); renderStats() } catch {} }
// One operator action changes the logs, the counts and the item rows at once.
// Reloading them together is cheaper than making the operator press Refresh to
// believe the action worked.
// The zero-knowledge listing used to load (and prompt for TOTP) on every boot,
// even when the operator never opened that card. Status-only now; the explicit
// refresh/device actions still ask for the second factor.
async function refreshAll() { await Promise.all([loadState(), loadItems(), loadStats(), loadVault2(false), loadRecent()]) }
// The OIDC providers. Each one is edited on its own; the client secret is
// never sent back, so the field starts empty and an empty value keeps the
// stored one.
// A blank form for a new provider. The id is free here, so it can be typed.
function showOidcProviderForm() {
  $('op-id').value = ''
  $('op-id').disabled = false
  $('op-label').value = ''
  $('op-issuer').value = ''
  $('op-client-id').value = ''
  $('op-client-secret').value = ''
  $('op-redirect').value = ''
  $('op-scope').value = 'openid profile email'
  $('op-authorization').value = ''
  $('op-token').value = ''
  $('op-userinfo').value = ''
  $('op-jwks').value = ''
  $('op-enabled').checked = true
  status('op-status', '')
  $('oidc-provider-form').classList.remove('hidden')
}

async function loadOidcProviders() {
  const list = $('oidc-provider-list')
  if (!list) return
  let data = { providers: [] }
  try { data = await api('/api/oidc/providers') } catch (error) { list.innerHTML = '<div class="hint">Failed to load: ' + esc(error.message) + '</div>'; return }
  const providers = data.providers || []
  if (!providers.length) {
    list.innerHTML = '<div class="hint">No identity providers configured yet. Click “Add provider” below to create one.</div>'
    return
  }
  const rows = []
  for (const provider of providers) {
    const name = provider.label || provider.id
    rows.push('<div class="row" style="justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--line)">')
    rows.push('<div><b>' + esc(name) + '</b> <span class="hint">' + esc(provider.id) + '</span><br><span class="hint">' + esc(provider.issuer || '') + (provider.clientId ? ' · ' + esc(provider.clientId) : '') + '</span>')
    if (provider.secretConfigured) rows.push(' <span class="hint">secret saved</span>')
    if (provider.enabled === false) rows.push(' <span class="hint">Disabled</span>')
    rows.push('</div><div><button data-op-edit="' + esc(provider.id) + '">Edit</button><button data-op-del="' + esc(provider.id) + '" class="danger">Delete</button></div>')
    rows.push('</div>')
  }
  list.innerHTML = rows.join('')
  for (const button of list.querySelectorAll('[data-op-edit]')) button.onclick = () => openOidcProvider(button.getAttribute('data-op-edit'), providers)
  for (const button of list.querySelectorAll('[data-op-del]')) button.onclick = () => deleteOidcProvider(button.getAttribute('data-op-del'))
}
function openOidcProvider(id, providers) {
  const provider = providers.find((entry) => entry.id === id) || { id: '', label: '' }
  $('op-id').value = provider.id || ''
  $('op-id').disabled = Boolean(provider.id)
  $('op-label').value = provider.label || ''
  $('op-issuer').value = provider.issuer || ''
  $('op-client-id').value = provider.clientId || ''
  $('op-client-secret').value = ''
  $('op-redirect').value = provider.redirectUri || ''
  $('op-scope').value = provider.scope || ''
  $('op-authorization').value = provider.authorizationEndpoint || ''
  $('op-token').value = provider.tokenEndpoint || ''
  $('op-userinfo').value = provider.userinfoEndpoint || ''
  $('op-jwks').value = provider.jwksUri || ''
  $('op-enabled').checked = provider.enabled !== false
  $('op-status').textContent = provider.secretConfigured ? 'This provider already has a client secret saved; leave blank to keep it.' : ''
  $('oidc-provider-form').classList.remove('hidden')
}
async function saveOidcProvider() {
  const id = $('op-id').value.trim()
  if (!id) { status('op-status', 'ID is required', 'error'); return }
  const body = {
    id, label: $('op-label').value.trim(),
    issuer: $('op-issuer').value.trim(),
    clientId: $('op-client-id').value.trim(),
    clientSecret: $('op-client-secret').value,
    redirectUri: $('op-redirect').value.trim(),
    scope: $('op-scope').value.trim(),
    authorizationEndpoint: $('op-authorization').value.trim(),
    tokenEndpoint: $('op-token').value.trim(),
    userinfoEndpoint: $('op-userinfo').value.trim(),
    jwksUri: $('op-jwks').value.trim(),
    enabled: $('op-enabled').checked,
  }
  try {
    await api('/api/oidc/providers', { method: 'POST', body: JSON.stringify(body) })
    $('op-client-secret').value = ''
    $('oidc-provider-form').classList.add('hidden')
    await loadOidcProviders()
    status('op-status', 'Saved', 'ok')
  } catch (error) { status('op-status', error.message, 'error') }
}
async function deleteOidcProvider(id) {
  if (!(await askYes('Delete this identity provider? Accounts linked to it will be unlinked too.'))) return
  try {
    await api('/api/oidc/providers', { method: 'DELETE', body: JSON.stringify({ id }) })
    await loadOidcProviders()
    toast('Deleted')
  } catch (error) { toast(error.message, true) }
}
async function discoverOidcProvider() {
  const issuer = $('op-issuer').value.trim()
  if (!issuer) { status('op-status', 'Fill in the Issuer first', 'error'); return }
  try {
    const data = await api('/api/oidc/discover?issuer=' + encodeURIComponent(issuer))
    if (data.authorizationEndpoint) $('op-authorization').value = data.authorizationEndpoint
    if (data.tokenEndpoint) $('op-token').value = data.tokenEndpoint
    if (data.userinfoEndpoint) $('op-userinfo').value = data.userinfoEndpoint
    if (data.jwksUri) $('op-jwks').value = data.jwksUri
    if (data.scope) $('op-scope').value = data.scope
    status('op-status', 'Filled in automatically; save to apply', 'ok')
  } catch (error) { status('op-status', error.message, 'error') }
}

// Probe a saved provider: discovery, its advertised id_token algorithms, and
// whether the authorization endpoint actually recognises this client id. A
// mis-registered client used to surface only as an error page at the provider.
async function probeOidcProvider() {
  const box = $('op-probe-result')
  if (!box) return
  const id = $('op-id').value.trim()
  if (!id) { status('op-status', 'Fill in and save the ID before checking', 'error'); return }
  box.innerHTML = '<div class="hint">Checking…</div>'
  try {
    const report = await api('/api/oidc/probe?provider=' + encodeURIComponent(id))
    const lines = []
    lines.push('<div class="hint">issuer: <code>' + esc(report.issuer) + '</code></div>')
    lines.push('<div class="hint">client id: <code>' + esc(report.clientId) + '</code></div>')
    lines.push('<div class="hint">redirect: <code>' + esc(report.redirectUri) + '</code></div>')
    lines.push('<div class="hint">client secret: ' + (report.hasSecret ? 'saved' : 'not configured (can be blank for a public client)') + '</div>')
    if (report.signingAlgs) lines.push('<div class="hint">id_token signing algorithms: ' + esc((report.signingAlgs || []).join(', ') || 'not declared') + '</div>')
    if (report.problems && report.problems.length) {
      for (const problem of report.problems) {
        lines.push('<div class="hint" style="color:var(--danger)">✗ ' + esc(problem) + '</div>')
      }
    } else {
      lines.push('<div class="hint" style="color:var(--ok)">✓ Endpoints, client id and signing algorithms all work</div>')
    }
    box.innerHTML = lines.join('')
  } catch (error) {
    box.innerHTML = '<div class="hint" style="color:var(--danger)">Check failed: ' + esc(error.message) + '</div>'
  }
}

async function loadSettings() {
  try {
    const data = await api('/api/settings'); const n = data.notifications || {}
    $('webpush-status').textContent = n.webpush?.subscriptions ? 'Background push: ' + n.webpush.subscriptions + ' browsers subscribed' : 'Background push not enabled'
    $('tg-chat').value = n.telegram?.chatId || ''
    $('tg-status').textContent = n.telegram?.configured ? 'Configured (token saved)' : 'Not configured'
    $('ntfy-url').value = n.ntfy?.url || ''; $('ntfy-topic').value = n.ntfy?.topic || ''
    $('ntfy-status').textContent = n.ntfy?.configured ? 'Configured' : 'Not configured'
    $('gotify-url').value = n.gotify?.url || ''
    $('gotify-status').textContent = n.gotify?.configured ? 'Configured (token saved)' : 'Not configured'
    $('wxpush-url').value = n.wxpush?.url || ''; $('wxpush-format').value = n.wxpush?.format || 'form'
    $('wxpush-status').textContent = n.wxpush?.configured ? 'Configured (token saved)' : 'Not configured'
    $('tg-enabled').checked = n.telegram?.enabled !== false; $('ntfy-enabled').checked = n.ntfy?.enabled !== false
    $('gotify-enabled').checked = n.gotify?.enabled !== false; $('wxpush-enabled').checked = n.wxpush?.enabled !== false
    const tpl = n.templates || {}; const tplAp = tpl.approval || {}; const tplLb = tplAp.labels || {}; const tplRm = tpl.reminder || {}
    $('tpl-ap-title').value = tplAp.title || ''; $('tpl-ap-body').value = tplAp.body || ''
    $('tpl-lb-once').value = tplLb.once || ''; $('tpl-lb-24h').value = tplLb['24h'] || ''; $('tpl-lb-deny').value = tplLb.deny || ''; $('tpl-lb-always').value = tplLb.always || ''
    $('tpl-rm-title').value = tplRm.title || ''; $('tpl-rm-body').value = tplRm.body || ''
    await loadOidcProviders()
    $('mcp-url').textContent = location.origin + '/mcp'
    $('vault-folder').value = data.vaultFolder || ''
    $('site-name').value = data.siteName || 'Secrets Broker'
    renderAiSettings(data.ai)
    try { const folders = (await api('/api/folders')).folders || []; $('vault-folder').innerHTML = '<option value="">All folders</option>' + folders.map((folder) => '<option value="' + esc(folder.name) + '">' + esc(folder.name) + '</option>').join(''); $('vault-folder').value = data.vaultFolder || ''; $('vault-folder-status').textContent = data.vaultFolder ? 'Reading only: ' + data.vaultFolder : 'Reading all folders' } catch { $('vault-folder-status').textContent = 'Unlock the vault to load folders' }
    try { const accounts = (await api('/api/accounts')).accounts || []; $('vault-email').innerHTML = accounts.map((account) => '<option value="' + esc(account.email) + '">' + esc(account.email) + '</option>').join(''); $('vault-email').value = data.vaultEmail || accounts[0]?.email || ''; $('vault-email-status').textContent = 'Current account: ' + ($('vault-email').value || '-') } catch { $('vault-email-status').textContent = 'Couldn’t load the account list' }
  } catch (error) { status('settings-status', error.message, 'error') }
}
async function saveSettings() {
  try {
    await api('/api/settings', { method: 'POST', body: JSON.stringify({ notifications: {
      telegram: { enabled: $('tg-enabled').checked, botToken: $('tg-token').value, chatId: $('tg-chat').value },
      ntfy: { enabled: $('ntfy-enabled').checked, url: $('ntfy-url').value, topic: $('ntfy-topic').value },
      gotify: { enabled: $('gotify-enabled').checked, url: $('gotify-url').value, token: $('gotify-token').value },
      wxpush: { enabled: $('wxpush-enabled').checked, url: $('wxpush-url').value, token: $('wxpush-token').value, format: $('wxpush-format').value },
      templates: {
        approval: { title: $('tpl-ap-title').value, body: $('tpl-ap-body').value, labels: { once: $('tpl-lb-once').value, '24h': $('tpl-lb-24h').value, deny: $('tpl-lb-deny').value, always: $('tpl-lb-always').value } },
        reminder: { title: $('tpl-rm-title').value, body: $('tpl-rm-body').value },
      },
  }, vaultFolder: $('vault-folder').value, siteName: $('site-name').value, vaultEmail: $('vault-email').value }) })
    $('site-title').textContent = $('site-name').value.trim() || 'Secrets Broker'
    status('settings-status', 'Saved', 'ok'); await loadSettings()
  } catch (error) { status('settings-status', error.message, 'error') }
}
// AI settings live on the same endpoint but save separately, so retyping a model
// name cannot silently reset a notification template.
async function saveAiSettings() {
  try {
    status('ai-status', 'Saving…')
    const key = $('ai-apikey').value.trim()
    await api('/api/settings', { method: 'POST', body: JSON.stringify({ ai: {
      enabled: $('ai-enabled').checked,
      endpoint: $('ai-endpoint').value.trim(),
      model: $('ai-model').value.trim(),
      // The dropdown wins unless the free-text box has content, so a model that
      // is not in the catalogue can still be used.
      timeoutMs: Number($('ai-timeout').value) || 25000,
      // A blank field keeps the stored key; only a typed value replaces it.
      ...(key ? { apiKey: key } : {}),
    } }) })
    $('ai-apikey').value = ''
    status('ai-status', 'Saved', 'ok')
    await loadSettings()
  } catch (error) { status('ai-status', error.message, 'error') }
}
function renderAiSettings(ai) {
  if (!ai) return
  $('ai-enabled').checked = ai.enabled !== false
  $('ai-endpoint').value = ai.endpoint || ''
  $('ai-model').value = ai.model || ''
  $('ai-timeout').value = ai.timeoutMs || 25000
  $('ai-key-status').textContent = ai.hasApiKey ? 'A key is saved (leave blank to keep it)' : 'No key yet'
}
// Fetch the custom endpoint's own model list into the datalist, so the field
// suggests real ids instead of making the operator spell them.
async function fetchCustomModels() {
  try {
    status('ai-model-status', 'Fetching…')
    // Send whatever is typed so it works before saving.
    await api('/api/settings', { method: 'POST', body: JSON.stringify({ ai: {
      endpoint: $('ai-endpoint').value.trim(),
      ...($('ai-apikey').value.trim() ? { apiKey: $('ai-apikey').value.trim() } : {}),
    } }) }).catch(() => {})
    const data = await api('/api/ai/models?fetch=1')
    const list = $('ai-model-list')
    list.innerHTML = (data.custom.models || []).map((id) => '<option value="' + esc(id) + '"></option>').join('')
    if (data.custom.ok) {
      status('ai-model-status', 'Fetched ' + data.custom.models.length + ' models. Click the field to see the list', 'ok')
      if (!$('ai-model').value && data.custom.models.length) $('ai-model').value = data.custom.models[0]
    } else {
      status('ai-model-status', 'Fetch failed: ' + (data.custom.reason || 'unknown reason'), 'error')
    }
  } catch (error) { status('ai-model-status', error.message, 'error') }
}
// The one place the console talks to the model. Read-only by construction: the
// broker only exposes /api/ai/ask, which answers questions and changes nothing.
// The assistant as a side panel, not a modal: you keep working behind it, which
// is the whole point of asking "why did that fail" while fixing it.
//
// Memory has two modes and the operator picks. Session mode keeps the thread in
// sessionStorage, so it survives a page reload but not a new login; durable mode
// asks the server to keep it. The panel never closes itself — not on a page
// action, not on a poll — so a half-written question is never lost.
const AI_THREAD_KEY = 'sb-ai-thread'
const AI_THREAD_PERSIST_KEY = 'sb-ai-thread-persist'

function aiThreadLoad() {
  try {
    const raw = sessionStorage.getItem(AI_THREAD_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
function aiThreadSave(history) {
  try { sessionStorage.setItem(AI_THREAD_KEY, JSON.stringify(history.slice(-20))) } catch {}
}
function aiThreadClear() {
  try { sessionStorage.removeItem(AI_THREAD_KEY) } catch {}
}

function openAiHelp(preset) {
  // Reuse the panel if it is already open, so clicking Ask AI again does not
  // discard the conversation.
  const existing = $('ai-panel')
  if (existing) {
    if (preset) { $('ai-question').value = preset; $('ai-question').focus() }
    return
  }
  const panel = document.createElement('aside')
  panel.id = 'ai-panel'
  panel.style.cssText = 'position:fixed;top:0;right:0;bottom:0;width:min(420px,100vw);z-index:40;background:var(--card,#fff);border-left:1px solid var(--line);box-shadow:-8px 0 30px rgba(15,23,42,.12);display:flex;flex-direction:column;padding:14px'
  panel.innerHTML = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'
    + '<b style="flex:1;font-size:13.5px">Ask AI</b>'
    + '<button class="small" id="ai-clear" title="Clear conversation">Clear</button>'
    + '<button class="small" id="ai-panel-close" title="Hide (the conversation is kept)">Hide</button>'
    + '</div>'
    + '<div class="hint" style="margin-bottom:8px">Read-only: it sees Agent names, item names, grants and logs, never secret values, and it can’t change anything. You can keep working on the page behind it; the panel stays open.</div>'
    + '<div id="ai-chat" class="scroll-list" style="flex:1;min-height:0;overflow:auto;scrollbar-width:none;margin-bottom:8px"></div>'
    + '<input id="ai-question" placeholder="e.g. Why can’t Muse read tavily-api-key?" value="' + esc(preset || '') + '">'
    + '<div class="row" style="margin-top:8px;gap:6px"><button class="primary" id="ai-ask" style="flex:1">Send</button><button id="ai-insights">Needs attention</button></div>'
    + '<div class="hint" id="ai-chat-status" style="min-height:16px;margin-top:6px"></div>'
  document.body.appendChild(panel)
  const chat = $('ai-chat')
  let history = aiThreadLoad()

  const bubble = (role, text) => {
    const node = document.createElement('div')
    node.style.cssText = 'border:1px solid var(--line);border-radius:10px;padding:8px 10px;margin:6px 0;font-size:12.5px;white-space:pre-wrap'
    node.style.background = role === 'user' ? 'var(--btn)' : 'transparent'
    node.textContent = (role === 'user' ? 'You: ' : 'AI: ') + text
    chat.appendChild(node)
    chat.scrollTop = chat.scrollHeight
  }
  // Redraw what was remembered, so reopening or reloading does not lose it.
  for (const turn of history) if (turn.content) bubble(turn.role === 'user' ? 'user' : 'ai', turn.content)
  if (!history.length) bubble('ai', 'Ask me which grants have expired, why an Agent can’t read something, or what to fix first.')

  const renderInsights = (insights) => {
    if (!insights || !insights.length) return
    for (const item of insights) {
      const node = document.createElement('div')
      node.style.cssText = 'border-left:3px solid ' + (item.level === 'warn' ? 'var(--warn,#f2994a)' : 'var(--ok,#0f9d8a)') + ';padding:4px 8px;margin:6px 0;font-size:12px'
      node.textContent = item.text
      chat.appendChild(node)
    }
    chat.scrollTop = chat.scrollHeight
  }

  $('ai-panel-close').onclick = () => { panel.remove() }
  $('ai-clear').onclick = () => { history = []; aiThreadClear(); chat.innerHTML = ''; bubble('ai', 'Cleared.') }
  $('ai-insights').onclick = async () => {
    try {
      const data = await api('/api/ai/insights')
      chat.innerHTML = ''
      renderInsights(data.insights)
      if (!(data.insights || []).length) chat.textContent = 'Nothing needs attention.'
    } catch (error) { status('ai-chat-status', error.message, 'error') }
  }
  const ask = async () => {
    const question = $('ai-question').value.trim()
    if (!question) return status('ai-chat-status', 'Type a question first', 'error')
    bubble('user', question)
    $('ai-question').value = ''
    status('ai-chat-status', 'Thinking…')
    try {
      const data = await api('/api/ai/ask', { method: 'POST', body: JSON.stringify({ question, history: history.slice(-6) }) })
      if (!data.ok) {
        bubble('ai', 'Can’t answer right now: ' + (data.error || 'unknown reason'))
        status('ai-chat-status', '')
        renderInsights(data.insights)
        return
      }
      bubble('ai', data.text)
      history.push({ role: 'user', content: question }, { role: 'assistant', content: data.text })
      aiThreadSave(history)
      status('ai-chat-status', 'Answered by ' + (data.provider === 'workers-ai' ? 'Workers AI' : 'self-hosted API') + '')
    } catch (error) { status('ai-chat-status', error.message, 'error') }
  }
  $('ai-ask').onclick = ask
  $('ai-question').addEventListener('keydown', (event) => { if (event.key === 'Enter') ask() })
  $('ai-question').focus()
}
async function testNotifications(simulate = false) {
  try {
    status('settings-status', simulate ? 'Sending a simulated approval request…' : 'Sending…')
    const result = await api('/api/notify/test', { method: 'POST', body: JSON.stringify({ simulateApproval: simulate }) })
    status('settings-status', simulate ? 'Simulated approval sent. Check the buttons in Telegram/ntfy' : 'Test result: ' + JSON.stringify(result.results), 'ok')
    if (simulate) await loadState()
  } catch (error) { status('settings-status', error.message, 'error') }
}
async function openKpiModal(kind) {
  if (kind === 'reads') {
    // The KPI counts every secret.read in the selected range, so the detail has
    // to read that range from /api/audit instead of the 20-row overview slice.
    let data = null
    try { data = await auditPage({ event: 'secret.read', from: rangeStartIso(), limit: 30 }) } catch (error) {
      openModal('Recent reads', '<div class="hint">Couldn’t load reads: ' + esc(error.message) + '</div>')
      return
    }
    const reads = data.entries || []
    const total = data.total ?? reads.length
    openModal('Recent reads', reads.length ? '<div class="hint">' + total + ' reads in this range, showing the latest ' + reads.length + '</div><table><tr><th>Time</th><th>Agent</th><th>Item</th><th>Method</th></tr>' + reads.map((entry) => '<tr><td>' + esc(entry.time ? new Date(entry.time).toLocaleString('en-GB', { hour12: false }) : '') + '</td><td>' + esc(agentLabel(entry.agent)) + '</td><td><code>' + esc(entry.name) + '</code></td><td>' + esc(entry.mode || entry.channel || '') + '</td></tr>').join('') + '</table>' : '<div class="hint">No reads in this range</div>')
  } else if (kind === 'agents') {
    // Same aggregation the KPI and the donut use, not a count over the slice.
    const rows = (app.stats && app.stats.topAgents) || []
    const totalAgents = app.stats ? (app.stats.activeAgents ?? rows.length) : rows.length
    const note = rows.length < totalAgents ? '<div class="hint">Agent activity: ' + totalAgents + ' active in this range, showing the top ' + rows.length + '</div>' : ''
    openModal('Agent activity', rows.length ? note + '<table><tr><th>Agent</th><th>Reads</th></tr>' + rows.map((row) => '<tr><td>' + esc(agentLabel(row.name)) + '</td><td>' + row.count + '</td></tr>').join('') + '</table>' : '<div class="hint">No Agent activity in this range</div>')
  } else if (kind === 'grants') {
    const now = Date.now(); const active = (app.data.grants || []).filter((grant) => !grant.revokedAt && (!grant.expiresAt || grant.expiresAt > now) && (!grant.maxReads || (grant.reads ?? 0) < grant.maxReads))
    openModal('Active grants', active.length ? '<table><tr><th>Agent</th><th>Item</th><th>Expires</th><th>Reads</th></tr>' + active.map((grant) => '<tr><td>' + esc(agentLabel(grant.agent)) + '</td><td><code>' + esc(grant.name) + '</code></td><td>' + (grant.expiresAt ? new Date(grant.expiresAt).toLocaleString('en-GB', { hour12: false }) : 'Permanent') + '</td><td>' + (grant.reads ?? 0) + '/' + (grant.maxReads || '∞') + '</td></tr>').join('') + '</table>' : '<div class="hint">No active grants</div>')
  } else if (kind === 'pending') {
    // The card and the banner both land on this one sheet, so an approval is
    // read in one place while the two counters stay in agreement.
    openPendingSheet()
  }
}
let legendPage = 0
const LEGEND_PER_PAGE = 8
/* The first screen answers one question: does anything need me right now? */
function renderOverviewActions() {
  const box = $('ov-actions'); if (!box) return
  const sub = $('ov-sub')
  if (sub) {
    const me = app.me || {}
    const bits = [me.email || '', me.unlocked ? 'Unlocked' : 'Locked', (app.items || []).length + ' secrets', ((app.data && app.data.agents) || []).length + ' Agents']
    sub.textContent = bits.filter(Boolean).join(' · ')
  }
  box.innerHTML = '<h2>Secret health</h2>' + healthRowsHtml()
  box.querySelectorAll('[data-health]').forEach((button) => {
    button.onclick = () => {
      const list = button.parentElement.querySelector('.health-list')
      if (!list) return
      const open = list.classList.toggle('hidden') === false
      button.setAttribute('aria-expanded', String(open))
      button.classList.toggle('open', open)
    }
  })
  box.querySelectorAll('[data-item-menu]').forEach((button) => { button.onclick = () => openItemMenu(button.dataset.itemMenu) })
}

// What the vault holds, as opposed to how often it was read: how many
// credentials an agent can hand over in plaintext, how many are unclassified,
// how many are about to stop working. Read counts already have a trend, a
// ranking and a donut; this is the dimension nobody could see.
function healthRowsHtml() {
  // Before /api/items answers there are no items to count, and every row would
  // read 0 with its all-clear hint ("All classified", "All need approval") — a security card
  // claiming everything is fine because it has not looked yet.
  if (!app.itemsLoaded) return '<div class="hint">Loading secrets…</div>'
  const items = app.items || []
  const data = app.data || {}
  const now = Date.now()
  const kinds = ((data.fillPolicies && data.fillPolicies.items) || []).reduce((map, entry) => {
    if (entry && entry.itemId) map[entry.itemId] = entry.kind || ''
    return map
  }, {})
  const policies = data.policies || {}
  // "Readable in plaintext" means an Agent holds a live read grant for it, not "this is an
  // api credential". Counting the classification said 8 while 22 items were
  // readable, because a grant is what lets a value out.
  const readableIds = new Set()
  for (const action of (data.agentActions || [])) {
    if (action.action !== 'secret.read') continue
    if (action.expiresAt && action.expiresAt <= now) continue
    if (action.usesLeft === 0) continue
    if (action.itemId) readableIds.add(action.itemId)
  }
  for (const entry of ((data.fillPolicies && data.fillPolicies.items) || [])) {
    if (entry && entry.itemId && entry.plaintextRead) readableIds.add(entry.itemId)
  }
  let web = 0, api = 0, none = 0, noApproval = 0, soon = 0, past = 0, staleRotate = 0
  // Reminder only: nothing in the authorize path reads this number.
  const rotateDays = Math.max(30, Math.min(3650, Number(data.rotateReminderDays) || 180))
  const rotateCutoff = now - rotateDays * 86400e3
  for (const item of items) {
    const kind = kinds[item.id] || ''
    if (kind === 'web') web += 1
    else if (kind === 'api') api += 1
    else none += 1
    if ((policies[item.name] && policies[item.name].noApproval) || item.noApproval) noApproval += 1
    // expiresAt is a number, 0 means "no expiry"; Date.parse on a number is NaN.
    if (item.expiresAt > now) { if (item.expiresAt - now < 7 * 86400e3) soon += 1 }
    else if (item.expiresAt > 0) past += 1
    // Never-rotated items are judged by creation time; an item with neither
    // date is left out rather than reported as overdue by default.
    const lastRotate = Date.parse(String(item.lastRotatedAt || '')) || Date.parse(String(item.createdAt || ''))
    if (Number.isFinite(lastRotate) && lastRotate > 0 && lastRotate < rotateCutoff) staleRotate += 1
  }
  const total = items.length || 1
  const bucketsOf = { readable: [], web: [], none: [], noApproval: [], expiry: [], rotate: [] }
  for (const item of items) {
    const kind = kinds[item.id] || ''
    if (readableIds.has(item.id)) bucketsOf.readable.push(item)
    // An API key was falling into Unclassified with everything unclassified, so the
    // expanded list disagreed with the counter above it.
    if (kind === 'web') bucketsOf.web.push(item)
    else if (kind !== 'api') bucketsOf.none.push(item)
    if ((policies[item.name] && policies[item.name].noApproval) || item.noApproval) bucketsOf.noApproval.push(item)
    if (item.expiresAt > now && item.expiresAt - now < 7 * 86400e3) bucketsOf.expiry.push(item)
    const lastRotate = Date.parse(String(item.lastRotatedAt || '')) || Date.parse(String(item.createdAt || ''))
    if (Number.isFinite(lastRotate) && lastRotate > 0 && lastRotate < rotateCutoff) bucketsOf.rotate.push(item)
  }
  // A row is a summary you can open: the credentials behind the number are one
  // tap away, in place, so checking "which ones are unclassified" does not throw
  // away the dashboard to go and look.
  const row = (key, label, value, hint, tone) => '<div class="health-item">'
    + '<button class="health-row" data-health="' + key + '" aria-expanded="false">'
    + '<span class="health-bar"><i style="width:' + Math.round((value / total) * 100) + '%" data-tone="' + tone + '"></i></span>'
    + '<span class="health-label">' + label + '</span>'
    + '<span class="health-value">' + value + '</span>'
    + '<span class="health-hint">' + hint + '</span>'
    + (value ? '<span class="health-chev">›</span>' : '')
    + '</button>'
    + (value ? '<div class="health-list hidden">' + bucketsOf[key].slice(0, 8).map((item) => '<button class="health-cred" data-item-menu="' + esc(item.name) + '">'
      + '<b>' + esc(item.name) + '</b><span>' + esc(item.group || '') + '</span></button>').join('')
      + (bucketsOf[key].length > 8 ? '<div class="health-more">' + (bucketsOf[key].length - 8) + ' more</div>' : '')
      + '</div>' : '')
    + '</div>'
  return '<div class="health">'
    + row('readable', 'Readable in plaintext', bucketsOf.readable.length, bucketsOf.readable.length ? 'Items with a read grant, incl. no-approval ones' : 'No read grants', 'blue')
    + row('web', 'Fill only', web, web ? 'Web logins; values never leave' : 'No web logins', 'purple')
    + row('none', 'Unclassified', none, none ? 'Reads denied by default' : 'All classified', none ? 'orange' : 'green')
    + row('noApproval', 'No approval needed', noApproval, noApproval ? 'Agent reads skip approval' : 'All need approval', 'green')
    + row('expiry', 'Expires within 7 days', soon + past, past ? past + ' expired' : soon ? soon + ' expiring within 7 days; review them' : 'Nothing expiring soon', soon || past ? 'orange' : 'green')
    + row('rotate', 'Not rotated for over ' + rotateDays + ' days', staleRotate, staleRotate ? staleRotate + ' due for rotation; click an item to handle it' : 'All within the ' + rotateDays + '-day reminder window', staleRotate ? 'orange' : 'green')
    + '</div>'
}
// Week × hour, for the same reason the trend exists but at a scale a single
// day hides: "read a lot on Tuesday morning" is the pattern people act on.
function heatGridHtml() {
  const entries = (app.data && app.data.audit) || []
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const grid = Array.from({ length: 7 }, () => new Array(24).fill(0))
  for (const entry of entries) {
    if (!/^secret\.(read|use|fill)/.test(String(entry.event || ''))) continue
    const at = new Date(entry.time)
    if (Number.isNaN(at.getTime())) continue
    const day = (at.getDay() + 6) % 7
    grid[day][at.getHours()] += 1
  }
  const max = Math.max(1, ...grid.flat())
  const head = '<div class="heat__corner"></div>' + grid[0].map((_, hour) => '<div class="heat__hour">' + (hour % 3 === 0 ? String(hour).padStart(2, '0') : '') + '</div>').join('')
  const rows = grid.map((row, day) => '<div class="heat__day">' + days[day] + '</div>' + row.map((count, hour) => {
    const level = count / max
    return '<div class="heat__cell" data-count="' + count + '"' + (count ? ' style="background:color-mix(in srgb,var(--blue) ' + Math.round(12 + level * 88) + '%,transparent)"' : '')
      + ' title="' + days[day] + ' ' + String(hour).padStart(2, '0') + ':00 · ' + count + ' reads">' + (count && level > 0.72 ? count : '') + '</div>'
  }).join('')).join('')
  const total = grid.flat().reduce((sum, n) => sum + n, 0)
  return '<div class="heat">' + head + rows + '</div>'
    + '<div class="heat__legend"><span>Less</span>' + [12, 30, 50, 70, 100].map((a) => '<i style="background:color-mix(in srgb,var(--blue) ' + a + '%,transparent)"></i>').join('') + '<span>More</span><span class="heat__total">' + entries.length + ' audit log entries · ' + total + ' reads total</span></div>'
}

const trendFaces = [
  { id: 'chart', title: 'Read trend', hint: 'Grouped by time · hover for values' },
  { id: 'heat', title: 'Read heatmap', hint: 'Weekday × hour · darker means more' },
]
let trendFace = 0

function renderTrendFace() {
  const face = trendFaces[trendFace]
  const title = $('trend-title')
  const hint = $('trend-hint')
  const count = $('trend-count')
  if (title) title.textContent = face.title
  if (hint) hint.textContent = face.hint
  if (count) count.textContent = (trendFace + 1) + '/' + trendFaces.length
  show('chart-box', face.id === 'chart')
  show('heat-box', face.id === 'heat')
  if (face.id === 'heat') { const box = $('heat-box'); if (box) box.innerHTML = heatGridHtml() }
}

function renderStats() {
  const stats = app.stats || { totalReads: 0, activeAgents: 0, pending: 0, activeGrants: 0, buckets: [], topItems: [], topAgents: [] }
  // The third card is the approvals count. Whatever else is waiting is printed
  // as its own labelled number, never added into the value: the old card showed
  // pending + reminders as one figure, which is how "3 / 4 / 3" happened.
  const pendingCount = ((app.data && app.data.pending) || []).length + pendingConnections().length
  const reminderCount = ((app.data && app.data.reminders) || []).length
  const cards = [{ l: 'Reads', v: stats.totalReads, sub: 'This range · click to view', view: 'reads' }, { l: 'Active Agents', v: stats.activeAgents, sub: 'With reads', view: 'agents' }, { l: 'Pending approvals', v: pendingCount, sub: reminderCount ? 'Reminders: ' + reminderCount + ' · click to handle' : 'Click to handle', warn: pendingCount > 0, view: 'pending' }, { l: 'Active grants', v: stats.activeGrants, sub: 'Incl. no-approval', view: 'grants' }]
  // No sparkline in the KPI: its series is the same one the trend card draws
  // two rows below, so it only restated the chart at 20px tall.
  $('kpis').innerHTML = cards.map((card) => '<div class="kpi' + (card.warn ? ' warn' : '') + '" data-kpi="' + card.view + '"' + (card.event ? ' data-kpi-event="' + card.event + '"' : '') + '><div class="label">' + card.l + '</div><div class="value">' + card.v + '</div><div class="sub">' + card.sub + '</div></div>').join('')
  renderOverviewActions()
  const buckets = stats.buckets || []; const max = Math.max(1, ...buckets.map((b) => b.count)); const W = 600, H = 180, px = 38, py = 18, iw = W - 2 * px, ih = H - 2 * py; const slot = buckets.length ? iw / buckets.length : 0; const barW = Math.max(2, Math.min(26, slot * 0.58))
  let grid = ''; for (let g = 0; g <= 4; g++) { const y = py + ih * g / 4; grid += '<line x1="' + px + '" y1="' + y + '" x2="' + (W - px) + '" y2="' + y + '" stroke="currentColor" stroke-opacity=".06"/><text x="4" y="' + (y + 3) + '" fill="currentColor" font-size="9" opacity=".5">' + Math.round(max * (4 - g) / 4) + '</text>' }
  const bars = buckets.map((bucket, index) => { const h = bucket.count / max * ih; const x = px + index * slot + (slot - barW) / 2; const y = H - py - h; return '<rect data-chart data-label="' + esc(bucket.label) + '" data-count="' + bucket.count + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + Math.max(h, 0.6).toFixed(1) + '" rx="3" fill="var(--blue)" opacity="' + (bucket.count ? 0.95 : 0.22) + '" style="cursor:pointer"/>' }).join('')
  const labels = buckets.map((bucket, index) => index % Math.max(1, Math.ceil(buckets.length / 6)) === 0 ? '<text x="' + (px + index * slot + slot / 2).toFixed(1) + '" y="' + (H - 4) + '" text-anchor="middle" fill="currentColor" font-size="9" opacity=".55">' + esc(bucket.label) + '</text>' : '').join('')
  $('chart-box').innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '">' + grid + bars + labels + '</svg>'
  const tip = $('chart-tip')
  const showTip = (event, label, count) => { if (!tip) return; tip.textContent = label + ' · ' + count + ' reads'; tip.classList.add('show'); tip.style.left = Math.min(window.innerWidth - 160, event.clientX + 12) + 'px'; tip.style.top = Math.max(8, event.clientY - 34) + 'px' }
  const hideTip = () => { if (tip) tip.classList.remove('show') }
  $('chart-box').querySelectorAll('[data-chart]').forEach((bar) => { bar.addEventListener('mouseenter', (event) => showTip(event, bar.dataset.label, bar.dataset.count)); bar.addEventListener('mousemove', (event) => showTip(event, bar.dataset.label, bar.dataset.count)); bar.addEventListener('mouseleave', hideTip) })
  const agents = stats.topAgents || []; const totalAgents = agents.reduce((sum, agent) => sum + agent.count, 0); const colors = ['#0f9d8a', '#5b6cff', '#f2994a', '#b6c2d9', '#a78bfa', '#14b8a6']; const R = 54, CIRC = 2 * Math.PI * R; let offset = 0
  const segments = agents.map((agent, index) => { const length = CIRC * (agent.count / Math.max(1, totalAgents)); const dash = Math.max(0, length - 2); const segment = '<circle class="donut-seg" data-donut data-agent="' + esc(agent.name) + '" data-count="' + agent.count + '" data-percent="' + Math.round(agent.count / Math.max(1, totalAgents) * 100) + '" cx="75" cy="75" r="' + R + '" fill="none" stroke="' + colors[index % colors.length] + '" stroke-width="19" stroke-dasharray="' + dash.toFixed(2) + ' ' + (CIRC - dash).toFixed(2) + '" stroke-dashoffset="' + (-offset).toFixed(2) + '" opacity=".9"/>'; offset += length; return segment }).join('')
  const pageCount = Math.max(1, Math.ceil(agents.length / LEGEND_PER_PAGE))
  if (legendPage >= pageCount) legendPage = 0
  const pageAgents = agents.slice(legendPage * LEGEND_PER_PAGE, (legendPage + 1) * LEGEND_PER_PAGE)
  const offsetBase = legendPage * LEGEND_PER_PAGE
  const legendHtml = pageAgents.map((agent, index) => { const pct = Math.round(agent.count / Math.max(1, totalAgents) * 100); return '<div data-legend data-agent="' + esc(agent.name) + '" data-count="' + agent.count + '" data-percent="' + pct + '"><span><span class="dot" style="background:' + colors[(offsetBase + index) % colors.length] + '"></span>' + esc(agent.name) + '</span><b>' + pct + '%</b></div>' }).join('')
  const pager = agents.length > LEGEND_PER_PAGE ? '<div class="legend-pager"><button id="legend-prev">‹</button><span>' + (legendPage + 1) + '/' + pageCount + '</span><button id="legend-next">›</button></div>' : ''
  $('donut-box').innerHTML = '<div class="donut-svg"><svg viewBox="0 0 150 150">' + (segments || '<circle cx="75" cy="75" r="54" fill="none" stroke="var(--btn)" stroke-width="19"/>') + '</svg><div class="donut-center" id="donut-center">' + totalAgents + '</div></div><div style="flex:1;min-width:0;display:flex;flex-direction:column"><div class="legend">' + legendHtml + '</div>' + pager + '</div>'
  const donutCenter = $('donut-center')
  const selectDonut = (target) => {
    const agent = target?.dataset.agent; if (!agent) return
    const already = target.classList.contains('active')
    $('donut-box').querySelectorAll('[data-donut],[data-legend]').forEach((el) => el.classList.remove('active'))
    if (already) { donutCenter.textContent = totalAgents; return }
    $('donut-box').querySelectorAll('[data-donut],[data-legend]').forEach((el) => { if (el.dataset.agent === agent) el.classList.add('active') })
    donutCenter.textContent = agent + ' ' + target.dataset.percent + '%'
  }
  const prevBtn = $('legend-prev')
  const nextBtn = $('legend-next')
  if (prevBtn) prevBtn.onclick = () => { legendPage = Math.max(0, legendPage - 1); renderStats() }
  if (nextBtn) nextBtn.onclick = () => { legendPage = legendPage + 1; renderStats() }
  $('donut-box').querySelectorAll('[data-donut],[data-legend]').forEach((el) => { el.addEventListener('click', () => selectDonut(el)); el.addEventListener('mouseenter', (event) => { if (el.dataset.count) showTip(event, el.dataset.agent, el.dataset.count) }); el.addEventListener('mouseleave', hideTip) })
  // Five is what the card has room for; the server sends up to twenty.
  const top = (stats.topItems || []).slice(0, 20); const totalTop = top.reduce((sum, item) => sum + item.count, 0) || 1; const maxTop = Math.max(1, ...top.map((item) => item.count))
  $('top-box').innerHTML = top.length ? '<div class="rank">' + top.map((item, index) => { const pct = Math.max(4, Math.round(item.count / maxTop * 100)); return '<div class="rank__row"><div class="rank__head"><span class="rank__name">' + (index + 1) + '. ' + esc(item.name) + '</span><span class="rank__count">' + item.count + ' reads</span></div><div class="rank__track"><div class="rank__fill" style="width:' + pct + '%"></div></div></div>' }).join('') + '</div>' : '<div class="hint">No reads in this range yet.</div>'
  renderTrendFace()
  $('updated').textContent = 'Last updated ' + new Date().toLocaleTimeString('en-GB', { hour12: false })
}
// ── Expiry & rotation table ────────────────────────────────────────────────
// The bottom-right slot answers "what should I rotate or renew, and when".
// The health card counts buckets; this table is the per-item dates behind
// those buckets, so the same number is never printed twice. It reads
// app.items, already loaded for the health card: no new endpoint, no polling.
const AGING_LIMIT = 3
let agingSort = { key: 'days', dir: 1 }
function agingRotateDays() {
  const days = Number(app.data && app.data.rotateReminderDays)
  return Number.isFinite(days) && days > 0 ? Math.max(30, Math.min(3650, days)) : 180
}
function agingRows() {
  const now = Date.now()
  const cutoff = now - agingRotateDays() * 86400e3
  return (app.items || []).map((item) => {
    const rotatedAt = Date.parse(String(item.lastRotatedAt || '')) || Date.parse(String(item.createdAt || ''))
    const rotated = Number.isFinite(rotatedAt) && rotatedAt > 0 ? rotatedAt : 0
    const expires = Number(item.expiresAt) > 0 ? Number(item.expiresAt) : 0
    const days = expires ? Math.round((expires - now) / 86400e3) : null
    let status = 'OK'
    let tone = 'green'
    if (expires && expires <= now) { status = 'Expired'; tone = 'red' }
    else if (expires && days <= 7) { status = 'Expiring soon'; tone = 'orange' }
    else if (rotated && rotated < cutoff) { status = 'Rotation due'; tone = 'orange' }
    return { name: String(item.name || ''), rotated, expires, days, status, tone }
  })
}
function agingSortValue(row, key) {
  if (key === 'name') return row.name.toLowerCase()
  if (key === 'rotated') return row.rotated || null
  if (key === 'expires') return row.expires || null
  return row.days
}
function agingSorted() {
  const rows = agingRows()
  const key = agingSort.key
  rows.sort((a, b) => {
    const av = agingSortValue(a, key)
    const bv = agingSortValue(b, key)
    // An item without an expiry is not "first": it stays after every dated
    // row in both directions, so flipping the arrow never claims otherwise.
    if (av === null && bv === null) return 0
    if (av === null) return 1
    if (bv === null) return -1
    if (av < bv) return -agingSort.dir
    if (av > bv) return agingSort.dir
    return a.name.localeCompare(b.name)
  })
  return rows
}
function agingDate(ms) {
  if (!ms) return '—'
  return new Date(ms).toLocaleDateString('en-GB', { month: '2-digit', day: '2-digit' })
}
function agingFull(ms) {
  if (!ms) return 'None'
  return new Date(ms).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour12: false })
}
function agingRemaining(row) {
  if (!row.expires) return 'Permanent'
  return row.days + ' days'
}
function agingRowHtml(row) {
  return '<tr data-aging-row="' + esc(row.name) + '">'
    + '<td><button class="aging-row-btn" type="button" data-aging-open="' + esc(row.name) + '" title="' + esc(row.name) + '">' + esc(row.name) + '</button></td>'
    + '<td title="' + esc(agingFull(row.rotated)) + '">' + agingDate(row.rotated) + '</td>'
    + '<td title="' + esc(row.expires ? agingFull(row.expires) : 'No expiry date') + '">' + agingDate(row.expires) + '</td>'
    + '<td title="' + esc(agingRemaining(row)) + '">' + agingRemaining(row) + '</td>'
    + '<td><span class="aging-tag" data-tone="' + row.tone + '">' + row.status + '</span></td>'
    + '</tr>'
}
function renderAging() {
  const body = $('aging-rows'); if (!body) return
  const countEl = $('aging-count')
  const foot = $('aging-foot')
  const more = $('aging-more')
  const empty = (title, text, action) => {
    if (countEl) { countEl.textContent = '—'; countEl.removeAttribute('data-warn') }
    if (foot) foot.classList.add('hidden')
    body.innerHTML = '<tr><td colspan="5" class="aging-msg"><b>' + title + '</b><span>' + text + '</span>' + (action || '') + '</td></tr>'
  }
  if (app.itemsError) {
    empty('Couldn’t load items', esc(app.itemsError), '<div class="row"><button class="small" id="aging-retry" type="button">Retry</button></div>')
    const retry = $('aging-retry')
    if (retry) retry.onclick = () => { app.itemsError = ''; renderAging(); loadAll() }
    return
  }
  if (!app.itemsLoaded) { empty('Loading items…', 'The list comes only from this server; no third parties are contacted.'); return }
  const rows = agingSorted()
  if (!rows.length) {
    empty('Nothing to schedule', 'The vault has no items yet. Add one and its expiry and rotation will show up here.', '<div class="row"><button class="small" id="aging-go-items" type="button">Add in Secrets</button></div>')
    const go = $('aging-go-items')
    if (go) go.onclick = () => document.querySelector('#nav [data-view="items"]').click()
    return
  }
  const shown = rows.slice(0, AGING_LIMIT)
  body.innerHTML = shown.map(agingRowHtml).join('')
  if (countEl) {
    countEl.textContent = rows.length + ' items'
    if (rows.some((row) => row.tone !== 'green')) countEl.setAttribute('data-warn', '1')
    else countEl.removeAttribute('data-warn')
  }
  if (foot) foot.classList.toggle('hidden', rows.length <= AGING_LIMIT)
  if (more) more.textContent = rows.length > AGING_LIMIT ? '' + (rows.length - AGING_LIMIT) + ' more not shown' : ''
  agingPaintSort()
}
function agingPaintSort() {
  document.querySelectorAll('#aging-table th[data-sort-key]').forEach((th) => {
    const active = th.dataset.sortKey === agingSort.key
    th.setAttribute('aria-sort', active ? (agingSort.dir === 1 ? 'ascending' : 'descending') : 'none')
    const arrow = th.querySelector('.aging-arrow')
    if (arrow) arrow.textContent = active ? (agingSort.dir === 1 ? '↑' : '↓') : ''
  })
}
function openAgingAll() {
  const rows = agingSorted()
  openModal('Expiry and rotation', '<div class="hint">All ' + rows.length + ' items · the health card has the counts, this has the dates</div>'
    + '<div class="table-wrap"><table><caption>All ' + rows.length + ' items: last rotation, expiry and days left</caption>'
    + '<thead><tr><th scope="col">Item</th><th scope="col">Last rotated</th><th scope="col">Expires</th><th scope="col">Days left</th><th scope="col">Status</th></tr></thead>'
    + '<tbody>' + rows.map(agingRowHtml).join('') + '</tbody></table></div>')
  document.querySelectorAll('#modal [data-aging-open]').forEach((button) => {
    button.onclick = () => openItemMenu(button.dataset.agingOpen)
  })
}
// "How many Agents can use this" and "how many credentials can this Agent
// read" are the same fact seen from two sides: a live grant. Grants arrive in
// two shapes — capabilities in agentActions, and legacy rows in grants — and
// both say the same thing about the pair (subject, item).
function liveRight(entry, now = Date.now()) {
  if (!entry || entry.revokedAt) return false
  if (entry.expiresAt && entry.expiresAt <= now) return false
  if (entry.maxUses != null && (entry.usedCount ?? entry.reads ?? 0) >= entry.maxUses) return false
  return true
}
function readRightsByItem() {
  const map = new Map()
  const add = (name, subject) => { if (!name || !subject) return; if (!map.has(name)) map.set(name, new Set()); map.get(name).add(subject) }
  for (const action of (app.data && app.data.agentActions) || []) {
    if (action.action !== 'secret.read') continue
    if (!liveRight({ revokedAt: action.revokedAt, expiresAt: action.expiresAt, maxUses: action.maxUses, usedCount: action.usedCount, usesLeft: action.usesLeft })) continue
    if (action.usesLeft === 0) continue
    add(action.itemName, action.agent)
  }
  for (const grant of (app.data && app.data.grants) || []) {
    if (!liveRight(grant)) continue
    add(grant.name, grant.agent)
  }
  return map
}
// Vault 2.0 keeps its own database and its own lock: the console can be open
// against the cipher vault while this one is still closed, so it gets its own
// status line and its own password field.
// A device counts as Online while it has been seen in the last five minutes: every
// authenticated pull stamps last_seen_at, so this is a real signal, not a guess.
function vault2DeviceState(device) {
  if (device.revokedAt) return { label: 'Revoked', cls: 'kind-tag kind-none' }
  const seen = Date.parse(device.lastSeenAt || '')
  if (!Number.isNaN(seen) && Date.now() - seen < 5 * 60 * 1000) return { label: 'Online', cls: 'kind-tag kind-api' }
  return { label: 'Offline', cls: 'kind-tag kind-none' }
}

function renderVault2Devices(devices) {
  const host = $('v2-devices')
  if (!host) return
  host.innerHTML = '<div class="ios-group">' + (devices.length
    ? devices.map((device) => {
      const state = vault2DeviceState(device)
      const seen = device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleString() : 'Never connected'
      const made = device.createdAt ? new Date(device.createdAt).toLocaleDateString() : ''
      const actions = device.revokedAt
        ? '<button class="mini danger" data-v2-purge="' + esc(device.id) + '">Delete</button>'
        : '<button class="mini" data-v2-write="' + esc(device.id) + '" data-write="' + (device.canWrite ? '1' : '0') + '">' + (device.canWrite ? 'Writable' : 'Read-only') + '</button><button class="mini" data-v2-revoke="' + esc(device.id) + '">Revoke</button>'
      return '<div class="ios-row" data-device="' + esc(device.id) + '"><div class="ios-main"><div class="ios-title"><b>' + esc(device.name) + '</b> <span class="' + state.cls + '">' + state.label + '</span>' + (device.canWrite ? ' <span class="kind-tag kind-api">Writable</span>' : '') + '</div><div class="ios-sub">Last active ' + esc(seen) + (made ? ' · paired on ' + esc(made) : '') + '</div></div>' + actions + '</div>'
    }).join('')
    : '<div class="hint">No paired devices yet. Run secrets-broker pair on another machine and approve it via the link the terminal prints; the device then shows up here.</div>') + '</div>'
  host.classList.remove('hidden')
}

async function loadVault2(withItems = true) {
  const badge = $('v2-badge'); const line = $('v2-status'); const box = $('v2-box'); const msg = $('v2-msg')
  if (!badge) return
  msg.textContent = ''
  const devicesLine = $('devices-status'); const devicesMsg = $('devices-msg')
  if (devicesMsg) devicesMsg.textContent = ''
  try {
    const status = await api('/api/v2/status')
    app.v2 = status
    // "Unlocked but the plaintext listing has not passed TOTP" is its own state.
    app.plainOk = status.initialized === true ? status.plainOk === true : true
    renderLockedSurface()
    const list = await api('/api/v2/devices').catch(() => ({ devices: [] }))
    const devices = (list.devices || [])
    const ready = status.initialized === true
    const initButton = $('init-v2')
    if (initButton) initButton.classList.toggle('hidden', ready)
    badge.textContent = ready ? (status.unlocked ? 'Unlocked' : 'Locked') : 'Not initialized'
    line.textContent = ready
      ? ('Items: ' + Number(status.items || 0) + ' · revision ' + Number(status.revision || 0) + ' · paired devices: ' + devices.length + '' + (status.unlocked && status.keyExpiresAt ? ' · key valid until ' + new Date(status.keyExpiresAt).toLocaleTimeString() : ''))
      : 'Not initialized yet. Enter a master password of at least 12 characters and click “Initialize” to create an empty vault; to bring over old items, use “Import from old vault” after initializing.'
    if (devicesLine) {
      const online = devices.filter((device) => !device.revokedAt && vault2DeviceState(device).label === 'Online').length
      devicesLine.textContent = devices.length ? (devices.length + ' paired · ' + online + ' online') : 'No paired devices yet.'
    }
    // One unlock entry per state: an already-unlocked card must not keep asking.
    $('v2-unlock').textContent = ready ? (status.unlocked ? 'Unlocked' : 'Unlock') : 'Initialize'
    $('v2-unlock').classList.toggle('hidden', ready && status.unlocked)
    const v2Password = $('v2-password')
    if (v2Password) v2Password.classList.toggle('hidden', ready && status.unlocked)
    renderVault2Devices(devices)
    if (!status.unlocked) { box.classList.add('hidden'); box.innerHTML = ''; return }
    if (!withItems) return
    let plain
    try {
      plain = await api('/api/v2/items?plain=1')
    } catch (error) {
      // 428 means this unlock has not passed the second factor for the plaintext
      // listing yet. Ask once; the server remembers the pass for this session.
      if (error.status !== 428) throw error
      const code = await askCode('To show item names, enter the 6-digit code from your phone (once per unlock)')
      if (!/^\d{6}$/.test(code)) throw new Error('A 6-digit verification code is needed to show items')
      plain = await api('/api/v2/items?plain=1', { headers: { 'x-totp-code': code } })
    }
    app.plainOk = true
    renderLockedSurface()
    const rows = (plain.items || []).filter((row) => !row.deletedAt)
    box.innerHTML = rows.length
      ? '<div class="ios-group">' + rows.slice(0, 200).map((row) => {
        const payload = row.payload || {}
        const fields = Object.keys(payload).filter((key) => key !== 'name').length
        return '<div class="ios-row"><div class="ios-main"><div class="ios-title"><b>' + esc(payload.name || row.id) + '</b></div><div class="ios-sub">' + esc(row.kind || 'unclassified') + ' · ' + fields + ' fields</div></div></div>'
      }).join('') + '</div>'
      : '<div class="hint">No items yet.</div>'
    box.classList.remove('hidden')
  } catch (error) {
    msg.textContent = 'Loading failed: ' + error.message
    if (devicesMsg) devicesMsg.textContent = 'Loading failed: ' + error.message
  }
}

// Empty, loading and failed are three different jobs: create something, clear
// a filter, or retry. They all used to render as one grey "No items".
function itemsStateHtml() {
  const query = ($('item-filter')?.value || '').trim()
  if (app.itemsError) return '<div class="state" data-tone="error"><div class="state__title">Loading failed</div><div class="state__body">' + esc(app.itemsError) + '</div><div class="state__actions"><button class="primary" data-state-act="retry">Retry</button></div></div>'
  if (!app.itemsLoaded) return '<div class="state" data-tone="loading"><div class="state__title">Loading items…</div><div class="state__body">The list comes only from this server; no third parties are contacted.</div></div>'
  if (query) return '<div class="state"><div class="state__title">No matching items</div><div class="state__body">No name, group or URL contains “' + esc(query) + '”.</div><div class="state__actions"><button data-state-act="clear">Clear filter</button></div></div>'
  return '<div class="state"><div class="state__title">No items yet</div><div class="state__body">Secrets are stored only in this server’s D1; every Agent read goes through a policy or your approval.</div><div class="state__actions"><button class="primary" data-state-act="create">New item</button><button data-state-act="import">Import JSON</button></div></div>'
}
function setItemDensity(dense) {
  const box = $('items-box')
  const button = $('item-density')
  if (box) box.dataset.density = dense ? 'compact' : 'comfortable'
  if (button) {
    button.setAttribute('aria-pressed', dense ? 'true' : 'false')
    button.textContent = dense ? 'Density: compact' : 'Density: comfortable'
    button.setAttribute('title', dense ? 'Compact now; click for comfortable spacing' : 'Comfortable now; click for compact spacing')
  }
}
function renderItems() {
  // Locked: no rows exist client-side, so say why instead of showing "No items yet",
  // which would read as "the vault is empty". The action unlocks in place.
  if (app.locked === true) {
    const host = $('items-box')
    if (host) {
      host.innerHTML = '<div class="state" data-tone="locked"><div class="state__title">Locked · names redacted</div><div class="state__body">Approvals, logs and device management still work. To see item names or plaintext, unlock right here; you won’t leave the page.</div><div class="state__actions"><button class="primary" data-state-act="unlock">Unlock here</button></div></div>'
      const button = host.querySelector('[data-state-act="unlock"]')
      if (button) button.onclick = inlineUnlockSheet
    }
    const chip = $('item-status')
    if (chip) chip.textContent = 'Locked: names redacted'
    return
  }
  const query = ($('item-filter')?.value || '').trim().toLowerCase(); const items = (app.items || []).filter((item) => !query || item.name.toLowerCase().includes(query) || String(item.url || '').toLowerCase().includes(query) || String(item.group || '').toLowerCase().includes(query))
  // Which items are already classified, by name, and with which kind. The
  // classified list is keyed by id, so map it back through the item rows.
  // Sorting is a view of the same list: by name, by the last time anything was
  // read, or by how many Agents hold a grant for it (the "who can touch this"
  // question that used to need opening every credential).
  const sortBy = String(($('item-sort') && $('item-sort').value) || localStorage.getItem('sb-item-sort') || 'name')
  const rights = readRightsByItem()
  const rightsOf = (item) => (rights.get(item.name) || new Set()).size
  const activityOf = (item) => { const at = Date.parse(item.lastActivityAt || ''); return Number.isNaN(at) ? 0 : at }
  items.sort((a, b) => {
    if (sortBy === 'activity') return activityOf(b) - activityOf(a) || String(a.name).localeCompare(String(b.name))
    if (sortBy === 'access') return rightsOf(b) - rightsOf(a) || String(a.name).localeCompare(String(b.name))
    if (sortBy === 'expiry') {
      const ae = typeof a.expiresAt === 'number' && a.expiresAt > 0 ? a.expiresAt : Infinity
      const be = typeof b.expiresAt === 'number' && b.expiresAt > 0 ? b.expiresAt : Infinity
      return ae - be || String(a.name).localeCompare(String(b.name))
    }
    return String(a.name).localeCompare(String(b.name))
  })
  const kindByName = new Map()
  for (const entry of fillPolicyState().items || []) {
    if (entry.itemName) kindByName.set(entry.itemName, entry.kind)
  }
  // The tooltip must name the switch that actually decides the read, which is
  // the unclassified-plaintext behaviour setting — requireClassification is
  // only consulted for a no-approval item, so it is not the answer here.
  const guarded = (app.data && app.data.unclassifiedPlaintext) !== true
  const kindTag = (kind) => {
    if (kind === 'api') return ' <span class="kind-tag kind-api" title="API Key: you can let an Agent read the plaintext when needed">api</span>'
    if (kind === 'web') return ' <span class="kind-tag kind-web" title="Website login: can only be filled into its assigned sites; an Agent never gets the plaintext">web</span>'
    return ' <span class="kind-tag kind-none" title="' + (guarded ? 'Unclassified: plaintext reads are denied. Classify it in the item' : 'Unclassified: an Agent may read the plaintext. Classify it in the item') + '">' + (guarded ? 'Unclassified · no reads' : 'Unclassified · plaintext readable') + '</span>'
  }
  const ico = (kind) => { const paths = kind === 'web'
    ? '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/>'
    : kind === 'api'
      ? '<circle cx="8" cy="8" r="4"/><path d="M11 11l8 8M16 16l2-2M19 19l2-2"/>'
      : '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'
    return '<span class="ios-ico " data-kind="' + (kind || 'none') + '"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg></span>' }
  // Grouped like an iOS settings list: classified credentials first, the ones that
  // still need a decision below. Unclassified items are the risky ones, so they get
  // their own group instead of being lost in one long table.
  const row = (item) => {
    const kind = kindByName.get(item.name)
    const when = item.lastActivityAt ? relativeTime(Date.parse(item.lastActivityAt)) : 'No reads'
    const granted = rightsOf(item)
    const meta = [item.group, when, item.lastActor, granted ? granted + ' Agents can use it' : ''].filter(Boolean).map((part) => esc(part)).join(' · ')
    // 0 means "no expiry" in state.secretExpiry, so a plain numeric test made
    // every credential without a date read as expired.
    const expired = typeof item.expiresAt === 'number' && item.expiresAt > 0 && item.expiresAt <= Date.now()
    // A credential that still works but expires within the week is the one an
    // operator can act on; "Expired" is already too late for that job.
    const soonDays = typeof item.expiresAt === 'number' && item.expiresAt > Date.now() && item.expiresAt <= Date.now() + 7 * 86400000
      ? Math.ceil((item.expiresAt - Date.now()) / 86400000)
      : 0
    // Deliberately weaker than the expiry badge: rotation is a nudge, and a
    // secret that has not been rotated is not "broken" the way an expired one is.
    const rotateDaysLimit = Math.max(30, Math.min(3650, Number((app.data || {}).rotateReminderDays) || 180))
    const lastRotate = Date.parse(String(item.lastRotatedAt || '')) || Date.parse(String(item.createdAt || ''))
    const rotateDays = Number.isFinite(lastRotate) && lastRotate > 0 ? Math.floor((Date.now() - lastRotate) / 86400000) : 0
    const rotateStale = rotateDays > rotateDaysLimit
    // The pill is the approval state and nothing else: it used to read Expired
    // whenever the credential expired, which hid the state the click changes and
    // made a successful toggle look like it did nothing. Expiry is a separate fact,
    // so it rides along in the subtitle instead.
    const approval = item.noApproval ? 'No approval needed' : kind === 'web' ? 'Fill only' : kind ? 'Needs approval' : 'Unclassified'
    const trail = '<button class="ios-pill ' + (item.noApproval ? 'on' : kind === 'web' ? 'web' : kind ? '' : 'none') + '" data-policy="' + esc(item.name) + '" aria-pressed="' + (item.noApproval ? 'true' : 'false') + '" title="Click to toggle: read without approval / needs approval">'
      + esc(approval) + '</button>'
    return '<div class="ios-row">' +
      '<input type="checkbox" class="item-select ios-check" data-name="' + esc(item.name) + '" ' + (selectedItems.has(item.name) ? 'checked' : '') + ' title="Select" aria-label="Select ' + esc(item.name) + '">' +
      ico(kind) +
      '<div class="ios-main" data-item-menu="' + esc(item.name) + '" role="button" tabindex="0">' +
        // The ellipsis cut long names with no way to read the rest; the title
        // attribute carries the full text on hover and in the a11y tree.
        '<div class="ios-title"><b title="' + esc(item.name) + '">' + esc(item.name) + '</b>' + (kind === 'api' || kind === 'web' ? kindTag(kind) : '') + '</div>' +
        '<div class="ios-sub">' + meta + (expired ? ' · <span class="ios-expired">Expired</span>' : '') + (soonDays ? ' · <span class="ios-soon">Expires in ' + soonDays + ' days</span>' : '') + (rotateStale ? ' · <span class="ios-rotate" title="' + rotateDays + ' days since last rotation or creation; consider rotating">' + rotateDays + ' days without rotation</span>' : '') + '</div>' +
      '</div>' +
      '<div class="ios-trail">' + trail + '</div>' +
    '</div>'
  }
  const classified = items.filter((item) => kindByName.get(item.name) === 'api' || kindByName.get(item.name) === 'web')
  const unclassified = items.filter((item) => !classified.includes(item))
  const showChecks = itemsSelecting || selectedItems.size > 0
  const group = (title, list) => (list.length
    ? '<div class="ios-group' + (showChecks ? ' selecting' : '') + '"><div class="ios-group-head"><span>' + title + ' · ' + list.length + '</span></div><div class="ios-card">' + list.map(row).join('') + '</div></div>'
    : '')
  // Unclassified first: those are the ones that still need a decision, so the
  // work that is left sits above the list that is already settled.
  $('items-box').innerHTML = items.length ? group('Unclassified', unclassified) + group('Classified', classified) : itemsStateHtml()
  $('items-box').querySelectorAll('[data-state-act]').forEach((button) => {
    button.onclick = () => {
      const action = button.dataset.stateAct
      if (action === 'retry') loadItems()
      else if (action === 'clear') { const filter = $('item-filter'); if (filter) { filter.value = ''; localStorage.removeItem('sb-item-filter') } renderItems() }
      else if (action === 'create') $('item-create')?.click()
      else if (action === 'import') $('item-import')?.click()
    }
  })
  $('items-box').querySelectorAll('.item-select').forEach((box) => { box.onchange = () => { if (box.checked) selectedItems.add(box.dataset.name); else selectedItems.delete(box.dataset.name); updateBulkBar() } })
  $('items-box').querySelectorAll('.ios-main').forEach((main) => { main.onkeydown = async (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (!(await confirmDiscard())) return; openItemMenu(main.dataset.itemMenu) } } })
  updateBulkBar()
}
function updateBulkBar() { const bar = $('bulk-bar'); if (!bar) return; bar.classList.toggle('hidden', selectedItems.size === 0); $('bulk-count').textContent = '' + selectedItems.size + ' selected'; if (!selectedItems.size) { const progress = $('bulk-progress'); if (progress) progress.textContent = '' } }
// null/undefined = permanent; past = expired; soon (<24h) flagged.
function expiryLabel(expiresAt) {
  if (typeof expiresAt !== 'number' || expiresAt <= 0) return 'Permanent'
  const left = expiresAt - Date.now()
  if (left <= 0) return '<span style="color:var(--danger)">Expired</span>'
  const days = Math.floor(left / 86400e3)
  const hours = Math.floor((left % 86400e3) / 3600e3)
  const text = days > 0 ? days + ' days' : hours + ' hours'
  return left < 86400e3 ? '<span style="color:var(--danger)">' + text + '</span>' : text
}
// ── Agent Live Globe (P3/P4) ────────────────────────────────────────────────
// Loaded lazily and entirely optional: any failure hides the globe and leaves
// the rest of the console untouched.
const globe = { instance: null, loading: false, failed: false, range: '24h', cursor: 0, events: [], timer: null, paused: false, hidden: true, pausedByView: false, reduceMotion: false, operator: null, broker: null, showArcs: true, showOperator: true }
function globeVisible() {
  return !globe.hidden && !document.hidden && !globe.paused
}
function stopGlobePolling() {
  if (globe.timer) { clearInterval(globe.timer); globe.timer = null }
}
async function fetchGlobeEvents(reset) {
  const since = reset ? 0 : globe.cursor
  const response = await api('/api/geo/events?range=' + encodeURIComponent(globe.range) + '&sinceSeq=' + since + '&limit=300')
  if (!response.enabled) return { disabled: true, events: [] }
  globe.operator = response.operator || null
  globe.broker = response.broker || null
  if (reset) globe.events = []
  // De-duplicate by id so a retried poll cannot double-plot.
  const seen = new Set(globe.events.map((e) => e.id))
  for (const ev of response.events || []) if (!seen.has(ev.id)) { globe.events.push(ev); seen.add(ev.id) }
  globe.cursor = Math.max(globe.cursor, Number(response.cursor || 0))
  return { disabled: false, events: globe.events }
}
function renderGlobeStatus(count) {
  const box = $('globe-status')
  if (!box) return
  box.textContent = count ? 'Real access events: ' + count + ' · updated every 30 seconds' : 'No real access events yet'
}
async function ensureGlobe() {
  if (globe.instance || globe.loading || globe.failed || globe.hidden) return globe.instance
  globe.loading = true
  try {
    const box = $('globe-box')
    if (!box) throw new Error('#globe-box missing')
    // Fail loudly and precisely: a zero-size container or an unsupported WebGL
    // context used to surface as a generic "component unavailable" message.
    if (!box.clientWidth || !box.clientHeight) throw new Error('globe container has no size (' + box.clientWidth + 'x' + box.clientHeight + ')')
    const probe = document.createElement('canvas')
    const gl = probe.getContext('webgl2') || probe.getContext('webgl')
    if (!gl) throw new Error('WebGL is unavailable in this browser')
    const mod = await import('/globe.js')
    if (typeof mod.mountGlobe !== 'function') throw new Error('globe module did not export mountGlobe')
    globe.instance = mod.mountGlobe(box, { reduceMotion: globe.reduceMotion })
    const card = $('globe-card'); if (card) { card.classList.remove('globe-failed'); card.classList.add('globe-live') }
    if (globe.paused) globe.instance.setPaused(true)
    return globe.instance
  } catch (error) {
    // Never let the globe break the console, but do surface why it failed so
    // the cause is diagnosable instead of being swallowed. The still earth
    // stays behind the message; a failure must not leave an empty frame.
    globe.failed = true
    const detail = String((error && (error.message || error.reason)) || error || 'unknown')
    try { console.error('[globe] load failed:', error) } catch {}
    const card = $('globe-card'); if (card) card.classList.add('globe-failed')
    const empty = $('globe-empty')
    if (empty) empty.innerHTML = '<div>Globe unavailable (everything else still works)<br><span style="font-size:11px;opacity:.7">' + esc(detail.slice(0, 160)) + '</span></div>'
    const st = $('globe-status')
    if (st) st.textContent = 'Globe failed to load: ' + detail.slice(0, 120)
    return null
  } finally { globe.loading = false }
}
async function refreshGlobe(reset) {
  if (globe.hidden || globe.failed) return
  try {
    const result = await fetchGlobeEvents(reset)
    if (result.disabled) {
      const card = $('globe-card'); if (card) card.classList.add('globe-failed')
      const empty = $('globe-empty'); if (empty) empty.innerHTML = '<div>Live globe is off</div>'
      const st = $('globe-status'); if (st) st.textContent = 'Feature flag GEO_ENABLED is off'
      stopGlobePolling()
      return
    }
    const events = result.events || []
    const empty = $('globe-empty')
    // Keep the overlay empty and inert: a caption across the globe would block dragging,
    // and the status line below already reports the record count.
    if (empty) { empty.textContent = ''; empty.style.display = 'none' }
    renderGlobeStatus(events.length)
    // Initialise the globe even with no events so the earth itself is visible;
    // only the markers depend on data. Skipping this left the card showing the
    // placeholder forever on a quiet broker.
    const instance = await ensureGlobe()
    if (!instance) return
    instance.setPoints(events, globe.operator, { showArcs: globe.showArcs, showOperator: globe.showOperator, broker: globe.broker })
  } catch { /* polling is best-effort */ }
}
function syncGlobePolling() {
  stopGlobePolling()
  if (!globeVisible() || globe.failed) return
  refreshGlobe(false)
  // 30s incremental polling; the globe is a monitoring view, not a ticker.
  globe.timer = setInterval(() => { if (globeVisible()) refreshGlobe(false) }, 30000)
}
// Leaving the overview hides the earth and stops its 30s poll: a background tab
// already backs off via document.hidden, but a visible tab on another page was
// still paying for a card nobody could see. Only a globe that was actually live
// is resumed, so a card the operator never opened stays off.
function syncGlobeToView(view) {
  if (view === 'overview') {
    if (!globe.pausedByView) return
    globe.pausedByView = false
    globe.hidden = false
    syncGlobePolling()
    return
  }
  globe.pausedByView = !globe.hidden
  if (globe.hidden) return
  globe.hidden = true
  stopGlobePolling()
}
function toggleGlobeFullscreen() {
  const box = $('globe-box')
  const button = $('globe-full')
  if (!box) return
  const next = !box.classList.contains('globe-full')
  box.classList.toggle('globe-full', next)
  if (button) button.textContent = next ? 'Shrink' : 'Expand'
  // Let the container settle before measuring for the new viewport size.
  requestAnimationFrame(() => { try { window.dispatchEvent(new Event('resize')) } catch {} })
}
// Live connection feed: only shown while there are fresh connections, and it
// scrolls like a danmaku stream. Each entry is a real captured event.
let danmuTimer = null
function stopDanmu() {
  if (danmuTimer) { clearInterval(danmuTimer); danmuTimer = null }
}
// Resolve the readable name for a captured event's agent. OAuth agents are
// stored as "oauth:<clientId>"; show the client name and drop the raw id so the
// feed stays readable.
function eventAgentName(ev) {
  const raw = String(ev.agent || '')
  if (!raw.startsWith('oauth:')) return raw
  const clientId = raw.slice(6)
  const client = ((app.data && app.data.oauthClients) || []).find((c) => c.clientId === clientId)
  return (client && client.clientName) || 'OAuth client'
}
function danmuLine(ev) {
  const g = ev.geo || {}
  const cc = g.country ? String(g.country).toUpperCase() : ''
  const city = g.city ? String(g.city).split(',')[0] : ''
  const where = [city, cc].filter(Boolean).join(' · ') || 'Unknown location'
  const time = ev.at ? new Date(ev.at).toLocaleTimeString('en-GB', { hour12: false }) : ''
  const color = ev.ok ? 'var(--ok,#0f9d8a)' : 'var(--danger)'
  return '<div class="danmu-row"><span class="danmu-time">' + esc(time) + '</span>' +
    '<b class="danmu-agent">' + esc(eventAgentName(ev)) + '</b>' +
    '<span class="danmu-where">' + esc(where) + '</span>' +
    '<span class="danmu-act">' + esc(ev.action || '') + '</span>' +
    '<span style="color:' + color + '">' + (ev.ok ? 'OK' : 'Failed') + '</span></div>'
}
function renderDanmu() {
  const feed = $('globe-danmu')
  if (!feed) { stopDanmu(); return }
  const events = (globe.events || []).slice(-40)
  if (!events.length) {
    feed.innerHTML = '<div class="danmu-empty">No connections yet</div>'
    stopDanmu()
    return
  }
  feed.innerHTML = events.slice().reverse().map(danmuLine).join('')
  // Animate new arrivals in from the bottom.
  const first = feed.firstElementChild
  if (first) first.classList.add('danmu-new')
}
function startDanmu() {
  stopDanmu()
  renderDanmu()
  // Keep the feed live while the modal is open and the page is visible.
  danmuTimer = setInterval(() => { if (!document.hidden) renderDanmu() }, 3000)
}
function openGlobeModal() {
  const events = globe.events || []
  const op = globe.operator
  const opText = op && op.known ? (op.city || op.country || 'Unknown') + ' (' + (op.country || '') + ')' : 'Not recorded'
  const toggles = '<div class="row" style="gap:16px;margin:12px 0">' +
    '<label class="chk" style="flex:0 0 auto"><input type="checkbox" id="gl-arcs" ' + (globe.showArcs ? 'checked' : '') + '> Show arcs</label>' +
    '<label class="chk" style="flex:0 0 auto"><input type="checkbox" id="gl-operator" ' + (globe.showOperator ? 'checked' : '') + '> Show my location</label>' +
    '</div>'
  const rows = events.length ? events.slice().reverse().slice(0, 100).map((ev) => {
    const g = ev.geo || {}
    const where = g.known ? (g.city || '') + (g.city && g.country ? ', ' : '') + (g.country || '') : 'Unknown location'
    const when = ev.at ? new Date(ev.at).toLocaleString('en-GB', { hour12: false }) : ''
    const color = ev.ok ? 'var(--accent,#0f9d8a)' : 'var(--danger)'
    return '<tr><td><b>' + esc(eventAgentName(ev)) + '</b> <span class="pill">' + (ev.kind === 'oauth' ? 'OAuth' : 'Token') + '</span></td>' +
      '<td class="hint">' + esc(where) + '</td>' +
      '<td class="hint">' + esc(ev.action || '') + '</td>' +
      '<td style="color:' + color + '">' + (ev.ok ? 'OK' : 'Failed') + '</td>' +
      '<td class="hint">' + esc(when) + '</td></tr>'
  }).join('') : ''
  // Enlarged view: the globe itself grows on the left, the live feed streams
  // beside it. This is a bigger globe, not a table of connections.
  const body = '<div class="globe-big" id="globe-big">' +
    '<div class="globe-big-stage">' +
      '<div id="globe-big-box" class="globe-box globe-box-big"></div>' +
      '<button class="small globe-big-close" id="globe-big-close">Close ✕</button>' +
    '</div>' +
    '<div class="globe-big-side">' +
      '<div class="row" style="justify-content:space-between;align-items:center;margin-bottom:8px"><b>Agent Live Globe</b><span class="hint">Enlarged view</span></div>' +
      '<div class="hint">My location (estimated from IP): <b>' + esc(opText) + '</b></div>' +
      toggles +
      '<div class="danmu-title" style="margin-top:10px">Live connections<span class="hint" style="margin-left:6px">OK = authorized and completed · Failed = not permitted or item not found (unrelated to location)</span></div>' +
      '<div id="globe-danmu" class="danmu-feed"></div>' +
    '</div>' +
    '</div>'
  const host = $('globe-overlay') || (() => {
    const el = document.createElement('div')
    el.id = 'globe-overlay'
    document.body.appendChild(el)
    return el
  })()
  host.innerHTML = body
  host.classList.add('globe-overlay-on')
  mountBigGlobe()
  startDanmu()
  const closeBtn = $('globe-big-close')
  if (closeBtn) closeBtn.onclick = closeBigGlobe
  const arcsToggle = $('gl-arcs')
  if (arcsToggle) arcsToggle.onchange = () => { globe.showArcs = arcsToggle.checked; refreshGlobe(true); redrawBigGlobe() }
  const opToggle = $('gl-operator')
  if (opToggle) opToggle.onchange = () => { globe.showOperator = opToggle.checked; refreshGlobe(true); redrawBigGlobe() }
}
// The modal hosts a second, larger globe instance.
let bigGlobe = null
async function mountBigGlobe() {
  const box = $('globe-big-box')
  if (!box) return
  try {
    const mod = await import('/globe.js')
    bigGlobe = mod.mountGlobe(box, { reduceMotion: globe.reduceMotion })
    redrawBigGlobe()
  } catch (error) {
    box.innerHTML = '<div class="globe-empty">' + esc(String(error && error.message || error).slice(0, 120)) + '</div>'
  }
}
function redrawBigGlobe() {
  if (!bigGlobe) return
  try { bigGlobe.setPoints(globe.events || [], globe.operator, { showArcs: globe.showArcs, showOperator: globe.showOperator }) } catch {}
}
function disposeBigGlobe() {
  if (!bigGlobe) return
  try { bigGlobe.dispose() } catch {}
  bigGlobe = null
}
function closeBigGlobe() {
  disposeBigGlobe()
  stopDanmu()
  const host = $('globe-overlay')
  if (host) { host.innerHTML = ''; host.classList.remove('globe-overlay-on') }
}
function initGlobe() {
  if (!$('globe-box')) return
  globe.reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (globe.reduceMotion) { globe.paused = true; const b = $('globe-pause'); if (b) { b.textContent = 'Resume'; b.setAttribute('aria-pressed', 'true'); b.setAttribute('aria-label', 'Resume globe animation') } }
  const rangeRow = $('globe-range')
  if (rangeRow) rangeRow.onclick = (event) => {
    const button = event.target.closest('[data-grange]')
    if (!button) return
    rangeRow.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === button))
    globe.range = button.dataset.grange
    globe.cursor = 0
    refreshGlobe(true)
  }
  const pauseBtn = $('globe-pause')
  if (pauseBtn) pauseBtn.onclick = () => {
    globe.paused = !globe.paused
    pauseBtn.textContent = globe.paused ? '▶' : '⏸'
    pauseBtn.title = globe.paused ? 'Resume animation' : 'Pause animation'
    // The glyph alone is not a name: announce what the button will do next.
    pauseBtn.setAttribute('aria-label', globe.paused ? 'Resume globe animation' : 'Pause globe animation')
    pauseBtn.setAttribute('aria-pressed', globe.paused ? 'true' : 'false')
    if (globe.instance) globe.instance.setPaused(globe.paused)
    syncGlobePolling()
  }
  // The card is now compact: the corner icon opens the enlarged view, which
  // carries the full-size globe plus the live connection feed.
  const fullBtn = $('globe-full')
  if (fullBtn) fullBtn.onclick = () => openGlobeModal()
  const boxEl = $('globe-box')
  // Distinguish a click from a drag: only a press-and-release without movement
  // opens the enlarged view, so rotating the globe never pops a dialog.
  if (boxEl) {
    let downX = 0, downY = 0, downAt = 0
    boxEl.addEventListener('pointerdown', (e) => { downX = e.clientX; downY = e.clientY; downAt = Date.now() })
    boxEl.addEventListener('pointerup', (e) => {
      if (e.target.tagName !== 'CANVAS') return
      const moved = Math.abs(e.clientX - downX) > 4 || Math.abs(e.clientY - downY) > 4
      const quick = Date.now() - downAt < 600
      if (!moved && quick) openGlobeModal()
    })
  }
  document.addEventListener('visibilitychange', syncGlobePolling)
  // Keep the globe palette in step with the console theme.
  if (window.MutationObserver) {
    new MutationObserver(() => {
      if (!globe.instance) return
      try { globe.instance.setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light') } catch {}
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  }
  refreshGlobe(true)
  syncGlobePolling()
}
const globeOpen = $('globe-open')
if (globeOpen) globeOpen.onclick = () => {
  const card = $('globe-card')
  if (!card || card.classList.contains('hidden') || (app.data && app.data.geoEnabled) !== true) return
  card.classList.remove('globe-off')
  globe.hidden = false
  if (!globeBooted) { globeBooted = true; initGlobe() } else syncGlobePolling()
}
// Home banner: pending approvals win, otherwise show authorization reminders.
// A single line scrolls through every outstanding item; clicking expands the
// full list in a modal.
let noticeIndex = 0
let noticeTimer = null
const NOTICE_READ_KEY = 'sb-notice-read-v1'
// Read state is per signed-in account, not per browser: two operators sharing
// one device must not inherit each other's dismissed notices. No server field
// exists for this, so it lives in localStorage.
function noticeReadKey() { return NOTICE_READ_KEY + ':' + String((app.me && (app.me.email || app.me.name)) || 'anon').toLowerCase() }
function noticeReadIds() {
  try {
    const raw = localStorage.getItem(noticeReadKey()) || localStorage.getItem(NOTICE_READ_KEY) || '[]'
    const saved = JSON.parse(raw); return Array.isArray(saved) ? saved : []
  } catch (error) { return [] }
}
function saveNoticeReadIds(ids) {
  try { localStorage.setItem(noticeReadKey(), JSON.stringify(ids.slice(-200))) } catch (error) { /* storage full or blocked: the bar just comes back */ }
}
function markNoticeRead(id) {
  const ids = noticeReadIds(); if (!id || ids.includes(id)) return
  ids.push(id); saveNoticeReadIds(ids)
}
function markAllNoticesRead() {
  const read = noticeReadIds()
  for (const item of noticeItems()) if (!read.includes(item.id)) read.push(item.id)
  saveNoticeReadIds(read)
}
function noticeItems() {
  const data = app.data || {}
  // Approvals and reminders share the banner, and neither is allowed to hide
  // the other: the old early return dropped every reminder while approvals
  // waited. Both counts are printed as labels on the bar, so the number here
  // matches the KPI card instead of being pending + reminders in one figure.
  const pending = (data.pending || []).map((entry) => ({
    id: 'pending:' + (entry.id || ''),
    tone: 'warn',
    level: 'pending',
    text: pendingAgentLabel(entry) + ': ' + pendingActionLabel(entry) + ' ' + String(entry.name || ''),
    kind: 'pending',
    entry,
  }))
  // First connections are approvals, not reminders: they join the pending
  // queue so one banner count and one sheet cover both kinds.
  const connections = ((data.connections && data.connections.pending) || []).map((entry) => ({
    id: 'connection:' + (entry.id || ''),
    tone: 'warn',
    level: 'pending',
    text: (entry.agent || 'Agent') + ': first connection request' + (entry.requestedPlaintext ? ' (wants plaintext)' : ''),
    kind: 'pending',
    variant: 'connection',
    entry,
  }))
  const reminders = (data.reminders || []).map((item) => ({
    id: 'reminder:' + item.kind + ':' + (item.agent || ''),
    tone: item.severity === 'critical' ? 'bad' : (item.severity === 'warning' ? 'warn' : 'plain'),
    level: item.severity === 'critical' ? 'critical' : (item.severity === 'warning' ? 'warning' : 'notice'),
    text: (item.kind && item.kind.indexOf('secret-') === 0 ? 'Secret ' : '') + (item.agent || '') + ': ' + (item.message || ''),
    kind: item.kind,
    entry: item,
  }))
  return pending.concat(connections, reminders)
}
function noticeCounts() {
  // The pill numbers follow what is still worth nagging about, so dismissing a
  // notice makes the number drop. The approvals queue itself is untouched: the
  // KPI card and Pending approvals sheet still list every waiting request.
  const read = noticeReadIds()
  const unread = noticeItems().filter((item) => !read.includes(item.id))
  return { pending: unread.filter((item) => item.kind === 'pending').length, reminders: unread.filter((item) => item.kind !== 'pending').length }
}
const BASE_TITLE = document.title || 'Secrets Broker · Cloudflare Workers'
// The in-bar prompt must be askable exactly once: after a denial or a dismissed
// browser prompt the button never comes back, so the bar cannot nag.
const NOTIFY_ASK_KEY = 'sb.notify.asked.v1'
// Separate key for the background-push offer. Granting the desktop permission
// does not subscribe a service worker, and the two are asked at different
// moments, so one flag cannot cover both.
const PUSH_ASK_KEY = 'sb.push.asked.v1'
function markPushOffered(ok) {
  if (!ok) return
  try { localStorage.setItem(PUSH_ASK_KEY, '1') } catch {}
  renderNoticeBar()
}
// A browser that already granted the permission can be subscribed without a
// second prompt. Doing it once after login is what makes "closed tab" pushes
// work without sending the operator to the settings page.
function offerPushOnce() {
  try {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    if (localStorage.getItem(PUSH_ASK_KEY) === '1') return
  } catch { return }
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
  enableWebPush().then(markPushOffered)
}
function notifyOptInHtml() {
  try {
    if (typeof Notification === 'undefined') return ''
    if (Notification.permission === 'default') {
      if (localStorage.getItem(NOTIFY_ASK_KEY) === '1') return ''
      return '<button type="button" class="na-notify" data-notice-notify aria-label="Enable desktop notifications to get alerted when approvals come in. Asked only once">Enable desktop notifications</button>'
    }
    // Permission is already granted, but an in-page Notification dies with the
    // tab. Offer the background subscription here rather than only in settings.
    if (Notification.permission === 'granted' && localStorage.getItem(PUSH_ASK_KEY) !== '1') {
      return '<button type="button" class="na-notify" data-notice-push aria-label="Enable background push to get approval notifications even with the page closed. Shown only once">Enable background push</button>'
    }
  } catch { return '' }
  return ''
}
function syncPendingTitle() {
  // Connection requests wait in the same queue, so the same title count answers
  // "is anyone waiting on me" from a background tab.
  const n = ((app.data && app.data.pending) || []).length + pendingConnections().length
  document.title = n ? '(' + n + ') ' + BASE_TITLE : BASE_TITLE
}
function waitedLabel(createdAt) {
  const ms = Date.now() - new Date(createdAt).getTime()
  if (!Number.isFinite(ms) || ms < 60000) return 'under 1 minute'
  const min = Math.floor(ms / 60000)
  if (min < 60) return min + ' minutes'
  const hr = Math.floor(min / 60)
  return hr < 24 ? hr + ' hours' : Math.floor(hr / 24) + ' days'
}
function notifyOptInHtml() {
  try {
    if (typeof Notification === 'undefined' || Notification.permission !== 'default') return ''
    if (localStorage.getItem(NOTIFY_ASK_KEY) === '1') return ''
  } catch { return '' }
  return '<button type="button" class="na-notify" data-notice-notify aria-label="Enable desktop notifications to get alerted when approvals come in. Asked only once">Enable desktop notifications</button>'
}
// Rows show who asked, which item and how long it has waited; the buttons are
// the duration the approver grants, so one click settles the request here.
function noticeApproveHtml(pendingUnread) {
  const rows = pendingUnread.slice(0, 2).map((item) => {
    const entry = item.entry || {}
    const isConnection = item.variant === 'connection'
    const who = isConnection ? (entry.agent || 'Agent') : pendingAgentLabel(entry)
    const action = isConnection ? 'First connection' : pendingActionLabel(entry)
    const name = isConnection ? (entry.requestedPlaintext ? 'with plaintext' : 'without plaintext') : String(entry.name || '')
    const blocked = !isConnection && String(entry.action || '') === 'secret.fill' && /^Invalid target/.test(pendingOriginLabel(entry))
    // A connection may only take the one-click duration when the agent asked
    // for everything: narrowing the scope silently would grant more than the
    // request spelled out, so that path opens the form instead.
    const quick = !isConnection || (entry.requestedScope || {}).all === true
    const age = entry.createdAt ? ' · waited ' + waitedLabel(entry.createdAt) + (isConnection ? ' · ' + connRemainingLabel(entry) : '') : ''
    const button = (decision, label, aria) => '<button type="button" data-quick-decide="' + decision + '" data-quick-kind="' + (isConnection ? 'connection' : '') + '" data-quick-id="' + esc(entry.id || '') + '" aria-label="' + esc(aria + ': ' + who + ' ' + action + ' ' + name) + '">' + label + '</button>'
    return '<div class="na-row">'
      + '<span class="na-who" title="' + esc(who) + '">' + esc(who) + '</span>'
      + '<span class="na-what">' + esc(action) + ' <b>' + esc(name) + '</b>' + esc(age) + '</span>'
      + (blocked ? '<span class="na-blocked">Invalid target, can’t approve</span>'
        : '<span class="na-actions">' + (isConnection
          ? (quick ? button('1h', 'Approve 1 hour', 'Approve for 1 hour, all items, no plaintext') : button('form', 'Choose scope', 'Choose items, then approve')) + button('deny', 'Deny', 'Deny')
          : button('1h', 'Approve 1 hour', 'Approve for 1 hour') + button('7d', 'Approve 7 days', 'Approve for 7 days') + button('deny', 'Deny', 'Deny')) + '</span>')
      + '</div>'
  }).join('')
  const more = pendingUnread.length > 2 ? '<button type="button" class="na-more" data-notice-approve-more aria-label="View all ' + pendingUnread.length + ' pending approvals">' + (pendingUnread.length - 2) + ' more ›</button>' : ''
  return '<div class="notice-approve" role="region" aria-label="Pending approvals, actionable here">'
    + '<div class="na-head"><span role="status" aria-live="polite">' + pendingUnread.length + ' pending · handle them here</span>' + more + notifyOptInHtml() + '</div>'
    + rows + '</div>'
}
async function decideQuickApproval(button) {
  const id = button.dataset.quickId
  const decision = button.dataset.quickDecide
  const connection = button.dataset.quickKind === 'connection'
  if (!id || button.disabled) return
  // Narrowing scope needs the checkbox list, so that click opens the sheet.
  if (connection && decision === 'form') { openPendingSheet(); return }
  // Denial never touches the vault key; approval does.
  if (connection && decision !== 'deny' && !vaultUnlocked()) {
    toast('Unlock the Vault to approve connections; denying doesn’t need it.', true)
    openPendingSheet()
    return
  }
  button.disabled = true
  button.setAttribute('aria-busy', 'true')
  try {
    if (connection) {
      const body = decision === 'deny'
        ? { id, decision: 'deny' }
        : { id, decision: 'approve', all: true, plaintextAllowed: false, duration: '1h' }
      await api('/api/connections/decide', { method: 'POST', body: JSON.stringify(body) })
      toast(decision === 'deny' ? 'Connection request denied' : 'Connection approved · 1 hour (no plaintext)')
    } else {
      await api('/api/pending/decide', { method: 'POST', body: JSON.stringify({ id, decision }) })
      toast(decision === 'deny' ? 'Denied' : decision === '7d' ? 'Approved for 7 days' : 'Approved for 1 hour')
    }
    await Promise.all([loadState(), loadStats(), loadItems()])
  } catch (error) {
    button.disabled = false
    button.removeAttribute('aria-busy')
    const stale = /not-pending|already handled|not found|not-found/i.test((error.reason || '') + ' ' + (error.message || ''))
    toast(stale ? 'This request was already handled or has expired. Queue refreshed.' : 'Approval failed: ' + error.message, true)
    if (stale) await loadState()
  }
}
async function enableWebPushFromBar() {
  const ok = await enableWebPush({ fromBar: true })
  markPushOffered(ok)
}
async function askNotifyFromBar() {
  // Mark first: a dismissed prompt must not bring the button back either.
  try { localStorage.setItem(NOTIFY_ASK_KEY, '1') } catch {}
  let permission = 'denied'
  try { permission = Notification.permission } catch {}
  try { if (permission === 'default') permission = await Notification.requestPermission() } catch {}
  updateBrowserNotifyStatus()
  renderNoticeBar()
  if (permission === 'granted') {
    toast('Desktop notifications on: you’ll be alerted when approvals come in')
    startPendingPolling()
    // The permission was just granted inside a user gesture, so subscribing the
    // service worker now needs no second prompt. Without it the notification
    // only fires while this tab is open.
    enableWebPush().then(markPushOffered)
  } else toast(permission === 'denied' ? 'Desktop notifications blocked; approvals still show in the tab title count and the notice bar' : 'Desktop notifications not enabled; approvals still show in the tab title count and the notice bar')
}
function renderNoticeBar() {
  const bar = $('notice-bar')
  if (!bar) return
  syncPendingTitle()
  const read = noticeReadIds()
  const items = noticeItems().filter((item) => !read.includes(item.id))
  if (!items.length) { bar.classList.add('hidden'); bar.innerHTML = ''; if (noticeTimer) { clearInterval(noticeTimer); noticeTimer = null }; return }
  bar.classList.remove('hidden')
  const order = { pending: 0, critical: 1, warning: 2, notice: 3 }
  const ranked = items.slice().sort((a, b) => order[a.level] - order[b.level])
  // Approvals outrank the rotating line: while anything waits the bar shows the
  // queue with its buttons, instead of cycling text under the operator.
  const pendingUnread = ranked.filter((item) => item.kind === 'pending')
  const head = pendingUnread.length ? pendingUnread[0] : ranked[0]
  bar.dataset.level = head.level
  const render = () => {
    const item = pendingUnread.length ? head : items[noticeIndex % items.length]
    const counts = noticeCounts()
    bar.dataset.level = item.level
    bar.dataset.tone = item.tone
    // A button cannot contain buttons: with the panel open the bar becomes a
    // group and the counters/View all keep the queue reachable by keyboard.
    if (pendingUnread.length) { bar.setAttribute('role', 'group'); bar.removeAttribute('tabindex') }
    else { bar.setAttribute('role', 'button'); bar.setAttribute('tabindex', '0') }
    const lead = pendingUnread.length
      ? (pendingUnread.length === 1 ? pendingUnread[0].text : pendingUnread.length + ' waiting: ' + pendingUnread[0].text)
      : item.text
    bar.innerHTML = '<span class="notice-dot"></span><span class="notice-text">' + esc(lead) + '</span>'
      + (counts.pending ? '<button type="button" class="notice-count" data-kind="pending" data-notice-open="pending">Pending ' + counts.pending + '</button>' : '')
      + (counts.reminders ? '<button type="button" class="notice-count" data-kind="reminder" data-notice-open="reminder">Reminders ' + counts.reminders + '</button>' : '')
      + '<button type="button" class="notice-more" data-notice-dismiss="' + esc(item.id) + '" aria-label="Dismiss this notice" title="Dismiss this notice (hides it only; approval state is unchanged)">✕</button>'
      + '<button type="button" class="notice-more" data-notice-dismiss-all aria-label="Mark all as read" title="Mark all as read (hides notices only; approval state is unchanged)">Mark all read</button>'
      + '<span class="notice-more">View all ›</span>'
      + (pendingUnread.length ? noticeApproveHtml(pendingUnread) : '')
  }
  render()
  if (noticeTimer) clearInterval(noticeTimer)
  bar.querySelectorAll('[data-notice-dismiss]').forEach((button) => {
    button.onclick = (event) => {
      // Clicking Dismiss must not also open the whole list behind it.
      event.stopPropagation()
      markNoticeRead(button.dataset.noticeDismiss)
      renderNoticeBar()
    }
  })
  bar.querySelectorAll('[data-notice-dismiss-all]').forEach((button) => {
    button.onclick = (event) => {
      event.stopPropagation()
      markAllNoticesRead()
      renderNoticeBar()
    }
  })
  // Each counter is its own entry point, so a waiting approval can never hide
  // the reminders behind it: the reminder pill opens the reminder sheet even
  // when the approvals pill (and the bar itself) opens the approvals sheet.
  bar.querySelectorAll('[data-notice-open]').forEach((button) => {
    button.onclick = (event) => {
      event.stopPropagation()
      if (button.dataset.noticeOpen === 'reminder') openNoticeModal()
      else openPendingSheet()
    }
  })
  if (!pendingUnread.length && items.length > 1) {
    noticeTimer = setInterval(() => { noticeIndex += 1; render() }, 4000)
  }
}
// The sheet behind the approvals counter (KPI card and banner) and behind
// every View all row. It is the detail view of the count, not a second listing
// on the page.
function openNotices() {
  if (((app.data && app.data.pending) || []).length || pendingConnections().length) openPendingSheet()
  else openNoticeModal()
}
function openPendingSheet() {
  const pending = (app.data && app.data.pending) || []
  const connections = pendingConnections()
  const secretBody = pending.map((entry) => '<div style="border:1px solid var(--line);border-radius:10px;padding:10px;margin-bottom:8px">'
    + pendingDetailHtml(entry)
    + '<div class="row" style="margin-top:8px"><button class="small primary" data-kpi-decide data-id="' + esc(entry.id) + '" data-decision="once">Just once</button><button class="small" data-kpi-decide data-id="' + esc(entry.id) + '" data-decision="24h">24 hours</button><button class="small" data-kpi-decide data-id="' + esc(entry.id) + '" data-decision="always">Permanent</button><button class="small danger" data-kpi-decide data-id="' + esc(entry.id) + '" data-decision="deny">Deny</button></div></div>').join('')
  const body = (connections.length || pending.length)
    ? connections.map(connectionApprovalHtml).join('') + secretBody
    : '<div class="hint">No pending requests</div>'
  openModal('Approval queue', body)
  wirePendingSheet()
}
// The form in the sheet is plain DOM: scope radios toggle the item list, the
// search filters it, and approve/deny are handled on the document so a
// re-render never leaves a stale handler behind.
function wirePendingSheet() {
  const cards = document.querySelectorAll('#modal-body [data-conn-card]')
  cards.forEach((card) => {
    if (!card.querySelector('[data-conn-duration]')) return
    const wrap = card.querySelector('[data-conn-items-wrap]')
    card.querySelectorAll('[data-conn-scope]').forEach((radio) => {
      radio.onchange = () => {
        const all = (card.querySelector('[data-conn-scope]:checked') || {}).value === 'all'
        if (wrap) wrap.classList.toggle('hidden', all)
      }
    })
    const search = card.querySelector('[data-conn-search]')
    if (search) search.oninput = () => {
      const query = search.value.trim().toLowerCase()
      card.querySelectorAll('[data-conn-item]').forEach((box) => {
        const label = box.closest('label')
        if (label) label.classList.toggle('hidden', Boolean(query) && !label.textContent.toLowerCase().includes(query))
      })
    }
  })
}
function openNoticeModal() {
  const read = noticeReadIds()
  // Ignored reminders disappear from this sheet too; the server keeps computing
  // them, so they can never be lost, only muted on this account's device.
  const all = (app.data && app.data.reminders) || []
  const reminders = all.filter((item) => !read.includes('reminder:' + item.kind + ':' + (item.agent || '')))
  if (!reminders.length) {
    openModal('Reminders', '<div class="hint">' + (all.length ? 'All reminders are marked as read. New ones will show up here.' : 'No reminders.') + '</div>')
    return
  }
  const reminderBlock = reminders.map((item) => {
    const tone = item.severity === 'critical' ? 'bad' : (item.severity === 'warning' ? 'warn' : 'plain')
    const isSecret = Boolean(item.kind && item.kind.indexOf('secret-') === 0)
    const noticeId = 'reminder:' + item.kind + ':' + (item.agent || '')
    return '<div class="ios-row ios-row--stack" data-notice-row="' + esc(noticeId) + '"><div class="ios-main"><div class="ios-title">'
      + '<span class="ios-name">' + esc((isSecret ? 'Secret ' : '') + (item.agent || '')) + '</span>'
      + '<span class="ios-pill ' + tone + '">' + esc(item.message || '') + '</span>'
      + '<button type="button" class="ios-chip notice-dismiss" data-notice-dismiss-row="' + esc(noticeId) + '" aria-label="Dismiss this notice" title="Dismiss this notice (hides it only; approval state is unchanged)">Dismiss</button></div>'
      + '<div class="ios-sub">' + esc(item.kind === 'idle' ? 'No reads in a long time' : 'Denied after expiry; needs a new grant') + '</div>'
      + '<div class="ios-actions">'
      + (item.expiresAt && !isSecret ? '<button class="ios-chip" data-notice-extend="' + esc(item.agent || '') + '">Extend</button>' : '')
      + (item.name ? '<button class="ios-chip" data-notice-open="' + esc(item.name) + '">View credential</button>' : '')
      + '</div></div></div>'
  }).join('')
  openModal('Reminders', reminderBlock)
  document.querySelectorAll('[data-notice-dismiss-row]').forEach((button) => {
    button.onclick = () => {
      markNoticeRead(button.dataset.noticeDismissRow)
      const row = button.closest('[data-notice-row]')
      if (row) row.remove()
      renderNoticeBar()
      if (!document.querySelector('#modal-body [data-notice-row]')) openNoticeModal()
    }
  })
  document.querySelectorAll('[data-notice-extend]').forEach((button) => {
    button.onclick = () => { show('modal', false); openExtendMenu(button.dataset.noticeExtend) }
  })
  document.querySelectorAll('[data-notice-open]').forEach((button) => {
    button.onclick = () => { show('modal', false); openItemMenu(button.dataset.noticeOpen) }
  })
}
// Last read opportunity per agent, derived from the audit trail the server
// already returns. This is "last recorded read", never a live-presence claim.
function lastActivityFor(agentName) {
  const audit = (app.data && app.data.audit) || []
  let latest = 0
  for (const entry of audit) {
    if (entry.agent !== agentName) continue
    const time = Date.parse(entry.time)
    if (Number.isFinite(time) && time > latest) latest = time
  }
  return latest
}
function relativeTime(ms) {
  if (!ms) return 'No reads'
  const diff = Date.now() - ms
  if (diff < 60000) return 'just now'
  if (diff < 3600e3) return Math.floor(diff / 60000) + ' minutes ago'
  if (diff < 86400e3) return Math.floor(diff / 3600e3) + ' hours ago'
  return Math.floor(diff / 86400e3) + ' days ago'
}
// Health is a UI hint only: authorization still decides access.
function agentHealth(agent, lastActivity) {
  if (typeof agent.expiresAt === 'number' && agent.expiresAt <= Date.now()) {
    return { level: 'danger', label: 'Expired', detail: 'Grant expired; extend it to restore access' }
  }
  if (typeof agent.expiresAt === 'number' && agent.expiresAt - Date.now() < 3 * 86400e3) {
    return { level: 'warn', label: 'Expiring soon', detail: expiryLabel(agent.expiresAt) + ' left' }
  }
  if (!lastActivity || Date.now() - lastActivity > 7 * 86400e3) {
    return { level: 'warn', label: 'Needs attention', detail: lastActivity ? relativeTime(lastActivity) + ' (last read)' : 'Never read' }
  }
  return { level: 'ok', label: 'OK', detail: lastActivity ? 'Last active ' + relativeTime(lastActivity) + '' : 'Not used yet' }
}
function renderAgentStats(agents) {
  const box = $('agent-stats')
  if (!box) return
  let active = 0
  let attention = 0
  for (const agent of agents) {
    const last = lastActivityFor(agent.name)
    const health = agentHealth(agent, last)
    if (last && Date.now() - last < 7 * 86400e3) active += 1
    if (health.level !== 'ok') attention += 1
  }
  const cards = [
    { label: 'Agent count', value: agents.length },
    { label: 'Recently active', value: active, hint: 'Read within 7 days' },
    { label: 'Need attention', value: attention, hint: 'Expired, expiring or idle for long' },
  ]
  box.innerHTML = cards.map((card) => '<div class="agent-stat"><b>' + card.value + '</b><span>' + esc(card.label) + '</span>' + (card.hint ? '<i>' + esc(card.hint) + '</i>' : '') + '</div>').join('')
}
// OAuth agents are keyed internally as "oauth:<clientId>". Operators should
// see the readable client name, with the raw id kept in the note.
function agentDisplayName(agent) {
  if (!agent) return ''
  if (agent.alias) return agent.alias
  if (agent.oauth && String(agent.name || '').startsWith('oauth:')) return agent.note || 'OAuth client'
  return agent.name
}
function agentDisplayNote(agent) {
  if (!agent) return ''
  if (agent.alias && agent.oauth && String(agent.name || '').startsWith('oauth:')) return agent.note || ''
  return agent.note || ''
}
const IOS_PERSON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.6"></circle><path d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6"></path></svg>'
// The all-clear mark on the work queue. Drawn, not typed, so it scales with the
// surrounding text and keeps the same stroke weight as the other icons.
const IOS_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M8 12.4l2.6 2.6L16 9.6"></path></svg>'
function renderAgents() {
  const all = (app.data && app.data.agents) || []
  renderAgentStats(all)
  const query = String(($('agent-search') && $('agent-search').value) || '').trim().toLowerCase()
  const typeFilter = String(($('agent-type-filter') && $('agent-type-filter').value) || '')
  const sortBy = String(($('agent-sort') && $('agent-sort').value) || 'default')
  let agents = all.filter((agent) => {
    if (typeFilter === 'oauth' && !agent.oauth) return false
    if (typeFilter === 'token' && agent.oauth) return false
    if (!query) return true
    return String(agent.name || '').toLowerCase().includes(query) || String(agent.alias || '').toLowerCase().includes(query) || String(agent.note || '').toLowerCase().includes(query)
  })
  if (sortBy === 'expiry') {
    agents = agents.slice().sort((a, b) => {
      const ae = typeof a.expiresAt === 'number' ? a.expiresAt : Infinity
      const be = typeof b.expiresAt === 'number' ? b.expiresAt : Infinity
      return ae - be
    })
  } else if (sortBy === 'activity') {
    agents = agents.slice().sort((a, b) => lastActivityFor(b.name) - lastActivityFor(a.name))
  } else if (sortBy === 'name') {
    agents = agents.slice().sort((a, b) => String(a.name).localeCompare(String(b.name)))
  } else if (sortBy === 'rights') {
    // The other side of the same ledger: how many credentials this Agent can
    // read right now. allowAll means "everything in scope", so it counts the
    // items it could read rather than the grants it happens to have.
    const byItem = readRightsByItem()
    const readableBy = new Map()
    for (const [name, subjects] of byItem) for (const subject of subjects) readableBy.set(subject, (readableBy.get(subject) || 0) + 1)
    const apiItems = (app.items || []).filter((item) => (app.data && app.data.fillPolicies && app.data.fillPolicies.items || []).some((entry) => entry.itemName === item.name && entry.kind === 'api')).length
    const count = (agent) => (agent.allowAll === true ? Math.max(apiItems, readableBy.get(agent.name) || 0) : (readableBy.get(agent.name) || 0))
    agents = agents.slice().sort((a, b) => count(b) - count(a) || String(a.name).localeCompare(String(b.name)))
  }
  const box = $('agents-box')
  if (!box) return
  if (!agents.length) {
    box.innerHTML = '<div class="hint">' + (all.length ? 'No Agent matches' : 'No Agent has been created yet. Click “New Agent” at the top right') + '</div>'
    return
  }
  const rows = agents.map((agent) => {
    const last = lastActivityFor(agent.name)
    const health = agentHealth(agent, last)
    const kind = agent.oauth ? 'OAuth' : 'Token'
    const dotClass = health.level === 'ok' ? 'ok' : (health.level === 'warn' ? 'warn' : 'bad')
    const days = typeof agent.expiresAt === 'number' ? Math.max(0, Math.ceil((agent.expiresAt - Date.now()) / 86400e3)) + ' days left' : 'Long-term'
    return '<div class="ios-row" data-agent-open="' + esc(agent.name) + '">' +
      '<span class="ios-ico" data-kind="' + (agent.oauth ? 'oauth' : 'api') + '">' + IOS_PERSON + '</span>' +
      '<div class="ios-main"><div class="ios-title"><span class="ios-name">' + esc(agentDisplayName(agent)) + '</span>' +
      '<span class="ios-tag">' + kind + '</span></div>' +
      '<div class="ios-sub">' + (agentDisplayNote(agent) ? esc(agentDisplayNote(agent)) + ' · ' : '') + esc(health.detail) + '</div>' +
      '<div class="ios-sub">' + days + '</div></div>' +
      '<div class="ios-trail"><button class="ios-pill plain" data-agent-extend="' + esc(agent.name) + '" title="Extend grant">Extend</button>' +
      '<span class="ios-pill ' + dotClass + '">' + esc(health.label) + '</span></div></div>'
  }).join('')
  box.innerHTML = '<div class="ios-group"><div class="ios-group-head"><span>' + agents.length + ' Agents</span></div>' +
    '<div class="ios-card">' + rows + '</div></div>'
}
// Federated requests carry the downstream identity separately: agent is the
// namespaced broker subject, not a human-readable name.
function pendingAgentLabel(request) {
  if (!request?.gatewayId) return request?.agent || 'Agent'
  const downstream = request.downstreamClientName || request.downstreamClientId || 'client'
  return downstream + ' (' + (request.downstreamClientId || '?') + ') via ' + request.gatewayId
}

function renderPending() {
  const pending = app.data.pending || []
  startConnectionTicker()
  const body = pendingConnectionRowsHtml() + pending.map((request) => {
    const origin = pendingOriginLabel(request)
    const isFill = String(request.action || '') === 'secret.fill'
    const originLine = !origin ? '' : /^Invalid target/.test(origin) ? origin : 'Target ' + origin
    const isWrite = String(request.action || '') === 'secret.write'
    // A write approval carries the chosen duration: Just once is the per-call
    // confirmation; a timed choice authorises this item until it expires.
    const chips = [['once', 'Just once'], ['1h', '1 hour'], ['24h', '24 hours'], ['7d', '7 days'], ['always', 'Permanent']]
      .map((mode) => '<button class="ios-chip" data-decide="' + mode[0] + '" data-id="' + esc(request.id) + '">' + mode[1] + '</button>').join('')
      + '<button class="ios-chip danger" data-decide="deny" data-id="' + esc(request.id) + '">Deny</button>'
    return '<div class="ios-row ios-row--stack">' +
      '<span class="ios-ico" data-kind="' + (isFill ? 'web' : 'api') + '">' + IOS_PERSON + '</span>' +
      '<div class="ios-main"><div class="ios-title"><span class="ios-name">' + esc(pendingAgentLabel(request)) +
      '</span><span class="ios-tag">' + esc(pendingActionLabel(request)) + '</span></div>' +
      '<div class="ios-sub">Item ' + esc(request.name) + '</div>' +
      (originLine ? '<div class="ios-sub">' + esc(originLine) + '</div>' : '') +
      (isWrite ? '<div class="ios-sub">Write grant: Just once still asks every time; pick a duration to stop asking within that window</div>' : '') +
      '<div class="ios-sub">' + esc(new Date(request.createdAt).toLocaleTimeString('en-GB', { hour12: false })) + '</div>' +
      '<div class="ios-actions">' + chips + '</div></div></div>'
  }).join('')
  const total = pending.length + pendingConnections().length
  $('pending-box').innerHTML = total
    ? '<div class="ios-group"><div class="ios-group-head"><span>Awaiting your decision · ' + total + '</span></div><div class="ios-card">' + body + '</div></div>'
    : '<div class="hint">No pending requests</div>'
}

// -- Web fill policies --------------------------------------------------------
// A pending fill request shows the exact origin it targets, so the approver
// can tell the site apart instead of guessing from the item name.
// The pending detail is used by the notice bar and the KPI modal so an
// approver always sees the action and the exact target origin.
function pendingDetailHtml(entry) {
  const origin = pendingOriginLabel(entry)
  const isFill = String(entry.action || '') === 'secret.fill'
  const target = isFill
    ? (origin ? '<div><span class="hint">Target origin</span><br><code>' + esc(origin) + '</code></div>'
      : '<div><b style="color:var(--danger)">Invalid target (missing origin), can’t approve</b></div>')
    : ''
  // Names arrive already masked from the Worker while the vault is locked. The
  // decision itself is keyed by id, so approval never needs the key.
  return '<div><b>' + esc(pendingAgentLabel(entry)) + '</b> requests: ' + esc(pendingActionLabel(entry))
    + ' <code>' + esc(entry.name) + '</code>'
    + (entry.nameMasked ? ' <button class="small" data-inline-unlock type="button">Unlock to see full details</button>' : '')
    + '</div>' + target
    + '<div class="hint">' + esc(entry.createdAt ? new Date(entry.createdAt).toLocaleString('en-GB', { hour12: false }) : '') + '</div>'
}

// -- Connection admission -----------------------------------------------------
// A first connection is an approval like any other: it shares the pending
// queue, the banner count and the KPI card, so there is no second listing and
// no new nav. The contract is /api/connections/decide; requestedScope is what
// the agent asked for, scope is what was actually granted.
function pendingConnections() {
  const data = app.data || {}
  return (data.connections && data.connections.pending) || []
}
// Approval needs the vault key; denial never does. Either an unlocked v2 slot
// or a live legacy session satisfies it, matching consoleVault on the Worker.
function vaultUnlocked() {
  // consoleVault on the Worker accepts a live v1 session *or* the cached v2
  // slot. Reading only the v2 flag made the console refuse approvals the
  // server would have taken, which is one half of the "locked" dead end.
  if (app.v2 && app.v2.initialized === true && app.v2.unlocked === true) return true
  return app.me ? app.me.unlocked === true : false
}
function connExpiresAt(entry) {
  const ms = new Date((entry && entry.expiresAt) || 0).getTime()
  return Number.isFinite(ms) ? ms : 0
}
function connRemainingLabel(entry) {
  const left = connExpiresAt(entry) - Date.now()
  if (!left || left <= 0) return 'Expired'
  const seconds = Math.floor(left / 1000)
  return '' + Math.floor(seconds / 60) + ' min ' + String(seconds % 60).padStart(2, '0') + ' s left'
}
function connSourceLabel(entry) {
  const hash = entry && entry.source && entry.source.ipHash ? String(entry.source.ipHash) : ''
  return hash ? 'Source ' + hash : 'Unknown source'
}
function connScopeText(entry) {
  const scope = (entry && entry.requestedScope) || {}
  if (scope.all === true) return 'Requested scope: all items'
  return 'Requested scope: specific items (' + ((scope.itemIds || []).length) + ')'
}
function connPlaintextText(entry) {
  return entry && entry.requestedPlaintext === true ? 'Asked for plaintext' : 'No plaintext requested'
}
function connWaitingText(entry) {
  if (!entry || !entry.createdAt) return ''
  return 'Requested ' + new Date(entry.createdAt).toLocaleString('en-GB', { hour12: false }) + ' · waited ' + waitedLabel(entry.createdAt)
}
function connItemChoicesHtml(entry) {
  const locked = !vaultUnlocked()
  const items = app.items || []
  const requested = new Set(((entry && entry.requestedScope && entry.requestedScope.itemIds) || []).map(String))
  const list = items.length
    ? items.map((item) => '<label><input type="checkbox" data-conn-item value="' + esc(item.id) + '"' + (requested.has(String(item.id)) ? ' checked' : '') + '><span>' + esc(item.name || item.id) + '</span></label>').join('')
    : '<div class="hint">No items to choose from yet</div>'
  return '<div class="conn-items" data-conn-items role="group" aria-label="Choose the items this approval covers">' + list + '</div>'
    + (locked ? '<div class="conn-meta">Names are redacted; unlock to see them.</div>' : '')
}
// The approval form collects the three things the contract needs in one submit:
// scope, plaintext and lifetime. Scope defaults to what the agent asked for.
function connectionApprovalHtml(entry) {
  const id = esc(entry.id || '')
  const all = (entry.requestedScope || {}).all === true
  const locked = !vaultUnlocked()
  return '<div class="conn-card" data-conn-card="' + id + '" data-conn-expires="' + connExpiresAt(entry) + '">'
    + '<div class="conn-head"><span class="conn-name">' + esc(entry.agent || 'Agent') + '</span><span class="ios-tag">First connection</span>'
    + '<span class="ios-pill ' + (entry.requestedPlaintext ? 'warn' : 'plain') + '">' + (entry.requestedPlaintext ? 'Wants plaintext' : 'No plaintext') + '</span></div>'
    + '<div class="conn-meta">' + esc(connSourceLabel(entry)) + (entry.origin ? ' · ' + esc(entry.origin) : '') + '</div>'
    + '<div class="conn-meta">' + esc(connScopeText(entry)) + ' · ' + connPlaintextText(entry) + '</div>'
    + '<div class="conn-meta">' + esc(connWaitingText(entry)) + ' · <span data-conn-expire>' + esc(connRemainingLabel(entry)) + '</span></div>'
    + '<div class="conn-form">'
    + '<div class="conn-scope" role="radiogroup" aria-label="Approval scope"><label><input type="radio" data-conn-scope value="all"' + (all ? ' checked' : '') + '> All items</label>'
    + '<label><input type="radio" data-conn-scope value="items"' + (all ? '' : ' checked') + '> Specific items</label></div>'
    + '<div data-conn-items-wrap class="' + (all ? 'hidden' : '') + '"><input type="search" data-conn-search placeholder="Search items" aria-label="Search items">'
    + connItemChoicesHtml(entry) + '</div>'
    + '<label class="chk"><input type="checkbox" data-conn-plaintext> Allow it to read website login passwords in plaintext</label>'
    + '<div class="conn-meta">Off by default. When on, this grant lets the Agent read plaintext passwords.</div>'
    + '<label class="chk"><input type="checkbox" data-conn-write> Allow it to write/update items in this scope</label>'
    + '<div class="conn-meta">Off by default. When on, writes within the approved scope no longer ask each time.</div>'
    + '<label class="field" for="conn-ttl-' + id + '">Grant duration</label><select id="conn-ttl-' + id + '" data-conn-duration aria-label="Grant duration">'
    + '<option value="1h">1 hour</option><option value="24h">24 hours</option><option value="7d">7 days</option><option value="30d">30 days</option><option value="always">Permanent (until revoked)</option></select>'
    + '<div class="conn-hint" data-conn-status role="status" aria-live="polite">' + (locked ? 'Approving requires unlocking the Vault first; denying doesn’t. <button type="button" class="small" data-conn-unlock>Unlock and return to approval</button>' : '') + '</div>'
    + '<div class="conn-actions"><button type="button" class="primary" data-conn-approve="' + id + '" aria-label="Approve connection: ' + esc(entry.agent || '') + '">Approve</button>'
    + '<button type="button" class="danger" data-conn-deny="' + id + '" aria-label="Deny connection: ' + esc(entry.agent || '') + '">Deny</button></div>'
    + '</div></div>'
}
function pendingConnectionRowsHtml() {
  return pendingConnections().map((entry) => {
    const id = esc(entry.id || '')
    const all = (entry.requestedScope || {}).all === true
    return '<div class="ios-row ios-row--stack" data-conn-card="' + id + '" data-conn-expires="' + connExpiresAt(entry) + '">'
      + '<span class="ios-ico" data-kind="api">' + IOS_PERSON + '</span>'
      + '<div class="ios-main"><div class="ios-title"><span class="ios-name">' + esc(entry.agent || 'Agent') + '</span><span class="ios-tag">First connection</span></div>'
      + '<div class="ios-sub">' + esc(connSourceLabel(entry)) + ' · ' + connPlaintextText(entry) + ' · ' + esc(connScopeText(entry)) + '</div>'
      + '<div class="ios-sub">' + esc(connWaitingText(entry)) + ' · <span data-conn-expire>' + esc(connRemainingLabel(entry)) + '</span></div>'
      + '<div class="conn-hint" data-conn-status role="status" aria-live="polite"></div>'
      + '<div class="ios-actions">'
      + (all ? '<button class="ios-chip primary" data-conn-quick="' + id + '" aria-label="Approve for 1 hour: ' + esc(entry.agent || '') + '’s first connection, all items, no plaintext">Approve for 1 hour</button>' : '')
      + '<button class="ios-chip" data-conn-open="' + id + '" aria-label="' + (all ? 'Open the connection approval form' : 'Choose items for ' + esc(entry.agent || '') + ' and approve') + '">' + (all ? 'Review' : 'Choose items to approve') + '</button>'
      + '<button class="ios-chip danger" data-conn-deny="' + id + '" aria-label="Deny connection: ' + esc(entry.agent || '') + '">Deny</button>'
      + '</div></div></div>'
  }).join('')
}
function connectionDurationLabel(duration) {
  return ({ '1h': '1 hour', '24h': '24 hours', '7d': '7 days', '30d': '30 days', always: 'Permanent' })[duration] || duration
}
// Expiry is client-observed too: the row leaves the queue the moment its window
// closes even before the next poll answers, so an expired ticket never sits
// there looking actionable.
let connExpireTimer = null
function startConnectionTicker() {
  if (connExpireTimer) return
  connExpireTimer = setInterval(() => {
    let expired = false
    document.querySelectorAll('[data-conn-expires]').forEach((node) => {
      const at = Number(node.dataset.connExpires || 0)
      if (!at) return
      if (at - Date.now() <= 0) { node.remove(); expired = true; return }
      const label = node.querySelector('[data-conn-expire]')
      if (label) label.textContent = connRemainingLabel({ expiresAt: at })
    })
    if (expired) loadState()
  }, 1000)
}
function setConnectionStatus(card, text, isError) {
  const el = card && card.querySelector('[data-conn-status]')
  if (!el) return
  el.textContent = text || ''
  if (isError) el.dataset.state = 'error'
  else delete el.dataset.state
}
async function decideConnection(button, body, card, options = {}) {
  const buttons = card ? Array.from(card.querySelectorAll('button')) : (button ? [button] : [])
  buttons.forEach((entry) => { entry.disabled = true; entry.setAttribute('aria-busy', 'true') })
  try {
    await api('/api/connections/decide', { method: 'POST', body: JSON.stringify(body) })
    toast(body.decision === 'deny' ? 'Connection request denied' : 'Connection approved · ' + connectionDurationLabel(body.duration) + (body.plaintextAllowed ? ' (plaintext allowed)' : ' (no plaintext)') + (body.writeAllowed ? ' (write allowed)' : ''))
    await Promise.all([loadState(), loadStats(), loadItems()])
    // A resumed approval re-opened the sheet from the unlock callback, so it
    // has to be rebuilt here too or the stale row stays on screen.
    if (options.afterUnlock || (card && card.closest('#modal-body'))) openPendingSheet()
  } catch (error) {
    buttons.forEach((entry) => { entry.disabled = false; entry.removeAttribute('aria-busy') })
    const stale = [404, 409].includes(error.status) || /not-pending|not-found/i.test(String(error.reason || '') + ' ' + String(error.message || ''))
    if (stale) {
      if (card) setConnectionStatus(card, 'This request was already handled or has expired. The queue has been refreshed.', true)
      toast('This request was already handled or has expired. The queue has been refreshed.', true)
      await loadState()
    } else if (error.status === 423) {
      const message = 'Approving a connection requires unlocking the Vault first; denying doesn’t.'
      if (card) setConnectionStatus(card, message + ' Inline unlock is open, and the approval continues once unlocked.', true)
      toast(message, true)
      // A retry that still finds the vault locked must not reopen the sheet on
      // itself: the operator sees the status line and decides what to do next.
      if (options.afterUnlock) return
      inlineUnlockSheet(() => { openPendingSheet(); decideConnection(null, body, null, { afterUnlock: true }) })
    } else {
      if (card) setConnectionStatus(card, error.message, true)
      toast('Approval failed: ' + error.message, true)
    }
  }
}
// Deny needs no vault key and no scope; approve reads the three fields the
// contract asks for from the card itself.
async function submitConnectionForm(card, decision) {
  if (!card) return
  const id = card.dataset.connCard
  if (!id) return
  if (decision === 'deny') return decideConnection(null, { id, decision: 'deny' }, card)
  const duration = (card.querySelector('[data-conn-duration]') || {}).value || '1h'
  const plaintextAllowed = Boolean((card.querySelector('[data-conn-plaintext]') || {}).checked)
  const writeAllowed = Boolean((card.querySelector('[data-conn-write]') || {}).checked)
  const scope = card.querySelector('[data-conn-scope]:checked')
  const all = !scope || scope.value === 'all'
  const itemIds = all ? [] : Array.from(card.querySelectorAll('[data-conn-item]:checked')).map((box) => box.value)
  if (!all && !itemIds.length) {
    setConnectionStatus(card, 'Select at least one item first, or switch to “All items”.', true)
    return
  }
  const body = { id, decision: 'approve', all, plaintextAllowed, writeAllowed, duration }
  if (!all) body.itemIds = itemIds
  if (!vaultUnlocked()) {
    // The old copy just ended here and told the operator to unlock somewhere
    // else. Open the form in place and resubmit the same body once it works.
    setConnectionStatus(card, 'Approving requires unlocking the Vault first. Unlock here and the approval continues automatically.', true)
    inlineUnlockSheet(() => { openPendingSheet(); decideConnection(null, body, null, { afterUnlock: true }) })
    return
  }
  setConnectionStatus(card, '')
  return decideConnection(null, body, card)
}
async function decideConnectionQuick(button) {
  if (!button || button.disabled) return
  const id = button.dataset.connQuick
  const body = { id, decision: 'approve', all: true, plaintextAllowed: false, duration: '1h' }
  if (!vaultUnlocked()) {
    setConnectionStatus(button.closest('[data-conn-card]'), 'Approving requires unlocking the Vault first. The approval continues automatically once unlocked.', true)
    toast('Approving a connection requires unlocking the Vault first. Inline unlock is open.', true)
    inlineUnlockSheet(() => { openPendingSheet(); decideConnection(null, body, null, { afterUnlock: true }) })
    return
  }
  return decideConnection(button, body, null)
}

// The web fill policy card. Every call goes through the admin API, which
// checks the admin cookie and the unlocked vault on the server.
// Show the stored policy for the item so the admin edits the real state.
// Per-item fill editor, rendered inside the item detail dialog so the operator
// never retypes a credential name. Returns the markup; wire() attaches handlers.
function fillEditorHtml(item) {
  const entry = (fillPolicyState().items || []).find((e) => e.itemName === item.name || e.itemId === item.id) || null
  const kind = entry ? entry.kind : ''
  const origins = entry ? (entry.origins || []).join('\n') : ''
  const actions = entry ? (entry.actions || []) : ['login']
  const read = Boolean(entry && entry.plaintextRead)
  return '<div class="card"><h2>Web fill and plaintext reads</h2>'
    + '<div class="hint">api = API Key, plaintext reads by the Agent can be allowed as needed; web = website login, only filled into specified sites, and the Agent never gets the plaintext. Unclassified items keep the legacy grant behavior.</div>'
    + '<div class="ios-field"><label for="fe-kind">Type</label><select id="fe-kind">'
    + '<option value=""' + (kind === '' ? ' selected' : '') + '>Unclassified</option>'
    + '<option value="api"' + (kind === 'api' ? ' selected' : '') + '>API key</option>'
    + '<option value="web"' + (kind === 'web' ? ' selected' : '') + '>Web login</option></select></div>'
    + '<div id="fe-web" class="' + (kind === 'web' ? '' : 'hidden') + '">'
    + '<div class="ios-field ios-field--stack"><label for="fe-origins">Sites allowed for fill (one per line)</label>'
    + '<textarea id="fe-origins" rows="3" placeholder="https://example.com&#10;192.168.1.10:8080">' + esc(origins) + '</textarea>'
    + '<div class="hint">Exact match only: example.com.evil.test, any subdomain or a different port won’t get through. Without a scheme, https is assumed; private addresses (127.x, 10.x, 192.168.x, 172.16-31.x, localhost, *.lan) may use http, public addresses https only.</div></div></div>'
    + '<div class="ios-field" id="fe-read-row"><label for="fe-read">Let the Agent read plaintext directly<small>api only; expires after 30 days</small></label><input type="checkbox" class="ios-switch" id="fe-read"' + (read ? ' checked' : '') + '></div>'
    + '<div class="row" style="margin-top:var(--sp-3)"><button class="primary" id="fe-save">Save</button>' + (entry ? '<button class="danger" id="fe-clear">Clear classification</button>' : '') + '</div>'
    + '<div class="status" id="fe-status"></div></div>'
}

function wireFillEditor(item) {
  const kind = $('fe-kind')
  if (!kind) return
  const sync = () => {
    const isWeb = kind.value === 'web'
    const web = $('fe-web')
    if (web) web.classList.toggle('hidden', !isWeb)
    const readRow = $('fe-read-row')
    if (readRow) readRow.style.display = isWeb ? 'none' : ''
  }
  kind.onchange = sync
  sync()
  $('fe-save').onclick = async () => {
    const value = kind.value
    if (!value) return status('fe-status', 'Choose api or web', true)
    try {
      if (value === 'web') {
        const origins = $('fe-origins').value.split('\n').map((line) => line.trim()).filter(Boolean)
        if (!origins.length) return status('fe-status', 'A web credential needs at least one origin', true)
        await api('/api/fill/policy', { method: 'POST', body: JSON.stringify({ item: item.name, kind: 'web', origins, actions: ['login'] }) })
      } else {
        await api('/api/fill/policy', { method: 'POST', body: JSON.stringify({ item: item.name, kind: 'api' }) })
        await api('/api/fill/read-policy', { method: 'POST', body: JSON.stringify({ item: item.name, allow: $('fe-read').checked, ttlDays: 30 }) })
      }
      status('fe-status', 'Saved', false)
      await refreshAll()
    } catch (error) { status('fe-status', error.message || 'Save failed', true) }
  }
  const clear = $('fe-clear')
  if (clear) clear.onclick = async () => {
    if (!(await askYes('Clear the classification and related grants for “' + item.name + '”?'))) return
    try {
      await api('/api/fill/policy/delete', { method: 'POST', body: JSON.stringify({ item: item.name }) })
      status('fe-status', 'Cleared', false)
      await refreshAll()
    } catch (error) { status('fe-status', error.message || 'Clear failed', true) }
  }
}

// Classify several credentials at once from the bulk bar. The kind is the only
// thing that makes sense in bulk; origins are per credential by nature.
function openBulkKind() {
  if (!selectedItems.size) return
  openModal('Bulk classify (' + selectedItems.size + ' selected)', '<div class="hint">Mark the selected credentials as api (API Key, plaintext reads can be allowed as needed) or web (website login, fill only). Each web credential also needs its allowed origin entered individually.</div><label class="field">Type</label><select id="bk-kind"><option value="api">api (API Key)</option><option value="web">web (website login)</option></select><div class="row" style="margin-top:12px"><button class="primary" id="bk-save">Apply</button></div><div class="status" id="bk-status"></div>')
  $('bk-save').onclick = async () => {
    const kind = $('bk-kind').value
    const names = [...selectedItems]
    let ok = 0
    const failed = []
    for (const name of names) {
      try {
        await api('/api/fill/policy', { method: 'POST', body: JSON.stringify({ item: name, kind, ...(kind === 'web' ? { origins: [], actions: ['login'] } : {}) }) })
        ok += 1
      } catch (error) {
        // A web credential needs at least one origin, so bulk web is expected to
        // fail per item; report it instead of pretending it worked.
        failed.push(name + ': ' + (error.message || 'failed'))
      }
    }
    await refreshAll()
    show('modal', false)
    if (failed.length) toast('Classified ' + ok + ', ' + failed.length + ' need setting up individually (web needs an origin)', true)
    else toast('Classified ' + ok + '')
  }
}

function pendingOriginLabel(entry) {
  const action = String(entry.action || '')
  // read has no site. fill and use both name one, and the approval binds it.
  if (action !== 'secret.fill' && action !== 'secret.use') return ''
  const origin = String(entry.targetOrigin || '').trim()
  if (!origin) return 'Invalid target (missing origin)'
  return origin
}
function pendingActionLabel(entry) {
  const labels = { 'secret.read': 'Read plaintext', 'secret.use': 'Proxied request', 'secret.fill': 'Web fill', 'secret.write': 'Write secret' }
  return labels[String(entry.action || '')] || String(entry.action || 'Unknown')
}
function fillPolicyState() {
  return (app.data && app.data.fillPolicies) || { items: [], executionLayer: false }
}

// Three different refusals wear three different words. "not in scope" is not
// "no grant": the first means the Agent never got the chance to ask, so an
// Authorize button there promises something the click cannot deliver. "item not
// found" means the name the Agent sent does not exist, so no grant is possible
// at all. Only "no-grant" is actually answered by granting.
const DENY_KINDS = ['no-grant', 'not-in-scope', 'item-not-found']
function denyKind(entry) {
  const code = String(entry.reasonCode || '')
  if (DENY_KINDS.includes(code)) return code
  // Records written before reasonCode existed only carry prose. Some of that
  // prose is the code itself, so accept it verbatim.
  const reason = String(entry.reason || '')
  if (DENY_KINDS.includes(reason)) return reason
  if (reason.includes('No item named')) return 'item-not-found'
  if (reason.includes('requestable scope')) return 'not-in-scope'
  return 'no-grant'
}
const DENY_COPY = {
  'no-grant': {
    title: 'Missing grant for this item',
    body: 'It’s in scope; only the grant is missing. Once you approve, this Agent can read it within the scope you choose.',
  },
  'not-in-scope': {
    title: 'Not in scope yet',
    body: 'This item isn’t in the Agent’s requestable scope, so no approval request was even created. Add it to the requestable scope first, then come back to authorize it.',
  },
  'item-not-found': {
    title: 'Item name doesn’t match',
    body: 'The current account has no item with this name. The name the Agent sends must match the console exactly, including spaces and case.',
  },
}
// What the Agents were refused, with the reason and a one-click way to allow it.
// The refusals are recorded by the broker; this only displays them and offers
// the grant, so nothing is authorised without the operator clicking.
function renderDenied() {
  const box = $('denied-list')
  if (!box) return
  const rows = (app.data && app.data.deniedAttempts) || []
  if (!rows.length) { box.innerHTML = '<div class="hint">No blocked Agent requests.</div>'; return }
  const actionLabel = { 'secret.read': 'Read plaintext', 'secret.use': 'Proxied call (http_request)', 'secret.fill': 'Web fill' }
  const kinds = (app.data && app.data.fillPolicies && app.data.fillPolicies.items) || []
  const kindOf = (name) => (kinds.find((k) => k.itemName === name) || {}).kind || ''
  // The row used to print the agent's identifier, which is the name the token
  // belongs to, not the name the operator gave it. Look the agent up and show
  // that instead; the identifier stays on the buttons, which post it back.
  const agents = (app.data && app.data.agents) || []
  const who = (name) => {
    const agent = agents.find((entry) => entry.name === name || entry.id === name)
    return (agent && agentDisplayName(agent)) || name || ''
  }
  const rowsHtml = rows.map((entry) => {
    const at = entry.lastAt ? new Date(entry.lastAt).toLocaleString('en-GB', { hour12: false }) : '-'
    const kind = kindOf(entry.name)
    const kindTag = kind === 'api' ? '<span class="ios-tag">api</span>'
      : kind === 'web' ? '<span class="ios-tag">web</span>'
      : '<span class="ios-tag">Unclassified</span>'
    const copy = DENY_COPY[denyKind(entry)]
    // A plaintext refusal is not a missing grant: the agent already has scope, it
    // is the item that still refuses to hand over a value. One chip opens it.
    const plaintextBtn = entry.plaintext
      ? '<button class="ios-chip" data-allow-plaintext data-name="' + esc(entry.name || '') + '" data-days="1" title="Allow plaintext reads of this credential for 24 hours">Allow plaintext 24h</button>'
      : ''
    const useBtn = entry.action === 'secret.use'
      ? ''
      : '<button class="ios-chip" data-allow-use data-agent="' + esc(entry.agent || '') + '" data-name="' + esc(entry.name || '') + '" title="Proxied calls only, no plaintext">http_request</button>'
    // Only a real missing grant can be answered with Authorize. Offering it for the
    // other two kinds is a button that cannot keep its promise.
    const grantBtn = denyKind(entry) === 'no-grant'
      ? '<button class="ios-chip" data-allow-denied data-agent="' + esc(entry.agent || '') + '" data-name="' + esc(entry.name || '') + '" data-action="' + esc(entry.action || '') + '">Authorize</button>'
      : ''
    const scopeBtn = denyKind(entry) === 'not-in-scope'
      ? '<button class="ios-chip" data-scope-denied data-agent="' + esc(entry.agent || '') + '" data-name="' + esc(entry.name || '') + '" title="Only adds it to scope; doesn’t grant read access">Add to requestable scope</button>'
      : ''
    return '<div class="ios-row ios-row--stack">' +
      '<span class="ios-ico" data-kind="' + (kind === 'web' ? 'web' : kind === 'api' ? 'api' : 'none') + '">' + IOS_PERSON + '</span>' +
      '<div class="ios-main"><div class="ios-title"><span class="ios-name">' + esc(who(entry.agent)) + '</span>' + kindTag +
      '<span class="ios-pill bad">' + esc(actionLabel[entry.action] || entry.action || '') + '</span></div>' +
      '<div class="ios-sub">Item ' + esc(entry.name || '') + '</div>' +
      '<div class="deny" data-kind="' + denyKind(entry) + '"><div class="deny__title">' + copy.title + '</div>' +
      '<div class="deny-reason"><b>Why blocked</b>' + copy.body + '</div>' +
      '<div class="ios-sub">' + (entry.count ?? 1) + '× · ' + esc(at) + '</div></div>' +
      '<div class="ios-actions">' + grantBtn + scopeBtn +
      useBtn +
      plaintextBtn +
      '<button class="ios-chip danger" data-dismiss-denied data-agent="' + esc(entry.agent || '') + '" data-name="' + esc(entry.name || '') + '" data-action="' + esc(entry.action || '') + '">Dismiss</button></div></div></div>'
  }).join('')
  box.innerHTML = '<div class="hint" style="margin-bottom:var(--sp-3)">“Authorize” allows just this one; “http_request” gives this Agent proxied calls, still without plaintext.</div>' +
    '<div class="ios-group"><div class="ios-card">' + rowsHtml + '</div></div>'
}
// Grant what was refused. secret.use needs a target policy before http_request
// can reach anything, so that dialog asks for it; secret.read asks for a window.
function openAllowDenied(agent, name, action) {
  const target = action === 'secret.use'
  const body = target
    ? '<div class="hint">Let “' + esc(agent) + '” make http_request calls with “' + esc(name) + '”. The broker injects the secret server-side, so the Agent never gets the plaintext value.</div>'
      + '<label class="field">Allowed target hosts (one per line, e.g. httpbin.org)</label><textarea id="ad-hosts" rows="2" style="width:100%" placeholder="httpbin.org"></textarea>'
      + '<label class="field">Allowed methods</label><select id="ad-methods"><option value="GET,POST">GET + POST</option><option value="GET">GET only</option><option value="GET,POST,PUT,PATCH,DELETE">All</option></select>'
      + '<label class="field">Port</label><input id="ad-ports" value="443" placeholder="443">'
    : '<div class="hint">Let “' + esc(agent) + '” read the plaintext value of “' + esc(name) + '”.</div>'
      + '<label class="field">Plaintext access duration</label><select id="ad-hours"><option value="1">1 hour</option><option value="24" selected>24 hours</option><option value="168">7 days</option><option value="720">30 days</option><option value="0">Permanent</option></select>'
      + '<div class="hint">API calls without a duration are treated as “Permanent”. This dialog defaults to 24 hours; only “Permanent” grants indefinite access.</div>'
      + '<div class="hint" style="margin-top:4px;color:var(--danger)">Once allowed, this Agent can get the credential’s real value. Make sure it’s an Agent you trust.</div>'
  openModal('Authorize “' + agent + ' → ' + name + '”', body + '<div class="row" style="margin-top:12px"><button class="primary" id="ad-go">Authorize</button></div><div class="status" id="ad-status"></div>')
  $('ad-go').onclick = async () => {
    try {
      status('ad-status', 'Authorizing…')
      if (target) {
        const hosts = $('ad-hosts').value.split('\n').map((v) => v.trim()).filter(Boolean)
        if (!hosts.length) return status('ad-status', 'Enter at least one target host', 'error')
        const methods = $('ad-methods').value.split(',').map((v) => v.trim()).filter(Boolean)
        const ports = $('ad-ports').value.split(',').map((v) => v.trim()).filter(Boolean)
        await api('/api/use-policy', { method: 'POST', body: JSON.stringify({ item: name, hosts, methods, ports }) })
      }
      const duration = target ? '1d' : ({ '1': '1d', '24': '1d', '168': '7d', '720': '30d', '0': 'permanent' })[$('ad-hours')?.value || '24']
      await api('/api/action-grants', { method: 'POST', body: JSON.stringify({ agent, item: name, actions: [action], terms: { [action]: { duration } } }) })
      if (!target && $('ad-hours')?.value && $('ad-hours').value !== '0') {
        await api('/api/fill/read-policy', { method: 'POST', body: JSON.stringify({ item: name, allow: true, ttlDays: Math.max(1, Math.round(Number($('ad-hours').value) / 24)) }) })
      }
      await api('/api/denied/dismiss', { method: 'POST', body: JSON.stringify({ agent, name, action }) })
      show('modal', false); await refreshAll(); toast('Authorized: ' + agent + ' → ' + name)
    } catch (error) { status('ad-status', error.message, 'error') }
  }
}

// Opening http_request for one Agent+item: a default target policy (any https
// host, GET/POST) and the use capability. The Agent still never sees the value;
// this only lets the broker inject it server-side. Kept one click because the
// alternative — a host list per credential — was the reason this stayed broken.
function openAllowUse(agent, name) {
  openModal('Enable http_request for “' + agent + ' → ' + name + '”',
    '<div class="hint">Let “' + esc(agent) + '” make http_request calls with this credential. The broker injects the secret into the request headers server-side and returns only the upstream response; <b>the Agent never gets the plaintext value</b>.</div>' +
    '<label class="field">Allowed hosts</label>' +
    '<select id="au-scope"><option value="any">Any https host (simplest)</option><option value="pick">Only specific hosts</option></select>' +
    '<div id="au-hosts-box" class="hidden"><label class="field">Hosts (one per line)</label><textarea id="au-hosts" rows="2" style="width:100%" placeholder="httpbin.org"></textarea></div>' +
    '<label class="field">Allowed methods</label><select id="au-methods"><option value="GET,POST">GET + POST</option><option value="GET">GET only</option><option value="GET,POST,PUT,PATCH,DELETE">All</option></select>' +
    '<div class="hint" style="margin-top:4px;color:var(--warn,#f2994a)">“Any https host” means this Agent can send the credential to any https address. Only choose it if you fully trust this Agent.</div>' +
    '<div class="row" style="margin-top:12px"><button class="primary" id="au-go">Enable</button></div><div class="status" id="au-status"></div>')
  $('au-scope').onchange = () => $('au-hosts-box').classList.toggle('hidden', $('au-scope').value !== 'pick')
  $('au-go').onclick = async () => {
    try {
      status('au-status', 'Enabling…')
      const scope = $('au-scope').value
      const methods = $('au-methods').value.split(',').map((v) => v.trim()).filter(Boolean)
      let hosts
      if (scope === 'any') {
        // The target policy is a host allowlist, so "any" cannot be expressed as
        // a pattern. http_request still checks the host list, so an unrestricted
        // host set is written as the vault's own hosts plus nothing — instead we
        // take the explicit route and record '*' meaning "no host restriction".
        hosts = ['*']
      } else {
        hosts = $('au-hosts').value.split('\n').map((v) => v.trim()).filter(Boolean)
        if (!hosts.length) return status('au-status', 'Enter at least one host', 'error')
      }
      await api('/api/use-policy', { method: 'POST', body: JSON.stringify({ item: name, hosts, methods, ports: ['443'], anyHost: scope === 'any' }) })
      await api('/api/action-grants', { method: 'POST', body: JSON.stringify({ agent, item: name, actions: ['secret.use'], terms: { 'secret.use': { duration: 'permanent' } } }) })
      await api('/api/denied/dismiss', { method: 'POST', body: JSON.stringify({ agent, name, action: 'secret.use' }) })
      show('modal', false); await refreshAll(); toast('http_request enabled: ' + agent + ' → ' + name)
    } catch (error) { status('au-status', error.message, 'error') }
  }
}

function renderFillPolicies() {
  const list = $('fp-list')
  if (!list) return
  renderDenied()
  const state = fillPolicyState()
  const note = $('fp-exec-note')
  if (note) {
    note.textContent = state.executionLayer
      ? 'Execution layer configured (credentials can be filled into web pages).'
      : 'No real browser execution layer configured: fill requests can’t complete an actual web login, and the Agent never gets the plaintext credential either.'
    note.style.color = state.executionLayer ? '' : 'var(--danger)'
  }
  if (!state.items.length) { list.innerHTML = '<div class="hint">No credentials classified yet. Tap ⋮ on an item in the list to classify it.</div>'; return }
  const rows = state.items.map((entry) => {
    const read = entry.plaintextRead
      ? (entry.plaintextReadExpiresAt && entry.plaintextReadExpiresAt < Date.now() ? 'Expired' : 'Allowed')
      : 'Denied'
    const origins = entry.origins.length ? entry.origins.map((o) => '<code>' + esc(o) + '</code>').join('<br>') : '-'
    return '<tr><td><b>' + esc(entry.itemName || entry.itemId) + '</b></td><td>' + esc(entry.kind) + '</td><td>' + origins + '</td><td>' + esc((entry.actions || []).join(', ') || '-') + '</td><td>' + read + '</td><td class="nowrap"><button class="small" data-fp-edit="' + esc(entry.itemName || '') + '">Edit</button></td></tr>'
  }).join('')
  list.innerHTML = '<table><tr><th>Credential</th><th>Type</th><th>Allowed origins</th><th>Actions</th><th>Plaintext read</th><th>Manage</th></tr>' + rows + '</table>'
}

// Selection state for the bulk bar. Kept outside the render so a refresh in the
// background does not drop what the operator ticked.
let grantsSelecting = false
const selectedGrants = new Set()
function grantSelectionKey(agent, name) { return JSON.stringify([agent, name]) }
function selectedGrantList() { return [...selectedGrants].map((key) => { const [agent, name] = JSON.parse(key); return { agent, name } }) }
function syncGrantsBulk() {
  const bar = $('grants-bulk')
  if (bar) bar.classList.toggle('hidden', !grantsSelecting && !selectedGrants.size)
  const count = $('grants-bulk-count')
  if (count) count.textContent = '' + selectedGrants.size + ' selected'
  if ($('grants-select')) $('grants-select').textContent = grantsSelecting ? 'Done' : 'Select'
}
function renderGrants() {
  const grants = app.data.grants || []  // Legacy grants with no recorded identity binding are repaired here, in the
  // same table: there is no separate screen for them. They cannot be migrated
  // automatically because the name may now denote a different credential, so
  // they are marked and the operator re-grants or deletes them in place.
  const unbound = ((app.data && app.data.legacyUnbound) || []).filter((entry) => !grants.some((g) => g.agent === entry.agent && g.name === entry.name))
  // A short label for the remaining time, so the row reads at a glance.
  const remaining = (grant) => {
    if (grant.revokedAt) return 'Revoked'
    if (!grant.expiresAt) return 'Permanent'
    const ms = grant.expiresAt - Date.now()
    if (ms <= 0) return 'Expired'
    const days = Math.ceil(ms / 86400e3)
    return days <= 1 ? Math.max(1, Math.ceil(ms / 3600e3)) + 'h' : days + 'd'
  }
  const rows = grants.map((grant) => {
    const state = grant.revokedAt ? 'Revoked' : (grant.expiresAt && grant.expiresAt <= Date.now() ? 'Expired' : (grant.maxReads && (grant.reads ?? 0) >= grant.maxReads ? 'Read limit reached' : 'Active'))
    const bad = state !== 'Active'
    const reads = (grant.reads ?? 0) + (grant.maxReads ? ' / ' + grant.maxReads : '')
    const key = grantSelectionKey(grant.agent, grant.name)
    return '<div class="ios-row">' +
      (grantsSelecting ? '<input type="checkbox" class="ios-check grant-select" data-key="' + esc(key) + '"' + (selectedGrants.has(key) ? ' checked' : '') + '>' : '') +
      '<span class="ios-ico" data-kind="api">' + IOS_PERSON + '</span>' +
      '<div class="ios-main" data-grant-menu data-agent="' + esc(grant.agent) + '" data-name="' + esc(grant.name) + '" role="button" tabindex="0"><div class="ios-title"><span class="ios-name">' + esc(grant.name) + '</span>' +
      '<span class="ios-tag">' + esc(grant.mode) + '</span></div>' +
      '<div class="ios-sub">' + esc(agentLabel(grant.agent)) + ' · reads: ' + reads + '</div></div>' +
      '<div class="ios-trail"><button class="ios-pill ' + (bad ? 'bad' : 'ok') + '" data-item-grant data-agent="' + esc(grant.agent) +
      '" data-name="' + esc(grant.name) + '" title="Click to change the duration and read limit">' + esc(remaining(grant)) + '</button>' +
      '<button class="ios-more" data-grant-menu data-agent="' + esc(grant.agent) + '" data-name="' + esc(grant.name) + '" title="More">⋮</button></div></div>'
  }).join('')
  // An unbound legacy grant has no capability and no duration to show; its only
  // useful actions are re-grant (which binds it) and delete.
  const legacyRows = unbound.map((entry) =>
    '<div class="ios-row ios-row--stack">' +
    '<span class="ios-ico" data-kind="none">' + IOS_PERSON + '</span>' +
    '<div class="ios-main"><div class="ios-title"><span class="ios-name">' + esc(entry.name || '') + '</span>' +
    '<span class="ios-pill bad">Needs reauthorization</span></div>' +
    '<div class="ios-sub">' + esc(entry.agent || '') + ' · ' + esc(entry.mode || '') + ' · no identity binding</div>' +
    '<div class="ios-actions">' +
    '<button class="ios-chip" data-legacy-regrant data-agent="' + esc(entry.agent || '') + '" data-name="' + esc(entry.name || '') + '">Reauthorize</button>' +
    '<button class="ios-chip danger" data-legacy-delete data-agent="' + esc(entry.agent || '') + '" data-name="' + esc(entry.name || '') + '">Delete</button>' +
    '</div></div></div>'
  ).join('')
  const total = grants.length + unbound.length
  $('grants-box').innerHTML = total
    ?       '<div class="ios-group"><div class="ios-card">' + rows + legacyRows + '</div></div>'
    : '<div class="hint">No grants yet</div>'
  syncGrantsBulk()
}

function renderTransfers() {
  const transfers = app.data.transfers || []
  $('transfers-box').innerHTML = transfers.length ? '<div class="ios-group"><div class="ios-card">' + transfers.map((entry) =>
    '<div class="ios-row ios-row--stack">' +
    '<span class="ios-ico" data-kind="web">' + IOS_PERSON + '</span>' +
    '<div class="ios-main"><div class="ios-title"><span class="ios-name">' + esc(entry.name) + '</span>' +
    '<span class="ios-pill ' + (entry.error ? 'bad' : 'warn') + '">' + esc(entry.error ? 'Copy failed' : 'Waiting for unlock') + '</span></div>' +
    '<div class="ios-sub">' + esc(entry.agent || '') + ' · target folder ' + esc(entry.folder || 'default') + '</div>' +
    '<div class="ios-sub">' + esc(entry.sourceAccount || 'Main account') + ' → ' + esc(entry.targetAccount || 'Target account') + '</div>' +
    '</div></div>').join('') + '</div></div>' : '<div class="hint">No items waiting to be copied</div>'
}
function who(label) { const agent = (app.data.agents || []).find((entry) => entry.name === label); return agent?.alias || label || 'System' }
// The reason codes are what the server writes; the operator needs the sentence.
const REASON_TEXT = {
  'no-grant': 'no grant yet',
  'not-granted': 'no grant yet',
  'plaintext': 'no permission to read plaintext',
  'plaintext-off': 'no permission to read plaintext',
  'web-credential-is-fill-only': 'web logins are fill-only, no plaintext',
  'unclassified-plaintext-off': 'unclassified items give no plaintext by default',
  'account-mismatch': 'item isn’t in the current account',
  'maxreads-exhausted': 'read limit reached',
  'expired': 'grant expired',
  'origin-not-allowed': 'target site isn’t on the allowlist',
  'item-id-unresolved': 'item not found',
  'vault-locked': 'the vault is locked',
  'no-origin': 'request has no target site',
}
function reasonText(reason) {
  const key = String(reason || '')
  return REASON_TEXT[key] || (key ? key : 'no reason given')
}
function describe(entry) {
  const name = entry.name ? '“' + entry.name + '”' : ''; const agent = who(entry.agent); const mode = ({ once: 'once', '1h': '1 hour', '24h': '24 hours', '7d': '7 days', always: 'permanent', grant: 'grant', 'no-approval': 'no approval needed' })[entry.mode] || entry.mode || ''
  switch (entry.event) {
    case 'secret.read': return agent + ' read ' + name + (mode ? ' (' + mode + ')' : '')
    case 'secret.read-noapproval': return agent + ' read without approval: ' + name
    case 'request.create': return agent + ' requested to read ' + name
    case 'request.approve': return agent + '’s request for ' + name + ' approved' + (mode ? ' (' + mode + ')' : '') + ', via ' + (entry.source === 'telegram' ? 'Telegram' : entry.source === 'ntfy' ? 'ntfy' : 'web')
    case 'request.deny': return agent + '’s request for ' + name + ' denied'
    case 'policy.update': return 'No-approval policy: ' + name + ' → ' + (entry.noApproval ? 'on' : 'off')
    case 'agent.create': return 'Added Agent ' + agent
    case 'agent.rotate': return 'Rotated the token of Agent ' + agent + ''
    case 'agent.token-view': return 'Viewed the token of Agent ' + agent + ''
    case 'item.update': return 'Updated secret ' + name + (entry.oldName ? ' (formerly ' + entry.oldName + ')' : '')
    case 'item.delete': return 'Deleted secret ' + name
    case 'grant.share': return 'Shared ' + name + ' with ' + (entry.agents ? entry.agents.join(', ') : agent)
    case 'grant.update': return 'Changed ' + agent + '’s grant for ' + name + ''
    case 'grant.restore': return 'Restored/reauthorized ' + agent + ' to read ' + name
    case 'grant.delete': return 'Deleted ' + agent + '’s grant record for ' + name + ''
    case 'profile.update': return 'Updated profile'
    case 'admin.oidc-login': return 'OIDC login' + (entry.email ? ' (' + entry.email + ')' : '')
    case 'vault.oidc-unlock': return 'OIDC auto-unlocked the vault' + (entry.email ? ' (' + entry.email + ')' : '')
    case 'settings.update': return 'Updated settings'
    case 'agent.delete': return 'Deleted Agent ' + agent
    case 'vault.unlock': return 'Unlocked the vault' + (entry.ttl ? ' (' + entry.ttl + ')' : '')
    case 'vault.lock': return 'Locked the vault'
    case 'admin.login': return 'Admin login'
    case 'admin.login-fail': return 'Admin login failed'
    case 'admin.origin-mismatch': return 'Cross-site request denied (origin doesn’t match this site)'
    case 'access.denied': return agent + ' was blocked from reading ' + name + ': ' + reasonText(entry.reason)
    case 'secret.read-deny': return agent + '’s read of ' + name + ' was denied: ' + reasonText(entry.reason)
    case 'secret.view': return 'Admin viewed the plaintext of ' + name + ' (2FA passed)'
    case 'secret.view-deny': return 'Viewing the plaintext of ' + name + ' was denied: ' + reasonText(entry.reason)
    case 'items.export': return 'Exported all plaintext (2FA passed)'
    case 'materialize.request': return agent + ' requested to write ' + name + ' to ' + (entry.target && entry.target.path ? entry.target.path : 'an allowlisted file')
    case 'materialize.approve': return 'Approved ' + agent + ' writing ' + name + ' to ' + (entry.target && entry.target.path ? entry.target.path : 'an allowlisted file')
    case 'materialize.deny': return 'Denied ' + agent + ' writing ' + name
    case 'secret.materialize': return agent + ' wrote ' + name + ' to ' + (entry.path || 'an allowlisted file')
    case 'grant.prune-foreign': return 'Cleaned up old grants pointing to other accounts (' + (entry.count || 0) + ')'
    case 'grant.batch': return (entry.action === 'delete' ? 'Bulk-deleted grants (' : 'Bulk-restored grants (') + (entry.count || 0) + ')'
    case 'secret.write': return agent + ' wrote ' + name
    case 'grant.revoke': return 'Revoked ' + agent + '’s grant for ' + name + ''
    case 'grant.expire': return agent + '’s grant for ' + name + ' expired and was removed from the list (kept in the audit log)'
    case 'grant.extend': return 'Extended ' + agent + '’s grant for ' + name + ''
    case 'action-grant.revoke': return 'Bulk-revoked grants (' + (entry.items || 1) + ')'
    case 'request.auto-approve': return agent + '’s request for ' + name + ' was auto-approved by a rule'
    case 'oauth.client-register': return 'A new app registered an OAuth client'
    case 'oauth.client-trust': return 'Confirmed an OAuth app’s first connection'
    case 'oauth.authorize': return 'Authorized an OAuth app to access ' + name + (entry.grantAll ? ' (all items)' : '')
    case 'oauth.consent-deny': return 'OAuth consent page submission rejected: ' + reasonText(entry.reason)
    case 'oauth.token-issue': return 'Issued an OAuth token'
    case 'oauth.token-deny': return 'OAuth token request denied: ' + reasonText(entry.reason)
    case 'fill.task.claim': return 'Fill runner claimed the fill task for ' + name + ''
    case 'fill.redeem': return 'Fill task picked up the credential for ' + name + ''
    case 'fill.redeem-deny': return 'Fill task’s credential pickup was denied: ' + reasonText(entry.reason)
    default: return entry.event + (entry.agent ? ' · ' + agent : '') + (name ? ' ' + name : '')
  }
}
// Anything that cleared a guard rather than passing it is red: a no-approval
// read skipped every check, and a denial shows what was refused. Everything
// else stays neutral so the red still means something.
const RED_LOG_EVENTS = new Set(['secret.read-noapproval', 'access.denied', 'secret.read-deny', 'secret.write-deny', 'grant.revoke', 'fill.redeem-deny', 'credential.cancel', 'policy.shadow-mismatch', 'admin.login-fail'])
// Event names are dozens and change; the operator thinks in groups. A trailing
// .* matches a prefix (telegram.*, oauth.*, fill.*). “Risk events only” reuses
// RED_LOG_EVENTS so red stays the one definition of "risk".
const LOG_EVENT_GROUPS = [
  { key: 'read', label: 'Reads and denials', match: ['secret.read', 'secret.read-deny', 'secret.read-noapproval'] },
  { key: 'blocked', label: 'Blocked requests', match: ['access.denied'] },
  { key: 'grant', label: 'Grant changes', match: ['grant.share', 'grant.revoke', 'grant.extend', 'request.approve', 'request.deny', 'request.auto-approve', 'request.create'] },
  { key: 'ai', label: 'AI and Telegram', match: ['ai.ask', 'telegram.*'] },
  { key: 'login', label: 'Login and unlock', match: ['admin.login', 'admin.login-fail', 'admin.oidc-login', 'admin.origin-mismatch', 'vault.unlock', 'vault.lock', 'vault.oidc-unlock'] },
  { key: 'item', label: 'Items and classification', match: ['item.create', 'item.update', 'item.delete', 'item.rotate', 'item.rotate.restore', 'item.rotate.purge', 'item.expiry.update', 'fill-policy.update', 'use-policy.update', 'plaintext-read-policy.update', 'audit.export'] },
  { key: 'oauth', label: 'OAuth and fill', match: ['oauth.*', 'fill.*'] },
  { key: 'risk', label: 'Risk events only', red: true, match: [] },
]

function renderRecent() {
  // The overview shows the latest activity from the full trail, not only what
  // still fits in the 20-row state slice.
  const rows = (app.recentAudit && app.recentAudit.length ? app.recentAudit : (app.data.audit || [])).slice(0, 8)
  $('recent-box').innerHTML = rows.map((entry) =>
    '<div class="ios-row ios-row--log"><div class="ios-main">' +
    '<div class="ios-log-time">' + esc(new Date(entry.time).toLocaleTimeString('en-GB', { hour12: false })) + '</div>' +
    '<div class="ios-log-text' + (RED_LOG_EVENTS.has(String(entry.event || '')) ? ' bad' : '') + '">' + esc(describe(entry)) + '</div>' +
    '</div></div>').join('') || '<div class="hint">No activity yet</div>'
}
async function loadRecent() {
  try { const data = await auditPage({ limit: 8 }); app.recentAudit = data.entries || [] } catch { app.recentAudit = [] }
  renderRecent()
}
// Options are rebuilt from the audit rows on every render (the data can change
// under a refresh); the current choice is carried over by value.
function logEventInGroup(group, event) {
  if (group.red) return RED_LOG_EVENTS.has(event)
  return (group.match || []).some((kind) => (kind.endsWith('.*') ? event.startsWith(kind.slice(0, -1)) : event === kind))
}

// Filters go to the server. Keeping only the matching window in memory is the
// point: a large trail used to arrive in full and be filtered in the browser.
const logState = { rows: [], total: 0, more: false, masked: false }
function logFilterQuery() {
  const params = new URLSearchParams()
  for (const [key, id] of [['item', 'logs-item-filter'], ['agent', 'logs-agent-filter'], ['event', 'logs-event-filter'], ['q', 'logs-search'], ['from', 'logs-from'], ['to', 'logs-to']]) {
    const value = String(($(id) || {}).value || '').trim()
    if (value) params.set(key, value)
  }
  return params
}
async function refreshLogs(append = false) {
  const params = logFilterQuery()
  params.set('limit', '100')
  params.set('offset', String(append ? logState.rows.length : 0))
  const box = $('logs-box')
  if (box && !append) box.innerHTML = '<div class="hint">Loading…</div>'
  const count = $('logs-count')
  if (count && !append) count.textContent = 'Loading…'
  try {
    const result = await api('/api/audit?' + params.toString())
    logState.rows = append ? logState.rows.concat(result.entries || []) : (result.entries || [])
    logState.total = Number(result.total ?? logState.rows.length)
    logState.more = result.hasMore === true
    logState.masked = result.masked === true
    renderLogs()
  } catch (error) {
    if (box) box.innerHTML = '<div class="state" data-tone="error"><div class="state__title">Couldn’t load logs</div><div class="state__body">' + esc(error.message) + '</div><div class="state__actions"><button data-logs-retry>Retry</button></div></div>'
    const retry = box && box.querySelector('[data-logs-retry]')
    if (retry) retry.onclick = () => refreshLogs()
    if (count) count.textContent = ''
  }
}
let logFilterTimer = 0
function scheduleLogs() {
  clearTimeout(logFilterTimer)
  logFilterTimer = setTimeout(() => refreshLogs(), 260)
}
function resetLogFilters() {
  for (const id of ['logs-item-filter', 'logs-agent-filter', 'logs-event-filter', 'logs-search', 'logs-from', 'logs-to']) { const el = $(id); if (el) el.value = '' }
  refreshLogs()
}
// The CSV is a real export of the current filter, so it needs the same second
// factor as any other export. api() only speaks JSON, hence the raw fetch.
async function exportAuditCsv() {
  const confirm = await askConfirm('Export audit log')
  if (!confirm) return
  const payload = { format: 'csv' }
  for (const [key, value] of logFilterQuery().entries()) payload[key] = value
  const response = await fetch('/api/audit', {
    method: 'POST',
    cache: 'no-store',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...payload, ...confirm }),
  })
  if (!response.ok) {
    let message = 'Export failed (HTTP ' + response.status + ')'
    try { const body = await response.json(); message = body.error || body.message || message } catch {}
    return toast(message, true)
  }
  const disposition = response.headers.get('content-disposition') || ''
  const matched = disposition.match(/filename="([^"]+)"/)
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)
  const filename = matched ? matched[1] : 'secrets-broker-audit-' + stamp + '.csv'
  const url = URL.createObjectURL(await response.blob())
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  toast('Exported ' + logState.total + ' log entries (current filters)')
}
function fillLogSelect(id, options, allLabel) {
  const select = $(id); if (!select) return
  const current = select.value
  select.innerHTML = '<option value="">' + esc(allLabel) + '</option>' + options.map((option) => '<option value="' + esc(option.value) + '"' + (option.value === current ? ' selected' : '') + '>' + esc(option.label) + '</option>').join('')
}
function renderLogs() {
  // /api/state now embeds only the newest entries; the log page pages the full
  // history. Union both so the item/agent filters still offer names that exist
  // outside the embedded window.
  const all = (app.data.audit || []).concat(logState.rows || [])
  const names = [...new Set(all.map((entry) => entry.name).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)))
  const agents = [...new Set(all.map((entry) => entry.agent).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)))
  fillLogSelect('logs-item-filter', names.map((name) => ({ value: name, label: name })), 'All items')
  fillLogSelect('logs-agent-filter', agents.map((name) => ({ value: name, label: agentLabel(name) })), 'All Agents')
  fillLogSelect('logs-event-filter', LOG_EVENT_GROUPS.map((group) => ({ value: group.key, label: group.label })), 'All event types')
  const rows = logState.rows
  const count = $('logs-count')
  if (count) count.textContent = 'Showing ' + rows.length + ' of ' + esc(String(Number(logState.total) || 0)) + '' + (logState.masked ? ' · locked, item names redacted' : '')
  const more = $('logs-more-wrap')
  if (more) more.style.display = logState.more ? 'flex' : 'none'
  const clearable = ['logs-item-filter', 'logs-agent-filter', 'logs-event-filter', 'logs-search', 'logs-from', 'logs-to'].some((id) => String(($(id) || {}).value || '').trim())
  $('logs-box').innerHTML = rows.length ? '<div class="ios-group"><div class="ios-card">' + rows.map((entry) => {
    const red = RED_LOG_EVENTS.has(String(entry.event || '')) || entry.noApproval === true || entry.severity === 'warn'
    return '<div class="ios-row ios-row--log"><div class="ios-main">' +
      '<div class="ios-log-time">' + esc(new Date(entry.time).toLocaleString('en-GB', { hour12: false })) + '</div>' +
      '<div class="ios-log-text' + (red ? ' bad' : '') + '">' + esc(describe(entry)) + '</div>' +
      ([entry.agent, entry.name].filter(Boolean).length ? '<div class="ios-sub">' + esc([entry.agent, entry.name].filter(Boolean).join(' · ')) + '</div>' : '') +
      '</div></div>'
  }).join('') + '</div></div>'
    : '<div class="state"><div class="state__title">' + (clearable ? 'No logs match the filters' : 'No logs yet') + '</div>'
      + '<div class="state__body">' + (clearable ? 'Try a different item, Agent, event type or time range. Filters run on the server, which returns only matching rows.' : 'Every read, grant, policy change and export is recorded here.') + '</div>'
      + (clearable ? '<div class="state__actions"><button data-logs-clear>Clear filters</button></div>' : '') + '</div>'
  const clear = $('logs-box').querySelector('[data-logs-clear]')
  if (clear) clear.onclick = resetLogFilters
}
async function createItemMenu() {
  try {
    const v2 = await api('/api/v2/status')
    if (v2.initialized && !v2.unlocked) {
      show('dashboard', false); show('unlock-card', true)
      toast('The vault is locked. Unlock it before adding items')
      return
    }
  } catch {}
  openModal('New secret item', '<label class="field">Name</label><input id="new-item-name" placeholder="e.g. tavily-api-key"><label class="field">Username (optional)</label><input id="new-item-username" placeholder="Login username"><label class="field">Secret value</label><input id="new-item-value" placeholder="The secret to store"><label class="field">TOTP Secret (optional)</label><input id="new-item-totp" placeholder="Base32 TOTP secret"><label class="field">URL (optional)</label><input id="new-item-url" placeholder="https://example.com"><label class="field">Group (optional)</label><input id="new-item-group" placeholder="e.g. blog/prod"><label class="field">Notes (optional)</label><input id="new-item-notes"><label class="field">Type</label><select id="new-item-kind"><option value="">Unclassified (not readable yet)</option><option value="api">api (API Key, an Agent can be authorized to read it)</option><option value="web">web (website login, fill only)</option></select><div id="new-item-web" class="hidden"><label class="field">Allowed fill origins (one per line)</label><textarea id="new-item-origins" rows="2" style="width:100%" placeholder="https://example.com"></textarea></div><label class="chk" style="margin-top:8px"><input type="checkbox" id="new-item-noapproval"> No approval needed</label><div class="row" style="margin-top:12px"><button class="primary" id="new-item-save">Create</button></div><div class="status" id="new-item-status"></div>')
  // The web fields only mean something for a website login.
  $('new-item-kind').onchange = () => $('new-item-web').classList.toggle('hidden', $('new-item-kind').value !== 'web')
  $('new-item-save').onclick = async () => {
    const name = $('new-item-name').value.trim()
    if (!name) return status('new-item-status', 'Enter a name', 'error')
    const kind = $('new-item-kind').value
    const origins = kind === 'web' ? $('new-item-origins').value.split('\n').map((line) => line.trim()).filter(Boolean) : []
    if (kind === 'web' && !origins.length) return status('new-item-status', 'The web type needs at least one origin', 'error')
    try {
      const newItem = { name, username: $('new-item-username').value, value: $('new-item-value').value, totp: $('new-item-totp').value, url: $('new-item-url').value.trim(), group: $('new-item-group').value.trim(), notes: $('new-item-notes').value, noApproval: $('new-item-noapproval').checked }
      // Creating an auto-approved credential is an authorization decision.
      if (newItem.noApproval) await sensitivePost('/api/items/create', newItem, 'Enable no-approval policy')
      else await api('/api/items/create', { method: 'POST', body: JSON.stringify(newItem) })
      // Classify in the same step: the item was just created with a kind, so
      // making the operator reopen it to classify is a pointless round trip.
      if (kind) {
        await api('/api/fill/policy', { method: 'POST', body: JSON.stringify(kind === 'web' ? { item: name, kind, origins, actions: ['login'] } : { item: name, kind }) })
        if (kind === 'api') await api('/api/fill/read-policy', { method: 'POST', body: JSON.stringify({ item: name, allow: true, ttlDays: 30 }) })
      }
      show('modal', false); await Promise.all([loadItems(), loadState()]); toast(kind ? 'Created and classified as ' + kind : 'Created (unclassified, so no Agent can read it yet)')
    } catch (error) {
      if (error.status === 423) {
        toast('The vault is locked. Refresh the page and unlock it before creating')
        status('new-item-status', 'The vault is locked. Refresh the page and unlock it before creating', 'error')
        return
      }
      status('new-item-status', error.message, 'error')
    }
  }
}
// The importer reads one shape: a JSON array of {name,value,...}, or the same
// under {items:[...]}. That is deliberately narrow: a Bitwarden CSV export has
// no encrypted payload we can map without the account keys, and a Bitwarden
// JSON export is encrypted. Anything else must be converted first, so the
// dialog says so rather than failing on an unreadable file.
function importItems(event) {
  const file = event.target.files?.[0]; event.target.value = ''
  if (!file) return
  openImportDialog(file)
}
function openImportDialog(file) {
  openModal('Import secrets', '<div class="hint">Current file: <code>' + esc(file.name) + '</code></div>' +
    '<div class="hint" style="margin-top:10px">Two JSON formats are supported:<br>' +
    '· <code>[{"name":"a","value":"b"}, …]</code><br>' +
    '· <code>{"items":[{"name":"a","value":"b"}, …]}</code><br>' +
    'Fields per entry: <code>name</code> (required), <code>value</code>, <code>username</code>, <code>url</code>, <code>notes</code>, <code>totp</code>, <code>group</code>, <code>noApproval</code>.</div>' +
    '<div class="hint" style="margin-top:10px;color:var(--danger)">Not one of these formats? Bitwarden encrypted JSON, CSV exports and 1Password/KeePass exports must be converted first; they can’t be mapped directly.</div>' +
    '<label class="field">Classify all after import (optional)</label><select id="imp-kind"><option value="">Keep unclassified</option><option value="api">api (API Key)</option></select>' +
    '<div class="hint" style="margin-top:4px">The web type needs an origin set per item, so it can’t be applied in bulk on import.</div>' +
    '<div class="row" style="margin-top:12px"><button class="primary" id="imp-go">Start import</button></div><div class="status" id="imp-status"></div>')
  $('imp-go').onclick = async () => {
    try {
      status('imp-status', 'Reading file…')
      const parsed = JSON.parse(await file.text())
      const items = Array.isArray(parsed) ? parsed : parsed.items
      if (!Array.isArray(items)) throw new Error('JSON must be [{name,value,…}] or {items:[…]}')
      const kind = $('imp-kind').value
      status('imp-status', 'Importing ' + items.length + ' entries…')
      const result = await api('/api/items/import', { method: 'POST', body: JSON.stringify({ items }) })
      let classified = 0
      if (kind === 'api') {
        // A batch of api credentials is the common case (a set of API keys), so
        // it is offered here instead of one modal per item.
        for (const name of result.created || []) {
          try { await api('/api/fill/policy', { method: 'POST', body: JSON.stringify({ item: name, kind: 'api' }) }); await api('/api/fill/read-policy', { method: 'POST', body: JSON.stringify({ item: name, allow: true, ttlDays: 30 }) }); classified++ } catch {}
        }
      }
      show('modal', false); await Promise.all([loadItems(), loadState()])
      toast('Import done: added ' + (result.created?.length || 0) + ', skipped ' + (result.skipped?.length || 0) + (classified ? ', classified ' + classified : ''))
      if (result.skipped?.length) console.warn('import skipped', result.skipped)
    } catch (error) { status('imp-status', 'Import failed: ' + error.message, 'error') }
  }
}
function openBulkShare() {
  const names = [...selectedItems]
  if (!names.length) return
  const agents = app.data.agents || []
  const single = names.length === 1
  const boxes = agents.map((agent) => {
    const checked = single ? (app.data.grants || []).some((grant) => !grant.revokedAt && grant.agent === agent.name && grant.name === names[0]) : names.every((name) => (app.data.grants || []).some((grant) => !grant.revokedAt && grant.agent === agent.name && grant.name === name))
    return '<label class="chk" style="display:flex;width:100%"><input type="checkbox" class="bulk-agent" value="' + esc(agent.name) + '" ' + (checked ? 'checked' : '') + '> ' + esc(agent.alias || agent.name) + (agent.oauth ? ' <span class="pill">OAuth</span>' : '') + '</label>'
  }).join('')
  openModal('Bulk share / sync (' + names.length + ' selected)', '<div class="hint">Each checked Agent gets these items. With “Unshare from any unchecked Agent” on, unchecked ones lose their existing shares.</div><div style="max-height:220px;overflow:auto;margin-top:8px">' + (boxes || '<div class="hint">No Agent configured</div>') + '</div><label class="field">Cross-account target folder (required for cross-account)</label><input id="bulk-folder" placeholder="e.g. Notes"><label class="field">Duration</label><select id="bulk-seconds"><option value="3600">1 hour</option><option value="86400">24 hours</option><option value="604800">7 days</option><option value="2592000">30 days</option><option value="0">Permanent</option></select><label class="field">Max reads (blank for unlimited)</label><input id="bulk-reads" type="number" min="1"><label class="chk"><input type="checkbox" id="bulk-scope" checked> Also add these items to each Agent’s requestable scope</label><div class="hint" style="margin:2px 0 0 22px">Sharing by itself only creates a “grant”. The Agent also needs the item in scope to see it, so this is checked by default; uncheck it to grant without changing scope.</div><label class="chk"><input type="checkbox" id="bulk-revoke" ' + (single ? 'checked' : '') + '> Unshare from any unchecked Agent</label><div class="row" style="margin-top:12px"><button class="primary" id="bulk-confirm">Confirm</button></div>')
  $('bulk-confirm').onclick = async () => {
    const agentsSelected = [...document.querySelectorAll('.bulk-agent:checked')].map((box) => box.value)
    try {
      const result = await api('/api/grants/sync', { method: 'POST', body: JSON.stringify({ items: names, agents: agentsSelected, seconds: Number($('bulk-seconds').value), maxReads: $('bulk-reads').value || null, targetFolder: $('bulk-folder').value.trim(), revokeUnselected: $('bulk-revoke').checked, addToScope: $('bulk-scope').checked }) })
      show('modal', false); selectedItems.clear(); await Promise.all([loadState(), loadItems()])
      toast('Shared ' + (result.granted?.length || 0) + ', queued for transfer ' + (result.queued?.length || 0) + ', revoked ' + (result.revoked?.length || 0) + (result.errors?.length ? ', failed ' + result.errors.length : ''))
    } catch (error) { toast(error.message, true) }
  }
}
async function bulkDelete() {
  const names = [...selectedItems]
  if (!names.length) return
  if (!(await askYes('Delete the ' + names.length + ' selected items?'))) return
  // A failed delete used to vanish: the loop swallowed the error, the toast said
  // "Deleted N items" even when none were, and the rows were gone on the next
  // render only because the reload overwrote them. Report what actually stuck.
  let deleted = 0
  const failed = []
  // One request per row took long enough on a big selection that the click
  // looked stuck. The bar now counts out loud, and every failure is named at
  // the end instead of disappearing into a silent continue.
  const progress = $('bulk-progress')
  const report = (index) => { if (progress) progress.textContent = 'Processed ' + index + '/' + names.length + (failed.length ? ' · failed ' + failed.length : '') }
  if (progress) progress.textContent = 'Processed 0/' + names.length
  for (let index = 0; index < names.length; index++) {
    const name = names[index]
    try { await api('/api/items/delete', { method: 'POST', body: JSON.stringify({ name }) }); deleted++ } catch { failed.push(name) }
    report(index + 1)
  }
  if (failed.length && progress) progress.textContent = 'Processed ' + names.length + '/' + names.length + ' · failed: ' + failed.join(', ')
  selectedItems.clear(); await Promise.all([loadItems(), loadState()])
  // The bar hides as soon as the selection clears, so the last "Processed N/N"
  // frame would never paint. The count rides along with the final message,
  // which stays readable in the item status line.
  const done = names.length + '/' + names.length
  if (failed.length) toast('Processed ' + done + ', deleted ' + deleted + ', failed to delete ' + failed.length + ': ' + failed.slice(0, 3).join(', ') + (failed.length > 3 ? ' and more' : ''), true)
  else toast('Processed ' + done + ', deleted ' + deleted + '')
}
async function exportItems() {
  // The file holds every password in the vault, so the server asks for a code.
  // Ask here too, rather than letting the click fail with a 428.
  const code = await askCode('The export contains all plaintext. Enter the 6-digit code from your authenticator app.', { label: 'Export code' })
  if (!code) return
  try {
    const data = await api('/api/items/export', { method: 'POST', body: JSON.stringify({ code }) }); const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'secrets-export-' + new Date().toISOString().slice(0, 10) + '.json'; link.click(); URL.revokeObjectURL(link.href); toast('Exported (contains plaintext; keep it safe)')
  } catch (error) { toast(error.status === 428 ? 'Export needs two-factor authentication. Turn it on in “Settings → Security” first' : error.message, true) }
}
function openModal(title, body) { const card = document.querySelector('#modal > .card'); if (card) card.classList.remove('pm-wide'); $('modal-title').textContent = title; $('modal-body').innerHTML = body; show('modal', true) }
function uaLabel(ua) {
  const text = String(ua || '')
  const browser = /Edg\/([\d.]+)/.test(text) ? 'Edge ' + text.match(/Edg\/([\d.]+)/)[1] : /Chrome\/([\d.]+)/.test(text) ? 'Chrome ' + text.match(/Chrome\/([\d.]+)/)[1] : /Firefox\/([\d.]+)/.test(text) ? 'Firefox ' + text.match(/Firefox\/([\d.]+)/)[1] : /Version\/([\d.]+).*Safari/.test(text) ? 'Safari ' + text.match(/Version\/([\d.]+)/)[1] : 'Unknown'
  const os = /Windows NT 10/.test(text) ? 'Windows' : /Mac OS X/.test(text) ? 'macOS' : /Android/.test(text) ? 'Android' : /iPhone|iPad/.test(text) ? 'iOS' : /Linux/.test(text) ? 'Linux' : ''
  return browser + (os ? ' · ' + os : '')
}
function agentLabel(name) { const agent = (app.data.agents || []).find((entry) => entry.name === name); return agent?.alias || agent?.name || name || 'System' }
function describeEvent(entry) {
  const map = {
    'secret.read': 'Secret read', 'secret.read-noapproval': '⚠ Read without approval (all checks skipped)',
    'access.denied': '⚠ Read request blocked', 'secret.read-deny': 'Plaintext read denied',
    'grant.share': 'Grant shared', 'grant.approve': 'Grant approved', 'grant.revoke': 'Grant revoked',
    'transfer.complete': 'Cross-account copy completed', 'item.create': 'Item created', 'item.update': 'Item updated',
    'vault.unlock': 'Vault unlocked', 'secret.use': 'Proxied call', 'secret.fill': 'Web fill',
    'use-policy.update': 'Use policy changed', 'fill-policy.update': 'Type changed',
    'item.rotate': 'Secret rotated', 'item.rotate.restore': 'Old value restored', 'item.rotate.purge': 'Old value backup purged',
    'item.expiry.update': 'Expiry changed', 'audit.export': 'Audit log exported',
  }
  return map[entry.event] || entry.event || ''
}
function itemInfoHtml(item, history = null) {
  // Sharing arrives in two shapes: capabilities (agentActions) and legacy grant
  // rows. The list above counts both, so this panel must too — otherwise the
  // row said "shared with 3 Agents" while this card said "Not shared with any Agent".
  const legacy = (app.data.grants || []).filter((grant) => grant.name === item.name)
  const caps = ((app.data.agentActions || [])).filter((entry) => entry.action === 'secret.read' && entry.itemName === item.name && entry.usesLeft !== 0 && liveRight(entry))
  const holders = new Map()
  for (const grant of legacy) holders.set(grant.agent, { agent: grant.agent, mode: grant.mode || 'Grant', reads: grant.reads || 0, max: grant.maxReads, expiresAt: grant.expiresAt, legacy: true })
  for (const cap of caps) if (!holders.has(cap.agent)) holders.set(cap.agent, { agent: cap.agent, mode: 'Capability', reads: cap.usedCount ?? 0, max: cap.maxUses, expiresAt: cap.expiresAt, legacy: false })
  // Usage and refusals answer "what happened to this item", so they read the
  // full trail for the item rather than the 20-row state slice. The caller
  // fetches that history once and passes it in.
  const trail = history || (app.data.audit || [])
  const usage = trail.filter((entry) => entry.name === item.name && ['secret.read', 'secret.read-noapproval', 'grant.share', 'grant.approve', 'transfer.complete', 'item.create', 'item.update'].includes(entry.event)).slice(0, 10)
  // Denied attempts were only visible in the log page, which is the one place
  // an operator does not look when asking "why did this agent stop working".
  // They are a separate list: a refusal is not usage, and showing them mixed in
  // would make a working credential look broken.
  const denied = trail.filter((entry) => entry.name === item.name && ['access.denied', 'secret.read-deny'].includes(entry.event)).slice(0, 6)
  const durationLabel = (grant) => { if (!grant.expiresAt) return 'Permanent'; const ms = grant.expiresAt - Date.now(); if (ms <= 0) return 'Expired'; const days = Math.ceil(ms / 86400000); return days <= 1 ? Math.max(1, Math.ceil(ms / 3600000)) + ' h' : days + ' days' }
  const grantRows = holders.size ? [...holders.values()].map((grant) => '<div class="ios-field"><label>' + esc(agentLabel(grant.agent)) + '<small>' + esc(grant.mode) + ' · reads ' + grant.reads + '/' + (grant.max || '∞') + '</small></label>' + (grant.legacy
    ? '<button class="ios-pill plain" data-item-grant data-agent="' + esc(grant.agent) + '" data-name="' + esc(item.name) + '" title="Click to change duration and read limit">' + esc(durationLabel(grant)) + '</button>'
    : '<span class="ios-pill plain">' + esc(durationLabel(grant)) + '</span>') + '</div>').join('') : '<div class="ios-field"><label>Not shared with any Agent</label></div>'
  const usageRows = usage.length ? usage.map((entry) => '<div class="ios-row ios-row--log"><div class="ios-main"><div class="ios-log-text">' + esc(describeEvent(entry)) + '</div><div class="ios-sub">' + esc(entry.time ? new Date(entry.time).toLocaleString('en-GB', { hour12: false }) : '') + ' · ' + esc(agentLabel(entry.agent)) + (entry.mode || entry.source ? ' · ' + esc(entry.mode || entry.source) : '') + '</div></div></div>').join('') : '<div class="ios-field"><label>No usage yet</label></div>'
  const deniedRows = denied.length ? denied.map((entry) => '<div class="ios-row ios-row--log"><div class="ios-main"><div class="ios-log-text">' + esc(describeEvent(entry)) + '</div><div class="ios-sub">' + esc(entry.time ? new Date(entry.time).toLocaleString('en-GB', { hour12: false }) : '') + ' · ' + esc(agentLabel(entry.agent)) + '</div></div></div>').join('') : '<div class="ios-field"><label>No denied attempts</label></div>'
  return '<div class="card read-card"><div class="ios-head"><h2 style="margin:0">Sharing</h2><button class="ios-pill plain" id="mi-share-sync">Share / sync</button></div><div class="hint">Created: ' + esc(item.createdAt ? new Date(item.createdAt).toLocaleString('en-GB', { hour12: false }) : '-') + ' · Created by: ' + esc(item.creator || '-') + '</div>' + grantRows + '<h2 style="margin-top:var(--sp-4)">Recent use</h2>' + usageRows + '<h2 style="margin-top:var(--sp-4)">Denied attempts</h2><div class="hint">Only the time and Agent are logged, not the request content.</div>' + deniedRows + '</div>'
}
// The expiry field of the edit dialog. A secret without an expiry shows an
// empty date, and an empty date on save means no expiry.

function expiresField(item) {
  const stamp = item && item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 10) : ''
  return '<label class="field">Expiry date (leave empty for no expiry)</label><input id="mi-expires" type="date" value="' + esc(stamp) + '">'
}

// ── Edit-mode dirty tracking ────────────────────────────────────────────────
// Edit only reveals the inputs; Done used to hide them again without saving
// anything, so every keystroke was thrown away in silence. The page now
// snapshots the form on entry, diffs it on input/change, and asks before any
// exit that would drop the difference.
const editor = { editing: false, snapshot: null, dirty: false }
// One question at a time: a second exit attempt while the bar is open answers
// "stay" instead of stacking another copy of the same ask.
let leaveAsk = null
const editControls = () => $('item-page-body').querySelectorAll('.edit-only input,.edit-only select,.edit-only textarea')
const fieldValue = (el) => (el.type === 'checkbox' ? el.checked : el.value)
function snapshotFields() { return [...editControls()].map((el) => ({ el, value: fieldValue(el) })) }
// The share picker sits in the same card, so a half-filled share is an edit too.
function formChanged() { return !editor.snapshot || editor.snapshot.some(({ el, value }) => fieldValue(el) !== value) }
function restoreSnapshot() {
  if (!editor.snapshot) return
  for (const { el, value } of editor.snapshot) { if (el.type === 'checkbox') el.checked = value; else el.value = value }
  setDirty(false)
}
// The strip under the title is the visible state line; the save button carries
// the same words in its label so it is not conveyed by colour alone.
function setDirty(dirty) {
  editor.dirty = Boolean(dirty)
  const page = $('item-page')
  if (page) page.dataset.dirty = editor.dirty ? 'true' : 'false'
  const strip = $('item-page-state')
  if (strip) {
    const text = editor.editing ? (editor.dirty ? 'Unsaved changes · nothing reaches the server until you save' : 'No changes yet') : ''
    // Only rewrite when the state actually flipped: a keystroke-by-keystroke
    // assignment would make the live region announce the same line forever.
    if (strip.textContent !== text) strip.textContent = text
    strip.dataset.tone = editor.dirty ? 'dirty' : 'clean'
  }
  const save = $('mi-save')
  if (save) {
    save.setAttribute('aria-label', editor.dirty ? 'Save changes (unsaved changes)' : 'Save changes (no changes)')
    save.title = editor.dirty ? 'Unsaved changes. Click to save them to the server' : 'No changes'
  }
}
function syncDirty() { if (editor.editing) setDirty(formChanged()) }
function enterEditMode() {
  editor.editing = true
  $('item-page').dataset.editing = 'true'
  $('item-page-edit').textContent = 'Done'
  editor.snapshot = snapshotFields()
  setDirty(false)
  // Jumping to the bottom of a long page hid the field you just asked to edit.
  // Bring the first editable control into view and put the cursor in it.
  const first = $('item-page-body').querySelector('.edit-only input,.edit-only select,.edit-only textarea')
  if (first) { first.scrollIntoView({ block: 'center', behavior: 'smooth' }); first.focus() }
}
function exitEditMode() {
  editor.editing = false
  editor.snapshot = null
  const page = $('item-page')
  if (page) page.dataset.editing = 'false'
  const edit = $('item-page-edit')
  if (edit) edit.textContent = 'Edit'
  setDirty(false)
}
// True means "carry on with the exit"; false means "the operator chose to
// keep editing". Nothing is asked while the form matches its snapshot.
function confirmDiscard() {
  if (!editor.dirty) return Promise.resolve(true)
  if (leaveAsk) return Promise.resolve(false)
  leaveAsk = askYes('You have unsaved changes. Leaving will discard them.', { yes: 'Discard changes', no: 'Keep editing' })
  return leaveAsk.then((ok) => { leaveAsk = null; return ok })
}
async function requestCloseItemPage() {
  if (!(await confirmDiscard())) return
  closeItemPage()
}
async function toggleEditMode() {
  if (!editor.editing) return enterEditMode()
  // Done hides the inputs without saving, so leaving the form with edits is the
  // same loss as leaving the page and gets the same question.
  if (!(await confirmDiscard())) return
  if (editor.dirty) restoreSnapshot()
  exitEditMode()
  $('item-page-edit').focus()
}

// A pushed page instead of a dialog: the item detail is a place you navigate
// to and come back from, not a thing that floats over the list.
function openItemPage(title, html) {
  $('item-page-title').textContent = title
  // The page title ellipsises on a phone; hover/long names still need the
  // readable value.
  $('item-page-title').title = title
  $('item-page-body').innerHTML = html
  $('item-page-body').scrollTop = 0
  const page = $('item-page')
  exitEditMode()
  page.classList.remove('hidden')
  document.body.classList.add('page-open')
  // Mark the row this page belongs to, so a wide-screen split shows which
  // entry the right-hand column is describing.
  for (const row of document.querySelectorAll('.ios-row.current')) row.classList.remove('current')
  let host = null
  if (window.CSS && CSS.escape) host = document.querySelector('[data-item-menu="' + CSS.escape(title) + '"]')
  const current = host && host.closest('.ios-row')
  if (current) current.classList.add('current')
  requestAnimationFrame(() => page.classList.add('in'))
}
function closeItemPage() {
  const page = $('item-page')
  if (!page || page.classList.contains('hidden')) return
  // Every caller that reaches here has saved, deleted, shared, already
  // answered the question, or never had unsaved edits.
  exitEditMode()
  page.classList.remove('in')
  document.body.classList.remove('page-open')
  setTimeout(() => { if (!page.classList.contains('in')) page.classList.add('hidden') }, 360)
}
$('item-page-back').onclick = requestCloseItemPage
$('item-page-close').onclick = requestCloseItemPage
$('item-page-edit').onclick = toggleEditMode
// The form controls live inside the page body, which is re-rendered on every
// open, so the listener sits on the stable container instead of on each input.
$('item-page-body').addEventListener('input', syncDirty)
$('item-page-body').addEventListener('change', syncDirty)
// Esc should peel one layer at a time. Closing the dialog used to also close
// the page underneath it, because both listeners saw the same key.
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return
  // A dialog or a confirmation owns Escape while it is open; the page below it
  // is the last thing that should close.
  if (!document.getElementById('modal').classList.contains('hidden')) return
  if (document.querySelector('.ask')) return
  requestCloseItemPage()
})
// A tab close or reload is the one exit the page cannot intercept, and the
// browser shows its own generic wording. Inside the desktop WebView
// beforeunload may not fire at all, which is why every in-page exit above is
// guarded separately instead of relying on this one.
window.addEventListener('beforeunload', (event) => {
  if (!editor.dirty) return
  event.preventDefault()
  event.returnValue = ''
})
// A stored password is the one thing in this panel worth a second factor: the
// cookie alone would otherwise be enough to empty the vault. So the button asks
// for a TOTP code, and an account without TOTP is told to enrol instead of being
// quietly handed the plaintext.
async function revealItemSecret(item) {
  let security
  try { security = await api('/api/security') } catch (error) { return toast(error.message, true) }
  if (!security.totpEnabled) {
    openModal('Plaintext requires two-factor authentication',
      '<p class="hint">Reading plaintext requires a 6-digit code, and this account has no two-factor authentication yet. In “Settings → Security”, generate a secret and scan it once with your authenticator app.</p>' +
      '<div class="row"><button class="primary" id="rv-enrol" type="button">Set up in Settings</button></div>')
    $('rv-enrol').onclick = () => {
      show('modal', false)
      const tab = document.querySelector('#nav [data-view=profile]')
      if (tab) tab.click()
      const box = $('totp-setup-box')
      if (box) box.scrollIntoView({ block: 'center' })
      toast('Click “Generate/regenerate key”, then scan the QR code with your authenticator app')
    }
    return
  }
  openModal('View ' + item.name,
    '<label class="field">Two-factor code</label>' +
    '<input id="rv-code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="123456">' +
    '<div class="hint" id="rv-status">6 digits, changes every 30 seconds</div>' +
    '<div class="row"><button class="primary" id="rv-go" type="button">View plaintext</button></div>')
  $('rv-code').focus()
  // One press, one request: the button used to stay live so a double click or
  // a slow verify fired twice, and a failure left the typed code in place with
  // no hint that the code, not the network, was the problem.
  const submit = async () => {
    const code = $('rv-code').value.replace(/\s+/g, '')
    if (!/^\d{6}$/.test(code)) { status('rv-status', 'Enter the 6-digit code', 'error'); $('rv-code').focus(); return }
    const go = $('rv-go')
    if (!go) return
    go.disabled = true
    go.setAttribute('aria-busy', 'true')
    go.textContent = 'Verifying…'
    try {
      const data = await api('/api/secret/reveal', { method: 'POST', body: JSON.stringify({ name: item.name, code }) })
      $('modal-body').innerHTML = '<div class="kv"><span>Username</span><b>' + esc(data.username || 'Not set') + '</b></div>' +
        '<div class="kv"><span>Secret</span><b><code>' + esc(data.value || '') + '</code></b></div>' +
        (data.totp ? '<div class="kv"><span>Code</span><b><code>' + esc(data.totp) + '</code></b></div>' : '') +
        '<div class="row"><button class="primary" id="rv-copy" type="button">Copy secret</button></div>'
      $('rv-copy').onclick = async () => {
        try { await navigator.clipboard.writeText(data.value || ''); toast('Copied') } catch { toast('Copy failed. Select the secret text manually', true) }
      }
    } catch (error) {
      go.disabled = false
      go.removeAttribute('aria-busy')
      go.textContent = 'View plaintext'
      status('rv-status', error.message, 'error')
      const input = $('rv-code')
      if (input) { input.focus(); input.select() }
    }
  }
  $('rv-go').onclick = submit
  $('rv-code').onkeydown = (event) => { if (event.key === 'Enter') submit() }
}
async function openItemMenu(name) {
  const item = app.items.find((entry) => entry.name === name); if (!item) return
  const agents = app.data.agents || []
  // One fetch for the item's full trail feeds both Recent use and Denied attempts.
  let history = (app.data.audit || []).filter((entry) => entry.name === name)
  try { const data = await auditPage({ item: name, limit: 30 }); history = data.entries || history } catch {}
  openItemPage(name, itemInfoHtml(item, history) + '<div class="card read-card"><h2>Credential</h2>' +
        '<div class="kv"><span>Username</span><b>' + esc(item.username || 'Not set') + '</b></div>' +
    '<div class="kv"><span>Secret</span><b><button class="ios-pill plain" id="item-reveal" type="button">View</button></b></div>' +
    '<div class="kv"><span>URL</span><b>' + (item.url ? '<a href="' + esc(item.url) + '" target="_blank" rel="noreferrer">' + esc(item.url) + '</a>' : 'Not set') + '</b></div>' +
    '<div class="kv"><span>Group</span><b>' + esc(item.group || 'Ungrouped') + '</b></div>' +
    '<div class="kv"><span>Expires</span><b>' + expiryLabel(item.expiresAt) + '</b></div>' +
    '<div class="kv"><span>Last rotated</span><b>' + (item.lastRotatedAt ? relativeTime(Date.parse(item.lastRotatedAt)) + (item.rotatedBy ? ' · ' + esc(item.rotatedBy) : '') : 'Never') + '</b></div>' +
    (item.backupUntil ? '<div class="kv"><span>Old value backup</span><b>Kept until ' + new Date(item.backupUntil).toLocaleString('en-GB', { hour12: false }) + ' <button class="small" id="mi-restore" type="button">Restore old value</button> <button class="small danger" id="mi-purge" type="button" title="Purge the old value backup now. This cannot be undone">Purge backup</button></b></div>' : '') +
    '</div>' +
    fillEditorHtml(item) + '<div class="card edit-only"><label class="field">Name</label><input id="mi-name" value="' + esc(item.name) + '"><label class="field">Username (leave empty to keep)</label><input id="mi-username" value="' + esc(item.username || '') + '"><label class="field">TOTP Secret (leave empty to keep)</label><input id="mi-totp" value="' + esc(item.totp || '') + '"><label class="field">Group</label><input id="mi-group" value="' + esc(item.group || '') + '" placeholder="e.g. blog/prod"><label class="field">URL</label><input id="mi-url" value="' + esc(item.url || '') + '"><label class="field">Notes (leave empty to keep)</label><input id="mi-notes" placeholder="New notes"><label class="field">New secret value (leave empty to keep; filling it in rotates the secret and logs item.rotate)</label><input id="mi-value" type="password" placeholder="Leave empty to keep the current value"><label class="field">Keep old value on rotation</label><select id="mi-keepold"><option value="0" selected>Don’t keep (default, safest)</option><option value="7">7 days (can roll back)</option><option value="14">14 days (can roll back)</option><option value="30">30 days (can roll back)</option></select><div class="hint">When on, the server keeps only the old <strong>encrypted row</strong>, never the plaintext. You can restore it in one click during the window, and it is discarded when the window ends. The longer you keep it, the longer a revoked or leaked old secret can still be recovered.</div><label class="chk" style="margin-top:8px"><input type="checkbox" id="mi-noapproval" ' + (item.noApproval ? 'checked' : '') + '> No approval needed (reads automatically, still logged)</label><div class="row editor-zone" style="margin-top:14px"><button class="primary" id="mi-save" aria-label="Save changes (no changes)">Save changes</button><button id="mi-discard" aria-label="Discard changes and restore the values from when editing began">Discard</button><button id="mi-share">Share / cross-account copy</button></div></div><div class="card edit-only danger-zone" role="group" aria-label="Delete item"><div class="danger-zone__text"><b>Delete this item</b><span class="hint">This cannot be undone. Any Agent using it loses access immediately.</span></div><button class="danger" id="mi-delete">Delete</button></div><div class="card edit-only share-zone"><div class="hint">Agent sharing (same account: granted directly; cross-account: first copied to a folder in the target account, then completed automatically once you switch to that account and unlock)</div><label class="field">Share with (select one or more)</label><div class="pick-list">' + agents.map((agent) => '<label class="pick-row"><input type="checkbox" class="ios-check" data-share-agent value="' + esc(agent.name) + '"><span>' + esc(agentDisplayName(agent)) + '</span></label>').join('') + '</div><label class="field">Cross-account target folder (leave empty for the same account)</label><input id="mi-share-folder" placeholder="e.g. Notes"><label class="field">Duration</label><select id="mi-share-seconds"><option value="3600">1 hour</option><option value="86400">24 hours</option><option value="604800">7 days</option><option value="2592000">30 days</option><option value="0">Permanent</option></select><label class="field">Max reads (leave empty for no limit)</label><input id="mi-share-reads" type="number" min="1"></div>' + expiresField(item) + '</div>')
  // Purging is the one irreversible action on a backup, so it asks for the
  // second factor rather than a click-through confirm; the warning is in the
  // prompt itself because the button alone cannot carry it.
  if ($('mi-purge')) $('mi-purge').onclick = async () => {
    if (!await askConfirm('Purge the old value backup? It cannot be recovered, and the restore window ends.')) return
    await api('/api/items/rotate/purge', { method: 'POST', body: JSON.stringify({ itemId: item.id }) })
    toast('Old value backup purged')
    openItem(decodeURIComponent(name))
  }
  $('item-reveal').onclick = () => revealItemSecret(item)
  // Share / sync leaves the detail for another screen, so it is an exit too.
  $('mi-share-sync').onclick = async () => { if (!(await confirmDiscard())) return; closeItemPage(); selectedItems.clear(); selectedItems.add(item.name); openBulkShare() }
  // Discard restores the snapshot and closes the form without a second question:
  // answering it was the point of the button.
  $('mi-discard').onclick = () => { restoreSnapshot(); exitEditMode(); $('item-page-edit').focus() }
  // Only a changed policy needs the extra proof; ordinary edits do not.
  // A filled value is a rotation, not an ordinary edit: it re-encrypts the row,
  // bumps the revision, records item.rotate with the actor, and optionally
  // keeps the old sealed row for rollback. Keeping that on the same endpoint as
  // "save" would lose the audit event, so it takes its own path.
  $('mi-save').onclick = async () => {
    try {
      const value = $('mi-value').value
      const payload = { name: item.name, itemId: item.id, newName: $('mi-name').value.trim(), username: $('mi-username').value, totp: $('mi-totp').value, group: $('mi-group').value.trim(), url: $('mi-url').value.trim(), notes: $('mi-notes').value.trim() ? $('mi-notes').value : undefined, value, noApproval: $('mi-noapproval').checked, expiresAt: $('mi-expires').value }
      const policyChanged = payload.noApproval !== (item.noApproval === true)
      if (value) {
        const keepOldDays = Number($('mi-keepold')?.value || 0)
        const body = { ...payload, keepOldDays }
        const result = policyChanged
          ? await sensitivePost('/api/items/rotate', body, 'Rotate secret and change approval policy')
          : await api('/api/items/rotate', { method: 'POST', body: JSON.stringify(body) })
        closeItemPage()
        await Promise.all([loadItems(), loadState()])
        toast('Rotated' + (result.backup ? ', old value kept for ' + keepOldDays + ' days' : '') + (result.backupUnavailable ? '; no old value backup created (not supported by the current storage)' : ''))
        return
      }
      if (policyChanged) await sensitivePost('/api/items/update', payload, 'Change approval policy')
      else await api('/api/items/update', { method: 'POST', body: JSON.stringify(payload) })
      closeItemPage()
      await Promise.all([loadItems(), loadState()])
      toast('Saved')
    } catch (error) { toast(error.message, true) }
  }
  const restore = $('mi-restore')
  if (restore) restore.onclick = async () => {
    if (!(await askYes('Restore the old value? It replaces the current value, bumps revision +1 and is recorded in the audit log.'))) return
    try {
      await api('/api/items/rotate/restore', { method: 'POST', body: JSON.stringify({ itemId: item.id }) })
      closeItemPage()
      await Promise.all([loadItems(), loadState()])
      toast('Old value restored')
    } catch (error) { toast(error.message, true) }
  }
  $('mi-delete').onclick = async () => { if (!(await askYes('Delete item “' + item.name + '”?'))) return; try { await api('/api/items/delete', { method: 'POST', body: JSON.stringify({ name: item.name }) }); closeItemPage(); await Promise.all([loadItems(), loadState()]); toast('Deleted') } catch (error) { toast(error.message, true) } }
  wireFillEditor(item)
  $('mi-share').onclick = async () => { const agents = [...document.querySelectorAll('[data-share-agent]')].filter((box) => box.checked).map((box) => box.value); if (!agents.length) return toast('Select at least one Agent', true); try { const result = await api('/api/grants/share', { method: 'POST', body: JSON.stringify({ name: $('mi-name').value.trim() || item.name, agents, seconds: Number($('mi-share-seconds').value), maxReads: $('mi-share-reads').value || null, targetFolder: $('mi-share-folder').value.trim() }) }); closeItemPage(); await refreshAll(); if (result.queued?.length) toast('Queued for cross-account copy. It runs once you switch to the target account and unlock'); else toast('Shared') } catch (error) { toast(error.message, true) } }
}
async function saveAgentFromModal(originalName) {
  try {
    const requested = $('ma-realname').value.trim() || originalName
    let currentName = originalName
    if (requested !== originalName) {
      const renamed = await api('/api/agents/rename', { method: 'POST', body: JSON.stringify({ name: originalName, newName: requested }) })
      currentName = renamed.name
    }
    const payload = { name: currentName, alias: $('ma-alias').value.trim(), note: $('ma-note').value.trim(), allow: $('ma-allowall').checked ? [] : pickListValues('ma-allow'), groups: pickListValues('ma-groups'), allowAll: $('ma-allowall').checked, write: $('ma-write').checked, muted: $('ma-muted').checked, tools: [...document.querySelectorAll('[data-mcp-tool]')].filter((box) => box.checked).map((box) => box.value) }
    const previous = app.data.agents.find((entry) => entry.name === originalName)
    // Re-confirm only when write is being turned on; disabling it is a reduction.
    if (payload.write && previous?.write !== true) await sensitivePost('/api/agents/update', payload, 'Give Agent write access')
    else await api('/api/agents/update', { method: 'POST', body: JSON.stringify(payload) })
    show('modal', false); await refreshAll(); toast('Agent saved')
  } catch (error) { toast(error.message, true) }
}
// What this Agent may DO, per item. Read, use and fill are separate grants: a
// readable credential is not a fillable one, and the fill grant had no way to be
// given from this dialog at all — you had to provoke a denial first.
function agentActionFields(agent) {
  const held = ((app.data && app.data.agentActions) || []).filter((entry) => entry.agent === agent.name)
  const actionLabel = { 'secret.read': 'Read plaintext', 'secret.use': 'Proxied call (http_request)', 'secret.fill': 'Web fill' }
  const rows = held.length
    ? held.map((entry) => '<tr><td class="aa-pick"><input type="checkbox" class="ios-check" data-aa-pick data-item-id="' + esc(entry.itemId) + '" data-action="' + esc(entry.action) + '" data-item="' + esc(entry.itemName) + '" aria-label="Select ' + esc(entry.itemName) + '"></td>'
        + '<td><b>' + esc(entry.itemName) + '</b></td><td>' + esc(actionLabel[entry.action] || entry.action) + '</td>'
        + '<td class="hint">' + esc(entry.expiresAt ? new Date(entry.expiresAt).toLocaleString('en-GB', { hour12: false }) : 'Permanent') + '</td>'
        + '<td><button class="small danger" data-revoke-action data-agent="' + esc(agent.name) + '" data-action="' + esc(entry.action) + '" data-item="' + esc(entry.itemName) + '">Revoke</button></td></tr>').join('')
    : '<tr><td colspan="5" class="hint">No action grants yet. Scope only decides what can be requested; to actually read or fill, grant it here.</td></tr>'
  return '<div style="border-top:1px solid var(--line);margin-top:14px;padding-top:10px">'
    + '<b>Action grants</b>'
    + '<div class="hint" style="margin:4px 0 8px">Read plaintext, proxied call and web fill are three separate grants; give each one on its own. '
    + '<b>Web fill</b> needs the item classified as web with its sites filled in, or the grant cannot fill anything.</div>'
    + '<div class="table-wrap scroll-list" style="max-height:180px"><table><tr><th class="aa-pick"><input type="checkbox" class="ios-check" id="aa-all" aria-label="Select all"></th><th>Item</th><th>Action</th><th>Expires</th><th></th></tr>' + rows + '</table></div>'
    + (held.length ? '<div class="row" style="margin-top:8px;gap:8px;align-items:center"><button class="small danger" id="aa-revoke">Revoke selected</button><span class="hint" id="aa-count">None selected</span></div>' : '')
    + '<div class="row" style="margin-top:10px;gap:6px;flex-wrap:wrap">'
    + '<select id="aa-item" style="flex:1;min-width:140px">' + knownItemNames().map((name) => '<option value="' + esc(name) + '">' + esc(name) + '</option>').join('') + '</select>'
    + '<select id="aa-action" style="flex:0 0 auto"><option value="secret.read">Read plaintext</option><option value="secret.use">Proxied call</option><option value="secret.fill">Web fill</option></select>'
    + '<select id="aa-days" style="flex:0 0 auto"><option value="1">1 day</option><option value="7">7 days</option><option value="30" selected>30 days</option><option value="permanent">Permanent</option></select>'
    + '<button class="small primary" id="aa-grant">Grant</button></div>'
    + '<div class="status" id="aa-status"></div></div>'
}
// "Allow every item" already means every item, so the per-item picker has to
// show that. Leaving the boxes empty made an operator who ticked All items on the
// consent page read the empty list as "the grant was lost".
function agentPermAllow(agent) {
  return agent.allowAll === true ? knownItemNames() : (agent.allow || [])
}
// Per-agent MCP surface. Ticking nothing keeps the old behaviour (every tool),
// because an allowlist that starts empty would lock every existing agent out.
const MCP_TOOLS = [
  ['list_secrets', 'List items'],
  ['request_access', 'Request read access'],
  ['explain_access', 'Explain access'],
  ['get_secret', 'Read plaintext'],
  ['get_credential', 'Read login credential'],
  ['request_fill', 'Request web fill'],
  ['materialize', 'Write to local file'],
  ['materialize_redeem', 'Redeem write job'],
  ['request_credential', 'Create fill-in link'],
  ['put_secret', 'Write secret (needs approval)'],
  ['http_request', 'Proxied API call'],
]
function mcpToolFields(agent) {
  const chosen = new Set(Array.isArray(agent.tools) ? agent.tools : [])
  const boxes = MCP_TOOLS.map(([name, label]) =>
    '<label class="chk pick-row" style="display:flex;width:100%;margin:2px 0"><input type="checkbox" class="ma-tool" data-mcp-tool value="' + name + '"' + (chosen.has(name) ? ' checked' : '') + '> ' + esc(label) + ' <code class="hint" style="margin-left:6px">' + name + '</code></label>'
  ).join('')
  return '<label class="field">MCP tool permissions (none ticked = all allowed, as before)</label><div class="pick-box" style="max-height:170px;overflow:auto;border:1px solid var(--separator);border-radius:10px;padding:6px 8px;margin:4px 0 8px">' + boxes + '</div>'
}
function agentPermFields(agent) {
  return '<div class="hint" style="margin:2px 0 6px">The “requestable items” here only set the scope for skipping approval and auto-granting; any visible item can still be requested, and a person still approves it. This is not a grant: sharing or approving creates a specific <b>grant</b>, which you can see on the “Grants” page.</div>'
    + '<label class="field">No-approval scope (unticked items can still be requested, but each request needs approval)</label>' + pickListHtml('ma-allow', knownItemNames(), agentPermAllow(agent), 'The vault has no items yet.')
    + '<label class="field">Requestable groups (items in these groups are in scope)</label>' + pickListHtml('ma-groups', knownGroups(), agent.groups || [], 'No groups yet.')
    + mcpToolFields(agent)
    + agentActionFields(agent)
    + '<label class="chk" style="margin-top:8px"><input type="checkbox" id="ma-muted" ' + (agent.muted ? 'checked' : '') + '> Pause this Agent’s reads and requests (an admin can resume them)</label>'
}
// Wire the action-grant controls that agentPermFields renders. Shared by the
// token and OAuth dialogs so both can grant read/use/fill from one place.
function wireAgentActions(agentName) {
  const grant = $('aa-grant')
  if (!grant) return
  grant.onclick = async () => {
    const item = $('aa-item').value
    const action = $('aa-action').value
    const days = $('aa-days').value
    if (!item) return status('aa-status', 'No items to grant', true)
    try {
      status('aa-status', 'Granting…')
      // secret.fill only makes sense for a web credential with an origin; refuse
      // early with the reason instead of minting a grant that can never apply.
      if (action === 'secret.fill') {
        const fill = ((app.data && app.data.fillPolicies && app.data.fillPolicies.items) || []).find((entry) => entry.itemName === item)
        if (!fill || fill.kind !== 'web') return status('aa-status', '“' + item + '” is not a web item. Set it to web on the “Secrets” page and add its sites first', true)
        if (!(fill.origins || []).length) return status('aa-status', '“' + item + '” has no allowed sites yet', true)
      }
      const duration = days === 'permanent' ? 'permanent' : ({ '1': '1d', '7': '7d', '30': '30d' })[days] || '30d'
      await api('/api/action-grants', { method: 'POST', body: JSON.stringify({ agent: agentName, item, actions: [action], terms: { [action]: { duration } } }) })
      // Reading wants a plaintext policy too, or the grant still cannot read.
      if (action === 'secret.read') {
        await api('/api/fill/read-policy', { method: 'POST', body: JSON.stringify({ item, allow: true, ttlDays: days === 'permanent' ? 3650 : Number(days) }) }).catch(() => {})
      }
      await refreshAll()
      toast('Granted: ' + agentName + ' → ' + item + ' (' + action + ')')
      openAgentMenu(agentName)
    } catch (error) { status('aa-status', error.message, true) }
  }
  const picks = () => [...document.querySelectorAll('[data-aa-pick]')]
  const syncCount = () => {
    const count = picks().filter((box) => box.checked).length
    if ($('aa-count')) $('aa-count').textContent = count ? '' + count + ' selected' : 'None selected'
    if ($('aa-all')) $('aa-all').checked = count > 0 && count === picks().length
  }
  if ($('aa-all')) $('aa-all').onchange = () => { const all = $('aa-all').checked; for (const box of picks()) box.checked = all; syncCount() }
  for (const box of picks()) box.onchange = syncCount
  if ($('aa-revoke')) {
    $('aa-revoke').onclick = async () => {
      const chosen = picks().filter((box) => box.checked)
      if (!chosen.length) return status('aa-status', 'Select the grants to revoke first', true)
      const targets = chosen.filter((box) => box.dataset.itemId).map((box) => ({ itemId: box.dataset.itemId, action: box.dataset.action }))
      if (!targets.length) return status('aa-status', 'Item id not found. Refresh the page and try again', true)
      if (!(await askYes('Revoke the selected grants for “' + agentName + '” (' + targets.length + ')?'))) return
      try {
        const result = await api('/api/action-grants/revoke', { method: 'POST', body: JSON.stringify({ agent: agentName, targets }) })
        await refreshAll()
        toast('Grants revoked: ' + (result.count || targets.length) + '')
        openAgentMenu(agentName)
      } catch (error) { status('aa-status', error.message, true) }
    }
  }
  syncCount()
  for (const button of document.querySelectorAll('[data-revoke-action]')) {
    button.onclick = async () => {
      const item = button.dataset.item
      const action = button.dataset.action
      if (!(await askYes('Revoke the grant for “' + agentName + '” on “' + item + '” (' + action + ')?'))) return
      try {
        const items = app.items || []
        const found = items.find((entry) => entry.name === item)
        const itemId = found && found.id ? found.id : ''
        if (!itemId) return status('aa-status', 'Item id not found. Refresh the page and try again', true)
        await api('/api/action-grants/revoke', { method: 'POST', body: JSON.stringify({ agent: agentName, itemId, action }) })
        await refreshAll()
        toast('Revoked')
        openAgentMenu(agentName)
      } catch (error) { status('aa-status', error.message, true) }
    }
  }
}
async function openAgentMenu(name) {
  await ensureItems()
  const agent = app.data.agents.find((entry) => entry.name === name); if (!agent) return
  if (agent.oauth) {
    openModal('OAuth Agent “' + name + '”', '<div class="hint">Agent created by OAuth dynamic registration. Bound account: <code>' + esc(agent.account || '-') + '</code>. You can change its name, notes, permissions and write access; revoking OAuth access deletes its token.</div><label class="field">Name (identifier)</label><input id="ma-realname" value="' + esc(agent.name) + '"><label class="field">Display name</label><input id="ma-alias" value="' + esc(agent.alias || '') + '"><label class="field">Notes</label><input id="ma-note" value="' + esc(agent.note || '') + '">' + agentPermFields(agent) + '<label class="chk"><input type="checkbox" id="ma-allowall" ' + (agent.allowAll ? 'checked' : '') + '> Allow all items</label><label class="chk" style="margin-top:8px"><input type="checkbox" id="ma-write" ' + (agent.write ? 'checked' : '') + '> Allow writes (Agent write API /agent/items/save)</label><div class="row" style="margin-top:14px"><button class="primary" id="ma-save">Save</button><button class="danger" id="ma-oauth-revoke">Revoke OAuth access</button></div>')
    $('ma-save').onclick = () => saveAgentFromModal(name)
    wireAgentActions(name)
    $('ma-oauth-revoke').onclick = async () => { if (!(await askYes('Revoke ' + name + '’s OAuth token?'))) return; try { await api('/api/oauth/revoke', { method: 'POST', body: JSON.stringify({ agent: name }) }); show('modal', false); await refreshAll(); toast('Revoked') } catch (error) { toast(error.message, true) } }
    return
  }
  openModal('Agent “' + name + '”', '<div class="hint">Bound account: <code>' + esc(agent.account || 'Not bound (legacy data)') + '</code>. The Agent can only read this account; after switching accounts, an old Agent does not get access to the new account automatically.</div><label class="field">Name (identifier)</label><input id="ma-realname" value="' + esc(agent.name) + '"><label class="field">Display name</label><input id="ma-alias" value="' + esc(agent.alias || '') + '"><label class="field">Notes</label><input id="ma-note" value="' + esc(agent.note || '') + '">' + agentPermFields(agent) + '<label class="chk"><input type="checkbox" id="ma-allowall" ' + (agent.allowAll ? 'checked' : '') + '> Allow all items</label><label class="chk" style="margin-top:8px"><input type="checkbox" id="ma-write" ' + (agent.write ? 'checked' : '') + '> Allow writes (Agent write API /agent/items/save)</label><div class="row" style="margin-top:14px"><button class="primary" id="ma-save">Save permissions</button><button id="ma-copy">Copy token</button><button id="ma-rotate">Rotate token</button><button id="ma-extend">Extend grant</button><button class="danger" id="ma-delete">Delete</button></div><div class="secret hidden" id="ma-token"></div>')
  $('ma-save').onclick = () => saveAgentFromModal(name)
  wireAgentActions(name)
  $('ma-extend').onclick = () => openExtendMenu(name)
  $('ma-copy').onclick = async () => { try { const data = await api('/api/agents/token', { method: 'POST', body: JSON.stringify({ name }) }); $('ma-token').textContent = data.token; $('ma-token').classList.remove('hidden'); await navigator.clipboard.writeText(data.token); toast('Copied the token') } catch (error) { toast(error.message, true) } }
  $('ma-rotate').onclick = async () => { if (!(await askYes('Rotate ' + name + '’s token? The old token stops working immediately.'))) return; try { const data = await api('/api/agents/rotate', { method: 'POST', body: JSON.stringify({ name }) }); $('ma-token').textContent = data.token; $('ma-token').classList.remove('hidden'); await navigator.clipboard.writeText(data.token); await refreshAll(); toast('Rotated and copied the new token') } catch (error) { toast(error.message, true) } }
  $('ma-delete').onclick = async () => { if (!(await askYes('Delete Agent ' + name + '?'))) return; try { await api('/api/agents/delete', { method: 'POST', body: JSON.stringify({ name }) }); show('modal', false); await refreshAll(); toast('Deleted') } catch (error) { toast(error.message, true) } }
}
async function openGrantMenu(agent, name) {
  const grant = (app.data.grants || []).find((entry) => entry.agent === agent && entry.name === name); if (!grant) return
  const seconds = !grant.expiresAt ? 0 : Math.max(0, Math.round((grant.expiresAt - Date.now()) / 1000))
  const nearest = !grant.expiresAt ? 0 : ([3600, 86400, 604800, 2592000].find((value) => seconds <= value) || 0)
  // The state slice only carries the newest 20 rows for the whole vault; one
  // grant's own usage history has to come from the paged trail or it reads as
  // empty for anything that is not the latest activity.
  let usage = (app.data.audit || []).filter((entry) => entry.agent === agent && entry.name === name).slice(0, 15)
  try { const data = await auditPage({ agent, item: name, limit: 15 }); usage = data.entries || usage } catch {}
  const usageHtml = '<div class="hint" style="margin-bottom:8px">Created: ' + (grant.createdAt ? new Date(grant.createdAt).toLocaleString('en-GB', { hour12: false }) : '-') + ' · Reads: ' + (grant.reads ?? 0) + ' · Expires: ' + (grant.expiresAt ? new Date(grant.expiresAt).toLocaleString('en-GB', { hour12: false }) : 'Permanent') + '</div><div style="border:1px solid var(--line);border-radius:10px;padding:10px;margin-bottom:12px"><b>Usage</b>' + (usage.length ? '<table><tr><th>Time</th><th>Action</th><th>Method</th></tr>' + usage.map((entry) => '<tr><td>' + esc(entry.time ? new Date(entry.time).toLocaleString('en-GB', { hour12: false }) : '') + '</td><td>' + esc(describeEvent(entry)) + '</td><td>' + esc(entry.mode || entry.source || '') + '</td></tr>').join('') + '</table>' : '<div class="hint">No records yet</div>') + '</div>'
  openModal('Grant “' + agent + ' → ' + name + '”', usageHtml + '<label class="field">Duration</label><select id="mg-seconds"><option value="3600" ' + (nearest === 3600 ? 'selected' : '') + '>1 hour</option><option value="86400" ' + (nearest === 86400 ? 'selected' : '') + '>24 hours</option><option value="604800" ' + (nearest === 604800 ? 'selected' : '') + '>7 days</option><option value="2592000" ' + (nearest === 2592000 ? 'selected' : '') + '>30 days</option><option value="0" ' + (nearest === 0 ? 'selected' : '') + '>Permanent</option></select><label class="field">Max reads (leave empty for no limit)</label><input id="mg-max" type="number" min="1" value="' + (grant.maxReads ?? '') + '"><div class="row" style="margin-top:14px"><button class="primary" id="mg-save">Save grant</button>' + (grant.revokedAt || (grant.expiresAt && grant.expiresAt <= Date.now()) || (grant.maxReads && (grant.reads ?? 0) >= grant.maxReads) ? '<button id="mg-restore">Restore grant</button>' : '') + '<button class="danger" id="mg-revoke">Revoke</button><button class="danger" id="mg-delete">Delete record</button></div>')
  $('mg-save').onclick = async () => { try { await api('/api/grants/update', { method: 'POST', body: JSON.stringify({ agent, name, seconds: Number($('mg-seconds').value), maxReads: $('mg-max').value || null }) }); show('modal', false); await refreshAll(); toast('Grant updated') } catch (error) { toast(error.message, true) } }
  if ($('mg-restore')) $('mg-restore').onclick = async () => { try { await api('/api/grants/restore', { method: 'POST', body: JSON.stringify({ agent, name, seconds: Number($('mg-seconds').value) }) }); show('modal', false); await refreshAll(); toast('Grant restored') } catch (error) { toast(error.message, true) } }
  $('mg-revoke').onclick = async () => { try { await api('/api/grants/revoke', { method: 'POST', body: JSON.stringify({ agent, name }) }); show('modal', false); await refreshAll(); toast('Revoked') } catch (error) { toast(error.message, true) } }
  $('mg-delete').onclick = async () => { if (!(await askYes('Delete this grant record?'))) return; try { await api('/api/grants/delete', { method: 'POST', body: JSON.stringify({ agent, name }) }); show('modal', false); await refreshAll(); toast('Deleted') } catch (error) { toast(error.message, true) } }
}
async function loadProfile() {
  try {
    const data = await api('/api/profile'); const profile = data.profile || {}
    $('profile-name').value = profile.name || ''; $('profile-email').value = profile.email || profile.oidcEmail || ''; $('profile-avatar').value = profile.avatarUrl || ''
    // Login history is asked for explicitly instead of filtered out of the
    // 20-row state slice: a week of other activity would otherwise hide every
    // login, and the panel would claim there were none.
    let logins = (app.data.audit || []).filter((entry) => ['admin.login', 'admin.oidc-login', 'vault.unlock', 'admin.logout'].includes(entry.event)).slice(0, 12)
    try {
      const trail = await auditPage({ event: 'login', limit: 50 })
      logins = (trail.entries || []).filter((entry) => ['admin.login', 'admin.oidc-login', 'vault.unlock', 'admin.logout'].includes(entry.event)).slice(0, 12)
    } catch {}
    $('login-history').innerHTML = '<div class="hint">Online now: ' + (app.me?.unlocked ? 'this browser is unlocked' : 'this browser is locked') + '</div>' + (logins.length ? '<table><tr><th>Time</th><th>Event</th><th>Method</th></tr>' + logins.map((entry) => '<tr><td>' + esc(entry.time ? new Date(entry.time).toLocaleString('en-GB', { hour12: false }) : '') + '</td><td>' + esc(entry.event) + '</td><td>' + esc(entry.source || entry.channel || '') + '</td></tr>').join('') + '</table>' : '<div class="hint">No logins yet</div>')
    try {
      const data = await api('/api/sessions')
      const sessions = data.sessions || []
      $('sessions-box').innerHTML = sessions.length ? '<table><tr><th>Client</th><th>IP</th><th>Created</th><th>Last active</th><th>Actions</th></tr>' + sessions.map((session) => '<tr><td class="hint" title="' + esc(session.ua || '') + '">' + esc(uaLabel(session.ua)) + (session.current ? ' <b>(current)</b>' : '') + '</td><td class="hint">' + esc(session.ip || '-') + '</td><td class="hint">' + esc(session.createdAt ? new Date(session.createdAt).toLocaleString('en-GB', { hour12: false }) : '-') + '</td><td class="hint">' + esc(session.lastSeen ? new Date(session.lastSeen).toLocaleString('en-GB', { hour12: false }) : '-') + '</td><td>' + (session.current ? '' : '<button class="small danger" data-revoke-session="' + esc(session.id) + '">Sign out</button>') + '</td></tr>').join('') + '</table>' : '<div class="hint">No sessions to manage (older login, or not recorded by the server)</div>'
    } catch {} 
    renderAvatar(profile.name || profile.oidcName || profile.email || profile.oidcEmail, profile.avatarUrl)
    $('who').textContent = profile.name || profile.oidcName || profile.email || profile.oidcEmail || $('who').textContent
    // Every provider is listed on its own, with its own bind and unbind.
    const providerRows = []
    for (const provider of data.oidcProviders || []) {
      const binding = data.oidcBindings ? data.oidcBindings[provider.id] : null
      providerRows.push('<div class="row" style="justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--line)">')
      providerRows.push('<div><b>' + esc(provider.label || provider.id) + '</b> <span class="hint">' + esc(provider.issuer || '') + '</span>')
      if (binding) providerRows.push('<br><span class="hint">Linked: <code>' + esc(binding.email || binding.sub) + '</code></span>')
      providerRows.push('</div><div>')
      if (!binding) providerRows.push('<a class="link-button primary" href="/oidc/login?provider=' + encodeURIComponent(provider.id) + '&next=profile&prompt=login">Link</a>')
      else providerRows.push('<button class="danger" data-oidc-unbind="' + esc(provider.id) + '">Unlink</button>')
      providerRows.push('</div></div>')
    }
    const oidc = data.oidcEnabled
      ? '<div class="hint">You can link several identity providers and link or unlink each one separately. Once you unlock the vault with the master password, OIDC login unlocks it automatically; clicking “Lock” turns this off. Older links did not record their account; link again to enable this.</div>' + (providerRows.join('') || '<div class="hint">No identity providers available yet.</div>')
      : '<div class="hint">OIDC is not configured. Add an identity provider in “Settings” first.</div>'
    $('oidc-box').innerHTML = oidc
    for (const button of $('oidc-box').querySelectorAll('[data-oidc-unbind]')) button.onclick = async () => {
      const id = button.getAttribute('data-oidc-unbind')
      if (!(await askYes('Unlink this identity provider? It will be linked again at your next login.'))) return
      try { await api('/api/profile/oidc/bindings', { method: 'DELETE', body: JSON.stringify({ id }) }); await loadProfile(); toast('Unlinked') } catch (error) { status('oidc-status', error.message, 'error') }
    }
    await loadSecurity()
  } catch (error) { status('profile-status', error.message, 'error') }
}
async function saveProfile() { try { const name = $('profile-name').value.trim(); const email = $('profile-email').value.trim(); const avatarUrl = $('profile-avatar').value.trim(); await api('/api/profile', { method: 'POST', body: JSON.stringify({ name, email, avatarUrl }) }); status('profile-status', 'Saved', 'ok'); $('who').textContent = name || email.split('@')[0] || $('who').textContent; renderAvatar(name || email, avatarUrl) } catch (error) { status('profile-status', error.message, 'error') } }
async function switchAccount() { const email = $('vault-email').value; if (!email) return; if (!(await askYes('Switch to ' + email + '? The current unlocked session will be cleared, and you will need that account’s master password to unlock again.'))) return; try { status('settings-status', 'Switching…'); await api('/api/settings', { method: 'POST', body: JSON.stringify({ vaultEmail: email }) }); status('settings-status', 'Switched. Please unlock again', 'ok'); await boot() } catch (error) { status('settings-status', error.message, 'error') } }
async function saveFolder() { const folder = $('vault-folder').value; try { status('vault-folder-status', 'Saving…'); await api('/api/settings', { method: 'POST', body: JSON.stringify({ vaultFolder: folder }) }); status('vault-folder-status', folder ? 'Saved. Reading only: ' + folder : 'Saved. Reading all folders', 'ok'); await Promise.all([loadItems(), loadSettings()]) } catch (error) { status('vault-folder-status', error.message, 'error') } }
async function loadSecurity() {
  try {
    const data = await api('/api/security'); $('password-source').textContent = data.passwordSource === 'custom' ? 'Using a custom password (stored in the Durable Object)' : 'Using the ADMIN_PASSWORD environment variable; changing it saves a custom password'
    $('totp-status').textContent = data.totpEnabled ? 'Two-factor authentication enabled' : 'Not enabled'
    $('totp-disable').classList.toggle('hidden', !data.totpEnabled)
    const settings = await api('/api/settings').catch(() => ({}))
    $('mat-paths').value = (settings.materializePaths ?? []).join('\n')
    $('bs-web').checked = settings.webPlaintext === true
    $('bs-unclassified').checked = settings.unclassifiedPlaintext === true
    $('bs-target').checked = settings.useAnyTarget === true
    $('bs-expiry').checked = settings.expiryBlocksReads === true
    // The health card is rendered before this panel is opened, so the threshold
    // has to live somewhere both of them read.
    app.rotateReminderDays = Math.max(30, Math.min(3650, Number(settings.rotateReminderDays) || 180))
    $('bs-rotate-days').value = String(app.rotateReminderDays)
  } catch (error) { status('profile-status', error.message, 'error') }
}
async function changePassword() { try { await api('/api/security/password', { method: 'POST', body: JSON.stringify({ currentPassword: $('current-password').value, newPassword: $('new-password').value }) }); $('current-password').value = ''; $('new-password').value = ''; status('password-status', 'Password changed', 'ok'); await loadSecurity() } catch (error) { status('password-status', error.message, 'error') } }
async function setup2fa() { try { const data = await api('/api/2fa/setup', { method: 'POST' }); $('totp-secret').textContent = data.secret; $('totp-setup-box').classList.remove('hidden'); status('totp-message', 'Add the secret to your authenticator app, then enter the code', 'ok') } catch (error) { status('totp-message', error.message, 'error') } }
async function enable2fa() { try { await api('/api/2fa/enable', { method: 'POST', body: JSON.stringify({ code: $('totp-enable-code').value }) }); $('totp-setup-box').classList.add('hidden'); $('totp-enable-code').value = ''; status('totp-message', 'Two-factor authentication enabled', 'ok'); await loadSecurity() } catch (error) { status('totp-message', error.message, 'error') } }
async function disable2fa() {
  // prompt() is silently refused inside the desktop WebView, so “Disable 2FA” did
  // nothing there. The in-page field keeps the same one-field flow; an empty or
  // cancelled answer sends no request at all.
  const password = await askCode('Turning off two-factor authentication makes the account less secure. Enter your current console password to continue.', { type: 'password', inputmode: 'text', placeholder: 'Current console password', maxlength: 0, label: 'Current console password', trim: false })
  if (!password) return
  try { await api('/api/2fa/disable', { method: 'POST', body: JSON.stringify({ password }) }); status('totp-message', 'Two-factor authentication turned off', 'ok'); await loadSecurity() } catch (error) { status('totp-message', error.message, 'error') }
}
// Replaced by the create modal (openAgentCreate). Kept as a thin alias so any
// stale inline handler still works.
async function createAgent() { openAgentCreate() }
boot()
loadVersion()
</script></body></html>`
