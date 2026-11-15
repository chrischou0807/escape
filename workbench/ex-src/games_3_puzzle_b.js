//==GAME==
{no:'117',slug:'hilo',title:'高低提示猜數字',brand:'HOT POTATO',type:'解謎',
intro:'每一題的答案都是一個數字。送出後會告訴你正確答案「更高」或「更低」。\n引信有多長沒有人知道，在爆炸前答對越多題越好。',
data:{minTime:60,maxTime:120,need:3,questions:[
 {q:'成年人的身體有幾塊骨頭？',a:206,start:150},{q:'水的沸點是華氏幾度？',a:212,start:180},{q:'銀的原子序是多少？',a:47,start:30},
 {q:'人類第一次登陸月球是西元哪一年？',a:1969,start:1950},{q:'標準鋼琴有幾個琴鍵？',a:88,start:60}]},
build:function(host,D,G){
  const qs=G.shuffle(D.questions); let k=0, right=0, val=0, over=false;
  const endAt=Date.now()+1000*(D.minTime+Math.random()*(D.maxTime-D.minTime));
  const fuse=G.el('div','q','🧨',host); fuse.style.fontSize='40px'; const stat=G.el('div','stat','',host);
  const p=G.el('div','panel',null,host), q=G.el('div','q','',p), row=G.el('div','row',null,p); row.style.marginTop='10px';
  const mk=(t,d)=>{ const b=G.el('button','opt',t,row); b.style.padding='10px 8px'; b.dataset.d=d; b.addEventListener('click',()=>{val=Math.max(0,val+d);inp.value=val;G.tick();}); return b; };
  mk('−10',-10); mk('−1',-1); const inp=G.el('input','inp',null,row); inp.type='number'; inp.style.maxWidth='110px'; mk('+1',1); mk('+10',10);
  inp.addEventListener('input',()=>{val=parseInt(inp.value,10)||0;});
  const go=G.el('button','go','送出',host);
  function show(){ const it=qs[k]; G.t={answer:it.a}; q.textContent=it.q; val=it.start||0; inp.value=val; stat.textContent='已答對 '+right+' 題（目標 '+D.need+' 題）'; }
  function finish(boom){ if(over)return; over=true; go.disabled=true;
    if(right>=D.need){ G.solve((boom?'轟！不過你在爆炸前答對了 ':'全部答完，答對了 ')+right+' 題，過關！'); }
    else { fuse.textContent='💥'; G.buzz(); G.hint('爆炸了！只答對 '+right+' 題，要 '+D.need+' 題。再來一次。'); G.later(()=>G.restart(),2200); } }
  go.addEventListener('click',()=>{ if(over)return; const it=qs[k]; val=parseInt(inp.value,10)||0;
    if(val===it.a){ right++; G.ok(); G.hint('答對了！'); k++; if(k>=qs.length){ finish(false); return; } show(); }
    else { G.buzz(); G.hint(val<it.a?'⬆ 正確答案更高':'⬇ 正確答案更低'); } });
  G.every(()=>{ if(over)return; fuse.style.transform='rotate('+(G.rnd(13)-6)+'deg)'; if(Date.now()>=endAt)finish(true); },250);
  show();
}}
//==GAME==
{no:'118',slug:'answerboard',title:'給答案找問題',brand:'ANSWER BOARD',type:'解謎',
intro:'選一格，你會看到一個「答案」。從選項裡找出它對應的「問題」。\n答對加分、答錯扣分，全部翻完後總分要達標。',
data:{pass:1200,cats:[
 {name:'自然',items:[{pts:100,clue:'它是植物行光合作用的場所。',opts:['什麼是葉綠體？','什麼是粒線體？','什麼是細胞核？'],a:0},
  {pts:200,clue:'它是地球大氣裡含量最多的氣體。',opts:['什麼是氮氣？','什麼是氧氣？','什麼是二氧化碳？'],a:0},
  {pts:300,clue:'聲音在這種環境裡無法傳播。',opts:['什麼是真空？','什麼是水中？','什麼是鋼鐵？'],a:0}]},
 {name:'地理',items:[{pts:100,clue:'它是世界上面積最大的海洋。',opts:['什麼是太平洋？','什麼是大西洋？','什麼是印度洋？'],a:0},
  {pts:200,clue:'它是臺灣最高的山。',opts:['什麼是玉山？','什麼是雪山？','什麼是阿里山？'],a:0},
  {pts:300,clue:'它是通過英國格林威治的那一條經線。',opts:['什麼是本初子午線？','什麼是赤道？','什麼是國際換日線？'],a:0}]},
 {name:'數學',items:[{pts:100,clue:'它只有 1 和自己兩個因數。',opts:['什麼是質數？','什麼是合數？','什麼是偶數？'],a:0},
  {pts:200,clue:'它是圓周長除以直徑得到的值。',opts:['什麼是圓周率？','什麼是半徑？','什麼是圓面積？'],a:0},
  {pts:300,clue:'它是直角三角形裡最長的那一邊。',opts:['什麼是斜邊？','什麼是鄰邊？','什麼是高？'],a:0}]}]},
build:function(host,D,G){
  let score=0, left=0; const stat=G.el('div','stat','',host), board=G.el('div',null,null,host), qa=G.el('div',null,null,host); qa.style.width='100%';
  board.style.cssText='display:grid;gap:6px;width:100%;grid-template-columns:repeat('+D.cats.length+',1fr)';
  D.cats.forEach(c=>{ const h=G.el('div','sub',c.name,board); h.style.cssText='font-weight:700;color:var(--amber);padding:6px 0'; });
  const rows=Math.max.apply(null,D.cats.map(c=>c.items.length));
  const draw=()=>{ stat.textContent='分數 '+score+'（過關 '+D.pass+'）'; };
  for(let r=0;r<rows;r++)D.cats.forEach((c,ci)=>{ const it=c.items[r]; if(!it){ G.el('div',null,'',board); return; } left++;
    const b=G.el('button','opt',String(it.pts),board); b.dataset.cell=ci+'-'+r; b.style.cssText='font-family:var(--display);font-size:20px;font-weight:700;color:var(--amber);padding:18px 0';
    b.addEventListener('click',()=>{ if(b.disabled||qa.children.length)return; b.disabled=true; b.textContent='—'; board.style.display='none'; G.t={it:it};
      const box=G.mc(qa,'【'+c.name+' '+it.pts+'】\n'+it.clue,it.opts,it.a,(right)=>{ score+=right?it.pts:-it.pts; left--; draw(); G.hint(right?'答對，加 '+it.pts+' 分。':'答錯，扣 '+it.pts+' 分。正確的是「'+it.opts[it.a]+'」');
        G.later(()=>{ qa.innerHTML=''; board.style.display='grid'; if(left<=0){ if(score>=D.pass)G.solve('總分 '+score+' 分，過關！'); else{ G.hint('總分 '+score+' 分，沒有達到 '+D.pass+' 分。再來一次。'); G.later(()=>G.restart(),2200); } } },right?900:2000); }); }); });
  draw();
}}
//==GAME==
{no:'119',slug:'corkboard',title:'軟木板推理',brand:'CASE BOARD',type:'解謎',
intro:'教室窗邊的盆栽摔破了。蒐集到的線索都釘在軟木板上。\n一張一張回答便利貼上的問題，最後把事情的經過排出來。',
data:{mistakes:3,clues:['14:10　警衛巡邏時，窗戶是關著的。','14:20　小芸離開教室，那時盆栽還好好的。','14:30　開始颳強風，持續了十五分鐘。','14:35　阿哲進教室覺得很悶，把窗戶打開。','14:37　阿哲去走廊裝水，教室裡沒有人。','14:40　走廊上的人聽到碎裂聲。','現場：地上沒有腳印，泥土灑向教室內側。','現場：窗簾被吹到盆栽原本的位置。'],
 questions:[{q:'盆栽是什麼時候摔破的？',opts:['14:40','14:20','14:30'],a:0},{q:'摔破的時候，窗戶是開著還是關著？',opts:['開著，阿哲 14:35 打開的','關著，警衛看過','不知道'],a:0},
  {q:'摔破的時候，教室裡有誰？',opts:['沒有人','小芸','阿哲'],a:0},{q:'盆栽最可能是怎麼倒的？',opts:['強風吹動窗簾，把它掃下來','小芸離開時碰倒','阿哲開窗時撞倒'],a:0}],
 order:{prompt:'把事情的經過，從最早到最晚依序點出來。',events:['小芸離開教室','開始颳強風','阿哲打開窗戶','阿哲去裝水','盆栽摔破']},
 conclusion:'結案：沒有人碰倒盆栽。阿哲開窗後離開，強風吹動窗簾，把盆栽掃了下來。'},
build:function(host,D,G){
  let miss=0; const board=G.el('div',null,null,host); board.style.cssText='width:100%;padding:10px;border-radius:12px;background:#7a5a3a;display:grid;grid-template-columns:1fr 1fr;gap:8px';
  D.clues.forEach((c,i)=>{ const n=G.el('div','note',c,board); n.style.cssText+=';font-size:12.5px;transform:rotate('+((i%3)-1)+'deg)'; });
  const stat=G.el('div','stat','',host), area=G.el('div',null,null,host); area.style.width='100%'; let qi=0;
  const draw=()=>{ stat.textContent='推理失誤 '+miss+' / '+D.mistakes; };
  function fail(){ miss++; draw(); if(miss>=D.mistakes){ G.hint('失誤太多，回到板子前重新整理線索。'); G.later(()=>G.restart(),1800); return true; } return false; }
  function ask(){ area.innerHTML=''; if(qi>=D.questions.length){ order(); return; } const it=D.questions[qi]; G.t={it:it,stage:'q'};
    G.mc(area,'便利貼 '+(qi+1)+'：'+it.q,it.opts,it.a,(right)=>{ if(right){ qi++; G.hint(''); G.later(ask,700); } else { if(!fail())G.hint('和板子上的線索對不起來，再看一次。'); } },true); }
  function order(){ G.t={stage:'order',events:D.order.events}; const p=G.el('div','panel',null,area); G.el('div','q',D.order.prompt,p); const w=G.el('div','opts',null,p); let k=0;
    G.shuffle(D.order.events.map((e,i)=>i)).forEach(i=>{ const b=G.el('button','opt',D.order.events[i],w); b.dataset.ev=i;
      b.addEventListener('click',()=>{ if(b.classList.contains('good')||G.solved())return;
        if(i===k){ k++; b.classList.add('good'); b.textContent=k+'. '+D.order.events[i]; G.ok(); if(k===D.order.events.length)G.solve(D.conclusion); }
        else { G.buzz(); if(!fail()){ G.hint('順序不對，從頭再排一次。'); k=0; [].forEach.call(w.children,x=>{x.classList.remove('good');x.textContent=D.order.events[+x.dataset.ev];}); } } }); }); }
  draw(); ask();
}}
//==GAME==
{no:'120',slug:'safekey',title:'鑰匙配保險箱',brand:'RIGHT BOX',type:'解謎',
intro:'檔案室裡有一整排保險箱，鑰匙只能開其中一個。\n把鑰匙拖到正確號碼的箱子上（也可以直接點箱子）。試錯太多次警報會響。',
data:{clue:'保險箱的號碼，就是元素週期表上「氯（Cl）」的原子序。',answer:17,count:24,tries:3},
build:function(host,D,G){
  let tries=D.tries; G.t={answer:D.answer}; G.el('div','q',D.clue,G.el('div','panel',null,host)); const stat=G.el('div','stat','',host);
  const key=G.el('div',null,'🗝️',host); key.style.cssText='font-size:40px;cursor:grab;z-index:6;position:relative'; let cx=0,cy=0;
  const grid=G.el('div',null,null,host); grid.style.cssText='display:grid;grid-template-columns:repeat(6,1fr);gap:6px;width:100%';
  const draw=()=>{ stat.textContent='還可以試 '+tries+' 次'; };
  function attempt(box){ if(G.solved()||box.disabled||tries<=0)return; const n=+box.dataset.box;
    if(n===D.answer){ box.classList.add('good'); box.textContent='🔓'; G.solve('第 '+n+' 號保險箱打開了！'); return; }
    box.classList.add('bad'); box.disabled=true; tries--; draw(); G.buzz(); G.hint('第 '+n+' 號打不開。');
    if(tries<=0){ G.hint('警報響了！保全把你請出檔案室，重新來過。'); G.later(()=>G.restart(),1800); } }
  for(let n=1;n<=D.count;n++){ const b=G.el('button','opt',String(n),grid); b.dataset.box=n; b.style.cssText='font-family:var(--display);font-weight:700;padding:14px 0'; b.addEventListener('click',()=>attempt(b)); }
  G.drag(key,{move:(dx,dy)=>{cx=dx;cy=dy;key.style.transform='translate('+dx+'px,'+dy+'px)';},end:(e)=>{ const box=G.under(e.clientX,e.clientY,'[data-box]',key); key.style.transform=''; if(box)attempt(box); }});
  draw();
}}
//==GAME==
{no:'121',slug:'tilespell',title:'拖字母拼答案',brand:'TILE SPELL',type:'解謎',
intro:'依照提示，從下面的字塊裡挑出正確的字，照順序放進格子。\n點字塊放上去，點格子把字拿回來。字塊裡混了用不到的字。',
data:{rounds:[{clue:'植物利用光能製造養分的作用',answer:'光合作用',extra:'呼吸蒸散'},{clue:'水由液體變成氣體的過程',answer:'蒸發',extra:'凝結融化'},{clue:'地球繞著太陽轉一圈的運動',answer:'公轉',extra:'自月日夜'}]},
build:function(host,D,G){
  let r=0; const stat=G.el('div','stat','',host), p=G.el('div','panel',null,host), q=G.el('div','q','',p), slots=G.el('div','row',null,host), tray=G.el('div','row',null,host);
  function start(){ const R=D.rounds[r], ans=String(R.answer).split(''), tiles=G.shuffle(ans.concat(String(R.extra||'').split(''))); G.t={answer:R.answer};
    stat.textContent='第 '+(r+1)+' / '+D.rounds.length+' 題'; q.textContent=R.clue; slots.innerHTML=''; tray.innerHTML=''; const fill=ans.map(()=>null);
    const sEls=ans.map((_,i)=>{ const s=G.el('div','cell','',slots); s.dataset.slot=i; s.style.cssText='width:52px;height:56px;font-size:24px;color:var(--amber)';
      s.addEventListener('click',()=>{ if(fill[i]==null)return; tEls[fill[i]].style.visibility='visible'; fill[i]=null; s.textContent=''; G.tick(); }); return s; });
    const tEls=tiles.map((ch,ti)=>{ const b=G.el('button','opt',ch,tray); b.dataset.tile=ch; b.style.cssText='width:50px;height:52px;padding:0;font-size:22px';
      b.addEventListener('click',()=>{ const i=fill.indexOf(null); if(i<0)return; fill[i]=ti; sEls[i].textContent=ch; b.style.visibility='hidden'; G.tick();
        if(fill.indexOf(null)<0){ const got=fill.map(x=>tiles[x]).join('');
          if(got===R.answer){ G.ok(); r++; if(r>=D.rounds.length){ G.solve('三題都拼對了！'); return; } G.hint('正確，下一題。'); G.later(start,800); }
          else { G.buzz(); G.shake(slots); G.hint('拼出來的不是答案，再試一次。'); G.later(()=>{ fill.forEach((x,j)=>{ if(x!=null){tEls[x].style.visibility='visible';fill[j]=null;sEls[j].textContent='';} }); },500); } } }); return b; }); }
  start();
}}
//==GAME==
{no:'122',slug:'multikey',title:'一個輸入框多把鑰匙',brand:'ONE BOX MANY KEYS',type:'解謎',
intro:'四個抽屜各有一道謎題，但輸入框只有一個。\n輸入任何一題的答案，對應的抽屜就會打開。四個都打開才算過關。',
data:{keys:[{riddle:'化學式 H₂O 是什麼物質？',answers:['水'],reward:'芝'},{riddle:'北半球一年裡白天最長的節氣？',answers:['夏至'],reward:'麻'},
 {riddle:'三角形的內角和是幾度？',answers:['180','180度','180°'],reward:'開'},{riddle:'臺灣最長的河流？',answers:['濁水溪'],reward:'門'}],final:'四個字合起來是：'},
build:function(host,D,G){
  const open=D.keys.map(()=>false), norm=s=>String(s).replace(/\s+/g,'').toLowerCase(); G.t={keys:D.keys};
  const grid=G.el('div',null,null,host); grid.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%';
  const boxes=D.keys.map((k,i)=>{ const b=G.el('div','panel',null,grid); b.dataset.drawer=i; const ic=G.el('div','q','🔒',b); ic.style.fontSize='26px'; G.el('div','sub',k.riddle,b); return {b:b,ic:ic}; });
  const row=G.el('div','row',null,host), inp=G.el('input','inp',null,row); inp.placeholder='輸入答案'; inp.style.letterSpacing='1px'; const go=G.el('button','go','送出',row);
  function submit(){ const v=norm(inp.value); if(!v)return; const i=D.keys.findIndex((k,j)=>!open[j]&&k.answers.map(norm).indexOf(v)>=0);
    if(i<0){ G.buzz(); G.shake(inp); G.hint(D.keys.some((k,j)=>open[j]&&k.answers.map(norm).indexOf(v)>=0)?'這個抽屜已經打開了。':'沒有抽屜有反應。'); return; }
    open[i]=true; boxes[i].ic.textContent=D.keys[i].reward; boxes[i].ic.style.color='var(--amber)'; boxes[i].b.style.borderColor='var(--good)'; inp.value=''; G.ok(); G.hint('第 '+(i+1)+' 個抽屜打開了。');
    if(open.every(x=>x))G.solve(D.final+D.keys.map(k=>k.reward).join('')); }
  go.addEventListener('click',submit); inp.addEventListener('keydown',e=>{ if(e.key==='Enter')submit(); });
}}
//==GAME==
{no:'123',slug:'dominochain',title:'骨牌鏈',brand:'DOMINO CHAIN',type:'解謎',
intro:'骨牌鏈的尾端寫著一段描述。先回答它說的是哪個過程，\n再從手牌裡選出能接上去的那張骨牌，把水循環接完。',
data:{mistakes:3,start:'水受熱變成水蒸氣',steps:[
 {term:'蒸發',wrong:['凝結','降水'],next:'水蒸氣遇冷變成小水滴'},{term:'凝結',wrong:['蒸發','逕流'],next:'雲裡的水滴變重，落到地面'},
 {term:'降水',wrong:['凝結','蒸發'],next:'雨水沿著地表流進河川和海洋'},{term:'逕流',wrong:['降水','凝結'],next:'回到海洋，循環完成'}]},
build:function(host,D,G){
  let i=0, miss=0; const stat=G.el('div','stat','',host), chain=G.el('div',null,null,host); chain.style.cssText='width:100%;display:flex;flex-direction:column;gap:4px';
  const area=G.el('div',null,null,host); area.style.width='100%';
  const tile=(l,r,parent)=>{ const t=G.el('div',null,null,parent); t.style.cssText='display:flex;border-radius:9px;overflow:hidden;border:1px solid rgba(0,0,0,.4);background:var(--paper);color:#2b2115;font-size:14px';
    const a=G.el('div',null,l,t); a.style.cssText='flex:0 0 76px;padding:10px 6px;text-align:center;font-weight:700;border-right:2px solid #2b2115'; const b=G.el('div',null,r,t); b.style.cssText='flex:1;padding:10px 8px'; return t; };
  const draw=()=>{ stat.textContent='已接 '+i+' / '+D.steps.length+' 張 · 失誤 '+miss+' / '+D.mistakes; };
  function fail(){ miss++; draw(); if(miss>=D.mistakes){ G.hint('失誤太多，骨牌倒了，重新來過。'); G.later(()=>G.restart(),1800); return true; } return false; }
  tile('起點',D.start,chain);
  function step(){ area.innerHTML=''; draw(); if(i>=D.steps.length){ G.solve('骨牌鏈接完了，水循環完成！'); return; } const S=D.steps[i]; G.t={term:S.term,stage:'q'};
    G.mc(area,'鏈尾的描述，說的是哪一個過程？',[S.term].concat(S.wrong),0,(right)=>{ if(right){ G.later(pick,600); } else if(!fail())G.hint('不是這個過程。'); },true); }
  function pick(){ area.innerHTML=''; const S=D.steps[i]; G.t={term:S.term,stage:'pick'}; G.el('div','sub','從手牌裡選出能接上去的骨牌',area); const hand=G.el('div',null,null,area); hand.style.cssText='display:flex;flex-direction:column;gap:6px;margin-top:6px';
    G.shuffle(D.steps.slice(i)).forEach(T=>{ const t=tile(T.term,T.next,hand); t.dataset.term=T.term; t.style.cursor='pointer';
      t.addEventListener('click',()=>{ if(T.term===S.term){ G.ok(); tile(T.term,T.next,chain); i++; G.hint(''); step(); } else { G.buzz(); G.shake(t); if(!fail())G.hint('這張接不上：左邊要和你剛才答的過程一樣。'); } }); }); }
  step();
}}
//==GAME==
{no:'124',slug:'listthem',title:'列舉搶答',brand:'NAME THEM',type:'解謎',
intro:'每一題都有好幾個正確答案。自己打字，一次輸入一個。\n說中足夠多個就過這一題；說錯三次這一題就失敗。',
data:{strikes:3,rounds:[
 {q:'說出一種再生能源',need:4,answers:[{a:'太陽能',alias:['太陽','光電','太陽光電']},{a:'風力',alias:['風能','風','風力發電']},{a:'水力',alias:['水能','水力發電']},{a:'地熱',alias:['地熱能']},{a:'生質能',alias:['生質','沼氣']},{a:'潮汐',alias:['潮汐能','海洋能','波浪能']}]},
 {q:'說出一個太陽系的行星',need:5,answers:[{a:'水星'},{a:'金星'},{a:'地球'},{a:'火星'},{a:'木星'},{a:'土星'},{a:'天王星'},{a:'海王星'}]}]},
build:function(host,D,G){
  let r=0, strikes, found; const norm=s=>String(s).replace(/\s+/g,'').toLowerCase();
  const stat=G.el('div','stat','',host), p=G.el('div','panel',null,host), q=G.el('div','q','',p), list=G.el('div',null,null,host); list.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:6px;width:100%';
  const row=G.el('div','row',null,host), inp=G.el('input','inp',null,row); inp.placeholder='輸入一個答案'; inp.style.letterSpacing='1px'; const go=G.el('button','go','送出',row);
  function draw(){ const R=D.rounds[r]; stat.textContent='第 '+(r+1)+' / '+D.rounds.length+' 題 · 說中 '+found.filter(x=>x).length+'（需要 '+R.need+'）· 失誤 '+'✖'.repeat(strikes)+'·'.repeat(D.strikes-strikes);
    q.textContent=R.q; list.innerHTML=''; R.answers.forEach((x,i)=>{ const c=G.el('div','cell',found[i]?x.a:'？',list); c.style.cssText='padding:10px;cursor:default;'+(found[i]?'color:var(--good);border-color:var(--good)':''); }); }
  function start(){ strikes=0; found=D.rounds[r].answers.map(()=>false); G.t={round:D.rounds[r]}; draw(); }
  function submit(){ if(G.solved()||strikes>=D.strikes)return; const v=norm(inp.value); if(!v)return; inp.value=''; const R=D.rounds[r];
    const i=R.answers.findIndex(x=>norm(x.a)===v||(x.alias||[]).map(norm).indexOf(v)>=0);
    if(i>=0&&found[i]){ G.hint('這個已經說過了。'); return; }
    if(i>=0){ found[i]=true; G.ok(); G.hint('說中了！'); draw();
      if(found.filter(x=>x).length>=R.need){ r++; if(r>=D.rounds.length){ G.solve('兩題都過關了！'); return; } G.hint('這一題過關，下一題。'); G.later(start,900); } return; }
    strikes++; G.buzz(); G.shake(inp); draw();
    if(strikes>=D.strikes){ G.hint('失誤三次，這一題失敗，重新來過。'); G.later(()=>G.restart(),1800); } else G.hint('這個不在答案裡。'); }
  go.addEventListener('click',submit); inp.addEventListener('keydown',e=>{ if(e.key==='Enter')submit(); });
  start();
}}
