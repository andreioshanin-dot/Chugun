/* ---------- платформа: внутри Claude или самостоятельное приложение (PWA) ---------- */
const IS_PWA=typeof window!=="undefined"&&!window.claude;
const STANDALONE=IS_PWA&&((window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone===true);
const ANALYSIS=false; // оценка по скриншотам временно выключена
let DELP=null;
let NOTE="";
const API={key(){try{return localStorage.getItem("apiKey")||""}catch(e){return ""}},model(){try{return localStorage.getItem("apiModel")||"claude-sonnet-5-5"}catch(e){return "claude-sonnet-5-5"}}};
/* ---------- программа ---------- */
const PHASES=[{n:"Нед 1–3",s:"База"},{n:"Нед 4–6",s:"Объём"},{n:"Нед 7",s:"Пик"},{n:"Нед 8",s:"Разгрузка"}];
const WARM_ALL=[
 {n:"Кошка-корова",fig:"catcow",per:"8 раз, медленно",how:["На четвереньках, руки под плечами","Выдох: круглая спина, голова вниз","Вдох: прогиб, взгляд вперёд"]},
 {n:"Ягодичный мост",fig:"bridge",per:"12 раз",how:["Лёжа на спине, стопы у таза","Подними таз, сожми ягодицы","Опусти, не расслабляя пресс"]},
 {n:"Гало с гирей 16",fig:"halo",per:"5 кругов в каждую сторону",how:["Гиря за рожки дном вверх у груди","Веди её вокруг головы близко к шее","Корпус неподвижен, пресс напряжён"]},
 {n:"Румынская тяга 16",fig:"rdl16",per:"10 раз, медленно",how:["Колени чуть согнуты и не двигаются","Таз назад, спина прямая","Встань, сжав ягодицы"]},
 {n:"Лёгкие махи 16",fig:"swing16",per:"15 махов",how:["Разогрев шарнира перед тяжёлой работой","Мах тазом, гиря до груди","Колени не проваливаются вперёд"]},
 {n:"Вис на турнике",fig:"hang",per:"40 секунд",hold:40,how:["Хват на ширине плеч","Плечи чуть оттяни от ушей","Дыши спокойно"]},
 {n:"Лопаточные подтягивания",fig:"scap",per:"8 раз",how:["Вис на прямых руках","Опусти плечи и сведи лопатки, тело чуть поднимется","Руки остаются прямыми"]}
];
const COOL_ALL=[
 {n:"Вис на турнике, расслабленно",fig:"hang",per:"40 секунд",hold:40,how:["Повисни и расслабь спину","Можно слегка покачать тазом"]},
 {n:"Задняя поверхность бедра, правая",fig:"hamstr",per:"40 секунд",hold:40,how:["Правая нога вперёд на пятку, колено прямое","Наклон с прямой спиной до натяжения"]},
 {n:"Задняя поверхность бедра, левая",fig:"hamstr",per:"40 секунд",hold:40,how:["Левая нога вперёд на пятку","Наклон с прямой спиной"]},
 {n:"Сгибатели бедра, правая",fig:"hipflex",per:"40 секунд",hold:40,how:["Правое колено на полотенце сзади","Подкрути таз и подай его вперёд","Переднее колено над стопой, не дальше"]},
 {n:"Сгибатели бедра, левая",fig:"hipflex",per:"40 секунд",hold:40,how:["Левое колено на полотенце сзади","Таз вперёд, корпус прямо"]}
];

const NW={
 pushs:{n:"Отжимания на упорах, медленно",fig:"pushup",per:"8 раз, 3 секунды вниз",how:["Корпус прямой, локти под 45°","Вниз 3 секунды, вверх без рывка","Вверху разведи лопатки"]},
 cleanw:{n:"Двойное взятие на грудь 16 + 16, лёгко",fig:"cleanpress",per:"4 раза",how:["Гири между ног, таз назад","Толчок тазом, гири мягко на грудь","Опусти и сбрось в мах"]},
 swing1w:{n:"Мах одной рукой 16",fig:"swing1",per:"6 раз в каждую руку",how:["Плечо прижато, корпус не скручивай","Мах тазом до уровня груди","Меняй руку без остановки"]},
 snw:{n:"Рывок 16, вполсилы",fig:"snatch",per:"4 раза в каждую руку",how:["Мах между ног, толчок тазом","Локоть ведёт гирю близко к телу","Гиря мягко ложится на предплечье"]},
 gobw:{n:"Гоблет-присед 16 с паузой",fig:"goblet",per:"6 раз, пауза 2 с внизу",how:["Гиря у груди, локти внутрь колен","Сядь до дна, спина прямая","Вставай, давя в пол всей стопой"]},
 lungew:{n:"Обратный выпад без веса",fig:"lunge",per:"6 раз на ногу",how:["Шаг назад, колено мягко к полу","Переднее колено над стопой","Вставай усилием передней ноги"]},
 bridge1:{n:"Ягодичный мост с паузой",fig:"bridge",per:"10 раз, пауза 2 с вверху",how:["Стопы у таза, подними таз","Сожми ягодицы и держи 2 секунды","Опусти без расслабления"]},
 sidepl:{n:"Боковая планка",fig:"sideplank",per:"40 секунд, смени сторону на 20-й",hold:40,how:["Локоть под плечом, таз вверх","Тело в одну линию","Смени сторону на 20-й секунде"]},
 chest:{n:"Грудные у дверного проёма",per:"40 секунд, 20 на руку",hold:40,how:["Предплечье на косяк, шаг вперёд","Грудь раскрывается, плечо не поднимай","На 20-й секунде смени руку"]},
 child:{n:"Детская поза",per:"40 секунд",hold:40,how:["Сядь на пятки, руки вытяни вперёд по полу","Лоб вниз, дыши в поясницу","Руки сдвинь чуть вправо, затем влево"]},
 wrist:{n:"Предплечья и запястья",per:"40 секунд",hold:40,how:["На четвереньках, ладони развёрнуты к коленям","Слегка откинься назад, тянется предплечье","На 20-й секунде поверни ладони тыльной стороной"]},
 calf:{n:"Икры у стены",per:"40 секунд, 20 на ногу",hold:40,how:["Руки на стене, одна нога назад","Пятка сзади прижата к полу","На 20-й секунде смени ногу"]},
 hamb:{n:"Наклон к ногам, ноги вместе",fig:"hamstr",per:"40 секунд",hold:40,how:["Ноги вместе, колени чуть мягкие","Тянись грудью к бёдрам с прямой спиной","Глубже на каждом выдохе"]}
};
const WA=WARM_ALL,CA=COOL_ALL;
const WARMS=[
 [WA[0],WA[2],WA[5],WA[6],NW.pushs,NW.cleanw],
 [WA[0],WA[1],WA[3],WA[4],NW.swing1w,NW.snw,WA[5]],
 [WA[0],NW.bridge1,NW.lungew,NW.gobw,WA[3],NW.sidepl],
 [WA[0],WA[2],WA[3],WA[4],NW.cleanw,WA[5],NW.pushs]];
const COOLS=[
 [CA[0],NW.chest,NW.child,CA[1],CA[2]],
 [CA[0],CA[3],CA[4],NW.wrist,NW.child],
 [CA[1],CA[2],CA[3],CA[4],NW.calf],
 [CA[0],NW.hamb,CA[3],CA[4],NW.child]];
const WU=d=>WARMS[d]||WARMS[0],CD=d=>COOLS[d]||COOLS[0];
let DAYS=[];

/* ---------- утилиты ---------- */
const $=s=>document.querySelector(s);
function load(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
const L=i=>String.fromCharCode(1040+i);
const wd=new Date().getDay(),map={1:0,2:1,4:2,5:3};
const DAYMS=864e5;
function monday(d){const x=new Date(d);x.setHours(0,0,0,0);x.setDate(x.getDate()-((x.getDay()+6)%7));return x.getTime()}
let cycleStart=load("cycleStart",null);
const FIRST_START=new Date(2026,9,12).getTime(); // программа стартует в понедельник 12 октября 2026
if(!cycleStart||cycleStart<FIRST_START){cycleStart=FIRST_START;save("cycleStart",cycleStart)}
function weekInfo(){const raw=Math.max(1,Math.round((monday(Date.now())-cycleStart)/(7*DAYMS))+1);return {w:((raw-1)%8)+1,cycle:Math.floor((raw-1)/8)+1}}
const phaseOfWeek=w=>w<=3?0:w<=6?1:w===7?2:3;
const FIRSTW=[1,4,7,8];
function setWeek(w){w=Math.max(1,Math.min(8,w));const {cycle}=weekInfo();cycleStart=monday(Date.now())-((cycle-1)*8+w-1)*7*DAYMS;
  save("cycleStart",cycleStart);syncSettings();st.phase=phaseOfWeek(w);render()}
let st={phase:phaseOfWeek(weekInfo().w),day:(wd in map)?map[wd]:load("day",0)};
let marks=load("marks",{});
/* журнал и оценка: хранилище в аккаунте Claude, если доступно */
let DB=null,UID=null,SAMPLE=null,IMG=null,BUSY=false,journal=load("journal",[]);const FILES={},OPEN=new Set();
const col=()=>DB.collection("data/users/"+UID);
function syncSettings(){if(DB)col().doc("settings").set({kind:"settings",cycleStart}).catch(()=>{})}
async function saveEntry(e){journal=[e,...journal.filter(x=>x.id!==e.id)].sort((a,b)=>b.ts-a.ts).slice(0,60);
  if(DB){try{await col().doc(e.id).set(e);return}catch(err){}}save("journal",journal)}
function stepCtx(){const wi=weekInfo(),w=wi.w,p=phaseOfWeek(w),k=p===0?w-1:p===1?w-4:0;return {w,p,k,c:wi.cycle,v:(wi.cycle-1)%3}}
function autoK(d,id,ctx){if(ctx.p>1)return {k:ctx.k};
  const last=journal.filter(e=>e&&e.kind==="log"&&e.day===d&&e.cycle===ctx.c&&e.phase===ctx.p).sort((a,b)=>b.ts-a.ts)[0];
  const it=last&&(last.done||[]).find(x=>x.id===id);if(!it||typeof it.k!=="number")return {k:ctx.k};
  if(it.done<it.total)return {k:Math.min(ctx.k,it.k),note:`Повтор прошлой нагрузки: в прошлый раз ${it.done} из ${it.total} подходов`};
  if(last.report&&typeof last.report.score==="number"&&last.report.score<=4)return {k:Math.min(ctx.k,it.k),note:"Повтор прошлой нагрузки: прошлая тренировка оценена низко"};
  if(ctx.k>it.k+1)return {k:it.k+1,note:"Шаг придержан: прошлая такая тренировка была больше недели назад"};
  return {k:ctx.k}}
function buildDays(){const ctx=stepCtx();const A=x=>[x,x,x,x];
  return DAY_META.map((m,d)=>({t:m.t,d:m.d,ex:GEN[d].map(g=>{const probe=g({...ctx});const a=autoK(d,probe.id,ctx);const e=a.k===ctx.k?probe:g({...ctx,k:a.k});
    return {...e,k:a.k,note:a.note||"",rx:A(e.rx),per:A(e.per),s:A(e.s),r:A(e.r),hold:e.hold?A(e.hold):undefined,emom:e.emom?A(e.emom):undefined}})}))}
DAYS=buildDays();
const findEntry=id=>(R&&R.entry&&R.entry.id===id)?R.entry:journal.find(x=>x.id===id);
(async()=>{try{const c=window.claude;if(!c)return;
  const [db,user,sample]=await Promise.all([c.use("db"),c.use("user"),c.use("sample")]);
  if(sample){SAMPLE=sample;const l=await sample.limits().catch(()=>null);IMG=(l&&l.images)||null}
  if(db&&user){UID=await user.id().catch(()=>null);if(UID){DB=db;
    const s=await col().doc("settings").get().catch(()=>null);
    if(s&&s.exists&&s.data().cycleStart){cycleStart=Math.max(FIRST_START,s.data().cycleStart);save("cycleStart",cycleStart);if(cycleStart!==s.data().cycleStart)syncSettings();st.phase=phaseOfWeek(weekInfo().w)}else syncSettings();
    const local=load("journal",[]);for(const e of local){try{await col().doc(e.id).set(e)}catch(err){}}if(local.length)save("journal",[]);
    col().where("kind","==","log").orderBy("ts","desc").limit(60).onSnapshot(sn=>{journal=sn.docs.map(d=>d.data());if(!R&&!BUSY)render()},()=>{})}}
  if(!R&&!BUSY)render()}catch(e){}})();
const key=(p,d,i)=>{const wi=weekInfo();return `${wi.cycle}.${wi.w}-${d}-${i}`};
const getM=(p,d,i)=>marks[key(p,d,i)]||[];
function mark(p,d,i,j){const m=getM(p,d,i);if(!m.includes(j)){m.push(j);marks[key(p,d,i)]=m;save("marks",marks)}}
function chip(w){return w===0?'<span class="chip kbw">своё тело</span>':`<span class="chip k${w}">${w} кг</span>`}
function figSvg(id,cls="fig"){return `<svg class="${cls}" viewBox="0 -16 120 140" data-fig="${id}" role="img" aria-label="Схема движения"></svg>`}
function fmt(s){s=Math.max(0,s);return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")}
function restTxt(s){return s>=120?(s/60)+" мин":s+" с"}
function estimate(d,p){let t=0;WU(d).forEach(w=>t+=w.hold||40);CD(d).forEach(c=>t+=c.hold||40);
  DAYS[d].ex.forEach(e=>{const n=e.s[p];if(e.emom){t+=n*60+e.r[p];return}const work=e.hold?e.hold[p]:e.ws||40;t+=n*work+n*e.r[p]});t-=50;return Math.round(t/60)}

/* ---------- план ---------- */
function seg(){const wi=weekInfo();
  $("#weeklbl").textContent=`Неделя ${wi.w} из 8${wi.cycle>1?` · цикл ${wi.cycle}`:""}`;
  $("#phases").innerHTML=PHASES.map((p,i)=>`<button aria-pressed="${i===st.phase}" data-p="${i}">${p.n}<small>${p.s}</small></button>`).join("");
  $("#days").innerHTML=DAYS.map((d,i)=>`<button aria-pressed="${i===st.day}" data-d="${i}">${d.d}<small>День ${i+1}</small></button>`).join("");
}
function howBlock(o){return `<div class="howbox">${figSvg(o.fig)}<div><ol>${o.how.map(h=>`<li>${h}</li>`).join("")}</ol>${o.sw?`<p class="sw">${o.sw}</p>`:""}</div></div>`}
const SLOGANS=[
 ["Жим не врёт.","Тяни себя вверх, железо — над головой.","Строгий жим. Без ног, без вранья.","Подбородок над перекладиной. Каждый раз."],
 ["Таз — двигатель. Гиря — пассажир.","Двадцать махов в минуту. Без торга.","Рывок не любит сомнений.","Мах тазом, не коленями."],
 ["Присед до дна. Колени по линии носков.","Шаг назад — и встал сильнее.","Ноги делают тело. Тяга делает спину.","Пятки в пол, грудь вперёд."],
 ["Гири на пол — только после круга.","Дыши носом. Терпи зубами.","Круг за кругом.","Комплекс не спрашивает, устал ли ты."]];
const PHASE_SLOGAN={2:["Неделя 7. Самое тяжёлое — сейчас.","Пик. Техника важнее цифр."],3:["Разгрузка — тоже работа.","Меньше железа сегодня — больше завтра."]};
function slogan(){const doy=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/864e5);
  if(st.day===9)return "Целые колени — долгая дорога.";
  const pool=PHASE_SLOGAN[st.phase]||SLOGANS[st.day];return pool[doy%pool.length]}
const KB='<svg class="kbi" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.5c-3 0-5.2 1.9-5.2 4.6 0 1 .3 1.8.8 2.6A7.5 7.5 0 0 0 4 15.6C4 19.2 7.6 21.5 12 21.5s8-2.3 8-5.9a7.5 7.5 0 0 0-3.6-5.9c.5-.8.8-1.6.8-2.6C17.2 4.4 15 2.5 12 2.5Zm0 2.6c1.5 0 2.6.8 2.6 2 0 .8-.6 1.7-1.6 2.3h-2c-1-.6-1.6-1.5-1.6-2.3 0-1.2 1.1-2 2.6-2Z" fill-rule="evenodd"/></svg>';
function render(){if(BUSY)return;
  if(!R)DAYS=buildDays();
  seg();const sg=document.getElementById("slogan");if(sg)sg.textContent=slogan();const v=$("#view");
  if(st.day===9){v.innerHTML=rules();$("#startbar").hidden=true;return}
  $("#startbar").hidden=false;
  const D=DAYS[st.day],p=st.phase;
  const anyDone=D.ex.some((e,i)=>getM(p,st.day,i).length);
  const allDone=D.ex.every((e,i)=>getM(p,st.day,i).length>=e.s[p]);
  let h=`<div class="dayhead"><div class="label">День ${st.day+1} · ${D.d} · ≈ ${estimate(st.day,p)} мин с разминкой</div><h2>${D.t}</h2>
  ${Date.now()<cycleStart?`<div class="note" style="margin:0">Старт программы — понедельник, 12 октября. До этого — восстановление.</div>`:""}
  <div class="meta">${PHASES[p].s}${p<2?`, шаг ${stepCtx().k+1} из 3`:""}${p===3?": объём вдвое меньше, без отказа.":p===2?": самая тяжёлая неделя, техника важнее цифр.":""} Цикл ${stepCtx().c}, ${VARIANT_NAME[stepCtx().v]} набор упражнений.</div></div>`;
  h+=`<details class="block"><summary><b style="color:var(--ink)">Разминка ~6 мин</b> · под сегодняшние упражнения</summary><ul style="margin-top:8px">${WU(st.day).map(w=>`<li>${w.n} <span>${w.per}</span></li>`).join("")}</ul></details>`;
  h+=`<div class="list">`;
  D.ex.forEach((e,i)=>{const n=e.s[p],m=getM(p,st.day,i),done=m.length>=n;
    h+=`<article class="ex${done?" done":""}">
      <div class="ex-top"><div class="idx">${L(i)}</div><div style="min-width:0"><div class="ex-name">${e.n}</div>
      <div class="chips">${e.w.map(chip).join("")}${e.fin?`<span class="chip finc">${e.fin}</span>`:""}</div></div></div>
      <div><div class="rx">${e.rx[p]}</div><div class="rest">Отдых ${restTxt(e.r[p])}</div>${e.note?`<div class="note">${e.note}</div>`:""}</div>
      <div class="dots" role="group" aria-label="Отметки подходов">${Array.from({length:n},(_,j)=>`<button class="dot${m.includes(j)?" on":""}" data-ex="${i}" data-j="${j}" aria-pressed="${m.includes(j)}" aria-label="Подход ${j+1}">${j+1}</button>`).join("")}</div>
      <details><summary>Как делать</summary>${howBlock(e)}</details>
    </article>`});
  h+=`</div>`;
  h+=`<details class="block"><summary><b style="color:var(--ink)">Заминка ~3,5 мин</b> · под сегодняшние упражнения</summary><ul style="margin-top:8px">${CD(st.day).map(w=>`<li>${w.n} <span>${w.per}</span></li>`).join("")}</ul></details>`;
  h+=`<div class="foot"><button class="btn" id="clr">Сбросить отметки дня</button></div>`;
  h+=journalHtml();
  if(IS_PWA)h+=settingsHtml();
  v.innerHTML=h;
  $("#startbar").innerHTML=`<button id="go"><span class="gt">${allDone?"Всё выполнено — пройти заново":anyDone?KB+"Продолжить тренировку":KB+"Начать тренировку"}</span><small>${anyDone&&!allDone?"с первого незакрытого подхода, без разминки":"разминка → подходы с отдыхом → заминка"}</small></button>`;
}
function rules(){
  return `<div class="dayhead"><div class="label">Как беречь колени</div><h2>Правила и неделя</h2></div>
  <div class="block rules"><h3>Неделя</h3>
  <div class="tw"><table><tr><th>День</th><th>Что</th></tr>
  <tr><td>Пн</td><td>День 1. Жим и подтягивания</td></tr><tr><td>Вт</td><td>День 2. Махи и рывок</td></tr>
  <tr><td>Ср</td><td>Лёгкий день 15 мин: гало, кошка-корова, вис, прогулка</td></tr>
  <tr><td>Чт</td><td>День 3. Тяги и ноги без коленей</td></tr><tr><td>Пт</td><td>День 4. Комплекс 2×16</td></tr>
  <tr><td>Сб</td><td>Лёгкий день или прогулка</td></tr><tr><td>Вс</td><td>Отдых</td></tr></table></div>
  <p>Цикл 8 недель: три недели базы, три недели объёма, неделя пика, неделя разгрузки. Внутри базы и объёма каждая неделя — шаг вперёд: больше повторов, длиннее лестницы или удержания.</p>
  <p>Каждый новый цикл меняет набор упражнений: мах двумя руками → одной рукой → с перехватом, разные хваты в подтягиваниях, взятие и жим одной рукой с 24, другие комплексы. После третьего набора всё начинается с первого, но ты уже сильнее.</p>
  <p>Приложение смотрит в журнал: если в прошлый раз на этом дне не закрыл подходы или тренировка получила оценку 4 и ниже, нагрузку не повышает, а повторяет. На карточке упражнения это помечено.</p></div>
  <div class="block rules"><h3>Что убрано и почему</h3>
  <p>Убраны болгарские выпады, бёрпи, прыжки и скакалку: они бьют по коленям ударом и сдвигом, и они громкие для утра дома. Приседы и классические выпады остаются, но с правилами: колено по линии носка, пятка на полу, заднее колено к полу без удара.</p>
  <p>Взрывная работа и кардио — без отрыва ног от пола: махи и рывки на скорость, взрывные отжимания и подтягивания, интервалы и комплексы на время.</p>
  <div class="block rules"><h3>Светофор боли</h3>
  <p><b>0–2 из 10</b> во время упражнения и прошло к утру: продолжаешь.</p>
  <p><b>3–5 из 10</b> или колено ноет на следующее утро: на этой неделе бери замену из подсказки к упражнению и вес ниже.</p>
  <p class="sw"><b>Отёк, щелчок с болью, подкашивание, острая боль</b>: остановись и покажи колено ортопеду или спортивному врачу. План не заменяет осмотр.</p></div>
  <div class="block rules"><h3>Три правила техники</h3>
  <p>В махах и рывках голень почти вертикальна, колено не уходит вперёд за носок.</p>
  <p>Гирю принимаешь тазом, а не амортизируешь коленями.</p>
  <p>Утром тело холодное: разминку не пропускай.</p></div>`;
}

/* ---------- звук ----------
   Сигналы — короткие WAV, собранные в странице и играемые через <audio>:
   на iPhone такой звук обычно не глушится переключателем беззвучного режима, в отличие от Web Audio. */
let ac=null,wl=null,UNLOCKED=false;let SMODE=load("smode","mix"); // mix: поверх музыки; solo: играет и в беззвучном, но ставит музыку на паузу
const SEQ={ // [частота, старт с, длительность с, громкость]
  tick:[[620,0,.12,.5]],
  go:[[880,0,.18,.7],[880,.25,.18,.7],[1320,.5,.5,.8]],
  start:[[740,0,.15,.45]],
  rest:[[520,0,.25,.5],[390,.2,.35,.5]],
  stop:[[990,0,.25,.7],[660,.3,.4,.7]],
  fin:[[660,0,.3,.7],[880,.18,.3,.7],[1100,.36,.3,.7],[1320,.54,.4,.8]]
};
function wav(seq){const sr=22050,len=Math.ceil(sr*(Math.max(...seq.map(x=>x[1]+x[2]))+.05)),buf=new Float32Array(len);
  for(const [f,st,d,v] of seq){const a=Math.floor(st*sr),n=Math.floor(d*sr);for(let i=0;i<n&&a+i<len;i++){const t=i/sr;
    const env=Math.min(1,i/(sr*.005))*Math.exp(-3.2*t/d);const sq=Math.sin(2*Math.PI*f*t)>0?1:-1;buf[a+i]+=v*env*(.55*Math.sin(2*Math.PI*f*t)+.45*sq)}}
  const b=new ArrayBuffer(44+len*2),dv=new DataView(b),ws=(o,x)=>{for(let i=0;i<x.length;i++)dv.setUint8(o+i,x.charCodeAt(i))};
  ws(0,"RIFF");dv.setUint32(4,36+len*2,true);ws(8,"WAVE");ws(12,"fmt ");dv.setUint32(16,16,true);dv.setUint16(20,1,true);dv.setUint16(22,1,true);
  dv.setUint32(24,sr,true);dv.setUint32(28,sr*2,true);dv.setUint16(32,2,true);dv.setUint16(34,16,true);ws(36,"data");dv.setUint32(40,len*2,true);
  for(let i=0;i<len;i++)dv.setInt16(44+i*2,Math.max(-1,Math.min(1,buf[i]*.9))*32767,true);
  let bin="";const u=new Uint8Array(b);for(let i=0;i<u.length;i+=8192)bin+=String.fromCharCode.apply(null,u.subarray(i,i+8192));
  return "data:audio/wav;base64,"+btoa(bin)}
const AUD={};
let AUDI=false;function initAud(){if(AUDI)return;AUDI=true;try{for(const k in SEQ){const a=new Audio(wav(SEQ[k]));a.preload="auto";a.setAttribute("playsinline","");AUD[k]=a}}catch(e){}}
function audio(){ // вызывается из нажатия: разблокирует звук на iOS
  try{if(navigator.audioSession)navigator.audioSession.type=SMODE==="mix"?"ambient":"playback"}catch(e){}
  if(SMODE==="solo")initAud();
  if(SMODE==="solo"&&!UNLOCKED){UNLOCKED=true;for(const k in AUD){const a=AUD[k];try{a.muted=true;const p=a.play();if(p&&p.then)p.then(()=>{a.pause();a.currentTime=0;a.muted=false}).catch(()=>{a.muted=false});else{a.pause();a.muted=false}}catch(e){}}}
  try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==="suspended")ac.resume()}catch(e){}}
