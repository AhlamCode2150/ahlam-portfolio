function __boot(){
const root=document.documentElement;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap=!!(window.gsap&&window.ScrollTrigger);
const anim=hasGsap&&!reduce;
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const DPR=Math.min(devicePixelRatio||1,2);
const mobile=innerWidth<760;
root.dataset.surface='night';

/* ================= POINTILLIST FIELD ================= */
const fc=$('#field'),fx=fc.getContext('2d');
const FD=Math.min(devicePixelRatio||1,1.25);
let FW=0,FH=0,img,buf;
const BG=0;let sceneCanvas=null;
const SW=480,SH=300;
const FLW=[];const mobileN=(a,b)=>mobile?a:b;
function paintScene(){
  const c=document.createElement('canvas');c.width=SW;c.height=SH;const g=c.getContext('2d');
  const HZ=SH*.46;
  const sky=g.createLinearGradient(0,0,0,HZ);
  sky.addColorStop(0,'#231d47');sky.addColorStop(.4,'#7a5ea3');sky.addColorStop(.78,'#efaab8');sky.addColorStop(1,'#ffd6ae');
  g.fillStyle=sky;g.fillRect(0,0,SW,HZ+4);
  let gl=g.createRadialGradient(SW*.68,HZ*.9,0,SW*.68,HZ*.9,SH*.4);gl.addColorStop(0,'rgba(255,236,200,.85)');gl.addColorStop(1,'rgba(255,200,190,0)');g.fillStyle=gl;g.fillRect(0,0,SW,SH);
  g.fillStyle='#fff3dc';g.beginPath();g.arc(SW*.68,HZ*.88,SH*.05,0,7);g.fill();
  for(let i=0;i<55;i++){g.fillStyle=`rgba(255,250,240,${.3+Math.random()*.7})`;g.fillRect(Math.random()*SW,Math.random()*HZ*.4,1,1)}
  const cloud=(x,y,w,a)=>{g.fillStyle=`rgba(255,214,226,${a})`;for(let k=0;k<5;k++){g.beginPath();g.ellipse(x+(k-2)*w*.22,y-Math.sin(k/4*Math.PI)*w*.12,w*.2,w*.1,0,0,7);g.fill()}};
  cloud(SW*.2,HZ*.55,90,.35);cloud(SW*.45,HZ*.35,70,.25);cloud(SW*.85,HZ*.5,80,.3);
  const ridge=(base,amp,f,col,seed)=>{g.fillStyle=col;g.beginPath();g.moveTo(0,SH);for(let x=0;x<=SW;x+=4){g.lineTo(x,base+Math.sin(x*f+seed)*amp+Math.sin(x*f*2.3+seed)*amp*.3)}g.lineTo(SW,SH);g.fill()};
  ridge(HZ-6,8,.016,'#9a89b8',2);ridge(HZ,6,.025,'#86a98a',5);
  const fld=g.createLinearGradient(0,HZ,0,SH);fld.addColorStop(0,'#9a86a8');fld.addColorStop(.18,'#5d7f5f');fld.addColorStop(1,'#1e3826');
  g.fillStyle=fld;g.fillRect(0,HZ+4,SW,SH-HZ);
  const cols=['#ffc4d8','#ff98bd','#ffffff','#fff0f5','#ffe07a','#d6b3ff','#ffb08a','#ff7fa8'];
  for(let i=0;i<3200;i++){const u=Math.pow(Math.random(),1.4);const y=HZ+4+u*(SH-HZ-4);g.fillStyle=cols[(Math.random()*cols.length)|0];const s=.7+u*1.6;g.fillRect(Math.random()*SW,y,s,s)}
  FLW.length=0;for(let i=0;i<mobileN(150,240);i++){const u=Math.pow(Math.random(),.85);const y=HZ+8+u*(SH-HZ-14);FLW.push({x:Math.random()*SW*1.04-SW*.02,y,s:3+Math.pow(u,1.5)*30,c:cols[(Math.random()*cols.length)|0],rot:Math.random()*6.28,ctr:Math.random()<.6?[255,210,63]:[245,158,59],petals:Math.random()<.25?6:5})}
  for(let i=0;i<mobileN(4,7);i++){FLW.push({x:SW*(i+.5)/mobileN(4,7)+(Math.random()-.5)*30,y:SH*(.86+Math.random()*.1),s:36+Math.random()*16,c:['#ffc4d8','#ffffff','#ff98bd','#d6b3ff','#fff0f5','#ffb08a','#ffe07a'][i%7],rot:Math.random()*6.28,ctr:[255,210,63],petals:5})}
  FLW.sort((p,q)=>p.y-q.y);
  sceneCanvas=c;return g.getImageData(0,0,SW,SH).data;
}
const N=mobile?32000:96000;
const hx=new Float32Array(N),hy=new Float32Array(N),cr=new Uint8Array(N),cg=new Uint8Array(N),cb=new Uint8Array(N),
  dl=new Float32Array(N),ph=new Float32Array(N),fr=new Float32Array(N),zz=new Float32Array(N),ca=new Float32Array(N),crad=new Float32Array(N),spin=new Float32Array(N),
  sz=new Uint8Array(N),dp=new Float32Array(N),mox=new Float32Array(N),moy=new Float32Array(N),sp=new Uint8Array(N);
(function build(){
  const d=paintScene();
  const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
  const weights=FLW.map(f=>Math.max(4,f.s*f.s));const wsum=weights.reduce((a,b)=>a+b,0);
  const NF=Math.round(N*.45),NB=N-NF;let i=0;
  const common=(x,y,dpth)=>{hx[i]=x;hy[i]=y;dl[i]=Math.random()*.55+Math.hypot(x-.5,y-.46)*.95;ph[i]=Math.random()*6.28;fr[i]=.4+Math.random()*.9;zz[i]=.35+Math.random()*1.3;
    ca[i]=Math.random()*6.28;crad[i]=Math.sqrt(Math.random());spin[i]=(.25+Math.random()*.6)*(Math.random()<.5?-1:1);dp[i]=dpth;sp[i]=0};
  const depthAt=y=>y<.46?.12+y*.4+Math.random()*.05:.32+Math.pow((y-.46)/.54,1.15)*1.1;
  for(;i<NB;i++){const x=Math.random(),y=Math.random();const o=((y*SH|0)*SW+(x*SW|0))*4;const b=.85+Math.random()*.3;
    cr[i]=Math.min(255,d[o]*b);cg[i]=Math.min(255,d[o+1]*b);cb[i]=Math.min(255,d[o+2]*b);common(x,y,depthAt(y)+Math.random()*.05);
    if(Math.random()<.02){dp[i]=1.45+Math.random()*.4;sp[i]=1;cr[i]=255;cg[i]=226;cb[i]=236}else if(Math.random()<.04)sp[i]=1;sz[i]=Math.random()<.6?3:2}
  for(let k=0;k<FLW.length&&i<N;k++){const f=FLW[k];const cnt=Math.max(1,Math.round(weights[k]/wsum*NF));const pc=hex(f.c);const fd=depthAt(f.y/SH);
    for(let j=0;j<cnt&&i<N;j++,i++){let ox,oy,col;const q=Math.random();
      if(f.s>8&&q<.08){const t=Math.random();ox=Math.sin(t*2)*f.s*.15;oy=f.s*.35+t*f.s*1.6;col=[70+Math.random()*30,130+Math.random()*30,80];}
      else if(q<.24){const r=Math.sqrt(Math.random())*f.s*.22,th=Math.random()*6.28;ox=Math.cos(th)*r;oy=Math.sin(th)*r*.75;col=f.ctr;}
      else{const p=(Math.random()*f.petals)|0,an=p/f.petals*6.283+f.rot,r=Math.sqrt(Math.random()),th=Math.random()*6.28;
        const lx=Math.cos(th)*r*f.s*.27,ly=Math.sin(th)*r*f.s*.17;ox=Math.cos(an)*(f.s*.5+lx)-Math.sin(an)*ly;oy=(Math.sin(an)*(f.s*.5+lx)+Math.cos(an)*ly)*.75;
        const sh=.82+.18*r;col=[pc[0]*sh,pc[1]*sh,pc[2]*sh];}
      const x=(f.x+ox)/SW,y=(f.y+oy)/SH;const b=.92+Math.random()*.16;
      cr[i]=Math.min(255,col[0]*b);cg[i]=Math.min(255,col[1]*b);cb[i]=Math.min(255,col[2]*b);common(x,y,fd);sz[i]=f.s>12?3:2}}
  for(;i<N;i++){hx[i]=Math.random();hy[i]=Math.random()*.5;cr[i]=cg[i]=cb[i]=240;common(hx[i],hy[i],.15);sz[i]=2}
})();
const toneEl=document.getElementById('tone');const F={form:anim?0:1,warp:0,mx:-1e5,my:-1e5,px:0,py:0,tx:0,ty:0};
function sizeField(){FW=fc.width=Math.max(1,Math.round(fc.offsetWidth*FD));FH=fc.height=Math.max(1,Math.round(fc.offsetHeight*FD));img=fx.createImageData(FW,FH);buf=new Uint32Array(img.data.buffer)}
sizeField();
function plot(x,y,s,c){const ix=x|0,iy=y|0;if(ix<0||iy<0||ix>=FW-s||iy>=FH-s)return;let o=iy*FW+ix;for(let a=0;a<s;a++){for(let b=0;b<s;b++)buf[o+b]=c;o+=FW}}
function drawField(t){
  buf.fill(BG);
  const W=FW,H=FH,sw=Math.max(W,H*1.6)*1.06,sh=sw/1.6,ox=(W-sw)/2,oy=(H-sh)/2,cx=W/2,cy=H*.44;
  const formT=F.form*2.9,w=F.warp,fade=Math.pow(1-w,1.4),R=160*FD,R2=R*R,cl=Math.min(W,H)*.07;
  const lim=F.form<=0?120:N;F.px+=(F.tx-F.px)*.05;F.py+=(F.ty-F.py)*.05;const yaw=F.px*.27+Math.sin(t*.17)*.07,pit=-F.py*.16+Math.cos(t*.13)*.04,cyw=Math.cos(yaw),syw=Math.sin(yaw),cpt=Math.cos(pit),spt=Math.sin(pit),D=1100*FD,ZP=420*FD,ZS=720*FD;let ssz=2;
  for(let i=0;i<lim;i++){
    let e=1;
    if(F.form<1){if(F.form<=0)e=0;else{const q=(formT-dl[i])/1.4;e=q<=0?0:q>=1?1:1-Math.pow(1-q,4)}}
    const a=ca[i]+t*spin[i],rr=crad[i]*cl*(1+.18*Math.sin(t*1.7+ph[i]));
    const kx=cx+Math.cos(a)*rr,ky=cy+Math.sin(a)*rr*.82;
    let x=kx+(ox+hx[i]*sw-kx)*e,y=ky+(oy+hy[i]*sh-ky)*e;
    if(e>0&&e<1){const s=Math.sin(e*Math.PI)*90*FD*crad[i];x-=Math.sin(a)*s;y+=Math.cos(a)*s}
    x+=Math.sin(t*fr[i]+ph[i])*1.4*FD*e;y+=Math.cos(t*fr[i]*.8+ph[i])*1.4*FD*e;
    {const z=(1-dp[i])*ZS,m=(D+z)/D,X0=(x-cx)*m,Y0=(y-cy)*m,zr=z-ZP;const x1=X0*cyw-zr*syw,z1=X0*syw+zr*cyw;const y1=Y0*cpt-z1*spt,z2=Y0*spt+z1*cpt;const sc=D/(D+z2+ZP);
     x+=(cx+x1*sc-x)*e;y+=(cy+y1*sc-y)*e;ssz=sc>1.6?4:sc>1.12?sz[i]+1:sc<.78?2:sz[i];var dsc=sc}
    if(e>.95&&w<.05){const dx=x-F.mx,dy=y-F.my,dd=dx*dx+dy*dy;let tx=0,ty=0;if(dd<R2){const ds=Math.sqrt(dd)||1,p=1-ds/R;tx=dx/ds*p*p*70*FD;ty=dy/ds*p*p*70*FD}mox[i]+=(tx-mox[i])*.1;moy[i]+=(ty-moy[i])*.1;x+=mox[i];y+=moy[i]}
    let br=(sp[i]?.7+.7*Math.max(0,Math.sin(t*2.6+ph[i])):1)*Math.min(1.35,.92+.3*dsc);
    let r=cr[i],g=cg[i],b=cb[i];
    if(e<1){r=r*e+244*(1-e);g=g*e+241*(1-e);b=b*e+232*(1-e)}
    if(w>0){
      br*=fade*(1+w*1.2);
      const k=1+w*w*zz[i]*4.5,X=cx+(x-cx)*k,Y=cy+(y-cy)*k,L=1+w*zz[i]*.6,X2=cx+(x-cx)*k*L,Y2=cy+(y-cy)*k*L;
      const c=(255<<24)|(Math.min(255,b*br)<<16)|(Math.min(255,g*br)<<8)|Math.min(255,r*br);
      const n=Math.min(18,((Math.abs(X2-X)+Math.abs(Y2-Y))/1.6)|0)+1;
      for(let s=0;s<n;s++)plot(X+(X2-X)*s/n,Y+(Y2-Y)*s/n,sz[i]-1||1,c);
    }else{
      const c=(255<<24)|(Math.min(255,b*br)<<16)|(Math.min(255,g*br)<<8)|Math.min(255,r*br);
      plot(x,y,ssz,c);
    }
  }
  fx.putImageData(img,0,0);
}
fc.parentElement.addEventListener('pointermove',e=>{const r=fc.getBoundingClientRect();F.mx=(e.clientX-r.left)*FD;F.my=(e.clientY-r.top)*FD;F.tx=(e.clientX-r.left)/r.width-.5;F.ty=(e.clientY-r.top)/r.height-.5});
fc.parentElement.addEventListener('pointerleave',()=>{F.mx=F.my=-1e5});

/* ================= MARBLE ================= */
const mc=$('#marble'),mx=mc.getContext('2d');let MW=0,MH=0;
const pal=['#f4f1e8','#f4f1e8','#efb08a','#c48aa6','#7fa38d','#8d86c9','#dcdbd0'];
const marb=[];const MN=mobile?420:900;
function sizeMarble(){MW=mc.width=mc.offsetWidth*DPR;MH=mc.height=mc.offsetHeight*DPR;mx.fillStyle='#07070a';mx.fillRect(0,0,MW,MH)}
function spawn(p){p.x=Math.random()*MW;p.y=Math.random()*MH;p.c=pal[(Math.random()*pal.length)|0];p.l=80+Math.random()*260;return p}
function stepMarble(t){
  mx.fillStyle='rgba(7,7,10,.018)';mx.fillRect(0,0,MW,MH);
  mx.lineWidth=1.1*DPR;mx.globalAlpha=.55;
  for(const p of marb){
    const x=p.x/DPR,y=p.y/DPR;
    const a=Math.sin(x*.0021+t*.07)*1.7+Math.sin(y*.0028-t*.05)*1.6+Math.sin((x*.0012-y*.0016)+t*.03)*2.2;
    const nx=p.x+Math.cos(a)*1.5*DPR,ny=p.y+Math.sin(a)*1.5*DPR;
    mx.strokeStyle=p.c;mx.beginPath();mx.moveTo(p.x,p.y);mx.lineTo(nx,ny);mx.stroke();
    p.x=nx;p.y=ny;if(--p.l<0||nx<0||ny<0||nx>MW||ny>MH)spawn(p);
  }
  mx.globalAlpha=1;
}
function warmMarble(){marb.length=0;for(let i=0;i<MN;i++)marb.push(spawn({}));for(let i=0;i<90;i++)stepMarble(i*.05)}
sizeMarble();warmMarble();

/* ================= CARD ART ================= */
const arts=$$('[data-art]').map(cv=>{const a={cv,ctx:cv.getContext('2d'),kind:cv.dataset.art,vis:false,mx:.5,my:.5,hover:0,items:[],t0:0};
  const host=cv.closest('.card');
  host.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();a.mx=(e.clientX-r.left)/r.width;a.my=(e.clientY-r.top)/r.height;a.hover=1});
  host.addEventListener('pointerleave',()=>{a.hover=0});
  return a});
