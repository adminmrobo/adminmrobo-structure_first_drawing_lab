/* 구조 먼저 보는 캐릭터 그리기 연구실 — 실험 패널 모음 (외부 라이브러리 없음) */
(function(){
'use strict';
var NS='http://www.w3.org/2000/svg';
var C={teal:'#0f8f84',orange:'#e8731a',navy:'#1e2f6e',blue:'#2458d6',green:'#13733a',red:'#c9302c',purple:'#6b4fb0',grid:'#e3e8ee',muted:'#5b6874',ink:'#16212b'};
var KFONT='"IBM Plex Sans KR","Malgun Gothic","Noto Sans KR",sans-serif';
var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var P={};

/* ---------- 공용 도구 ---------- */
function el(tag,a,parent){var e=document.createElementNS(NS,tag);for(var k in a){if(a[k]!=null)e.setAttribute(k,a[k]);}if(parent)parent.appendChild(e);return e;}
function ktxt(p,x,y,s,a){a=a||{};var t=el('text',{x:x,y:y,'font-size':a.size||13,fill:a.fill||C.muted,'font-family':KFONT,'text-anchor':a.anchor||'start','font-weight':a.weight||'normal'},p);t.textContent=s;return t;}
function svgOf(h,W,H,label){h.innerHTML='';return el('svg',{viewBox:'0 0 '+W+' '+H,role:'img','aria-label':'실험 그림: '+(label||noteOf(h))},h);}
function noteOf(h){var n=h.parentNode&&h.parentNode.querySelector('.ph small');return n?n.textContent:'';}
function canvasOf(h,W,H,mw){h.innerHTML='';var c=document.createElement('canvas');c.width=W;c.height=H;c.style.width='100%';c.style.maxWidth=(mw||W*1.2)+'px';c.style.margin='0 auto';c.style.height='auto';c.style.display='block';c.style.borderRadius='10px';c.setAttribute('role','img');c.setAttribute('aria-label','실험 그림: '+noteOf(h));h.appendChild(c);return c;}
function out(h){return h.parentNode.querySelector('.readout');}
function ctl(h){return h.parentNode.querySelector('.ctrl');}
function f2(v,d){d=d==null?2:d;var m=Math.pow(10,d);var s=(Math.round(v*m)/m).toFixed(d);s=s.replace(/\.?0+$/,'');if(s==='-0')s='0';return s;}
function num(v,d){return v<0?'−'+f2(-v,d):f2(v,d);}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function lerp(a,b,t){return a+(b-a)*t;}
function hex(c){c=c.replace('#','');return[parseInt(c.substr(0,2),16),parseInt(c.substr(2,2),16),parseInt(c.substr(4,2),16)];}
function rgb(a){return 'rgb('+a.map(function(v){return Math.round(clamp(v,0,255));}).join(',')+')';}
function mix(c1,c2,t){var a=hex(c1),b=hex(c2);return rgb([lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)]);}
function shade(c,k){var a=hex(c);return rgb([a[0]*k,a[1]*k,a[2]*k]);}
function rad(d){return d*Math.PI/180;}
function seg(h,sel,cb){var bs=ctl(h).querySelectorAll(sel);bs.forEach(function(b){b.addEventListener('click',function(){bs.forEach(function(x){x.classList.remove('on');});b.classList.add('on');cb(b);});});}
function rng(seed){var s=seed>>>0||1;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function onIn(inp,f){inp.addEventListener('input',f);}
function svgPt(s,e){var m=s.getScreenCTM().inverse();var q=s.createSVGPoint();q.x=e.clientX;q.y=e.clientY;return q.matrixTransform(m);}

/* ---------- 캐릭터 얼굴(가슴 위) 그리기 — 캔버스 ---------- */
var CH={
 haru:{hair:'#E9909A',hair2:'#D9707E',streak:'#1E2F5C',buns:true,ahoge:true,eye:'#3D8BE0',skin:'#F6D3B8',outfit:'hoodie',long:true},
 sia:{hair:'#1E1B22',hair2:'#4A4656',eye:'#7A7680',skin:'#F6D9C4',outfit:'maid',long:true,earring:true},
 moa:{hair:'#D8C09A',hair2:'#B89C74',eye:'#B07A3E',skin:'#F8DCC8',outfit:'cardigan',long:true,headband:true,ribbon:'L',wavy:true}
};
function cfg(name,over){var o={};var b=CH[name];for(var k in b)o[k]=b[k];for(var j in over)o[j]=over[j];return o;}
function drawBust(ctx,W,H,o){
  var cx=W/2,s=W/200;ctx.save();ctx.clearRect(0,0,W,H);ctx.fillStyle=o.bg||'#f4f6f9';ctx.fillRect(0,0,W,H);
  var ln=o.line||2.2*s;ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle=o.ink||'#2a2230';ctx.lineWidth=ln;
  function E(x,y,rx,ry,fill,stroke){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke!==false)ctx.stroke();}
  // 뒷머리
  if(o.long){ctx.fillStyle=o.hair;ctx.beginPath();ctx.moveTo(cx-48*s,78*s);ctx.quadraticCurveTo(cx-62*s,150*s,cx-52*s,200*s);ctx.lineTo(cx+52*s,200*s);ctx.quadraticCurveTo(cx+62*s,150*s,cx+48*s,78*s);ctx.closePath();ctx.fill();ctx.stroke();}
  else{ctx.fillStyle=o.hair;ctx.beginPath();ctx.moveTo(cx-46*s,80*s);ctx.quadraticCurveTo(cx-50*s,120*s,cx-36*s,128*s);ctx.lineTo(cx+36*s,128*s);ctx.quadraticCurveTo(cx+50*s,120*s,cx+46*s,80*s);ctx.closePath();ctx.fill();ctx.stroke();}
  // 몸·옷
  var body=o.outfit==='maid'?'#34363F':o.outfit==='cardigan'?'#D4B48A':o.outfit==='generic'?'#8a93a6':'#A99AC8';
  ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(cx-70*s,200*s);ctx.quadraticCurveTo(cx-66*s,150*s,cx-26*s,140*s);ctx.lineTo(cx+26*s,140*s);ctx.quadraticCurveTo(cx+66*s,150*s,cx+70*s,200*s);ctx.closePath();ctx.fill();ctx.stroke();
  if(o.outfit==='hoodie'&&o.coat!==false){ctx.fillStyle='#fbfbfd';ctx.beginPath();ctx.moveTo(cx-70*s,200*s);ctx.quadraticCurveTo(cx-66*s,150*s,cx-30*s,141*s);ctx.lineTo(cx-18*s,200*s);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(cx+70*s,200*s);ctx.quadraticCurveTo(cx+66*s,150*s,cx+30*s,141*s);ctx.lineTo(cx+18*s,200*s);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#ffffff';ctx.beginPath();ctx.moveTo(cx-8*s,150*s);ctx.lineTo(cx-10*s,175*s);ctx.moveTo(cx+8*s,150*s);ctx.lineTo(cx+10*s,175*s);ctx.stroke();ctx.strokeStyle=o.ink||'#2a2230';}
  if(o.outfit==='maid'){ctx.fillStyle='#fbfbfd';ctx.fillRect(cx-16*s,136*s,32*s,12*s);ctx.strokeRect(cx-16*s,136*s,32*s,12*s);ctx.fillStyle='#8C8C94';E(cx-12*s,154*s,12*s,8*s,'#8C8C94');E(cx+12*s,154*s,12*s,8*s,'#8C8C94');E(cx,154*s,5*s,5*s,'#77777f');
    ctx.fillStyle='#F4F2EE';ctx.beginPath();ctx.moveTo(cx-30*s,200*s);ctx.lineTo(cx-24*s,172*s);ctx.lineTo(cx+24*s,172*s);ctx.lineTo(cx+30*s,200*s);ctx.closePath();ctx.fill();ctx.stroke();}
  if(o.outfit==='cardigan'){ctx.fillStyle='#ffffff';ctx.beginPath();ctx.moveTo(cx-18*s,142*s);ctx.lineTo(cx,175*s);ctx.lineTo(cx+18*s,142*s);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#A8323C';ctx.beginPath();ctx.moveTo(cx,150*s);ctx.lineTo(cx-12*s,144*s);ctx.lineTo(cx-12*s,158*s);ctx.closePath();ctx.moveTo(cx,150*s);ctx.lineTo(cx+12*s,144*s);ctx.lineTo(cx+12*s,158*s);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#FAF8F4';ctx.beginPath();ctx.moveTo(cx-34*s,200*s);ctx.lineTo(cx-28*s,178*s);ctx.lineTo(cx+28*s,178*s);ctx.lineTo(cx+34*s,200*s);ctx.closePath();ctx.fill();ctx.stroke();}
  // 목·얼굴
  ctx.fillStyle=o.skin;ctx.fillRect(cx-11*s,118*s,22*s,24*s);ctx.beginPath();ctx.moveTo(cx-11*s,118*s);ctx.lineTo(cx-11*s,140*s);ctx.moveTo(cx+11*s,118*s);ctx.lineTo(cx+11*s,140*s);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-38*s,70*s);ctx.quadraticCurveTo(cx-40*s,112*s,cx,128*s);ctx.quadraticCurveTo(cx+40*s,112*s,cx+38*s,70*s);ctx.closePath();ctx.fillStyle=o.skin;ctx.fill();ctx.stroke();
  // 눈
  [-1,1].forEach(function(d){var ex=cx+d*17*s,ey=96*s;E(ex,ey,8.5*s,10.5*s,'#ffffff');E(ex,ey+1*s,6.5*s,8.5*s,o.eye,false);E(ex,ey+2*s,3.4*s,4.6*s,shade(o.eye,0.45),false);E(ex-2.4*s,ey-3*s,2.2*s,2.2*s,'#ffffff',false);
    ctx.beginPath();ctx.moveTo(ex-10*s,ey-10*s);ctx.quadraticCurveTo(ex,ey-14*s,ex+10*s,ey-9*s);ctx.lineWidth=ln*1.4;ctx.stroke();ctx.lineWidth=ln;});
  ctx.beginPath();ctx.moveTo(cx-5*s,116*s);ctx.quadraticCurveTo(cx,119*s,cx+5*s,116*s);ctx.stroke();
  if(o.blush!==false){ctx.fillStyle='rgba(240,120,130,.25)';E(cx-26*s,108*s,6*s,3*s,'rgba(240,120,130,.25)',false);E(cx+26*s,108*s,6*s,3*s,'rgba(240,120,130,.25)',false);}
  // 앞머리
  ctx.fillStyle=o.hair;ctx.beginPath();ctx.moveTo(cx-46*s,88*s);ctx.quadraticCurveTo(cx-50*s,34*s,cx,30*s);ctx.quadraticCurveTo(cx+50*s,34*s,cx+46*s,88*s);
  if(o.wavy){ctx.quadraticCurveTo(cx+30*s,76*s,cx+22*s,82*s);ctx.quadraticCurveTo(cx+10*s,72*s,cx,80*s);ctx.quadraticCurveTo(cx-10*s,72*s,cx-22*s,82*s);ctx.quadraticCurveTo(cx-30*s,76*s,cx-46*s,88*s);}
  else{ctx.lineTo(cx+36*s,74*s);ctx.lineTo(cx+24*s,84*s);ctx.lineTo(cx+12*s,72*s);ctx.lineTo(cx,84*s);ctx.lineTo(cx-12*s,72*s);ctx.lineTo(cx-24*s,84*s);ctx.lineTo(cx-36*s,74*s);}
  ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle=o.hair2;ctx.beginPath();ctx.moveTo(cx-30*s,44*s);ctx.quadraticCurveTo(cx-20*s,40*s,cx-10*s,46*s);ctx.stroke();ctx.strokeStyle=o.ink||'#2a2230';
  if(o.streak){ctx.fillStyle=o.streak;ctx.beginPath();ctx.moveTo(cx-6*s,31*s);ctx.lineTo(cx+6*s,31*s);ctx.lineTo(cx+5*s,80*s);ctx.lineTo(cx,84*s);ctx.lineTo(cx-5*s,80*s);ctx.closePath();ctx.fill();
    ctx.fillRect(cx-46*s+4*s,100*s,6*s,70*s);ctx.fillRect(cx+46*s-10*s,100*s,6*s,70*s);}
  if(o.buns){E(cx-30*s,30*s,15*s,14*s,o.hair);E(cx+30*s,30*s,15*s,14*s,o.hair);ctx.strokeStyle=o.hair2;ctx.beginPath();ctx.arc(cx-30*s,30*s,8*s,3.6,5.6);ctx.stroke();ctx.beginPath();ctx.arc(cx+30*s,30*s,8*s,3.6,5.6);ctx.stroke();ctx.strokeStyle=o.ink||'#2a2230';}
  if(o.ahoge){ctx.beginPath();ctx.moveTo(cx+2*s,30*s);ctx.quadraticCurveTo(cx+14*s,12*s,cx+4*s,8*s);ctx.lineWidth=ln*1.2;ctx.strokeStyle=o.hair2;ctx.stroke();ctx.lineWidth=ln;ctx.strokeStyle=o.ink||'#2a2230';}
  if(o.headband){ctx.fillStyle='#ffffff';ctx.beginPath();ctx.ellipse(cx,38*s,44*s,12*s,0,Math.PI*1.05,Math.PI*1.95);ctx.lineWidth=7*s;ctx.strokeStyle='#ffffff';ctx.stroke();ctx.lineWidth=ln;ctx.strokeStyle=o.ink||'#2a2230';
    for(var i=-3;i<=3;i++){E(cx+i*11*s,27*s+Math.abs(i)*2.2*s,4.5*s,4*s,'#ffffff');}}
  if(o.ribbon){var side=o.ribbon==='L'?1:-1;var rx=cx+side*44*s,ry=60*s;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-10*s,ry-7*s);ctx.lineTo(rx-10*s,ry+7*s);ctx.closePath();ctx.moveTo(rx,ry);ctx.lineTo(rx+10*s,ry-7*s);ctx.lineTo(rx+10*s,ry+7*s);ctx.closePath();ctx.fill();ctx.stroke();}
  if(o.earring){ctx.fillStyle='#c9ccd6';E(cx-39*s,108*s,2.5*s,4*s,'#c9ccd6');E(cx+39*s,108*s,2.5*s,4*s,'#c9ccd6');}
  ctx.restore();
}
function pixelate(src,dst,block){var W=dst.width,H=dst.height,ctx=dst.getContext('2d');if(block<=1){ctx.imageSmoothingEnabled=true;ctx.drawImage(src,0,0,W,H);return;}
  var t=document.createElement('canvas');t.width=Math.max(1,Math.round(W/block));t.height=Math.max(1,Math.round(H/block));var tc=t.getContext('2d');tc.imageSmoothingEnabled=true;tc.drawImage(src,0,0,t.width,t.height);
  ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,W,H);ctx.drawImage(t,0,0,W,H);ctx.imageSmoothingEnabled=true;}
