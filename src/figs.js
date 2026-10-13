const STAND={t:0,a:3,b:-3,u:0,v:0};
const HANG={t:0,a:8,b:-35,u:180,v:180,sh:-4,an:"w",at:[60,0],props:{bar:true,ground:false}};
const PU_TOP={t:-4,a:12,b:-35,u:18,v:172,sh:0,an:"w",at:[60,0],props:{bar:true,ground:false}};
const PUSH_TOP={t:63,a:-63,b:-63,u:0,v:0,an:"f",at:[18,112],props:{handles:true}};
const PUSH_BOT={t:74,a:-74,b:-74,u:-75,v:30,an:"f",at:[18,112],props:{handles:true}};
const ROLL_IN={t:62,a:10,b:-90,u:0,v:0,an:"k",at:[22,112],props:{roller:true}};
const ROLL_OUT={t:80,a:-70,b:-90,u:75,v:75,an:"k",at:[22,112],props:{roller:true}};
const RDL_TOP={t:0,a:4,b:-4,u:0,v:0,an:"f",at:[58,112]};
const RDL_BOT={t:72,a:20,b:-8,u:0,v:0,an:"f",at:[58,112]};
const HIKE={t:62,a:24,b:-10,u:-28,v:-32,an:"f",at:[54,112]};
const SW_TOP={t:-4,a:0,b:0,u:88,v:88,an:"f",at:[54,112]};
const RACK={t:0,a:2,b:-2,u:12,v:168,an:"f",at:[56,112]};
const PRESS={t:-2,a:2,b:-2,u:178,v:180,an:"f",at:[56,112]};
const HANGBELL={t:0,a:3,b:-3,u:0,v:0,an:"f",at:[56,112]};
const ROW_B={t:72,a:24,b:-10,u:0,v:0,u2:38,v2:38,an:"f",at:[50,112]};
const ROW_T={t:72,a:24,b:-10,u:-100,v:-4,u2:38,v2:38,an:"f",at:[50,112]};

