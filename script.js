document.addEventListener("DOMContentLoaded",()=>{const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const intro=$("#intro"),audio=$("#audio"),wave=$("#wave"),volume=$("#volumeSlider"),volumeToggle=$("#volumeToggle");
let entered=false;
function enter(){if(entered)return;entered=true;intro?.classList.add("hide");document.body.classList.remove("locked");audio?.play().catch(()=>{});wave?.classList.remove("paused")}
intro?.addEventListener("click",enter);intro?.addEventListener("pointerup",enter);intro?.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();enter()}});
const clock=$("#clock");setInterval(()=>{if(clock)clock.textContent=new Date().toLocaleTimeString([], {hour12:false})},1000);
if(volume&&audio){audio.volume=.42;volume.addEventListener("input",()=>{audio.volume=Number(volume.value)/100;volumeToggle.textContent=audio.volume===0?"○":"◖"});volumeToggle?.addEventListener("click",()=>{audio.muted=!audio.muted;volumeToggle.textContent=audio.muted?"○":"◖";volumeToggle.setAttribute("aria-label",audio.muted?"Unmute music":"Mute music")})}
audio?.addEventListener("ended",()=>wave?.classList.add("paused"));audio?.addEventListener("play",()=>wave?.classList.remove("paused"));audio?.addEventListener("pause",()=>wave?.classList.add("paused"));
audio?.addEventListener("timeupdate",()=>{const t=$("#musicTime");if(t){let s=Math.floor(audio.currentTime),m=Math.floor(s/60),r=s%60;t.textContent=String(m).padStart(2,"0")+":"+String(r).padStart(2,"0")}});
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.08});$$(".reveal").forEach((el,i)=>{el.style.setProperty("--delay",Math.min(i*45,250)+"ms");observer.observe(el)});
if(matchMedia("(pointer:fine)").matches){const dot=$(".cursor-dot"),ring=$(".cursor-ring"),glow=$(".cursor-glow");let x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;addEventListener("mousemove",e=>{x=e.clientX;y=e.clientY;dot.style.left=x+"px";dot.style.top=y+"px";glow.style.left=x+"px";glow.style.top=y+"px"});(function loop(){rx+=(x-rx)*.14;ry+=(y-ry)*.14;ring.style.left=rx+"px";ring.style.top=ry+"px";requestAnimationFrame(loop)})();$$(".magnetic").forEach(el=>{el.addEventListener("mousemove",e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.06}px,${(e.clientY-r.top-r.height/2)*.06}px)`});el.addEventListener("mouseleave",()=>el.style.transform="")})}
const avatar=$("#avatarWrap");if(avatar&&matchMedia("(pointer:fine)").matches){avatar.addEventListener("mousemove",e=>{const r=avatar.getBoundingClientRect();avatar.style.transform=`perspective(800px) rotateX(${(e.clientY-r.top-r.height/2)*-.08}deg) rotateY(${(e.clientX-r.left-r.width/2)*.08}deg)`});avatar.addEventListener("mouseleave",()=>avatar.style.transform="")}
const show=$("#showcase"),open=$("#openShowcase"),close=$("#closeShowcase");function openShow(){show.classList.add("open");show.setAttribute("aria-hidden","false");document.body.classList.add("locked")}function closeShow(){show.classList.remove("open");show.setAttribute("aria-hidden","true");document.body.classList.remove("locked")}open?.addEventListener("click",openShow);close?.addEventListener("click",closeShow);$(".showcase-backdrop")?.addEventListener("click",closeShow);addEventListener("keydown",e=>{if(e.key==="Escape")closeShow()});
const tabs=$$(".tab"),panels=$$(".panel");tabs.forEach(t=>t.addEventListener("click",()=>{tabs.forEach(x=>x.classList.toggle("active",x===t));panels.forEach(p=>p.classList.toggle("active",p.dataset.panel===t.dataset.tab))}));
const moduleData={"modules":[["Triggerbot",["Crit cooldown","Attack delay","Item whitelist","Attack shields","Click simulation"]],["Shield Breaker",["Stun","Swap back","Swap back delay 1–5","Break bind","Editable bind"]],["Aim Assist",["Horizontal 1–10","Vertical 1–10","FOV 30–120","Item whitelist","Smooth / Windmouse"]],["Sprint Reset",["W tap / S tap / Sneak / Balanced","Chance 1–100","Math option"]],["Jump Reset",["Chance 1–100","Click simulation","Legit / Closet"]]],"crystal":[["Auto Anchor",["Aim Assist","Anchor key","Glowstone key","Totem key","Explode","Activation key"]],["Safe Anchor",["Delay 1–5","Return","Anchor key","Glowstone key","Totem key","Activation key"]],["Auto Crystal",["Delay 1–10","Activation key","Stop on kill"]],["Auto Totem",["Delay 1–20","Totem key","Only when inventory open","Auto close","Hover / Legit"]]],"macros":[["Key Xbow",["Activation key","Delay 1–5"]],["Key Cart",["Activation key","Delay 1–5"]],["Spear Lunge",["Activation key","Swap back","Swap back key","Delay 1–3"]],["Pearl Catch",["Activation key","Randomize","Pearl key","Wind charge key"]],["KeyPot",["Activation key","Delay 1–10","Auto Refill ShiftLMB"]],["KeyLava",["Only On Web","Target Water","Delay 1–5"]]]};
const mods=$(".module"),count=$("#activeCount"),detail=$("#moduleDetail"),detailTitle=$("#detailTitle"),detailOptions=$("#detailOptions"),closeDetail=$("#closeDetail");
function update(){if(count)count.textContent=mods.filter(m=>m.classList.contains("is-on")).length}
function openModule(m){
 const name=m.dataset.module;
 const row=Object.values(moduleData).flat().find(x=>x[0]===name);
 m.classList.toggle("is-on");
 const toggle=m.querySelector("i");
 toggle?.classList.toggle("on",m.classList.contains("is-on"));
 update();
 if(row&&detail){
   detailTitle.textContent=row[0];
   detailOptions.className="detail-options";
   detailOptions.innerHTML=row[1].map(opt=>'<label class="detail-option"><span>'+opt+'</span><span>PREVIEW</span></label>').join("");
   detail.classList.add("open");
   detail.setAttribute("aria-hidden","false");
 }
}
mods.forEach(m=>m.addEventListener("pointerup",e=>{if(e.button===0){e.preventDefault();openModule(m)}}));
mods.forEach(m=>m.addEventListener("click",e=>e.preventDefault()));
closeDetail?.addEventListener("click",()=>{detail.classList.remove("open");detail.setAttribute("aria-hidden","true")});
update();if(row){detailTitle.textContent=row[0];detailOptions.className="detail-options";detailOptions.innerHTML=row[1].map(opt=>{const slider=/1–(\\d+)|30–120/.test(opt);return '<label class="detail-option"><span>'+opt+'</span><span>'+(slider?"UI CONTROL":"PREVIEW")+(slider?" · 5":"")+'</span></label>'}).join("");detail.classList.add("open");detail.setAttribute("aria-hidden","false")}}));
closeDetail?.addEventListener("click",()=>{detail.classList.remove("open");detail.setAttribute("aria-hidden","true")});update();
$("#resetClient")?.addEventListener("click",()=>{mods.forEach((m,i)=>m.querySelector("i")?.classList.toggle("on",i<2));update()});
$("#viewMore")?.addEventListener("click",e=>e.currentTarget.textContent=e.currentTarget.textContent.includes("PREVIEW")?"ACTIVE ✓":"PREVIEW ↗");
const key=$("#configKey"),status=$("#configStatus");$("#saveConfig")?.addEventListener("click",()=>{const name=$("#configName").value||"My Config";localStorage.setItem("nxr-config",JSON.stringify({name,active:mods.map(m=>m.querySelector("i")?.classList.contains("on"))}));status.textContent="SAVED LOCALLY";key.textContent="NXR-"+Math.random().toString(36).slice(2,6).toUpperCase()+"-"+Math.random().toString(36).slice(2,6).toUpperCase()});$("#copyKey")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(key.textContent);status.textContent="KEY COPIED"}catch{status.textContent="COPY UNAVAILABLE"}});
$$('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{const t=$(a.getAttribute("href"));if(t){e.preventDefault();t.scrollIntoView({behavior:"smooth"})}}));
});