//==GAME==
{no:'146',slug:'yesno',title:'只答是否的提問',brand:'YES OR NO',type:'解謎',
intro:'我心裡想了其中一個。你可以從下面挑問題來問，我只回答「是」「否」或「不一定」。\n點卡片可以把排除的劃掉。問題數有限，想清楚再問，最後按「指認」選出答案。',
data:{maxAsk:4,rounds:2,questions:['有脊椎骨嗎？','是哺乳類嗎？','會飛嗎？','一生都住在水裡嗎？','身上有羽毛嗎？','有六隻腳嗎？','是恆溫動物嗎？','有殼嗎？'],
 items:[{name:'麻雀',ans:'是否是否是否是否'},{name:'蝙蝠',ans:'是是是否否否是否'},{name:'鯨魚',ans:'是是否是否否是否'},{name:'鯊魚',ans:'是否否是否否否否'},{name:'青蛙',ans:'是否否？否否否否'},{name:'烏龜',ans:'是否否？否否否是'},{name:'蝴蝶',ans:'否否是否否是否否'},{name:'蜘蛛',ans:'否否否否否否否否'}]},
build:function(host,D,G){
  const total=D.rounds||2, nq=D.questions.length; D.items.forEach(it=>{ if(String(it.ans).length<nq)throw new Error('ans too short'); });
  let r=0, order=G.shuffle(D.items.map((x,i)=>i));
  const stat=G.el('div','stat','',host), grid=G.el('div',null,null,host), go=G.el('button','go','',host), qs=G.el('div','opts',null,host);
  grid.style.cssText='display:grid;grid-template-columns:repeat(4,1fr);gap:6px;width:100%';
  function start(){ const target=order[r%order.length]; let left=D.maxAsk, accuse=false, busy=false; G.t={target:target,name:D.items[target].name}; grid.innerHTML=''; qs.innerHTML=''; go.textContent='我知道了，指認';
    const show=()=>{ stat.textContent='第 '+(r+1)+' / '+total+' 回合 · 還能問 '+left+' 題'; }; show();
    D.items.forEach((it,i)=>{ const c=G.el('div','cell',it.name,grid); c.dataset.i=i; c.style.cssText='height:52px;font-size:15px;text-align:center;padding:2px';
      c.addEventListener('click',()=>{ if(busy||G.solved())return;
        if(!accuse){ const off=c.dataset.off==='1'; c.dataset.off=off?'0':'1'; c.style.opacity=off?'1':'.28'; c.style.textDecoration=off?'none':'line-through'; G.tick(); return; }
        busy=true;
        if(i===target){ c.style.borderColor='var(--good)'; c.style.color='var(--good)'; G.ok(); r++; G.later(()=>{ if(r>=total)G.solve('每一回合都指認對了！'); else { G.hint('答對，是'+it.name+'。換下一個。'); start(); } },900); }
        else { c.style.borderColor='var(--bad)'; c.style.color='var(--bad)'; G.buzz(); G.shake(grid); G.hint('不是'+it.name+'。我換一個重新想，這一回合重來。'); order=G.shuffle(order); G.later(start,1600); } }); });
    go.onclick=()=>{ if(busy||G.solved())return; accuse=!accuse; go.textContent=accuse?'指認中：點一張卡片（再按一次取消）':'我知道了，指認'; G.tick(); };
    D.questions.forEach((q,qi)=>{ const b=G.el('button','opt',q,qs); b.dataset.q=qi;
      b.addEventListener('click',()=>{ if(busy||G.solved()||b.dataset.done)return; if(left<=0){ G.buzz(); G.hint('問題用完了。用已經知道的答案推理，然後按「指認」。'); return; }
        left--; b.dataset.done='1'; const ch=String(D.items[target].ans).charAt(qi), a=ch==='是'?'是':(ch==='否'?'否':'不一定'); b.textContent=q+'　→　'+a; b.classList.add('on'); G.tick(); show(); G.hint(''); }); });
  }
  start();
}}
//==GAME==
{no:'147',slug:'mapscale',title:'比例尺量測',brand:'MAP SCALE',type:'操作',
intro:'拖動尺的兩端，量出地圖上兩個地點的距離。\n尺只告訴你圖上是幾公分，實際有多遠，要用比例尺自己換算。',
data:{scale:50000,widthCm:8,heightCm:8,tolPct:5,tries:3,points:[{name:'學校',x:1,y:1.5},{name:'車站',x:5,y:4.5},{name:'公園',x:7,y:1.5},{name:'碼頭',x:2,y:6.5}],
 rounds:[{path:['學校','車站']},{path:['車站','碼頭']},{path:['學校','公園','車站']}]},
build:function(host,D,G){
  let r=0; const stat=G.el('div','stat','',host), p=G.el('div','panel',null,host), q=G.el('div','q','',p), sc=G.el('div','sub','比例尺　1：'+Number(D.scale).toLocaleString('en-US'),p);
  const W=Math.min(host.clientWidth||340,380), ppc=W/D.widthCm, H=D.heightCm*ppc;
  const map=G.el('div',null,null,host); map.style.cssText='position:relative;width:'+W+'px;height:'+H+'px;border-radius:12px;border:1px solid var(--line);background:#20303a;overflow:hidden;touch-action:none';
  const ns='http://www.w3.org/2000/svg', svg=document.createElementNS(ns,'svg'); svg.setAttribute('width',W); svg.setAttribute('height',H); svg.style.cssText='position:absolute;left:0;top:0'; map.appendChild(svg);
  const line=document.createElementNS(ns,'line'); line.setAttribute('stroke','#ffce78'); line.setAttribute('stroke-width','3'); line.setAttribute('stroke-dasharray','6 4'); svg.appendChild(line);
  const byName={}; D.points.forEach(pt=>{ byName[pt.name]=pt; const d=G.el('div',null,null,map); d.style.cssText='position:absolute;width:12px;height:12px;border-radius:50%;background:#e7e3da;border:2px solid #1c2128;left:'+(pt.x*ppc-6)+'px;top:'+(pt.y*ppc-6)+'px';
    const l=G.el('div',null,pt.name,map); l.style.cssText='position:absolute;font-size:13px;color:#e7e3da;white-space:nowrap;transform:translateX(-50%);left:'+(pt.x*ppc)+'px;top:'+(pt.y*ppc+9)+'px;pointer-events:none'; });
  const ends=[{x:0.7,y:D.heightCm-0.6},{x:2.4,y:D.heightCm-0.6}], read=G.el('div','stat','',host);
  const dist=(a,b)=>Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
  function draw(){ line.setAttribute('x1',ends[0].x*ppc); line.setAttribute('y1',ends[0].y*ppc); line.setAttribute('x2',ends[1].x*ppc); line.setAttribute('y2',ends[1].y*ppc);
    ends.forEach(e=>{ e.h.style.left=(e.x*ppc-17)+'px'; e.h.style.top=(e.y*ppc-17)+'px'; }); read.textContent='尺上讀數：圖上 '+dist(ends[0],ends[1]).toFixed(1)+' 公分'; }
  ends.forEach((e,k)=>{ e.h=G.el('div',null,null,map); e.h.dataset.end=k; e.h.style.cssText='position:absolute;width:34px;height:34px;border-radius:50%;border:3px solid #ffce78;background:rgba(255,206,120,.18);cursor:grab;z-index:3';
    let ox=0,oy=0; G.drag(e.h,{start:()=>{ox=e.x;oy=e.y;},move:(dx,dy)=>{ let x=Math.max(0,Math.min(D.widthCm,ox+dx/ppc)), y=Math.max(0,Math.min(D.heightCm,oy+dy/ppc));
      D.points.forEach(pt=>{ if(dist({x:x,y:y},pt)<0.35){ x=pt.x; y=pt.y; } }); e.x=x; e.y=y; draw(); },end:()=>G.tick()}); });
  G.t={set:(k,name)=>{ ends[k].x=byName[name].x; ends[k].y=byName[name].y; draw(); }};
  const row=G.el('div','row',null,host), inp=G.el('input','inp',null,row); inp.placeholder='幾公里'; inp.inputMode='decimal'; const go=G.el('button','go','確認',row);
  let left=D.tries, ans=0, cm=0;
  function start(){ const R=D.rounds[r], P=R.path.map(n=>{ if(!byName[n])throw new Error('no point'); return byName[n]; }); cm=0; for(let i=1;i<P.length;i++)cm+=dist(P[i-1],P[i]); ans=cm*D.scale/100000; G.t.answer=ans; left=D.tries; inp.value='';
    stat.textContent='第 '+(r+1)+' / '+D.rounds.length+' 題 · 可答 '+left+' 次';
    q.textContent=R.path.length>2?('從「'+R.path[0]+'」經過「'+R.path.slice(1,-1).join('」「')+'」到「'+R.path[R.path.length-1]+'」，實際一共幾公里？'):('從「'+R.path[0]+'」到「'+R.path[1]+'」，實際距離是幾公里？'); }
  function submit(){ if(G.solved())return; const v=parseFloat(String(inp.value).replace(/[^\d.]/g,'')); if(isNaN(v)){ G.hint('請輸入數字，例如 2.5。'); return; }
    if(Math.abs(v-ans)<=ans*D.tolPct/100+1e-9){ G.ok(); r++; if(r>=D.rounds.length){ G.solve('每一段距離都量對、也換算對了！'); return; } G.hint('正確，約 '+(Math.round(ans*10)/10)+' 公里。下一題。'); start(); return; }
    left--; G.buzz(); G.shake(inp); stat.textContent='第 '+(r+1)+' / '+D.rounds.length+' 題 · 可答 '+left+' 次';
    if(left<=0){ G.hint('三次都不對。先量圖上幾公分，再乘上比例尺，最後把公分換成公里。從頭再來。'); G.later(()=>G.restart(),2600); return; }
    G.hint(Math.abs(v-cm)<=cm*0.06?'這是圖上的公分數，還沒有用比例尺換算。':(Math.abs(v-ans*1000)<=ans*60?'單位是公里，不是公尺。':'不對。檢查尺的兩端有沒有對準，還有換算的單位。')); }
  go.addEventListener('click',submit); inp.addEventListener('keydown',e=>{ if(e.key==='Enter')submit(); });
  draw(); start();
}}
//==GAME==
{no:'148',slug:'grille',title:'遮罩取字',brand:'GRILLE',type:'解謎',
intro:'這張公告看起來很普通，其實藏了一句話。\n每一行有一道題，答案是幾，就在那一行的第幾個字上打一個洞。洞打好後蓋上遮罩，只讀洞裡的字。',
data:{checks:3,rows:[{text:'出門記得帶好鑰匙',clue:'一星期有幾天？',col:7},{text:'抽屜裡沒有備用匙',clue:'蜘蛛有幾隻腳？',col:8},{text:'大家都不在教室裡',clue:'一隻手有幾根手指？',col:5},{text:'窗邊的花已經澆水',clue:'正方形有幾個邊？',col:4},{text:'請把盆栽搬到走廊',clue:'三角形有幾個角？',col:3},{text:'放學後留下來打掃',clue:'五邊形有幾個頂點？',col:5}]},
build:function(host,D,G){
  D.rows.forEach(R=>{ if(!(R.col>=1&&R.col<=String(R.text).length))throw new Error('col out of range'); });
  let left=D.checks, lock=false; const stat=G.el('div','stat','',host), box=G.el('div',null,null,host); box.style.cssText='width:100%;display:flex;flex-direction:column;gap:6px';
  const pick=D.rows.map(()=>0), cells=[]; G.t={cols:D.rows.map(R=>R.col),msg:D.rows.map(R=>String(R.text).charAt(R.col-1)).join('')};
  const show=()=>{ stat.textContent='已打 '+pick.filter(x=>x).length+' / '+D.rows.length+' 個洞 · 還能蓋 '+left+' 次'; };
  const W=Math.min(host.clientWidth||340,480);
  D.rows.forEach((R,ri)=>{ const lab=G.el('div','sub','第 '+(ri+1)+' 行　'+R.clue,box); lab.style.textAlign='left'; const row=G.el('div',null,null,box); row.style.cssText='display:flex;gap:3px'; const t=String(R.text), n=t.length, cw=Math.floor((W-3*(n-1))/n); cells.push([]);
    t.split('').forEach((ch,ci)=>{ const c=G.el('div','cell',ch,row); c.dataset.r=ri; c.dataset.c=ci+1; c.style.cssText='flex:1 1 0;height:'+Math.min(44,cw+6)+'px;font-size:'+Math.min(20,Math.floor(cw*0.55))+'px;font-family:var(--cjk);font-weight:500'; cells[ri].push(c);
      c.addEventListener('click',()=>{ if(lock||G.solved())return; pick[ri]=(pick[ri]===ci+1)?0:ci+1; paint(false); G.tick(); show(); }); }); });
  function paint(masked){ cells.forEach((rowc,ri)=>rowc.forEach((c,ci)=>{ const on=pick[ri]===ci+1; c.style.borderColor=on?'var(--brass)':'var(--line)'; c.style.background=on?'#3a3323':(masked?'#0c0e11':'var(--graphite)'); c.style.color=on?'var(--amber)':(masked?'transparent':'var(--txt)'); })); }
  const go=G.el('button','go','蓋上遮罩',host);
  go.addEventListener('click',()=>{ if(lock||G.solved())return; if(pick.some(x=>!x)){ G.hint('每一行都要打一個洞。'); return; }
    lock=true; paint(true); const got=D.rows.map((R,ri)=>String(R.text).charAt(pick[ri]-1)).join(''), bad=D.rows.filter((R,ri)=>pick[ri]!==R.col).length;
    if(!bad){ G.ok(); G.hint('洞裡的字：'+got); G.later(()=>G.solve('遮罩底下藏的話是：\n'+got),900); return; }
    left--; G.buzz(); show();
    if(left<=0){ G.hint('讀出來是「'+got+'」，讀不通。蓋的次數用完了，重新來過。'); G.later(()=>G.restart(),2400); return; }
    G.hint('讀出來是「'+got+'」，讀不通。有 '+bad+' 行的洞打錯位置。'); G.later(()=>{ lock=false; paint(false); },1800); });
  paint(false); show();
}}
//==GAME==
{no:'149',slug:'viewshift',title:'視角成形',brand:'CHANGE THE VIEW',type:'探索',
intro:'號碼就在畫面上，只是你看的方式不對。\n讀懂情境，選一種看法：倒過來、照鏡子、退遠、合起來。每一題只能換兩次看法。',
data:{switches:2,tries:3,rounds:[{type:'flip',show:'6081',clue:'你被倒吊在天花板上，看見門上的電子門牌是這樣。\n門牌真正的號碼是多少？'},{type:'far',code:'47',clue:'你站在田中央，四周都是作物。農夫說：\n「號碼種在田裡，飛到天上的人才看得見。」'},{type:'fold',code:'3958',clue:'通行證被撕成上下兩半，兩半都還在桌上。\n通行證上的號碼是多少？'}]},
build:function(host,D,G){
  const SEG={'0':'abcdef','1':'bc','2':'abged','3':'abgcd','4':'fgbc','5':'afgcd','6':'afgedc','7':'abc','8':'abcdefg','9':'abfgcd'}, ROT={'0':'0','1':'1','2':'2','5':'5','6':'9','8':'8','9':'6'};
  const PIX={'0':'111101101101111','1':'010110010010111','2':'111001111100111','3':'111001111001111','4':'101101111001001','5':'111100111001111','6':'111100111101111','7':'111001001001001','8':'111101111101111','9':'111101111001111'};
  const ns='http://www.w3.org/2000/svg', RECT={a:[6,0,28,7],b:[33,6,7,27],c:[33,39,7,27],d:[6,65,28,7],e:[0,39,7,27],f:[0,6,7,27],g:[6,32.5,28,7]};
  function seven(str,h){ const w=str.length*50-10, s=document.createElementNS(ns,'svg'); s.setAttribute('viewBox','0 0 '+w+' 72'); s.setAttribute('width',w*h/72); s.setAttribute('height',h); s.style.display='block';
    str.split('').forEach((ch,i)=>{ 'abcdefg'.split('').forEach(k=>{ const q=RECT[k], e=document.createElementNS(ns,'rect'); e.setAttribute('x',q[0]+i*50); e.setAttribute('y',q[1]); e.setAttribute('width',q[2]); e.setAttribute('height',q[3]); e.setAttribute('rx',3); e.setAttribute('fill',(SEG[ch]||'').indexOf(k)>=0?'#ffce78':'rgba(255,255,255,.06)'); s.appendChild(e); }); }); return s; }
  D.rounds.forEach(R=>{ if(R.type==='flip'){ if(!/^[0125689]+$/.test(String(R.show)))throw new Error('flip digits'); } else if(!/^\d+$/.test(String(R.code)))throw new Error('code digits'); });
  const TOOLS=[['flip','倒過來看'],['mirror','照鏡子'],['far','退遠看'],['fold','合起來']];
  let r=0; const stat=G.el('div','stat','',host), p=G.el('div','panel',null,host), q=G.el('div','q','',p);
  const view=G.el('div',null,null,host); view.style.cssText='position:relative;width:100%;height:190px;border-radius:12px;border:1px solid var(--line);background:#12161b;overflow:hidden;display:flex;align-items:center;justify-content:center';
  const bar=G.el('div','opts h',null,host), row=G.el('div','row',null,host), inp=G.el('input','inp',null,row); inp.placeholder='號碼'; inp.inputMode='numeric'; const go=G.el('button','go','確認',row);
  const btn={}; TOOLS.forEach(t=>{ const b=G.el('button','opt',t[1],bar); b.dataset.tool=t[0]; b.style.cssText='flex:1 1 40%;padding:10px 6px'; btn[t[0]]=b; b.addEventListener('click',()=>use(t[0])); });
  let cur=null, left=0, tries=0, ans='', apply=()=>{}, R=null;
  function show(){ stat.textContent='第 '+(r+1)+' / '+D.rounds.length+' 題 · 還能換 '+left+' 次看法 · 可答 '+tries+' 次'; TOOLS.forEach(t=>btn[t[0]].classList.toggle('on',cur===t[0])); }
  function use(t){ if(G.solved())return; if(cur===t){ cur=null; apply(); show(); G.tick(); return; } if(left<=0){ G.buzz(); G.hint('看法換完了。就用現在看到的作答，或按「重新開始」。'); return; } left--; cur=t; apply(); show(); G.tick(); G.hint(''); }
  function start(){ R=D.rounds[r]; cur=null; left=D.switches; tries=D.tries; inp.value=''; q.textContent=R.clue; view.innerHTML=''; const inner=G.el('div',null,null,view); inner.style.cssText='position:relative;transition:transform .45s ease;flex:none';
    const tf=(base)=>{ inner.style.transform=(cur==='flip'?'rotate(180deg) ':'')+(cur==='mirror'?'scaleX(-1) ':'')+base; };
    if(R.type==='flip'){ const s=String(R.show); ans=s.split('').reverse().map(c=>ROT[c]).join(''); inner.appendChild(seven(s,84)); apply=()=>tf(cur==='far'?'scale(.45)':'scale(1)'); }
    else if(R.type==='far'){ const s=String(R.code); ans=s; const cols=s.length*4+1, rows=7, cs=22; inner.style.cssText+=';display:grid;grid-template-columns:repeat('+cols+','+cs+'px);gap:2px';
      for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){ let on=false; const k=Math.floor((x-1)/4), cx=(x-1)%4; if(x>=1&&cx<3&&y>=1&&y<=5&&k<s.length)on=PIX[s.charAt(k)].charAt((y-1)*3+cx)==='1';
        const c=G.el('div',null,on?'禾':'草',inner); c.style.cssText='width:'+cs+'px;height:'+cs+'px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:12px;background:'+(on?'#b8935a':'#2f4a34')+';color:'+(on?'#3a2a10':'#5f8a66'); }
      const fit=Math.min(1,((view.clientWidth||340)-16)/(cols*(cs+2))); apply=()=>tf(cur==='far'?'scale('+fit+')':'scale(4.2)'); }
    else { const s=String(R.code); ans=s; const h=72, w=(s.length*50-10); inner.style.width=(w+60)+'px'; inner.style.height='170px';
      const mk=(top)=>{ const d=G.el('div',null,null,inner); d.style.cssText='position:absolute;width:'+w+'px;height:'+(h/2)+'px;overflow:hidden;transition:left .45s ease,top .45s ease;background:#f4ead8;border-radius:'+(top?'6px 6px 0 0':'0 0 6px 6px'); const sv=seven(s,h); sv.style.marginTop=top?'0':(-h/2)+'px'; sv.querySelectorAll('rect').forEach(e=>{ e.setAttribute('fill',e.getAttribute('fill')==='#ffce78'?'#3b3122':'rgba(0,0,0,.05)'); }); d.appendChild(sv); return d; };
      const A=mk(true), B=mk(false);
      apply=()=>{ const f=cur==='fold'; A.style.left=(f?30:58)+'px'; A.style.top=(f?49:112)+'px'; B.style.left=(f?30:2)+'px'; B.style.top=(f?49+h/2:14)+'px'; tf(cur==='far'?'scale(.5)':'scale(1)'); }; }
    G.t={answer:ans,type:R.type}; apply(); show(); }
  function submit(){ if(G.solved())return; const v=String(inp.value).replace(/\D/g,''); if(!v){ G.hint('請輸入號碼。'); return; }
    if(v===ans){ G.ok(); r++; if(r>=D.rounds.length){ G.solve('三個號碼都看出來了！'); return; } G.hint('正確，是 '+ans+'。下一題。'); start(); return; }
    tries--; G.buzz(); G.shake(inp); show();
    if(tries<=0){ G.hint('三次都不對，這一題重來。先想清楚情境裡的人是怎麼看的。'); G.later(()=>{ G.hint(''); start(); },2200); return; }
    G.hint(R.type==='flip'&&v===String(R.show)?'這是倒吊著看到的樣子，不是門牌真正的號碼。':'不對。換一種看法試試，情境裡有提示。'); }
  go.addEventListener('click',submit); inp.addEventListener('keydown',e=>{ if(e.key==='Enter')submit(); });
  start();
}}
//==GAME==
{no:'150',slug:'jugs',title:'分油問題',brand:'POUR IT RIGHT',type:'解謎',
intro:'桶子上沒有刻度，只知道每個桶子裝滿是多少。\n先點要倒出的桶子，再點要倒進的桶子；會一直倒到倒完或裝滿為止。在步數內量出指定的量。',
data:{unit:'公升',slack:2,rounds:[{caps:[8,5,3],start:[8,0,0],target:4},{caps:[10,7,3],start:[10,0,0],target:5}]},
build:function(host,D,G){
  function minMoves(R){ const key=a=>a.join(','), seen={}, n=R.caps.length; let q=[R.start.slice()], d=0; seen[key(R.start)]=1;
    while(q.length){ const nx=[]; for(const s of q){ if(s.indexOf(R.target)>=0)return d; for(let i=0;i<n;i++)for(let j=0;j<n;j++){ if(i===j)continue; const m=Math.min(s[i],R.caps[j]-s[j]); if(m<=0)continue; const t=s.slice(); t[i]-=m; t[j]+=m; if(!seen[key(t)]){ seen[key(t)]=1; nx.push(t); } } } q=nx; d++; } return -1; }
  const mins=D.rounds.map(R=>{ if(R.caps.length!==R.start.length)throw new Error('caps/start'); const m=minMoves(R); if(m<1)throw new Error('unsolvable'); return m; });
  let r=0; const stat=G.el('div','stat','',host), p=G.el('div','panel',null,host), q=G.el('div','q','',p), tank=G.el('div','row',null,host); tank.style.cssText='align-items:flex-end;gap:14px;flex-wrap:nowrap;min-height:210px';
  function start(){ const R=D.rounds[r], max=mins[r]+(D.slack||0), top=Math.max.apply(null,R.caps); let s=R.start.slice(), used=0, sel=-1, busy=false; G.t={min:mins[r],max:max,caps:R.caps.slice(),start:R.start.slice(),target:R.target};
    q.textContent='量出剛好 '+R.target+' '+D.unit+'（任何一個桶子裡有 '+R.target+' '+D.unit+'就算）'; tank.innerHTML='';
    const show=()=>{ stat.textContent='第 '+(r+1)+' / '+D.rounds.length+' 題 · 已倒 '+used+' / '+max+' 次'; };
    const jugs=R.caps.map((cap,i)=>{ const col=G.el('div',null,null,tank); col.style.cssText='display:flex;flex-direction:column;align-items:center;gap:6px;flex:0 0 auto'; const lab=G.el('div','sub','',col);
      const j=G.el('div',null,null,col); j.dataset.jug=i; j.style.cssText='position:relative;width:74px;height:'+Math.round(40+130*cap/top)+'px;border:2px solid var(--brass-lo);border-top:none;border-radius:0 0 12px 12px;background:rgba(255,255,255,.03);overflow:hidden;cursor:pointer';
      const f=G.el('div',null,null,j); f.style.cssText='position:absolute;left:0;right:0;bottom:0;background:linear-gradient(180deg,#e0b860,#b8935a);transition:height .35s ease'; G.el('div','sub','滿是 '+cap,col);
      j.addEventListener('click',()=>{ if(busy||G.solved())return;
        if(sel<0){ if(s[i]<=0){ G.hint('這個桶子是空的，沒東西可倒。'); return; } sel=i; paint(); G.tick(); G.hint('再點要倒進去的桶子。'); return; }
        if(sel===i){ sel=-1; paint(); G.hint(''); return; }
        const m=Math.min(s[sel],cap-s[i]); if(m<=0){ G.buzz(); G.hint('那個桶子已經滿了。'); sel=-1; paint(); return; }
        s[sel]-=m; s[i]+=m; used++; sel=-1; G.tick(); paint(); show(); G.hint('');
        if(s.indexOf(R.target)>=0){ busy=true; G.ok(); r++; G.later(()=>{ if(r>=D.rounds.length)G.solve('每一題都量出來了！'); else { G.hint('量出來了，用了 '+used+' 次。下一題。'); start(); } },900); return; }
        if(used>=max){ busy=true; G.buzz(); G.shake(tank); G.hint('倒了 '+max+' 次還沒量出來。這一題最少只要 '+mins[r]+' 次，重新來過。'); G.later(start,2400); } });
      return {j:j,f:f,lab:lab,cap:cap}; });
    function paint(){ jugs.forEach((o,i)=>{ o.f.style.height=(100*s[i]/o.cap)+'%'; o.lab.textContent=s[i]+' '+D.unit; o.lab.style.color=s[i]===R.target?'var(--good)':'var(--amber)'; o.j.style.borderColor=sel===i?'var(--amber)':'var(--brass-lo)'; o.j.style.boxShadow=sel===i?'0 0 0 3px rgba(255,206,120,.25)':'none'; }); }
    paint(); show(); }
  start();
}}
