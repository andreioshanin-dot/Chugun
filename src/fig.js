/* Stick-figure movement diagrams. Angles in degrees.
   t: trunk from vertical-up, + leans forward (+x). a,b,u,v: thigh, shin, upper arm, forearm from straight-down, + toward front (+x).
   Ground y=112. viewBox 0 -4 120 128. */
const FIGLEN={T:30,HD:10,TH:26,SH:27,UA:17,FA:16};
const RAD=Math.PI/180;
function dn(a){return [Math.sin(a*RAD),Math.cos(a*RAD)]}
function up(a){return [Math.sin(a*RAD),-Math.cos(a*RAD)]}
function add(p,v,k){return [p[0]+v[0]*k,p[1]+v[1]*k]}
function ik(R,T,l1,l2,bend){const dx=T[0]-R[0],dy=T[1]-R[1];let d=Math.hypot(dx,dy);const m=l1+l2-0.01;if(d>m){d=m}
  const a=Math.atan2(dy,dx),c=Math.acos(Math.max(-1,Math.min(1,(l1*l1+d*d-l2*l2)/(2*l1*d))));const ang=a+bend*c;
  const E=[R[0]+l1*Math.cos(ang),R[1]+l1*Math.sin(ang)];const k=Math.min(1,(l1+l2)/Math.hypot(dx,dy));return [E,[R[0]+dx*k,R[1]+dy*k]]}
function solve(p,front){const L=FIGLEN;const H=[0,0];const td=up(p.t);const S=add(H,td,L.T);
  const hdv=up(p.t+(p.hd||0));const Hd=add(S,hdv,L.HD);
  const perp=[Math.cos(p.t*RAD),Math.sin(p.t*RAD)];
  let R1=add(S,td,-(p.sh||0)),R2=R1,H1=H,H2=H;
  if(front){R1=add(R1,perp,7);R2=add(R2,perp,-7);H1=add(H,perp,4);H2=add(H,perp,-4)}
  const a2=p.a2??p.a,b2=p.b2??p.b,u2=p.u2??p.u,v2=p.v2??p.v;
  const K=add(H1,dn(p.a),L.TH),F=add(K,dn(p.b),L.SH),K2=add(H2,dn(a2),L.TH),F2=add(K2,dn(b2),L.SH);
  let E=add(R1,dn(p.u),L.UA),W=add(E,dn(p.v),L.FA),E2=add(R2,dn(u2),L.UA),W2=add(E2,dn(v2),L.FA);
  return {H,S,Hd,R1,R2,H1,H2,K,F,K2,F2,E,W,E2,W2,b:p.b,b2,v:p.v,v2}}
const AN={f:"F",f2:"F2",h:"H",w:"W",w2:"W2",k:"K",k2:"K2",s:"S"};
function place(p,front){const P=solve(p,front);const j=P[AN[p.an||"f"]];const at=p.at||[60,112];return [at[0]-j[0],at[1]-j[1]]}
const KEYS=["t","a","b","u","v","a2","b2","u2","v2","sh","hd","c","orb"];
function lerpPose(A,B,k,front){const o={...A};for(const key of KEYS){const x=A[key],y=B[key];if(x===undefined&&y===undefined)continue;
    const xa=x??(key.endsWith("2")?A[key[0]]:0),yb=y??(key.endsWith("2")?B[key[0]]:0);o[key]=xa+(yb-xa)*k}
  const same=(A.an||"f")===(B.an||"f")&&JSON.stringify(A.at||[60,112])===JSON.stringify(B.at||[60,112]);
  if(!same){const ha=place(A,front),hb=place(B,front);o.an="h";o.at=[ha[0]+(hb[0]-ha[0])*k,ha[1]+(hb[1]-ha[1])*k]}
  o.props=k<.5?A.props:B.props;o.kb=k<.5?A.kb:B.kb;o.ik=k<.5?A.ik:B.ik;return o}