function tone(f,d,at=0,vol=.35){try{if(!ac)return;if(ac.state!=="running"){ac.resume();if(ac.state!=="running")return}const t=ac.currentTime+at,o=ac.createOscillator(),g=ac.createGain();
  o.type="square";o.frequency.value=f;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+d+.02)}catch(e){}}
function play(k){if(SMODE==="mix"){SEQ[k].forEach(([f,st,d,v])=>tone(f,d,st,v*.6));return}
  initAud();const a=AUD[k];let ok=false;
  if(a){try{a.muted=false;a.currentTime=0;const p=a.play();ok=true;if(p&&p.catch)p.catch(()=>{SEQ[k].forEach(([f,st,d,v])=>tone(f,d,st,v*.5))})}catch(e){ok=false}}
  if(!ok)SEQ[k].forEach(([f,st,d,v])=>tone(f,d,st,v*.5))}
function vib(p){try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
const SND={
  tick:()=>{play("tick");vib(80)},
  go:()=>{play("go");vib([200,100,200,100,400])},
  start:()=>{play("start")},
  rest:()=>{play("rest")},
  stop:()=>{play("stop");vib([300,120,300])},
  fin:()=>{play("fin");vib([300,100,300,100,600])}
};
async function wake(){try{if(!wl){wl=await navigator.wakeLock.request("screen");wl.addEventListener("release",()=>{wl=null})}}catch(e){}}
function unwake(){try{wl&&wl.release()}catch(e){}wl=null}

/* ---------- сценарий тренировки ---------- */
let R=null,TICK=null;
function build(d,p){
  const D=DAYS[d],q=[];const anyDone=D.ex.some((e,i)=>getM(p,d,i).length);
  const allDone=D.ex.every((e,i)=>getM(p,d,i).length>=e.s[p]);
  if(allDone){D.ex.forEach((_,i)=>delete marks[key(p,d,i)]);save("marks",marks)}
  if(!anyDone||allDone){WU(d).forEach((w,i)=>q.push({k:"warm",i}));q.push({k:"rest",sec:15,label:"Готовься к основной части"})}
  D.ex.forEach((e,i)=>{const n=e.s[p],m=getM(p,d,i);
    if(e.emom){if(m.length<n){q.push({k:"emom",ex:i,min:n,off:m.length});q.push({k:"rest",sec:e.r[p]})}}
    else for(let j=0;j<n;j++)if(!m.includes(j)){q.push({k:"set",ex:i,set:j});q.push({k:"rest",sec:e.r[p]})}});
  if(q.length&&q[q.length-1].k==="rest")q.pop();
  q.push({k:"rest",sec:10,label:"Заминка"});
  CD(d).forEach((c,i)=>q.push({k:"cool",i}));
  q.push({k:"done"});
  return q}
function nextWork(i){for(let k=i+1;k<R.q.length;k++)if(R.q[k].k!=="rest")return R.q[k];return null}
function stepItem(s){if(s.k==="warm")return WU(R.d)[s.i];if(s.k==="cool")return CD(R.d)[s.i];if(s.k==="set"||s.k==="emom")return DAYS[R.d].ex[s.ex];return null}
function holdOf(s){const it=stepItem(s);if(!it)return 0;if(s.k==="set")return it.hold?it.hold[R.p]:0;return it.hold||0}

function startWorkout(){audio();wake();DAYS=buildDays();
  R={d:st.day,p:st.phase,q:build(st.day,st.phase),i:-1,t0:Date.now(),paused:false};
  $("#run").hidden=false;document.body.style.overflow="hidden";enter(0)}
function enter(i,quiet){R.i=i;const s=R.q[i];R.started=Date.now();R.lb=null;R.cur=undefined;
  if(!s){return}
  if(s.k==="rest"){R.end=Date.now()+s.sec*1000}
  else if(s.k==="emom"){R.end=null}
  else if(s.k==="done"){SND.fin();unwake();clearInterval(TICK);TICK=null;
    R.entry={id:"log-"+Date.now(),kind:"log",ts:Date.now(),date:new Date().toISOString(),day:R.d,phase:R.p,week:weekInfo().w,cycle:weekInfo().cycle,
      min:Math.max(1,Math.round((Date.now()-R.t0)/60000)),planMin:estimate(R.d,R.p),
      done:DAYS[R.d].ex.map((e,k)=>({id:e.id,k:e.k,n:e.n,rx:e.rx[R.p],done:Math.min(getM(R.p,R.d,k).length,e.s[R.p]),total:e.s[R.p]}))};
    saveEntry(R.entry);draw();return}
  else{const h=holdOf(s);R.end=h?Date.now()+h*1000:null}
  if(!quiet&&s.k!=="rest")SND.start();
  draw();clearInterval(TICK);TICK=setInterval(tick,200);tick()}
function advance(quiet){if(R.i+1<R.q.length)enter(R.i+1,quiet)}
function completeWork(quiet){const s=R.q[R.i];if(s.k==="set")mark(R.p,R.d,s.ex,s.set);
  const nx=R.q[R.i+1];if(!quiet&&nx&&nx.k==="rest")SND.rest();advance(quiet)}
function tick(){if(!R||R.paused)return;const s=R.q[R.i];if(!s)return;const now=Date.now(),c=$("#clk");if(!c)return;
  if(s.k==="emom"){const el=now-R.started,min=Math.floor(el/60000),left=60-Math.floor((el%60000)/1000);
    if(R.cur===undefined)R.cur=min;
    if(min!==R.cur){for(let k=R.cur;k<min;k++)mark(R.p,R.d,s.ex,s.off+k);R.cur=min;
      if(s.off+min>=s.min){SND.stop();advance(true);return}SND.go();draw()}
    if(left<=3&&left>0&&R.lb!==min+"-"+left){R.lb=min+"-"+left;SND.tick()}
    c.textContent=fmt(left);c.className="bigclock"+(left<=5?" hot":" work");
    $("#clsub").textContent=`минута ${s.off+min+1} из ${s.min}`;
    $("#prog-in").style.width=progress()+"%";return}
  if(R.end){const left=Math.ceil((R.end-now)/1000);c.textContent=fmt(left);
    c.className="bigclock"+(left<=5?" hot":(s.k==="rest"?" rest":" work"));
    if(left<=3&&left>0&&R.lb!==left){R.lb=left;SND.tick()}
    if(left<=0){if(s.k==="rest"){SND.go();advance(true)}else{SND.stop();completeWork(true)}}}
  else{c.textContent=fmt(Math.floor((now-R.started)/1000));c.className="bigclock work"}}
function progress(){return Math.round(100*R.i/(R.q.length-1))}
function draw(){const s=R.q[R.i],box=$("#run");
  const D=DAYS[R.d];let stage="",title="",per="",fig="",how=[],sw="",next="",btns="",sub="";
  const nx=R.q[R.i+1];
  if(s.k==="warm"||s.k==="cool"){const it=stepItem(s),arr=s.k==="warm"?WU(R.d):CD(R.d);
    stage=`${s.k==="warm"?"Разминка":"Заминка"} · ${s.i+1} из ${arr.length}`;title=it.n;per=it.per;fig=it.fig;how=it.how;
    sub=it.hold?"таймер, дальше само":"время упражнения";
    btns=it.hold?`<button data-r="skip">Дальше</button>`:`<button class="main" data-r="done">Выполнено</button>`}
  else if(s.k==="set"){const e=D.ex[s.ex],h=holdOf(s);
    stage=`${e.fin||L(s.ex)} · ${e.s[R.p]>1?`подход ${s.set+1} из ${e.s[R.p]}`:"один заход"}`;title=e.n;per=e.per[R.p];fig=e.fig;how=e.how;sw=e.sw||"";
    sub=h?(e.fin&&!/статика/.test(e.fin)?"работай до сигнала":"держи, сигнал сам скажет, когда хватит"):"время подхода";
    btns=h?`<button data-r="early">Закончить раньше</button>`:
      (nx&&nx.k==="rest"&&!nx.label?`<button class="main restc" data-r="done">Отдых ${restTxt(nx.sec)}</button>`:`<button class="main" data-r="done">Готово</button>`)}
  else if(s.k==="emom"){const e=D.ex[s.ex];stage=`${L(s.ex)} · EMOM ${s.min} мин`;title=e.n;per=e.per[R.p];fig=e.fig;how=e.how;sw=e.sw||"";
    sub="";btns=`<button data-r="skipemom">Закончить EMOM</button>`}
  else if(s.k==="rest"){const w=nextWork(R.i),it=w&&stepItem(w);
    stage=s.label||"Отдых";
    if(w&&(w.k==="set"||w.k==="emom")){const e=D.ex[w.ex];title=`Дальше: ${e.n}`;
      per=w.k==="emom"?`EMOM ${w.min} мин · ${e.per[R.p]}`:`Подход ${w.set+1} из ${e.s[R.p]} · ${e.per[R.p]}`;fig=e.fig;how=e.how}
    else if(it){title=`Дальше: ${it.n}`;per=it.per;fig=it.fig;how=it.how}
    sub="отдых, сигнал перед подходом";btns=`<button data-r="plus">+15 с</button><button class="main" data-r="skip">Начать сейчас</button>`}
  else if(s.k==="done"){const e=R.entry;
    box.innerHTML=`<div class="run-top"><div class="run-row"><span class="stage">Готово · записано в журнал</span></div><div class="prog"><i style="width:100%"></i></div></div>
    <div class="run-mid"><h2>Тренировка выполнена</h2><div class="per">${e.min} мин · план ≈ ${e.planMin} мин</div>
    <p class="nextup" style="margin:0">Сними итог тренировки в Фитнесе на часах или телефоне (1–3 скриншота с пульсом и калориями) и загрузи сюда для разбора. Можно и позже, из журнала.</p>
    ${uploaderHtml(e.id)}</div>
    <div class="run-bot"><div class="run-bot-in"><div class="rbtns"><button class="main" data-r="close">Закрыть</button></div></div></div>`;return}
  box.innerHTML=`<div class="run-top"><div class="run-row"><span class="stage${s.k==="rest"?" rest":""}">${stage}</span><button class="xbtn" data-r="pause">Пауза</button></div>
   <div class="prog"><i id="prog-in" style="width:${progress()}%"></i></div></div>
   <div class="run-mid">${fig?figSvg(fig,"run-fig"):""}<h2>${title}</h2><div class="per">${per}</div>
   ${how.length?`<ol>${how.map(h=>`<li>${h}</li>`).join("")}</ol>`:""}${sw?`<p class="sw" style="margin:0;font-size:14px">${sw}</p>`:""}
   <div id="pausebox"></div></div>
   <div class="run-bot"><div class="run-bot-in"><div class="bigclock" id="clk">0:00</div><div class="cl-sub" id="clsub">${sub}</div><div class="rbtns">${btns}</div></div></div>`;
  animate(performance.now(),true)}
function pause(){if(!R)return;R.paused=!R.paused;const now=Date.now();
  if(R.paused){R.pauseAt=now;$("#pausebox").innerHTML=`<div class="pausebox"><b>Пауза</b><div class="rbtns"><button data-r="pause">Продолжить</button><button data-r="quit">Закончить</button></div><button class="btn ghost" id="snd">Проверить звук</button><span class="nextup">Сделанные подходы сохранены. Потом можно продолжить с того же места без разминки.</span></div>`}
  else{const dt=now-R.pauseAt;R.started+=dt;if(R.end)R.end+=dt;$("#pausebox").innerHTML="";tick()}}
function finishClose(){if(R&&R.entry){DAYS[R.d].ex.forEach((_,i)=>delete marks[key(R.p,R.d,i)]);save("marks",marks)}if(ANCTL)ANCTL.abort();quit()}
function quit(){clearInterval(TICK);TICK=null;R=null;unwake();$("#run").hidden=true;$("#run").innerHTML="";document.body.style.overflow="";render()}


/* ---------- анимация схем ---------- */
let lastA=0;
function animate(t,force){if(!force&&(document.hidden||(R&&R.paused))){requestAnimationFrame(animate);return}
  if(force||t-lastA>40){lastA=t;const inRun=!$("#run").hidden;
  document.querySelectorAll("svg[data-fig]").forEach(el=>{if(inRun&&!el.closest("#run"))return;const det=el.closest("details");if(det&&!det.open)return;
    const f=FIGS[el.dataset.fig];if(f)el.innerHTML=drawFigPro(f,poseAt(f,t),poseAt(f,t-140),el.dataset.fig)})}
  if(!force)requestAnimationFrame(animate)}
requestAnimationFrame(animate);

/* ---------- события ---------- */
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&R){wake();tick()}});
document.addEventListener("click",ev=>{const b=ev.target.closest("button");if(!b)return;
  if(b.dataset.r){const a=b.dataset.r;
    if(a==="done"){audio();completeWork()}
    else if(a==="early"){completeWork()}
    else if(a==="skip"){const s=R.q[R.i];if(s.k==="rest"){SND.go();advance(true)}else advance()}
    else if(a==="skipemom"){const s=R.q[R.i];const el=Date.now()-R.started,min=Math.floor(el/60000);for(let k=0;k<=min&&s.off+k<s.min;k++)mark(R.p,R.d,s.ex,s.off+k);advance()}
    else if(a==="plus"){if(R.end){R.end+=15000;tick()}}
    else if(a==="pause")pause();
    else if(a==="quit")quit();
    else if(a==="close")finishClose();
    return}
  if(b.dataset.sm){SMODE=b.dataset.sm;save("smode",SMODE);UNLOCKED=false;try{if(ac){ac.close();ac=null}}catch(e){}soundUi();audio();setTimeout(()=>SND.go(),80)}
  else if(b.id==="snd"){audio();setTimeout(()=>SND.go(),60);const n=$("#sndnote");if(n)n.hidden=false}
  else if(b.id==="go"){startWorkout()}
  else if(b.dataset.p){setWeek(FIRSTW[+b.dataset.p])}
  else if(b.dataset.w){setWeek(weekInfo().w+(+b.dataset.w))}
  else if(b.dataset.an){analyze(b.dataset.an)}
  else if(b.dataset.stop){if(ANCTL)ANCTL.abort()}
  else if(b.dataset.del){DELP=b.dataset.del;render()}
  else if(b.dataset.delno){DELP=null;render()}
  else if(b.dataset.delok){delEntries([b.dataset.delok])}
  else if(b.dataset.delall){if(b.dataset.delall==="ask"){DELP="*";render()}else delEntries(journal.filter(x=>x&&x.kind==="log").map(x=>x.id))}
  else if(b.dataset.redo){const e=findEntry(b.dataset.redo);if(e){const c={...e};delete c.report;saveEntry(c).then(()=>{OPEN.add(c.id);render()})}}
  else if(b.dataset.d){st.day=+b.dataset.d;if(st.day!==9)save("day",st.day);render()}
  else if(b.dataset.ex){const k=key(st.phase,st.day,b.dataset.ex),j=+b.dataset.j;let m=marks[k]||[];m=m.includes(j)?m.filter(x=>x!==j):[...m,j];marks[k]=m;save("marks",marks);render()}
  else if(b.id==="clr"){DAYS[st.day].ex.forEach((_,i)=>delete marks[key(st.phase,st.day,i)]);save("marks",marks);render()}
});
document.addEventListener("toggle",ev=>{const t=ev.target;if(t.dataset&&t.dataset.jid){t.open?OPEN.add(t.dataset.jid):OPEN.delete(t.dataset.jid)}animate(performance.now(),true)},true);
document.addEventListener("change",ev=>{const inp=ev.target;if(!inp.dataset||!inp.dataset.file)return;const id=inp.dataset.file;
  const max=IMG?IMG.maxCount:3;FILES[id]=Array.from(inp.files||[]).slice(0,Math.min(3,max));
  const th=document.getElementById("th-"+id);if(th){th.innerHTML="";FILES[id].forEach(f=>{const im=document.createElement("img");im.alt="Скриншот";try{im.src=URL.createObjectURL(f)}catch(e){}th.appendChild(im)})}
  const fn=document.getElementById("fn-"+id);if(fn)fn.textContent=FILES[id].length?`Выбрано: ${FILES[id].length}`:"Ничего не выбрано";
  const btn=document.querySelector(`[data-an="${id}"]`);if(btn)btn.disabled=!FILES[id].length});