function sizeArts(){arts.forEach(a=>{a.W=a.cv.width=a.cv.offsetWidth*DPR;a.H=a.cv.height=a.cv.offsetHeight*DPR;a.ctx.fillStyle='#121210';a.ctx.fillRect(0,0,a.W,a.H);a.items=[]})}
sizeArts();
const io=new IntersectionObserver(es=>es.forEach(e=>{const a=arts.find(x=>x.cv===e.target);if(a)a.vis=e.isIntersecting}),{rootMargin:'100px'});
arts.forEach(a=>io.observe(a.cv));
function drawArt(a,t){
  const g=a.ctx,W=a.W,H=a.H;if(!W)return;
  if(a.kind==='ripple'){
    g.fillStyle='#121210';g.fillRect(0,0,W,H);
    if(t-a.t0>(a.hover?.45:1.4)){a.t0=t;a.items.push({x:a.hover?a.mx:.5+(Math.random()-.5)*.2,y:a.hover?a.my:.56+(Math.random()-.5)*.08,b:t,c:Math.random()<.3})}
    a.items=a.items.filter(r=>t-r.b<4.2);
    for(const r of a.items){const k=(t-r.b)/4.2,e=1-Math.pow(1-k,2.2);const rx=e*W*.5;
      for(let j=0;j<3;j++){const rr=rx*(1-j*.18);if(rr<=0)continue;g.strokeStyle=r.c&&j===0?`rgba(143,190,170,${(1-k)*.9})`:`rgba(244,241,232,${(1-k)*(.7-j*.18)})`;g.lineWidth=(1.2-j*.3)*DPR;g.beginPath();g.ellipse(r.x*W,r.y*H,rr,rr*.3,0,0,7);g.stroke()}}
    const dy=((t*.6)%1);g.fillStyle=`rgba(244,241,232,${1-dy})`;g.beginPath();g.arc(W*.5,H*(.08+dy*.45),2.2*DPR,0,7);g.fill();
  }else if(a.kind==='voice'){
    g.fillStyle='#121210';g.fillRect(0,0,W,H);
    const amp=H*(.12+.2*(a.hover?1-Math.abs(a.my-.5)*1.4:.55+.45*Math.sin(t*1.3)));
    const cxp=a.hover?a.mx:.5;
    for(let L=0;L<7;L++){
      g.beginPath();for(let x=0;x<=W;x+=3*DPR){const u=x/W;const env=Math.exp(-Math.pow((u-cxp)/.2,2));
        const y=H*.52+Math.sin(u*22+t*(2.2+L*.3)+L*.8)*Math.sin(u*7-t*1.1+L)*amp*env*(1-L*.1);x?g.lineTo(x,y):g.moveTo(x,y)}
      g.strokeStyle=L===3?'rgba(239,176,138,.95)':`rgba(244,241,232,${.75-L*.08})`;g.lineWidth=(L===3?1.6:1)*DPR;g.stroke();
    }
  }else if(a.kind==='grid'){
    g.fillStyle='#121210';g.fillRect(0,0,W,H);
    const cols=24,rows=16,px=a.hover?a.mx:.5+.32*Math.sin(t*.5),py=a.hover?a.my:.5+.28*Math.sin(t*.7+1);
    for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const u=(i+.5)/cols,v=(j+.5)/rows;const d=Math.hypot((u-px)*1.45,v-py);
      const wv=Math.sin(d*26-t*4)*.5+.5,k=Math.max(0,1-d*2.2);const s=(.8+wv*2.6*k+k*1.5)*DPR;
      g.fillStyle=k>.55?'rgba(196,138,166,1)':`rgba(244,241,232,${.25+.75*k})`;g.beginPath();g.arc(u*W,v*H,s,0,7);g.fill()}
  }else{
    if(!a.items.length)for(let i=0;i<260;i++)a.items.push({x:Math.random()*W,y:Math.random()*H,l:Math.random()*200});
    g.fillStyle='rgba(18,18,16,.05)';g.fillRect(0,0,W,H);g.lineWidth=1*DPR;
    for(const p of a.items){let an=Math.sin(p.x/W*5+t*.3)*2+Math.cos(p.y/H*6-t*.25)*2;
      if(a.hover){const dx=a.mx*W-p.x,dy=a.my*H-p.y;an=an*.4+Math.atan2(dy,dx)+1.2}
      const nx=p.x+Math.cos(an)*1.6*DPR,ny=p.y+Math.sin(an)*1.6*DPR;g.strokeStyle=p.l%3<1?'rgba(141,134,201,.9)':'rgba(244,241,232,.7)';g.beginPath();g.moveTo(p.x,p.y);g.lineTo(nx,ny);g.stroke();
      p.x=nx;p.y=ny;if(--p.l<0||nx<0||ny<0||nx>W||ny>H){p.x=Math.random()*W;p.y=Math.random()*H;p.l=80+Math.random()*200}}
  }
}