function offBust(name,over,W){var c=document.createElement('canvas');c.width=W||200;c.height=W||200;drawBust(c.getContext('2d'),c.width,c.height,cfg(name,over||{}));return c;}

/* ---------- 3D 도형 마네킹 ---------- */
function limb(a,b,t,part){var dx=b[0]-a[0],dy=b[1]-a[1];return {c:[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2],s:[t,Math.hypot(dx,dy),t*0.95],rz:Math.atan2(dx,dy)*-1,part:part,ends:[a,b]};}
function mannequin(pose){pose=pose||'hip';
  var B=[];function box(c,s,part){B.push({c:c,s:s,rz:0,part:part});}
  box([0,7.45,0],[0.82,1.0,0.88],'head');box([0,6.78,0],[0.32,0.36,0.32],'neck');box([0,5.95,0],[1.6,1.45,1.0],'chest');box([0,4.62,0],[1.36,1.15,0.85],'pelvis');
  var L=[0.96,6.5,0],R=[-0.96,6.5,0];
  var le=[1.12,5.0,0],lh=[1.18,3.65,0.05];
  var re,rh;if(pose==='up'){re=[-1.15,8.0,0];rh=[-1.2,9.4,0];le=[1.15,8.0,0];lh=[1.2,9.4,0];}else{re=[-1.55,5.35,-0.1];rh=[-0.82,4.75,0.15];}
  B.push(limb(L,le,0.36,'uarm'));B.push(limb(le,lh,0.3,'farm'));B.push(limb(R,re,0.36,'uarm'));B.push(limb(re,rh,0.3,'farm'));
  [0.38,-0.38].forEach(function(x){var hp=[x,4.15,0],kn=[x*1.05,2.2,0.05],an=[x*1.08,0.35,0];B.push(limb(hp,kn,0.5,'thigh'));B.push(limb(kn,an,0.38,'shin'));box([x*1.08,0.14,0.18],[0.34,0.28,0.7],'foot');});
  B.joints={head:[0,7.45,0],neck:[0,6.6,0],ls:L,rs:R,le:le,lh:lh,re:re,rh:rh,lp:[0.38,4.15,0],rp:[-0.38,4.15,0],lk:[0.4,2.2,0.05],rk:[-0.4,2.2,0.05],la:[0.41,0.35,0],ra:[-0.41,0.35,0]};
  return B;}
var FACES=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[1,2,6,5],[0,3,7,4]];
function boxVerts(b){var w=b.s[0]/2,h=b.s[1]/2,d=b.s[2]/2,c=Math.cos(b.rz),s=Math.sin(b.rz);
  var L=[[-w,-h,-d],[w,-h,-d],[w,h,-d],[-w,h,-d],[-w,-h,d],[w,-h,d],[w,h,d],[-w,h,d]];
  return L.map(function(p){var x=p[0]*c-p[1]*s,y=p[0]*s+p[1]*c;return[x+b.c[0],y+b.c[1],p[2]+b.c[2]];});}
function rotY(p,a){var c=Math.cos(a),s=Math.sin(a);return[p[0]*c+p[2]*s,p[1],-p[0]*s+p[2]*c];}
function sub3(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function norm(a){var l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
var PARTCOL={head:'#E9909A',neck:'#F6D3B8',chest:'#A99AC8',pelvis:'#5b7fb8',uarm:'#fbfbfd',farm:'#fbfbfd',thigh:'#5b7fb8',shin:'#5b7fb8',foot:'#A99AC8'};
function renderMan(s,o){/* o: yaw, mode(shade|flat|edge|depth|blocks|sketch|line|color), W,H,scale,ox,oy, light */
  var B=mannequin(o.pose),yaw=rad(o.yaw||0),Lt=norm(o.light||[-0.55,0.65,0.55]);
  var sc=o.scale||40,ox=o.ox||o.W/2,oy=o.oy||o.H-20;var polys=[];var zmin=1e9,zmax=-1e9;
  B.forEach(function(b){var V=boxVerts(b).map(function(p){return rotY(p,yaw);});
    FACES.forEach(function(f){var a=V[f[0]],bb=V[f[1]],c=V[f[2]];var n=norm(cross(sub3(bb,a),sub3(c,a)));
      var cen=[0,0,0];f.forEach(function(i){cen[0]+=V[i][0]/4;cen[1]+=V[i][1]/4;cen[2]+=V[i][2]/4;});
      // 바깥쪽 법선으로 맞춤
      var bc=rotY(b.c,yaw);if(dot(n,sub3(cen,bc))<0)n=[-n[0],-n[1],-n[2]];
      if(n[2]<=0.001)return;zmin=Math.min(zmin,cen[2]);zmax=Math.max(zmax,cen[2]);
      polys.push({pts:f.map(function(i){return[ox+V[i][0]*sc,oy-V[i][1]*sc];}),z:cen[2],n:n,part:b.part});});});
  polys.sort(function(a,b){return a.z-b.z;});var g=el('g',{},s);var R=rng(7);
  polys.forEach(function(p){var d=p.pts.map(function(q){return q[0].toFixed(1)+','+q[1].toFixed(1);}).join(' ');
    var br=0.28+0.72*Math.max(0,dot(p.n,Lt));var m=o.mode;
    if(m==='shade')el('polygon',{points:d,fill:mix('#3b3f4a','#eef1f6',br),stroke:'#2a2e38','stroke-width':0.8},g);
    else if(m==='flat')el('polygon',{points:d,fill:o.flat||'#f2d9c6',stroke:o.flat||'#f2d9c6','stroke-width':0.6},g);
    else if(m==='blocks')el('polygon',{points:d,fill:'none',stroke:C.blue,'stroke-width':1.3},g);
    else if(m==='sketch'){var q=p.pts.map(function(v){return[v[0]+(R()-.5)*3,v[1]+(R()-.5)*3];});el('polygon',{points:q.map(function(v){return v[0].toFixed(1)+','+v[1].toFixed(1);}).join(' '),fill:'none',stroke:'#8a8f99','stroke-width':1,opacity:.85},g);}
    else if(m==='line')el('polygon',{points:d,fill:'#ffffff',stroke:'#1d1a22','stroke-width':1.4},g);
    else if(m==='color'){var A=hex(PARTCOL[p.part]||'#dddddd');el('polygon',{points:d,fill:rgb(A.map(function(v){return v*(0.6+0.4*br);})),stroke:'#1d1a22','stroke-width':1.2},g);}
    else if(m==='edge')el('polygon',{points:d,fill:'#000',stroke:'#fff','stroke-width':1.1},g);
    else if(m==='depth'){var t=(p.z-zmin)/Math.max(1e-6,zmax-zmin);var v=Math.round(70+t*185);el('polygon',{points:d,fill:'rgb('+v+','+v+','+v+')',stroke:'rgb('+v+','+v+','+v+')','stroke-width':0.6},g);}
  });
  var J={};for(var k in B.joints){var r=rotY(B.joints[k],yaw);J[k]=[ox+r[0]*sc,oy-r[1]*sc,r[2]];}
  return {g:g,J:J};}

/* ===================== 1부 ===================== */
P.p1_blocks=function(h){var mode=0,W=520,H=440;
  function draw(){var s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    if(mode!==1)renderMan(s,{W:W,H:H,yaw:25,mode:'flat',flat:mode===2?'#f6e2d3':'#f2d0b8',scale:42,oy:H-22});
    if(mode>0)renderMan(s,{W:W,H:H,yaw:25,mode:'blocks',scale:42,oy:H-22});
    ktxt(s,14,24,['윤곽만 — 굴곡이 많아 면의 방향이 안 보임','상자·원기둥만 — 면마다 방향이 보임','겹쳐 보기 — 몸 안에 도형 12개'][mode],{size:13.5,fill:C.navy});
    out(h).innerHTML=['윤곽만 보면 팔이 앞을 보는지 옆을 보는지 알기 어렵습니다.','도형 <b>12개</b>: 머리·목·가슴·골반 4 + 위팔·아래팔 4 + 허벅지·종아리 4 (발은 덤).','겹쳐 보면 윤곽 안에 도형이 숨어 있습니다. 이 도형이 밑그림입니다.'][mode];}
  seg(h,'button',function(b){mode=+b.dataset.m;draw();});draw();};

P.p1_rings=function(h){var inp=ctl(h).querySelector('input'),W=520,H=420;
  function draw(){var a=+inp.value,k=Math.sin(rad(a)),s=svgOf(h,W,H);var cx=200,w=120,top=70,bot=360;
    el('rect',{x:cx-w/2,y:top,width:w,height:bot-top,fill:'#eef2f8',stroke:'none'},s);
    el('line',{x1:cx-w/2,y1:top,x2:cx-w/2,y2:bot,stroke:C.navy,'stroke-width':2},s);el('line',{x1:cx+w/2,y1:top,x2:cx+w/2,y2:bot,stroke:C.navy,'stroke-width':2},s);
    for(var i=0;i<5;i++){var y=top+40+i*60,ry=Math.max(0.5,w/2*k);el('path',{d:'M'+(cx-w/2)+','+y+' A'+(w/2)+','+ry+' 0 0 0 '+(cx+w/2)+','+y,fill:'none',stroke:C.red,'stroke-width':2.2},s);
      el('path',{d:'M'+(cx-w/2)+','+y+' A'+(w/2)+','+ry+' 0 0 1 '+(cx+w/2)+','+y,fill:'none',stroke:C.red,'stroke-width':1.4,'stroke-dasharray':'5 4',opacity:.7},s);}
    el('ellipse',{cx:cx,cy:top,rx:w/2,ry:Math.max(0.5,w/2*k),fill:'#fff',stroke:C.navy,'stroke-width':2},s);
    // 눈과 시선
    var ex=420,ey=lerp(215,40,a/90);el('circle',{cx:ex,cy:ey,r:10,fill:'#fff',stroke:C.ink,'stroke-width':2},s);el('circle',{cx:ex-3,cy:ey,r:4,fill:C.ink},s);
    el('line',{x1:ex-12,y1:ey,x2:cx+w/2+6,y2:215,stroke:C.orange,'stroke-width':1.6,'stroke-dasharray':'6 4'},s);
    ktxt(s,ex-40,ey-18,'눈',{size:13});ktxt(s,300,400,'고리 세로 폭 ÷ 가로 폭 = sin '+a+'° = '+f2(k,3),{size:14,fill:C.navy,anchor:'middle'});
    out(h).innerHTML='내려다보는 각 <b>'+a+'°</b> → 세로 폭 = 가로 폭 × sin '+a+'° = <b>'+f2(k,3)+'</b>배. 지름 8cm 팔이라면 고리 세로 폭 <b>'+f2(8*k,2)+'cm</b>.'+(a===0?' 눈높이에서는 일자 선입니다.':a===90?' 바로 위에서는 동그라미입니다.':'');}
  onIn(inp,draw);draw();};

P.p1_turn=function(h){var c=ctl(h),inp=c.querySelector('input'),W=520,H=440;
  function draw(){var y=+inp.value,s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    el('ellipse',{cx:W/2,cy:H-20,rx:90,ry:12,fill:'#e4e8ee'},s);renderMan(s,{W:W,H:H,yaw:y,mode:'shade',scale:42,oy:H-22});
    el('circle',{cx:40,cy:40,r:14,fill:'#ffd34d',stroke:C.orange,'stroke-width':2},s);ktxt(s,60,45,'빛',{size:13});
    var a=rad(y),vis=Math.abs(1.6*Math.cos(a))+Math.abs(1.0*Math.sin(a));
    out(h).innerHTML='도는 각 <b>'+y+'°</b> · 가슴 상자의 보이는 폭 ≈ <b>'+f2(vis*20,1)+'</b> (앞 32 · 옆 20, 예시 단위). 빛 쪽 면은 밝고 등진 면은 어둡습니다.';}
  onIn(inp,draw);c.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){inp.value=b.dataset.v;draw();});});draw();};

P.p1_stripes=function(h){var c=ctl(h),inp=c.querySelector('input'),mode=1,W=520,H=380;
  function draw(){var n=+inp.value,s=svgOf(h,W,H);var cx=W/2,R=170,top=60,bot=300;
    el('rect',{x:cx-R,y:top,width:2*R,height:bot-top,fill:'#f4f6fa',stroke:C.navy,'stroke-width':2},s);
    var xs=[];for(var i=0;i<=n;i++){var t=i/n;xs.push(mode===0?cx-R+2*R*t:cx-R*Math.cos(Math.PI*t));}
    xs.forEach(function(x,i){if(i>0&&i<n)el('line',{x1:x,y1:top,x2:x,y2:bot,stroke:C.red,'stroke-width':2},s);});
    for(i=0;i<n;i++){if(i%2===0)el('rect',{x:xs[i],y:top,width:xs[i+1]-xs[i],height:bot-top,fill:C.red,opacity:.08},s);}
    el('ellipse',{cx:cx,cy:top,rx:R,ry:26,fill:'#fff',stroke:C.navy,'stroke-width':2},s);
    var half=[];for(i=0;i<n/2;i++){half.push(f2(Math.sin(Math.PI/n*(i+1))-Math.sin(Math.PI/n*i),3));}
    ktxt(s,cx,340,mode===0?'같은 간격 — 판자처럼 납작해 보임':'원근 간격 — 가운데 넓고 가장자리 좁음',{size:14,fill:C.navy,anchor:'middle'});
    out(h).innerHTML=(mode===1?'원근 간격: 가운데에서 가장자리로 폭 = <b>'+half.join(' → ')+'</b> (반지름 1, 반쪽 기준). 가장자리는 가운데의 <b>'+f2(half[half.length-1]/half[0],2)+'</b>배.':'같은 간격: 모든 폭이 같아 둥근 느낌이 없습니다.')+' 한 줄 각도 = '+f2(180/n,1)+'°.';}
  onIn(inp,draw);seg(h,'button',function(b){mode=+b.dataset.m;draw();});draw();};

