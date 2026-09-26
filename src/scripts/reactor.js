const arena=document.querySelector('#arena'),signal=document.querySelector('#signal'),hint=document.querySelector('#signal-hint'),icon=document.querySelector('#signal-icon'),status=document.querySelector('#reactor-status');
let timer,goAt=0,state='idle',results=[],best=0;
try{best=Number(localStorage.getItem('yousif_reactor_best_ms'))||0;}catch{}
const median=()=>{const sorted=[...results].sort((a,b)=>a-b),i=Math.floor(sorted.length/2);return sorted.length?Math.round(sorted.length%2?sorted[i]:(sorted[i-1]+sorted[i])/2):0;};
function renderStats(){document.querySelector('#best').textContent=best?`${best} ms`:'—';document.querySelector('#median').textContent=results.length?`${median()} ms`:'—';document.querySelector('#rounds').textContent=`${results.length} / 5`;document.querySelector('#copy-result').disabled=!results.length;const list=document.querySelector('#results');list.replaceChildren();results.forEach(ms=>{const li=document.createElement('li');li.textContent=`${ms} ms`;list.append(li);});}
function display(next,title,subtitle,symbol){state=next;arena.dataset.state=next;signal.textContent=title;hint.textContent=subtitle;icon.textContent=symbol;}
function play(){
 if(state==='waiting'){clearTimeout(timer);display('idle','Too soon.','Wait for GO. Click to retry this round.','×');status.textContent='False start. No round recorded.';return;}
 if(state==='go'){const time=Math.max(1,Math.round(performance.now()-goAt));results.push(time);if(!best||time<best){best=time;try{localStorage.setItem('yousif_reactor_best_ms',String(best));}catch{}}renderStats();if(results.length===5){display('done',`${median()} ms median`,'Session complete. Click to start a new one.','✓');status.textContent='Five rounds complete.';}else{display('idle',`${time} ms`,'Click for the next round.','ϟ');status.textContent=`Round ${results.length} recorded.`;}return;}
 if(state==='done'){results=[];renderStats();}
 display('waiting','Hold…','Wait for the GO signal.','···');status.textContent='Waiting for the signal.';
 timer=setTimeout(()=>{display('go','GO','React now.','!');goAt=performance.now();},1200+Math.random()*2800);
}
arena.addEventListener('click',play);
arena.addEventListener('keydown',event=>{if(event.repeat&&(event.code==='Space'||event.code==='Enter'))event.preventDefault();});
function reset(){clearTimeout(timer);results=[];display('idle','Ready when you are.','Click, tap, or press Space to begin.','ϟ');status.textContent='Session reset.';renderStats();}
document.querySelector('#restart').addEventListener('click',reset);document.querySelector('#clear-best').addEventListener('click',()=>{clearTimeout(timer);best=0;try{localStorage.removeItem('yousif_reactor_best_ms');}catch{}reset();status.textContent='Personal best cleared.';});
document.querySelector('#copy-result').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(`Reactor: ${median()} ms median over ${results.length} round(s). Best: ${best} ms.`);status.textContent='Result copied.';}catch{status.textContent='Copy unavailable. Your result is shown above.';}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(state==='waiting'||state==='go')){clearTimeout(timer);display('idle','Round paused.','Click to start a fresh round.','ϟ');status.textContent='The unfinished round was cancelled while the tab was hidden.';}});renderStats();