/* ================= STARS (contact) ================= */
const sc=$('#stars'),sx=sc.getContext('2d');let SWd=0,SHd=0;const st=[];
function sizeStars(){SWd=sc.width=sc.offsetWidth*DPR;SHd=sc.height=sc.offsetHeight*DPR;st.length=0;const n=mobile?120:260;for(let i=0;i<n;i++)st.push({x:Math.random(),y:Math.random(),r:Math.random()*1.3+.3,p:Math.random()*6.28,z:Math.random()})}
sizeStars();let sMx=0,sMy=0;
$('#correspondence').addEventListener('pointermove',e=>{sMx=e.clientX/innerWidth-.5;sMy=e.clientY/innerHeight-.5});
function drawStars(t){sx.clearRect(0,0,SWd,SHd);for(const s of st){const a=.25+.75*(Math.sin(t*1.2+s.p)*.5+.5);sx.fillStyle=`rgba(244,241,232,${a*(.4+s.z*.6)})`;sx.beginPath();sx.arc((s.x-sMx*.03*s.z)*SWd,(s.y-sMy*.03*s.z)*SHd,s.r*DPR,0,7);sx.fill()}}

/* ================= ART SCENE ================= */
const sceneEl=$('#scene');
const SC={p:0,mx:0,my:0,vx:0,vy:0,spin:0};
function painterly(cv,draw){
  const W=cv.width=Math.round(cv.offsetWidth*Math.min(DPR,1.25)),H=cv.height=Math.round(cv.offsetHeight*Math.min(DPR,1.25));
  const g=cv.getContext('2d');draw(g,W,H);
  const d=g.getImageData(0,0,W,H).data;const n=mobile?5000:11000;g.lineCap='round';
  for(let i=0;i<n;i++){const x=Math.random()*W,y=Math.random()*H,o=((y|0)*W+(x|0))*4;const j=()=>(Math.random()-.5)*26;
    g.strokeStyle=`rgba(${d[o]+j()|0},${d[o+1]+j()|0},${d[o+2]+j()|0},.55)`;g.lineWidth=(1.5+Math.random()*4.5)*W/1400;
    const a=Math.sin(x*.004)+Math.cos(y*.005)*1.3,L=(8+Math.random()*22)*W/1400;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+Math.cos(a)*L*.5+j()*.2,y+Math.sin(a)*L*.5,x+Math.cos(a+.4)*L,y+Math.sin(a+.4)*L);g.stroke()}
  for(let i=0;i<(mobile?20000:60000);i++){g.fillStyle=`rgba(${Math.random()<.5?0:255},${Math.random()<.5?0:255},${Math.random()<.5?0:255},.025)`;g.fillRect(Math.random()*W,Math.random()*H,1.5,1.5)}
}
function paintA(g,W,H){
  let gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#2a1f4a');gr.addColorStop(.45,'#8a5f9e');gr.addColorStop(.7,'#f0a9b4');gr.addColorStop(1,'#3a2a3c');g.fillStyle=gr;g.fillRect(0,0,W,H);
  let s=g.createRadialGradient(W*.62,H*.58,0,W*.62,H*.58,H*.6);s.addColorStop(0,'rgba(255,230,190,.95)');s.addColorStop(.25,'rgba(255,200,170,.5)');s.addColorStop(1,'rgba(255,180,180,0)');g.fillStyle=s;g.fillRect(0,0,W,H);
  g.fillStyle='#3d2f52';g.beginPath();g.moveTo(0,H);for(let x=0;x<=W;x+=10)g.lineTo(x,H*.66+Math.sin(x*.004)*H*.04+Math.sin(x*.011)*H*.015);g.lineTo(W,H);g.fill();
  g.fillStyle='#1f2a26';g.beginPath();g.moveTo(0,H);for(let x=0;x<=W;x+=10)g.lineTo(x,H*.76+Math.sin(x*.006+2)*H*.03);g.lineTo(W,H);g.fill();
  const cyp=(x,h,w)=>{g.fillStyle='#14201b';g.beginPath();g.moveTo(x,H*.8-h);g.bezierCurveTo(x+w,H*.8-h*.6,x+w*.8,H*.8,x+w*.3,H*.82);g.lineTo(x-w*.3,H*.82);g.bezierCurveTo(x-w*.8,H*.8,x-w,H*.8-h*.6,x,H*.8-h);g.fill()};
  [[.05,.55,.03],[.11,.42,.025],[.9,.5,.03],[.96,.38,.022]].forEach(([x,h,w])=>cyp(W*x,H*h,W*w));
  const cols=['#ffc4d8','#ff98bd','#fff','#ffe07a','#d6b3ff','#ffb08a'];
  for(let i=0;i<900;i++){const y=H*(.78+Math.pow(Math.random(),.7)*.22),k=(y/H-.78)/.22;g.fillStyle=cols[(Math.random()*cols.length)|0];g.beginPath();g.arc(Math.random()*W,y,(1+k*7)*W/1400,0,7);g.fill()}
}
function paintB(g,W,H){
  let gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#0e1630');gr.addColorStop(1,'#1c1a2e');g.fillStyle=gr;g.fillRect(0,0,W,H);
  const ww=W*.24,wh=H*.62,wx=W/2-ww/2,wy=H*.12;
  g.fillStyle='#2b2850';g.beginPath();g.moveTo(wx-W*.02,wy+wh+H*.02);g.lineTo(wx-W*.02,wy+ww*.5);g.arc(W/2,wy+ww*.5,ww/2+W*.02,Math.PI,0);g.lineTo(wx+ww+W*.02,wy+wh+H*.02);g.fill();
  let sky=g.createLinearGradient(0,wy,0,wy+wh);sky.addColorStop(0,'#24407a');sky.addColorStop(1,'#7a8ec8');g.fillStyle=sky;g.beginPath();g.moveTo(wx,wy+wh);g.lineTo(wx,wy+ww*.5);g.arc(W/2,wy+ww*.5,ww/2,Math.PI,0);g.lineTo(wx+ww,wy+wh);g.fill();
  g.fillStyle='#f6f0dc';g.beginPath();g.arc(W/2+ww*.12,wy+ww*.42,ww*.11,0,7);g.fill();
  for(let i=0;i<70;i++){g.fillStyle='rgba(255,255,240,.8)';g.fillRect(wx+Math.random()*ww,wy+ww*.2+Math.random()*wh*.7,1.5,1.5)}
  g.strokeStyle='#2b2850';g.lineWidth=W*.006;g.beginPath();g.moveTo(W/2,wy);g.lineTo(W/2,wy+wh);g.moveTo(wx,wy+wh*.55);g.lineTo(wx+ww,wy+wh*.55);g.stroke();
  let lg=g.createRadialGradient(W/2,H*.95,0,W/2,H*.95,W*.4);lg.addColorStop(0,'rgba(140,160,230,.35)');lg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=lg;g.fillRect(0,0,W,H);
  g.fillStyle='#120f20';g.fillRect(0,H*.82,W,H*.18);
}
function paintC(g,W,H){
  let gr=g.createLinearGradient(0,0,W,H);gr.addColorStop(0,'#3a1f12');gr.addColorStop(.5,'#7a4420');gr.addColorStop(1,'#2a160c');g.fillStyle=gr;g.fillRect(0,0,W,H);
  let lamp=g.createRadialGradient(W*.5,H*.4,0,W*.5,H*.4,W*.45);lamp.addColorStop(0,'rgba(255,210,140,.75)');lamp.addColorStop(1,'rgba(255,170,90,0)');g.fillStyle=lamp;g.fillRect(0,0,W,H);
  const shelf=(x0,x1)=>{for(let r=0;r<5;r++){const y=H*(.12+r*.17);g.fillStyle='#24120a';g.fillRect(x0,y+H*.13,x1-x0,H*.02);let x=x0;while(x<x1-8){const bw=W*(.008+Math.random()*.012),bh=H*(.08+Math.random()*.05);g.fillStyle=['#6b2a1e','#2f4a3a','#8a6a2a','#3b2a52','#a0522d','#1f3550'][(Math.random()*6)|0];g.fillRect(x,y+H*.13-bh,bw-1,bh);x+=bw}}};
  shelf(0,W*.26);shelf(W*.74,W);
  g.fillStyle='#1c0e07';g.fillRect(0,H*.86,W,H*.14);
}
const oc=$('#obj'),ox=oc.getContext('2d');let OW=0,OH=0;
function sizeObj(){OW=oc.width=oc.offsetWidth*DPR;OH=oc.height=oc.offsetHeight*DPR}
const RP3=[];(function buildRose(){const layers=6;for(let L=0;L<layers;L++){const np=5+L%2,len=.35+L*.13,cup=.55-L*.06,wid=.18+L*.03;
  for(let i=0;i<np;i++){const a0=i/np*6.283+L*.55;const n=mobile?140:260;
    for(let k=0;k<n;k++){const s=Math.sqrt(Math.random()),w=(Math.random()*2-1);const rad=s*len,ht=cup*s*s-L*.03,across=w*wid*Math.sin(Math.PI*Math.min(1,s*1.05));
      const x=Math.cos(a0)*rad-Math.sin(a0)*across,z=Math.sin(a0)*rad+Math.cos(a0)*across;
      const t=L/(layers-1);const col=[255,150+t*60+s*20,190+t*25+s*10];RP3.push({x,y:ht,z,c:col})}}}
  for(let k=0;k<(mobile?160:320);k++){const r=Math.sqrt(Math.random())*.12,a=Math.random()*6.283;RP3.push({x:Math.cos(a)*r,y:.02+Math.random()*.05,z:Math.sin(a)*r,c:[255,214,90]})}
  for(let k=0;k<(mobile?120:240);k++){const t=Math.random();RP3.push({x:Math.sin(t*3)*.03,y:-.05-t*.9,z:0,c:[110,170,120]})}})();
