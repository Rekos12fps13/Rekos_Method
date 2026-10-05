(() => {
  if (window.top !== window) return;
  const ID="rekos-hd-panel";
  const mount=()=>{
    if(document.getElementById(ID))return;
    if(!/tiktok\.com$/i.test(location.hostname) && !/\.tiktok\.com$/i.test(location.hostname))return;
    const wrap=document.createElement("div");wrap.id=ID;
    wrap.style.cssText="position:fixed;right:18px;bottom:18px;z-index:2147483647;background:#111;color:#fff;border:1px solid #333;border-radius:14px;padding:12px;width:250px;font:13px system-ui;box-shadow:0 12px 40px #0008";
    wrap.innerHTML='<div style="font-weight:700">Rekos HD Uploader</div><div style="color:#aaa;margin:4px 0 10px">Use local preparation before uploading.</div><button id="rekos-open" style="width:100%;padding:8px;border:0;border-radius:9px;background:#fe2c55;color:#fff;font-weight:700;cursor:pointer">Open extension</button><div id="rekos-note" style="font-size:11px;color:#888;margin-top:7px">Native TikTok controls remain unchanged.</div>';
    document.body.appendChild(wrap);
    wrap.querySelector("#rekos-open").onclick=()=>window.open(chrome.runtime.getURL("index.html"),"_blank");
  };
  const observer=new MutationObserver(()=>mount());observer.observe(document.documentElement,{childList:true,subtree:true});setTimeout(mount,1500);
})();