P.p1_layers=function(h){var on=[1,1,0,0],W=520,H=440;var bs=ctl(h).querySelectorAll('button');
  function draw(){var s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fffdf8'},s);var o={W:W,H:H,yaw:25,scale:42,oy:H-22};
    if(on[3]){o.mode='color';renderMan(s,o);}else if(on[2]){o.mode='line';renderMan(s,o);}
    if(on[1]){o.mode='sketch';renderMan(s,o);}if(on[0]){o.mode='blocks';var r=renderMan(s,o);r.g.setAttribute('opacity',on[2]||on[3]?0.55:1);}
    var names=['도형','스케치','선화','색'];out(h).innerHTML='켜진 레이어: <b>'+(names.filter(function(_,i){return on[i];}).join(' + ')||'없음')+'</b>. 완성(③④) 아래에도 ①도형이 숨어 있습니다. 비례가 틀리면 ①만 고칩니다.';}
  bs.forEach(function(b){b.addEventListener('click',function(){var i=+b.dataset.l;on[i]=on[i]?0:1;b.classList.toggle('on',!!on[i]);draw();});});draw();};

/* ===================== 2부 ===================== */
P.p2_lambert=function(h){var inp=ctl(h).querySelector('input'),W=440,H=360,R=130,cx=200,cy=180,pick=null;var cv=canvasOf(h,W,H),ctx=cv.getContext('2d');
  function L(){var a=rad(+inp.value);return norm([Math.cos(a),Math.sin(a),0.55]);}
  function draw(){var l=L(),img=ctx.createImageData(W,H),d=img.data;
    for(var y=0;y<H;y++)for(var x=0;x<W;x++){var i=(y*W+x)*4;var nx=(x-cx)/R,ny=(cy-y)/R,r2=nx*nx+ny*ny;var v;
      if(r2<=1){var nz=Math.sqrt(1-r2);var b=Math.max(0,nx*l[0]+ny*l[1]+nz*l[2]);v=[40+200*b,46+196*b,62+186*b];}else{v=[247,248,251];}
      d[i]=v[0];d[i+1]=v[1];d[i+2]=v[2];d[i+3]=255;}
    ctx.putImageData(img,0,0);
    // 경계선(90°)
    ctx.strokeStyle=C.red;ctx.setLineDash([6,4]);ctx.lineWidth=2;ctx.beginPath();var first=true;
    for(var t=0;t<=Math.PI*2+0.01;t+=0.02){var u=norm(cross(l,[0,0,1]));var w=cross(l,u);var p=[u[0]*Math.cos(t)+w[0]*Math.sin(t),u[1]*Math.cos(t)+w[1]*Math.sin(t),u[2]*Math.cos(t)+w[2]*Math.sin(t)];if(p[2]<0){first=true;continue;}
      var X=cx+p[0]*R,Y=cy-p[1]*R;if(first){ctx.moveTo(X,Y);first=false;}else ctx.lineTo(X,Y);}ctx.stroke();ctx.setLineDash([]);
    var a=rad(+inp.value),lx=cx+Math.cos(a)*(R+50),ly=cy-Math.sin(a)*(R+50);ctx.fillStyle='#ffd34d';ctx.beginPath();ctx.arc(lx,ly,14,0,7);ctx.fill();ctx.strokeStyle=C.orange;ctx.stroke();
    ctx.strokeStyle=C.orange;ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(cx+Math.cos(a)*(R+18),cy-Math.sin(a)*(R+18));ctx.stroke();
    var msg='광원 <b>'+inp.value+'°</b> · 빨간 점선이 cos θ = 0(90°)인 그림자 경계입니다.';
    if(pick){var nx=(pick[0]-cx)/R,ny=(cy-pick[1])/R,r2=nx*nx+ny*ny;if(r2<=1){var nz=Math.sqrt(1-r2),c=nx*l[0]+ny*l[1]+nz*l[2];var th=Math.acos(clamp(c,-1,1))*180/Math.PI;
      ctx.fillStyle=C.teal;ctx.beginPath();ctx.arc(pick[0],pick[1],6,0,7);ctx.fill();msg+=' 고른 점: θ = <b>'+f2(th,0)+'°</b>, cos θ = '+num(c,2)+' → 밝기 <b>'+f2(Math.max(0,c)*100,0)+'%</b>'+(c<=0?' (그림자)':'');}}
    out(h).innerHTML=msg;}
  cv.addEventListener('pointerdown',function(e){var r=cv.getBoundingClientRect();pick=[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height];draw();});onIn(inp,draw);draw();};

P.p2_cast=function(h){var W=560,H=360,Lp=[120,60],plate=1,drag=false;
  function proj(p){var t=(300-Lp[1])/(p[1]-Lp[1]);return Lp[0]+(p[0]-Lp[0])*t;}
  function draw(){var s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:300,fill:'#fbfcfd'},s);el('rect',{x:0,y:300,width:W,height:60,fill:'#eceff4'},s);
    var x0=300,x1=360,top=170;// 원기둥 단면
    var right=Lp[0]<x0+30;// 광원이 왼쪽이면 오른쪽 면이 그림자
    var sx1=proj([x1,top]),sx0=proj([x0,top]);var fx=right?x1:x0;
    if(Lp[1]<top){var poly=right?[[x1,300],[x1,top],[sx1,300]]:[[x0,300],[x0,top],[sx0,300]];el('polygon',{points:poly.map(function(q){return q.join(',');}).join(' '),fill:C.purple,opacity:.32},s);}
    // 원기둥 몸
    var g=el('linearGradient',{id:'cyl',x1:right?0:1,x2:right?1:0,y1:0,y2:0},el('defs',{},s));el('stop',{offset:'0','stop-color':'#f2f3f7'},g);el('stop',{offset:'0.55','stop-color':'#d9dce6'},g);el('stop',{offset:'0.56','stop-color':'#8d91a3'},g);el('stop',{offset:'1','stop-color':'#7a7e90'},g);
    el('rect',{x:x0,y:top,width:x1-x0,height:300-top,fill:'url(#cyl)',stroke:C.ink,'stroke-width':1.5},s);
    var msg='원기둥의 '+(right?'오른쪽':'왼쪽')+' 어두운 면 = <b>입체 그림자</b>(빛을 등진 면). 보라색 = <b>떨어지는 그림자</b>.';
    if(plate){var pa=[230,150],pb=[300,150];el('line',{x1:pa[0],y1:pa[1],x2:pb[0],y2:pb[1],stroke:C.navy,'stroke-width':6,'stroke-linecap':'round'},s);
      if(Lp[1]<150){var qa=proj(pa),qb=proj(pb);el('rect',{x:Math.min(qa,qb),y:300,width:Math.abs(qb-qa),height:8,fill:C.purple,opacity:.6},s);
        // 판이 원기둥 빛 쪽 면에 드리우는 그림자
        var face=right?x0:x1;function yAt(p){return Lp[1]+(p[1]-Lp[1])*(face-Lp[0])/(p[0]-Lp[0]);}
        if(Math.abs(face-Lp[0])>1){var ya=yAt(pa),yb=yAt(pb);var y0=clamp(Math.min(ya,yb),top,300),y1=clamp(Math.max(ya,yb),top,300);var inRange=(pa[0]-Lp[0])*(face-pa[0])>0||(pb[0]-Lp[0])*(face-pb[0])>0;
          if(y1>y0&&inRange){el('rect',{x:face-(right?0:6),y:y0,width:6,height:y1-y0,fill:C.purple,opacity:.85},s);msg+=' 판 그림자가 원기둥 위에도 떨어졌습니다.';}}}
      ktxt(s,230,138,'가리는 판',{size:12.5});}
    var lg=el('g',{class:'drag'},s);el('circle',{cx:Lp[0],cy:Lp[1],r:18,fill:'#ffd34d',opacity:.4},lg);el('circle',{cx:Lp[0],cy:Lp[1],r:11,fill:'#ffd34d',stroke:C.orange,'stroke-width':2},lg);ktxt(s,Lp[0]+16,Lp[1]-14,'광원(끌기)',{size:12.5});
    lg.addEventListener('pointerdown',function(e){drag=true;lg.setPointerCapture&&lg.setPointerCapture(e.pointerId);});
    lg.addEventListener('pointermove',function(e){if(!drag)return;var q=svgPt(s,e);Lp=[clamp(q.x,20,W-20),clamp(q.y,20,100)];draw();});
    lg.addEventListener('pointerup',function(){drag=false;});
    out(h).innerHTML=msg+(plate?'':' 판을 끄면 판의 떨어지는 그림자만 사라지고 입체 그림자는 남습니다.');}
  seg(h,'button',function(b){plate=+b.dataset.o;draw();});
  h.addEventListener('pointerup',function(){drag=false;});draw();};

P.p2_island=function(h){var ins=ctl(h).querySelectorAll('input'),W=560,H=340;
  function draw(){var dep=+ins[0].value,el_=+ins[1].value,s=svgOf(h,W,H);var L=[-Math.cos(rad(el_)),Math.sin(rad(el_))];
    var N=300,x0=30,x1=W-30,base=130;var ys=[];for(var i=0;i<=N;i++){var x=x0+(x1-x0)*i/N;var t=i/N*8*Math.PI;var y=base-dep*Math.max(0,Math.sin(t))+dep*0.25*Math.sin(t*2);ys.push([x,y]);}
    var state=[];for(i=0;i<=N;i++){var p=ys[i],q=ys[Math.min(N,i+1)],o=ys[Math.max(0,i-1)];var tx=q[0]-o[0],ty=q[1]-o[1];var n=norm([ty,-tx,0]);if(n[1]>0)n=[-n[0],-n[1],0];
      var lit=(n[0]*L[0]+(-n[1])*L[1])>0;var st=lit?0:1;
      if(lit){for(var j=i-1;j>=0;j--){var dx=p[0]-ys[j][0];var ray=p[1]-dx*Math.tan(rad(el_));if(ys[j][1]<ray-0.5){st=2;break;}if(dx>300)break;}}
      state.push(st);}
    el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    var d='M'+x0+','+(base+60);ys.forEach(function(p){d+=' L'+p[0].toFixed(1)+','+p[1].toFixed(1);});d+=' L'+x1+','+(base+60)+' Z';el('path',{d:d,fill:'#e7eaf2',stroke:C.ink,'stroke-width':1.6},s);
    var islands=0,prev=0;for(i=0;i<N;i++){var st2=state[i];if(st2){el('line',{x1:ys[i][0],y1:ys[i][1],x2:ys[i+1][0],y2:ys[i+1][1],stroke:st2===1?C.red:C.purple,'stroke-width':4},s);}if(st2&&!prev)islands++;prev=st2;}
    var lx=x0+40,ly=36;el('circle',{cx:lx,cy:ly,r:12,fill:'#ffd34d',stroke:C.orange,'stroke-width':2},s);el('line',{x1:lx+14,y1:ly+6,x2:lx+14+70*Math.cos(rad(el_)),y2:ly+6+70*Math.sin(rad(el_)),stroke:C.orange,'stroke-width':2,'stroke-dasharray':'5 4'},s);
    ktxt(s,x0,base+76,'단면(옆에서 본 주름)',{size:12.5});
    // 위에서 본 띠
    var yb=base+112;ktxt(s,x0,yb-6,'위에서 본 모습 — 선 없이 그림자 섬만',{size:12.5});el('rect',{x:x0,y:yb,width:x1-x0,height:60,fill:'#f2f2f6',stroke:C.rule||'#d5dbe2'},s);
    for(i=0;i<N;i++){if(state[i])el('rect',{x:ys[i][0],y:yb+6,width:(x1-x0)/N+0.6,height:48,fill:state[i]===1?'#9aa0b8':'#7d7a9c',opacity:.9},s);}
    out(h).innerHTML='주름 깊이 <b>'+dep+'</b> · 광원 높이 <b>'+el_+'°</b> → 그림자 섬 <b>'+islands+'</b>개. <span style="color:'+C.red+'">빨강</span> = 빛을 등진 면(입체 그림자), <span style="color:'+C.purple+'">보라</span> = 앞 주름이 가린 곳(떨어지는 그림자).';}
  ins.forEach(function(i){onIn(i,draw);});draw();};

P.p2_soft=function(h){var ins=ctl(h).querySelectorAll('input'),W=560,H=360;
  function draw(){var hh=+ins[0].value,D=+ins[1].value,fl=+ins[2].value/100,s=svgOf(h,W,H);var pen=D*hh/200;var px=3.2;// cm→px
    el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);el('rect',{x:0,y:300,width:W,height:60,fill:mix('#5b6170','#f3f4f8',fl)},s);
    var cx=280,r=34,cy=300-r-hh*1.6;
    var defs=el('defs',{},s);var f=el('filter',{id:'blur',x:'-50%',y:'-200%',width:'200%',height:'500%'},defs);el('feGaussianBlur',{stdDeviation:Math.max(0.01,pen*px/2.2)},f);
    var op=clamp(0.75-hh/160,0.18,0.75);el('ellipse',{cx:cx,cy:302,rx:r*1.05+pen*px*0.3,ry:7+pen*0.6,fill:'#1d2030',opacity:op,filter:'url(#blur)'},s);
    var rg=el('radialGradient',{id:'ball',cx:'0.35',cy:'0.3',r:'0.85'},defs);el('stop',{offset:'0','stop-color':'#ffffff'},rg);el('stop',{offset:'0.55','stop-color':'#b9bdcc'},rg);el('stop',{offset:'0.92','stop-color':mix('#3e4254','#9aa0b4',fl)},rg);el('stop',{offset:'1','stop-color':mix('#3e4254','#c9cddb',fl)},rg);
    el('circle',{cx:cx,cy:cy,r:r,fill:'url(#ball)',stroke:C.ink,'stroke-width':1.4},s);
    el('circle',{cx:cx-120,cy:30,r:Math.max(4,D/2.5),fill:'#ffd34d',stroke:C.orange,'stroke-width':2},s);ktxt(s,cx-120,30-Math.max(4,D/2.5)-8,'광원 지름 '+D+'cm',{size:12.5,anchor:'middle'});
    el('line',{x1:cx+r+20,y1:cy,x2:cx+r+20,y2:300,stroke:C.teal,'stroke-width':1.5,'stroke-dasharray':'4 3'},s);ktxt(s,cx+r+26,(cy+300)/2,'높이 '+hh+'cm',{size:12.5,fill:C.teal});
    out(h).innerHTML='흐린 폭 = '+D+' × '+hh+' ÷ 200 = <b>'+f2(pen,2)+'cm</b>'+(hh===0?' — 닿은 곳은 가장 진하고 또렷합니다.':'')+' · 바닥 밝기 '+Math.round(fl*100)+'% → 공 아래쪽 반사광 '+(fl>0.6?'많음':fl>0.3?'조금':'거의 없음')+'.';}
  ins.forEach(function(i){onIn(i,draw);});draw();};