sceneEl.addEventListener('pointermove',e=>{SC.mx=e.clientX/innerWidth-.5;SC.my=e.clientY/innerHeight-.5});
function drawObj(t,dt){
  SC.vx+=(SC.mx-SC.vx)*.05;SC.vy+=(SC.my-SC.vy)*.05;SC.spin*=.95;
  ox.clearRect(0,0,OW,OH);
  const p=SC.p,cx=OW*(.5+.2*Math.sin(p*Math.PI*2.2)+SC.vx*.05),cy=OH*(.42-.04*Math.cos(p*Math.PI*3)+Math.sin(t*.8)*.012),S=Math.min(OW,OH)*(.42+.12*Math.sin(p*Math.PI));
  const yaw=t*.4+p*6+SC.vx*.8+SC.spin,pit=-.55+SC.vy*.5+Math.sin(p*Math.PI*2)*.25,cyw=Math.cos(yaw),syw=Math.sin(yaw),cp=Math.cos(pit),spn=Math.sin(pit),D=3;
  for(const q of RP3){const x1=q.x*cyw+q.z*syw,z1=-q.x*syw+q.z*cyw;const y2=q.y*cp-z1*spn,z2=q.y*spn+z1*cp;const k=D/(D+z2);
    const px=cx+x1*S*k,py=cy-y2*S*k,br=.6+.5*k*k;const s=(1.2+k*1.3)*DPR;
    ox.fillStyle=`rgb(${Math.min(255,q.c[0]*br)|0},${Math.min(255,q.c[1]*br)|0},${Math.min(255,q.c[2]*br)|0})`;ox.fillRect(px-s/2,py-s/2,s,s)}
}
function sizeScene(){['#bgA','#bgB','#bgC'].forEach((id,i)=>painterly($(id),[paintA,paintB,paintC][i]));sizeObj()}
sizeScene();

