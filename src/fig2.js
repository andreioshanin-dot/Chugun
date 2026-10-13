/* Blueprint line-art renderer: tapered muscular segments, kettlebell detail, technical measurements. Uses solve/place from fig.js. */
const MEAS={rdl:["hip","toe"],rdl16:["hip","toe"],swing:["hip","toe"],swing16:["hip","toe"],swing1:["hip","toe"],snatch:["hip"],cleanpress:["hip"],
 goblet:["knee","toe"],frontsq:["knee","toe"],lunge:["knee","toe"],wallsit:["knee"],slrdl:["hip"],row:["hip"],bridge24:["hip"],bridge:["hip"],
 pushup:["line"],boom:["line"],pushroll:["line"],roller:["line"],sideplank:["line"],pullup:["elbow"],ladder:["elbow"],kneeraise:["hip"],ltuck:["hip"],
 hamstr:["hip"],rackhold:["plumb"],complex:["hip"],hollow:[],windmill:[],tgu:[],halo:[],hipflex:["knee"],catcow:[],scap:[],hang:[],child:[],wrist:[],chest:[],calf:[]};
const f1=x=>x.toFixed(2);
const P2=p=>f1(p[0])+","+f1(p[1]);
function wprof(t,[wa,wm,wb,tm]){return t<tm?wa+(wm-wa)*Math.sin(t/tm*Math.PI/2):wm+(wb-wm)*(1-Math.cos((t-tm)/(1-tm)*Math.PI/2))}
/* tapered segment A->B. wf/wb: width profiles on +perp (front) and -perp sides */
function segPath(A,B,wf,wbk,n=9){const dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,px=-uy,py=ux;
  const l=[],r=[];for(let i=0;i<=n;i++){const t=i/n,cx=A[0]+dx*t,cy=A[1]+dy*t,a=wprof(t,wf)/2,b=wprof(t,wbk)/2;l.push([cx+px*a,cy+py*a]);r.push([cx-px*b,cy-py*b])}
  const capB=[B[0]+ux*wf[2]*.55,B[1]+uy*wf[2]*.55],capA=[A[0]-ux*wf[0]*.55,A[1]-uy*wf[0]*.55];
  return {d:`M${P2(l[0])} L${l.slice(1).map(P2).join(" ")} Q${P2(capB)} ${P2(r[n])} L${r.slice(0,n).reverse().map(P2).join(" ")} Q${P2(capA)} ${P2(l[0])}Z`,
    inner:(o,t0,t1,side)=>{const pts=[];for(let i=0;i<=6;i++){const t=t0+(t1-t0)*i/6,cx=A[0]+dx*t,cy=A[1]+dy*t,w=(side>0?wprof(t,wf):wprof(t,wbk))/2*o*side;pts.push([cx+px*w,cy+py*w])}return `M${P2(pts[0])} L${pts.slice(1).map(P2).join(" ")}`}}}