P.p2_passes=function(h){var c=ctl(h),chk=c.querySelectorAll('input[type=checkbox]'),sl=c.querySelector('input[type=range]'),W=320,H=200;var cv=canvasOf(h,W,H),ctx=cv.getContext('2d');
  var S=[160,110,0],R=48,L=norm([-0.6,0.75,0.45]);
  function on(k){return [].some.call(chk,function(x){return x.dataset.p===k&&x.checked;});}
  function draw(){var img=ctx.createImageData(W,H),d=img.data,sh=+sl.value/100;
    for(var y=0;y<H;y++)for(var x=0;x<W;x++){var i=(y*W+x)*4,col,base,lit=1,shadow=1,ao=1;
      var dx=(x-S[0])/R,dy=(S[1]-y)/R,r2=dx*dx+dy*dy;
      if(r2<=1){var nz=Math.sqrt(1-r2);base=[214,120,140];lit=0.25+0.75*Math.max(0,dx*L[0]+dy*L[1]+nz*L[2]);ao=1-0.45*Math.max(0,-dy-0.55);}
      else if(y>150){base=[226,229,236];var ex_=(x-(S[0]+46))/62,ey_=(y-166)/13;shadow=(ex_*ex_+ey_*ey_)<1?0:1;var cx_=(x-S[0])/44,cy_=(y-160)/9;ao=1-0.55*Math.max(0,1-Math.sqrt(cx_*cx_+cy_*cy_));lit=0.88;}
      else{base=[246,247,250];lit=1;}
      col=on('base')?base.slice():[200,200,200];if(on('light'))col=col.map(function(v){return v*lit;});
      if(on('shadow')&&shadow<1)col=col.map(function(v){return v*(1-0.6*sh);});if(on('ao'))col=col.map(function(v){return v*ao;});
      d[i]=col[0];d[i+1]=col[1];d[i+2]=col[2];d[i+3]=255;}
    ctx.putImageData(img,0,0);
    var names={base:'기본 색',light:'직접광',shadow:'떨어지는 그림자',ao:'주변 가림'},list=[];chk.forEach(function(x){if(x.checked)list.push(names[x.dataset.p]);});
    out(h).innerHTML='합친 층: <b>'+(list.join(' + ')||'없음')+'</b> · 그림자 세기 '+sl.value+'%'+(!on('shadow')||+sl.value===0?' — 그림자가 없으면 공이 바닥에서 떠 보입니다.':'')+(on('ao')?' 주변 가림이 공과 바닥이 닿은 곳을 단단하게 합니다.':'');}
  chk.forEach(function(x){x.addEventListener('change',draw);});onIn(sl,draw);draw();};

/* ===================== 3부: 천 시뮬레이션 ===================== */
function Cloth(nx,ny,sp){this.nx=nx;this.ny=ny;this.sp=sp;this.p=[];this.o=[];this.pin={};var r=rng(3);
  for(var j=0;j<ny;j++)for(var i=0;i<nx;i++){var v=[(i-(nx-1)/2)*sp,-j*sp,(r()-.5)*0.6];this.p.push(v.slice());this.o.push(v.slice());}}
Cloth.prototype.idx=function(i,j){return j*this.nx+i;};
Cloth.prototype.step=function(g,stiff,wind){var n=this.p.length,k,p,o;for(k=0;k<n;k++){if(this.pin[k])continue;p=this.p[k];o=this.o[k];var vx=(p[0]-o[0])*0.985,vy=(p[1]-o[1])*0.985,vz=(p[2]-o[2])*0.985;o[0]=p[0];o[1]=p[1];o[2]=p[2];p[0]+=vx+(wind||0);p[1]+=vy-g;p[2]+=vz;}
  var nx=this.nx,ny=this.ny,sp=this.sp,self=this;
  function sat(a,b,rest,w){var A=self.p[a],B=self.p[b];var dx=B[0]-A[0],dy=B[1]-A[1],dz=B[2]-A[2];var d=Math.sqrt(dx*dx+dy*dy+dz*dz)||1e-6;var df=(d-rest)/d*0.5*w;var pa=self.pin[a]?0:1,pb=self.pin[b]?0:1;if(!pa&&!pb)return;var s2=pa&&pb?1:2;
    if(pa){A[0]+=dx*df*s2;A[1]+=dy*df*s2;A[2]+=dz*df*s2;}if(pb){B[0]-=dx*df*s2;B[1]-=dy*df*s2;B[2]-=dz*df*s2;}}
  for(var it=0;it<6;it++){for(var j=0;j<ny;j++)for(var i=0;i<nx;i++){var a=this.idx(i,j);if(i<nx-1)sat(a,a+1,sp,1);if(j<ny-1)sat(a,a+nx,sp,1);if(i<nx-1&&j<ny-1){sat(a,a+nx+1,sp*1.41421,0.9);sat(a+1,a+nx,sp*1.41421,0.9);}
      if(stiff>0){if(i<nx-2)sat(a,a+2,2*sp,stiff);if(j<ny-2)sat(a,a+2*nx,2*sp,stiff);}}
    for(var key in this.pin){var q=this.pin[key];this.p[key][0]=q[0];this.p[key][1]=q[1];this.p[key][2]=q[2];}}};
Cloth.prototype.draw=function(ctx,W,H,sc,ox,oy){ctx.fillStyle='#fbfcfd';ctx.fillRect(0,0,W,H);var L=norm([-0.5,0.55,0.7]);var nx=this.nx,ny=this.ny,quads=[];
  for(var j=0;j<ny-1;j++)for(var i=0;i<nx-1;i++){var a=this.p[this.idx(i,j)],b=this.p[this.idx(i+1,j)],c=this.p[this.idx(i+1,j+1)],d=this.p[this.idx(i,j+1)];var n=norm(cross(sub3(b,a),sub3(d,a)));if(n[2]<0)n=[-n[0],-n[1],-n[2]];quads.push({q:[a,b,c,d],z:(a[2]+b[2]+c[2]+d[2])/4,n:n});}
  quads.sort(function(a,b){return a.z-b.z;});quads.forEach(function(Q){var br=0.25+0.75*Math.max(0,dot(Q.n,L));ctx.fillStyle=mix('#4a5470','#eef0f8',br);ctx.beginPath();Q.q.forEach(function(v,k){var X=ox+v[0]*sc,Y=oy-v[1]*sc;if(k)ctx.lineTo(X,Y);else ctx.moveTo(X,Y);});ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(40,46,60,.18)';ctx.lineWidth=0.6;ctx.stroke();});
  for(var key in this.pin){var v=this.p[key];ctx.fillStyle='#8c8f9a';ctx.beginPath();ctx.arc(ox+v[0]*sc,oy-v[1]*sc,7,0,7);ctx.fill();ctx.strokeStyle='#2a2e38';ctx.lineWidth=1.5;ctx.stroke();}};
Cloth.prototype.folds=function(){var j=Math.floor(this.ny*0.6),c=0,prev=0;for(var i=1;i<this.nx-1;i++){var dz=this.p[this.idx(i+1,j)][2]-this.p[this.idx(i-1,j)][2];var sgn=dz>0.15?1:dz<-0.15?-1:0;if(sgn&&prev&&sgn!==prev)c++;if(sgn)prev=sgn;}return c;};
Cloth.prototype.sag=function(){var j=0,mid=this.p[this.idx(Math.floor(this.nx/2),0)];var top=Math.max.apply(null,Object.keys(this.pin).map(function(k){return this.p[k][1];},this));return top-mid[1];};
function runCloth(h,setup,opts){var W=520,H=400;var cv=canvasOf(h,W,H),ctx=cv.getContext('2d');var cl,raf=null,frames=0,grab=null;
  function reset(){cl=new Cloth(19,15,1);setup(cl);frames=0;loop();}
  function tick(){var o=opts();for(var k=0;k<2;k++)cl.step(o.g,o.stiff,o.wind||0);if(grab)cl.pin[grab.k]=grab.pos;}
  function render(){cl.draw(ctx,W,H,18,W/2,60);var o=opts();if(o.report)o.report(cl);}
  function loop(){if(raf)cancelAnimationFrame(raf);if(RM){for(var i=0;i<220;i++)tick();render();return;}
    (function f(){tick();frames++;render();if(frames<260||grab)raf=requestAnimationFrame(f);else raf=null;})();}
  function pos(e){var r=cv.getBoundingClientRect();return[((e.clientX-r.left)*W/r.width-W/2)/18,-((e.clientY-r.top)*H/r.height-60)/18];}
  cv.addEventListener('pointerdown',function(e){var q=pos(e),best=-1,bd=4;cl.p.forEach(function(v,k){var d=Math.hypot(v[0]-q[0],v[1]-q[1]);if(d<bd&&!cl.pin[k]){bd=d;best=k;}});if(best>=0){grab={k:best,pos:[q[0],q[1],cl.p[best][2]]};cv.setPointerCapture&&cv.setPointerCapture(e.pointerId);loop();}});
  cv.addEventListener('pointermove',function(e){if(!grab)return;var q=pos(e);grab.pos=[q[0],q[1],grab.pos[2]];});
  cv.addEventListener('pointerup',function(){if(grab){delete cl.pin[grab.k];grab=null;frames=0;loop();}});
  reset();return {reset:reset,get:function(){return cl;}};}
function pinMode(cl,m){var nx=cl.nx,sp=cl.sp,i;cl.pin={};function pin(i,j,pos){var k=cl.idx(i,j);cl.pin[k]=pos||cl.p[k].slice();cl.p[k]=cl.pin[k].slice();cl.o[k]=cl.pin[k].slice();}
  if(m===1)pin(Math.floor(nx/2),0);
  if(m===2){pin(0,0,[-(nx-1)/2*sp*0.7,0,0]);pin(nx-1,0,[(nx-1)/2*sp*0.7,0,0]);}
  if(m===3){pin(0,0,[-(nx-1)/2*sp*0.7,0,0]);pin(nx-1,0,[(nx-1)/2*sp*0.7,-6,0]);}
  if(m===4){for(i=0;i<nx;i++){pin(i,0,[(i-(nx-1)/2)*sp*0.42,0,(i%2?0.35:-0.35)]);}}}
P.p3_cloth_pins=function(h){var mode=2;var names={1:'한 점',2:'두 점(같은 높이)',3:'두 점(높이 다름)',4:'양쪽에서 모으기'};
  var sim=runCloth(h,function(cl){pinMode(cl,mode);},function(){return {g:0.012,stiff:0.15,report:function(cl){var f=cl.folds();
    out(h).innerHTML='<b>'+names[mode]+'</b> · '+(mode===1?'접점 하나에서 아래로 부채꼴 — <b>처짐 주름</b>':mode===2?'두 접점 사이로 <b>당김 주름</b> + 가운데 처짐(U자)':mode===3?'높은 쪽으로 기울어진 <b>당김 주름</b>':'촘촘한 세로 <b>모임 주름</b>')+' · 가운데 아래쪽 줄의 주름 굴곡 약 <b>'+f+'</b>개.';}};});
  seg(h,'button',function(b){mode=+b.dataset.pin;sim.reset();});};
P.p3_cloth_mat=function(h){var c=ctl(h),ins=c.querySelectorAll('input');
  var sim=runCloth(h,function(cl){pinMode(cl,2);},function(){var st=+ins[0].value/100,wt=+ins[1].value/100;return {g:0.004+0.016*wt,stiff:0.02+0.9*st,report:function(cl){
    out(h).innerHTML='뻣뻣함 <b>'+ins[0].value+'</b> · 무게 <b>'+ins[1].value+'</b> → 가운데 처짐 <b>'+f2(cl.sag(),1)+'</b>(격자 단위), 주름 굴곡 약 <b>'+cl.folds()+'</b>개. '+(st>0.6?'굵고 각진 주름(빳빳한 천)':st<0.25?'잘고 둥근 주름(부드러운 천)':'중간 천')+'.';}};});
  ins.forEach(function(i){i.addEventListener('change',function(){sim.reset();});});c.querySelector('[data-reset]').addEventListener('click',function(){sim.reset();});};

P.p3_spots=function(h){var W=520,H=460;var found={};var SP=[
  ['ls','어깨','천이 걸리는 접점 → 아래로 처짐 주름이 시작',0,-8],['re','팔꿈치 안쪽(굽힌 팔)','안쪽에 천이 남아 모임 주름',-10,0],['ls','겨드랑이','팔과 몸통 사이 — 당김 + 모임 주름',-30,22],
  ['rp','허리·골반','허리띠·앞치마 끈에서 모임 주름',20,-6],['lk','무릎','굽힐수록 위아래로 당김 주름, 뒤쪽에 모임 주름',0,0],['la','밑단·소맷부리','처진 천이 끝에서 고임 주름',0,-12]];
  function draw(){var s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);var r=renderMan(s,{W:W,H:H,yaw:20,mode:'shade',scale:44,oy:H-20});
    SP.forEach(function(p,i){var J=r.J[p[0]];var x=J[0]+p[3],y=J[1]+p[4];var g=el('g',{class:'hotspot',tabindex:0,role:'button','aria-label':p[1]},s);
      el('circle',{cx:x,cy:y,r:15,fill:found[i]?C.teal:C.orange,opacity:found[i]?.85:.35,stroke:found[i]?C.teal:C.orange,'stroke-width':2},g);ktxt(g,x,y+5,found[i]?'✓':String(i+1),{size:13,fill:'#fff',anchor:'middle',weight:700});
      function hit(){found[i]=1;draw();var n=Object.keys(found).length;out(h).innerHTML='<b>'+p[1]+'</b> — '+p[2]+' · 찾은 자리 <b>'+n+' / 6</b>'+(n===6?' <span class="alert">모두 찾았습니다! 나머지 자리는 매끈하게 두어도 자연스럽습니다.</span>':'');}
      g.addEventListener('click',hit);g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();hit();}});});}
  out(h).innerHTML='주황 동그라미를 눌러 보세요. 찾은 자리 <b>0 / 6</b>';draw();};