/* ================= SHOTS + CODE ================= */
$$('.shots').forEach((box,bi)=>{const ims=$$('img',box);if(!ims.length)return;let k=0;ims[0].classList.add('on');let hov=false;
  box.closest('.card').addEventListener('pointerenter',()=>hov=true);box.closest('.card').addEventListener('pointerleave',()=>hov=false);
  if(ims.length>1)setInterval(()=>{if(hov&&!reduce)return;ims[k].classList.remove('on');k=(k+1)%ims.length;ims[k].classList.add('on')},3200+bi*400)});
const CODE=[['c','// lab/bloom.js — a flower, drawn in dots\n'],['k','const '],['t','petals = '],['n','5'],['t',';\n\n'],['k','function '],['f','bloom'],['t','(t) {\n  '],['k','for '],['t','(let i = '],['n','0'],['t','; i < petals; i++) {\n    '],['k','const '],['t','a = i / petals * Math.'],['f','PI'],['t',' * '],['n','2'],['t',';\n    '],['f','dot'],['t','(Math.'],['f','cos'],['t','(a) * t, Math.'],['f','sin'],['t','(a) * t);\n  }\n  '],['f','requestAnimationFrame'],['t','(bloom);\n}\n\n'],['f','bloom'],['t','('],['n','0'],['t',');  '],['c','// again, and again']];
const codeEl=$('#code');let ci=0,cj=0,html='';const esc=x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;');
function typeTick(){if(!codeEl)return;if(ci>=CODE.length){setTimeout(()=>{ci=0;cj=0;html='';typeTick()},2600);return}
  const [cls,txt]=CODE[ci];cj++;const part=txt.slice(0,cj);const cur=cls==='t'?esc(part):`<span class="${cls}">${esc(part)}</span>`;
  codeEl.innerHTML=html+cur+'<span class="cur"></span>';if(cj>=txt.length){html+=cur;ci++;cj=0}
  setTimeout(typeTick,txt[cj-1]==='\n'?120:28+Math.random()*40)}
