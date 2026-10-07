document.addEventListener("DOMContentLoaded",function(){
  const qs=(s)=>document.querySelector(s);
  const qsa=(s)=>Array.from(document.querySelectorAll(s));

  const intro=qs("#intro");
  const setup=qs("#setupModal");
  const audio=qs("#audio");
  const wave=qs("#wave");
  const back=qs("#musicBack");
  const pause=qs("#musicPause");
  const skip=qs("#musicSkip");
  const fullscreenToggle=qs("#fullscreenToggle");

  const tracks=[
    ["Hoes Come Easy","FOREVER$TRONG",93,1266],
    ["National Treasures","DRAKE",87,984],
    ["Low Life","FUTURE",96,1127],
    ["Love Sosa","CHIEF KEEF",91,861],
    ["Stay Schemin","RICK ROSS",84,743],
    ["2055","SLEEPY HALLOW",78,612],
    ["Skin","OTUKA",89,537]
  ].map(function(x,i){
    return {src:"./music/song"+(i+1)+".mp3",title:x[0],artist:x[1],popularity:x[2],baseViews:x[3]};
  });

  let entered=false;
  let index=0;
  let theme="matte";
  let backTimer=null; const BACK_WINDOW=2000;
  const localTimezone=Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const COUNTER_API="https://abacus.jasoncameron.dev";
  const COUNTER_NAMESPACE="nxrdonut-public-v1";
  const PROFILE_BASE_VIEWS=2991;

  async function hitCounter(key){
    try{
      const response=await fetch(COUNTER_API+"/hit/"+encodeURIComponent(COUNTER_NAMESPACE)+"/"+encodeURIComponent(key),{cache:"no-store"});
      if(!response.ok) throw new Error("counter request failed");
      const data=await response.json();
      return Number(data.value)||0;
    }catch(e){
      return null;
    }
  }

  async function getCounter(key){
    try{
      const response=await fetch(COUNTER_API+"/get/"+encodeURIComponent(COUNTER_NAMESPACE)+"/"+encodeURIComponent(key),{cache:"no-store"});
      if(!response.ok) throw new Error("counter request failed");
      const data=await response.json();
      return Number(data.value)||0;
    }catch(e){
      return null;
    }
  }

  function formatCount(value){
    return Number(value||0).toLocaleString();
  }

  async function refreshProfileViews(){
    const remote=await getCounter("profile-views");
    const view=qs("#viewCount");
    if(view) view.textContent=formatCount(PROFILE_BASE_VIEWS+(remote||0));
  }

  async function refreshTrackViews(){
    await Promise.all(tracks.map(async function(track,i){
      const remote=await getCounter("song-"+i);
      const row=qs('.track-choice[data-i="'+i+'"]');
      const view=row ? row.querySelector(".track-views") : null;
      if(view) view.textContent=formatCount(track.baseViews+(remote||0))+" VIEWS";
    }));
  }

  function apply(){
    const body=document.body;
    body.className=body.className.replace(/theme-[A-Za-z0-9_-]+|no-motion|no-led/g,"").replace(/\s+/g," ").trim()+" theme-"+theme;
    qsa("[data-theme]").forEach(function(button){
      button.classList.toggle("selected",button.dataset.theme===theme);
    });
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

  function getTrackViews(trackIndex){
    try{return Number(localStorage.getItem("nxr-track-views-"+trackIndex)||0);}
    catch(e){return 0;}
  }

  function recordTrackView(trackIndex){
    try{
      const key="nxr-track-views-"+trackIndex;
      const views=getTrackViews(trackIndex)+1;
      localStorage.setItem(key,String(views));
      const active=qsa(".track-choice").find(function(button){
        return Number(button.dataset.i)===trackIndex;
      });
      if(active){
        const view=active.querySelector(".track-views");
        if(view) view.textContent=views.toLocaleString()+" VIEWS";
      }
    }catch(e){}
  }

  function buildTracks(){
    const box=qs("#trackChoices");
    if(!box) return;
    box.innerHTML=tracks.map(function(track,i){
      return '<button class="track-choice" type="button" data-i="'+i+'">'+
        '<span class="track-num">'+String(i+1).padStart(2,"0")+'</span>'+
        '<span class="track-info"><strong>'+track.title+'</strong><small>'+track.artist+'</small><span class="track-stats"><em>POPULARITY</em><span class="pop-bar"><i style="--pop:'+track.popularity+'%"></i></span><b>'+track.popularity+'%</b><label class="track-views">'+formatCount(track.baseViews)+' VIEWS</label></span></span>'+
        '<span class="track-arrow">›</span></button>';
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
      const match=raw.match(/GMT([+-])([0-9]{1,2})(?::([0-9]{2}))?/);
      if(!match) return 0;
      const minutes=(Number(match[2])*60)+Number(match[3]||0);
      return match[1]==="-" ? -minutes : minutes;
    }catch(e){
      return 0;
    }
  }

  function timezoneLabel(zone){
    return String(zone||"UTC").split("/").pop().replace(/_/g," ");
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

  }

  async function enter(){
    if(entered || !intro) return;
    entered=true;
    closeSetup();
    intro.classList.add("hide");
    document.body.classList.remove("locked");
    apply();
    if(audio) audio.volume=0.42;

    const results=await Promise.all([
      hitCounter("profile-views"),
      hitCounter("song-"+index)
    ]);

    const profileRemote=results[0];
    const songRemote=results[1];

    const profile=qs("#viewCount");
    if(profile && profileRemote!==null) profile.textContent=formatCount(PROFILE_BASE_VIEWS+profileRemote);

    const row=qs('.track-choice[data-i="'+index+'"]');
    const songView=row ? row.querySelector(".track-views") : null;
    if(songView && songRemote!==null) songView.textContent=formatCount(tracks[index].baseViews+songRemote)+" VIEWS";

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
      backTimer=setTimeout(function(){backTimer=null;},BACK_WINDOW);
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
  refreshProfileViews();
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
  apply();
  refreshTrackViews();
});
