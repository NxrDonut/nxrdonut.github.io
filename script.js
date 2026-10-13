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
  const volumeToggle=qs("#volumeToggle");
  const volumeSlider=qs("#volumeSlider");
  const volumeValue=qs("#volumeValue");
  const trackSearch=qs("#trackSearch");
  const trackSearchCount=qs("#trackSearchCount");

  const tracks=[
    ["Hoes Come Easy","FOREVER$TRONG",72,1266],
    ["National Treasures","DRAKE",61,984],
    ["Low Life","FUTURE",68,1127],
    ["Love Sosa","CHIEF KEEF",56,861],
    ["Stay Schemin","RICK ROSS",49,743],
    ["Night, Blooming Jasmine.","FAKEMINK",43,612],
    ["Vyzee (Extended Remix) (Slowed & Reverb)","SOPHIE · Moltisanti",null,0],
    ["Queen St","twentythree",null,0],
    ["Fall From The Sky PT.2 (Slowed)","RomancePlanet & Stakillaz",null,0],
    ["Worry (Ultra Slowed)","LONOWN & Riserayys",null,0],
    ["Love Me (feat. Drake & Future)","Lil Wayne",null,0],
    ["She Will (feat. Drake)","Lil Wayne",null,0],
    ["Sweater Weather","The Neighbourhood",null,0],
    ["Loser","Tame Impala",null,0],
    ["Now or Never","TKANDZ & CXSPER",null,0],
    ["Janice STFU","Drake",null,0],
    ["Black Beatles (feat. Gucci Mane)","Rae Sremmurd",null,0],
    ["The Days (NOTION REMIX)","CHRYSTAL",null,0],
    ["Made It This Far","MA Beats & BXCO",null,0],
    ["Skin","otuka",null,0],
    ["Track 10 (best part)","Elliot Sutton",null,0],
    ["Legacy (Slowed Down) (feat. PIXY)","backfromparadise",null,0],
    ["The Hills","The Weeknd",null,0],
    ["Blue Bands","Weiland",null,0],
    ["Cinderella (feat. Ty Dolla $ign)","Mac Miller",null,0],
    ["Hate Bein' Sober (feat. 50 Cent & Wiz Khalifa)","Chief Keef",null,0],
    ["I Don't Like (feat. Lil Reese)","Chief Keef",null,0],
    ["24 songs","Playboi Carti",null,0],
    ["Body","23mir",null,0],
    ["Empire State of Mind (feat. Alicia Keys)","JAY-Z",null,0],
    ["NIGHTS LIKE THIS","The Kid LAROI",null,0],
    ["Blow My High","Dee Mula",null,0],
    ["LVL","A$AP Rocky",null,0],
    ["Mr. Rager","Kid Cudi",null,0],
    ["9","Drake",null,0],
    ["Summer Bummer (Lights On)","RhyRhy",null,0],
    ["Meet Me in the Lobby","poferct",null,0],
    ["Took Her to the O (Slowed)","King Von",null,0],
    ["Reggie Pack","Cuffem",null,0]
  ].map(function(x,i){
    return {src:"./music/song"+(i+1)+".mp3",title:x[0],artist:x[1],popularity:x[2],baseViews:x[3]};
  });

  let entered=false;
  let index=0;
  let volumeLevel=0.42;
  let lastNonZeroVolume=0.42;
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
    const totals=await Promise.all(tracks.map(function(track,i){
      return getCounter("song-"+i);
    }));
    let leaderIndex=0;
    let leaderViews=-1;

    tracks.forEach(function(track,i){
      const remote=totals[i]===null?0:totals[i];
      const total=track.baseViews+remote;
      if(total>leaderViews){
        leaderViews=total;
        leaderIndex=i;
      }
    });

    tracks.forEach(function(track,i){
      const row=qs('.track-choice[data-i="'+i+'"]');
      if(!row) return;
      const view=row.querySelector(".track-views");
      const remote=totals[i]===null?0:totals[i];
      const totalViews=track.baseViews+remote;
      if(view) view.textContent=totalViews>0?formatCount(totalViews)+" plays":"";
      row.classList.toggle("most-popular",i===leaderIndex);
      const oldLabel=row.querySelector(".most-popular-label");
      if(oldLabel) oldLabel.remove();
      if(i===leaderIndex){
        const label=document.createElement("span");
        label.className="most-popular-label";
        label.textContent="MOST POPULAR";
        row.appendChild(label);
      }
    });
  }

  function setVolume(value){
    const parsed=Number(value);
    volumeLevel=Math.max(0,Math.min(1,Number.isFinite(parsed)?parsed:0.42));
    if(volumeLevel>0) lastNonZeroVolume=volumeLevel;
    if(audio){
      audio.volume=volumeLevel;
      audio.muted=volumeLevel===0;
    }
    const percent=Math.round(volumeLevel*100);
    if(volumeSlider){
      volumeSlider.value=String(percent);
      volumeSlider.style.setProperty("--volume",percent+"%");
    }
    if(volumeValue) volumeValue.textContent=percent+"%";
    if(volumeToggle){
      const muted=volumeLevel===0;
      volumeToggle.setAttribute("aria-label",muted?"Unmute music":"Mute music");
      volumeToggle.setAttribute("title",muted?"Unmute music":"Mute music");
      volumeToggle.setAttribute("aria-pressed",String(muted));
    }
  }

  function apply(){
    document.body.classList.remove("theme-chrome","theme-light","theme-cream","theme-dark","theme-matte");
  }

  function render(){
    const track=tracks[index];
    const title=qs("#musicTitle");
    const number=qs("#trackNumber");
    if(title) title.innerHTML=track.title+" <i>· "+track.artist+"</i>";
    if(number) number.textContent=String(index+1).padStart(2,"0")+" / "+String(tracks.length).padStart(2,"0");
    qsa(".track-choice").forEach(function(button,i){
      const selected=i===index;
      button.classList.toggle("selected",selected);
      button.setAttribute("aria-pressed",String(selected));
    });
    if(audio){
      audio.src=track.src;
      audio.load();
      if(pause) pause.textContent="▶";
    }
  }

  function filterTracks(){
    const query=String(trackSearch ? trackSearch.value : "").trim().toLowerCase();
    let visible=0;
    qsa(".track-choice").forEach(function(button){
      const track=tracks[Number(button.dataset.i)];
      const match=!!track && (track.title+" "+track.artist).toLowerCase().includes(query);
      button.hidden=!match;
      if(match) visible++;
    });
    if(trackSearchCount){
      trackSearchCount.textContent=query
        ? visible+" RESULT"+(visible===1?"":"S")
        : tracks.length+" TRACKS";
    }
  }

  function clearTrackSearch(){
    if(trackSearch) trackSearch.value="";
    filterTracks();
  }

  function buildTracks(){
    const box=qs("#trackChoices");
    if(!box) return;
    box.innerHTML=tracks.map(function(track,i){
      const meta=track.popularity===null
        ? '<span class="track-stats"><span class="track-new">ADDED</span><label class="track-views"></label></span>'
        : '<span class="track-stats"><span class="pop-bar" role="img" aria-label="Popularity '+track.popularity+' percent"><i style="--pop:'+track.popularity+'%"></i></span><b class="track-popularity">'+track.popularity+'%</b><label class="track-views">'+formatCount(track.baseViews)+' plays</label></span>';
      return '<button class="track-choice" type="button" data-i="'+i+'" aria-label="Select '+track.title+' by '+track.artist+'" aria-pressed="false">'+
        '<span class="track-num">'+String(i+1).padStart(2,"0")+'</span>'+
        '<span class="track-info"><strong>'+track.title+'</strong><small>'+track.artist+'</small>'+meta+'</span>'+
        '<span class="track-arrow" aria-hidden="true">›</span></button>';
    }).join("");
    box.addEventListener("click",function(event){
      const button=event.target.closest(".track-choice");
      if(!button) return;
      index=Number(button.dataset.i)||0;
      render();
    });
    if(trackSearch) trackSearch.addEventListener("input",filterTracks);
    filterTracks();
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
    if(songView && songRemote!==null) songView.textContent=formatCount(tracks[index].baseViews+songRemote)+" plays";

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
    clearTrackSearch();
    render();
  });
  if(prevTrack) prevTrack.addEventListener("click",function(){
    index=(index+tracks.length-1)%tracks.length;
    clearTrackSearch();
    render();
  });

  if(volumeSlider){
    volumeSlider.addEventListener("input",function(){
      setVolume(Number(volumeSlider.value)/100);
    });
  }

  if(volumeToggle){
    volumeToggle.addEventListener("click",function(event){
      event.stopPropagation();
      if(volumeLevel===0) setVolume(lastNonZeroVolume||0.42);
      else setVolume(0);
    });
  }

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
  setVolume(volumeSlider ? Number(volumeSlider.value)/100 : 0.42);
  apply();
  refreshTrackViews();
  setInterval(refreshTrackViews,60000);
});