if(reduce){codeEl.innerHTML=CODE.map(([c,t])=>c==='t'?esc(t):`<span class="${c}">${esc(t)}</span>`).join('')}else{const cio=new IntersectionObserver(es=>{if(es[0].isIntersecting){cio.disconnect();typeTick()}});cio.observe(codeEl)}

/* ================= LOOP ================= */
const vis=el=>{const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight};
const heroEl=$('#top'),frameEl=$('#frame'),contactEl=$('#correspondence');
let last=performance.now(),T=0;
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;T+=dt;
  if(vis(heroEl)){drawField(T)}
  if(vis(frameEl))stepMarble(T);
  for(const a of arts)if(a.vis)drawArt(a,T);
  if(vis(contactEl))drawStars(T);
  if(vis(sceneEl))drawObj(T,dt);
  requestAnimationFrame(loop)}
let built=false;
function start(){if(built)return;built=true;if(reduce){drawField(0);for(const a of arts)drawArt(a,1);drawStars(0);drawObj(1,0)}else requestAnimationFrame(loop)}
let rzT;addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{sizeField();sizeMarble();warmMarble();sizeArts();sizeStars();sizeScene();if(reduce)drawField(0)},150)});

/* ================= UI ================= */
const pill=$('#pill'),pillBtn=$('#pill-btn');
pillBtn.addEventListener('click',()=>{const o=pill.classList.toggle('is-open');pillBtn.setAttribute('aria-expanded',o)});
document.addEventListener('click',e=>{if(!pill.contains(e.target)){pill.classList.remove('is-open');pillBtn.setAttribute('aria-expanded','false')}});
$('#copy').addEventListener('click',e=>{const btn=e.currentTarget,txt=$('#email').textContent.trim();
  const sel=()=>{const r=document.createRange();r.selectNodeContents($('#email'));const s=getSelection();s.removeAllRanges();s.addRange(r);btn.textContent='Selected'};
  try{navigator.clipboard.writeText(txt).then(()=>{btn.textContent='Copied';setTimeout(()=>btn.textContent='Copy email',1800)},sel)}catch(_){sel()}});
const words=['HTML','CSS','JavaScript','TypeScript','Next.js','Tailwind','GSAP','Canvas','NestJS','PostgreSQL','Prisma','Redis','BullMQ','Web Push','PWA','Netlify','Claude Code'];
$$('.marquee-row').forEach((row,ri)=>{const list=ri?[...words].reverse():words;const h=list.map(w=>`<span class="w">${w}</span><span class="sep">/</span>`).join('');row.innerHTML=h+h});