function pt(p){return p[0].toFixed(1)+","+p[1].toFixed(1)}
function drawFig(fig,pose){const front=fig.view==="front";const P=solve(pose,front);const off=place(pose,front);
  const Q={};for(const k in P){if(Array.isArray(P[k])&&P[k].length===2&&typeof P[k][0]==="number")Q[k]=[P[k][0]+off[0],P[k][1]+off[1]]}
  const pr={...(fig.props||{}),...(pose.props||{})};const bell=fig.w===24?"var(--k24)":"var(--k16)";
  let kbA=null,kbB=null,ring="";
  if(pose.kb==="hip"){kbA=add(Q.H,[0,-1],8)}
  if(pose.kb==="orbit"){const c=add(Q.Hd,[0,0],0);ring=`<circle cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="15" class="fg-ring"/>`;kbA=[c[0]+15*Math.cos(pose.orb*RAD),c[1]+15*Math.sin(pose.orb*RAD)]}
  if(pose.ik&&kbA){const s1=ik(Q.R1,kbA,FIGLEN.UA,FIGLEN.FA,pose.ik);Q.E=s1[0];Q.W=s1[1];const s2=ik(Q.R2,kbA,FIGLEN.UA,FIGLEN.FA,-pose.ik);Q.E2=s2[0];Q.W2=s2[1]}
  const fd=(a)=>dn(a);
  if(pose.kb==="w"||pose.kb==="ww")kbA=add(Q.W,fd(P.v),7);
  if(pose.kb==="w2")kbA=add(Q.W2,fd(P.v2),7);
  if(pose.kb==="ww")kbB=add(Q.W2,fd(P.v2),7);
  const line=(a,b,cls)=>`<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" class="${cls}"/>`;
  const poly=(arr,cls)=>`<polyline points="${arr.map(pt).join(" ")}" class="${cls}"/>`;
  let s="";
  if(pr.ground!==false)s+=`<line x1="0" y1="112.5" x2="120" y2="112.5" class="fg-ground"/>`;
  if(pr.bar)s+=`<line x1="20" y1="0" x2="100" y2="0" class="fg-bar"/>`;
  if(pr.wall!==undefined)s+=`<line x1="${pr.wall}" y1="8" x2="${pr.wall}" y2="112" class="fg-bar"/>`;
  if(pr.bench)s+=`<rect x="${pr.bench[0]}" y="${pr.bench[1]}" width="${pr.bench[2]}" height="${112-pr.bench[1]}" rx="2" class="fg-prop"/>`;
  if(pr.block){const w=Q[pr.block];s+=`<rect x="${(w[0]-8).toFixed(1)}" y="${(w[1]+1).toFixed(1)}" width="16" height="${Math.max(0,111-w[1]).toFixed(1)}" rx="2" class="fg-prop"/>`}
  s+=ring;
  // far limbs
  s+=poly([Q.H2||Q.H,Q.K2,Q.F2],"fg-far");s+=line(Q.F2,add(Q.F2,[Math.cos(P.b2*RAD),-Math.sin(P.b2*RAD)],6),"fg-far");
  s+=poly([Q.R2,Q.E2,Q.W2],"fg-far");
  if(kbB)s+=bellSvg(kbB,bell,-2);
  // trunk (with bend), head
  const mid=[(Q.H[0]+Q.S[0])/2,(Q.H[1]+Q.S[1])/2];const perp=[Math.cos(pose.t*RAD),Math.sin(pose.t*RAD)];const c=add(mid,perp,(pose.c||0)*2);
  s+=`<path d="M${pt(Q.H)} Q${pt(c)} ${pt(Q.S)}" class="fg-near"/>`;
  s+=`<circle cx="${Q.Hd[0].toFixed(1)}" cy="${Q.Hd[1].toFixed(1)}" r="6" class="fg-head"/>`;
  // near limbs
  s+=poly([Q.H1||Q.H,Q.K,Q.F],"fg-near");s+=line(Q.F,add(Q.F,[Math.cos(P.b*RAD),-Math.sin(P.b*RAD)],6),"fg-near");
  if(pr.handles){s+=`<rect x="${(Q.W[0]-5).toFixed(1)}" y="${(Q.W[1]).toFixed(1)}" width="10" height="${Math.max(2,112-Q.W[1]).toFixed(1)}" rx="1.5" class="fg-prop"/>`}
  if(pr.roller){s+=`<circle cx="${Q.W[0].toFixed(1)}" cy="${(Q.W[1]+1).toFixed(1)}" r="5" class="fg-roll"/>`}
  if(kbA)s+=bellSvg(kbA,bell,0);
  s+=poly([Q.R1,Q.E,Q.W],"fg-near");
  return s}
function bellSvg(c,col,dx){return `<g transform="translate(${(c[0]+dx).toFixed(1)},${c[1].toFixed(1)})"><path d="M-3.2,-4.2 Q0,-8.5 3.2,-4.2" class="fg-handle"/><circle r="5.2" fill="${col}" class="fg-bell"/></g>`}
function ease(k){return .5-.5*Math.cos(Math.PI*k)}
function poseAt(fig,ms){const fr=fig.frames;let total=0;const seg=fr.map(f=>{const d=(f.hold??250)+(f.ms??700);total+=d;return d});
  let t=ms%total,i=0;while(t>seg[i]){t-=seg[i];i++}
  const A=fr[i],B=fr[(i+1)%fr.length],hold=A.hold??250;
  if(t<=hold||B.cut)return A;const k=ease((t-hold)/(A.ms??700));return lerpPose(A,B,k,fig.view==="front")}
if(typeof module!=="undefined")module.exports={drawFig,poseAt,lerpPose};