function torsoPath(H,S,bend,t,front){const mid=[(H[0]+S[0])/2,(H[1]+S[1])/2],perp=[Math.cos(t*RAD),Math.sin(t*RAD)],C=[mid[0]+perp[0]*bend*2,mid[1]+perp[1]*bend*2];
  const bez=s=>[(1-s)*(1-s)*H[0]+2*(1-s)*s*C[0]+s*s*S[0],(1-s)*(1-s)*H[1]+2*(1-s)*s*C[1]+s*s*S[1]];
  const tan=s=>{const x=2*(1-s)*(C[0]-H[0])+2*s*(S[0]-C[0]),y=2*(1-s)*(C[1]-H[1])+2*s*(S[1]-C[1]),l=Math.hypot(x,y)||1;return [x/l,y/l]};
  // widths along torso: hip, waist, chest, shoulder  (front side / back side)
  const FW=front?[5.4,4.6,6.6,7.4]:[4.4,3.6,6.4,4.6],BW=front?[5.4,4.6,6.6,7.4]:[5.6,4.2,4.6,4.4];
  const prof=(w,s)=>{const k=[0,.38,.78,1];for(let i=0;i<3;i++)if(s<=k[i+1]){const u=(s-k[i])/(k[i+1]-k[i]);return w[i]+(w[i+1]-w[i])*(.5-.5*Math.cos(Math.PI*u))}return w[3]};
  const l=[],r=[],n=12;for(let i=0;i<=n;i++){const s=i/n,p=bez(s),tg=tan(s),nx=tg[1],ny=-tg[0];// nx,ny = left normal; front side = +perp
    const sg=(nx*perp[0]+ny*perp[1])>=0?1:-1;const a=prof(FW,s),b=prof(BW,s);l.push([p[0]+nx*sg*a,p[1]+ny*sg*a]);r.push([p[0]-nx*sg*b,p[1]-ny*sg*b])}
  const d=`M${P2(l[0])} L${l.slice(1).map(P2).join(" ")} L${r.slice().reverse().map(P2).join(" ")}Z`;
  // details: pec curve and ab ticks on front side
  const det=[];const at=(s,o)=>{const p=bez(s),tg=tan(s),nx=tg[1],ny=-tg[0],sg=(nx*perp[0]+ny*perp[1])>=0?1:-1;return [p[0]+nx*sg*o,p[1]+ny*sg*o]};
  if(!front){det.push(`M${P2(at(.6,3.4))} Q${P2(at(.7,6.2))} ${P2(at(.88,4.8))}`);[.18,.3,.42].forEach(s=>det.push(`M${P2(at(s,1))} L${P2(at(s,3.2))}`));det.push(`M${P2(at(.5,-3))} Q${P2(at(.75,-3.6))} ${P2(at(.95,-2.4))}`)}
  else{det.push(`M${P2(at(.86,0))} L${P2(at(.12,0))}`);det.push(`M${P2(at(.7,-5.4))} Q${P2(at(.8,0))} ${P2(at(.7,5.4))}`);[.22,.34,.46].forEach(s=>det.push(`M${P2(at(s,-2.4))} L${P2(at(s,2.4))}`))}
  return {d,det:det.join(" ")}}
function footPath(F,b){const n=dn(b),toe=[Math.cos(b*RAD),-Math.sin(b*RAD)];
  const pts=[add(add(F,toe,-2.4),n,1.4),add(add(F,toe,7.6),n,1.4),add(add(F,toe,6.8),n,-.8),add(add(F,toe,2),n,-2.4),add(add(F,toe,-1.8),n,-1.8)];
  return `M${pts.map(P2).join(" L")}Z`}
function bellPro(c,w,dx){const r=w===24?6.1:5.3,col=w===24?"var(--k24)":"var(--k16)";const x=c[0]+dx,y=c[1];
  return `<g transform="translate(${f1(x)},${f1(y)})" class="fg-kb"><path d="M${-r*.62},${-r*.55} C${-r*.75},${-r-4.8} ${r*.75},${-r-4.8} ${r*.62},${-r*.55}" class="fg-kbh"/>
  <path d="M${-r*.55},${r*.88} A${r} ${r} 0 1 1 ${r*.55},${r*.88} Z" fill="${col}" class="fg-kbb"/><path d="M${-r*.6},${-r*.2} A${r*.75} ${r*.75} 0 0 1 ${-r*.05},${-r*.72}" class="fg-kbhl"/>
  <text x="0" y="${r*.42}" class="fg-kbt">${w}</text></g>`}
function angArc(V,A,B,r){const a1=Math.atan2(A[1]-V[1],A[0]-V[0]),a2=Math.atan2(B[1]-V[1],B[0]-V[0]);let d=a2-a1;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;
  const p1=[V[0]+r*Math.cos(a1),V[1]+r*Math.sin(a1)],p2=[V[0]+r*Math.cos(a1+d),V[1]+r*Math.sin(a1+d)],mid=a1+d/2,deg=Math.round(Math.abs(d)/RAD);
  const lp=[V[0]+(r+4.6)*Math.cos(mid),V[1]+(r+4.6)*Math.sin(mid)+1.2];
  return `<path d="M${P2(p1)} A${r} ${r} 0 0 ${d>0?1:0} ${P2(p2)}" class="fg-arc"/><text x="${f1(lp[0])}" y="${f1(lp[1])}" class="fg-txt" text-anchor="middle">${deg}°</text>`}