(function split(node){[...node.childNodes].forEach(n=>{if(n.nodeType===3){const f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t))f.appendChild(document.createTextNode(t));else{const s=document.createElement('span');s.className='w';s.textContent=t;f.appendChild(s)}});n.replaceWith(f)}else split(n)})})($('#prologue-text'));

function splitLines(el){
  const toks=[];(function walk(n,it){[...n.childNodes].forEach(c=>{if(c.nodeType===3)c.textContent.split(/\s+/).filter(Boolean).forEach(w=>toks.push({w,it}));else if(c.tagName==='BR')toks.push({br:1});else walk(c,it||c.tagName==='I')})})(el,false);
  el.innerHTML=toks.map(t=>t.br?'<br>':`<span class="tk" style="display:inline-block">${t.it?'<i>'+t.w+'</i>':t.w}</span>`).join(' ');
  const lines=[];let top=null;$$('.tk',el).forEach(s=>{const y=s.offsetTop;if(top===null||Math.abs(y-top)>4){lines.push([]);top=y}lines[lines.length-1].push(s.innerHTML)});
  el.innerHTML=lines.map(l=>`<span class="line"><span class="line-in">${l.join(' ')}</span></span>`).join('');
  return $$('.line-in',el);
}

/* ================= no-animation path ================= */
if(!anim){
  F.form=1;$('#hero-title').style.visibility='visible';$('#hero-foot').style.display='none';
  $('#wipe').style.display='none';$$('.sc').forEach((el,i)=>{if(i)el.style.display='none'});$('#marble').style.opacity=1;$$('.prologue-text .w').forEach(w=>w.style.opacity=1);
  $('#index-in').classList.remove('hide');
  (document.fonts?document.fonts.ready:Promise.resolve()).then(start);
  return;
}

/* ================= GSAP ================= */
gsap.registerPlugin(ScrollTrigger);
let lenis=null;
if(window.Lenis){lenis=new Lenis({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}
$$('[data-scroll]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href'),el=$(id);if(!el)return;e.preventDefault();pill.classList.remove('is-open');lenis?lenis.scrollTo(el,{duration:1.8}):el.scrollIntoView({behavior:'smooth'})}));

function setSurface(s){if(root.dataset.surface===s)return;root.dataset.surface=s;gsap.to(root,{'--bg':s==='bone'?'#dcdbd0':'#07070a','--fg':s==='bone'?'#121210':'#f4f1e8',duration:.8,ease:'power2.out'});$('#index-in').classList.toggle('hide',s!=='bone')}

const chars=$$('.giant .ch');
gsap.set('.pill',{xPercent:-50,x:0,autoAlpha:0,y:20});
gsap.set(chars,{yPercent:100,opacity:0,filter:'blur(14px)'});
gsap.set('#hero-title',{visibility:'visible'});
gsap.set('.hero-sub',{opacity:0,y:20});
gsap.set(['.topbar','#hero-foot > *'],{autoAlpha:0,y:14});
gsap.set('.horizon',{yPercent:100});

document.body.classList.add('is-locked');if(lenis)lenis.stop();
let unlocked=false;const unlock=()=>{if(unlocked)return;unlocked=true;document.body.classList.remove('is-locked');if(lenis)lenis.start();ScrollTrigger.refresh()};
setTimeout(unlock,7000);
Promise.race([document.fonts?document.fonts.ready:Promise.resolve(),new Promise(r=>setTimeout(r,1500))]).then(()=>{
  start();
  const intro=gsap.timeline({delay:.2,onComplete:unlock});
  intro.to(F,{form:1,duration:3.4,ease:'none'},1.4)
    .to('.topbar',{autoAlpha:1,y:0,duration:1.2,ease:'expo.out'},3.4)
    .to('#hero-foot > *',{autoAlpha:1,y:0,duration:1.2,ease:'expo.out',stagger:.1},3.6);
  setupScroll();
});

