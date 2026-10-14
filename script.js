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
  const trackSort=qs("#trackSort");
  const shuffleButton=qs("#shuffleTracks");

  const tracks=[
    ["Hoes Come Easy","FOREVER$TRONG"],
    ["National Treasures","DRAKE"],
    ["Low Life","FUTURE"],
    ["Love Sosa","CHIEF KEEF"],
    ["Stay Schemin","RICK ROSS"],
    ["Night, Blooming Jasmine.","FAKEMINK"],
    ["Vyzee (Extended Remix) (Slowed & Reverb)","SOPHIE · Moltisanti"],
    ["Queen St","twentythree"],
    ["Fall From The Sky PT.2 (Slowed)","RomancePlanet & Stakillaz"],
    ["Worry (Ultra Slowed)","LONOWN & Riserayys"],
    ["Love Me (feat. Drake & Future)","Lil Wayne"],
    ["She Will (feat. Drake)","Lil Wayne"],
    ["Sweater Weather","The Neighbourhood"],
    ["Loser","Tame Impala"],
    ["Now or Never","TKANDZ & CXSPER"],
    ["Janice STFU","Drake"],
    ["Black Beatles (feat. Gucci Mane)","Rae Sremmurd"],
    ["The Days (NOTION REMIX)","CHRYSTAL"],
    ["Made It This Far","MA Beats & BXCO"],
    ["Skin","otuka"],
    ["Track 10 (best part)","Elliot Sutton"],
    ["Legacy (Slowed Down) (feat. PIXY)","backfromparadise"],
    ["The Hills","The Weeknd"],
    ["Blue Bands","Weiland"],
    ["Cinderella (feat. Ty Dolla $ign)","Mac Miller"],
    ["Hate Bein' Sober (feat. 50 Cent & Wiz Khalifa)","Chief Keef"],
    ["I Don't Like (feat. Lil Reese)","Chief Keef"],
    ["24 songs","Playboi Carti"],
    ["Body","23mir"],
    ["Empire State of Mind (feat. Alicia Keys)","JAY-Z"],
    ["NIGHTS LIKE THIS","The Kid LAROI"],
    ["Blow My High","Dee Mula"],
    ["LVL","A$AP Rocky"],
    ["Mr. Rager","Kid Cudi"],
    ["9","Drake"],
    ["Summer Bummer (Lights On)","RhyRhy"],
    ["Meet Me in the Lobby","poferct"],
    ["Took Her to the O (Slowed)","King Von"],
    ["I LOVE YOU SO JUMPSTYLE","HUSSVRX"]
  ].map(function(x,i){
    return {src:"./music/song"+(i+1)+".mp3",title:x[0],artist:x[1]};
  });

  let entered=false;
  let index=0;
  let trackOrder=tracks.map(function(track,i){return i;});
  let activeSort="playlist";
  const PLAY_COUNTS_KEY="nxrdonut-local-play-counts-v1";
  let trackPlayCounts=tracks.map(function(){return 0;});
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

  function loadTrackPlayCounts(){
    try{
      const saved=JSON.parse(localStorage.getItem(PLAY_COUNTS_KEY)||"[]");
      if(Array.isArray(saved)){
        trackPlayCounts=tracks.map(function(track,i){
          const value=Number(saved[i]);
          return Number.isFinite(value)&&value>0?Math.floor(value):0;
        });
      }
    }catch(e){
      trackPlayCounts=tracks.map(function(){return 0;});
    }
  }

  function saveTrackPlayCounts(){
    try{localStorage.setItem(PLAY_COUNTS_KEY,JSON.stringify(trackPlayCounts));}catch(e){}
  }

  function recordTrackPlay(trackIndex){
    if(!Number.isInteger(trackIndex)||!tracks[trackIndex]) return;
    trackPlayCounts[trackIndex]=(trackPlayCounts[trackIndex]||0)+1;
    saveTrackPlayCounts();
    if(activeSort==="most"||activeSort==="least") updateTrackOrder(activeSort);
  }

  function updateTrackOrder(mode){
    activeSort=mode||"playlist";
    trackOrder=tracks.map(function(track,i){return i;});
    if(activeSort==="most"){
      trackOrder.sort(function(a,b){return trackPlayCounts[b]-trackPlayCounts[a]||a-b;});
    }else if(activeSort==="least"){
      trackOrder.sort(function(a,b){return trackPlayCounts[a]-trackPlayCounts[b]||a-b;});
    }else if(activeSort==="az"){
      trackOrder.sort(function(a,b){return tracks[a].title.localeCompare(tracks[b].title);});
    }else if(activeSort==="recent"){
      trackOrder.reverse();
    }else if(activeSort==="shuffle"){
      for(let i=trackOrder.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=trackOrder[i];
        trackOrder[i]=trackOrder[j];
        trackOrder[j]=temp;
      }
    }
    const box=qs("#trackChoices");
    if(box){
      const rows=new Map(qsa(".track-choice").map(function(row){return [Number(row.dataset.i),row];}));
      trackOrder.forEach(function(trackIndex){
        const row=rows.get(trackIndex);
        if(row) box.appendChild(row);
      });
    }
    filterTracks();
  }

  function moveTrack(step,shouldPlay){
    if(!tracks.length) return;
    const position=trackOrder.indexOf(index);
    const currentPosition=position<0?0:position;
    index=trackOrder[(currentPosition+step+trackOrder.length)%trackOrder.length];
    clearTrackSearch();
    render();
    if(shouldPlay && audio){
      recordTrackPlay(index);
      audio.play().catch(function(){});
    }
  }

  function shufflePlaylist(){
    updateTrackOrder("shuffle");
    const candidate=trackOrder.find(function(trackIndex){return trackIndex!==index;});
    if(Number.isInteger(candidate)) index=candidate;
    clearTrackSearch();
    render();
    if(entered && audio){
      recordTrackPlay(index);
      audio.play().catch(function(){});
    }
  }

  function render(){
    const track=tracks[index];
    const title=qs("#musicTitle");
    if(title) title.textContent=track.title+" · "+track.artist;
    qsa(".track-choice").forEach(function(button){
      const selected=Number(button.dataset.i)===index;
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
      return '<button class="track-choice" type="button" data-i="'+i+'" aria-label="Play or select '+track.title+' by '+track.artist+'" aria-pressed="false">'+
        '<span class="track-play-mark" aria-hidden="true">▶</span>'+
        '<span class="track-info"><strong>'+track.title+'</strong><small>'+track.artist+'</small></span></button>';
    }).join("");
    box.addEventListener("click",function(event){
      const button=event.target.closest(".track-choice");
      if(!button) return;
      index=Number(button.dataset.i)||0;
      render();
      if(entered && audio){
        recordTrackPlay(index);
        audio.play().catch(function(){});
      }
    });
    if(trackSearch) trackSearch.addEventListener("input",filterTracks);
    filterTracks();
    updateTrackOrder(trackSort ? trackSort.value : "playlist");
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

    const profileRemote=await hitCounter("profile-views");
    const profile=qs("#viewCount");
    if(profile && profileRemote!==null) profile.textContent=formatCount(PROFILE_BASE_VIEWS+profileRemote);

    if(audio){
      recordTrackPlay(index);
      audio.play().catch(function(){});
    }
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
  if(nextTrack) nextTrack.addEventListener("click",function(){moveTrack(1,false);});
  if(prevTrack) prevTrack.addEventListener("click",function(){moveTrack(-1,false);});
  if(trackSort) trackSort.addEventListener("change",function(){updateTrackOrder(trackSort.value);});
  if(shuffleButton) shuffleButton.addEventListener("click",shufflePlaylist);

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
        moveTrack(-1,false);
        if(audio){
          recordTrackPlay(index);
          audio.play().catch(function(){});
        }
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
      moveTrack(1,false);
      if(audio){
        recordTrackPlay(index);
        audio.play().catch(function(){});
      }
      
    });
  }

  if(audio){
    audio.addEventListener("ended",function(){
      moveTrack(1,false);
      recordTrackPlay(index);
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

  loadTrackPlayCounts();
  buildTracks();
  render();
  setVolume(volumeSlider ? Number(volumeSlider.value)/100 : 0.42);
  apply();
});
