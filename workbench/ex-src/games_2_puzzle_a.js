//==GAME==
{no:'108',slug:'rings',title:'同心圓環拼圖',brand:'RING ALIGN',type:'解謎',
intro:'每一條由外往內的直線，本來都是一句四字成語，但內側三圈被轉亂了。\n點圓環讓它轉一格，把八句成語都對回來。最外圈不會動。',
data:{colorHint:false,words:['一石二鳥','畫蛇添足','守株待兔','井底之蛙','亡羊補牢','對牛彈琴','杯弓蛇影','掩耳盜鈴']},
build:function(host,D,G){
  const S=D.words.length, L=D.words[0].length; if(D.words.some(w=>w.length!==L))throw new Error('word length');
  const NS='http://www.w3.org/2000/svg', C=170, th=Math.min(34,140/L);
  const svg=document.createElementNS(NS,'svg'); svg.setAttribute('viewBox','0 0 340 340'); svg.style.cssText='width:100%;max-width:420px;touch-action:manipulation'; host.appendChild(svg);
  const steps=[0]; for(let r=1;r<L;r++)steps.push(1+G.rnd(S-1));
  const groups=[];
  for(let r=0;r<L;r++){ const cr=160-th/2-r*th, g=document.createElementNS(NS,'g'); g.style.cssText='transition:transform .25s;transform-origin:'+C+'px '+C+'px;transform-box:view-box'; svg.appendChild(g);
    const c=document.createElementNS(NS,'circle'); c.setAttribute('cx',C); c.setAttribute('cy',C); c.setAttribute('r',cr); c.setAttribute('fill','none'); c.setAttribute('stroke',r===0?'#3a3323':(r%2?'#2a3139':'#232a32')); c.setAttribute('stroke-width',th-2); c.setAttribute('pointer-events','stroke'); c.style.cursor=r?'pointer':'default'; c.dataset.ring=r; g.appendChild(c);
    for(let k=0;k<S;k++){ const a=(k+0.5)*360/S, rad=a*Math.PI/180, x=C+cr*Math.sin(rad), y=C-cr*Math.cos(rad), t=document.createElementNS(NS,'text');
      t.setAttribute('x',x); t.setAttribute('y',y); t.setAttribute('text-anchor','middle'); t.setAttribute('dominant-baseline','central'); t.setAttribute('font-size',Math.min(19,th*0.6)); t.setAttribute('font-weight','700');
      t.setAttribute('fill',D.colorHint?'hsl('+(k*360/S)+',70%,72%)':'#e7e3da'); t.setAttribute('transform','rotate('+a+' '+x+' '+y+')'); t.setAttribute('pointer-events','none'); t.textContent=D.words[k][r]; g.appendChild(t); }
    groups.push(g);
    if(r>0)c.addEventListener('click',()=>turn(r)); }
  const hub=document.createElementNS(NS,'circle'); hub.setAttribute('cx',C); hub.setAttribute('cy',C); hub.setAttribute('r',160-L*th-2>4?160-L*th-2:4); hub.setAttribute('fill','#161a20'); svg.appendChild(hub);
  for(let k=0;k<S;k++){ const rad=k*2*Math.PI/S, r1=160-L*th, ln=document.createElementNS(NS,'line'); ln.setAttribute('x1',C+r1*Math.sin(rad)); ln.setAttribute('y1',C-r1*Math.cos(rad)); ln.setAttribute('x2',C+160*Math.sin(rad)); ln.setAttribute('y2',C-160*Math.cos(rad)); ln.setAttribute('stroke','rgba(255,255,255,.16)'); ln.setAttribute('stroke-width','1'); ln.setAttribute('pointer-events','none'); svg.appendChild(ln); }
  const total=steps.slice();   // 累計角度，避免倒轉動畫
  function draw(){ groups.forEach((g,r)=>{ g.style.transform='rotate('+(total[r]*360/S)+'deg)'; }); }
  function turn(r){ if(G.solved())return; steps[r]=(steps[r]+1)%S; total[r]++; G.tick(); draw();
    if(steps.every(s=>s===0))G.solve('八句成語都對齊了！'); }
  G.t={steps:steps,S:S,turn:turn}; draw();
}}
//==GAME==
{no:'109',slug:'connectdots',title:'依序連點',brand:'CONNECT IN ORDER',type:'解謎',
intro:'依照「發生的先後順序」，從最早的開始，一個一個點下去。\n點錯會斷線、從頭再來。全部連完會出現一個圖形。',
data:{points:[{label:'造紙術',note:'105 年'},{label:'活字印刷',note:'約 1045 年'},{label:'望遠鏡',note:'1608 年'},{label:'瓦特蒸汽機',note:'1769 年'},{label:'電話',note:'1876 年'},
 {label:'飛機',note:'1903 年'},{label:'青黴素',note:'1928 年'},{label:'人造衛星',note:'1957 年'},{label:'全球資訊網',note:'1989 年'},{label:'智慧型手機',note:'2007 年'}]},
build:function(host,D,G){
  const n=D.points.length, gcd=(a,b)=>b?gcd(b,a%b):a; let s=Math.max(1,Math.floor(n/3)); while(s<n&&gcd(s,n)!==1)s++; if(s>=n)s=1;
  const pos=D.points.map((p,k)=>{ const a=((k*s)%n)*2*Math.PI/n; return {x:50+37*Math.sin(a),y:50-37*Math.cos(a)}; });
  const stat=G.el('div','stat','',host);
  const box=G.el('div',null,null,host); box.style.cssText='position:relative;width:100%;aspect-ratio:1';
  const NS='http://www.w3.org/2000/svg', svg=document.createElementNS(NS,'svg'); svg.setAttribute('viewBox','0 0 100 100'); svg.style.cssText='position:absolute;inset:0;width:100%;height:100%'; box.appendChild(svg);
  let k=0, miss=0; const btns=[];
  D.points.forEach((p,i)=>{ const b=G.el('button','opt',p.label,box); b.dataset.k=i; b.style.cssText='position:absolute;transform:translate(-50%,-50%);left:'+pos[i].x+'%;top:'+pos[i].y+'%;padding:7px 8px;font-size:12px;min-width:58px;z-index:2;white-space:nowrap';
    b.addEventListener('click',()=>tap(i)); btns.push(b); });
  function line(a,b){ const l=document.createElementNS(NS,'line'); l.setAttribute('x1',pos[a].x); l.setAttribute('y1',pos[a].y); l.setAttribute('x2',pos[b].x); l.setAttribute('y2',pos[b].y); l.setAttribute('stroke','#ffce78'); l.setAttribute('stroke-width','0.9'); svg.appendChild(l); }
  function draw(){ stat.textContent='已連 '+k+' / '+n+' · 斷線 '+miss+' 次'; }
  function tap(i){ if(G.solved()||btns[i].classList.contains('good'))return;
    if(i===k){ btns[i].classList.add('good'); if(k>0)line(k-1,k); k++; G.tone(400+k*45,0.1,'sine',0.05); draw();
      if(k===n){ line(n-1,0); btns.forEach((b,j)=>{b.textContent=D.points[j].label+' '+D.points[j].note; b.style.fontSize='10px';}); G.solve('順序完全正確，星形完成！'); } }
    else { miss++; G.buzz(); G.shake(box); G.hint('順序不對，線斷了，從最早的那一個重新開始。'); k=0; svg.innerHTML=''; btns.forEach(b=>b.classList.remove('good')); draw(); } }
  G.t={n:n}; draw();
}}
//==GAME==
{no:'110',slug:'shadegrid',title:'條件塗格顯圖',brand:'SHADE BY RULE',type:'解謎',
intro:'把所有符合條件的格子塗黑。全部塗對，格子會浮現一個圖案。\n檢查的次數有限，用完數字會重新洗牌。',
data:{rule:'質數',checks:3,reveal:'浮現的圖案是數字 5',pattern:['11111','10000','11110','00001','00001','10001','01110'],
 yes:[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97],
 no:[1,4,6,8,9,10,12,14,15,21,25,27,33,35,39,49,51,57,63,65,77,81,87,91,93,95,99]},
build:function(host,D,G){
  const rows=D.pattern.length, cols=D.pattern[0].length, flat=D.pattern.join('').split('').map(c=>c==='1');
  const ny=flat.filter(x=>x).length; if(ny>D.yes.length||flat.length-ny>D.no.length)throw new Error('pool too small');
  const ys=G.shuffle(D.yes), ns=G.shuffle(D.no); let yi=0, ni=0, checks=D.checks; const on=flat.map(()=>false);
  G.el('div','q','把所有「'+D.rule+'」塗黑',G.el('div','panel',null,host));
  const grid=G.el('div',null,null,host); grid.style.cssText='display:grid;gap:4px;width:'+Math.min(100,cols*17)+'%;grid-template-columns:repeat('+cols+',1fr)';
  const cells=flat.map((isY,i)=>{ const c=G.el('div','cell',String(isY?ys[yi++]:ns[ni++]),grid); c.style.cssText='aspect-ratio:1;font-size:17px'; c.dataset.i=i;
    c.addEventListener('click',()=>{ if(G.solved())return; on[i]=!on[i]; c.style.background=on[i]?'#0c0e11':''; c.style.color=on[i]?'#ffce78':''; G.tick(); }); return c; });
  const go=G.el('button','go','',host); const lab=()=>{go.textContent='檢查（剩 '+checks+' 次）';}; lab();
  go.addEventListener('click',()=>{ if(G.solved())return; let bad=0; flat.forEach((v,i)=>{ if(v!==on[i])bad++; });
    if(!bad){ G.solve(D.reveal); return; }
    checks--; lab(); G.buzz(); G.hint('還有 '+bad+' 格不對（多塗或漏塗）。');
    if(checks<=0){ G.hint('檢查次數用完，數字重新洗牌。'); G.later(()=>G.restart(),1500); } });
  G.t={flat:flat};
}}
//==GAME==
{no:'111',slug:'pixelpaint',title:'答題上色像素畫',brand:'COLOR BY ANSWER',type:'解謎',
intro:'每一格是一道算式。先選顏色，再把答案相同的格子塗上那個顏色。\n全部塗對就會出現一幅圖。',
data:{colors:[{name:'紅',hex:'#d9534f',value:12},{name:'黃',hex:'#f0c04a',value:18},{name:'藍',hex:'#4a8fd9',value:24}],
 pattern:['200002','021120','011110','011110','021120','200002'],
 exprs:{'12':['3×4','2×6','20−8','48÷4','7+5','6+6','36÷3','15−3','60÷5','4+8'],'18':['3×6','2×9','9+9','36÷2','25−7','54÷3','11+7','20−2','72÷4','6+12'],'24':['4×6','3×8','12+12','48÷2','30−6','72÷3','19+5','96÷4','8+16','2×12']}},
build:function(host,D,G){
  const cols=D.pattern[0].length, want=D.pattern.join('').split('').map(Number); let cur=0; const got=want.map(()=>-1);
  const pal=G.el('div','row',null,host); const pbs=D.colors.map((c,i)=>{ const b=G.el('button','opt','答案 '+c.value,pal); b.dataset.color=i; b.style.cssText='border-left:14px solid '+c.hex+';padding:10px 12px';
    b.addEventListener('click',()=>{cur=i;pbs.forEach((x,j)=>x.classList.toggle('on',j===i));G.tick();}); return b; }); pbs[0].classList.add('on');
  const grid=G.el('div',null,null,host); grid.style.cssText='display:grid;gap:3px;width:100%;grid-template-columns:repeat('+cols+',1fr)';
  want.forEach((w,i)=>{ const pool=D.exprs[String(D.colors[w].value)]; const c=G.el('div','cell',pool[G.rnd(pool.length)],grid); c.style.cssText='aspect-ratio:1;font-size:13px'; c.dataset.i=i;
    c.addEventListener('click',()=>{ if(G.solved())return; got[i]=(got[i]===cur)?-1:cur; c.style.background=got[i]<0?'':D.colors[got[i]].hex; c.style.color=got[i]<0?'':'#14161a'; G.tick(); }); });
  const go=G.el('button','go','檢查',host);
  go.addEventListener('click',()=>{ let bad=0; want.forEach((w,i)=>{ if(got[i]!==w)bad++; }); if(!bad)G.solve('上色完成，圖案出現了！'); else{ G.buzz(); G.hint('還有 '+bad+' 格不對或沒塗。'); } });
  G.t={want:want};
}}
//==GAME==
{no:'112',slug:'minesweeper',title:'踩地雷',brand:'MINESWEEPER',type:'解謎',
intro:'數字代表周圍八格裡有幾顆地雷。把沒有地雷的格子全部掀開。\n切到「插旗」可以先把確定是地雷的格子標起來。',
data:{size:8,mines:9},
build:function(host,D,G){
  const n=D.size, N=n*n; if(D.mines>N-10)throw new Error('too many mines');
  let mines=null, flag=false, open=0; const st=new Array(N).fill(0); // 0 蓋著 1 掀開 2 旗
  const row=G.el('div','row',null,host), stat=G.el('div','stat','',row), mode=G.el('button','pill','目前：掀開',row);
  mode.addEventListener('click',()=>{flag=!flag;mode.textContent=flag?'目前：插旗':'目前：掀開';});
  const grid=G.el('div',null,null,host); grid.style.cssText='display:grid;gap:3px;width:100%;grid-template-columns:repeat('+n+',1fr)';
  const cells=[]; const nb=i=>{ const r=Math.floor(i/n),c=i%n,o=[]; for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){ if(!a&&!b)continue; const x=r+a,y=c+b; if(x>=0&&x<n&&y>=0&&y<n)o.push(x*n+y); } return o; };
  const colors=['','#7fb7ff','#7fce9b','#e8857a','#c79bff','#ffce78','#6fd6d6','#fff','#aaa'];
  for(let i=0;i<N;i++){ const c=G.el('div','cell','',grid); c.style.cssText='aspect-ratio:1;font-size:17px'; c.dataset.i=i; cells.push(c); c.addEventListener('click',()=>tap(i)); }
  function lay(safe){ const ban=new Set(nb(safe).concat([safe])); const pool=G.shuffle([...Array(N).keys()].filter(i=>!ban.has(i))); mines=new Set(pool.slice(0,D.mines)); G.t.mines=mines; }
  function reveal(i){ if(st[i]!==0)return; st[i]=1; open++; const k=nb(i).filter(j=>mines.has(j)).length; const c=cells[i]; c.style.background='#14181d'; c.style.cursor='default';
    if(k){ c.textContent=k; c.style.color=colors[k]; } else nb(i).forEach(reveal); }
  function draw(){ stat.textContent='地雷 '+D.mines+' · 旗 '+st.filter(x=>x===2).length; }
  function tap(i){ if(G.solved()||st[i]===1)return;
    if(flag){ st[i]=st[i]===2?0:2; cells[i].textContent=st[i]===2?'🚩':''; G.tick(); draw(); return; }
    if(st[i]===2)return; if(!mines)lay(i);
    if(mines.has(i)){ mines.forEach(j=>{cells[j].textContent='💣';}); cells[i].style.background='#5a2420'; G.buzz(); G.hint('踩到地雷了，重新來過。'); G.later(()=>G.restart(),1700); return; }
    reveal(i); G.tick(); draw(); if(open===N-D.mines)G.solve('安全區全部掀開了！'); }
  G.t={n:n,tap:tap}; draw();
}}
//==GAME==
{no:'113',slug:'hangman',title:'吊人猜字',brand:'LAST CANDLE',type:'解謎',
intro:'依照提示猜出英文單字，一次猜一個字母。\n猜錯一次熄滅一根蠟燭，全熄就失敗。',
data:{lives:6,words:[{w:'PHOTOSYNTHESIS',clue:'植物利用光能製造養分的作用'},{w:'GRAVITY',clue:'讓蘋果往下掉的力'},{w:'VOLCANO',clue:'會噴出岩漿的山'}]},
build:function(host,D,G){
  let wi=0, lives, used; const stat=G.el('div','stat','',host), candles=G.el('div','q','',host), clue=G.el('div','panel',null,host), cq=G.el('div','q','',clue);
  const slots=G.el('div','row',null,host); slots.style.cssText='gap:3px;flex-wrap:nowrap'; const kb=G.el('div',null,null,host); kb.style.cssText='display:grid;grid-template-columns:repeat(7,1fr);gap:5px;width:100%';
  function start(){ const w=String(D.words[wi].w).toUpperCase(); lives=D.lives; used=new Set(); G.t={word:w}; cq.textContent=D.words[wi].clue; kb.innerHTML='';
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(ch=>{ const b=G.el('button','opt',ch,kb); b.dataset.ch=ch; b.style.cssText='padding:10px 0;font-family:var(--display);font-weight:700';
      b.addEventListener('click',()=>{ if(G.solved()||used.has(ch))return; used.add(ch); b.disabled=true;
        if(w.indexOf(ch)>=0){ b.classList.add('good'); G.ok(); } else { b.classList.add('bad'); lives--; G.buzz(); }
        draw(w); }); });
    draw(w); }
  function draw(w){ stat.textContent='第 '+(wi+1)+' / '+D.words.length+' 個字'; candles.textContent='🕯️'.repeat(lives)+'▫️'.repeat(D.lives-lives); slots.innerHTML='';
    let done=true; w.split('').forEach(ch=>{ const show=used.has(ch)||!/[A-Z]/.test(ch); if(!show)done=false; const s=G.el('div','cell',show?ch:'',slots); s.style.cssText='flex:0 0 auto;width:'+Math.min(30,Math.floor((slots.clientWidth||340)/w.length)-3)+'px;height:38px;font-size:'+(w.length>11?14:18)+'px;cursor:default;color:var(--amber)'; });
    if(done){ wi++; if(wi>=D.words.length){ G.solve('全部猜對了！'); return; } G.hint('答對了，下一個字。'); G.later(start,900); return; }
    if(lives<=0){ G.hint('蠟燭全熄了。答案是 '+w+'，從頭再來。'); [].forEach.call(kb.children,b=>{b.disabled=true;}); G.later(()=>G.restart(),2200); } }
  start();
}}
//==GAME==
{no:'114',slug:'letterdigits',title:'字母藏數字',brand:'LETTER KEY',type:'解謎',
intro:'房間三個地方散落著字母卡，每張卡的角落都有一個小數字。\n先解開謎題得到關鍵字，再依關鍵字的字母順序，把對應的數字排成密碼。',
data:{riddle:'地球上絕大部分能量的來源是什麼？（英文，三個字母）',keyword:'SUN',places:['書架','桌面','牆上'],
 letters:{S:4,U:7,N:2,A:9,M:1,O:5,R:3,E:8,T:6}},
build:function(host,D,G){
  const kw=String(D.keyword).toUpperCase(); const answer=kw.split('').map(ch=>{ if(D.letters[ch]==null)throw new Error('keyword letter missing'); return D.letters[ch]; }).join(''); G.t={answer:answer};
  G.el('div','q',D.riddle,G.el('div','panel',null,host));
  const tabs=G.el('div','row',null,host), room=G.el('div','panel',null,host); room.style.cssText+=';display:grid;grid-template-columns:repeat(3,1fr);gap:10px;min-height:150px;background:#3b2c1c';
  const keys=G.shuffle(Object.keys(D.letters)), by=D.places.map(()=>[]); keys.forEach((k,i)=>by[i%D.places.length].push(k));
  const tb=D.places.map((p,i)=>{ const b=G.el('button','opt',p,tabs); b.dataset.place=i; b.addEventListener('click',()=>show(i)); return b; });
  function show(i){ tb.forEach((b,j)=>b.classList.toggle('on',j===i)); room.innerHTML=''; G.tick();
    by[i].forEach(ch=>{ const c=G.el('div','note',null,room); c.style.cssText+=';position:relative;min-width:0;height:84px;padding:0;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:32px;font-weight:700;transform:rotate('+(G.rnd(7)-3)+'deg)'; c.textContent=ch;
      const d=G.el('span',null,String(D.letters[ch]),c); d.style.cssText='position:absolute;right:6px;top:3px;font-size:13px;color:#8a6d3f'; }); }
  show(0);
  const row=G.el('div','row',null,host), inp=G.el('input','inp',null,row); inp.inputMode='numeric'; inp.placeholder='密碼'; const go=G.el('button','go','確認',row);
  go.addEventListener('click',()=>{ if(inp.value.trim()===answer)G.solve('密碼正確！關鍵字是 '+kw+'。'); else{ G.buzz(); G.shake(inp); G.hint('密碼不對。關鍵字有 '+kw.length+' 個字母，密碼就有 '+kw.length+' 位。'); } });
}}
//==GAME==
{no:'115',slug:'makesum',title:'湊數拖放',brand:'EXACT CHANGE',type:'解謎',
intro:'點硬幣把它放上秤盤，再點一次拿回來。\n要湊出剛好的金額，而且硬幣的枚數也要剛好。',
data:{unit:'元',coins:[50,50,10,10,10,10,10,5,5,5,1,1,1,1,1],rounds:[{target:66,count:4},{target:87,count:7},{target:43,count:7}]},
build:function(host,D,G){
  let r=0, picked; const stat=G.el('div','stat','',host), p=G.el('div','panel',null,host), q=G.el('div','q','',p), now=G.el('div','sub','',p);
  G.el('div','sub','秤盤',host); const pan=G.el('div','panel',null,host); pan.style.cssText+=';min-height:74px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;background:#1a2630';
  G.el('div','sub','錢包',host); const tray=G.el('div','panel',null,host); tray.style.cssText+=';display:flex;flex-wrap:wrap;gap:6px;justify-content:center';
  const go=G.el('button','go','確認',host);
  const sum=()=>picked.reduce((a,i)=>a+D.coins[i],0);
  function draw(){ const R=D.rounds[r]; stat.textContent='第 '+(r+1)+' / '+D.rounds.length+' 題'; q.textContent='湊出剛好 '+R.target+' '+D.unit+'，而且只能用 '+R.count+' 枚'; now.textContent='目前：'+sum()+' '+D.unit+'、'+picked.length+' 枚';
    pan.innerHTML=''; tray.innerHTML=''; D.coins.forEach((v,i)=>{ const inPan=picked.indexOf(i)>=0; const b=G.el('button','opt',String(v),inPan?pan:tray); b.dataset.coin=i; b.dataset.v=v;
      b.style.cssText='width:46px;height:46px;border-radius:50%;padding:0;font-family:var(--display);font-weight:700;background:'+(v>=50?'#b8935a':v>=10?'#9aa1a9':v>=5?'#8a6d3f':'#6b4a2a')+';color:#14161a';
      b.addEventListener('click',()=>{ if(inPan)picked.splice(picked.indexOf(i),1); else picked.push(i); G.tick(); draw(); }); }); }
  function start(){ picked=[]; G.t={round:D.rounds[r]}; draw(); }
  go.addEventListener('click',()=>{ const R=D.rounds[r], s=sum();
    if(s===R.target&&picked.length===R.count){ G.ok(); r++; if(r>=D.rounds.length){ G.solve('三題都湊對了！'); return; } G.hint('正確，下一題。'); start(); }
    else { G.buzz(); G.hint(s!==R.target?('金額是 '+s+'，'+(s<R.target?'還不夠':'太多了')+'。'):('金額對了，但用了 '+picked.length+' 枚，要剛好 '+R.count+' 枚。')); } });
  start();
}}
//==GAME==
{no:'116',slug:'cluebyclue',title:'逐步線索猜謎',brand:'WHO AM I',type:'解謎',
intro:'線索從最難的開始，一次只給一條。線索用得越少，分數越高。\n每回合最多猜三次，猜錯會自動多給一條線索。',
data:{attempts:3,pass:9,rounds:[
 {answer:'氧',options:['氧','氮','氫','碳','矽','氦'],clues:['我在地殼裡的含量，是所有元素中最多的。','液態的我是淡藍色的。','臭氧分子是由三個我組成的。','沒有我，火就燒不起來。','人吸氣時，身體要用的就是我。']},
 {answer:'鐵',options:['鐵','銅','鋁','鋅','銀','鉛'],clues:['地球的核心主要是我和鎳。','我的元素符號來自拉丁文 Ferrum。','血紅素裡有我，所以血是紅的。','磁鐵會吸住我。','我生鏽以後會變成紅褐色。']},
 {answer:'氦',options:['氦','氫','氖','氮','氧','氬'],clues:['我是宇宙中含量第二多的元素。','人類最早是在太陽的光譜裡發現我的。','我是所有元素裡沸點最低的。','我是惰性氣體，不會燃燒。','充了我的氣球會往上飄。']}]},
build:function(host,D,G){
  let r=0, total=0, shown, tries; const stat=G.el('div','stat','',host), cl=G.el('div','panel',null,host), more=G.el('button','pill','再給我一條線索',host), ob=G.el('div',null,null,host); ob.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%';
  function draw(){ const R=D.rounds[r]; stat.textContent='第 '+(r+1)+' / '+D.rounds.length+' 回合 · 總分 '+total+' · 可猜 '+tries+' 次'; cl.innerHTML='';
    for(let i=0;i<shown;i++){ const d=G.el('div','sub',(i+1)+'. '+R.clues[i],cl); d.style.cssText='text-align:left;font-size:15px;color:#e7e3da;padding:5px 0'; }
    G.el('div','sub','現在答對可得 '+(R.clues.length+1-shown)+' 分',cl); more.style.display=shown<R.clues.length?'':'none'; }
  function start(){ const R=D.rounds[r]; shown=1; tries=D.attempts; G.t={answer:R.answer}; ob.innerHTML='';
    G.shuffle(R.options).forEach(o=>{ const b=G.el('button','opt',o,ob); b.dataset.o=o; b.style.fontSize='18px';
      b.addEventListener('click',()=>{ if(G.solved()||b.disabled)return;
        if(o===R.answer){ const pts=R.clues.length+1-shown; total+=pts; b.classList.add('good'); G.ok(); G.hint('答對了，得 '+pts+' 分。'); lock(); G.later(next,1100); }
        else { b.classList.add('bad'); b.disabled=true; tries--; G.buzz(); if(shown<R.clues.length)shown++;
          if(tries<=0){ G.hint('三次都沒猜中，答案是「'+R.answer+'」，這回合 0 分。'); lock(); G.later(next,1800); } else G.hint('不是它，多給你一條線索。'); draw(); } }); });
    draw(); }
  function lock(){ [].forEach.call(ob.children,b=>{b.disabled=true;}); more.style.display='none'; }
  more.addEventListener('click',()=>{ if(shown<D.rounds[r].clues.length){ shown++; G.tick(); draw(); } });
  function next(){ r++; G.hint(''); if(r<D.rounds.length){ start(); return; }
    if(total>=D.pass)G.solve('總分 '+total+' 分，過關！'); else { G.hint('總分 '+total+' 分，要 '+D.pass+' 分才過關。再挑戰一次。'); G.later(()=>G.restart(),2200); } }
  start();
}}