function setupScroll(){
  const htl=gsap.timeline({scrollTrigger:{trigger:'#top',start:'top top',end:'+=150%',pin:true,scrub:1,}});
  htl.to(F,{warp:1,duration:1,ease:'power1.in'},0)
     .to('#hero-foot',{autoAlpha:0,y:-30,duration:.25},0)
     .to(chars,{yPercent:0,opacity:1,filter:'blur(0px)',duration:.5,stagger:.06,ease:'power3.out'},.62)
     .to('.hero-sub',{opacity:1,y:0,duration:.4},.9)
     .to('.horizon',{yPercent:0,duration:.5,ease:'power2.out'},1.15)
     .to('#hero-title',{y:-60,opacity:0,duration:.4},1.25);

  const lines=$$('.construct > *');gsap.set(lines,{strokeDasharray:1,strokeDashoffset:1});
  const box=$('#frame-box');
  const boxClip=()=>{const f=frameEl.getBoundingClientRect(),b=box.getBoundingClientRect();return`inset(${b.top-f.top}px ${f.right-b.right}px ${f.bottom-b.bottom}px ${b.left-f.left}px)`};
  const ttl=splitLines($('.frame-title'));
  gsap.set('#marble',{clipPath:boxClip()});
  const ftl=gsap.timeline({scrollTrigger:{trigger:'#frame',start:'top top',end:'+=260%',pin:true,scrub:1,invalidateOnRefresh:true,onUpdate:s=>setSurface(s.progress>.95?'bone':'night')}});
  ftl.to(lines,{strokeDashoffset:0,duration:1.1,stagger:.03,ease:'none'},0)
     .to('#marble',{opacity:1,duration:.7},.3)
     .from(ttl,{yPercent:110,duration:.6,stagger:.08,ease:'power3.out'},.5)
     .fromTo('#marble',{clipPath:()=>boxClip()},{clipPath:'inset(0px 0px 0px 0px)',duration:1.1,ease:'power2.inOut',immediateRender:false},1.5)
     .to(box,{scale:1.25,opacity:0,duration:.8,ease:'power2.in'},1.5)
     .to('.construct',{opacity:0,duration:.6},1.5)
     .to('.frame-cap',{opacity:0,duration:.4},1.5)
     .to('#wipe',{clipPath:'circle(100% at 50% 50%)',duration:1,ease:'power3.inOut'},2.7);

  $$('[data-lines]').forEach(el=>{const ls=splitLines(el);gsap.from(ls,{yPercent:110,duration:1.4,ease:'expo.out',stagger:.08,scrollTrigger:{trigger:el,start:'top 88%'}})});
  gsap.to('.prologue-text .w',{opacity:1,stagger:.05,ease:'none',scrollTrigger:{trigger:'#prologue-text',start:'top 78%',end:'bottom 42%',scrub:true}});
  gsap.from('.facts > div',{y:30,opacity:0,duration:1.2,ease:'expo.out',stagger:.1,scrollTrigger:{trigger:'.facts',start:'top 88%'}});
  $$('.eyebrow').forEach(el=>gsap.from(el,{opacity:0,x:-14,duration:1,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 90%'}}));

  const mm=gsap.matchMedia();
  mm.add('(min-width: 900px)',()=>{
    const track=$('#track');const dist=()=>Math.max(0,track.scrollWidth-innerWidth);
    const tw=gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:'.works-pin',start:'top top',end:()=>'+='+dist(),pin:true,scrub:1,invalidateOnRefresh:true,onUpdate:s=>gsap.set('#works-bar',{scaleX:s.progress})}});
    $$('.card',track).forEach((c,i)=>{if(i===0)return;gsap.from($('.card-vis',c),{clipPath:'inset(12% 12% 12% 12%)',ease:'none',scrollTrigger:{trigger:c,containerAnimation:tw,start:'left right',end:'left 55%',scrub:true}})});
  });
  mm.add('(max-width: 899px)',()=>{$$('.card').forEach(c=>gsap.from(c,{y:50,opacity:0,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:c,start:'top 90%'}}))});

  /* art scene */
  const scs=$$('.sc'),dots=$$('.scene-step i');
  scs.forEach((el,i)=>{const h=$('.scene-h',el);const ls=splitLines(h);el._ls=ls;if(i)gsap.set(ls,{yPercent:110});if(i)gsap.set($('.scene-p',el),{opacity:0,y:16})});
  const stl=gsap.timeline({scrollTrigger:{trigger:'#scene',start:'top top',end:'bottom bottom',scrub:1,onUpdate:s=>{SC.p=s.progress;SC.spin=Math.min(2,Math.abs(s.getVelocity())/900);const st=s.progress<.36?0:s.progress<.7?1:2;dots.forEach((d,i)=>d.classList.toggle('on',i===st))}}});
  stl.to('#bgA',{scale:1.12,duration:3,ease:'none'},0)
     .to(scs[0]._ls,{yPercent:-110,duration:.25},.85).to($('.scene-p',scs[0]),{opacity:0,y:-16,duration:.2},.85)
     .to('#bgB',{clipPath:'circle(85% at 50% 60%)',duration:.45,ease:'power2.inOut'},.95)
     .to(scs[1]._ls,{yPercent:0,duration:.3},1.15).to($('.scene-p',scs[1]),{opacity:1,y:0,duration:.25},1.2)
     .fromTo('#bgB',{scale:1.15},{scale:1,duration:2,ease:'none'},.95)
     .to(scs[1]._ls,{yPercent:-110,duration:.25},1.95).to($('.scene-p',scs[1]),{opacity:0,y:-16,duration:.2},1.95)
     .to('#bgC',{clipPath:'circle(85% at 50% 60%)',duration:.45,ease:'power2.inOut'},2.05)
     .fromTo('#bgC',{scale:1.15},{scale:1,duration:.95,ease:'none'},2.05)
     .to(scs[2]._ls,{yPercent:0,duration:.3},2.25).to($('.scene-p',scs[2]),{opacity:1,y:0,duration:.25},2.3);
  $$('.fl').forEach(f=>{const d=+f.dataset.d;stl.fromTo(f,{y:innerHeight*.5*d,rotate:-8*d,rotateY:25},{y:-innerHeight*.9*d,rotate:10*d,rotateY:-25,duration:3,ease:'none'},0)});
  const rows=$$('.marquee-row').map(r=>({el:r,dir:+r.dataset.dir,x:0}));let mv=0;
  ScrollTrigger.create({trigger:'#instruments',start:'top bottom',end:'bottom top',onUpdate:s=>{mv=Math.min(Math.abs(s.getVelocity())/140,12)*s.direction}});
  gsap.ticker.add(()=>{mv*=.94;rows.forEach(r=>{const half=r.el.scrollWidth/2;r.x+=r.dir*(.5+Math.abs(mv))*(mv<0?-1:1);if(r.x<=-half)r.x+=half;if(r.x>0)r.x-=half;r.el.style.transform=`translate3d(${r.x}px,0,0)`})});
  gsap.from('.kit li',{y:16,opacity:0,duration:.9,ease:'expo.out',stagger:.025,scrollTrigger:{trigger:'.kits',start:'top 85%'}});

  $$('.step').forEach(s=>{gsap.to($('.bar',s),{scaleX:1,ease:'none',scrollTrigger:{trigger:s,start:'top 88%',end:'top 50%',scrub:true}});gsap.from($('div',s),{y:24,opacity:0,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:s,start:'top 84%'}})});
  gsap.from('.contact-row > *',{y:24,opacity:0,stagger:.08,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:'.contact-row',start:'top 92%'}});

  $$('[data-surface]').forEach(sec=>ScrollTrigger.create({trigger:sec,start:'top 55%',end:'bottom 55%',onToggle:s=>{if(s.isActive)setSurface(sec.dataset.surface)}}));
  ScrollTrigger.create({trigger:'#top',start:'top top',end:'bottom top',onEnterBack:()=>setSurface('night')});
  $$('main > section[data-label]').forEach(sec=>ScrollTrigger.create({trigger:sec,start:'top 50%',end:'bottom 50%',onToggle:s=>{if(!s.isActive)return;$('#pill-label').textContent=sec.dataset.label;$$('.index a').forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')==='#'+sec.id));$('#index-in').classList.toggle('hide',sec.id==='folios'||sec.dataset.surface!=='bone')}}));
  ScrollTrigger.create({trigger:'#frame',start:'top 60%',onEnter:()=>gsap.to('.pill',{autoAlpha:1,y:0,duration:.8,ease:'expo.out'}),onLeaveBack:()=>gsap.to('.pill',{autoAlpha:0,y:20,duration:.4})});
  ScrollTrigger.refresh();
}
}
requestAnimationFrame(()=>setTimeout(__boot,30));