const FIGS={
 rdl:{w:24,frames:[{...RDL_TOP,kb:"w",hold:400},{...RDL_BOT,kb:"w",hold:400}]},
 rdl16:{w:16,frames:[{...RDL_TOP,kb:"w",hold:400},{...RDL_BOT,kb:"w",hold:400}]},
 swing16:{w:16,frames:[{...HIKE,kb:"w",hold:120,ms:550},{...SW_TOP,kb:"w",hold:200,ms:550}]},
 swing:{w:24,frames:[{...HIKE,kb:"w",hold:120,ms:550},{...SW_TOP,kb:"w",hold:200,ms:550}]},
 snatch:{w:16,frames:[{...HIKE,kb:"w",hold:120,ms:420},{t:-2,a:0,b:0,u:110,v:200,an:"f",at:[54,112],kb:"w",hold:0,ms:300},{t:-2,a:0,b:0,u:178,v:180,an:"f",at:[54,112],kb:"w",hold:450,ms:600}]},
 cleanpress:{w:16,frames:[{...HANGBELL,kb:"ww",hold:300,ms:500},{...HIKE,an:"f",at:[56,112],kb:"ww",hold:100,ms:450},{...RACK,kb:"ww",hold:450,ms:700},{...PRESS,kb:"ww",hold:450,ms:700},{...RACK,kb:"ww",hold:300,ms:500}]},
 pullup:{w:0,frames:[{...HANG,hold:400,ms:900},{...PU_TOP,hold:400,ms:900}]},
 scap:{w:0,frames:[{...HANG,hold:300,ms:600},{...HANG,sh:3,hold:500,ms:600}]},
 hang:{w:0,frames:[{...HANG,hold:900,ms:900},{...HANG,sh:-2,a:10,hold:900,ms:900}]},
 kneeraise:{w:0,frames:[{...HANG,sh:0,a:6,b:-10,hold:300,ms:800},{...HANG,sh:0,t:-12,a:100,b:5,hold:500,ms:900}]},
 pushup:{w:0,frames:[{...PUSH_TOP,hold:300,ms:900},{...PUSH_BOT,hold:300,ms:700}]},
 roller:{w:0,frames:[{...ROLL_IN,hold:400,ms:1300},{...ROLL_OUT,hold:500,ms:1100}]},
 windmill:{w:16,view:"front",frames:[{t:0,a:14,b:14,a2:-14,b2:-14,u:180,v:180,u2:0,v2:0,an:"f",at:[84,112],kb:"w",hold:400,ms:1300},
   {t:-58,a:24,b:14,a2:-4,b2:-14,u:180,v:180,u2:0,v2:0,an:"f",at:[84,112],kb:"w",hold:600,ms:1200}]},
 swing1:{w:24,frames:[{...HIKE,u2:-10,v2:-10,kb:"w",hold:120,ms:550},{...SW_TOP,u2:0,v2:0,kb:"w",hold:200,ms:550}]},
 row:{w:24,props:{block:"W2"},frames:[{...ROW_B,kb:"w",hold:300,ms:700},{...ROW_T,kb:"w",hold:500,ms:800}]},
 bridge24:{w:24,props:{bench:[2,90,40]},frames:[
   {t:-75,a:112,b:-10,u:82,v:82,an:"f",at:[82,112],kb:"hip",ik:1,hold:300,ms:800},
   {t:-90,a:90,b:0,u:105,v:105,an:"f",at:[82,112],kb:"hip",ik:1,hold:700,ms:800}]},
 bridge:{w:0,frames:[{t:-90,a:125,b:-39,u:90,v:90,an:"h",at:[52,106],hold:300,ms:800},{t:-115.6,a:100,b:-30,u:95,v:95,an:"f",at:[56.3,112],hold:600,ms:800}]},
 slrdl:{w:16,frames:[{t:0,a:3,b:-3,a2:0,b2:0,u:0,v:0,an:"f",at:[60,112],kb:"w",hold:400,ms:1100},
   {t:80,a:12,b:-6,a2:-98,b2:-98,u:0,v:0,an:"f",at:[60,112],kb:"w",hold:600,ms:1100}]},
 wallsit:{w:0,props:{wall:30},frames:[{t:0,a:62,b:0,u:30,v:70,an:"h",at:[36,72],hold:1500,ms:900},{t:0,a:58,b:-2,u:30,v:70,an:"h",at:[36,71],hold:1500,ms:900}]},
 tgu:{w:16,frames:[
   {t:-90,a:135,b:30,a2:90,b2:90,u:180,v:180,u2:100,v2:100,an:"h",at:[50,104],kb:"w",hold:400,ms:800},
   {t:-65,a:135,b:30,a2:90,b2:90,u:180,v:180,u2:-10,v2:-90,an:"h",at:[50,104],kb:"w",hold:300,ms:800},
   {t:-40,a:135,b:30,a2:90,b2:90,u:180,v:180,u2:-20,v2:-20,an:"h",at:[50,104],kb:"w",hold:300,ms:900},
   {t:-75,a:95,b:10,a2:60,b2:60,u:180,v:180,u2:-15,v2:-15,an:"f",at:[82,110],kb:"w",hold:600,ms:900},
   {t:-40,a:135,b:30,a2:90,b2:90,u:180,v:180,u2:-20,v2:-20,an:"h",at:[50,104],kb:"w",hold:200,ms:800},
   {t:-65,a:135,b:30,a2:90,b2:90,u:180,v:180,u2:-10,v2:-90,an:"h",at:[50,104],kb:"w",hold:200,ms:800}]},
 rackhold:{w:16,frames:[{...RACK,kb:"ww",hold:1500,ms:900},{...RACK,u:14,kb:"ww",hold:1500,ms:900}]},
 complex:{w:16,frames:[
   {...ROW_B,u2:0,v2:0,kb:"ww",hold:150,ms:500},{...ROW_T,u2:-100,v2:-4,kb:"ww",hold:250,ms:500},{...ROW_B,u2:0,v2:0,kb:"ww",hold:150,ms:500},
   {...HANGBELL,an:"f",at:[50,112],kb:"ww",hold:150,ms:450},{...HIKE,an:"f",at:[50,112],kb:"ww",hold:80,ms:450},
   {...RACK,an:"f",at:[50,112],kb:"ww",hold:300,ms:600},{...PRESS,an:"f",at:[50,112],kb:"ww",hold:300,ms:600},{...RACK,an:"f",at:[50,112],kb:"ww",hold:200,ms:500},
   {...RDL_TOP,at:[50,112],kb:"ww",hold:150,ms:600},{...RDL_BOT,at:[50,112],kb:"ww",hold:200,ms:600},{...RDL_TOP,at:[50,112],kb:"ww",hold:200,ms:500}]},
 ladder:{w:0,frames:[{...HANG,hold:200,ms:700},{...PU_TOP,hold:250,ms:700},{...HANG,hold:400,ms:10},
   {...PUSH_TOP,cut:true,hold:200,ms:600},{...PUSH_BOT,hold:200,ms:600},{...PUSH_TOP,hold:400,ms:10},{...HANG,cut:true,hold:0,ms:10}]},
 pushroll:{w:0,frames:[{...PUSH_TOP,hold:200,ms:700},{...PUSH_BOT,hold:200,ms:600},{...PUSH_TOP,hold:400,ms:10},
   {...ROLL_IN,cut:true,hold:250,ms:1100},{...ROLL_OUT,hold:300,ms:1000},{...ROLL_IN,hold:400,ms:10},{...PUSH_TOP,cut:true,hold:0,ms:10}]},
 catcow:{w:0,frames:[{t:78,a:0,b:-90,u:0,v:0,an:"k",at:[42,112],c:-7,hd:45,hold:500,ms:1100},{t:78,a:0,b:-90,u:0,v:0,an:"k",at:[42,112],c:6,hd:-35,hold:500,ms:1100}]},
 bodycircle:{w:24,view:"front",frames:[0,1,2,3,4,5,6,7,8].map(k=>({t:0,a:6,b:6,a2:-6,b2:-6,u:8,v:20,u2:-8,v2:-20,an:"f",at:[60,112],kb:"orbitw",ik:1,orb:90+k*45,hold:0,ms:330}))},
 figure8:{w:24,view:"front",frames:[0,1,2,3,4,5,6,7,8].map(k=>({t:45,a:38,b:-30,a2:-38,b2:30,u:-5,v:-10,u2:5,v2:10,an:"f",at:[60,112],kb:"eight",ik:1,orb:k*45,hold:0,ms:330}))},
 arms16:{w:16,frames:[
   {t:0,a:3,b:-3,u:10,v:10,an:"f",at:[56,112],kb:"w",hold:400,ms:700},{t:0,a:3,b:-3,u:10,v:48,an:"f",at:[56,112],kb:"w",hold:300,ms:600},
   {t:0,a:3,b:-3,u:10,v:10,an:"f",at:[56,112],kb:"w",hold:100,ms:500},{t:0,a:3,b:-3,u:8,v:150,an:"f",at:[56,112],kb:"w",hold:400,ms:800},
   {t:-2,a:2,b:-2,u:178,v:180,an:"f",at:[56,112],kb:"w",hold:300,ms:900},{t:-2,a:2,b:-2,u:178,v:250,an:"f",at:[56,112],kb:"w",hold:500,ms:900},
   {t:-2,a:2,b:-2,u:178,v:180,an:"f",at:[56,112],kb:"w",hold:200,ms:800},{t:0,a:3,b:-3,u:8,v:150,an:"f",at:[56,112],kb:"w",hold:200,ms:800}]},
 uprow:{w:24,frames:[{t:0,a:3,b:-3,u:5,v:5,an:"f",at:[56,112],kb:"w",hold:400,ms:800},{t:0,a:3,b:-3,u:30,v:125,an:"f",at:[56,112],kb:"w",hold:400,ms:800}]},
 wristrot:{w:24,frames:[{t:0,a:3,b:-3,u:0,v:0,u2:0,v2:0,an:"f",at:[56,112],kb:"wd",hold:300,ms:500},{t:0,a:3,b:-3,u:0,v:10,u2:0,v2:0,an:"f",at:[56,112],kb:"wd",hold:300,ms:500},{t:0,a:3,b:-3,u:0,v:-10,u2:0,v2:0,an:"f",at:[56,112],kb:"wd",hold:300,ms:500}]},
 conccurl:{w:16,frames:[{t:30,a:88,b:0,u:75,v:72,u2:75,v2:72,an:"f",at:[62,112],kb:"w",hold:400,ms:900},{t:30,a:88,b:0,u:75,v:160,u2:75,v2:72,an:"f",at:[62,112],kb:"w",hold:500,ms:900}]},
 fingerhold:{w:16,frames:[{t:25,a:88,b:0,u:75,v:92,u2:75,v2:92,an:"f",at:[62,112],kb:"wd",hold:900,ms:900},{t:25,a:88,b:0,u:75,v:98,u2:75,v2:92,an:"f",at:[62,112],kb:"wd",hold:900,ms:900}]},
 ohhold:{w:24,frames:[{t:-2,a:2,b:-2,u:178,v:180,u2:3,v2:3,an:"f",at:[56,112],kb:"w",hold:900,ms:900},{t:-3,a:2,b:-2,u:176,v:178,u2:3,v2:3,an:"f",at:[56,112],kb:"w",hold:900,ms:900}]},
 kneesq:{w:16,frames:[
   {t:0,a:78,b:-90,u:12,v:168,an:"k",at:[64,111],kb:"w",hold:500,ms:800},{t:0,a:0,b:-90,u:12,v:168,an:"k",at:[44,111],kb:"w",hold:200,ms:700},
   {t:0,a:80,b:2,a2:-3,b2:-90,u:12,v:168,an:"k2",at:[34,111],kb:"w",hold:200,ms:700},{t:18,a:85,b:-3,a2:85,b2:-3,u:12,v:168,an:"f",at:[62,112],kb:"w",hold:600,ms:700},
   {t:0,a:80,b:2,a2:-3,b2:-90,u:12,v:168,an:"k2",at:[34,111],kb:"w",hold:200,ms:700},{t:0,a:0,b:-90,u:12,v:168,an:"k",at:[44,111],kb:"w",hold:200,ms:700}]},
 kneeup:{w:16,frames:[{t:0,a:3,b:-3,a2:3,b2:-3,u:60,v:80,u2:3,v2:3,an:"f2",at:[60,112],kb:"thigh",hold:300,ms:900},{t:0,a:90,b:2,a2:3,b2:-3,u:60,v:80,u2:3,v2:3,an:"f2",at:[60,112],kb:"thigh",hold:600,ms:1100}]},
 flip:{w:16,frames:[
   {t:25,a:45,b:-35,a2:45,b2:-35,u:5,v:5,u2:5,v2:5,an:"f",at:[56,112],kb:"w",hold:200,ms:500},{t:25,a:45,b:-35,a2:45,b2:-35,u:25,v:150,u2:30,v2:100,an:"f",at:[56,112],kb:"w",hold:200,ms:450},
   {t:25,a:45,b:-35,a2:45,b2:-35,u:15,v:100,u2:25,v2:150,an:"f",at:[56,112],kb:"w2",hold:150,ms:350},{t:25,a:45,b:-35,a2:45,b2:-35,u:5,v:5,u2:5,v2:5,an:"f",at:[56,112],kb:"w2",hold:200,ms:500}]},
 goodm:{w:16,frames:[{t:0,a:4,b:-4,u:50,v:225,an:"f",at:[58,112],kb:"w",hold:400,ms:1100},{t:68,a:20,b:-8,u:50,v:225,an:"f",at:[58,112],kb:"w",hold:600,ms:1100}]},
 pendulum:{w:16,view:"front",frames:[{t:20,a:6,b:-6,a2:-6,b2:6,u:-38,v:-38,u2:-38,v2:-38,an:"f",at:[60,112],kb:"w",hold:200,ms:700},{t:20,a:6,b:-6,a2:-6,b2:6,u:38,v:38,u2:38,v2:38,an:"f",at:[60,112],kb:"w",hold:200,ms:700}]},
 scissors:{w:0,frames:[{t:-90,a:122,b:122,a2:100,b2:100,u:-80,v:-80,an:"h",at:[52,106],hold:200,ms:500},{t:-90,a:100,b:100,a2:122,b2:122,u:-80,v:-80,an:"h",at:[52,106],hold:200,ms:500}]},
 renrow:{w:16,props:{handles:true},frames:[{...PUSH_TOP,u2:0,v2:0,kb:"ww",hold:200,ms:600},{...PUSH_TOP,u:-65,v:-20,u2:0,v2:0,kb:"ww",hold:400,ms:700},{...PUSH_TOP,u2:0,v2:0,kb:"ww",hold:200,ms:600},{...PUSH_TOP,u:0,v:0,u2:-65,v2:-20,kb:"ww",hold:400,ms:700}]},
 halo:{w:16,view:"front",frames:[0,1,2,3,4].map(k=>({t:0,a:8,b:8,a2:-8,b2:-8,u:20,v:160,an:"f",at:[60,112],kb:"orbit",ik:1,orb:90-k*90,hold:0,ms:600}))},
 hamstr:{w:0,frames:[{t:5,a:22,b:22,a2:-6,b2:-14,u:0,v:0,an:"f2",at:[44,112],hold:500,ms:1200},{t:62,a:24,b:22,a2:-10,b2:-18,u:20,v:20,an:"f2",at:[44,112],hold:1500,ms:1200}]},
 hipflex:{w:0,frames:[{t:-3,a:96,b:0,a2:-20,b2:-90,u:0,v:0,an:"k2",at:[40,112],hold:500,ms:1200},{t:-8,a:103,b:0,a2:-36,b2:-90,u:0,v:0,an:"k2",at:[40,112],hold:1500,ms:1200}]},
 goblet:{w:24,frames:[{t:0,a:2,b:-2,u:25,v:150,an:"f",at:[58,112],kb:"w",hold:300,ms:1000},{t:30,a:104,b:-30,u:30,v:150,an:"f",at:[58,112],kb:"w",hold:400,ms:900}]},
 frontsq:{w:16,frames:[{t:0,a:2,b:-2,u:12,v:168,an:"f",at:[58,112],kb:"ww",hold:300,ms:1000},{t:26,a:100,b:-30,u:14,v:168,an:"f",at:[58,112],kb:"ww",hold:400,ms:900}]},
 lunge:{w:16,frames:[{t:0,a:0,b:0,a2:0,b2:0,u:25,v:150,an:"f",at:[72,112],kb:"w",hold:300,ms:900},{t:2,a:85,b:-5,a2:-25,b2:-95,u:25,v:150,an:"f",at:[72,112],kb:"w",hold:400,ms:900}]},
 hollow:{w:0,frames:[{t:-64,a:114,b:114,u:-118,v:-118,an:"h",at:[60,108],hold:1200,ms:900},{t:-67,a:110,b:110,u:-115,v:-115,an:"h",at:[60,108],hold:1200,ms:900}]},
 sideplank:{w:0,frames:[{t:75,a:-75,b:-75,u:-2,v:90,u2:178,v2:180,an:"f",at:[18,112],hold:1200,ms:900},{t:74,a:-74,b:-74,u:-2,v:90,u2:170,v2:175,an:"f",at:[18,112],hold:1200,ms:900}]},
 ltuck:{w:0,frames:[{...HANG,sh:0,t:-10,a:95,b:5,hold:1500,ms:800},{...HANG,sh:0,t:-12,a:100,b:8,hold:1500,ms:800}]},
 boom:{w:0,frames:[{...PUSH_BOT,hold:150,ms:250},{...PUSH_TOP,t:58,a:-58,b:-58,u:0,v:0,hold:250,ms:500}]},
 child:{w:0,frames:[{t:84,a:67,b:-90,u:68,v:68,hd:-4,c:-3,an:"k",at:[48,112],hold:1200,ms:1500},{t:88,a:67,b:-90,u:78,v:78,hd:-8,c:-4,an:"k",at:[48,112],hold:1200,ms:1500}]},
 wrist:{w:0,frames:[{t:78,a:0,b:-90,u:0,v:0,hd:20,an:"w",at:[71,112],hold:900,ms:1400},{t:71,a:35,b:-90,u:20,v:20,hd:20,an:"w",at:[71,112],hold:1500,ms:1400}]},
 chest:{w:0,props:{wall:70},frames:[{t:2,a:0,b:0,u:90,v:180,an:"f",at:[52,112],hold:900,ms:1200},{t:8,a:-14,b:-14,a2:30,b2:-5,u:40,v:180,an:"f",at:[44,112],hold:1500,ms:1200}]},
 calf:{w:0,props:{wall:92},frames:[{t:24,a:-24,b:-24,a2:25,b2:-23,u:80,v:80,an:"f",at:[24,112],hold:900,ms:1300},{t:29,a:-27,b:-27,a2:31,b2:-29,u:77,v:77,an:"f",at:[24,112],hold:1500,ms:1300}]},
};
if(typeof module!=="undefined")module.exports=FIGS;
