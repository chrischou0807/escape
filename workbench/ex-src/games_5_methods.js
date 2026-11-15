//==GAME==
{no:'140',slug:'mirrorcut',title:'鏡射字母剪半',brand:'CUT THE MIRROR',type:'操作',
intro:'每個怪符號，都是一個英文字母和它的鏡像疊在一起。\n點符號的左半或右半，決定要留下哪一邊。全部留對，就讀得出單字，再選出它的意思。',
data:{rounds:[{word:'MUSEUM',opts:['博物館','音樂','蘑菇'],a:0},{word:'REPAIR',opts:['修理','重複','報告'],a:0},{word:'ANCIENT',opts:['古老的','生氣的','焦慮的'],a:0}]},
build:function(host,D,G){
  let r=0; const stat=G.el('div','stat','',host), row=G.el('div','row',null,host), go=G.el('button','go','剪好了',host), area=G.el('div',null,null,host); area.style.width='100%'; row.style.cssText='gap:6px;flex-wrap:nowrap';
  function start(){ const R=D.rounds[r], w=String(R.word).toUpperCase(), n=w.length; stat.textContent='第 '+(r+1)+' / '+D.rounds.length+' 個單字'; row.innerHTML=''; area.innerHTML=''; go.style.display='';
    const W=Math.max(34,Math.min(60,Math.floor(((row.clientWidth||340)-6*(n-1))/n))), fs=Math.floor(W*0.78);
    const st=w.split('').map(ch=>({ch:ch,real:G.rnd(2)?'L':'R',pick:null})); G.t={st:st,word:w,it:R};
    st.forEach((s,i)=>{ const box=G.el('div',null,null,row); box.style.cssText='position:relative;flex:0 0 auto;width:'+W+'px;height:'+Math.floor(W*1.25)+'px;border-radius:8px;background:var(--graphite);border:1px solid var(--line);overflow:hidden;cursor:pointer';
      const mk=(mir)=>{ const e=G.el('div',null,s.ch,box); e.style.cssText='position:absolute;top:0;bottom:0;width:70%;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:700;font-size:'+fs+'px;color:var(--amber);transform:'+(mir?'scaleX(-1)':'none'); return e; };
      const L=mk(s.real!=='L'), Rr=mk(s.real!=='R');
      const draw=()=>{ if(s.pick===null){ L.style.display='flex'; Rr.style.display='flex'; L.style.left='0'; L.style.width='70%'; Rr.style.left='30%'; Rr.style.width='70%'; L.style.opacity=Rr.style.opacity='.85'; }
        else { const keep=s.pick==='L'?L:Rr, drop=s.pick==='L'?Rr:L; drop.style.display='none'; keep.style.display='flex'; keep.style.left='0'; keep.style.width='100%'; keep.style.opacity='1'; } };
      draw(); box.dataset.g=i;
      box.addEventListener('click',e=>{ if(G.solved()||area.children.length)return; const b=box.getBoundingClientRect(); const side=(e.clientX-b.left)<b.width/2?'L':'R'; s.pick=(s.pick===null)?side:null; G.tick(); draw(); });
      s.set=(side)=>{s.pick=side;draw();}; });
    go.onclick=()=>{ if(area.children.length)return; if(st.some(s=>s.pick===null)){ G.hint('還有符號沒剪。點符號的左半或右半。'); return; }
      const bad=st.filter(s=>s.pick!==s.real).length; if(bad){ G.buzz(); G.shake(row); G.hint('有 '+bad+' 個字母留到鏡像那一邊了，是反的。點它一下可以重剪。'); return; }
      G.ok(); G.hint('讀得出來了：'+w); go.style.display='none';
      G.mc(area,w+' 是什麼意思？',R.opts,R.a,(right)=>{ if(right){ r++; G.later(()=>{ if(r>=D.rounds.length)G.solve('三個單字都還原了！'); else { G.hint(''); start(); } },800); } else { G.hint('意思不對，重新來過。'); G.later(()=>G.restart(),1500); } }); };
  }
  start();
}}
//==GAME==
{no:'141',slug:'radicals',title:'部件組字',brand:'BUILD A CHARACTER',type:'解謎',
intro:'依照提示，從下面挑出兩個部件，放進正確的位置，組成一個字。\n點部件放上去，點格子把它拿回來。位置放反了不算。',
data:{extra:'日木氵心',rounds:[{clue:'鳥的叫聲',layout:'lr',parts:['口','鳥'],answer:'鳴'},{clue:'春天開在枝頭上的東西',layout:'tb',parts:['艹','化'],answer:'花'},{clue:'李白、杜甫寫的作品',layout:'lr',parts:['言','寺'],answer:'詩'}]},
build:function(host,D,G){
  let r=0; const stat=G.el('div','stat','',host), p=G.el('div','panel',null,host), q=G.el('div','q','',p), frame=G.el('div',null,null,host), big=G.el('div','q','',host), tray=G.el('div','row',null,host);
  big.style.cssText='font-size:64px;min-height:80px;color:var(--amber)';
  const pool=[]; D.rounds.forEach(R=>R.parts.forEach(x=>{ if(pool.indexOf(x)<0)pool.push(x); })); String(D.extra||'').split('').forEach(x=>{ if(pool.indexOf(x)<0)pool.push(x); });
  function start(){ const R=D.rounds[r]; G.t={it:R}; stat.textContent='第 '+(r+1)+' / '+D.rounds.length+' 個字'; q.textContent=R.clue+'（'+(R.layout==='lr'?'左右':'上下')+'結構）'; big.textContent=''; frame.innerHTML=''; tray.innerHTML='';
    frame.style.cssText='display:flex;gap:6px;padding:8px;border:2px dashed var(--brass-lo);border-radius:14px;flex-direction:'+(R.layout==='lr'?'row':'column'); const fill=[null,null], names=R.layout==='lr'?['左','右']:['上','下'];
    const slots=names.map((nm,i)=>{ const s=G.el('div','cell',nm,frame); s.dataset.slot=i; s.style.cssText='width:'+(R.layout==='lr'?70:120)+'px;height:'+(R.layout==='lr'?120:60)+'px;font-size:30px;color:var(--txt-dim)';
      s.addEventListener('click',()=>{ if(fill[i]===null)return; fill[i]=null; s.textContent=nm; s.style.color='var(--txt-dim)'; G.tick(); }); return s; });
    G.shuffle(pool).forEach(ch=>{ const b=G.el('button','opt',ch,tray); b.dataset.part=ch; b.style.cssText='width:54px;height:56px;padding:0;font-size:26px';
      b.addEventListener('click',()=>{ if(big.textContent)return; const i=fill.indexOf(null); if(i<0)return; fill[i]=ch; slots[i].textContent=ch; slots[i].style.color='var(--amber)'; G.tick();
        if(fill.indexOf(null)<0){ if(fill[0]===R.parts[0]&&fill[1]===R.parts[1]){ big.textContent=R.answer; G.ok(); G.hint(R.parts[0]+' 加 '+R.parts[1]+'，是「'+R.answer+'」。'); r++; G.later(()=>{ if(r>=D.rounds.length)G.solve('三個字都組出來了：'+D.rounds.map(x=>x.answer).join('、')); else { G.hint(''); start(); } },1300); }
          else { G.buzz(); G.shake(frame); G.hint(fill[0]===R.parts[1]&&fill[1]===R.parts[0]?'部件對了，位置放反了。':'這兩個部件組不出提示說的字。'); G.later(()=>{ fill[0]=fill[1]=null; slots.forEach((s,k)=>{s.textContent=names[k];s.style.color='var(--txt-dim)';}); },600); } } }); }); }
  start();
}}
//==GAME==
{no:'142',slug:'elementcode',title:'原子序密碼',brand:'ELEMENT CODE',type:'解謎',
intro:'每個數字是一個元素的原子序。查表把數字換成元素符號，\n把符號連起來，就是一個英文單字。',
data:{showTable:true,table:[{n:1,s:'H'},{n:2,s:'He'},{n:5,s:'B'},{n:6,s:'C'},{n:7,s:'N'},{n:8,s:'O'},{n:11,s:'Na'},{n:20,s:'Ca'},{n:26,s:'Fe'},{n:29,s:'Cu'},{n:39,s:'Y'},{n:47,s:'Ag'},{n:50,s:'Sn'},{n:53,s:'I'},{n:60,s:'Nd'},{n:74,s:'W'},{n:79,s:'Au'},{n:88,s:'Ra'}],
 rounds:[{codes:[50,8,74],answer:'SNOW',clue:'冬天從天上飄下來的東西'},{codes:[5,88,53,7],answer:'BRAIN',clue:'你現在正在用它思考'},{codes:[20,60,39],answer:'CANDY',clue:'甜甜的，小孩最愛'}]},
build:function(host,D,G){
  let r=0; const stat=G.el('div','stat','',host), p=G.el('div','panel',null,host), code=G.el('div','row',null,p), clue=G.el('div','sub','',p); clue.style.marginTop='8px';
  if(D.showTable){ const tb=G.el('div',null,null,host); tb.style.cssText='display:grid;grid-template-columns:repeat(6,1fr);gap:5px;width:100%';
    D.table.slice().sort((a,b)=>a.n-b.n).forEach(e=>{ const c=G.el('div','cell',null,tb); c.style.cssText='flex-direction:column;padding:6px 0;cursor:default'; const a=G.el('div',null,String(e.n),c); a.style.cssText='font-size:11px;color:var(--txt-dim)'; const b=G.el('div',null,e.s,c); b.style.cssText='font-size:18px;color:var(--amber)'; }); }
  const row=G.el('div','row',null,host), inp=G.el('input','inp',null,row); inp.placeholder='英文單字'; inp.autocapitalize='characters'; const go=G.el('button','go','確認',row);
  function start(){ const R=D.rounds[r]; G.t={answer:R.answer}; stat.textContent='第 '+(r+1)+' / '+D.rounds.length+' 題'; code.innerHTML=''; inp.value='';
    R.codes.forEach(n=>{ const c=G.el('div','cell',String(n),code); c.style.cssText='width:58px;height:54px;font-size:24px;cursor:default'; }); clue.textContent='提示：'+R.clue+'（'+String(R.answer).length+' 個字母）'; }
  function submit(){ if(G.solved())return; const R=D.rounds[r]; if(inp.value.replace(/\s+/g,'').toUpperCase()===String(R.answer).toUpperCase()){ G.ok(); r++; if(r>=D.rounds.length){ G.solve('三個單字都解出來了！'); return; } G.hint('正確，下一題。'); start(); }
    else { G.buzz(); G.shake(inp); G.hint('不對。一個原子序換一個元素符號，有的符號是兩個字母。'); } }
  go.addEventListener('click',submit); inp.addEventListener('keydown',e=>{ if(e.key==='Enter')submit(); });
  start();
}}
//==GAME==
{no:'143',slug:'rulemachine',title:'規則機器',brand:'RULE MACHINE',type:'解謎',
intro:'機器把左邊的東西變成右邊的數字，但沒有人告訴你規則。\n看懂例子，推出規則，算出問號是多少。每一題只能猜三次。',
data:{tries:3,rounds:[{examples:[['3',7],['5',11],['10',21]],ask:'8',answer:17,rule:'乘 2 再加 1'},{examples:[['2',5],['3',10],['4',17]],ask:'6',answer:37,rule:'自己乘自己，再加 1'},
 {examples:[['6',1],['8',2],['90',2],['123',0]],ask:'6889',answer:6,rule:'數一數每個數字裡有幾個「圈」：6、9、0 各一個，8 有兩個'}]},
build:function(host,D,G){
  let r=0, tries; const stat=G.el('div','stat','',host), p=G.el('div','panel',null,host), row=G.el('div','row',null,host), inp=G.el('input','inp',null,row); inp.inputMode='numeric'; inp.placeholder='？'; inp.style.maxWidth='140px'; const go=G.el('button','go','送出',row);
  const line=(a,b,hot)=>{ const d=G.el('div','q',null,p); d.style.cssText='font-family:var(--display);font-size:26px;padding:4px 0;'+(hot?'color:var(--amber)':''); d.textContent=a+'　→　'+b; return d; };
  function start(){ const R=D.rounds[r]; tries=D.tries; G.t={answer:R.answer}; p.innerHTML=''; inp.value=''; R.examples.forEach(e=>line(e[0],e[1])); line(R.ask,'？',true); draw(); }
  const draw=()=>{ stat.textContent='第 '+(r+1)+' / '+D.rounds.length+' 台機器 · 還能猜 '+tries+' 次'; };
  function submit(){ if(G.solved()||tries<=0)return; const R=D.rounds[r]; if(inp.value.trim()==='')return;
    if(Number(inp.value)===Number(R.answer)){ G.ok(); G.hint('答對了。規則是：'+R.rule); r++; G.later(()=>{ if(r>=D.rounds.length)G.solve('三台機器的規則都被你看穿了！'); else { G.hint(''); start(); } },2200); tries=0; go.disabled=true; G.later(()=>{go.disabled=false;},2200); return; }
    tries--; draw(); G.buzz(); G.shake(inp); if(tries<=0){ G.hint('三次都沒猜中。規則是：'+R.rule+'。重新來過。'); G.later(()=>G.restart(),3200); } else G.hint('不對。把你想的規則拿去驗算每一個例子。'); }
  go.addEventListener('click',submit); inp.addEventListener('keydown',e=>{ if(e.key==='Enter')submit(); });
  start();
}}
//==GAME==
{no:'144',slug:'compasswalk',title:'方位走格子',brand:'COMPASS WALK',type:'探索',
intro:'從 ★ 出發，照著方位指令一格一格走，把踩到的字依序讀出來。\n注意：這張地圖的「北」不一定在上面，先看指北針。走錯要從頭來。',
data:{size:5,rotate:true,answer:'北回歸線通過嘉義',filler:'山河海島港灣平原丘陵盆地溪湖臺東西南中高雄花蓮宜蘭'},
build:function(host,D,G){
  const n=D.size, ans=String(D.answer).split(''), L=ans.length; const VEC=[[-1,0],[0,1],[1,0],[0,-1]], ARW=['↑','→','↓','←'];
  const north=D.rotate?1+G.rnd(3):0, dirName=(m)=>{ const k=(VEC.findIndex(v=>v[0]===m[0]&&v[1]===m[1])-north+4)%4; return ['北','東','南','西'][k]; };
  let path=null, start=null;
  for(let t=0;t<400&&!path;t++){ const s=[G.rnd(n),G.rnd(n)], seen=new Set([s[0]*n+s[1]]), ps=[]; let c=s, ok=true;
    for(let k=0;k<L;k++){ const opts=G.shuffle(VEC).map(v=>[c[0]+v[0],c[1]+v[1],v]).filter(x=>x[0]>=0&&x[0]<n&&x[1]>=0&&x[1]<n&&!seen.has(x[0]*n+x[1])); if(!opts.length){ok=false;break;} c=[opts[0][0],opts[0][1]]; seen.add(c[0]*n+c[1]); ps.push({cell:c[0]*n+c[1],mv:opts[0][2]}); }
    if(ok){ path=ps; start=s[0]*n+s[1]; } }
  if(!path)throw new Error('path not found');
  const grid=new Array(n*n).fill(''), fl=String(D.filler).split('').filter(ch=>ans.indexOf(ch)<0); path.forEach((p,i)=>{grid[p.cell]=ans[i];}); for(let i=0;i<n*n;i++)if(!grid[i]&&i!==start)grid[i]=fl[G.rnd(fl.length)];
  G.t={path:path.map(p=>p.cell),start:start,north:north};
  const row=G.el('div','row',null,host), comp=G.el('div','stat','指北針：北 '+ARW[north],row), stat=G.el('div','stat','',row); comp.style.fontSize='16px';
  const ins=G.el('div','panel',null,host); ins.style.cssText+=';display:flex;flex-wrap:wrap;gap:6px;justify-content:center'; const chips=path.map((p,i)=>{ const c=G.el('div','cell',dirName(p.mv),ins); c.style.cssText='width:36px;height:36px;font-size:16px;cursor:default'; return c; });
  const board=G.el('div',null,null,host); board.style.cssText='display:grid;gap:4px;width:100%;grid-template-columns:repeat('+n+',1fr)'; const read=G.el('div','q','',host); read.style.cssText='min-height:34px;font-size:22px;letter-spacing:3px;color:var(--amber)';
  let k=0, miss=0; const cells=[];
  const draw=()=>{ stat.textContent='走了 '+k+' / '+L+' 步 · 走錯 '+miss+' 次'; read.textContent=ans.slice(0,k).join(''); chips.forEach((c,i)=>{c.style.background=i<k?'#21382b':'';c.style.color=i<k?'var(--good)':'';}); };
  for(let i=0;i<n*n;i++){ const c=G.el('div','cell',i===start?'★':grid[i],board); c.dataset.i=i; c.style.cssText='aspect-ratio:1;font-size:22px'+(i===start?';color:var(--amber);background:#3a3323':''); cells.push(c);
    c.addEventListener('click',()=>{ if(G.solved()||i===start)return;
      if(i===path[k].cell){ c.style.background='#21382b'; c.style.color='var(--good)'; k++; G.tone(420+k*40,0.08,'sine',0.05); draw(); if(k===L)G.solve('你走出來的句子是：'+D.answer); }
      else { miss++; G.buzz(); G.shake(board); G.hint('方向不對，回到 ★ 重新走。再看一次指北針。'); k=0; cells.forEach((x,j)=>{ if(j!==start){x.style.background='';x.style.color='';} }); draw(); } }); }
  draw();
}}
//==GAME==
{no:'145',slug:'labelcheck',title:'標籤貼錯了',brand:'WRONG LABELS',type:'探索',
intro:'工具牆上的標籤幾乎全貼錯了，每一輪只有一個是對的。\n在時間內找出「圖和字一致」的那一個。字的顏色是來干擾你的。',
data:{rounds:5,maxMiss:2,seconds:8,items:[{icon:'🔨',name:'鐵鎚'},{icon:'🔧',name:'扳手'},{icon:'✂️',name:'剪刀'},{icon:'📏',name:'直尺'},{icon:'🔩',name:'螺栓'},{icon:'🧲',name:'磁鐵'},{icon:'🔋',name:'電池'},{icon:'💡',name:'燈泡'}]},
build:function(host,D,G){
  if(D.items.length<6)throw new Error('need 6 items'); let r=0, miss=0, left=0, lock=false; const cols=['#e8857a','#7fce9b','#7fb7ff','#ffce78','#c79bff','#6fd6d6'];
  const stat=G.el('div','stat','',host), barW=G.el('div',null,null,host); barW.style.cssText='width:100%;height:10px;border-radius:999px;background:#13171c;overflow:hidden'; const bar=G.el('div',null,null,barW); bar.style.cssText='height:100%;width:100%;background:var(--amber)';
  const grid=G.el('div',null,null,host); grid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%';
  const draw=()=>{ stat.textContent='第 '+Math.min(r+1,D.rounds)+' / '+D.rounds+' 輪 · 失誤 '+miss+' / '+D.maxMiss; };
  function end(){ if(miss<=D.maxMiss)G.solve('五輪完成，失誤 '+miss+' 次。'); else { G.hint('失誤太多次，重新來過。'); G.later(()=>G.restart(),1800); } }
  function fail(msg){ if(lock)return; lock=true; miss++; G.buzz(); G.hint(msg); draw(); r++; G.later(next,1100); }
  function next(){ if(r>=D.rounds||miss>D.maxMiss){ end(); return; } lock=false; grid.innerHTML=''; draw(); left=D.seconds;
    const six=G.shuffle(D.items).slice(0,6), okI=G.rnd(6), others=six.filter((x,i)=>i!==okI); let lab; do{ lab=G.shuffle(others); }while(lab.some((x,i)=>x===others[i]));
    let j=0; G.t={ok:okI,lock:()=>lock};
    six.forEach((it,i)=>{ const name=(i===okI)?it.name:lab[j++].name; const b=G.el('button','opt',null,grid); b.dataset.card=i; b.style.cssText='padding:14px 4px;display:flex;flex-direction:column;align-items:center;gap:4px';
      const ic=G.el('div',null,it.icon,b); ic.style.fontSize='34px'; const t=G.el('div',null,name,b); t.style.cssText='font-size:17px;font-weight:700;color:'+cols[G.rnd(cols.length)];
      b.addEventListener('click',()=>{ if(lock||G.solved())return; if(i===okI){ lock=true; b.classList.add('good'); G.ok(); G.hint(''); r++; G.later(next,600); } else { b.classList.add('bad'); fail('這張貼錯了：圖是'+it.name+'，字卻寫'+name+'。'); } }); }); }
  G.every(()=>{ if(lock||G.solved()||r>=D.rounds)return; left-=0.1; bar.style.width=Math.max(0,left/D.seconds*100)+'%'; if(left<=0)fail('時間到。'); },100);
  next();
}}
