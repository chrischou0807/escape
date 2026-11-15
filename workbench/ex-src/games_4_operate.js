//==GAME==
{no:'125',slug:'sliderail',title:'滑軌機關',brand:'SLIDING BOLTS',type:'操作',
intro:'每一塊木栓都卡在軌道上：橫的只能左右滑，直的只能上下滑。\n把擋路的木栓移開，讓金色的鑰匙栓從右邊的缺口滑出去。',
data:{size:6,exitRow:2,blocks:[{dir:'h',r:2,c:0,len:2,target:true},{dir:'v',r:2,c:2,len:2},{dir:'v',r:1,c:4,len:2},{dir:'v',r:4,c:2,len:2},{dir:'v',r:3,c:1,len:2},{dir:'v',r:3,c:4,len:2},{dir:'h',r:0,c:1,len:2},{dir:'v',r:0,c:0,len:2}]},
build:function(host,D,G){
  const n=D.size, B=D.blocks.map(b=>Object.assign({},b)); let moves=0; const stat=G.el('div','stat','',host);
  const wrap=G.el('div',null,null,host); wrap.style.cssText='position:relative;width:100%;aspect-ratio:1;border-radius:12px;background:#2a1f13;border:3px solid #6b4a2a';
  const exit=G.el('div',null,'➜',wrap); exit.style.cssText='position:absolute;right:-3px;width:10px;background:#161a20;color:var(--amber);font-size:10px;display:flex;align-items:center;top:'+(D.exitRow*100/n)+'%;height:'+(100/n)+'%';
  const occ=(skip)=>{ const o=new Set(); B.forEach((b,i)=>{ if(i===skip)return; for(let k=0;k<b.len;k++)o.add((b.dir==='h'?b.r:b.r+k)*n+(b.dir==='h'?b.c+k:b.c)); }); return o; };
  function range(i){ const b=B[i], o=occ(i); let lo=0, hi=0;
    if(b.dir==='h'){ while(b.c+lo-1>=0&&!o.has(b.r*n+b.c+lo-1))lo--; while(b.c+b.len+hi<n&&!o.has(b.r*n+b.c+b.len+hi))hi++; }
    else { while(b.r+lo-1>=0&&!o.has((b.r+lo-1)*n+b.c))lo--; while(b.r+b.len+hi<n&&!o.has((b.r+b.len+hi)*n+b.c))hi++; }
    return [lo,hi]; }
  const els=B.map((b,i)=>{ const e=G.el('div',null,b.target?'🗝️':'',wrap); e.dataset.block=i;
    e.style.cssText='position:absolute;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:22px;cursor:grab;box-shadow:inset 0 0 0 2px rgba(0,0,0,.35);background:'+(b.target?'linear-gradient(180deg,#ffce78,#b8935a)':'linear-gradient(180deg,#a07a4f,#7a5a3a)');
    let rg=[0,0], d=0; G.drag(e,{start:()=>{rg=range(i);d=0;},move:(dx,dy)=>{ const cell=wrap.clientWidth/n; d=Math.max(rg[0]*cell,Math.min(rg[1]*cell,b.dir==='h'?dx:dy)); e.style.transform=b.dir==='h'?'translateX('+d+'px)':'translateY('+d+'px)'; },
      end:()=>{ const cell=wrap.clientWidth/n; e.style.transform=''; move(i,Math.round(d/cell)); }}); return e; });
  function place(){ B.forEach((b,i)=>{ const e=els[i], w=(b.dir==='h'?b.len:1), h=(b.dir==='h'?1:b.len); e.style.left=(b.c*100/n+0.8)+'%'; e.style.top=(b.r*100/n+0.8)+'%'; e.style.width=(w*100/n-1.6)+'%'; e.style.height=(h*100/n-1.6)+'%'; }); stat.textContent='移動 '+moves+' 步'; }
  function move(i,k){ if(!k||G.solved())return; const rg=range(i); k=Math.max(rg[0],Math.min(rg[1],k)); if(!k)return; const b=B[i]; if(b.dir==='h')b.c+=k; else b.r+=k; moves++; G.tick(); place();
    if(b.target&&b.r===D.exitRow&&b.c+b.len===n)G.solve('鑰匙栓滑出來了！共移動 '+moves+' 步。'); }
  G.t={B:B,n:n,move:move,range:range}; place();
}}
//==GAME==
{no:'126',slug:'eyedropper',title:'取色染色',brand:'INDICATOR',type:'操作',
intro:'先點色卡吸取顏色，再點試管，把它染成「滴入石蕊試液後」應該出現的顏色。\n六支都染好再按檢查。',
data:{rule:'石蕊試液：遇酸變紅、遇鹼變藍、中性維持紫色。',checks:3,swatches:[{name:'紅',hex:'#d9534f'},{name:'紫',hex:'#8e6bbf'},{name:'藍',hex:'#4a7fd9'}],
 tubes:[{label:'檸檬汁',color:0},{label:'肥皂水',color:2},{label:'純水',color:1},{label:'食醋',color:0},{label:'小蘇打水',color:2},{label:'食鹽水',color:1}]},
build:function(host,D,G){
  let cur=-1, checks=D.checks; const got=D.tubes.map(()=>-1); G.t={tubes:D.tubes};
  G.el('div','q',D.rule,G.el('div','panel',null,host));
  const pal=G.el('div','row',null,host); const sw=D.swatches.map((s,i)=>{ const b=G.el('button','opt','💧 '+s.name,pal); b.dataset.sw=i; b.style.cssText='border-bottom:6px solid '+s.hex;
    b.addEventListener('click',()=>{cur=i;sw.forEach((x,j)=>x.classList.toggle('on',j===i));G.tick();G.hint('已吸取'+s.name+'色，點試管染色。');}); return b; });
  const rack=G.el('div',null,null,host); rack.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:12px;width:100%';
  D.tubes.forEach((t,i)=>{ const w=G.el('div',null,null,rack); w.style.cssText='display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer'; w.dataset.tube=i;
    const tube=G.el('div',null,null,w); tube.style.cssText='width:44px;height:96px;border-radius:6px 6px 22px 22px;border:2px solid rgba(255,255,255,.5);background:linear-gradient(180deg,transparent 30%,rgba(255,255,255,.12) 30%)'; G.el('div','sub',t.label,w);
    w.addEventListener('click',()=>{ if(cur<0){ G.hint('先點上面的色卡吸取顏色。'); return; } got[i]=cur; tube.style.background='linear-gradient(180deg,transparent 30%,'+D.swatches[cur].hex+' 30%)'; G.tick(); }); });
  const go=G.el('button','go','',host); const lab=()=>{go.textContent='檢查（剩 '+checks+' 次）';}; lab();
  go.addEventListener('click',()=>{ if(G.solved())return; if(got.indexOf(-1)>=0){ G.hint('還有試管沒染色。'); return; } const bad=got.filter((g,i)=>g!==D.tubes[i].color).length;
    if(!bad){ G.solve('六支試管的顏色都正確！'); return; } checks--; lab(); G.buzz(); G.hint('有 '+bad+' 支顏色不對。');
    if(checks<=0){ G.hint('檢查次數用完，重新來過。'); G.later(()=>G.restart(),1500); } });
}}
//==GAME==
{no:'127',slug:'lasso',title:'畫線圈地分類',brand:'LASSO',type:'操作',
intro:'用手指在場地上畫一個圈，把屬於指定類別的東西圈起來。\n可以分好幾次圈；但只要圈到不該圈的，就扣一條命。',
data:{lives:3,levels:[{label:'哺乳類',yes:['海豚','蝙蝠','大象','鯨魚'],no:['鯊魚','企鵝','烏龜','老鷹','青蛙']},{label:'昆蟲',yes:['蜜蜂','蝴蝶','螞蟻','蜻蜓'],no:['蜘蛛','蠍子','蝸牛','蜈蚣','蚯蚓']}]},
build:function(host,D,G){
  let lv=0, lives=D.lives, items=[]; const stat=G.el('div','stat','',host), p=G.el('div','panel',null,host), q=G.el('div','q','',p);
  const field=G.el('div',null,null,host); field.style.cssText='position:relative;width:100%;aspect-ratio:1;border-radius:14px;background:#22303a;border:1px solid var(--line);overflow:hidden';
  const layer=G.el('div',null,null,field); layer.style.cssText='position:absolute;inset:0';
  const cv=G.el('canvas','nodrag',null,field); cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:3'; const W=field.clientWidth||340; cv.width=W; cv.height=W; const ctx=cv.getContext('2d');
  const draw=()=>{ stat.textContent='第 '+(lv+1)+' / '+D.levels.length+' 關 · 生命 '+'❤'.repeat(lives); };
  function start(){ const L=D.levels[lv]; q.textContent='把所有「'+L.label+'」圈起來'; layer.innerHTML=''; ctx.clearRect(0,0,W,W);
    const all=L.yes.map(t=>({t:t,yes:true})).concat(L.no.map(t=>({t:t,yes:false}))); if(all.length>16)throw new Error('too many items');
    const slots=G.shuffle([...Array(16).keys()]);
    items=all.map((it,i)=>{ const s=slots[i], x=((s%4)+0.5+(Math.random()-0.5)*0.3)/4, y=(Math.floor(s/4)+0.5+(Math.random()-0.5)*0.3)/4;
      const e=G.el('div',null,it.t,layer); e.style.cssText='position:absolute;transform:translate(-50%,-50%);left:'+(x*100)+'%;top:'+(y*100)+'%;padding:6px 9px;border-radius:999px;background:var(--graphite);border:1px solid var(--line);font-size:13px;white-space:nowrap';
      return {t:it.t,yes:it.yes,x:x,y:y,done:false,e:e}; });
    G.t={items:items,lasso:lasso}; draw(); }
  const inside=(pt,poly)=>{ let c=false; for(let i=0,j=poly.length-1;i<poly.length;j=i++){ const a=poly[i],b=poly[j]; if(((a[1]>pt[1])!==(b[1]>pt[1]))&&(pt[0]<(b[0]-a[0])*(pt[1]-a[1])/(b[1]-a[1])+a[0]))c=!c; } return c; };
  function lasso(poly){ if(G.solved()||lives<=0||poly.length<3)return; const hit=items.filter(it=>!it.done&&inside([it.x,it.y],poly)); if(!hit.length){ G.hint('圈裡面沒有東西。'); return; }
    const bad=hit.filter(it=>!it.yes);
    if(bad.length){ lives--; G.buzz(); G.shake(field); bad.forEach(it=>{it.e.style.borderColor='var(--bad)';it.e.style.color='var(--bad)';}); G.hint('圈到了「'+bad.map(b=>b.t).join('、')+'」，扣一條命。'); draw();
      if(lives<=0){ G.hint('生命用完了，重新來過。'); G.later(()=>G.restart(),1700); } return; }
    hit.forEach(it=>{it.done=true;it.e.style.background='#21382b';it.e.style.color='var(--good)';it.e.style.borderColor='var(--good)';}); G.ok(); G.hint('');
    if(items.every(it=>!it.yes||it.done)){ lv++; if(lv>=D.levels.length){ G.solve('兩關都圈對了！'); return; } G.hint('這一關完成，下一關。'); G.later(start,900); } }
  let path=null; const pt=e=>{ const r=cv.getBoundingClientRect(); return [(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]; };
  G.drag(cv,{start:e=>{ path=[pt(e)]; ctx.clearRect(0,0,W,W); },
    move:(dx,dy,e)=>{ const a=path[path.length-1], b=pt(e); path.push(b); ctx.strokeStyle='#ffce78'; ctx.lineWidth=3; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(a[0]*W,a[1]*W); ctx.lineTo(b[0]*W,b[1]*W); ctx.stroke(); },
    end:()=>{ const pth=path; path=null; G.later(()=>ctx.clearRect(0,0,W,W),350); if(pth)lasso(pth); }});
  start();
}}
//==GAME==
{no:'128',slug:'crossswitch',title:'跨頁開關',brand:'TWO ROOMS',type:'操作',
intro:'開關在配電室，燈卻在走廊，兩邊沒辦法同時看到。\n依照走廊牆上的說明，回配電室把開關扳成正確的組合，再回走廊推門。',
data:{switches:['A','B','C','D'],goalText:'綠燈亮、黃燈亮、紅燈滅，門才會開。',
 lamps:[{name:'綠燈',hex:'#7fce9b',rule:'A 和 B 都打開才會亮',op:'and',in:[0,1],goal:true},{name:'黃燈',hex:'#f0c04a',rule:'B 和 C 只有一個打開才會亮',op:'xor',in:[1,2],goal:true},{name:'紅燈',hex:'#e8857a',rule:'D 關著才會亮',op:'not',in:[3],goal:false}]},
build:function(host,D,G){
  const sw=D.switches.map(()=>false); let trips=0; G.t={sw:sw};
  const lit=L=>{ const v=L.in.map(i=>sw[i]); return L.op==='and'?v.every(x=>x):L.op==='or'?v.some(x=>x):L.op==='xor'?v.filter(x=>x).length===1:!v[0]; };
  const tabs=G.el('div','row',null,host), room=G.el('div','panel',null,host); room.style.minHeight='260px';
  const tb=['配電室','走廊'].map((t,i)=>{ const b=G.el('button','opt',t,tabs); b.dataset.room=i; b.addEventListener('click',()=>{ if(cur!==i)trips++; show(i); }); return b; }); let cur=-1;
  function show(i){ cur=i; tb.forEach((b,j)=>b.classList.toggle('on',j===i)); room.innerHTML=''; G.tick();
    if(i===0){ G.el('div','sub','這裡看不到走廊的燈。',room); const r=G.el('div','row',null,room); r.style.marginTop='14px';
      D.switches.forEach((s,k)=>{ const b=G.el('button','opt',null,r); b.dataset.sw=k; b.style.cssText='width:64px;padding:16px 0;font-family:var(--display);font-weight:700';
        const d=()=>{ b.textContent=s+'\n'+(sw[k]?'開':'關'); b.style.whiteSpace='pre'; b.classList.toggle('on',sw[k]); }; d(); b.addEventListener('click',()=>{sw[k]=!sw[k];d();G.tick();}); }); }
    else { const r=G.el('div','row',null,room); D.lamps.forEach(L=>{ const on=lit(L); const w=G.el('div',null,null,r); w.style.cssText='display:flex;flex-direction:column;align-items:center;gap:4px;width:30%';
        const bulb=G.el('div',null,null,w); bulb.style.cssText='width:46px;height:46px;border-radius:50%;border:2px solid '+L.hex+';background:'+(on?L.hex:'transparent')+';box-shadow:'+(on?'0 0 18px '+L.hex:'none'); G.el('div','sub',L.name+(on?'（亮）':'（滅）'),w); });
      D.lamps.forEach(L=>{ const d=G.el('div','sub',L.name+'：'+L.rule,room); d.style.cssText='text-align:left;margin-top:8px;color:#e7e3da'; });
      const g=G.el('div','sub',D.goalText,room); g.style.cssText='margin-top:10px;color:var(--amber)';
      const door=G.el('button','go','🚪 推門',room); door.style.marginTop='12px'; door.dataset.door='1';
      door.addEventListener('click',()=>{ if(D.lamps.every(L=>lit(L)===L.goal))G.solve('門開了！你來回走了 '+trips+' 趟。'); else{ G.buzz(); G.shake(door); G.hint('門鎖著。燈號還不對。'); } }); } }
  show(1);
}}
//==GAME==
{no:'129',slug:'eitheror',title:'互斥切換',brand:'EITHER OR',type:'操作',
intro:'每句話裡有一塊可以翻面的牌子，兩面寫著不同的詞，一次只會出現一面。\n點牌子翻面，讓每一句話都變成正確的。',
data:{checks:2,items:[{pre:'水在 ',a:'0°C',b:'100°C',post:' 會結冰',correct:'a'},{pre:'月球繞著 ',a:'太陽',b:'地球',post:' 公轉',correct:'b'},{pre:'聲音在 ',a:'空氣',b:'鋼鐵',post:' 裡傳得比較快',correct:'b'},
 {pre:'植物主要靠 ',a:'根',b:'葉',post:' 行光合作用',correct:'b'},{pre:'三角形的內角和是 ',a:'180',b:'360',post:' 度',correct:'a'}]},
build:function(host,D,G){
  let checks=D.checks; const side=D.items.map(()=>G.rnd(2)?'a':'b'); G.t={items:D.items,side:side};
  const p=G.el('div','panel',null,host);
  D.items.forEach((it,i)=>{ const r=G.el('div','q',null,p); r.style.cssText='text-align:left;padding:8px 0;font-size:16px'; r.appendChild(document.createTextNode(it.pre));
    const b=G.el('button','opt on',it[side[i]],r); b.dataset.flip=i; b.style.cssText='display:inline-block;padding:6px 14px;font-weight:700';
    b.addEventListener('click',()=>{ side[i]=side[i]==='a'?'b':'a'; b.textContent=it[side[i]]; G.tick(); }); r.appendChild(document.createTextNode(it.post)); });
  const go=G.el('button','go','',host); const lab=()=>{go.textContent='檢查（剩 '+checks+' 次）';}; lab();
  go.addEventListener('click',()=>{ if(G.solved())return; const bad=D.items.filter((it,i)=>side[i]!==it.correct).length; if(!bad){ G.solve('每一句都正確！'); return; }
    checks--; lab(); G.buzz(); G.hint('有 '+bad+' 句不對。'); if(checks<=0){ G.hint('檢查次數用完，重新來過。'); G.later(()=>G.restart(),1500); } });
}}
//==GAME==
{no:'130',slug:'keepplace',title:'記住擺放位置',brand:'SAVED LAYOUT',type:'操作',
intro:'先點一張卡片，再點要放的格子；點已經放好的卡片可以拿回來。\n擺到一半離開也沒關係：關掉網頁再打開，東西還在原位。',
data:{prompt:'把八大行星依照「離太陽由近到遠」的順序放進軌道。',items:['水星','金星','地球','火星','木星','土星','天王星','海王星']},
build:function(host,D,G){
  const KEY='escape.ex130.state', n=D.items.length; let slots=new Array(n).fill(null), sel=null;
  try{ const s=JSON.parse(localStorage.getItem(KEY)); if(Array.isArray(s)&&s.length===n&&s.every(x=>x===null||(Number.isInteger(x)&&x>=0&&x<n)))slots=s; }catch(e){}
  const keep=()=>{ try{localStorage.setItem(KEY,JSON.stringify(slots));}catch(e){} };
  G.el('div','q',D.prompt,G.el('div','panel',null,host)); const stat=G.el('div','stat','',host);
  const rail=G.el('div',null,null,host); rail.style.cssText='display:grid;grid-template-columns:repeat(4,1fr);gap:6px;width:100%'; const tray=G.el('div','row',null,host);
  const clr=G.el('button','pill','全部清空',host); clr.addEventListener('click',()=>{ slots=new Array(n).fill(null); sel=null; keep(); draw(); });
  const order=G.shuffle([...Array(n).keys()]);
  function draw(){ rail.innerHTML=''; tray.innerHTML=''; stat.textContent='已擺放 '+slots.filter(x=>x!==null).length+' / '+n+'（自動儲存）';
    slots.forEach((v,i)=>{ const c=G.el('button','opt',v===null?('第 '+(i+1)+' 軌'):D.items[v],rail); c.dataset.slot=i; c.style.cssText='padding:14px 2px;font-size:13px;'+(v===null?'color:var(--txt-dim);border-style:dashed':'color:var(--amber)');
      c.addEventListener('click',()=>{ if(G.solved())return; if(v!==null){ slots[i]=null; } else if(sel!==null){ slots[i]=sel; sel=null; } else { G.hint('先點下面的一張卡片。'); return; } G.tick(); keep(); draw(); check(); }); });
    order.forEach(k=>{ if(slots.indexOf(k)>=0)return; const b=G.el('button','opt'+(sel===k?' on':''),D.items[k],tray); b.dataset.item=k; b.addEventListener('click',()=>{ sel=(sel===k?null:k); G.tick(); draw(); }); }); }
  function check(){ if(slots.indexOf(null)>=0)return; const bad=slots.filter((v,i)=>v!==i).length;
    if(!bad){ try{localStorage.removeItem(KEY);}catch(e){} G.solve('八大行星的順序完全正確！'); } else { G.buzz(); G.hint('都放滿了，但有 '+bad+' 個位置不對。點卡片拿回來重放。'); } }
  G.t={slots:()=>slots}; draw(); if(slots.indexOf(null)<0)check();
}}
//==GAME==
{no:'131',slug:'betting',title:'押注答題',brand:'CONFIDENCE BET',type:'選擇',
intro:'每一題先看題目，再決定要押多少分，然後才作答。\n答對拿回押的分數再加一倍，答錯就輸掉。有把握才押大的。',
data:{start:100,target:200,bets:[10,30,50],questions:[{q:'聲音在水裡傳得比在空氣裡快。',opts:['對','錯'],a:0},{q:'地球上現存最大的動物是非洲象。',opts:['對','錯'],a:1},{q:'植物行光合作用會放出氧氣。',opts:['對','錯'],a:0},
 {q:'月亮自己會發光。',opts:['對','錯'],a:1},{q:'1 公里等於 1000 公尺。',opts:['對','錯'],a:0},{q:'蜘蛛是昆蟲。',opts:['對','錯'],a:1}]},
build:function(host,D,G){
  const qs=G.shuffle(D.questions); let k=0, pts=D.start; const log=[]; const stat=G.el('div','stat','',host), area=G.el('div',null,null,host); area.style.width='100%';
  function next(){ area.innerHTML=''; stat.textContent='第 '+Math.min(k+1,qs.length)+' / '+qs.length+' 題 · 目前 '+pts+' 分（目標 '+D.target+'）';
    if(k>=qs.length||pts<Math.min.apply(null,D.bets)){ end(); return; } const it=qs[k]; G.t={it:it};
    const p=G.el('div','panel',null,area); G.el('div','q',it.q,p); G.el('div','sub','你有多少把握？先選押注',p); const row=G.el('div','opts h',null,p);
    D.bets.forEach(b=>{ const btn=G.el('button','opt','押 '+b,row); btn.dataset.bet=b; btn.disabled=b>pts; btn.addEventListener('click',()=>{ [].forEach.call(row.children,x=>{x.disabled=true;}); btn.classList.add('on'); G.tick();
      G.mc(area,'押了 '+b+' 分。你的答案是？',it.opts,it.a,(right)=>{ pts+=right?b:-b; log.push({b:b,right:right}); G.hint(right?'答對，贏得 '+b+' 分。':'答錯，輸掉 '+b+' 分。'); k++; G.later(next,1100); }); }); }); }
  function end(){ const big=log.filter(x=>x.b===Math.max.apply(null,D.bets)), br=big.filter(x=>x.right).length; const note=big.length?('你押最大注 '+big.length+' 次，其中答對 '+br+' 次。'):'你一次都沒有押最大注。';
    if(pts>=D.target)G.solve('最後 '+pts+' 分，過關！\n'+note); else { G.hint('最後 '+pts+' 分，沒有達到 '+D.target+' 分。'+note+' 再來一次。'); G.later(()=>G.restart(),3200); } }
  next();
}}
//==GAME==
{no:'132',slug:'ladder',title:'百萬挑戰',brand:'THE LADDER',type:'選擇',
intro:'連續答題往上爬。答錯就掉回保底關的分數；還沒到保底關就答錯，什麼都沒有。\n你有三個求救，也可以在任何一題前帶著目前的分數離開。',
data:{safe:4,ladder:[100,200,500,1000,2000,5000,10000,20000],questions:[
 {q:'太陽從哪個方向升起？',opts:['東方','西方','南方','北方'],a:0,hint:'日出東方。'},{q:'水的化學式是？',opts:['H₂O','CO₂','O₂','NaCl'],a:0,hint:'兩個氫、一個氧。'},
 {q:'三角形的內角和是幾度？',opts:['180','90','360','270'],a:0,hint:'剛好是一個平角。'},{q:'哪一個是哺乳類？',opts:['海豚','鯊魚','企鵝','海龜'],a:0,hint:'牠用肺呼吸，還會餵奶。'},
 {q:'人體最大的器官是？',opts:['皮膚','肝臟','大腦','心臟'],a:0,hint:'它包在身體的最外面。'},{q:'光在真空中每秒大約走多少公里？',opts:['30 萬','3 萬','300 萬','3000'],a:0,hint:'一秒可以繞地球七圈半。'},
 {q:'DNA 雙螺旋結構是哪一年發表的？',opts:['1953','1943','1963','1973'],a:0,hint:'二次大戰結束後不到十年。'},{q:'原子序 79 的元素是？',opts:['金','銀','鉑','汞'],a:0,hint:'它的元素符號是 Au。'}]},
build:function(host,D,G){
  let k=0, dead=false; const life={half:true,hint:true,again:true}; let shield=false;
  const stat=G.el('div','stat','',host), lad=G.el('div','row',null,host), area=G.el('div',null,null,host), tools=G.el('div','row',null,host), leave=G.el('button','pill','',host); area.style.width='100%';
  const won=()=>k>0?D.ladder[k-1]:0, safePts=()=>k>=D.safe?D.ladder[D.safe-1]:0;
  function draw(){ stat.textContent='第 '+(k+1)+' / '+D.questions.length+' 題 · 這題價值 '+D.ladder[k]+' 分'; lad.innerHTML='';
    D.ladder.forEach((v,i)=>{ const c=G.el('div','stat',(i===D.safe-1?'🛟':'')+v,lad); c.style.cssText='font-size:11px;padding:3px 7px;'+(i<k?'color:var(--good)':i===k?'background:#3a3323':'opacity:.5'); });
    leave.textContent='帶著 '+won()+' 分離開'; }
  function ask(){ area.innerHTML=''; tools.innerHTML=''; shield=false; if(k>=D.questions.length){ G.solve('全部答對，拿下 '+won()+' 分！'); return; } draw(); const it=D.questions[k]; G.t={it:it};
    const box=G.mc(area,it.q,it.opts,it.a,(right,btn)=>{ if(dead)return; if(right){ k++; G.hint('答對了！'); G.later(ask,900); return; }
      if(shield){ shield=false; G.hint('用掉「再答一次」，這次不算，再選一次。'); return; }
      dead=true; const s=safePts(); if(s>0)G.solve('答錯了，但保底關保住了你：帶走 '+s+' 分。'); else { G.hint('答錯了，而且還沒到保底關，什麼都沒有。再來一次。'); G.later(()=>G.restart(),2200); } },true);
    const mk=(key,label,fn)=>{ const b=G.el('button','pill',label,tools); b.dataset.life=key; b.disabled=!life[key]; b.style.opacity=life[key]?1:.4; b.addEventListener('click',()=>{ if(!life[key])return; life[key]=false; b.disabled=true; b.style.opacity=.4; G.tick(); fn(); }); };
    mk('half','刪去兩個',()=>{ const wrong=[].filter.call(box.querySelectorAll('.opt'),b=>+b.dataset.i!==it.a); G.shuffle(wrong).slice(0,2).forEach(b=>{b.disabled=true;b.style.visibility='hidden';}); });
    mk('hint','看提示',()=>{ G.hint('提示：'+it.hint); });
    mk('again','再答一次',()=>{ shield=true; G.hint('這一題答錯一次不算。'); }); }
  leave.addEventListener('click',()=>{ if(G.solved())return; if(k>=D.safe)G.solve('見好就收：你帶著 '+won()+' 分離開。'); else { G.buzz(); G.hint('還沒到保底關（第 '+D.safe+' 題），現在離開不算過關。'); } });
  ask();
}}
//==GAME==
{no:'133',slug:'spinwheel',title:'轉盤集塊',brand:'SPIN AND COLLECT',type:'選擇',
intro:'轉動轉盤決定類別，答對就拿到那個類別的一塊。\n四個類別都集滿才算過關。轉到已經有的類別要再轉一次。',
data:{cats:[{name:'自然',hex:'#4a8fd9',qs:[{q:'植物的哪個部位負責吸收水分？',opts:['根','葉','花'],a:0},{q:'哪一個是哺乳類？',opts:['海豚','鯊魚','企鵝'],a:0}]},
 {name:'數學',hex:'#d9534f',qs:[{q:'7 × 8 ＝ ？',opts:['56','54','64'],a:0},{q:'正方形有幾條對稱軸？',opts:['4','2','8'],a:0}]},
 {name:'社會',hex:'#7fce9b',qs:[{q:'臺灣最高的山是？',opts:['玉山','雪山','合歡山'],a:0},{q:'赤道的緯度是幾度？',opts:['0','90','180'],a:0}]},
 {name:'語文',hex:'#f0c04a',qs:[{q:'「畫蛇添足」的意思是？',opts:['多此一舉','畫得很像','動作很快'],a:0},{q:'下列哪一個是形聲字？',opts:['河','日','上'],a:0}]}]},
build:function(host,D,G){
  const n=D.cats.length, seg=360/n, have=D.cats.map(()=>false), qi=D.cats.map(()=>0); let rot=0, busy=false, spins=0;
  const bag=G.el('div','row',null,host);
  const wrap=G.el('div',null,null,host); wrap.style.cssText='position:relative;width:240px;height:240px';
  const ptr=G.el('div',null,'▼',wrap); ptr.style.cssText='position:absolute;left:50%;top:-14px;transform:translateX(-50%);color:var(--amber);font-size:22px;z-index:2';
  const wheel=G.el('div',null,null,wrap); wheel.style.cssText='position:absolute;inset:0;border-radius:50%;border:4px solid #161a20;transition:transform 2.2s cubic-bezier(.2,.8,.2,1);background:conic-gradient('+D.cats.map((c,i)=>c.hex+' '+(i*seg)+'deg '+((i+1)*seg)+'deg').join(',')+')';
  D.cats.forEach((c,i)=>{ const t=G.el('div',null,c.name,wheel); t.style.cssText='position:absolute;left:50%;top:50%;font-weight:700;color:#14161a;transform:translate(-50%,-50%) rotate('+((i+0.5)*seg)+'deg) translateY(-78px)'; });
  const spin=G.el('button','go','轉！',host), area=G.el('div',null,null,host); area.style.width='100%';
  function draw(){ bag.innerHTML=''; D.cats.forEach((c,i)=>{ const b=G.el('div','stat',(have[i]?'✓ ':'')+c.name,bag); b.style.cssText='border-color:'+c.hex+';'+(have[i]?'background:'+c.hex+';color:#14161a':''); }); }
  function land(i){ busy=false; const c=D.cats[i]; G.t.cat=i;
    if(have[i]){ G.hint('轉到「'+c.name+'」，這一塊已經有了，再轉一次。'); spin.disabled=false; return; }
    const it=c.qs[qi[i]%c.qs.length]; qi[i]++; G.t.it=it; G.hint('轉到「'+c.name+'」！');
    G.mc(area,'【'+c.name+'】'+it.q,it.opts,it.a,(right)=>{ if(right){ have[i]=true; draw(); G.hint('拿到「'+c.name+'」這一塊！'); } else G.hint('答錯了，這一塊沒拿到。');
      G.later(()=>{ area.innerHTML=''; if(have.every(x=>x)){ G.solve('四塊都集滿了！一共轉了 '+spins+' 次。'); return; } spin.disabled=false; },1000); }); }
  function go(force){ if(busy||G.solved())return; busy=true; spin.disabled=true; spins++; area.innerHTML=''; const i=(force!=null)?force:G.rnd(n);
    rot=Math.ceil(rot/360)*360+1080+(360-(i+0.5)*seg); wheel.style.transform='rotate('+rot+'deg)'; G.tick(); G.later(()=>land(i),2300); }
  spin.addEventListener('click',()=>go()); G.t={go:go,have:have}; draw();
}}
//==GAME==
{no:'134',slug:'roles',title:'選角色',brand:'PICK A ROLE',type:'選擇',
intro:'選一個角色。不同的角色看得懂不同的線索，沒有人能獨自看到全部。\n分組時每個人選不同的角色，把各自看到的告訴隊友，一起拼出三位數密碼。',
data:{code:'245',allowSwitch:true,roles:[{name:'化學家',icon:'🧪',clue:'你只看得懂實驗筆記：\n密碼第一位＝一個水分子裡氫原子的個數。'},
 {name:'歷史學家',icon:'📜',clue:'你只看得懂古書：\n密碼第二位＝中國古代「四大發明」的數量。'},{name:'數學家',icon:'📐',clue:'你只看得懂算式：\n密碼第三位＝最小的質數，加上最小的奇質數。'}]},
build:function(host,D,G){
  G.t={code:D.code}; let seen=0;
  function pick(){ host.innerHTML=''; G.el('div','sub','你要當誰？',host); const row=G.el('div','row',null,host);
    D.roles.forEach((r,i)=>{ const b=G.el('button','opt',null,row); b.dataset.role=i; b.style.cssText='width:30%;padding:18px 4px'; const ic=G.el('div',null,r.icon,b); ic.style.fontSize='34px'; G.el('div',null,r.name,b); b.addEventListener('click',()=>{ seen++; G.tick(); play(i); }); }); }
  function play(i){ host.innerHTML=''; const r=D.roles[i]; const p=G.el('div','panel',null,host); const h=G.el('div','q',r.icon+' '+r.name,p); h.style.color='var(--amber)'; const c=G.el('div','q',r.clue,p); c.style.cssText='margin-top:8px;font-size:15px';
    G.el('div','sub','其他兩位數，要問當別的角色的隊友。',p);
    const row=G.el('div','row',null,host), inp=G.el('input','inp',null,row); inp.inputMode='numeric'; inp.placeholder='三位數密碼'; inp.maxLength=String(D.code).length; const go=G.el('button','go','確認',row);
    go.addEventListener('click',()=>{ if(inp.value.trim()===String(D.code))G.solve('密碼正確！你一共當過 '+seen+' 個角色。'); else { G.buzz(); G.shake(inp); G.hint('密碼不對。'); } });
    if(D.allowSwitch){ const sw=G.el('button','pill','換一個角色（一個人玩的時候用）',host); sw.addEventListener('click',pick); } }
  pick();
}}
//==GAME==
{no:'135',slug:'dicefate',title:'擲骰與抽牌',brand:'ROLL YOUR FATE',type:'選擇',
intro:'你只能帶一樣東西上山，由骰子決定。\n骰到什麼，就會遇到不同的難關、走到不同的結局。每一條路都走得通。',
data:{items:[{faces:[1,2],name:'繩索',icon:'🪢',scene:'前面是一道深谷。你把繩索綁在樹上，要打哪一種結才不會鬆脫？',opts:['稱人結','蝴蝶結','活結'],a:0,ending:'你抓著繩索盪過深谷，平安抵達對岸。'},
 {faces:[3,4],name:'火把',icon:'🔥',scene:'前面是漆黑的山洞。火把要燒得起來，需要哪三個條件？',opts:['可燃物、助燃物、達到燃點','水、空氣、陽光','木頭、石頭、風'],a:0,ending:'你舉著火把穿過山洞，蝙蝠都躲開了。'},
 {faces:[5,6],name:'哨子',icon:'📯',scene:'前面起了大霧，什麼都看不見。哨子的聲音在霧裡傳得出去嗎？',opts:['可以，聲音靠空氣傳播','不行，霧會把聲音擋住','只有晚上才可以'],a:0,ending:'你吹響哨子，山下的人循著聲音找到了你。'}]},
build:function(host,D,G){
  const die=G.el('div','cell','🎲',host); die.style.cssText='width:96px;height:96px;font-size:52px;border-radius:18px;cursor:default'; const btn=G.el('button','go','擲骰子',host), area=G.el('div',null,null,host); area.style.width='100%';
  const faces=['⚀','⚁','⚂','⚃','⚄','⚅'];
  function roll(force){ btn.disabled=true; let t=0; const fin=(force!=null)?force:1+G.rnd(6);
    const id=G.every(()=>{ die.textContent=faces[G.rnd(6)]; G.tick(); if(++t>=9){ clearInterval(id); die.textContent=faces[fin-1]; show(fin); } },90); }
  function show(f){ const it=D.items.find(x=>x.faces.indexOf(f)>=0)||D.items[0]; G.t.it=it; const p=G.el('div','panel',null,area); const h=G.el('div','q','骰到 '+f+' 點：你帶的是 '+it.icon+' '+it.name,p); h.style.color='var(--amber)';
    G.mc(area,it.scene,it.opts,it.a,(right)=>{ if(right)G.solve(it.ending); else G.hint('這樣過不去，再想想。'); },true); }
  G.t={roll:roll}; btn.addEventListener('click',()=>roll());
}}
//==GAME==
{no:'136',slug:'castle',title:'答題換兵守城',brand:'DEFEND THE WALL',type:'競爭',
intro:'怪物一隻一隻衝向城牆。答對題目得到能量，答錯會扣能量。\n能量可以拿來射箭（打倒最前面的怪物）或修補城牆。撐到怪物全部倒下。',
data:{castle:100,enemies:12,cross:9,hit:20,startEnergy:20,right:20,wrong:10,arrow:10,wall:30,heal:25,
 questions:[{q:'6 × 7 ＝ ？',opts:['42','36','48'],a:0},{q:'8 × 9 ＝ ？',opts:['72','81','64'],a:0},{q:'7 × 7 ＝ ？',opts:['49','42','56'],a:0},{q:'9 × 6 ＝ ？',opts:['54','56','45'],a:0},{q:'12 × 4 ＝ ？',opts:['48','46','52'],a:0},
  {q:'15 × 3 ＝ ？',opts:['45','35','48'],a:0},{q:'8 × 8 ＝ ？',opts:['64','72','56'],a:0},{q:'11 × 7 ＝ ？',opts:['77','71','87'],a:0},{q:'9 × 9 ＝ ？',opts:['81','72','91'],a:0},{q:'13 × 5 ＝ ？',opts:['65','55','75'],a:0}]},
build:function(host,D,G){
  const S={hp:D.castle,en:D.startEnergy,left:D.enemies,foes:[],gap:5,wait:1.5,over:false}; G.t={S:S}; let qs=[], id=0;
  const stat=G.el('div','stat','',host), track=G.el('div',null,null,host); track.style.cssText='position:relative;width:100%;height:64px;border-radius:12px;background:linear-gradient(180deg,#22303a,#1a2630);border:1px solid var(--line);overflow:hidden';
  const cas=G.el('div',null,'🏰',track); cas.style.cssText='position:absolute;left:4px;top:10px;font-size:34px';
  const row=G.el('div','row',null,host), bA=G.el('button','go','🏹 射箭（'+D.arrow+'）',row), bW=G.el('button','pill','🧱 修牆（'+D.wall+'）',row), area=G.el('div',null,null,host); area.style.width='100%';
  bA.dataset.act='arrow'; bW.dataset.act='wall';
  function draw(){ stat.textContent='城牆 '+Math.max(0,S.hp)+' · 能量 '+S.en+' · 還有 '+(S.left+S.foes.length)+' 隻'; bA.disabled=S.en<D.arrow||!S.foes.length; bW.disabled=S.en<D.wall; }
  bA.addEventListener('click',()=>{ if(S.over||S.en<D.arrow||!S.foes.length)return; S.en-=D.arrow; const f=S.foes.reduce((a,b)=>a.pos<b.pos?a:b); f.e.remove(); S.foes.splice(S.foes.indexOf(f),1); G.tone(900,0.08,'square',0.04); draw(); check(); });
  bW.addEventListener('click',()=>{ if(S.over||S.en<D.wall)return; S.en-=D.wall; S.hp=Math.min(D.castle,S.hp+D.heal); G.ok(); draw(); });
  function ask(){ if(S.over)return; area.innerHTML=''; if(!qs.length)qs=G.shuffle(D.questions); const it=qs.pop(); G.t.it=it;
    G.mc(area,it.q,it.opts,it.a,(right)=>{ if(right)S.en+=D.right; else S.en=Math.max(0,S.en-D.wrong); draw(); G.later(ask,right?250:700); }); }
  function check(){ if(S.over)return; if(S.hp<=0){ S.over=true; G.buzz(); G.hint('城牆被攻破了，重新來過。'); G.later(()=>G.restart(),2000); }
    else if(!S.left&&!S.foes.length){ S.over=true; G.solve('怪物全部倒下，城牆還剩 '+S.hp+'！'); } }
  G.every(()=>{ if(S.over)return; S.wait-=0.1;
    if(S.left>0&&S.wait<=0){ S.left--; const e=G.el('div',null,'👾',track); e.style.cssText='position:absolute;top:16px;font-size:26px'; S.foes.push({pos:100,e:e,id:id++}); S.gap=Math.max(2.2,S.gap-0.25); S.wait=S.gap; }
    S.foes.slice().forEach(f=>{ f.pos-=100/(D.cross*10); f.e.style.left=(12+f.pos*0.8)+'%'; if(f.pos<=0){ f.e.remove(); S.foes.splice(S.foes.indexOf(f),1); S.hp-=D.hit; G.buzz(); G.shake(track); } });
    draw(); check(); },100);
  draw(); ask();
}}
//==GAME==
{no:'137',slug:'starjump',title:'答題跳台',brand:'STAR JUMP',type:'競爭',
intro:'角色會自動往上跳，你只要用左右按鈕控制方向（也可以按鍵盤方向鍵）。\n踩到問號平台要答題，答對加時間。在時間用完前爬到目標高度，掉下去就要重來。',
data:{time:30,bonus:5,goal:24,questions:[{q:'太陽系裡最大的行星是？',opts:['木星','土星','地球'],a:0},{q:'水在攝氏幾度沸騰？（一大氣壓）',opts:['100','90','120'],a:0},{q:'哪一個是質數？',opts:['17','15','21'],a:0},
 {q:'植物行光合作用需要哪種氣體？',opts:['二氧化碳','氧氣','氮氣'],a:0},{q:'一打是幾個？',opts:['12','10','20'],a:0},{q:'月球繞著誰轉？',opts:['地球','太陽','火星'],a:0},{q:'彩虹有幾種顏色？',opts:['7','5','9'],a:0}]},
build:function(host,D,G){
  const W=320,H=420, stat=G.el('div','stat','',host), cv=G.el('canvas',null,null,host); cv.width=W; cv.height=H; cv.style.cssText='width:100%;max-width:360px;border-radius:12px;background:linear-gradient(180deg,#141a2a,#22303a);border:1px solid var(--line)'; const ctx=cv.getContext('2d');
  const row=G.el('div','row',null,host), area=G.el('div',null,null,host); area.style.width='100%';
  const plats=[]; for(let i=0;i<D.goal+4;i++)plats.push({i:i,x:i===0?W/2-36:20+Math.random()*(W-110),y:H-30-i*56,w:72,q:i>0&&i%4===3,used:false});
  const P={x:W/2,y:H-60,vy:-9.4}; const S={dir:0,time:D.time,best:0,paused:false,over:false,P:P,plats:plats}; G.t={S:S}; let qs=[];
  ['◀','▶'].forEach((t,k)=>{ const b=G.el('button','opt nodrag',t,row); b.dataset.dir=k?1:-1; b.style.cssText='width:44%;padding:16px 0;font-size:22px'; const d=k?1:-1;
    b.addEventListener('pointerdown',e=>{e.preventDefault();S.dir=d;}); ['pointerup','pointerleave','pointercancel'].forEach(n=>b.addEventListener(n,()=>{ if(S.dir===d)S.dir=0; })); });
  const kd=e=>{ if(e.key==='ArrowLeft')S.dir=-1; if(e.key==='ArrowRight')S.dir=1; }, ku=e=>{ if(e.key==='ArrowLeft'||e.key==='ArrowRight')S.dir=0; };
  window.addEventListener('keydown',kd); window.addEventListener('keyup',ku); G.onClean(()=>{window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);});
  function lose(msg){ S.over=true; G.buzz(); G.hint(msg+' 重新來過。'); G.later(()=>G.restart(),1800); }
  function ask(p){ S.paused=true; if(!qs.length)qs=G.shuffle(D.questions); const it=qs.pop(); G.t.it=it;
    G.mc(area,it.q,it.opts,it.a,(right)=>{ if(right){ S.time+=D.bonus; G.hint('答對，加 '+D.bonus+' 秒！'); } else G.hint('答錯了，沒有加時間。'); G.later(()=>{ area.innerHTML=''; S.paused=false; },right?450:900); }); }
  function step(){ if(S.over||S.paused||G.solved())return; S.time-=0.016; if(S.time<=0){ lose('時間到了。'); return; }
    P.x+=S.dir*4.2; if(P.x<0)P.x+=W; if(P.x>W)P.x-=W; const py=P.y; P.vy+=0.36; P.y+=P.vy;
    if(P.vy>0)for(const p of plats){ if(py<=p.y&&P.y>=p.y&&P.x>p.x-8&&P.x<p.x+p.w+8){ P.y=p.y; P.vy=-9.4; G.tone(520,0.04,'sine',0.02); if(p.i>S.best)S.best=p.i;
        if(S.best>=D.goal){ G.solve('爬到第 '+S.best+' 層，剩下 '+S.time.toFixed(0)+' 秒！'); return; } if(p.q&&!p.used){ p.used=true; ask(p); } break; } }
    if(P.y<170){ const d=170-P.y; P.y=170; plats.forEach(p=>{p.y+=d;}); }
    if(P.y>H+30){ lose('掉下去了。'); return; }
    stat.textContent='高度 '+S.best+' / '+D.goal+' · 剩 '+Math.ceil(S.time)+' 秒'; }
  function paint(){ ctx.clearRect(0,0,W,H); plats.forEach(p=>{ if(p.y<-10||p.y>H+10)return; ctx.fillStyle=p.q&&!p.used?'#ffce78':(p.i>=D.goal?'#7fce9b':'#9aa1a9'); ctx.fillRect(p.x,p.y,p.w,9); if(p.q&&!p.used){ ctx.fillStyle='#1c1206'; ctx.font='bold 10px sans-serif'; ctx.fillText('?',p.x+p.w/2-3,p.y+8); } });
    ctx.font='24px sans-serif'; ctx.fillText('⭐',P.x-12,P.y-2); }
  G.every(()=>{ step(); paint(); },16); paint();
}}
//==GAME==
{no:'138',slug:'slots',title:'拉霸',brand:'SLOT SENTENCE',type:'競爭',
intro:'拉下拉桿，三個轉輪會停在「主詞、動詞、時態」的隨機組合。\n依照轉出來的組合，選出文法正確的英文句子。答對五次過關。',
data:{need:5,subjects:[{s:'I',third:false},{s:'She',third:true},{s:'They',third:false},{s:'He',third:true}],
 verbs:[{base:'play',s:'plays',past:'played',ing:'playing',tail:'basketball'},{base:'eat',s:'eats',past:'ate',ing:'eating',tail:'breakfast'},{base:'go',s:'goes',past:'went',ing:'going',tail:'to school'},{base:'write',s:'writes',past:'wrote',ing:'writing',tail:'a letter'}],
 tenses:['現在簡單式','過去式','未來式']},
build:function(host,D,G){
  let right=0, busy=false; const stat=G.el('div','stat','',host), reels=G.el('div','row',null,host);
  const R=['主詞','動詞','時態'].map(t=>{ const w=G.el('div',null,null,reels); w.style.cssText='width:30%;text-align:center'; G.el('div','sub',t,w); const c=G.el('div','cell','?',w); c.style.cssText='height:60px;font-size:17px;cursor:default;color:var(--amber)'; return c; });
  const pull=G.el('button','go','拉下拉桿',host), area=G.el('div',null,null,host); area.style.width='100%';
  const draw=()=>{ stat.textContent='答對 '+right+' / '+D.need; };
  function sentence(S,V,t){ const ok=t===0?(S.third?V.s:V.base):t===1?V.past:'will '+V.base; const mk=v=>S.s+' '+v+' '+V.tail+'.';
    const pool=[V.base,V.s,V.past,'will '+V.past,V.ing,'will '+V.s].filter(v=>v!==ok); const wrong=G.shuffle(pool.filter((v,i)=>pool.indexOf(v)===i)).slice(0,2); return {ok:mk(ok),opts:[mk(ok)].concat(wrong.map(mk))}; }
  function go(){ if(busy||G.solved())return; busy=true; pull.disabled=true; area.innerHTML=''; G.hint(''); const S=D.subjects[G.rnd(D.subjects.length)], V=D.verbs[G.rnd(D.verbs.length)], t=G.rnd(D.tenses.length); let n=0;
    const id=G.every(()=>{ R[0].textContent=D.subjects[G.rnd(D.subjects.length)].s; R[1].textContent=D.verbs[G.rnd(D.verbs.length)].base; R[2].textContent=D.tenses[G.rnd(D.tenses.length)]; G.tick();
      if(++n>=10){ clearInterval(id); R[0].textContent=S.s; R[1].textContent=V.base; R[2].textContent=D.tenses[t]; const q=sentence(S,V,t); G.t={ok:q.ok};
        G.mc(area,'哪一句是對的？',q.opts,0,(r)=>{ if(r){ right++; draw(); } else G.hint('正確的是：'+q.ok);
          G.later(()=>{ if(right>=D.need){ G.solve('答對 '+D.need+' 次，過關！'); return; } busy=false; pull.disabled=false; },r?600:1800); }); } },80); }
  pull.addEventListener('click',go); draw();
}}
//==GAME==
{no:'139',slug:'gemclear',title:'答題換道具的消除遊戲',brand:'COMBO CLEAR',type:'競爭',
intro:'先答三題：每答對一題，消除遊戲就多三步。\n接著點兩顆以上相連的同色寶石把它們消掉，一次消越多分數越高。在步數用完前達到目標分數。',
data:{size:7,colors:4,moves:10,bonus:3,target:110,questions:[{q:'哪一個是偶數？',opts:['48','37','51'],a:0},{q:'水的三態不包括哪一個？',opts:['電漿','固態','氣態'],a:0},{q:'一公尺等於幾公分？',opts:['100','10','1000'],a:0}]},
build:function(host,D,G){
  const n=D.size, gems=['🔴','🟡','🟢','🔵','🟣','🟠'].slice(0,D.colors); let moves=D.moves, score=0, qi=0, bd=[];
  const stat=G.el('div','stat','',host), area=G.el('div',null,null,host); area.style.width='100%'; const grid=G.el('div',null,null,host); grid.style.cssText='display:none;grid-template-columns:repeat('+n+',1fr);gap:3px;width:100%';
  const draw=()=>{ stat.textContent='分數 '+score+' / '+D.target+' · 剩 '+moves+' 步'; };
  function ask(){ area.innerHTML=''; if(qi>=D.questions.length){ play(); return; } const it=D.questions[qi]; G.t={it:it,stage:'q'};
    G.mc(area,'道具題 '+(qi+1)+'：'+it.q,it.opts,it.a,(r)=>{ if(r){ moves+=D.bonus; G.hint('答對，多 '+D.bonus+' 步！'); } else G.hint('答錯，沒有拿到道具。'); draw(); qi++; G.later(ask,800); }); }
  function group(i){ const c=bd[i], seen=new Set([i]), st=[i]; if(c<0)return []; while(st.length){ const k=st.pop(), r=Math.floor(k/n), x=k%n; [[r-1,x],[r+1,x],[r,x-1],[r,x+1]].forEach(p=>{ if(p[0]<0||p[0]>=n||p[1]<0||p[1]>=n)return; const j=p[0]*n+p[1]; if(bd[j]===c&&!seen.has(j)){seen.add(j);st.push(j);} }); } return [...seen]; }
  function fall(){ const cols=[]; for(let x=0;x<n;x++){ const col=[]; for(let r=n-1;r>=0;r--)if(bd[r*n+x]>=0)col.push(bd[r*n+x]); if(col.length)cols.push(col); }
    bd=new Array(n*n).fill(-1); cols.forEach((col,x)=>col.forEach((c,k)=>{ bd[(n-1-k)*n+x]=c; })); }
  function paint(){ grid.innerHTML=''; bd.forEach((c,i)=>{ const e=G.el('div','cell',c<0?'':gems[c],grid); e.dataset.i=i; e.style.cssText='aspect-ratio:1;font-size:22px;'+(c<0?'opacity:.25;cursor:default':''); e.addEventListener('click',()=>tap(i)); }); draw(); }
  function tap(i){ if(G.solved()||moves<=0)return; const g=group(i); if(g.length<2){ G.buzz(); return; } g.forEach(k=>{bd[k]=-1;}); score+=g.length*(g.length-1); moves--; fall(); G.tone(500+g.length*40,0.1,'sine',0.05); paint();
    if(score>=D.target){ G.solve('達到 '+score+' 分，過關！'); return; }
    const any=bd.some((c,k)=>c>=0&&group(k).length>=2); if(moves<=0||!any){ G.hint((moves<=0?'步數用完了':'沒有可以消的寶石了')+'，只拿到 '+score+' 分。重新來過。'); G.later(()=>G.restart(),2200); } }
  function play(){ area.innerHTML=''; G.hint(''); grid.style.display='grid'; bd=[]; for(let i=0;i<n*n;i++)bd.push(G.rnd(D.colors)); G.t={stage:'play',bd:()=>bd,group:group,tap:tap,n:n}; paint(); }
  draw(); ask();
}}
