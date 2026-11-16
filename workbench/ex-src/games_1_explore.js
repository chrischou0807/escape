//==GAME==
{no:'101',slug:'wordsearch',title:'找字遊戲',brand:'WORD SEARCH',type:'探索',
intro:'依照定義，在字母方陣裡找出對應的英文單字。\n先點單字的第一個字母，再點最後一個字母。',
data:{size:9,words:[
 {w:'OXYGEN',clue:'燃燒與呼吸都需要的氣體'},{w:'CARBON',clue:'鑽石與石墨的組成元素'},
 {w:'IRON',clue:'會被磁鐵吸引、生鏽後變紅褐色的金屬'},{w:'HELIUM',clue:'讓氣球飄起來的惰性氣體'},
 {w:'SODIUM',clue:'食鹽裡的金屬元素'},{w:'GOLD',clue:'元素符號是 Au 的貴金屬'}]},
build:function(host,D,G){
  const n=D.size, words=D.words.map(x=>({w:String(x.w).toUpperCase(),clue:x.clue,found:false}));
  const dirs=[[0,1],[1,0],[1,1],[-1,1]]; let grid;
  function place(){ grid=new Array(n*n).fill('');
    for(const it of words){ const w=it.w; let ok=false;
      for(let t=0;t<400&&!ok;t++){ const d=dirs[G.rnd(4)], r=G.rnd(n), c=G.rnd(n), er=r+d[0]*(w.length-1), ec=c+d[1]*(w.length-1);
        if(er<0||er>=n||ec<0||ec>=n)continue; let fit=true;
        for(let j=0;j<w.length;j++){ const ch=grid[(r+d[0]*j)*n+c+d[1]*j]; if(ch&&ch!==w[j]){fit=false;break;} }
        if(!fit)continue; for(let j=0;j<w.length;j++)grid[(r+d[0]*j)*n+c+d[1]*j]=w[j]; it.pos=[r,c,er,ec]; ok=true; }
      if(!ok)return false; }
    return true; }
  let tries=0; while(!place()){ if(++tries>60)throw new Error('words do not fit'); }
  for(let i=0;i<n*n;i++)if(!grid[i])grid[i]=String.fromCharCode(65+G.rnd(26));
  G.t={words:words};
  const board=G.el('div',null,null,host); board.style.cssText='display:grid;gap:3px;width:100%;grid-template-columns:repeat('+n+',1fr)';
  const cells=[]; let first=-1;
  for(let i=0;i<n*n;i++){ const c=G.el('div','cell',grid[i],board); c.style.cssText='aspect-ratio:1;font-size:'+(n>10?13:17)+'px'; c.dataset.i=i; cells.push(c);
    c.addEventListener('click',()=>tap(i)); }
  const list=G.el('div','panel',null,host); const rows=words.map((it,k)=>{ const r=G.el('div','sub',(k+1)+'. '+it.clue+'（'+it.w.length+' 個字母）',list); r.style.cssText='text-align:left;padding:4px 0;font-size:14px'; return r; });
  function tap(i){ if(G.solved())return;
    if(first<0){ first=i; cells[i].style.outline='2px solid var(--amber)'; G.tick(); return; }
    const a=first; first=-1; cells[a].style.outline=''; if(a===i)return;
    const r1=Math.floor(a/n),c1=a%n,r2=Math.floor(i/n),c2=i%n,dr=r2-r1,dc=c2-c1;
    if(!(dr===0||dc===0||Math.abs(dr)===Math.abs(dc))){ G.buzz(); G.hint('要在同一條直線上（橫、直或斜）。'); return; }
    const len=Math.max(Math.abs(dr),Math.abs(dc)), sr=Math.sign(dr), sc=Math.sign(dc), idx=[]; let s='';
    for(let j=0;j<=len;j++){ const k=(r1+sr*j)*n+c1+sc*j; idx.push(k); s+=grid[k]; }
    const rev=s.split('').reverse().join(''); const k=words.findIndex(it=>!it.found&&(it.w===s||it.w===rev));
    if(k<0){ G.buzz(); G.hint('這不是要找的單字。'); return; }
    words[k].found=true; idx.forEach(x=>{cells[x].style.background='#21382b';cells[x].style.color='#7fce9b';}); rows[k].textContent='✓ '+words[k].w+'：'+words[k].clue; rows[k].style.color='#7fce9b'; G.ok();
    const left=words.filter(it=>!it.found).length; G.hint(left?'還有 '+left+' 個。':'');
    if(!left)G.solve('六個單字都找到了！');
  }
}}
//==GAME==
{no:'102',slug:'eavesdrop',title:'門後偷聽',brand:'LISTEN IN',type:'探索',
intro:'走廊上有四扇門。點門聽裡面的人說話，每扇門只能聽兩次。\n聽完再回答問題，答案都藏在對話裡。',
data:{subtitles:false,plays:2,doors:[
 {name:'101 室',line:'管理員說，頂樓的水塔今天早上九點就清洗完了，下午才會重新供水。'},
 {name:'102 室',line:'我下午三點要去圖書館還書，那本書是關於火山的，已經借了兩個星期。'},
 {name:'103 室',line:'鑰匙我放在信箱裡了，信箱的密碼就是我們家的門牌號碼，二十七號。'},
 {name:'104 室',line:'停電的時候，記得先關掉電器的開關，等來電之後再一樣一樣打開。'}],
 questions:[
 {q:'水塔是什麼時候清洗完的？',opts:['早上九點','下午三點','晚上七點'],a:0},
 {q:'信箱的密碼是多少？',opts:['27','72','17'],a:0},
 {q:'102 室的人借的書和什麼有關？',opts:['火山','地震','颱風'],a:0},
 {q:'停電的時候應該先做什麼？',opts:['關掉電器的開關','打開所有電燈','馬上打開冰箱檢查'],a:0}]},
build:function(host,D,G){
  const canSpeak=('speechSynthesis' in window); let showSub=!!D.subtitles||!canSpeak;
  const heard=D.doors.map(()=>0); G.t={D:D};
  const row=G.el('div','row',null,host); const bubble=G.el('div','panel',null,host); bubble.style.minHeight='70px'; const btxt=G.el('div','sub','點一扇門，把耳朵貼上去…',bubble);
  const startBtn=G.el('button','go','聽完了，開始作答',host); startBtn.disabled=true;
  const subBtn=G.el('button','pill',showSub?'字幕：開':'聽不到聲音？顯示字幕',host);
  subBtn.addEventListener('click',()=>{ showSub=true; subBtn.textContent='字幕：開'; });
  G.onClean(()=>{ try{speechSynthesis.cancel();}catch(e){} });
  const btns=D.doors.map((d,i)=>{ const b=G.el('button','opt',null,row); b.style.cssText='width:46%;font-size:15px;padding:16px 6px'; b.dataset.door=i;
    const draw=()=>{ b.textContent='🚪 '+d.name+'（剩 '+(D.plays-heard[i])+' 次）'; b.disabled=heard[i]>=D.plays; }; draw();
    b.addEventListener('click',()=>{ heard[i]++; draw(); G.tick();
      btxt.textContent=showSub?('「'+d.line+'」'):'（'+d.name+' 裡有人在說話…）';
      if(canSpeak){ try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(d.line); u.lang='zh-TW'; u.rate=0.95; speechSynthesis.speak(u); }catch(e){} }
      if(heard.every(x=>x>0))startBtn.disabled=false; });
    return b; });
  startBtn.addEventListener('click',()=>{ try{speechSynthesis.cancel();}catch(e){} host.innerHTML=''; ask(); });
  function ask(){ let queue=G.shuffle(D.questions), wrong=0;
    const stat=G.el('div','stat','',host), area=G.el('div',null,null,host); area.style.width='100%';
    function next(){ area.innerHTML=''; stat.textContent='剩 '+queue.length+' 題 · 答錯 '+wrong+' 次';
      if(!queue.length){ G.solve('你把門後的對話都聽清楚了！'); return; }
      const it=queue[0];
      G.mc(area,it.q,it.opts,it.a,(right)=>{ if(right){ queue.shift(); } else { wrong++; queue.push(queue.shift());
          if(wrong>=3){ G.hint('答錯三次了，回走廊重新聽一次。'); G.later(()=>G.restart(),1400); return; } G.hint('不對，這題等一下再回來。'); }
        G.later(next,800); });
    } next(); }
}}
//==GAME==
{no:'103',slug:'moveaside',title:'移開物件找線索',brand:'MOVE ASIDE',type:'探索',
intro:'桌上每樣東西底下都壓著一個數字。把東西拖開就看得到。',
data:{tries:3,prompt:'哪些東西會導電？\n把「會導電」的東西底下的數字，依位置編號由小到大排起來，就是密碼。\n有些東西看起來很像，別被外表騙了。',
 items:[{label:'銅鑰匙',icon:'🔑',digit:3,key:true},{label:'金色塑膠尺',icon:'📏',digit:8,key:false,note:'表面亮亮的，很像金屬'},{label:'鐵釘',icon:'🔩',digit:1,key:true},
        {label:'橡皮擦',icon:'🧽',digit:5,key:false},{label:'鋁罐',icon:'🥫',digit:6,key:true},{label:'鉛筆芯',icon:'✏️',digit:9,key:true,note:'黑黑的，不像金屬'}]},
build:function(host,D,G){
  const answer=D.items.filter(x=>x.key).map(x=>x.digit).join(''); G.t={answer:answer};
  G.el('div','q',D.prompt,G.el('div','panel',null,host));
  const desk=G.el('div',null,null,host); desk.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%;padding:12px;border-radius:14px;background:#3b2c1c;border:1px solid rgba(255,255,255,.08)';
  D.items.forEach((it,i)=>{ const spot=G.el('div',null,null,desk); spot.style.cssText='position:relative;aspect-ratio:1;border-radius:10px;background:#2a1f13;display:flex;align-items:center;justify-content:center';
    const d=G.el('div',null,String(it.digit),spot); d.style.cssText='font-family:var(--display);font-size:34px;font-weight:700;color:var(--amber)';
    const tag=G.el('div',null,String(i+1),spot); tag.style.cssText='position:absolute;left:6px;top:4px;font-size:11px;color:var(--txt-dim)';
    const card=G.el('div',null,null,spot); card.style.cssText='position:absolute;inset:0;border-radius:10px;background:linear-gradient(180deg,#d9c9a8,#bfa97f);color:#2b2115;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:13px;font-weight:600;box-shadow:0 6px 12px -4px rgba(0,0,0,.6);cursor:grab;z-index:2';
    card.dataset.item=i; const ic=G.el('div',null,it.icon,card); ic.style.fontSize='30px'; G.el('div',null,it.label,card); if(it.note){ const nt=G.el('div',null,it.note,card); nt.style.cssText='font-size:10px;font-weight:400;opacity:.75;padding:0 4px;text-align:center;line-height:1.2'; }
    let ox=0,oy=0,cx=0,cy=0;
    G.drag(card,{start:()=>{card.style.zIndex=5;},move:(dx,dy)=>{cx=ox+dx;cy=oy+dy;card.style.transform='translate('+cx+'px,'+cy+'px)';},end:()=>{ox=cx;oy=cy;card.style.zIndex=3;G.tick();}});
  });
  const row=G.el('div','row',null,host); const inp=G.el('input','inp',null,row); inp.inputMode='numeric'; inp.placeholder='密碼'; inp.maxLength=8;
  const go=G.el('button','go','確認',row); let wrong=0, dead=false;
  const decoys=D.items.filter(x=>x.note), noteAns=(want)=>D.items.filter(x=>x.note?!x.key:x.key).map(x=>x.digit).join('');
  go.addEventListener('click',()=>{ if(dead||G.solved())return; if(inp.value.trim()===answer){ G.solve('密碼正確！\n外表像金屬的不一定導電，石墨看起來不像金屬卻會導電。'); return; }
    wrong++; G.buzz(); G.shake(inp); const left=D.tries?D.tries-wrong:0;
    const why=(decoys.length&&inp.value.trim()===noteAns())?'你是看外表判斷的嗎？「看起來像不像金屬」不等於「會不會導電」。':'想想每一樣東西是什麼材質做的。';
    if(D.tries&&left<=0){ dead=true; G.hint('密碼不對。'+why+'次數用完，重新來過。'); G.later(()=>G.restart(),2600); return; }
    G.hint('密碼不對。'+why+(D.tries?'還能試 '+left+' 次。':'')); });
}}
//==GAME==
{no:'104',slug:'layers',title:'圖層翻找',brand:'PAPER STACK',type:'探索',
intro:'桌上疊了一堆便條紙。點一張把它翻到最上面，或把最上面那張壓到最底下。\n把線索湊齊，回答下面的問題。',
data:{notes:['樣本 A：滴入石蕊試液後變成紅色。','樣本 B：滴入石蕊試液後變成藍色。','樣本 C：滴入石蕊試液後沒有變色。',
 '置物櫃密碼＝酸性樣本的編號，接著鹼性樣本的編號。\n（A＝1、B＝2、C＝3）','提醒：石蕊遇酸變紅，遇鹼變藍。'],
 question:'置物櫃的密碼是多少？',answers:['12']},
build:function(host,D,G){
  G.t={answers:D.answers};
  const pile=G.el('div',null,null,host); pile.style.cssText='position:relative;width:100%;height:300px;border-radius:14px;background:#3b2c1c;border:1px solid rgba(255,255,255,.08);overflow:hidden';
  let z=1; const order=G.shuffle(D.notes.map((t,i)=>i)); const els=[];
  order.forEach((idx,k)=>{ const n=G.el('div','note',D.notes[idx],pile); n.dataset.note=idx;
    n.style.cssText+=';position:absolute;width:74%;min-height:150px;white-space:pre-wrap;left:'+(4+G.rnd(18))+'%;top:'+(6+G.rnd(34))+'%;transform:rotate('+(G.rnd(9)-4)+'deg);z-index:'+(z++)+';cursor:pointer';
    n.addEventListener('click',()=>{ n.style.zIndex=z++; G.tick(); }); els.push(n); });
  const down=G.el('button','pill','把最上面那張壓到最底下',host);
  down.addEventListener('click',()=>{ let top=els[0]; els.forEach(e=>{ if(+e.style.zIndex>+top.style.zIndex)top=e; }); let min=Infinity; els.forEach(e=>{min=Math.min(min,+e.style.zIndex);}); top.style.zIndex=min-1; G.tick(); });
  const p=G.el('div','panel',null,host); G.el('div','q',D.question,p);
  const row=G.el('div','row',null,p); row.style.marginTop='10px'; const inp=G.el('input','inp',null,row); inp.placeholder='答案';
  const go=G.el('button','go','確認',row);
  const norm=s=>String(s).replace(/\s+/g,'').toLowerCase();
  go.addEventListener('click',()=>{ if(D.answers.map(norm).indexOf(norm(inp.value))>=0)G.solve('答對了！線索都被你翻出來了。'); else{ G.buzz(); G.shake(inp); G.hint('不對。是不是還有便條紙沒翻到？'); } });
}}
//==GAME==
{no:'105',slug:'spotcommon',title:'找共同項',brand:'SPOT THE MATCH',type:'探索',
intro:'上下兩張卡片裡，剛好只有一組「數值相等」的數。\n上面點一個、下面點一個，把它們找出來。',
data:{rounds:5,per:6,pairs:[['1/2','0.5'],['1/4','25%'],['3/4','0.75'],['1/5','20%'],['1/10','0.1'],['2/5','40%'],['1/8','0.125'],
 ['3/5','0.6'],['7/10','70%'],['1/20','5%'],['9/10','0.9'],['3/10','30%'],['1/100','1%'],['4/5','80%']]},
build:function(host,D,G){
  const per=D.per; if(D.pairs.length<per*2-1)throw new Error('pairs too few');
  let round=0, miss=0, sel=null; const stat=G.el('div','stat','',host);
  const top=G.el('div','panel',null,host), bot=G.el('div','panel',null,host);
  [top,bot].forEach(p=>{p.style.cssText+=';display:grid;grid-template-columns:repeat(3,1fr);gap:8px';});
  function chip(parent,text,isC,side){ const b=G.el('button','opt',text,parent); b.style.cssText='font-family:var(--display);font-size:18px;padding:16px 4px'; b.dataset.side=side;
    b.addEventListener('click',()=>{ if(side==='t'){ [].forEach.call(top.children,x=>x.classList.remove('on')); b.classList.add('on'); sel={b:b,c:isC}; G.tick(); return; }
      if(!sel){ G.hint('先在上面那張卡片選一個。'); return; }
      if(sel.c&&isC){ G.ok(); sel.b.classList.add('good'); b.classList.add('good'); round++; G.later(next,600); }
      else { miss++; G.buzz(); G.shake(bot); G.hint('這兩個不相等。'); sel.b.classList.remove('on'); sel=null; draw(); } });
    return b; }
  function draw(){ stat.textContent='第 '+Math.min(round+1,D.rounds)+' / '+D.rounds+' 回合 · 失誤 '+miss; }
  function next(){ if(round>=D.rounds){ G.solve('五回合全部完成，失誤 '+miss+' 次。'); return; }
    sel=null; top.innerHTML=''; bot.innerHTML=''; G.hint(''); const p=G.shuffle(D.pairs), s=G.rnd(2);
    const a=[{t:p[0][s],c:true}], b=[{t:p[0][1-s],c:true}];
    for(let i=1;i<per;i++){ a.push({t:p[i][G.rnd(2)],c:false}); b.push({t:p[i+per-1][G.rnd(2)],c:false}); }
    G.t={common:[p[0][s],p[0][1-s]]};
    G.shuffle(a).forEach(x=>chip(top,x.t,x.c,'t')); G.shuffle(b).forEach(x=>chip(bot,x.t,x.c,'b')); draw(); }
  next();
}}
//==GAME==
{no:'106',slug:'lynx',title:'快速找對應圖',brand:'QUICK FIND',type:'探索',
intro:'依照題目給的元素名稱，在板子上找到它的元素符號。\n點錯會加 3 秒。',
data:{need:8,penalty:3,items:[{show:'H',name:'氫'},{show:'He',name:'氦'},{show:'C',name:'碳'},{show:'N',name:'氮'},{show:'O',name:'氧'},
 {show:'Na',name:'鈉'},{show:'Mg',name:'鎂'},{show:'Al',name:'鋁'},{show:'Si',name:'矽'},{show:'S',name:'硫'},{show:'Cl',name:'氯'},{show:'K',name:'鉀'},
 {show:'Ca',name:'鈣'},{show:'Fe',name:'鐵'},{show:'Cu',name:'銅'},{show:'Zn',name:'鋅'},{show:'Ag',name:'銀'},{show:'Au',name:'金'},{show:'Hg',name:'汞'},{show:'Pb',name:'鉛'}]},
build:function(host,D,G){
  const targets=G.shuffle(D.items).slice(0,D.need); let k=0, t0=Date.now(), pen=0;
  const row=G.el('div','row',null,host), ask=G.el('div','q','',row), stat=G.el('div','stat','',row); ask.style.fontSize='22px';
  const board=G.el('div',null,null,host); board.style.cssText='display:grid;grid-template-columns:repeat(5,1fr);gap:7px;width:100%';
  const secs=()=>((Date.now()-t0)/1000+pen);
  function draw(){ ask.textContent='找出：'+targets[k].name; G.t={target:targets[k].show}; }
  G.every(()=>{ if(!G.solved())stat.textContent=secs().toFixed(1)+' 秒 · '+k+'/'+D.need; },100);
  G.shuffle(D.items).forEach(it=>{ const c=G.el('button','opt',it.show,board); c.style.cssText='font-family:var(--display);font-size:19px;font-weight:700;padding:14px 0'; c.dataset.show=it.show;
    c.addEventListener('click',()=>{ if(G.solved())return;
      if(it.show===targets[k].show){ G.ok(); c.classList.add('good'); G.later(()=>c.classList.remove('good'),400); k++;
        if(k>=D.need){ G.solve('全部找到！用時 '+secs().toFixed(1)+' 秒（含加罰 '+pen+' 秒）。'); return; } draw(); }
      else { pen+=D.penalty; G.buzz(); c.classList.add('bad'); G.later(()=>c.classList.remove('bad'),400); G.hint(it.show+' 是'+it.name+'，加 '+D.penalty+' 秒。'); } }); });
  draw();
}}
//==GAME==
{no:'107',slug:'detector',title:'探測器',brand:'DETECTOR',type:'探索',
intro:'地底下埋了幾顆寶石。拖動探測器，訊號越強代表越接近。\n覺得就在正下方時按「在這裡挖」，挖的次數有限。',
data:{targets:3,digs:8,radius:0.09},
build:function(host,D,G){
  const pts=[]; let guard=0;
  while(pts.length<D.targets&&guard++<500){ const p={x:0.1+Math.random()*0.8,y:0.1+Math.random()*0.8,found:false}; if(pts.every(q=>Math.hypot(q.x-p.x,q.y-p.y)>0.28))pts.push(p); }
  G.t={pts:pts}; let digs=D.digs, pos={x:0.5,y:0.5};
  const stat=G.el('div','stat','',host);
  const barW=G.el('div',null,null,host); barW.style.cssText='width:100%;height:16px;border-radius:999px;background:#13171c;border:1px solid var(--line);overflow:hidden';
  const bar=G.el('div',null,null,barW); bar.style.cssText='height:100%;width:0;background:linear-gradient(90deg,#4f6b7a,#ffce78,#e8857a)';
  const field=G.el('div',null,null,host); field.style.cssText='position:relative;width:100%;aspect-ratio:1;border-radius:14px;overflow:hidden;border:1px solid var(--line);background:repeating-linear-gradient(45deg,#4a3a25 0 14px,#44351f 14px 28px)';
  const det=G.el('div',null,'📡',field); det.style.cssText='position:absolute;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;border:2px solid var(--amber);background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;font-size:24px;cursor:grab;z-index:3';
  const near=()=>{ let best=null,bd=9; pts.forEach(p=>{ if(p.found)return; const d=Math.hypot(p.x-pos.x,p.y-pos.y); if(d<bd){bd=d;best=p;} }); return {p:best,d:bd}; };
  let lastBeep=0;
  function draw(){ det.style.left=(pos.x*100)+'%'; det.style.top=(pos.y*100)+'%'; const s=Math.max(0,1-near().d/0.6); bar.style.width=(s*100)+'%';
    stat.textContent='已找到 '+pts.filter(p=>p.found).length+'/'+pts.length+' · 還能挖 '+digs+' 次';
    const now=Date.now(); if(now-lastBeep>260-200*s){ lastBeep=now; G.tone(300+700*s,0.05,'sine',0.03); } }
  let base=null;
  G.drag(det,{start:()=>{base={x:pos.x,y:pos.y};},move:(dx,dy)=>{ const w=field.clientWidth; pos.x=Math.min(0.97,Math.max(0.03,base.x+dx/w)); pos.y=Math.min(0.97,Math.max(0.03,base.y+dy/w)); draw(); }});
  G.moveTo=(x,y)=>{pos.x=x;pos.y=y;draw();};
  const dig=G.el('button','go','在這裡挖',host);
  dig.addEventListener('click',()=>{ if(G.solved()||digs<=0)return; digs--; const n=near(); const m=G.el('div',null,null,field); m.style.cssText='position:absolute;transform:translate(-50%,-50%);font-size:22px;left:'+(pos.x*100)+'%;top:'+(pos.y*100)+'%';
    if(n.p&&n.d<=D.radius){ n.p.found=true; m.textContent='💎'; G.ok(); G.hint('挖到了！'); } else { m.textContent='✖'; m.style.color='#e8857a'; G.buzz(); G.hint('這裡什麼都沒有。'); }
    draw();
    if(pts.every(p=>p.found)){ G.solve('寶石全部挖出來了，還剩 '+digs+' 次沒用。'); return; }
    if(digs<=0){ G.hint('次數用完了，寶石換了位置，再試一次。'); G.later(()=>G.restart(),1600); } });
  draw();
}}
