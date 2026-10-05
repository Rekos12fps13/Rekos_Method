const $ = (s) => document.querySelector(s);
const fileInput = $("#file"), processBtn = $("#process"), statusEl=$("#status");
const bar=$("#bar"), meta=$("#meta"), download=$("#download"), badge=$("#codecBadge");
let selected = null, preparedUrl = null, encoderFrame = null;

function fmtBytes(n){const u=["B","KB","MB","GB"];let i=0;while(n>=1024&&i<3){n/=1024;i++}return `${n.toFixed(i?1:0)} ${u[i]}`}
function setStatus(t, cls=""){statusEl.textContent=t;statusEl.className="status "+cls}
function resetDownload(){if(preparedUrl)URL.revokeObjectURL(preparedUrl);preparedUrl=null;download.style.display="none";download.removeAttribute("href")}

async function inspect(file){
  return new Promise(resolve=>{
    const v=document.createElement("video"); const u=URL.createObjectURL(file);
    v.preload="metadata"; v.onloadedmetadata=()=>{const fps=v.duration?null:null; URL.revokeObjectURL(u); resolve({w:v.videoWidth,h:v.videoHeight,d:v.duration})};
    v.onerror=()=>{URL.revokeObjectURL(u);resolve({})}; v.src=u;
  });
}
fileInput.addEventListener("change", async ()=>{
  selected=fileInput.files?.[0]||null; resetDownload();
  if(!selected){processBtn.disabled=true;return}
  const m=await inspect(selected);
  meta.textContent=`${selected.name} • ${fmtBytes(selected.size)}${m.w?` • ${m.w}×${m.h} • ${m.d.toFixed(1)}s`:""}`;
  badge.textContent=(m.w<=1920&&m.h<=1080)?"READY":"CHECK";
  setStatus(m.w>1920||m.h>1080?"Source is above the 1080p workflow ceiling; no up/downscale will be forced.":"Ready for local preparation.","ok");
  processBtn.disabled=false;
});

function ensureFrame(){
  if(encoderFrame) return encoderFrame;
  encoderFrame=document.createElement("iframe");
  encoderFrame.src=chrome.runtime.getURL("encoder/encoder-frame.html");
  encoderFrame.style.display="none";
  document.documentElement.appendChild(encoderFrame);
  return encoderFrame;
}
function processFile(file){
  return new Promise(async (resolve,reject)=>{
    const frame=ensureFrame();
    let done=false;
    const cleanup=()=>window.removeEventListener("message",onMessage);
    const onMessage=(e)=>{
      const m=e.data;if(!m||typeof m!=="object")return;
      if(m.type==="ENCODE_PROGRESS"){bar.style.width=`${Math.round(m.ratio*100)}%`;setStatus(`Preparing locally… ${Math.round(m.ratio*100)}%`)}
      if(m.type==="ENCODE_STAGE")setStatus(`Preparing locally… ${m.stage}`);
      if(m.type==="ENCODE_ERROR"){done=true;cleanup();reject(new Error(m.message))}
      if(m.type==="ENCODE_DONE"&&m.arrayBuffer){done=true;cleanup();resolve(new Blob([m.arrayBuffer],{type:m.mimeType||"video/mp4"}))}
    };
    window.addEventListener("message",onMessage);
    const ab=await file.arrayBuffer();
    frame.contentWindow.postMessage({type:"ENCODE_START",ab,fileName:file.name}, "*",[ab]);
    setTimeout(()=>{if(!done){cleanup();reject(new Error("Encoder timed out."))}},180000);
  });
}
processBtn.addEventListener("click",async()=>{
  if(!selected)return;
  processBtn.disabled=true; bar.style.width="0%"; resetDownload(); badge.textContent="WORKING";
  try{
    const blob=await processFile(selected);
    preparedUrl=URL.createObjectURL(blob);
    const base=selected.name.replace(/\.[^/.]+$/,"");
    download.href=preparedUrl;download.download=`${base}-Rekos-HD.mp4`;download.textContent=`Download prepared video • ${fmtBytes(blob.size)}`;download.style.display="flex";
    bar.style.width="100%";badge.textContent="DONE";setStatus("Prepared locally. Upload the downloaded file to TikTok Studio.","ok");
  }catch(e){badge.textContent="ERROR";setStatus(e.message||String(e),"warn")}
  finally{processBtn.disabled=false}
});
$("#login").onclick=()=>chrome.tabs.create({url:"https://www.tiktok.com/login"});
$("#upload").onclick=()=>chrome.tabs.create({url:"https://www.tiktok.com/tiktokstudio/upload?from=webapp&lang=en&tab=video"});
$("#watermark").addEventListener("change",e=>chrome.storage.local.set({watermark:e.target.checked}));
$("#repost").addEventListener("change",e=>chrome.storage.local.set({repostHelper:e.target.checked}));
chrome.storage.local.get(["watermark","repostHelper"],s=>{$("#watermark").checked=!!s.watermark;$("#repost").checked=s.repostHelper!==false});