P.p3_flow=function(h){var ins=ctl(h).querySelectorAll('input'),W=560,H=300;
  function draw(){var fl=+ins[0].value/100,te=+ins[1].value/100,s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    function wave(y0,amp,n,x0,x1,col,wd){var d='M'+x0+','+y0;var seg=(x1-x0)/n;for(var i=0;i<n;i++){var xa=x0+i*seg,xb=xa+seg,up=i%2===0;var yb=y0+(up?-amp:amp)*(0.6+0.4*Math.sin(i*1.7));
        var k=seg*0.5*(1-te)*(0.3+0.7*fl);var tilt=(1-fl)*amp*0.8*(up?1:-1);d+=' C'+(xa+k)+','+(y0+tilt*0.2+(i?(i%2?amp:-amp)*0.1:0))+' '+(xb-k)+','+(yb+tilt*0.3)+' '+xb+','+yb;y0=yb;}
      el('path',{d:d,fill:'none',stroke:col,'stroke-width':wd,'stroke-linejoin':te>0.6?'miter':'round'},s);}
    wave(100,40,7,40,W-40,C.ink,3);wave(210,28,9,40,W-40,'#5b6874',2);
    var kind=fl>0.6&&te<0.4?'부드럽고 얇은 천(니트·실크)':fl<0.4&&te>0.6?'빳빳한 천(셔츠·종이)':fl<0.4&&te<0.4?'늘어진 무거운 천':fl>0.6&&te>0.6?'탄력 있는 천(데님 등)':'중간 천';
    out(h).innerHTML='흐름 <b>'+ins[0].value+'</b> · 꺾임 <b>'+ins[1].value+'</b> → <b>'+kind+'</b>. 같은 개수의 주름이라도 선 모양만으로 소재가 달라 보입니다.';}
  ins.forEach(function(i){onIn(i,draw);});draw();};

P.p3_bend=function(h){var ins=ctl(h).querySelectorAll('input'),W=560,H=380;
  function draw(){var a=+ins[0].value,r=+ins[1].value,s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    var th=rad(a),ex=300,ey=250,Lu=170,Lf=160,w=r*6;var ux=-1,uy=0;// 위팔은 왼쪽으로 수평
    var fdx=Math.cos(th),fdy=-Math.sin(th);// 아래팔 방향(위로 굽힘)
    var sx=ex+ux*Lu,sy=ey,hx=ex+fdx*Lf,hy=ey+fdy*Lf;
    function off(x,y,dx,dy,k){return[x-dy*k,y+dx*k];}
    var u1=off(sx,sy,1,0,w),u2=off(ex,ey,1,0,w),u3=off(sx,sy,1,0,-w),u4=off(ex,ey,1,0,-w);
    var f1=off(ex,ey,fdx,fdy,w),f2_=off(hx,hy,fdx,fdy,w),f3=off(ex,ey,fdx,fdy,-w),f4=off(hx,hy,fdx,fdy,-w);
    el('path',{d:'M'+u1+' L'+u2+' A'+w+','+w+' 0 0 0 '+f1+' L'+f2_+' L'+f4+' L'+f3+' L'+u4+' L'+u3+' Z',fill:'#e4dcf2',stroke:C.ink,'stroke-width':2},s);
    var left=r*th,folds=Math.round(left/3);
    for(var i=0;i<folds;i++){var t=(i+0.5)/folds;var an=-Math.PI/2-th*t;var px=ex+Math.cos(an)*w*0.95,py=ey+Math.sin(an)*w*0.95,qx=ex+Math.cos(an)*w*0.35,qy=ey+Math.sin(an)*w*0.35;var mx=(px+qx)/2+Math.cos(an+Math.PI/2)*6,my=(py+qy)/2+Math.sin(an+Math.PI/2)*6;el('path',{d:'M'+px.toFixed(1)+','+py.toFixed(1)+' Q'+mx.toFixed(1)+','+my.toFixed(1)+' '+qx.toFixed(1)+','+qy.toFixed(1),fill:'none',stroke:C.purple,'stroke-width':2.4,'stroke-linecap':'round'},s);}
    if(a>20){el('path',{d:'M'+(ex+w*0.4)+','+(ey+w*0.2)+' l 30,6 M'+(ex+w*0.3)+','+(ey+w*0.5)+' l 26,18',stroke:C.orange,'stroke-width':1.8,fill:'none'},s);}
    ktxt(s,ex-60,ey-w-14,'안쪽: 모임 주름',{size:12.5,fill:C.purple});ktxt(s,ex+20,ey+w+30,'바깥쪽: 당김 주름',{size:12.5,fill:C.orange});
    out(h).innerHTML='굽힌 각 <b>'+a+'°</b> = '+f2(th,2)+' 라디안 · 남는 길이 = '+r+' × '+f2(th,2)+' = <b>'+f2(left,1)+'cm</b> → 접힘 하나에 약 3cm(예시)라면 주름 약 <b>'+folds+'</b>개.';}
  ins.forEach(function(i){onIn(i,draw);});draw();};

/* ===================== 4부 ===================== */
P.p4_cluster=function(h){var W=520,H=380,pts=[],cen,asg,it=0;var G=[['#E9909A',0.15,0.7],['#1E1B22',0.42,0.2],['#D8C09A',0.7,0.75],['#6aa86a',0.88,0.45]];
  function init(){var r=rng(11);pts=[];G.forEach(function(g){for(var i=0;i<5;i++)pts.push({x:g[1]+(r()-.5)*0.16,y:g[2]+(r()-.5)*0.18,c:g[0]});});cen=[[0.3,0.4],[0.35,0.5],[0.5,0.45],[0.55,0.55]];asg=pts.map(function(){return -1;});it=0;draw();}
  function step(){pts.forEach(function(p,i){var b=0,bd=9;cen.forEach(function(c,k){var d=(p.x-c[0])*(p.x-c[0])+(p.y-c[1])*(p.y-c[1]);if(d<bd){bd=d;b=k;}});asg[i]=b;});
    cen=cen.map(function(c,k){var m=pts.filter(function(_,i){return asg[i]===k;});if(!m.length)return c;return[m.reduce(function(a,p){return a+p.x;},0)/m.length,m.reduce(function(a,p){return a+p.y;},0)/m.length];});it++;draw();}
  var KC=[C.teal,C.orange,C.blue,C.purple];
  function draw(){var s=svgOf(h,W,H);el('rect',{x:30,y:20,width:W-50,height:H-60,fill:'#fbfcfd',stroke:'#d5dbe2'},s);function X(v){return 30+v*(W-50);}function Y(v){return H-40-v*(H-60);}
    ktxt(s,W/2,H-12,'머리 색 →',{size:12.5,anchor:'middle'});ktxt(s,8,H/2,'밝기',{size:12.5});
    pts.forEach(function(p,i){if(asg[i]>=0)el('line',{x1:X(p.x),y1:Y(p.y),x2:X(cen[asg[i]][0]),y2:Y(cen[asg[i]][1]),stroke:KC[asg[i]],'stroke-width':1,opacity:.5},s);
      el('rect',{x:X(p.x)-9,y:Y(p.y)-9,width:18,height:18,rx:3,fill:p.c,stroke:asg[i]>=0?KC[asg[i]]:'#999','stroke-width':2.5},s);});
    cen.forEach(function(c,k){el('path',{d:'M'+(X(c[0])-10)+','+Y(c[1])+' h20 M'+X(c[0])+','+(Y(c[1])-10)+' v20',stroke:KC[k],'stroke-width':4},s);});
    var pure=0;if(it){for(var k=0;k<4;k++){var m=pts.filter(function(_,i){return asg[i]===k;}).map(function(p){return p.c;});if(m.length&&m.every(function(c){return c===m[0];}))pure++;}}
    out(h).innerHTML=it===0?'점 20개(그림 20장)와 + 모양 무리 중심 4개. 아직 묶지 않았습니다.':'묶기 <b>'+it+'</b>번 · 한 가지 머리색만 모인 무리 <b>'+pure+' / 4</b>'+(pure===4?' <span class="alert">이름표 없이 네 동네가 생겼습니다!</span>':'');}
  ctl(h).querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){if(b.dataset.k==='step')step();else init();});});init();};

P.p4_latent=function(h){var W=520,H=360,pt=[0.15,0.25],drag=false;var wrap=document.createElement('div');wrap.style.cssText='display:grid;grid-template-columns:1.4fr 1fr;gap:10px;align-items:center';h.innerHTML='';h.appendChild(wrap);
  var sd=document.createElement('div');wrap.appendChild(sd);var cv=document.createElement('canvas');cv.width=200;cv.height=200;cv.style.cssText='width:100%;border-radius:10px;border:1px solid #d5dbe2';cv.setAttribute('role','img');cv.setAttribute('aria-label','지도 위 점에 해당하는 얼굴 그림');wrap.appendChild(cv);
  var HAIR=['#E9909A','#1E1B22','#D8C09A'],HAIR2=['#D9707E','#4A4656','#B89C74'],EYE=['#3D8BE0','#7A7680','#B07A3E'];var crowd=[0.22,0.62,0.13];
  function colAt(x,arr){var t=x*2;var i=Math.min(1,Math.floor(t));return mix(arr[i],arr[i+1],t-i);}
  function draw(){var s=el('svg',{viewBox:'0 0 '+W+' '+H,role:'img','aria-label':'잠재공간 지도'},null);sd.innerHTML='';sd.appendChild(s);
    for(var i=0;i<26;i++){el('rect',{x:20+i*(W-40)/26,y:20,width:(W-40)/26+1,height:H-60,fill:colAt(i/25,HAIR),opacity:.22},s);}
    el('rect',{x:20,y:20,width:W-40,height:H-60,fill:'none',stroke:'#d5dbe2'},s);
    var cx=20+crowd[0]*(W-40),cy=H-40-crowd[1]*(H-60);el('circle',{cx:cx,cy:cy,r:crowd[2]*(W-40),fill:C.purple,opacity:.14,stroke:C.purple,'stroke-dasharray':'5 4'},s);ktxt(s,cx,cy-crowd[2]*(W-40)-6,'자주 본 그림이 몰린 동네',{size:12,anchor:'middle',fill:C.purple});
    ktxt(s,24,H-24,'분홍',{size:12.5});ktxt(s,W/2,H-24,'검정',{size:12.5,anchor:'middle'});ktxt(s,W-24,H-24,'베이지',{size:12.5,anchor:'end'});ktxt(s,W-24,36,'↑ 픽셀',{size:12.5,anchor:'end'});ktxt(s,W-24,H-46,'↓ 매끈',{size:12.5,anchor:'end'});
    var X=20+pt[0]*(W-40),Y=H-40-pt[1]*(H-60);var g=el('g',{class:'drag'},s);el('circle',{cx:X,cy:Y,r:18,fill:'#ffd34d',opacity:.4},g);el('circle',{cx:X,cy:Y,r:10,fill:'#ffd34d',stroke:C.orange,'stroke-width':2.5},g);
    g.addEventListener('pointerdown',function(e){drag=true;g.setPointerCapture&&g.setPointerCapture(e.pointerId);});
    g.addEventListener('pointermove',function(e){if(!drag)return;var q=svgPt(s,e);pt=[clamp((q.x-20)/(W-40),0,1),clamp((H-40-q.y)/(H-60),0,1)];draw();});g.addEventListener('pointerup',function(){drag=false;});
    var inCrowd=Math.hypot(pt[0]-crowd[0],(pt[1]-crowd[1])*(H-60)/(W-40))<crowd[2];
    var near=pt[0]<0.25?'haru':pt[0]>0.75?'moa':pt[0]>0.4&&pt[0]<0.6?'sia':'';
    var o={hair:colAt(pt[0],HAIR),hair2:colAt(pt[0],HAIR2),eye:colAt(pt[0],EYE),skin:'#F6D3B8',outfit:pt[0]<0.33?'hoodie':pt[0]<0.66?'maid':'cardigan',long:true,buns:near==='haru'&&!inCrowd,streak:near==='haru'&&!inCrowd?'#1E2F5C':null,headband:near==='moa',ribbon:near==='moa'?'L':null,wavy:pt[0]>0.66};
    var off=document.createElement('canvas');off.width=200;off.height=200;drawBust(off.getContext('2d'),200,200,o);pixelate(off,cv,1+Math.round(pt[1]*14));
    out(h).innerHTML='점 위치: 머리색 '+f2(pt[0],2)+' · 화풍 '+f2(pt[1],2)+(near?' — <b>'+{haru:'하루',sia:'시아',moa:'모아'}[near]+'</b>의 동네':' — 두 동네 사이: 특징이 섞인 그림')+(inCrowd?' · <b style="color:'+C.purple+'">몰린 동네 안</b>: 번·남색 줄 같은 특징이 흐려지고 흔한 모습으로 끌려갑니다.':'');}
  h.addEventListener('pointerup',function(){drag=false;});draw();};

P.p4_noise=function(h){var c=ctl(h),inp=c.querySelector('input'),W=300,H=300,seed=5;var cv=canvasOf(h,W,H,360),ctx=cv.getContext('2d');var base=offBust('haru',{},W);var bd=base.getContext('2d').getImageData(0,0,W,H).data;
  function blurred(rad_){if(rad_<1)return bd;var t=document.createElement('canvas');var k=Math.max(1,Math.round(W/rad_));t.width=k;t.height=k;var tc=t.getContext('2d');tc.drawImage(base,0,0,k,k);var u=document.createElement('canvas');u.width=W;u.height=H;var uc=u.getContext('2d');uc.imageSmoothingEnabled=true;uc.drawImage(t,0,0,W,H);return uc.getImageData(0,0,W,H).data;}
  function draw(){var t=+inp.value,ab=1-0.09*t,a=Math.sqrt(ab),b=Math.sqrt(1-ab);var src=blurred(t<=1?0:Math.pow(2,t*0.62));var img=ctx.createImageData(W,H),d=img.data,r=rng(seed*31+7);
    for(var i=0;i<d.length;i+=4){var nz=(r()-.5)*2*255*0.9;for(var k=0;k<3;k++){var nk=k?nz*(0.6+0.8*r()):nz;d[i+k]=clamp(a*src[i+k]+b*(128+nk)+(1-a-b)*0,0,255);}d[i+3]=255;}
    ctx.putImageData(img,0,0);
    out(h).innerHTML='단계 <b>'+t+'</b> · ᾱ = <b>'+f2(ab,2)+'</b> → 원본 × '+f2(a,2)+' + 잡음 × '+f2(b,2)+(t===4?' (수식 상자의 예: 0.8과 0.6)':'')+' · '+(t>=7?'아직 잡음뿐':t>=5?'큰 머리 덩어리가 보임':t>=3?'번 두 개가 보임':t>=1?'남색 줄·눈 하이라이트까지':'완성');}
  onIn(inp,draw);c.querySelector('[data-k=seed]').addEventListener('click',function(){seed++;draw();});draw();};

