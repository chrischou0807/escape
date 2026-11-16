//==GAME==
{no:'151',slug:'lightsout',title:'點燈遊戲',brand:'LIGHTS OUT',type:'解謎',
intro:'按一盞燈，它和上下左右相鄰的燈會一起切換。\n在步數內把所有的燈都點亮。',
data:{size:3,slack:2,rounds:[{presses:3},{presses:4}]},
build:function(host,D,G){
  const N=Math.max(2,Math.min(5,D.size||3)); let r=0;
  const stat=G.el('div','stat','',host), grid=G.el('div',null,null,host); grid.style.cssText='display:grid;gap:8px;width:100%;max-width:330px;grid-template-columns:repeat('+N+',1fr)';
  function start(){ const R=D.rounds[r], want=Math.max(1,Math.min(N*N-1,R.presses||3)); let on, sol;
    do{ on=[]; for(let i=0;i<N*N;i++)on.push(true); sol=G.shuffle(on.map((x,i)=>i)).slice(0,want); sol.forEach(flip); }while(on.every(x=>x));
    function flip(i){ const x=i%N, y=Math.floor(i/N); [[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(d=>{ const a=x+d[0], b=y+d[1]; if(a>=0&&a<N&&b>=0&&b<N)on[b*N+a]=!on[b*N+a]; }); }
    const max=want+(D.slack||0); let used=0, busy=false; G.t={sol:sol.slice(),max:max}; grid.innerHTML='';
    const cells=on.map((v,i)=>{ const c=G.el('div','cell','',grid); c.dataset.i=i; c.style.cssText='aspect-ratio:1;border-radius:14px;transition:background .15s,box-shadow .15s';
      c.addEventListener('click',()=>{ if(busy||G.solved())return; flip(i); used++; G.tick(); paint();
        if(on.every(x=>x)){ busy=true; G.ok(); r++; G.later(()=>{ if(r>=D.rounds.length)G.solve('每一盞燈都亮了！'); else { G.hint('全亮了，用了 '+used+' 步。下一題。'); start(); } },800); return; }
        if(used>=max){ busy=true; G.buzz(); G.shake(grid); G.hint(max+' 步用完了還沒全亮。這一題最少只要 '+want+' 步，換一個盤面重來。'); G.later(start,2400); } }); return c; });
    function paint(){ cells.forEach((c,i)=>{ c.style.background=on[i]?'#ffce78':'#1a1f25'; c.style.boxShadow=on[i]?'0 0 18px rgba(255,206,120,.55)':'none'; }); stat.textContent='第 '+(r+1)+' / '+D.rounds.length+' 題 · 已按 '+used+' / '+max+' 步'; }
    paint(); }
  start();
}}
//==GAME==
{no:'152',slug:'tilt',title:'動作感測',brand:'MOVE THE DEVICE',type:'操作',
intro:'這一關不用按畫面，要動你手上的裝置。\n讀懂每一步的情境，把手機擺成對的姿勢，維持一下子。',
data:{hold:1.2,allowButtons:true,steps:[{pose:'flat',text:'指南針的指針一直晃。把它放平，讓指針停下來。'},{pose:'flip',text:'沙漏上半部的沙流完了。讓沙重新流下來。'},{pose:'right',text:'船艙進水了，排水孔在右邊。讓水流過去。'},{pose:'face',text:'守衛走過來了。把燈蓋在桌上，不要讓光露出來。'}]},
build:function(host,D,G){
  const NAME={flat:'平放，螢幕朝上',stand:'直立',flip:'上下顛倒',face:'螢幕朝下蓋住',left:'向左傾',right:'向右傾'};
  const IS={flat:(b,g)=>Math.abs(b)<20&&Math.abs(g)<20,stand:(b,g)=>b>60&&b<120&&Math.abs(g)<45,flip:(b,g)=>b<-60&&b>-120,face:(b,g)=>Math.abs(b)>150,left:(b,g)=>g<-45&&Math.abs(b)<60,right:(b,g)=>g>45&&Math.abs(b)<60};
  D.steps.forEach(s=>{ if(!IS[s.pose])throw new Error('pose'); });
  let k=0, last=null, since=0, got=false, started=false; const holdMs=(D.hold||1.2)*1000;
  const stat=G.el('div','stat','',host), p=G.el('div','panel',null,host), q=G.el('div','q','',p);
  const dial=G.el('div',null,null,host); dial.style.cssText='position:relative;width:150px;height:150px;border-radius:50%;border:2px solid var(--line);background:#12161b';
  const dot=G.el('div',null,null,dial); dot.style.cssText='position:absolute;width:26px;height:26px;border-radius:50%;background:#ffce78;left:62px;top:62px;transition:left .1s,top .1s';
  const go=G.el('button','go','啟動感測器',host), alt=G.el('div','opts',null,host);
  function show(){ stat.textContent='第 '+(k+1)+' / '+D.steps.length+' 步'; q.textContent=D.steps[k].text; }
  function next(){ G.ok(); k++; since=0; if(k>=D.steps.length){ G.solve('每一個姿勢都擺對了！'); return; } G.hint('對了。下一步。'); show(); }
  function onOri(e){ if(e.beta==null||e.gamma==null)return; got=true; last={b:e.beta,g:e.gamma}; const cl=v=>Math.max(-1,Math.min(1,v)); dot.style.left=(62+cl(e.gamma/90)*56)+'px'; dot.style.top=(62+cl(e.beta/90)*56)+'px'; }
  window.addEventListener('deviceorientation',onOri); G.onClean(()=>window.removeEventListener('deviceorientation',onOri));
  G.every(()=>{ if(!started||!last||G.solved())return; if(IS[D.steps[k].pose](last.b,last.g)){ if(!since)since=Date.now(); else if(Date.now()-since>=holdMs)next(); } else since=0; },150);
  function fallback(){ if(alt.childNodes.length)return; G.hint('這台裝置沒有動作感測器'+(D.allowButtons?'，改用按鈕選姿勢。':'。請改用手機或平板。')); if(!D.allowButtons)return;
    G.shuffle(Object.keys(NAME)).forEach(id=>{ const b=G.el('button','opt',NAME[id],alt); b.dataset.pose=id; b.addEventListener('click',()=>{ if(G.solved())return; if(id===D.steps[k].pose)next(); else { G.buzz(); G.shake(alt); G.hint('這個姿勢不對。再讀一次情境。'); } }); }); }
  go.addEventListener('click',()=>{ if(started)return; started=true; go.style.display='none'; G.hint('感測器啟動了。照情境擺姿勢，維持一下。');
    const DO=window.DeviceOrientationEvent; if(DO&&typeof DO.requestPermission==='function'){ DO.requestPermission().then(s=>{ if(s!=='granted')fallback(); }).catch(fallback); }
    G.later(()=>{ if(!got)fallback(); },2500); });
  G.t={poses:D.steps.map(s=>s.pose)}; show();
}}
//==GAME==
{no:'153',slug:'blow',title:'吹氣',brand:'BLOW ON IT',type:'操作',
intro:'先點選你的答案，再對著麥克風吹氣，把風力表吹滿，答案才會送出。\n吹錯三次就要重來，想清楚再吹。',
data:{threshold:0.12,seconds:1.5,lives:3,allowHold:true,rounds:[{q:'哪一個是靠風力前進的？',opts:['帆船','腳踏車','電梯'],a:0},{q:'人吹出來的氣，和吸進去的空氣比起來，哪一種氣體變多了？',opts:['氧氣','二氧化碳','氮氣'],a:1},{q:'哪一種樂器是靠吹氣發出聲音？',opts:['小提琴','長笛','鋼琴'],a:1}]},
build:function(host,D,G){
  let r=0, sel=-1, prog=0, lives=D.lives||3, holding=false, level=0, busy=false, an=null, buf=null, ctx=null, stream=null; const need=(D.seconds||1.5)*1000;
  const stat=G.el('div','stat','',host), p=G.el('div','panel',null,host), q=G.el('div','q','',p), opts=G.el('div','opts',null,p);
  const bar=G.el('div',null,null,host); bar.style.cssText='width:100%;height:22px;border-radius:999px;border:1px solid var(--line);background:#12161b;overflow:hidden';
  const fill=G.el('div',null,null,bar); fill.style.cssText='height:100%;width:0;background:linear-gradient(90deg,#b8935a,#ffce78);transition:width .1s linear';
  const go=G.el('button','go','開啟麥克風',host), hold=G.el('button','opt','按住這裡代替吹氣',host); hold.style.display='none'; hold.dataset.hold='1';
  const down=e=>{ e.preventDefault(); holding=true; }, up=()=>{ holding=false; };
  hold.addEventListener('pointerdown',down); hold.addEventListener('pointerup',up); hold.addEventListener('pointerleave',up); hold.addEventListener('pointercancel',up);
  G.onClean(()=>{ try{ if(stream)stream.getTracks().forEach(t=>t.stop()); if(ctx)ctx.close(); }catch(e){} });
  function useHold(msg){ if(D.allowHold){ hold.style.display=''; G.hint(msg+'改用下面的按鈕，按住代替吹氣。'); } else G.hint(msg+'請允許麥克風，或換一台裝置。'); }
  go.addEventListener('click',()=>{ go.style.display='none'; if(D.allowHold==='always')hold.style.display='';
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){ useHold('這台裝置不能用麥克風。'); return; }
    navigator.mediaDevices.getUserMedia({audio:true}).then(s=>{ stream=s; ctx=new (window.AudioContext||window.webkitAudioContext)(); an=ctx.createAnalyser(); an.fftSize=1024; buf=new Float32Array(an.fftSize); ctx.createMediaStreamSource(s).connect(an); G.hint('麥克風開好了。先選答案，再吹氣。'); })
      .catch(()=>useHold('麥克風沒有開成功。')); });
  function show(){ stat.textContent='第 '+(r+1)+' / '+D.rounds.length+' 題 · 還能吹錯 '+lives+' 次'; }
  function start(){ const R=D.rounds[r]; sel=-1; prog=0; busy=false; q.textContent=R.q; opts.innerHTML=''; G.t={answer:R.a};
    R.opts.forEach((t,i)=>{ const b=G.el('button','opt',t,opts); b.dataset.o=i; b.addEventListener('click',()=>{ if(busy||G.solved())return; sel=i; prog=0; [].forEach.call(opts.children,(x,j)=>x.classList.toggle('on',j===i)); G.tick(); }); }); show(); }
  function commit(){ const R=D.rounds[r], b=opts.children[sel]; busy=true; prog=0;
    if(sel===R.a){ b.classList.add('good'); G.ok(); r++; G.later(()=>{ if(r>=D.rounds.length)G.solve('每一題都吹對了！'); else { G.hint('答對了。下一題。'); start(); } },900); return; }
    b.classList.add('bad'); G.buzz(); lives--; show();
    if(lives<=0){ G.hint('吹錯三次了，從頭再來。'); G.later(()=>G.restart(),2200); return; }
    G.hint('不是這個。重新選一個再吹。'); G.later(()=>{ b.classList.remove('bad','on'); sel=-1; busy=false; },1200); }
  G.every(()=>{ if(G.solved()||busy)return; level=0; if(an){ an.getFloatTimeDomainData(buf); let s=0; for(let i=0;i<buf.length;i++)s+=buf[i]*buf[i]; level=Math.sqrt(s/buf.length); }
    const blowing=holding||level>=(D.threshold||0.12);
    if(blowing&&sel<0){ G.hint('先點一個答案，再吹氣。'); }
    else if(blowing){ prog=Math.min(need,prog+100); } else prog=Math.max(0,prog-60);
    fill.style.width=(100*prog/need)+'%'; if(prog>=need&&sel>=0)commit(); },100);
  start();
}}
//==GAME==
{no:'154',slug:'frames',title:'逐格找月相',brand:'FRAME BY FRAME',type:'探索',
intro:'這是連續拍了一個月的月亮，一天一張。\n拖動滑桿或按箭頭一格一格看，停在題目要的那一天，再按確認。',
data:{days:30,tol:1,tries:2,rounds:[{name:'上弦月',day:7},{name:'滿月',day:15},{name:'下弦月',day:22}]},
build:function(host,D,G){
  const N=D.days||30, ns='http://www.w3.org/2000/svg'; let r=0, day=0, left=0;
  const stat=G.el('div','stat','',host), p=G.el('div','panel',null,host), q=G.el('div','q','',p); G.el('div','sub','（北半球看到的樣子）',p);
  const sky=G.el('div',null,null,host); sky.style.cssText='width:100%;height:190px;border-radius:12px;border:1px solid var(--line);background:#0b0f14;display:flex;align-items:center;justify-content:center';
  const svg=document.createElementNS(ns,'svg'); svg.setAttribute('viewBox','-70 -70 140 140'); svg.setAttribute('width','160'); svg.setAttribute('height','160'); sky.appendChild(svg);
  const back=document.createElementNS(ns,'circle'); back.setAttribute('r','60'); back.setAttribute('fill','#1c232b'); svg.appendChild(back);
  const lit=document.createElementNS(ns,'path'); lit.setAttribute('fill','#f1e6c8'); svg.appendChild(lit);
  const row=G.el('div','row',null,host), prev=G.el('button','opt','◀',row), rng=G.el('input',null,null,row), next=G.el('button','opt','▶',row);
  rng.type='range'; rng.min=0; rng.max=N-1; rng.step=1; rng.style.cssText='flex:1 1 auto;min-width:120px'; prev.style.cssText=next.style.cssText='flex:0 0 52px;padding:10px 0'; prev.dataset.step='-1'; next.dataset.step='1';
  const go=G.el('button','go','就是這一天',host);
  function draw(){ let ph=(day/29.53)%1, flip=false; if(ph>0.5){ ph=1-ph; flip=true; } const rx=60*Math.abs(Math.cos(2*Math.PI*ph));
    lit.setAttribute('d','M0,-60 A60,60 0 0 1 0,60 A'+rx.toFixed(2)+',60 0 0 '+(ph<0.25?0:1)+' 0,-60 Z'); lit.setAttribute('transform',flip?'scale(-1,1)':''); rng.value=day; }
  function set(d){ day=((d%N)+N)%N; draw(); }
  prev.addEventListener('click',()=>{ set(day-1); G.tick(); }); next.addEventListener('click',()=>{ set(day+1); G.tick(); }); rng.addEventListener('input',()=>set(parseInt(rng.value,10)||0));
  function show(){ stat.textContent='第 '+(r+1)+' / '+D.rounds.length+' 題 · 可確認 '+left+' 次'; }
  const gap=(a,b)=>{ const d=Math.abs(a-b)%N; return Math.min(d,N-d); };
  function start(){ const R=D.rounds[r]; left=D.tries||2; q.textContent='停在「'+R.name+'」那一天。'; let d; do{ d=G.rnd(N); }while(gap(d,R.day)<=(D.tol||0)+3); set(d); G.t={target:R.day,set:set}; show(); }
  go.addEventListener('click',()=>{ if(G.solved())return; const R=D.rounds[r];
    if(gap(day,R.day)<=(D.tol||0)){ G.ok(); r++; if(r>=D.rounds.length){ G.solve('三個月相都找到了！'); return; } G.hint('對，這就是'+R.name+'。下一題。'); start(); return; }
    left--; G.buzz(); G.shake(sky); show();
    if(left<=0){ G.hint('這不是'+R.name+'。次數用完，這一題重來。'); G.later(()=>{ G.hint(''); start(); },2000); return; }
    G.hint('這一天不是'+R.name+'。看清楚亮的是哪一邊、亮了多少。'); });
  start();
}}
//==GAME==
{no:'155',slug:'sketch',title:'手繪形狀辨識',brand:'DRAW THE SHAPE',type:'創造',
intro:'題目不會直接說要畫什麼，要自己判斷。\n用手指在畫板上一筆畫出那個形狀，頭尾要接起來。',
data:{rounds:[{q:'車子少了一個輪子。畫出輪子的形狀。',shape:'circle'},{q:'屋頂需要一塊內角和是 180 度的板子。',shape:'triangle'},{q:'門板有四個角，每個角都是直角。',shape:'rect'}]},
build:function(host,D,G){
  const NAME={circle:'圓形',triangle:'三角形',rect:'四邊形',line:'直線'}; D.rounds.forEach(R=>{ if(!NAME[R.shape])throw new Error('shape'); });
  let r=0, pts=[], drawing=false, busy=false; const stat=G.el('div','stat','',host), p=G.el('div','panel',null,host), q=G.el('div','q','',p);
  const S=Math.min(host.clientWidth||330,340), cv=G.el('canvas',null,null,host); cv.width=S; cv.height=S; cv.style.cssText='width:'+S+'px;height:'+S+'px;border-radius:12px;border:1px solid var(--line);background:#12161b;touch-action:none;cursor:crosshair';
  const c=cv.getContext('2d'); const at=e=>{ const b=cv.getBoundingClientRect(); return {x:e.clientX-b.left,y:e.clientY-b.top}; };
  function paint(col){ c.clearRect(0,0,S,S); if(pts.length<2)return; c.strokeStyle=col||'#ffce78'; c.lineWidth=5; c.lineCap='round'; c.lineJoin='round'; c.beginPath(); c.moveTo(pts[0].x,pts[0].y); for(let i=1;i<pts.length;i++)c.lineTo(pts[i].x,pts[i].y); c.stroke(); }
  const dist=(a,b)=>Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
  function simplify(a,eps){ if(a.length<3)return a.slice(); let mx=0, ix=0; const A=a[0], B=a[a.length-1], L=dist(A,B)||1e-6;
    for(let i=1;i<a.length-1;i++){ const d=Math.abs((B.x-A.x)*(A.y-a[i].y)-(A.x-a[i].x)*(B.y-A.y))/L; if(d>mx){ mx=d; ix=i; } }
    if(mx<=eps)return [A,B]; const l=simplify(a.slice(0,ix+1),eps), rr=simplify(a.slice(ix),eps); return l.slice(0,-1).concat(rr); }
  function recognise(a){ const xs=a.map(o=>o.x), ys=a.map(o=>o.y), w=Math.max.apply(null,xs)-Math.min.apply(null,xs), h=Math.max.apply(null,ys)-Math.min.apply(null,ys), diag=Math.sqrt(w*w+h*h);
    if(a.length<8||diag<70)return 'small'; const closed=dist(a[0],a[a.length-1])<0.28*diag;
    if(!closed)return simplify(a,0.08*diag).length===2?'line':'open';
    const cx=xs.reduce((s,v)=>s+v,0)/a.length, cy=ys.reduce((s,v)=>s+v,0)/a.length, rad=a.map(o=>dist(o,{x:cx,y:cy})), m=rad.reduce((s,v)=>s+v,0)/a.length, sd=Math.sqrt(rad.reduce((s,v)=>s+(v-m)*(v-m),0)/a.length), cvv=sd/m;
    /* 從離起點最遠的點切成兩段再簡化，避免起點落在邊的中間 */
    let far=0, fd=0; a.forEach((o,i)=>{ const d=dist(o,a[0]); if(d>fd){ fd=d; far=i; } });
    let poly=simplify(a.slice(0,far+1),0.07*diag).concat(simplify(a.slice(far).concat([a[0]]),0.07*diag).slice(1,-1));
    const merged=[]; poly.forEach(o=>{ if(!merged.length||dist(o,merged[merged.length-1])>0.16*diag)merged.push(o); }); if(merged.length>1&&dist(merged[0],merged[merged.length-1])<0.16*diag)merged.pop();
    /* 起點若落在一條邊上，會多出一個接近平角的頂點，拿掉 */
    const keep=merged.filter((o,i)=>{ const A=merged[(i+merged.length-1)%merged.length], B=merged[(i+1)%merged.length], v1={x:A.x-o.x,y:A.y-o.y}, v2={x:B.x-o.x,y:B.y-o.y}, cs=(v1.x*v2.x+v1.y*v2.y)/((dist(A,o)*dist(B,o))||1e-6); return cs>-0.9; });
    const v=keep.length; if(cvv<0.085)return 'circle'; if(v===3)return 'triangle'; if(v===4)return 'rect'; if(v>=5&&cvv<0.2)return 'circle'; return 'unknown'; }
  function show(){ stat.textContent='第 '+(r+1)+' / '+D.rounds.length+' 題'; q.textContent=D.rounds[r].q; }
  function judge(){ const got=recognise(pts), R=D.rounds[r]; G.t.last=got;
    if(got==='small'){ G.hint('畫大一點，一筆畫完。'); return; } if(got==='open'||got==='unknown'){ G.buzz(); G.hint(got==='open'?'頭尾沒有接起來。一筆畫完，回到起點。':'看不出是什麼形狀，再畫一次，角要畫清楚。'); return; }
    if(got===R.shape){ busy=true; paint('#7fc79a'); G.ok(); r++; G.later(()=>{ busy=false; pts=[]; paint(); if(r>=D.rounds.length){ G.solve('三個形狀都畫對了！'); return; } G.hint('畫對了。下一題。'); show(); },900); return; }
    G.buzz(); paint('#e07b6a'); G.hint('你畫的看起來像'+NAME[got]+'，不是題目要的形狀。'); }
  cv.addEventListener('pointerdown',e=>{ if(busy||G.solved())return; e.preventDefault(); drawing=true; pts=[at(e)]; try{cv.setPointerCapture(e.pointerId);}catch(x){} G.hint(''); });
  cv.addEventListener('pointermove',e=>{ if(!drawing)return; const o=at(e); if(dist(o,pts[pts.length-1])>=3){ pts.push(o); paint(); } });
  const end=()=>{ if(!drawing)return; drawing=false; judge(); }; cv.addEventListener('pointerup',end); cv.addEventListener('pointercancel',end);
  G.t={answer:()=>D.rounds[r].shape,test:(a)=>recognise(a)}; show();
}}
//==GAME==
{no:'156',slug:'metaui',title:'介面即答案',brand:'OUTSIDE THE BOX',type:'解謎',
intro:'這扇門有三道鎖，但鑰匙都不在題目裡。\n看看畫面上還有什麼：最上面的字、底下的按鈕、那句悄悄話。',
data:{clues:['門上刻著：\n「我的名字不在門上，在你頭頂最高的地方。把那行英文告訴我。」','第一道鎖開了。門上浮出新的字：\n「回到一切開始的時候，我才會再鬆開一點。」','第二道鎖也開了。最後一行字：\n「不知道怎麼辦的時候，碰一碰底下那句悄悄話。」'],whisper:'……我在這裡……'},
build:function(host,D,G){
  const ST=window.__metaui=window.__metaui||{stage:0}; if(ST.stage===1&&ST.armed){ ST.stage=2; ST.armed=false; }
  const norm=s=>String(s||'').toUpperCase().replace(/[^A-Z]/g,''), name=norm((document.getElementById('brand').textContent||'').split('·').pop());
  const stat=G.el('div','stat','',host), p=G.el('div','panel',null,host), q=G.el('div','q','',p), row=G.el('div','row',null,host), inp=G.el('input','inp',null,row); inp.placeholder='輸入'; const go=G.el('button','go','開門',row);
  const hintEl=document.getElementById('hint'), tap=()=>{ if(G.solved())return; if(ST.stage===2){ ST.stage=0; G.solve('三道鎖都開了！\n鑰匙一直都在畫面上，只是不在題目裡。'); } };
  hintEl.addEventListener('click',tap); G.onClean(()=>hintEl.removeEventListener('click',tap));
  function show(){ stat.textContent='已開 '+ST.stage+' / 3 道鎖'; q.textContent=D.clues[ST.stage]||''; if(ST.stage===2)G.hint(D.whisper||'……'); G.t={stage:ST.stage,name:name}; }
  function submit(){ if(G.solved())return; const v=norm(inp.value);
    if(ST.stage===0){ if(v&&v===name){ G.ok(); ST.stage=1; ST.armed=true; inp.value=''; G.hint(''); show(); } else { G.buzz(); G.shake(inp); G.hint('不對。答案不在這個框框裡，往上看。'); } return; }
    G.buzz(); G.shake(inp); if(ST.stage===1)G.hint('門沒有反應。這一道鎖不是用打字開的。'); else { G.hint(D.whisper||'……'); } }
  go.addEventListener('click',submit); inp.addEventListener('keydown',e=>{ if(e.key==='Enter')submit(); });
  show();
}}
