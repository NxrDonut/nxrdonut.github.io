document.addEventListener("DOMContentLoaded",function(){
  const qs=(s)=>document.querySelector(s);
  const qsa=(s)=>Array.from(document.querySelectorAll(s));

  const intro=qs("#intro");
  const setup=qs("#setupModal");
  const audio=qs("#audio");
  const wave=qs("#wave");
  const volumeSlider=qs("#volumeSlider");
  const setupVolume=qs("#setupVolume");
  const volumeToggle=qs("#volumeToggle");
  const back=qs("#musicBack");
  const pause=qs("#musicPause");
  const skip=qs("#musicSkip");
  const compareTimezone=qs("#compareTimezone");
  const cursorSelect=qs("#cursorSelect");
  const fullscreenToggle=qs("#fullscreenToggle");

  const tracks=[
    ["Hoes Come Easy","FOREVER$TRONG"],
    ["National Treasures","DRAKE"],
    ["Low Life","FUTURE"],
    ["Love Sosa","CHIEF KEEF"],
    ["Stay Schemin","RICK ROSS"],
    ["2055","SLEEPY HALLOW"],
    ["Skin","OTUKA"]
  ].map(function(x,i){
    return {src:"./music/song"+(i+1)+".mp3",title:x[0],artist:x[1]};
  });

  let entered=false;
  let index=0;
  let theme="matte";
  let glow="MEDIUM";
  let cursor="classic";
  let backTimer=null;
  const localTimezone=Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  function recordView(){
    try{
      if(sessionStorage.getItem("nxr-view-recorded")) return;
      sessionStorage.setItem("nxr-view-recorded","1");
      const key="nxr-view-count";
      const count=Number(localStorage.getItem(key)||2991)+1;
      localStorage.setItem(key,String(count));
      const view=qs("#viewCount");
      if(view) view.textContent=count.toLocaleString();
    }catch(e){}
  }

  function apply(){
    const body=document.body;
    body.className=body.className.replace(/theme-[A-Za-z0-9_-]+|no-motion|no-led/g,"").replace(/\\s+/g," ").trim()+" theme-"+theme;
    body.dataset.glow=glow;
    body.dataset.cursor=cursor;
    qsa("[data-theme]").forEach(function(button){
      button.classList.toggle("selected",button.dataset.theme===theme);
    });
    const glowSelect=qs("#glowSelect");
    if(glowSelect) glowSelect.value=glow;
    if(cursorSelect) cursorSelect.value=cursor;
  }

  function render(){
    const track=tracks[index];
    const title=qs("#musicTitle");
    const number=qs("#trackNumber");
    if(title) title.innerHTML=track.title+" <i>· "+track.artist+"</i>";
    if(number) number.textContent=String(index+1).padStart(2,"0")+" / 07";
    qsa(".track-choice").forEach(function(button,i){
      button.classList.toggle("selected",i===index);
    });
    if(audio){
      audio.src=track.src;
      audio.load();
      if(pause) pause.textContent="▶";
    }
  }

  function buildTracks(){
    const box=qs("#trackChoices");
    if(!box) return;
    box.innerHTML=tracks.map(function(track,i){
      return '<button class="track-choice" type="button" data-i="'+i+'"><span class="track-num">'+String(i+1).padStart(2,"0")+'</span><span><strong>'+track.title+'</strong><small>'+track.artist+'</small></span><b>›</b></button>';
    }).join("");
    box.addEventListener("click",function(event){
      const button=event.target.closest(".track-choice");
      if(!button) return;
      index=Number(button.dataset.i)||0;
      render();
    });
  }

  function openSetup(){
    if(entered || !setup) return;
    render();
    apply();
    setup.classList.add("open");
    setup.setAttribute("aria-hidden","false");
  }

  function closeSetup(){
    if(!setup) return;
    setup.classList.remove("open");
    setup.setAttribute("aria-hidden","true");
  }

  function formatTime(timezone){
    try{
      return new Intl.DateTimeFormat([],{
        timeZone:timezone,
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit",
        hour12:false
      }).format(new Date());
    }catch(e){
      return "--:--:--";
    }
  }

  function offsetMinutes(timezone,date){
    const d=date||new Date();
    try{
      const parts=new Intl.DateTimeFormat("en-US",{
        timeZone:timezone,
        timeZoneName:"longOffset",
        hour:"2-digit",
        minute:"2-digit",
        hourCycle:"h23"
      }).formatToParts(d);
      const raw=(parts.find(function(part){return part.type==="timeZoneName";})||{}).value||"GMT";
      const match=raw.match(/GMT([+-])(\\d{1,2})(?::(\\d{2}))?/);
      if(!match) return 0;
      const minutes=(Number(match[2])*60)+Number(match[3]||0);
      return match[1]==="-" ? -minutes : minutes;
    }catch(e){
      return 0;
    }
  }

  function timezoneLabel(zone){
    return String(zone||"UTC").replace(/^.*\\//,"").replace(/_/g," ");
  }

  function updateSetupTimezone(){
    const local=qs("#localTimezone");
    const diff=qs("#timezoneDifference");
    const time=qs("#compareTime");

    if(local) local.textContent=timezoneLabel(localTimezone);
    if(!compareTimezone || !diff || !time) return;

    const target=compareTimezone.value;
    const minutes=offsetMinutes(target)-offsetMinutes(localTimezone);
    const sign=minutes>0?"+":minutes<0?"−":"";
    const abs=Math.abs(minutes);
    const hours=Math.floor(abs/60);
    const mins=abs%60;

    diff.textContent=minutes===0
      ? "SAME TIME"
      : sign+hours+"H"+(mins?String(mins).padStart(2,"0")+"M":"")+" VS YOU";
    time.textContent=formatTime(target);
  }

  function updateWorldClock(){
    const localName=qs("#worldLocalName");
    const localTime=qs("#worldLocalTime");

    if(localName) localName.textContent=timezoneLabel(localTimezone);
    if(localTime) localTime.textContent=formatTime(localTimezone);

    qsa("[data-zone-time]").forEach(function(el){
      el.textContent=formatTime(el.dataset.zoneTime);
    });

    const now=new Date();
    qsa("[data-zone-diff]").forEach(function(el){
      const minutes=offsetMinutes(el.dataset.zoneDiff,now)-offsetMinutes(localTimezone,now);
      const sign=minutes>0?"+":minutes<0?"−":"";
      const abs=Math.abs(minutes);
      const hours=Math.floor(abs/60);
      const mins=abs%60;
      el.textContent=minutes===0
        ? "SAME TIME"
        : sign+hours+"H"+(mins?String(mins).padStart(2,"0")+"M":"")+" VS YOU";
    });

    updateSetupTimezone();
  }

  function setVolume(value){
    const percent=Math.max(0,Math.min(100,Number(value)||0));
    if(audio) audio.volume=percent/100;
    if(volumeSlider){
      volumeSlider.value=String(percent);
      volumeSlider.style.setProperty("--volume",percent+"%");
    }
    if(setupVolume) setupVolume.value=String(percent);
    const mainValue=qs("#volumeValue");
    const setupValue=qs("#setupVolumeValue");
    if(mainValue) mainValue.textContent=percent+"%";
    if(setupValue) setupValue.textContent=percent+"%";
  }

  function enter(){
    if(entered || !intro) return;
    entered=true;
    recordView();
    closeSetup();
    intro.classList.add("hide");
    document.body.classList.remove("locked");
    apply();
    setVolume(setupVolume ? setupVolume.value : (volumeSlider ? volumeSlider.value : 42));
    if(audio) audio.play().catch(function(){});
    if(wave) wave.classList.remove("paused");
  }

  if(intro){
    intro.addEventListener("click",openSetup);
    intro.addEventListener("keydown",function(event){
      if(event.key==="Enter" || event.key===" "){
        event.preventDefault();
        openSetup();
      }
    });
  }

  const enterButton=qs("#enterExperience");
  const closeButton=qs("#closeSetup");
  const backdrop=qs(".setup-backdrop");
  if(enterButton) enterButton.addEventListener("click",enter);
  if(closeButton) closeButton.addEventListener("click",closeSetup);
  if(backdrop) backdrop.addEventListener("click",closeSetup);

  const nextTrack=qs("#nextTrack");
  const prevTrack=qs("#prevTrack");
  if(nextTrack) nextTrack.addEventListener("click",function(){
    index=(index+1)%tracks.length;
    render();
  });
  if(prevTrack) prevTrack.addEventListener("click",function(){
    index=(index+tracks.length-1)%tracks.length;
    render();
  });

  if(back){
    back.addEventListener("click",function(event){
      event.stopPropagation();
      if(backTimer){
        clearTimeout(backTimer);
        backTimer=null;
        index=(index+tracks.length-1)%tracks.length;
        render();
        if(audio) audio.play().catch(function(){});
        return;
      }
      if(audio){
        audio.currentTime=0;
        audio.play().catch(function(){});
      }
      backTimer=setTimeout(function(){backTimer=null;},550);
    });
  }

  if(pause){
    pause.addEventListener("click",function(event){
      event.stopPropagation();
      if(!audio) return;
      if(audio.paused) audio.play().catch(function(){});
      else audio.pause();
    });
  }

  if(skip){
    skip.addEventListener("click",function(event){
      event.stopPropagation();
      index=(index+1)%tracks.length;
      render();
      if(audio) audio.play().catch(function(){});
    });
  }

  qsa("[data-theme]").forEach(function(button){
    button.addEventListener("click",function(){
      theme=button.dataset.theme||"matte";
      apply();
    });
  });

  const glowSelect=qs("#glowSelect");
  if(glowSelect){
    glowSelect.addEventListener("change",function(event){
      glow=event.target.value;
      apply();
    });
  }

  if(compareTimezone) compareTimezone.addEventListener("change",updateSetupTimezone);
  if(cursorSelect) cursorSelect.addEventListener("change",function(event){
    cursor=event.target.value;
    apply();
  });

  if(volumeSlider) volumeSlider.addEventListener("input",function(){
    setVolume(volumeSlider.value);
  });
  if(setupVolume) setupVolume.addEventListener("input",function(){
    setVolume(setupVolume.value);
  });
  if(volumeToggle && audio) volumeToggle.addEventListener("click",function(event){
    event.stopPropagation();
    audio.muted=!audio.muted;
    volumeToggle.setAttribute("aria-label",audio.muted?"Unmute music":"Mute music");
  });

  if(audio){
    audio.addEventListener("ended",function(){
      index=(index+1)%tracks.length;
      render();
      audio.play().catch(function(){});
    });
    audio.addEventListener("play",function(){
      if(wave) wave.classList.remove("paused");
      if(pause){
        pause.textContent="Ⅱ";
        pause.setAttribute("aria-label","Pause music");
      }
    });
    audio.addEventListener("pause",function(){
      if(wave) wave.classList.add("paused");
      if(pause){
        pause.textContent="▶";
        pause.setAttribute("aria-label","Play music");
      }
    });
    audio.addEventListener("timeupdate",function(){
      const time=qs("#musicTime");
      if(!time) return;
      const seconds=Math.floor(audio.currentTime);
      time.textContent=String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0");
    });
  }

  if(fullscreenToggle){
    fullscreenToggle.addEventListener("click",async function(event){
      event.stopPropagation();
      try{
        if(!document.fullscreenElement){
          await document.documentElement.requestFullscreen();
        }else{
          await document.exitFullscreen();
        }
      }catch(e){}
    });
    document.addEventListener("fullscreenchange",function(){
      const active=!!document.fullscreenElement;
      fullscreenToggle.textContent=active?"×":"⛶";
      fullscreenToggle.setAttribute("aria-label",active?"Exit fullscreen":"Enter fullscreen");
    });
  }

  const clock=qs("#clock");
  if(clock) setInterval(function(){
    clock.textContent=new Date().toLocaleTimeString([], {hour12:false});
  },1000);

  updateWorldClock();
  setInterval(updateWorldClock,1000);

  if("IntersectionObserver" in window){
    const observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },{threshold:0.08});
    qsa(".reveal").forEach(function(el,i){
      el.style.setProperty("--delay",Math.min(i*45,250)+"ms");
      observer.observe(el);
    });
  }else{
    qsa(".reveal").forEach(function(el){el.classList.add("visible");});
  }

  if(window.matchMedia && window.matchMedia("(pointer:fine)").matches){
    const dot=qs(".cursor-dot");
    const ring=qs(".cursor-ring");
    const glowEl=qs(".cursor-glow");
    let x=window.innerWidth/2;
    let y=window.innerHeight/2;
    let rx=x;
    let ry=y;

    window.addEventListener("mousemove",function(event){
      x=event.clientX;
      y=event.clientY;
      if(dot){dot.style.left=x+"px";dot.style.top=y+"px";}
      if(glowEl){glowEl.style.left=x+"px";glowEl.style.top=y+"px";}
    });

    (function cursorLoop(){
      rx+=(x-rx)*0.14;
      ry+=(y-ry)*0.14;
      if(ring){ring.style.left=rx+"px";ring.style.top=ry+"px";}
      window.requestAnimationFrame(cursorLoop);
    })();

    qsa(".magnetic").forEach(function(el){
      el.addEventListener("mousemove",function(event){
        const rect=el.getBoundingClientRect();
        const moveX=(event.clientX-rect.left-rect.width/2)*0.06;
        const moveY=(event.clientY-rect.top-rect.height/2)*0.06;
        el.style.transform="translate("+moveX+"px,"+moveY+"px)";
      });
      el.addEventListener("mouseleave",function(){el.style.transform="";});
    });

    const avatar=qs("#avatarWrap");
    if(avatar){
      avatar.addEventListener("mousemove",function(event){
        const rect=avatar.getBoundingClientRect();
        const rotateX=(event.clientY-rect.top-rect.height/2)*-0.08;
        const rotateY=(event.clientX-rect.left-rect.width/2)*0.08;
        avatar.style.transform="perspective(800px) rotateX("+rotateX+"deg) rotateY("+rotateY+"deg)";
      });
      avatar.addEventListener("mouseleave",function(){avatar.style.transform="";});
    }
  }

  document.addEventListener("keydown",function(event){
    if(event.key==="Escape" && setup && setup.classList.contains("open")) closeSetup();
  });

  qsa('a[href^="#"]').forEach(function(link){
    link.addEventListener("click",function(event){
      const target=qs(link.getAttribute("href"));
      if(target){
        event.preventDefault();
        target.scrollIntoView({behavior:"smooth"});
      }
    });
  });

  buildTracks();
  render();
  setVolume(setupVolume ? setupVolume.value : 42);
  apply();
});