P.p4_guide=function(h){var c=ctl(h),chk=c.querySelectorAll('input[type=checkbox]'),sl=c.querySelector('input[type=range]'),W=260;var cv=canvasOf(h,W,W,340),ctx=cv.getContext('2d');
  function on(k){return [].some.call(chk,function(x){return x.dataset.w===k&&x.checked;});}
  function draw(){var w=+sl.value,st=clamp(w/5,0,1),over=w>=12;var gen={hair:'#8a6a5a',hair2:'#6e5244',eye:'#6a5a4a'};
    var hair=on('pink')?mix(gen.hair,'#E9909A',st):gen.hair;if(over&&on('pink'))hair='#ff3fa0';
    var o={hair:hair,hair2:on('pink')?mix(gen.hair2,'#D9707E',st):gen.hair2,eye:mix(gen.eye,'#3D8BE0',on('pink')||on('buns')?st*0.8:0),skin:over?'#ffd0a8':'#F6D3B8',outfit:on('coat')&&st>0.3?'hoodie':'generic',coat:on('coat')&&st>0.3,long:true,buns:on('buns')&&st>0.5,streak:on('navy')&&st>0.5?'#1E2F5C':null,line:over?6:null,blush:!over};
    drawBust(ctx,W,W,o);if(over){ctx.fillStyle='rgba(255,60,120,.12)';ctx.fillRect(0,0,W,W);}
    var miss=[];if(!on('navy'))miss.push('앞머리 남색 줄');
    out(h).innerHTML='안내 강도 w = <b>'+w+'</b> · '+(w===0?'프롬프트를 무시 — 특징이 거의 없음':over?'<b style="color:'+C.red+'">과장</b>: 색이 타고 선이 뻣뻣함':st<1?'특징이 반쯤 반영':'켠 낱말의 특징이 잘 반영')+(miss.length?' · 켜지 않은 특징('+miss.join(', ')+')은 w를 올려도 생기지 않습니다.':'');}
  chk.forEach(function(x){x.addEventListener('change',draw);});onIn(sl,draw);draw();};

/* ===================== 5부 ===================== */
var TOK={haru:[['hair','분홍 생머리 + 남색 줄'],['center','앞머리 가운데 굵은 남색 줄'],['buns','정수리 번 두 개'],['ahoge','바보털'],['eye','파란 눈'],['hoodie','라벤더 후드티'],['coat','흰 랩코트']],
 sia:[['hair','허리까지 오는 새까만 생머리'],['eye','차분한 회색 눈'],['earring','은색 드롭 귀걸이'],['dress','차콜 검정 메이드 원피스'],['bow','목의 큰 회색 리본'],['nohead','머리 장식 없음']],
 moa:[['hair','애쉬 베이지 긴 웨이브 머리'],['band','흰 프릴 메이드 머리띠'],['ribbon','리본은 왼쪽 귀 위'],['eye','호박색 눈'],['cardigan','카멜 니트 카디건'],['tie','빨강·남색 체크 리본 타이']]};
function tokCfg(n,on){var o;if(n==='haru'){o=cfg('haru',{});if(!on.hair){o.hair='#c98a6e';o.hair2='#a86e56';}if(!on.center)o.streak=null;if(!on.buns)o.buns=false;if(!on.ahoge)o.ahoge=false;if(!on.eye)o.eye='#5aa36a';if(!on.hoodie)o.outfit='generic';if(!on.coat)o.coat=false;}
  else if(n==='sia'){o=cfg('sia',{});if(!on.hair){o.hair='#6b4a36';o.hair2='#8a6650';o.long=false;}if(!on.eye)o.eye='#4f8ad0';if(!on.earring)o.earring=false;if(!on.dress)o.outfit='generic';if(!on.nohead)o.headband=true;}
  else{o=cfg('moa',{});if(!on.hair){o.hair='#7b5236';o.hair2='#5e3d28';o.wavy=false;}if(!on.band)o.headband=false;if(!on.ribbon)o.ribbon='R';if(!on.eye)o.eye='#4f8ad0';if(!on.cardigan)o.outfit='generic';}
  return o;}
P.p5_tokens=function(h){var c=ctl(h),sel=c.querySelector('select'),W=260;var box=document.createElement('div');box.style.cssText='display:flex;flex-wrap:wrap;gap:6px 14px;width:100%';c.appendChild(box);var cv=canvasOf(h,W,W,340),ctx=cv.getContext('2d');var on={};
  function build(){var n=sel.value;box.innerHTML='';on={};TOK[n].forEach(function(t){on[t[0]]=true;var l=document.createElement('label');l.innerHTML='<input type="checkbox" checked> '+t[1];l.querySelector('input').addEventListener('change',function(e){on[t[0]]=e.target.checked;draw();});box.appendChild(l);});draw();}
  function draw(){var n=sel.value,list=TOK[n];drawBust(ctx,W,W,tokCfg(n,on));var k=list.filter(function(t){return on[t[0]];}).length;var off=list.filter(function(t){return !on[t[0]];}).map(function(t){return t[1];});
    out(h).innerHTML='지킨 고정값 <b>'+k+' / '+list.length+'</b> → 닮음 점수 <b>'+Math.round(100*k/list.length)+'%</b>'+(off.length?' · 빠진 것: '+off.join(', ')+' → AI가 흔한 모양으로 채웁니다'+(n==='sia'&&!on.nohead?'(메이드 → 머리띠가 생김)':'')+(n==='moa'&&!on.ribbon?'(리본이 오른쪽으로)':''):' · 모두 지켰습니다.');}
  sel.addEventListener('change',build);build();};
P.p5_pixel=function(h){var inp=ctl(h).querySelector('input'),W=300;var cv=canvasOf(h,W,W,340);var base=offBust('haru',{},W);
  function draw(){var b=+inp.value;pixelate(base,cv,b);var n=Math.round(W/b);out(h).innerHTML='네모 크기 <b>'+b+'</b> → 가로 네모 <b>'+n+'</b>개로 그린 그림. '+(b>=16?'눈은 네모 몇 개뿐, 번·남색 줄도 뭉개졌습니다.':b>=8?'큰 특징은 남지만 눈동자·하이라이트가 사라졌습니다.':'작은 특징까지 보입니다.')+' 늘리기만 해서는 사라진 정보가 돌아오지 않습니다.';}
  onIn(inp,draw);draw();};
P.p5_strength=function(h){var c=ctl(h),sl=c.querySelector('input[type=range]'),chk=c.querySelectorAll('input[type=checkbox]'),W=300;var cv=canvasOf(h,W,W,340);
  function draw(){var s=+sl.value/100,tok=chk[0].checked,ref=chk[1].checked;var lo=ref?0.35:0.4,hi=0.7+(tok?0.1:0)+(ref?0.15:0);var zone=s<lo?'low':s>hi?'high':'good';
    var base;if(zone==='high'){base=offBust('sia',{hair:'#7a4b30',hair2:'#5e3a26',long:false,eye:'#4fa070',headband:true,earring:false},W);}else base=offBust('sia',{},W);
    if(zone==='low')pixelate(base,cv,Math.round(lerp(18,7,s/lo)));else{var ctx=cv.getContext('2d');ctx.drawImage(base,0,0);}
    out(h).innerHTML='강도 <b>'+f2(s,2)+'</b> → 전체 30단계 중 <b>'+Math.round(s*30)+'</b>단계를 다시 그림 · 좋은 구간 '+f2(lo,2)+'~'+f2(Math.min(1,hi),2)+' · '+(zone==='low'?'<b>픽셀이 그대로 남음</b>(f7)':zone==='high'?'<b style="color:'+C.red+'">다른 사람이 됨</b>(f6)':'<b style="color:'+C.green+'">자세·특징은 남고 화풍만 바뀜</b>');}
  onIn(sl,draw);chk.forEach(function(x){x.addEventListener('change',draw);});draw();};
P.p5_guides=function(h){var c=ctl(h),inp=c.querySelector('input'),mode='pose',W=520,H=440;
  function draw(){var y=+inp.value,s=svgOf(h,W,H);el('rect',{x:0,y:0,width:W,height:H,fill:mode==='shade'?'#fbfcfd':'#000'},s);
    var r=renderMan(s,{W:W,H:H,yaw:y,mode:mode==='pose'?'flat':mode==='edge'?'edge':mode==='depth'?'depth':'shade',flat:'#111',scale:42,oy:H-22});
    if(mode==='pose'){var J=r.J;var bones=[['head','neck','#ff5555'],['neck','ls','#ffaa00'],['neck','rs','#55ff55'],['ls','le','#ffdd00'],['le','lh','#ddff00'],['rs','re','#00ff99'],['re','rh','#00ddff'],['neck','lp','#5599ff'],['neck','rp','#aa66ff'],['lp','lk','#ff66cc'],['lk','la','#ff3399'],['rp','rk','#66ccff'],['rk','ra','#3366ff']];
      bones.forEach(function(b){el('line',{x1:J[b[0]][0],y1:J[b[0]][1],x2:J[b[1]][0],y2:J[b[1]][1],stroke:b[2],'stroke-width':6,'stroke-linecap':'round',opacity:.85},s);});
      for(var k in J)el('circle',{cx:J[k][0],cy:J[k][1],r:5.5,fill:'#fff'},s);}
    var msg={pose:'뼈대: 관절 점과 뼈 선 — 손이 허리에 있다는 것이 점으로 정해집니다.',edge:'윤곽: 면의 경계선 — 외곽 모양을 붙잡습니다.',depth:'깊이: 가까울수록 밝게 — 팔이 몸 앞인지 뒤인지 보입니다.',shade:'음영: 1부의 도형 마네킹 그대로입니다. 세 지도가 모두 여기서 나옵니다.'}[mode];
    out(h).innerHTML='<b>'+{pose:'뼈대(포즈)',edge:'윤곽(선화)',depth:'깊이',shade:'음영'}[mode]+'</b> · 도는 각 '+y+'° · '+msg;}
  seg(h,'button',function(b){mode=b.dataset.g;draw();});onIn(inp,draw);draw();};

var CORE={haru:"Haru, a cheerful lab assistant, long straight pink hair with navy blue streaks including a thick navy streak down the center of the bangs, two round messy hair buns on top of the head, a small ahoge, big bright blue eyes, lavender hoodie with white drawstrings over a white t-shirt, open white knee-length lab coat, rolled-up jeans, lavender sneakers",
 sia:"Sia, a calm maid intern, long straight jet-black hair reaching the waist with side-swept bangs, calm gray eyes, small silver drop earrings, long-sleeved charcoal-black maid dress with white lace cuffs, white high collar with a large soft gray bow, long white frilled apron, white socks, black flat shoes, no headdress",
 moa:"Moa, a gentle cheerful maid intern, long ash-beige hair with soft wavy ends and neat bangs, white frilled maid headband with a thin white ribbon over the LEFT ear, amber-brown eyes, white shirt with a red and navy plaid bow tie, camel knit cardigan, white frilled apron, black skirt, white socks, brown loafers"};
var POSE={hip:"standing upright in a three-quarter view, one arm relaxed at the side, the right hand resting on the hip",up:"stretching both arms straight up above the head",sit:"sitting upright on a bench, both hands resting on the knees",walk:"walking to the right in mid-stride"};
var LIGHT={ul:["soft daylight from the upper left","form shadows on the right side of the body, cast shadow on the floor toward the lower right","오른쪽 아래"],ur:["soft daylight from the upper right","form shadows on the left side of the body, cast shadow on the floor toward the lower left","왼쪽 아래"],
 below:["a single lamp from below","shadows above the eyes and on top of folds, a tall cast shadow on the wall behind","뒤쪽 벽 위"],back:["strong backlight from behind","a bright rim light on the hair and shoulders, the front mostly in soft shadow, cast shadow toward the viewer","앞쪽"]};
var FAB={none:"",crisp:"crisp stiff fabric with straighter folds and sharp corners",soft:"soft fabric with rounded flowing S-shaped folds and gentle sagging"};
var STY={pixel:["detailed 16-bit SNES-era pixel art with clearly visible square pixels, limited palette, bold dark outline, 2–3 tone shading","no smooth gradients, no photorealistic look"],anime:["high-quality anime illustration, clean lineart, two-tone cel shading with soft highlights","no pixel art, no photorealistic look"],
 semireal:["semi-realistic 2.5D digital painting, realistic proportions and fabric textures, slightly stylized face","no pixel art"],photo:["photorealistic studio photograph of a fictional adult model in her early twenties cosplaying this original character, 50mm lens, natural skin texture, real fabric with natural wrinkles","no pixel art, not resembling any real celebrity"]};
function buildPrompt(o){var parts=[],score=0,miss=[];
  if(o.who){parts.push('Character (keep exactly): '+CORE[o.who]+'.');score++;}else miss.push('① 캐릭터 고정 문장');
  if(o.pose){parts.push('Pose: '+POSE[o.pose]+'.');score++;}else miss.push('② 자세');
  if(o.light){parts.push('Lighting: '+LIGHT[o.light][0]+'; '+LIGHT[o.light][1]+'.');score++;}else miss.push('③ 빛과 그림자 방향');
  if(o.fab&&o.fab!=='none'){parts.push('Fabric: '+FAB[o.fab]+'; folds start from contact points (shoulders, waist, bent joints) and hang by gravity.');score++;}else miss.push('④ 옷 소재(흐름·꺾임)');
  if(o.sty){parts.push('Style: '+STY[o.sty][0]+'.');score++;}else miss.push('⑤ 화풍(하나만)');
  var neg=['no text','no letters','no logos','no watermark'];if(o.sty)neg.push(STY[o.sty][1]);if(o.neg){neg.push('no revealing clothing','no mirrored image','not resembling any famous anime character','five fingers on each hand');score++;}else miss.push('⑥ 금지 목록');
  parts.push('Negative: '+neg.join(', ')+'.');return {text:parts.join('\n'),score:score,miss:miss};}