function drawFigPro(fig,pose,ghost,fid){const front=fig.view==="front";
  const Q=(p)=>{const P=solve(p,front),o=place(p,front),q={};for(const k in P){const v=P[k];if(Array.isArray(v)&&v.length===2&&typeof v[0]==="number")q[k]=[v[0]+o[0],v[1]+o[1]]}q._P=P;return q};
  const q=Q(pose),P=q._P,pr={...(fig.props||{}),...(pose.props||{})};
  let kbA=null,kbB=null,ring="";
  if(pose.kb==="hip")kbA=add(q.H,[0,-1],8.5);
  if(pose.kb==="orbit"){kbA=[q.Hd[0]+15*Math.cos(pose.orb*RAD),q.Hd[1]+15*Math.sin(pose.orb*RAD)];ring=`<circle cx="${f1(q.Hd[0])}" cy="${f1(q.Hd[1])}" r="15" class="fg-ring"/>`}
  if(pose.ik&&kbA){const s1=ik(q.R1,kbA,FIGLEN.UA,FIGLEN.FA,pose.ik);q.E=s1[0];q.W=s1[1];const s2=ik(q.R2,kbA,FIGLEN.UA,FIGLEN.FA,-pose.ik);q.E2=s2[0];q.W2=s2[1]}
  if(pose.kb==="w"||pose.kb==="ww")kbA=add(q.W,dn(P.v),7.5);
  if(pose.kb==="w2")kbA=add(q.W2,dn(P.v2),7.5);
  if(pose.kb==="ww")kbB=add(q.W2,dn(P.v2),7.5);
  let s="";
  // floor ruler, props
  if(pr.ground!==false){s+=`<line x1="0" y1="112.6" x2="120" y2="112.6" class="fg-ground"/>`;for(let x=5;x<120;x+=5)s+=`<line x1="${x}" y1="112.6" x2="${x}" y2="${x%10?114.2:115.4}" class="fg-tick"/>`}
  if(pr.bar)s+=`<line x1="18" y1="0" x2="102" y2="0" class="fg-bar"/><line x1="18" y1="-3" x2="18" y2="3" class="fg-tick"/><line x1="102" y1="-3" x2="102" y2="3" class="fg-tick"/>`;
  if(pr.wall!==undefined)s+=`<line x1="${pr.wall}" y1="8" x2="${pr.wall}" y2="112" class="fg-bar"/>`;
  if(pr.bench)s+=`<rect x="${pr.bench[0]}" y="${pr.bench[1]}" width="${pr.bench[2]}" height="${112-pr.bench[1]}" class="fg-prop"/>`;
  if(pr.block){const w=q[pr.block];s+=`<rect x="${f1(w[0]-8)}" y="${f1(w[1]+1)}" width="16" height="${f1(Math.max(0,111-w[1]))}" class="fg-prop"/>`}
  // ghost (motion trail)
  if(ghost){const g=Q(ghost);s+=`<g class="fg-ghost"><path d="M${P2(g.F)} L${P2(g.K)} L${P2(g.H)} L${P2(g.S)} L${P2(g.Hd)} M${P2(g.R1)} L${P2(g.E)} L${P2(g.W)}"/></g>`}
  // measurements (behind body)
  const meas=MEAS[fid]||[];let mz="";
  const toeTip=add(q.F,[Math.cos(P.b*RAD),-Math.sin(P.b*RAD)],7);
  if(meas.includes("toe")&&pr.ground!==false){mz+=`<line x1="${f1(toeTip[0])}" y1="112" x2="${f1(toeTip[0])}" y2="${f1(Math.min(q.K[1],q.H[1])-10)}" class="fg-guide"/><text x="${f1(toeTip[0]+1.4)}" y="109.6" class="fg-txt">НОСОК</text>`}
  if(meas.includes("plumb"))mz+=`<line x1="${f1(q.F[0]+2)}" y1="112" x2="${f1(q.F[0]+2)}" y2="${f1(q.Hd[1]-9)}" class="fg-guide"/>`;
  if(meas.includes("line")){const a=q.S,b=q.F,dx=b[0]-a[0],dy=b[1]-a[1];mz+=`<line x1="${f1(a[0]+dx*-.25)}" y1="${f1(a[1]+dy*-.25)}" x2="${f1(a[0]+dx*1.08)}" y2="${f1(a[1]+dy*1.08)}" class="fg-guide"/><text x="${f1(a[0]+dx*.45)}" y="${f1(a[1]+dy*.45-9)}" class="fg-txt" text-anchor="middle">ОДНА ЛИНИЯ</text>`}
  // far limbs
  const far=`<path d="${segPath(q.H2||q.H,q.K2,[8.6,9.8,5.8,.3],[8.6,9.2,5.8,.35]).d}"/><path d="${segPath(q.K2,q.F2,[5.4,5.4,3.4,.4],[5.4,7,3.4,.3]).d}"/><path d="${footPath(q.F2,P.b2)}"/>
   <path d="${segPath(q.R2,q.E2,[5.8,6.6,4.2,.4],[5.8,6.4,4.2,.45]).d}"/><path d="${segPath(q.E2,q.W2,[4.6,5,3,.25],[4.6,5,3,.25]).d}"/><circle cx="${f1(q.W2[0])}" cy="${f1(q.W2[1])}" r="2.3"/>`;
  s+=ring+`<g class="fg-farg">${far}</g>`;
  if(kbB)s+=bellPro(kbB,fig.w||16,-2.2);
  // torso, neck, head
  const tor=torsoPath(q.H,q.S,pose.c||0,pose.t,front);
  const hdir=up(pose.t+(pose.hd||0)),neckB=add(q.S,hdir,3.5);
  const fwd=[Math.cos((pose.t+(pose.hd||0))*RAD),Math.sin((pose.t+(pose.hd||0))*RAD)];
  const nose=add(add(q.Hd,fwd,5.4),hdir,-.6),ear=add(q.Hd,fwd,-.8);
  s+=`<g class="fg-body"><path d="${tor.d}"/><path d="${segPath(q.S,neckB,[5,4.4,4,.5],[5,4.4,4,.5]).d}"/>
   <circle cx="${f1(q.Hd[0])}" cy="${f1(q.Hd[1])}" r="5.6"/>${front?"":`<path d="M${P2(add(q.Hd,fwd,5.1))} L${P2(nose)} L${P2(add(add(q.Hd,fwd,5),hdir,-1.8))}"/>`}</g>
   <g class="fg-det"><path d="${tor.det}"/>${front?"":`<circle cx="${f1(ear[0])}" cy="${f1(ear[1])}" r="1"/>`}</g>`;
  // near leg
  const th=segPath(q.H1||q.H,q.K,[9,10.2,6,.3],[9,9.4,6,.35]),sh=segPath(q.K,q.F,[5.6,5.6,3.4,.4],[5.6,7.4,3.4,.3]);
  s+=`<g class="fg-body"><path d="${th.d}"/><path d="${sh.d}"/><path d="${footPath(q.F,P.b)}"/></g><g class="fg-det"><path d="${th.inner(.35,.18,.82,1)} ${sh.inner(.45,.15,.6,-1)}"/></g>`;
  if(pr.handles)s+=`<rect x="${f1(q.W[0]-5)}" y="${f1(q.W[1]+.5)}" width="10" height="${f1(Math.max(2,112-q.W[1]-.5))}" class="fg-prop"/>`;
  if(pr.roller)s+=`<circle cx="${f1(q.W[0])}" cy="${f1(q.W[1]+1)}" r="5" class="fg-roll"/><circle cx="${f1(q.W[0])}" cy="${f1(q.W[1]+1)}" r="1.4" class="fg-tick"/>`;
  if(kbA)s+=bellPro(kbA,fig.w||16,0);
  // near arm
  const ua=segPath(q.R1,q.E,[6,7,4.4,.4],[6,6.6,4.4,.45]),fa=segPath(q.E,q.W,[4.8,5.2,3.2,.25],[4.8,5.2,3.2,.25]);
  s+=`<g class="fg-body"><path d="${ua.d}"/><path d="${fa.d}"/><circle cx="${f1(q.W[0])}" cy="${f1(q.W[1])}" r="2.4"/></g><g class="fg-det"><path d="${ua.inner(.3,.2,.75,1)}"/></g>`;
  // joint markers
  s+=`<g class="fg-joint">${[q.H1||q.H,q.K,q.E,q.R1].map(p=>`<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r=".8"/>`).join("")}</g>`;
  // angles on top
  if(meas.includes("hip"))mz+=angArc(q.H,q.S,q.K,6);
  if(meas.includes("knee"))mz+=angArc(q.K,q.H1||q.H,q.F,5);
  if(meas.includes("elbow"))mz+=angArc(q.E,q.R1,q.W,4.5);
  return s+`<g class="fg-meas">${mz}</g>`}