render();

/* ---------- журнал и разбор тренировки ---------- */
function esc(x){return String(x??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function scClass(n){return n>=8?"sc":n>=5?"sc mid":"sc low"}
function journalHtml(){const list=journal.filter(e=>e&&e.kind==="log").slice(0,20);
  let h=`<section class="block"><h3>Журнал</h3>`;
  if(!list.length)h+=`<p class="nextup" style="margin:0">Пока пусто. Тренировка попадает сюда сама, когда пройдёшь её до конца кнопкой «Начать тренировку».</p>`;
  list.forEach(e=>{const d=new Date(e.date||e.ts);const sc=e.report&&typeof e.report.score==="number"?e.report.score:null;
    h+=`<details class="jr" data-jid="${esc(e.id)}"${OPEN.has(e.id)?" open":""}><summary><b>${d.toLocaleDateString("ru-RU",{day:"numeric",month:"short"})}</b> День ${e.day+1} · ${esc(DAYS[e.day]?DAYS[e.day].t:"")} · ${e.min} мин ${sc!==null?`<span class="${scClass(sc)}">${sc}/10</span>`:""}</summary>
    <div class="nextup" style="margin-top:6px">Неделя ${e.week||"?"}, ${PHASES[e.phase]?PHASES[e.phase].s.toLowerCase():""}. Подходы: ${(e.done||[]).map(x=>`${esc(x.n)} ${x.done}/${x.total}`).join(" · ")}</div>
    ${e.report?reportHtml(e.report)+`<div class="up"><button class="btn ghost" data-redo="${esc(e.id)}">Оценить заново</button></div>`:uploaderHtml(e.id)}
    <div class="up">${DELP===e.id?`<span class="nextup">Удалить эту тренировку из журнала?</span><button class="btn solid" data-delok="${esc(e.id)}">Да, удалить</button><button class="btn ghost" data-delno="1">Нет</button>`:`<button class="btn ghost" data-del="${esc(e.id)}">Удалить запись</button>`}</div></details>`});
  if(list.length)h+=`<div class="up" style="border-top:1px dashed rgba(240,122,30,.25);padding-top:10px">${DELP==="*"?`<span class="nextup">Удалить весь журнал (записей: ${list.length})?</span><button class="btn solid" data-delall="ok">Да, очистить</button><button class="btn ghost" data-delno="1">Нет</button>`:`<button class="btn ghost" data-delall="ask">Очистить журнал</button>`}</div>`;
  return h+`</section>`}
async function delEntries(ids){BUSY=true;journal=journal.filter(x=>!ids.includes(x.id));
  if(DB){for(const id of ids){try{await col().doc(id).delete()}catch(e){}}}else save("journal",journal);
  ids.forEach(id=>OPEN.delete(id));DELP=null;BUSY=false;render()}
function canAnalyze(){if(!ANALYSIS)return false;return (SAMPLE&&IMG)||(IS_PWA&&!!API.key())}
function uploaderHtml(id){
  if(!ANALYSIS)return "";
  if(!canAnalyze())return IS_PWA?`<p class="nextup" style="margin-top:8px">Чтобы разбирать скриншоты, добавь ключ Claude API в настройках внизу страницы.</p>`:`<p class="nextup" style="margin-top:8px">Разбор по скриншотам работает, когда приложение открыто в Claude.</p>`;
  const acc=(SAMPLE&&IMG)?IMG.mediaTypes.join(","):"image/*";
  return `<div class="up"><label class="btn upl">Выбрать скриншоты<input type="file" accept="${acc}" multiple hidden data-file="${esc(id)}"></label>
  <button class="btn solid" data-an="${esc(id)}" ${FILES[id]&&FILES[id].length?"":"disabled"}>Оценить тренировку</button>
  <span class="nextup" id="fn-${esc(id)}">1–3 скриншота из Фитнеса</span></div><div class="thumbs" id="th-${esc(id)}"></div><div id="rep-${esc(id)}"></div>`}
function num(v,u){return (v===null||v===undefined||v==="")?"—":esc(v)+(u?` ${u}`:"")}
function reportHtml(r){const m=r.metrics||{};const li=a=>Array.isArray(a)&&a.length?`<ul>${a.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:"";
  return `<div class="report"><div class="rhead"><div class="rscore">${num(r.score)}<small>/10</small></div><p><b>${esc(r.verdict)}</b></p></div>
  <div class="mgrid"><div><b>${num(m.duration_min)}</b><span>минут</span></div><div><b>${num(m.active_kcal)}</b><span>активные ккал</span></div>
  <div><b>${num(m.total_kcal)}</b><span>всего ккал</span></div><div><b>${num(m.hr_avg)}</b><span>пульс средний</span></div><div><b>${num(m.hr_max)}</b><span>пульс макс</span></div></div>
  ${m.hr_zones?`<p class="nextup">Зоны: ${esc(m.hr_zones)}</p>`:""}
  <p>${esc(r.summary)}</p>
  ${li(r.good)?`<h4>Получилось</h4>${li(r.good)}`:""}${li(r.improve)?`<h4>Подтянуть</h4>${li(r.improve)}`:""}
  ${r.next_time?`<h4>В следующий раз</h4><p>${esc(r.next_time)}</p>`:""}${r.recovery?`<h4>Восстановление</h4><p>${esc(r.recovery)}</p>`:""}</div>`}
const DTYPE=["сила: взятие с жимом и подтягивания, отдых между подходами; высокий пульс не цель",
 "баллистика и кондиции: EMOM махов и рывков; ожидается высокий пульс и много времени в зонах 3–4",
 "сила задней поверхности и спины в умеренном темпе плюс статика; пульс умеренный",
 "плотный комплекс и лестница: силовая выносливость; ожидается высокий средний пульс"];
function buildPrompt(e){const D=DAYS[e.day];
  const prev=journal.filter(x=>x.kind==="log"&&x.day===e.day&&x.id!==e.id&&x.report).slice(0,3)
    .map(x=>{const m=x.report.metrics||{};return `- ${new Date(x.date||x.ts).toLocaleDateString("ru-RU")}: ${x.min} мин, неделя ${x.week}, пульс ср ${m.hr_avg??"?"}/макс ${m.hr_max??"?"}, активные ккал ${m.active_kcal??"?"}, оценка ${x.report.score}`}).join("\n")||"нет данных";
  return `Ты тренер по гиревому спорту и силовой подготовке. На изображениях 1–3 скриншота из Apple Fitness или «Активности» (Apple Watch) с итогами утренней тренировки. Ниже план этой тренировки и что выполнено.

Атлет: продвинутый уровень с гирями, тренируется для себя, по утрам, обычно 40–50 минут вместе с разминкой и заминкой (это норма, не перебор). Колени нужно беречь: в программе нет прыжков, бёрпи и болгарских выпадов; приседы и классические выпады есть, с контролем техники.

Тренировка: день ${e.day+1} «${D.t}». Неделя ${e.week} из 8, фаза «${PHASES[e.phase].s}». Характер: ${DTYPE[e.day]}.
План и выполнение:
${(e.done||[]).map(x=>`- ${x.n}: план ${x.rx}; подходов ${x.done} из ${x.total}`).join("\n")}
Длительность по таймеру приложения: ${e.min} мин (план около ${e.planMin} мин, с разминкой и заминкой).
Прошлые тренировки этого же дня:
${prev}

Задача:
1. Считай цифры со скриншотов. Если показателя не видно, ставь null. Ничего не придумывай. Если на картинках нет данных тренировки, так и скажи в verdict и поставь score null.
2. Оцени качество тренировки с учётом её характера. В силовые дни невысокий средний пульс нормален. Калории Apple Watch в работе с гирями считает неточно, не делай их главным критерием.
3. Если есть прошлые тренировки этого дня, сравни.
4. Пиши по-русски, коротко и прямо, без похвалы ради похвалы. Если что-то выглядит слабо или подозрительно (например, пульс слишком низкий для EMOM, время сильно больше плана), скажи об этом.

Ответь только JSON такого вида:
{"metrics":{"duration_min":number|null,"active_kcal":number|null,"total_kcal":number|null,"hr_avg":number|null,"hr_max":number|null,"hr_zones":"кратко про зоны или null"},"score":число от 1 до 10,"verdict":"одна фраза","summary":"2–3 предложения","good":["до 3 пунктов"],"improve":["до 3 пунктов"],"next_time":"что конкретно изменить в следующий раз","recovery":"один совет по восстановлению"}`}
let ANCTL=null;
function errText(c){return ({not_granted:"Нет разрешения на обращение к Claude из этой страницы.",rate_limited:"Достигнут лимит запросов. Попробуй позже.",
  image_rejected:"Не получилось прочитать картинку. Нужен JPG или PNG.",images_unavailable:"В этом окне нельзя отправлять картинки. Открой приложение в Claude.",
  refused:"Claude не стал разбирать эти картинки. Проверь, что это итог тренировки.",invalid_json:"Ответ пришёл в неверном формате. Попробуй ещё раз.",
  cancelled:"Остановлено.",session_expired:"Нужно заново войти в Claude.",no_key:"Нет ключа Claude API. Добавь его в настройках внизу.",
  bad_key:"Ключ Claude API не подошёл. Проверь его в настройках.",no_credit:"На балансе Claude API нет средств. Пополни баланс на console.anthropic.com.",
  network:"Нет связи с интернетом. Попробуй, когда появится сеть.",bad_model:"Модель недоступна для этого ключа. Проверь название модели в настройках."})[c]||"Не получилось связаться. Попробуй ещё раз."}
async function shrinkImage(file){const url=URL.createObjectURL(file);
  try{const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url});
    const k=Math.min(1,1568/Math.max(img.naturalWidth,img.naturalHeight));const c=document.createElement("canvas");
    c.width=Math.round(img.naturalWidth*k);c.height=Math.round(img.naturalHeight*k);c.getContext("2d").drawImage(img,0,0,c.width,c.height);
    return c.toDataURL("image/jpeg",.85).split(",")[1]}finally{URL.revokeObjectURL(url)}}
function parseJSONLoose(t){try{return JSON.parse(t)}catch(e){}const m=t.match(/```(?:json)?\s*([\s\S]*?)```/);if(m){try{return JSON.parse(m[1])}catch(e){}}
  const a=t.indexOf("{"),b=t.lastIndexOf("}");if(a>=0&&b>a){try{return JSON.parse(t.slice(a,b+1))}catch(e){}}throw {code:"invalid_json"}}
async function askClaude(prompt,files,signal){
  if(SAMPLE&&IMG)return SAMPLE.json(prompt,{images:files,signal,cache:false});
  const key=API.key();if(!key)throw {code:"no_key"};
  const imgs=[];for(const f of files){try{imgs.push(await shrinkImage(f))}catch(e){throw {code:"image_rejected"}}}
  let res;
  try{res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",signal,headers:{"content-type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:API.model(),max_tokens:2000,messages:[{role:"user",content:[...imgs.map(d=>({type:"image",source:{type:"base64",media_type:"image/jpeg",data:d}})),{type:"text",text:prompt+"\n\nОтветь только JSON, без текста вокруг."}]}]})})}
  catch(e){if(signal&&signal.aborted)throw {code:"cancelled"};throw {code:"network"}}
  let body=null;try{body=await res.json()}catch(e){}
  if(!res.ok){const m=(body&&body.error&&body.error.message)||"";
    if(res.status===401||res.status===403)throw {code:"bad_key"};if(res.status===429)throw {code:"rate_limited"};
    if(/credit balance/i.test(m))throw {code:"no_credit"};if(res.status===404||/model/i.test(m))throw {code:"bad_model"};throw {code:"upstream_error"}}
  return parseJSONLoose((body.content||[]).filter(b=>b.type==="text").map(b=>b.text).join(""))}
async function analyze(id){const e=findEntry(id);const files=FILES[id]||[];if(!e||!files.length||!canAnalyze())return;
  const out=document.getElementById("rep-"+id),btn=document.querySelector(`[data-an="${id}"]`);if(btn)btn.disabled=true;
  out.innerHTML=`<div class="report"><p class="nextup">Разбираю скриншоты, обычно 20–60 секунд…</p><div><button class="btn ghost" data-stop="1">Стоп</button></div></div>`;
  ANCTL=new AbortController();BUSY=true;
  try{const r=await askClaude(buildPrompt(e),files,ANCTL.signal);
    if(!r||typeof r!=="object")throw {code:"invalid_json"};
    if(typeof r.score==="string")r.score=parseFloat(r.score);
    const upd={...e,report:{...r,at:Date.now()}};if(R&&R.entry&&R.entry.id===id)R.entry=upd;
    await saveEntry(upd);out.innerHTML=reportHtml(upd.report);delete FILES[id];OPEN.add(id)}
  catch(err){out.innerHTML=`<p class="sw" style="margin-top:8px">${errText(err&&err.code)}</p>`;if(btn)btn.disabled=false}
  finally{BUSY=false;ANCTL=null}}

function soundUi(){const box=document.getElementById("smode");if(!box)return;
  box.innerHTML=`<button aria-pressed="${SMODE==="mix"}" data-sm="mix">Поверх музыки<small>нужно выключить беззвучный</small></button><button aria-pressed="${SMODE==="solo"}" data-sm="solo">Без музыки<small>слышно и в беззвучном</small></button>`}
soundUi();

/* ---------- настройки самостоятельного приложения ---------- */
function settingsHtml(){const k=API.key();
  return `<section class="block" id="settings"><h3>Настройки</h3>
  ${ANALYSIS?`  <div class="label">Разбор скриншотов</div>
  ${k?`<p class="nextup" style="margin:0">Ключ Claude API сохранён: …${esc(k.slice(-4))}</p><div class="up" style="margin-top:0"><button class="btn ghost" data-key="del">Удалить ключ</button></div>`
     :`<p class="nextup" style="margin:0">Нужен ключ Claude API: console.anthropic.com → API Keys. Баланс API оплачивается отдельно от подписки Claude, разбор одной тренировки обычно стоит несколько центов. Ключ хранится только в этом телефоне.</p>
     <div class="up" style="margin-top:0"><input id="apikey" type="password" autocomplete="off" placeholder="sk-ant-…" class="inp"><button class="btn solid" data-key="save">Сохранить</button></div>`}
  <details><summary>Модель</summary><div class="up"><input id="apimodel" class="inp" value="${esc(API.model())}"><button class="btn ghost" data-key="model">Сохранить</button></div></details>
`:""}
  <div class="label" style="margin-top:6px">Журнал</div>
  <p class="nextup" style="margin:0">Журнал хранится в этом телефоне. Если удалить приложение с экрана «Домой», он пропадёт, поэтому время от времени сохраняй копию.</p>
  <div class="up" style="margin-top:0"><button class="btn" data-exp="1">Сохранить копию</button><label class="btn ghost upl">Загрузить копию<input type="file" accept=".json,application/json" hidden data-import="1"></label></div>
  ${NOTE?`<p class="note" style="margin:0">${esc(NOTE)}</p>`:""}</section>`}
async function exportJournal(){const data=JSON.stringify({app:"chugun",version:1,exported:new Date().toISOString(),cycleStart,journal},null,1);
  const name=`chugun-journal-${new Date().toISOString().slice(0,10)}.json`;const file=new File([data],name,{type:"application/json"});
  try{if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:"Журнал Чугун"});return}}catch(e){if(e&&e.name==="AbortError")return}
  const a=document.createElement("a");a.href=URL.createObjectURL(file);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
async function importJournal(file){try{const d=JSON.parse(await file.text());const list=Array.isArray(d)?d:(d.journal||[]);
    const ok=list.filter(x=>x&&x.kind==="log"&&x.id);if(!ok.length){NOTE="В файле нет записей журнала.";render();return}
    const byId=new Map(journal.map(x=>[x.id,x]));ok.forEach(x=>byId.set(x.id,x));
    journal=[...byId.values()].sort((a,b)=>b.ts-a.ts).slice(0,200);save("journal",journal);NOTE=`Загружено записей: ${ok.length}.`;render()}
  catch(e){NOTE="Не получилось прочитать файл. Нужна копия, сохранённая из этого приложения.";render()}}
document.addEventListener("click",ev=>{const b=ev.target.closest("button");if(!b)return;
  if(b.dataset.key==="save"){const v=(document.getElementById("apikey")||{}).value||"";if(v.trim().startsWith("sk-")){try{localStorage.setItem("apiKey",v.trim())}catch(e){}NOTE="Ключ сохранён.";}else NOTE="Ключ должен начинаться с sk-ant-.";render()}
  else if(b.dataset.key==="del"){try{localStorage.removeItem("apiKey")}catch(e){}NOTE="Ключ удалён.";render()}
  else if(b.dataset.key==="model"){const v=((document.getElementById("apimodel")||{}).value||"").trim();try{v?localStorage.setItem("apiModel",v):localStorage.removeItem("apiModel")}catch(e){}NOTE="Модель сохранена.";render()}
  else if(b.dataset.exp){exportJournal()}});
document.addEventListener("change",ev=>{const t=ev.target;if(t&&t.dataset&&t.dataset.import&&t.files&&t.files[0])importJournal(t.files[0])});
if(IS_PWA){const ib=document.getElementById("install");if(ib)ib.hidden=STANDALONE||!/iPhone|iPad|iPod/.test(navigator.userAgent)}