P.p5_builder=function(h){h.innerHTML='';var form=document.createElement('div');form.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px 14px';h.appendChild(form);
  var defs=[['who','① 캐릭터',[['','(고르기)'],['haru','하루'],['sia','시아'],['moa','모아']]],['pose','② 자세',[['','(고르기)'],['hip','서서 한 손 허리'],['up','두 팔 위로'],['sit','벤치에 앉기'],['walk','걷기']]],
   ['light','③ 빛',[['','(고르기)'],['ul','왼쪽 위'],['ur','오른쪽 위'],['below','아래에서'],['back','뒤에서']]],['fab','④ 소재',[['none','(정하지 않음)'],['crisp','빳빳한 천'],['soft','부드러운 천']]],['sty','⑤ 화풍',[['','(고르기)'],['pixel','픽셀'],['anime','애니풍'],['semireal','반실사'],['photo','실사풍']]]];
  var S={};defs.forEach(function(d){var l=document.createElement('label');l.style.cssText='display:flex;flex-direction:column;font-size:14px';l.innerHTML='<span>'+d[1]+'</span>';var s=document.createElement('select');s.setAttribute('aria-label',d[1]);d[2].forEach(function(o){var op=document.createElement('option');op.value=o[0];op.textContent=o[1];s.appendChild(op);});l.appendChild(s);form.appendChild(l);S[d[0]]=s;s.addEventListener('change',draw);});
  var nl=document.createElement('label');nl.style.cssText='display:flex;gap:6px;align-items:center;font-size:14px';nl.innerHTML='<input type="checkbox"> ⑥ 금지 목록 넣기';form.appendChild(nl);var neg=nl.querySelector('input');neg.addEventListener('change',draw);
  var pb=document.createElement('div');pb.className='promptbox';pb.innerHTML='<b>조립된 프롬프트</b><pre aria-live="polite"></pre><button type="button" class="btn">복사하기</button> <span class="hint"></span>';h.appendChild(pb);
  pb.querySelector('button').addEventListener('click',function(){var t=pb.querySelector('pre').textContent;var hint=pb.querySelector('.hint');if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){hint.textContent='복사했습니다.';},function(){hint.textContent='복사가 막혔습니다. 직접 선택해 복사하세요.';});else hint.textContent='직접 선택해 복사하세요.';});
  function draw(){var o={};for(var k in S)o[k]=S[k].value;o.neg=neg.checked;var r=buildPrompt(o);pb.querySelector('pre').textContent=r.text;
    out(h).innerHTML='점검표 <b>'+r.score+' / 6</b>'+(r.miss.length?' · 빠진 항목: '+r.miss.join(', '):' <span class="alert">빠진 항목이 없습니다!</span>')+(o.light?' · 빛 '+S.light.options[S.light.selectedIndex].text+' → 바닥 그림자 <b>'+LIGHT[o.light][2]+'</b>':'');}
  draw();};
window.__lab={buildPrompt:buildPrompt,LIGHT:LIGHT};

/* ===================== 6부 ===================== */
var CHECK=['① 구조(비례·자세·손)','② 빛(광원 하나·그림자 반대쪽)','③ 천(접점·중력)','④ 고정값(특징·좌우)','⑤ 강도·화풍'];
var FAILAT=[3,3,1,2,0,3,4,4];var FAILWHY=['번·남색 줄·바보털이 빠졌습니다.','리본이 오른쪽 — 좌우가 뒤집혔습니다.','몸은 왼쪽 빛, 그림자도 왼쪽 — 모순입니다.','바람이 없는데 치마가 떠 있습니다.','손가락이 여섯 개입니다.','얼굴·머리가 다른 사람입니다.','큰 네모가 번져 있습니다 — 다시 그리지 않았습니다.','한 몸에 화풍이 둘입니다.'];
P.p6_check=function(h){var c=ctl(h),sel=c.querySelector('select');h.innerHTML='';var list=document.createElement('div');list.style.cssText='display:flex;flex-direction:column;gap:6px';h.appendChild(list);var done=0;
  function build(){list.innerHTML='';done=0;CHECK.forEach(function(t,i){var b=document.createElement('button');b.type='button';b.className='btn';b.style.textAlign='left';b.textContent=t;b.addEventListener('click',function(){press(i,b);});list.appendChild(b);});out(h).innerHTML='점검표를 <b>위에서부터</b> 눌러 보세요.';}
  function press(i,b){var f=+sel.value,at=FAILAT[f];if(i!==done){out(h).innerHTML='순서대로! 먼저 <b>'+CHECK[done]+'</b>을 보세요. 큰 것부터 작은 것으로입니다.';return;}
    if(i<at){b.style.borderColor=C.green;b.style.background='#ecf7ef';b.textContent=CHECK[i]+' — 통과';done++;out(h).innerHTML=CHECK[i]+' 통과. 다음 항목으로.';}
    else{b.style.borderColor=C.red;b.style.background='#fdeceb';b.textContent=CHECK[i]+' — 여기서 걸림';done=99;out(h).innerHTML='<b>'+CHECK[i]+'</b>에서 처음 걸렸습니다: '+FAILWHY[f]+' 이 항목이 가장 먼저 고칠 원인입니다. 아래 실패 카드 f'+(f+1)+'에서 고친 프롬프트를 보세요.';}}
  sel.addEventListener('change',build);build();};

/* ===================== 실전 연습장 ===================== */
function practice(){var root=document.getElementById('practice');if(!root)return;var tabs=root.querySelectorAll('.tabs button'),scenes=root.querySelectorAll('.scene');
  function show(id){tabs.forEach(function(b){b.classList.toggle('on',b.dataset.t===id);});scenes.forEach(function(s){s.classList.toggle('on',s.id===id);});if(history.replaceState)history.replaceState(null,'','#'+id);}
  tabs.forEach(function(b){b.addEventListener('click',function(){show(b.dataset.t);});});var hsh=(location.hash||'').slice(1);show([].some.call(scenes,function(s){return s.id===hsh;})?hsh:'studio');
  studio();wardrobe();workshop();desk();}
function board(el_,items){el_.innerHTML=items.map(function(it){return '<div class="'+(it[2]?'good':'bad')+'"><span>'+it[0]+'</span><b>'+it[1]+'</b></div>';}).join('');}
function say(el_,lines){el_.innerHTML=lines.map(function(l){return '<div class="line"><img src="../assets/chars/'+l[0]+'_'+l[1]+'.webp" alt="" width="48" height="48"><div class="bub"><b>'+l[2]+'</b>'+l[3]+'</div></div>';}).join('');}
function missions(el_,state,touched){el_.querySelectorAll('li').forEach(function(li,i){if(touched&&state[i])li.classList.add('done');});}
var DONE={};
function studio(){var S=document.getElementById('studio');if(!S)return;var q=function(n){return S.querySelector('[name='+n+']');};var g1=S.querySelector('.g1'),g2=S.querySelector('.g2');var touched=false;var M=[0,0,0];
  function upd(){var az=+q('az').value,el_=+q('elev').value,size=+q('size').value,hgt=+q('hgt').value,floor=+q('floor').value/100;
    var lx=-Math.cos(rad(az)),ly=Math.sin(rad(el_));var lit=Math.round(50+50*Math.sin(rad(el_))*0.6+Math.abs(Math.cos(rad(az)))*0);var pen=size*hgt/200;var dirOk=el_>0;var bounce=Math.round(floor*100*(el_>0?1:0.3));
    var Lv=norm([lx*Math.cos(rad(el_)),Math.sin(rad(el_)),0.6]);var cnt=0,tot=0;for(var ux=-1;ux<=1;ux+=0.05)for(var uy=-1;uy<=1;uy+=0.05){var r2=ux*ux+uy*uy;if(r2>1)continue;tot++;if(ux*Lv[0]+uy*Lv[1]+Math.sqrt(1-r2)*Lv[2]>0)cnt++;}var litPct=Math.round(100*cnt/tot);
    board(S.querySelector('.board'),[['밝은 면 비율',litPct+'%',litPct>=50],['그림자 방향',el_<0?'위쪽(무서운 조명)':(az<90?'오른쪽 아래':az>90?'왼쪽 아래':'바로 아래'),dirOk],['흐린 폭',f2(pen,1)+'cm',pen>=3&&pen<=5],['반사광',bounce+'%',bounce>=30]]);
    // 그래프 1: 장면
    var s=el('svg',{viewBox:'0 0 360 220',role:'img','aria-label':'조명 장면 그림'});g1.innerHTML='';g1.appendChild(s);el('rect',{x:0,y:0,width:360,height:220,fill:'#fbfcfd'},s);el('rect',{x:0,y:170,width:360,height:50,fill:mix('#5b6170','#f3f4f8',floor)},s);
    var cx=180,cy=170-30-hgt*0.6;var sx=cx+(az<90?1:az>90?-1:0)*Math.cos(rad(el_))*60*(el_>0?1:0);el('ellipse',{cx:el_>0?sx:cx,cy:el_>0?173:120,rx:34+pen*2,ry:7+pen,fill:'#1d2030',opacity:clamp(0.6-hgt/150,0.15,0.6)},s);
    var gg=el('radialGradient',{id:'stb',cx:String(0.5-lx*0.25),cy:String(el_>0?0.3:0.75),r:'0.85'},el('defs',{},s));el('stop',{offset:'0','stop-color':'#fff'},gg);el('stop',{offset:'0.6','stop-color':'#aeb3c4'},gg);el('stop',{offset:'1','stop-color':mix('#3e4254','#b9bdcc',floor)},gg);
    el('circle',{cx:cx,cy:cy,r:30,fill:'url(#stb)',stroke:C.ink},s);var Lx=cx+lx*120,Ly=el_>0?110-80*Math.sin(rad(el_)):205;el('circle',{cx:Lx,cy:Ly,r:Math.max(4,size/4),fill:'#ffd34d',stroke:C.orange,'stroke-width':2},s);
    // 그래프 2: 밝기 곡선
    var s2=el('svg',{viewBox:'0 0 360 220',role:'img','aria-label':'면 각도에 따른 밝기 곡선'});g2.innerHTML='';g2.appendChild(s2);el('rect',{x:30,y:20,width:310,height:160,fill:'#fbfcfd',stroke:'#d5dbe2'},s2);
    var d='';for(var t=0;t<=180;t+=5){var b=Math.max(0,Math.cos(rad(t)));d+=(t?'L':'M')+(30+t/180*310)+','+(180-b*150);}el('path',{d:d,fill:'none',stroke:C.teal,'stroke-width':2.5},s2);el('line',{x1:30+90/180*310,y1:20,x2:30+90/180*310,y2:180,stroke:C.red,'stroke-dasharray':'5 4'},s2);
    ktxt(s2,185,200,'면과 빛 사이 각도 θ (0°~180°)',{size:12,anchor:'middle'});ktxt(s2,34,16,'밝기 = max(0, cos θ)',{size:12});ktxt(s2,30+90/180*310+4,34,'90° 그림자 경계',{size:11.5,fill:C.red});
    M=[el_>=35&&el_<=60&&az>=120&&az<=150,pen>=3&&pen<=5,el_<0];
    if(touched)missions(S.querySelector('.missions'),M,true);
    say(S.querySelector('.talk'),[['doctor','e10','박사',el_<0?'아래 조명은 얼굴 위쪽에 그림자를 만든다. 무서운 장면에 쓰지.':'광원 방위 '+az+'°, 높이 '+el_+'°. 그림자는 그 반대쪽이다.'],['haru','e10','조수','흐린 폭은 '+size+' × '+hgt+' ÷ 200 = '+f2(pen,1)+'cm예요.'],['fruitfly','e09','초파리',hgt>40?'공이 많이 떠 있는데 그림자가 너무 진하지 않아?':'바닥 밝기를 내리면 반사광도 줄어들걸.'],['jupanbot','e16','주판봇',size>=50?'광원은 클수록 좋습니다! 그림자가 사라지면 깨끗하잖아요!':'광원 높이 최대가 정답입니다!']]);}
  S.querySelectorAll('input').forEach(function(i){i.addEventListener('input',function(){touched=true;upd();});});upd();}
function wardrobe(){var S=document.getElementById('wardrobe');if(!S)return;var q=function(n){return S.querySelector('[name='+n+']');};var host=S.querySelector('.g1'),g2=S.querySelector('.g2');var touched=false;var W=520,H=380;var cv=document.createElement('canvas');cv.width=W;cv.height=H;cv.style.cssText='width:100%;border-radius:10px';cv.setAttribute('role','img');cv.setAttribute('aria-label','천 시뮬레이션 그림');host.innerHTML='';host.appendChild(cv);var ctx=cv.getContext('2d');var cl,raf;
  function setup(){var gap=+q('gap').value/100,dh=+q('dh').value,gather=q('gather').checked;cl=new Cloth(19,15,1);var nx=cl.nx;cl.pin={};function pin(i,pos){var k=cl.idx(i,0);cl.pin[k]=pos;cl.p[k]=pos.slice();cl.o[k]=pos.slice();}
    if(gather){for(var i=0;i<nx;i++)pin(i,[(i-(nx-1)/2)*0.42,0,(i%2?0.35:-0.35)]);}else{var half=(nx-1)/2*gap;pin(0,[-half,0,0]);pin(nx-1,[half,-dh,0]);}}
  function stats(){var wt=+q('wt').value/100,wind=+q('wind').value/100;var folds=cl.folds(),sag=cl.sag();var mid=cl.p[cl.idx(9,0)];var tilt=Math.abs(cl.p[cl.idx(0,14)][0]-cl.p[cl.idx(18,14)][0]);
    var maxs=0;for(var j=0;j<cl.ny;j++)for(var i=0;i<cl.nx-1;i++){var a=cl.p[cl.idx(i,j)],b=cl.p[cl.idx(i+1,j)];maxs=Math.max(maxs,Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]));}
    board(S.querySelector('.board'),[['가운데 처짐',f2(sag,1),sag>=3],['주름 굴곡',folds+'개',folds>=4],['높이 차',q('dh').value,+q('dh').value>=4],['최대 늘어남',f2((maxs-1)*100,0)+'%',maxs<1.15]]);
    var M=[!q('gather').checked&&sag>=4,!q('gather').checked&&+q('dh').value>=6,q('gather').checked&&folds>=3];if(touched)missions(S.querySelector('.missions'),M,true);
    var s=el('svg',{viewBox:'0 0 360 200',role:'img','aria-label':'가운데 줄 단면(앞뒤 굴곡)'});g2.innerHTML='';g2.appendChild(s);el('rect',{x:20,y:20,width:330,height:150,fill:'#fbfcfd',stroke:'#d5dbe2'},s);var j0=Math.floor(cl.ny*0.6),d='';for(var i2=0;i2<cl.nx;i2++){var v=cl.p[cl.idx(i2,j0)];d+=(i2?'L':'M')+(30+i2*(310/(cl.nx-1)))+','+(95-v[2]*14);}el('path',{d:d,fill:'none',stroke:C.purple,'stroke-width':2.5},s);ktxt(s,185,190,'아래쪽 가로줄의 앞뒤 굴곡(주름 단면)',{size:12,anchor:'middle'});
    say(S.querySelector('.talk'),[['doctor','e10','박사',q('gather').checked?'모으면 남는 천이 세로 모임 주름이 된다.':'접점 두 곳 사이로 당김 주름, 가운데는 중력으로 처진다.'],['moa','e10','모아','주름 굴곡 '+folds+'개, 가운데 처짐 '+f2(sag,1)+'이에요.'],['fruitfly','e09','초파리',wind>0?'바람이 불면 치맛단이 한쪽으로 쏠리지?':'바람이 없으면 천은 결국 가라앉아야 해.'],['jupanbot','e16','주판봇',wt>0.8?'무게 최대! 주름도 최대!':'뻣뻣함을 올리면 주름이 줄겠죠? 아니, 굵어지나?']]);}
  function run(){setup();var n=0;if(raf)cancelAnimationFrame(raf);function opts(){var st=+q('stiff').value/100,wt=+q('wt').value/100;return {g:0.004+0.016*wt,stiff:0.02+0.9*st,wind:+q('wind').value/100*0.004};}
    if(RM){for(var i=0;i<240;i++)cl.step(opts().g,opts().stiff,opts().wind);cl.draw(ctx,W,H,17,W/2,50);stats();return;}
    (function f(){var o=opts();cl.step(o.g,o.stiff,o.wind);cl.step(o.g,o.stiff,o.wind);cl.draw(ctx,W,H,17,W/2,50);n++;if(n%10===0)stats();if(n<240)raf=requestAnimationFrame(f);else stats();})();}
  S.querySelectorAll('input').forEach(function(i){i.addEventListener('change',function(){touched=true;run();});});run();}
function workshop(){var S=document.getElementById('workshop');if(!S)return;var q=function(n){return S.querySelector('[name='+n+']');};var touched=false;var used={};
  function upd(){var o={who:q('who').value,pose:q('pose').value,light:q('light').value,fab:q('fab').value,sty:q('sty').value,neg:q('neg').checked};used[o.who]=1;var r=buildPrompt(o);S.querySelector('.g1 pre').textContent=r.text;
    var job=q('job').value;var need={poster:['light','sty'],sheet:['pose','who'],goods:['sty','neg']}[job];var jobOk=need.every(function(k){return o[k];});
    board(S.querySelector('.board'),[['점검표',r.score+' / 6',r.score===6],['빛-그림자 일치',o.light?'예':'—',!!o.light],['화풍 충돌',o.sty?'없음':'—',!!o.sty],['요청 상황 맞춤',jobOk?'맞음':'부족',jobOk]]);
    var s=el('svg',{viewBox:'0 0 360 200',role:'img','aria-label':'점검표 막대'});var g2=S.querySelector('.g2');g2.innerHTML='';g2.appendChild(s);['캐릭터','자세','빛','소재','화풍','금지'].forEach(function(t,i){var ok=[o.who,o.pose,o.light,o.fab!=='none',o.sty,o.neg][i];el('rect',{x:70,y:14+i*30,width:ok?260:40,height:20,rx:4,fill:ok?C.teal:'#e3e8ee'},s);ktxt(s,64,29+i*30,t,{size:12.5,anchor:'end',fill:C.ink});});
    var M=[r.score===6,o.sty==='photo'&&o.neg,used.moa&&o.who==='moa'&&/LEFT ear/.test(r.text)];if(touched)missions(S.querySelector('.missions'),M,true);
    say(S.querySelector('.talk'),[['doctor','e10','박사','요청 상황: '+q('job').options[q('job').selectedIndex].text+'. '+(jobOk?'필요한 항목이 들어 있다.':'이 상황에 꼭 필요한 항목이 빠졌다.')],['haru','e10','조수','점검표 '+r.score+' / 6'+(r.miss.length?', 빠진 것: '+r.miss.join(', '):'!')],['fruitfly','e09','초파리',o.sty==='photo'&&!o.neg?'실사풍인데 금지 목록이 없으면 실존 인물을 닮을 수도 있어.':'빛 방향과 그림자 방향이 같이 적혔는지 봐.'],['jupanbot','e16','주판봇',r.score===6?'여섯 항목 완성! 이번엔 제가 이깁니다!':'항목이 남았습니다! 계산은 제가 하겠습니다!']]);}
  S.querySelectorAll('select,input').forEach(function(i){i.addEventListener('change',function(){touched=true;upd();});});
  var cp=S.querySelector('.copy');if(cp)cp.addEventListener('click',function(){var t=S.querySelector('.g1 pre').textContent;if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){cp.textContent='복사했습니다';},function(){cp.textContent='직접 선택해 복사하세요';});});upd();}
function desk(){var S=document.getElementById('desk');if(!S)return;var CA=['고정값 누락','좌우 반전','광원 모순','접점·중력 무시','작은 특징 단계 오류(손)','강도 너무 높음','늘리기만 함(강도 너무 낮음)','화풍 충돌'];
  var SYM=['분홍 머리인데 정수리 번과 앞머리 남색 줄이 없다','리본이 오른쪽 귀 위, 손도 반대쪽 허리','몸은 왼쪽 빛인데 바닥 그림자도 왼쪽으로 뻗음','바람이 없는데 치마가 위로 떠 있음','손가락이 여섯 개','옷은 같은데 짧은 갈색 머리의 다른 사람','큰 네모가 흐릿하게 번진 그림','몸 반은 픽셀, 반은 실사'];
  var cur=0,streak=0,seen={},wrong=0,right=0,touched=false;var r=rng(Date.now()%9999+1);
  function next(){cur=Math.floor(r()*8);S.querySelector('.sym').textContent='증상: '+SYM[cur];var o=S.querySelector('.opts');o.innerHTML='';
    var opts=[cur];while(opts.length<4){var k=Math.floor(r()*8);if(opts.indexOf(k)<0)opts.push(k);}opts.sort(function(){return r()-.5;});
    opts.forEach(function(k){var b=document.createElement('button');b.type='button';b.textContent=CA[k];b.addEventListener('click',function(){touched=true;if(k===cur){streak++;right++;seen[cur]=1;b.classList.add('ok');setTimeout(next,500);}else{streak=0;wrong++;b.classList.add('no');}upd();});o.appendChild(b);});}
  function upd(){var n=Object.keys(seen).length;board(S.querySelector('.board'),[['연속 정답',streak,streak>=3],['맞힌 종류',n+' / 8',n===8],['맞힘',right,right>0],['틀림',wrong,wrong===0]]);
    var M=[streak>=3,n===8,right>=5&&wrong===0];if(touched)missions(S.querySelector('.missions'),M,true);
    var s=el('svg',{viewBox:'0 0 360 200',role:'img','aria-label':'맞힌 실패 종류'});var g=S.querySelector('.g2');g.innerHTML='';g.appendChild(s);CA.forEach(function(t,i){el('rect',{x:16+(i%4)*86,y:20+Math.floor(i/4)*90,width:78,height:70,rx:8,fill:seen[i]?'#e8f6ec':'#f2f4f7',stroke:seen[i]?C.green:'#d5dbe2'},s);ktxt(s,55+(i%4)*86,60+Math.floor(i/4)*90,'f'+(i+1)+(seen[i]?' ✓':''),{size:14,anchor:'middle',fill:seen[i]?C.green:C.muted,weight:700});});
    say(S.querySelector('.talk'),[['doctor','e10','박사','큰 것부터: 구조 → 빛 → 천 → 고정값 → 강도·화풍.'],['haru','e10','조수','연속 '+streak+'개, 맞힌 종류 '+n+' / 8이에요.'],['x2','e09','평가단 X2',wrong?'틀린 건 6부 실패 카드에서 다시 보세요.':'아직 틀린 게 없어요!'],['jupanbot','e16','주판봇',streak>=3?'연속 정답! 데이터가 그렇게 말하고 있어요!':'다음 문제는 제가 맞힙니다!']]);}
  next();upd();}

/* ===================== 퀴즈·지식 색인·꾸러미 ===================== */
function quiz(q){var ans=+q.getAttribute('data-ans');var fb=q.querySelector('.fb');var OK=q.querySelector('.qok'),NO=q.querySelector('.qno');q.querySelectorAll('.opts button').forEach(function(b,i){b.addEventListener('click',function(){q.querySelectorAll('.opts button').forEach(function(x){x.classList.remove('ok','no');});b.classList.add(i===ans?'ok':'no');fb.innerHTML=i===ans?'⭕ '+OK.innerHTML:'❌ '+NO.innerHTML;});});}
function kg(){var raw=document.getElementById('kg-raw');var mount=document.getElementById('kg-mount');if(!raw||!mount)return;var K=JSON.parse(raw.textContent);
  mount.innerHTML='<input class="kg-search" type="search"><div class="kg-list"></div>';var list=mount.querySelector('.kg-list'),inp=mount.querySelector('input');inp.placeholder='개념 찾기 (예: 그림자, 주름, 강도)';inp.setAttribute('aria-label','지식 색인 검색');
  var TY={Concept:'개념',Method:'방법',Analogy:'비유',Application:'쓰임',OpenQuestion:'열린 질문',Topic:'주제'};K.nodes.forEach(function(n){n.label=n.label||{ko:n.id,en:''};n.definition=n.definition||{ko:n.type==='Topic'?'이 페이지 개념들이 속한 분야 주제':''};if(n.page&&!/\.html$/.test(n.page))n.page=n.page.replace(/^practice_index$/,'practice/index')+'.html';});var pre=document.body.getAttribute('data-root')||'';
  function render(){var qv=inp.value.trim().toLowerCase();list.innerHTML=K.nodes.filter(function(n){return !qv||(n.label.ko+' '+n.label.en+' '+n.definition.ko).toLowerCase().indexOf(qv)>=0;}).map(function(n){
    var nb=K.edges.filter(function(e){return e.s===n.id||e.o===n.id;}).map(function(e){var o=e.s===n.id?e.o:e.s;var m=K.nodes.filter(function(x){return x.id===o;})[0];return m?m.label.ko:'';}).filter(Boolean);
    return '<div class="kg-item"><span class="t">'+(TY[n.type]||n.type)+'</span><b>'+n.label.ko+'</b><span class="muted">'+n.label.en+'</span><div>'+n.definition.ko+'</div>'+(nb.length?'<div class="muted" style="font-size:12.5px">이웃: '+nb.join(', ')+'</div>':'')+'<a href="'+pre+n.page+n.anchor+'">설명 보러 가기 →</a></div>';}).join('');}
  inp.addEventListener('input',render);render();var ex=document.getElementById('export-mount');if(!ex)return;
  ex.innerHTML='<div class="exp-btns"><button class="btn" data-x="json">kg.json</button><button class="btn" data-x="ld">JSON-LD</button><button class="btn" data-x="ttl">Turtle (Protégé)</button><button class="btn" data-x="csv">CSV (Neo4j·Gephi)</button><button class="btn" data-x="bib">BibTeX</button><button class="btn" data-x="ris">RIS</button></div>';
  function dl(name,text,type){var b=new Blob([text],{type:type||'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},500);}
  var base=K.page;var refs=JSON.parse((document.getElementById('refs-csl')||{textContent:'[]'}).textContent);
  ex.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){var x=b.getAttribute('data-x');
    if(x==='json')dl(base+'.kg.json',JSON.stringify(K,null,2),'application/json');
    if(x==='ld')dl(base+'.jsonld',document.getElementById('kg-ld').textContent,'application/ld+json');
    if(x==='ttl'){var t='@prefix lab: <urn:lab:> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\n\n';K.nodes.forEach(function(n){t+='<urn:'+n.id+'> a lab:'+n.type+' ;\n  skos:prefLabel "'+n.label.ko+'"@ko , "'+n.label.en+'"@en ;\n  rdfs:comment "'+n.definition.ko.replace(/"/g,'\\"')+'"@ko .\n\n';});K.edges.forEach(function(e){t+='<urn:'+e.s+'> lab:'+e.p+' <urn:'+e.o+'> .\n';});dl(base+'.ttl',t,'text/turtle');}
    if(x==='csv'){var c='id,type,label_ko,label_en,anchor\n'+K.nodes.map(function(n){return [n.id,n.type,n.label.ko,n.label.en,n.page+n.anchor].map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(',');}).join('\n');c+='\n\nsource,relation,target\n'+K.edges.map(function(e){return [e.s,e.p,e.o].join(',');}).join('\n');dl(base+'.csv',c,'text/csv');}
    if(x==='bib')dl(base+'.bib',refs.map(function(r){return '@misc{'+r.id+',\n  title = {'+r.title+'},\n  author = {'+r.author+'},\n  note = {'+(r.note||'')+'},\n  year = {'+r.year+'}\n}';}).join('\n\n'));
    if(x==='ris')dl(base+'.ris',refs.map(function(r){return 'TY  - GEN\nTI  - '+r.title+'\nAU  - '+r.author+'\nPY  - '+r.year+'\nN1  - '+(r.note||'')+'\nER  - ';}).join('\n'));});});}

function boot(){document.querySelectorAll('[data-panel]').forEach(function(h){var k=h.getAttribute('data-panel');if(P[k]){try{P[k](h);}catch(e){h.textContent='실험을 불러오지 못했습니다.';if(window.console)console.warn(k,e);}}});
  document.querySelectorAll('.quiz').forEach(quiz);kg();practice();
  document.querySelectorAll('.copybtn').forEach(function(b){b.addEventListener('click',function(){var t=b.parentNode.querySelector('pre').textContent;var hint=b.parentNode.querySelector('.hint');if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){hint.textContent='복사했습니다.';},function(){hint.textContent='복사가 막혔습니다. 직접 선택해 복사하세요.';});else hint.textContent='직접 선택해 복사하세요.';});});
  document.querySelectorAll('.trycheck').forEach(function(p){var bs=p.querySelectorAll('input[type=checkbox]'),ro=p.querySelector('.readout');function u(){var n=[].filter.call(bs,function(x){return x.checked;}).length;ro.innerHTML='맞는 항목 <b>'+n+' / '+bs.length+'</b>'+(n===bs.length?' <span class="alert">모두 통과! 이 그림은 써도 됩니다.</span>':n?' — 체크하지 못한 항목이 고칠 곳입니다. 해당 단계를 다시 보세요.':'');bs.forEach(function(x){x.closest('li').classList.toggle('done',x.checked);});}bs.forEach(function(x){x.addEventListener('change',u);});u();});
  var pr=document.getElementById('prog');if(pr)window.addEventListener('scroll',function(){var d=document.documentElement;pr.style.width=(100*d.scrollTop/Math.max(1,d.scrollHeight-d.clientHeight))+'%';},{passive:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
