const $=s=>document.querySelector(s),rnd=n=>Math.floor(Math.random()*n),pick=a=>a[rnd(a.length)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const EL={sangue:{n:'Sangue',c:'#d6344c'},natureza:{n:'Natureza',c:'#6aa84f'},sombra:{n:'Sombra',c:'#9a7fe6'},pureza:{n:'Pureza',c:'#e6d596'}};
const BEATS={sangue:'natureza',natureza:'sombra',sombra:'pureza',pureza:'sangue'};
const mult=(a,d)=>BEATS[a]===d?1.5:BEATS[d]===a?.65:1;
const TY={perf:'Perfurante',cort:'Cortante',cont:'Contundente'};
const ST={vida:['Vida','+12 HP máximo'],forca:['Força','dano físico e armas'],vel:['Velocidade','esquiva e iniciativa'],energia:['Energia','magias e energia máx.']};
// ---------- DADOS ----------
const SK={
tiro:{n:'Tiro Preciso',k:'phys',type:'perf',p:1,cd:0},
rajada:{n:'Rajada de Disparos',k:'phys',type:'perf',p:.45,hits:3,cd:2,pr:60},
bala:{n:'Bala Perfurante',k:'phys',type:'perf',p:1.9,cd:3,pr:80},
corte:{n:'Corte Direto',k:'phys',type:'cort',p:1,cd:0},
talho:{n:'Talho Sangrento',k:'phys',type:'cort',p:1.1,cd:2,fx:['bleed'],pr:60},
duplo:{n:'Golpe Duplo',k:'phys',type:'cort',p:.7,hits:2,cd:2,pr:70},
chicote:{n:'Chicotada',k:'phys',type:'cont',p:1,cd:0},
laco:{n:'Laço Esmagador',k:'phys',type:'cont',p:.9,cd:3,fx:['stun'],pr:70},
impacto:{n:'Impacto Brutal',k:'phys',type:'cont',p:1.9,cd:3,pr:80},
sangria:{n:'Sangria',k:'mag',el:'sangue',p:1.2,cost:8,steal:.5},
hemo:{n:'Hemorragia',k:'mag',el:'sangue',p:1,cost:14,steal:.5,fx:['bleed'],pr:90},
banquete:{n:'Banquete Rubro',k:'mag',el:'sangue',p:2.2,cost:22,steal:.6,pr:150},
espinhos:{n:'Espinhos',k:'mag',el:'natureza',p:1.2,cost:8},
veneno:{n:'Veneno',k:'mag',el:'natureza',p:.8,cost:10,fx:['poison'],pr:70},
tempestade:{n:'Tempestade de Raízes',k:'mag',el:'natureza',p:2.2,cost:22,pr:150},
trevas:{n:'Lâmina de Trevas',k:'mag',el:'sombra',p:1.2,cost:8},
pavor:{n:'Pavor',k:'mag',el:'sombra',p:.8,cost:10,fx:['weak'],pr:70},
eclipse:{n:'Eclipse',k:'mag',el:'sombra',p:2.2,cost:22,pr:150},
luz:{n:'Luz Sagrada',k:'mag',el:'pureza',p:1.2,cost:8},
correntes:{n:'Correntes de Luz',k:'mag',el:'pureza',p:.8,cost:10,fx:['slow'],pr:70},
juizo:{n:'Juízo Final',k:'mag',el:'pureza',p:2.2,cost:22,pr:150}};
const ELS={sangue:'sangria',natureza:'espinhos',sombra:'trevas',pureza:'luz'};
const WP={
pistola:{n:'Pistola Velha',type:'perf',req:1,atk:6},espada:{n:'Espada Enferrujada',type:'cort',req:1,atk:6},chicote:{n:'Chicote de Couro',type:'cont',req:1,atk:6},
revolver:{n:'Revólver Prateado',type:'perf',req:3,atk:12,pr:90},sabre:{n:'Sabre de Caçador',type:'cort',req:3,atk:12,pr:90},correntes:{n:'Chicote de Correntes',type:'cont',req:3,atk:12,pr:90},
rifle:{n:'Rifle Abençoado',type:'perf',req:6,atk:20,pr:220},katana:{n:'Lâmina Carmesim',type:'cort',req:6,atk:20,pr:220},mangual:{n:'Mangual de Ferro',type:'cont',req:6,atk:20,pr:220}};
const WS={pistola:'tiro',espada:'corte',chicote:'chicote'};
const IT={pot:{n:'Poção de Vida',d:'Cura 40 HP',pr:25},grande:{n:'Grande Poção',d:'Cura 100 HP',pr:60},ener:{n:'Elixir de Energia',d:'+20 Energia',pr:25},furia:{n:'Tônico de Fúria',d:'+40% de dano por 3 turnos',pr:35},po:{n:'Pó Cegante',d:'Inimigo erra 40% por 3 turnos',pr:30}};
const E1={zumbi:{n:'Zumbi Operário',i:'🧟',el:'sangue',ty:'cont',hp:40,atk:7,spd:2},ladrao:{n:'Ladrão de Corpos',i:'🦹',el:'sombra',ty:'perf',hp:32,atk:8,spd:4},cao:{n:'Cão Carniçal',i:'🐕',el:'natureza',ty:'cort',hp:30,atk:8,spd:5},vigia:{n:'Sombra Vigilante da Noite',i:'👤',el:'sombra',ty:'cont',hp:38,atk:7,spd:3},cultista:{n:'Cultista do Sangue Açoitado',i:'🎭',el:'sangue',ty:'cort',hp:34,atk:9,spd:3},atirador:{n:'Atirador da Névoa',i:'🪖',el:'pureza',ty:'perf',hp:30,atk:10,spd:3}};
const E1D=[{n:'Rato de Esgoto Mutante',i:'🐀',el:'natureza',ty:'perf',hp:34,atk:8,spd:4},{n:'Inquilino Deformado',i:'🧍',el:'sangue',ty:'cont',hp:48,atk:8,spd:2},{n:'Gárgula de Vidro Quebrado',i:'🗿',el:'pureza',ty:'cort',hp:40,atk:9,spd:3},{n:'Fantasma do Enforcado',i:'👻',el:'sombra',ty:'cont',hp:36,atk:9,spd:4},{n:'Boneca de Cera Possuída',i:'🪆',el:'pureza',ty:'perf',hp:34,atk:10,spd:3}];
const BOSS={madame:{n:'Madame Blackwood, a Senhora das Velas',i:'🕯️',el:'sombra',ty:'perf',hp:170,atk:12,spd:3,boss:'madame',gold:110,xp:40},jack:{n:'Jack, o Decepador de Sangue',i:'🎩',el:'sangue',ty:'cort',hp:260,atk:14,spd:5,boss:'jack',gold:200,xp:80}};
function mk(d,f){const o={...d};o.hp=o.max=Math.round(d.hp*f);o.atk=d.atk*(1+(f-1)*.7);o.st={bleed:0,poison:0,weak:0,slow:0,stun:0};o.t=0;o.shield=0;o.fog=0;o.gold=d.gold||Math.round(8*f+rnd(8));o.xp=d.xp||Math.round(9*f);return o}
// ---------- ESTADO ----------
let P=null,G,C,D,M,view,best=0;const LOG=[];
const newC0=()=>({name:'',weapon:'espada',el:'sangue',vida:1,forca:1,vel:1,energia:1,pts:6});
let C0=newC0();
try{best=+localStorage.getItem('cdn_best')||0}catch(e){}
const hpMax=()=>40+P.vida*12,enMax=()=>16+P.energia*6,xpN=()=>P.lvl*12+8,dodge=()=>Math.min(.4,P.vel*.03),W=()=>WP[P.weapon];
const B=(l,a,v='',c='',d=false)=>`<button class="btn ${c}" data-a="${a}" data-v="${v}"${d?' disabled':''}>${l}</button>`;
// ---------- SOM E EFEITOS ----------
let AC;const ac=()=>AC=AC||new(window.AudioContext||window.webkitAudioContext)();
function snd(f,d=.1,t='square',v=.04){try{const a=ac(),o=a.createOscillator(),g=a.createGain();o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,a.currentTime);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+d);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+d)}catch(e){}}
function scream(){try{const a=ac(),n=a.sampleRate*.9,b=a.createBuffer(1,n,a.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=(Math.random()*2-1)*(1-i/n);const s=a.createBufferSource(),g=a.createGain();s.buffer=b;g.gain.value=.5;s.connect(g);g.connect(a.destination);s.start();snd(90,.9,'sawtooth',.2);snd(97,.9,'sawtooth',.2)}catch(e){}}
function flash(c){const f=$('#fx');f.style.boxShadow=`inset 0 0 120px 40px ${c}`;f.classList.remove('f');void f.offsetWidth;f.classList.add('f')}
function shake(){const v=$('#v');v.classList.remove('shake');void v.offsetWidth;v.classList.add('shake')}
function log(t,c=''){LOG.push(`<p class="${c}">${t}</p>`);if(LOG.length>60)LOG.shift();const l=$('#lg');if(l){l.innerHTML=LOG.join('');l.scrollTop=l.scrollHeight}}
// ---------- RENDER ----------
function hud(){const h=$('#hud');if(!P){h.innerHTML='';return}
h.innerHTML=`<div class="panel hud"><div class="row"><span><b>${esc(P.name)}</b>, nível ${P.lvl} <small>XP ${P.xp}/${xpN()}</small></span><span>🪙 ${P.gold}</span></div><div>HP ${P.hp}/${hpMax()}<div class="bar hp"><i style="width:${P.hp/hpMax()*100}%"></i></div></div><div>Energia ${P.en}/${enMax()}<div class="bar en"><i style="width:${P.en/enMax()*100}%"></i></div></div></div>`}
function render(){hud();$('#v').innerHTML=view();$('#lgp').style.display=P?'':'none';const l=$('#lg');l.innerHTML=LOG.join('');l.scrollTop=l.scrollHeight}
function statRows(T){return Object.keys(ST).map(k=>`<div class="stat"><span>${ST[k][0]}<br><small>${ST[k][1]}</small></span><b>${T[k]}</b>${T.pts>0?B('+','up',k):'<span></span>'}</div>`).join('')}
// ---------- CRIAÇÃO ----------
function vCreate(){const T=C0;
return `<div class="panel"><h1 style="font-size:46px">Caça da Noite</h1><p class="dim">Na noite de Halloween as barreiras entre os mundos se romperam. Criaturas das trevas caçam pelas ruas, e você é quem vai caçá-las de volta. Sobreviva à Rua do Nevoeiro Escarlate. Se morrer, morreu: a jornada recomeça do zero.</p>${best?`<small>Seu recorde: ${best} avanços numa corrida.</small>`:''}</div>
<div class="panel"><label>Nome do caçador<input id="nm" maxlength="16" placeholder="Caçador" value="${esc(T.name)}"></label></div>
<div class="panel"><h3>Arma inicial</h3><div class="grid">${['pistola','espada','chicote'].map(w=>B(`${WP[w].n}<br><small>${TY[WP[w].type]}</small>`,'cw',w,T.weapon===w?'sel':'')).join('')}</div></div>
<div class="panel"><h3>Afinidade elemental</h3><div class="grid">${Object.keys(EL).map(k=>B(`<span style="color:${EL[k].c}">●</span> ${EL[k].n}<br><small>${SK[ELS[k]].n}</small>`,'ce',k,T.el===k?'sel':'')).join('')}</div><p class="small">Sangue vence Natureza, Natureza vence Sombra, Sombra vence Pureza e Pureza vence Sangue. Vantagem causa 50% a mais de dano, desvantagem 35% a menos.</p></div>
<div class="panel"><h3>Atributos <small>${T.pts} pontos restantes</small></h3>${statRows(T)}<div style="margin-top:8px">${B('Zerar pontos','rs')}</div></div>${B('Começar a caçada','go','','main')}`}
// ---------- EXPLORAÇÃO ----------
function sheet(){const sk=id=>`<div>${SK[id].n} <small>${SK[id].k==='phys'?TY[SK[id].type]:EL[SK[id].el].n+', '+SK[id].cost+' EN'}</small></div>`;
return `<div class="panel"><details ${P.pts?'open':''}><summary>Ficha do caçador</summary>${P.pts?`<p><b>${P.pts} pontos para distribuir</b></p>`:''}${statRows(P)}
<p class="small">Afinidade: ${EL[P.el].n}. Esquiva ${Math.round(dodge()*100)}%.</p><h3>Habilidades físicas</h3>${P.phys.map(sk).join('')}<h3>Magias</h3>${P.mag.map(sk).join('')}
<h3>Armas</h3>${P.weapons.map(w=>B(`${WP[w].n} <small>${TY[WP[w].type]}, ataque ${WP[w].atk}, exige Força ${WP[w].req}${P.weapon===w?' (equipada)':''}</small>`,'eq',w,P.weapon===w?'sel':'',P.forca<WP[w].req)).join('<div style="height:6px"></div>')}
<h3>Bolsa</h3>${bag(false)}</details></div>`}
function bag(inC){const l=Object.keys(P.items).filter(k=>P.items[k]>0&&(inC||['pot','grande','ener'].includes(k)));return l.length?l.map(k=>B(`${IT[k].n} x${P.items[k]}<br><small>${IT[k].d}</small>`,'ui',k)).join('<div style="height:6px"></div>'):'<small>Vazia.</small>'}
function vExplore(){return `<div class="panel"><h2>Rua do Nevoeiro Escarlate</h2><small>Avanço ${G.adv} de 10</small><div class="pips">${Array.from({length:10},(_,i)=>`<i class="${i<G.adv?'on':''}${i==9?' bossp':''}"></i>`).join('')}</div><p>${G.msg}</p>${B(G.adv>=9?'Enfrentar o Chefe da Área':'Avançar','adv','','main')}</div>${sheet()}`}
function toExplore(msg){if(msg)G.msg=msg;view=vExplore;render()}
function useItem(id){if(!(P.items[id]>0))return;const e=C&&C.e&&!C.won&&view===vCombat?C.e:null;
if(id==='pot'||id==='grande'){const h=id==='pot'?40:100;P.hp=Math.min(hpMax(),P.hp+h);log(`Você usa ${IT[id].n} e recupera ${h} HP.`,'g')}
else if(id==='ener'){P.en=Math.min(enMax(),P.en+20);log('Você recupera energia.','g')}
else if(id==='furia'){if(!e)return;P.buff=3;log('Você sente a fúria subir: +40% de dano.','g')}
else if(id==='po'){if(!e)return;e.st.slow=3;log(`${e.n} é cegado pelo pó.`,'g')}
P.items[id]--;snd(520,.15,'sine');if(e)endTurn();else render()}
// ---------- COMBATE ----------
function startCombat(e,after){C={e,after,cd:{},menu:'main',won:null};P.buff=0;document.documentElement.style.setProperty('--acc',EL[e.el].c);view=vCombat;log(`<b>${e.n}</b> surge diante de você!`,'r');if(e.spd>P.spd){log(`${e.n} é mais rápido e age primeiro.`);enemyTurn();if(P.hp<=0)return die()}render()}
function fogN(e){return e.boss==='jack'?Math.floor((1-e.hp/e.max)*4):0}
function hurt(e,d){if(e.shield>0){const s=Math.min(e.shield,d);e.shield-=s;d-=s}e.hp=Math.max(0,e.hp-d)}
function useSkill(id){const s=SK[id],e=C.e;let m=1;if(s.k==='mag'){if(P.en<s.cost)return;P.en-=s.cost;m=mult(s.el,e.el)}else if(s.cd)C.cd[id]=s.cd+1;
let tot=0;const base=s.k==='phys'?W().atk+P.forca*2:8+P.energia*2+P.lvl*2;
for(let i=0;i<(s.hits||1);i++){const d=Math.max(1,Math.round(base*s.p*m*(.9+Math.random()*.2)*(P.buff>0?1.4:1)));hurt(e,d);tot+=d}
log(`Você usa <b>${s.n}</b>: ${tot} de dano${m>1?' (vantagem elemental!)':m<1?' (resistido)':''}.`);
snd(s.k==='phys'?160:340,.15,s.k==='phys'?'sawtooth':'triangle',.07);flash(s.k==='mag'?EL[s.el].c:'rgba(255,255,255,.35)');
(s.fx||[]).forEach(f=>{if(f==='stun'){if(Math.random()<.5){e.st.stun=1;log(`${e.n} fica atordoado!`)}}else{e.st[f]=f==='slow'?2:3;log(`${e.n}: ${{bleed:'sangrando',poison:'envenenado',weak:'enfraquecido',slow:'lento'}[f]}.`)}});
if(s.steal){const h=Math.round(tot*s.steal);P.hp=Math.min(hpMax(),P.hp+h);log(`Você drena ${h} HP.`,'g')}
endTurn()}
function endTurn(){const e=C.e;let dot=0;
if(e.st.bleed>0){dot+=4+(P.lvl>>1);e.st.bleed--}if(e.st.poison>0){dot+=5+(P.lvl>>1);e.st.poison--}
if(dot){e.hp=Math.max(0,e.hp-dot);log(`${e.n} sofre ${dot} de dano contínuo.`)}
for(const k in C.cd)if(C.cd[k]>0)C.cd[k]--;if(P.buff>0)P.buff--;
if(e.hp<=0)return win();enemyTurn();if(P.hp<=0)return die();C.menu='main';render()}
function enemyTurn(){const e=C.e;e.t++;
if(e.st.stun>0){e.st.stun--;log(`${e.n} está atordoado e perde o turno.`);return}
if(e.boss==='madame'&&e.t%3===0){e.shield+=35;log('Madame Blackwood derrete, se reposiciona e invoca Bonecas de Cera que cobrem sua guarda! (+35 de guarda)','r');snd(110,.4,'sawtooth',.08);return}
const f=fogN(e);if(f>e.fog){e.fog=f;log('Uma névoa sangrenta se espalha ao redor de Jack. Ele fica mais violento!','r')}
if(e.st.slow>0&&Math.random()<.4)log(`${e.n} erra o ataque.`);
else if(Math.random()<dodge())log('Você esquiva do ataque!','g');
else{const m=mult(e.el,P.el);let d=e.atk*m*(.85+Math.random()*.3);if(e.st.weak>0)d*=.7;d*=1+.25*f;d=Math.max(1,Math.round(d));P.hp=Math.max(0,P.hp-d);
log(`${e.n} ataca (${TY[e.ty]}): <b>${d}</b> de dano${m>1?' (vantagem dele)':m<1?' (sua afinidade resiste)':''}.`,'r');snd(110,.2,'square',.08);flash('rgba(192,36,59,.7)');shake();
if(f>0){const h=Math.round(d*.3);e.hp=Math.min(e.max,e.hp+h);log(`A névoa devolve ${h} HP a Jack.`,'r')}}
if(e.st.weak>0)e.st.weak--;if(e.st.slow>0)e.st.slow--}
function win(){const e=C.e;P.gold+=e.gold;P.xp+=e.xp;G.kills++;let m=`${e.n} caiu! +${e.gold} ouro, +${e.xp} XP.`;
while(P.xp>=xpN()){P.xp-=xpN();P.lvl++;P.pts+=2;m+=` Nível ${P.lvl}! Você ganhou 2 pontos de atributo.`}
if(!e.boss&&Math.random()<.25){P.items.pot=(P.items.pot||0)+1;m+=' Encontrou uma Poção de Vida.'}
C.won=m;log(m,'g');snd(660,.3,'triangle',.08);render()}
function die(){try{best=Math.max(best,G.adv);localStorage.setItem('cdn_best',best)}catch(e){}
const s=$('#scare');s.innerHTML=`<div class="face">${C.e.i}</div><div class="ui"><h2>Você morreu</h2><p>${esc(P.name)} foi derrotado por ${C.e.n} no avanço ${G.adv} depois de ${G.kills} vitórias.</p>${B('Recomeçar a caçada','restart','','main')}</div>`;s.classList.add('on');scream()}
function vCombat(){const e=C.e,f=fogN(e);
const st=[e.st.bleed&&'sangrando',e.st.poison&&'envenenado',e.st.weak&&'enfraquecido',e.st.slow&&'lento',e.st.stun&&'atordoado'].filter(Boolean).join(', ');
let h=`<div class="panel enemy"><div class="big">${e.i}</div><h2>${e.n}</h2><div class="dim"><span style="color:${EL[e.el].c}">●</span> ${EL[e.el].n}, dano ${TY[e.ty]}</div><div class="bar hp"><i style="width:${e.hp/e.max*100}%"></i></div><div>${e.hp}/${e.max}${e.shield?`, guarda ${e.shield}`:''}${f?`, névoa ${f}`:''}</div><div class="dim small">${st}</div></div>`;
if(C.won)return h+`<div class="panel"><p>${C.won}</p>${B('Continuar','next','','main')}</div>`;
const back=B('Voltar','m','main'),gap='<div style="height:6px"></div>';let b='';
if(C.menu==='main')b=`<div class="grid">${B('Atacar<br><small>habilidades físicas</small>','m','phys')}${B('Magias<br><small>consomem energia</small>','m','mag')}${B('Itens<br><small>bolsa</small>','m','item')}</div>`;
else if(C.menu==='phys')b=P.phys.map(id=>{const s=SK[id],c=C.cd[id]||0,ok=W().type===s.type;return B(`${s.n}<br><small>${TY[s.type]}${s.cd?`, recarga ${s.cd}`:''}${!ok?`, exige arma ${TY[s.type]}`:''}${c?`, aguarde ${c}`:''}</small>`,'sk',id,'',!ok||c>0)}).join(gap)+gap+back;
else if(C.menu==='mag')b=P.mag.map(id=>{const s=SK[id],m=mult(s.el,e.el);return B(`<span style="color:${EL[s.el].c}">●</span> ${s.n}<br><small>${s.cost} EN${m>1?', vantagem x1,5':m<1?', desvantagem x0,65':''}</small>`,'sk',id,'',P.en<s.cost)}).join(gap)+gap+back;
else b=bag(true)+gap+back;
return h+`<div class="panel">${b}</div>`}
// ---------- LOJAS E LOCAIS ----------
function mkShop(big){const s=[];(big?['grande','pot','ener','furia','po']:['pot','ener','furia','po']).forEach(i=>s.push({t:'i',id:i,p:IT[i].pr}));
const sh=a=>a.sort(()=>Math.random()-.5);
sh(Object.keys(WP).filter(w=>WP[w].pr&&!P.weapons.includes(w)&&(big?WP[w].req>=6:WP[w].req<6))).slice(0,big?2:1).forEach(w=>s.push({t:'w',id:w,p:WP[w].pr}));
sh(Object.keys(SK).filter(k=>SK[k].pr&&!P.phys.includes(k)&&!P.mag.includes(k)&&(big?SK[k].pr>=150:SK[k].pr<150))).slice(0,big?3:2).forEach(k=>s.push({t:'s',id:k,p:SK[k].pr}));
return {big,s,pend:null}}
function vShop(){const g=M.s.map((x,i)=>{const n=x.t==='i'?IT[x.id].n:x.t==='w'?WP[x.id].n:SK[x.id].n;const d=x.t==='i'?IT[x.id].d:x.t==='w'?`${TY[WP[x.id].type]}, ataque ${WP[x.id].atk}, Força ${WP[x.id].req}`:(SK[x.id].k==='phys'?`Físico, ${TY[SK[x.id].type]}`:`Magia de ${EL[SK[x.id].el].n}, ${SK[x.id].cost} EN`);return B(`${x.sold?'(vendido) ':''}${n}<br><small>${d}. ${x.p} ouro</small>`,'buy',i,'',x.sold||P.gold<x.p)}).join('<div style="height:6px"></div>');
let sell=Object.keys(P.items).filter(k=>P.items[k]>0).map(k=>B(`Vender ${IT[k].n} <small>${IT[k].pr>>1} ouro</small>`,'sell','i:'+k)).concat(P.weapons.filter(w=>WP[w].pr&&w!==P.weapon).map(w=>B(`Vender ${WP[w].n} <small>${WP[w].pr>>1} ouro</small>`,'sell','w:'+w))).join('<div style="height:6px"></div>');
if(M.pend!==null){const x=M.s[M.pend],L=SK[x.id].k==='phys'?P.phys:P.mag;return `<div class="panel"><h3>Espaço cheio</h3><p>Você só pode ter 4 habilidades dessa categoria. Qual esquecer para aprender ${SK[x.id].n}?</p>${L.map((id,j)=>B(SK[id].n,'rep',j)).join('<div style="height:6px"></div>')}<div style="height:6px"></div>${B('Cancelar','cancel')}</div>`}
return `<div class="panel"><h2>${M.big?'Mercado Grande':'Mercador'}</h2><p class="dim">${M.big?'Um bazar sob lanternas pálidas, com itens que não se vê em qualquer esquina.':'Uma figura encapuzada abre a capa sobre um monte de frascos e armas.'}</p>${g}</div><div class="panel"><h3>Vender</h3>${sell||'<small>Nada para vender.</small>'}</div>${B('Seguir viagem','leave','','main')}`}
function vInn(){const o=[[.3,15],[.5,28],[1,50]];return `<div class="panel"><h2>Pousada Velas Mortas</h2><p class="dim">O estalajadeiro não pergunta de onde vem o sangue na sua roupa.</p>${o.map(([r,p])=>B(`Restaurar ${r*100}% do HP<br><small>${p} ouro${r===1?', e recupera toda a energia':''}</small>`,'rest',r+':'+p,'',P.gold<p||P.hp>=hpMax())).join('<div style="height:6px"></div>')}</div>${B('Seguir viagem','leave','','main')}`}
function vDungeon(){const r=D.room;return `<div class="panel"><h2>Casarão Abandonado</h2><small>Sala ${r} de 10</small><div class="pips">${Array.from({length:10},(_,i)=>`<i class="${i<r-1?'on':''}${i==9?' bossp':''}"></i>`).join('')}</div><p>${r===10?'Um brilho de velas derretidas vem da última sala. Há algo grande lá dentro.':'Corredores estreitos, papel de parede descascando e o som de passos que não são os seus.'}</p>${B(r===10?'Abrir a porta das velas':'Abrir a próxima porta','droom','','main')}<div style="height:6px"></div>${B('Abandonar a masmorra (perde o baú)','leave')}</div>${sheet()}`}
function chest(){const g=70+rnd(50);P.gold+=g;P.items.grande=(P.items.grande||0)+1;let m=`Baú do Tesouro: ${g} ouro e uma Grande Poção.`;
const ks=Object.keys(SK).filter(k=>SK[k].pr>=150&&!P.phys.includes(k)&&!P.mag.includes(k));const k=pick(ks);
if(k){const L=SK[k].k==='phys'?P.phys:P.mag;if(L.length<4){L.push(k);m+=` Você aprende ${SK[k].n}!`}else{P.gold+=60;m+=' (+60 ouro no lugar de uma magia rara)'}}
log(m,'g');G.msg='Você sai do casarão com os bolsos pesados. A névoa lá fora parece mais fria.';view=()=>`<div class="panel"><h2>Madame Blackwood derreteu</h2><p>${m}</p>${B('Sair da masmorra','leave','','main')}</div>`;render()}
function vEnd(){return `<div class="panel"><h1 style="font-size:46px">Jack caiu</h1><p>A névoa escarlate se dissipa e a rua fica em silêncio. ${esc(P.name)} sobreviveu à Área 1.</p><p class="dim">Nível ${P.lvl}, ${G.kills} vitórias, ${P.gold} de ouro. As próximas áreas ainda estão sendo escavadas.</p>${B('Caçar de novo','restart','','main')}</div>`}
// ---------- AÇÕES ----------
const A={
cw:v=>{C0.weapon=v;render()},ce:v=>{C0.el=v;render()},rs:()=>{Object.assign(C0,{vida:1,forca:1,vel:1,energia:1,pts:6});render()},
up:k=>{const T=P||C0;if(T.pts<1)return;T[k]++;T.pts--;if(P){if(k==='vida')P.hp+=12;if(k==='energia')P.en+=6}render()},
go:()=>{const T=C0;P={...T,name:T.name.trim()||'Caçador',weapons:[T.weapon],phys:[WS[T.weapon]],mag:[ELS[T.el]],items:{pot:2,ener:1},gold:30,lvl:1,xp:0,buff:0};P.hp=hpMax();P.en=enMax();
G={adv:0,kills:0,msg:'A névoa escarlate cobre a rua. Cada passo pode ser o último.'};LOG.length=0;log('A caçada começa.');toExplore()},
eq:w=>{if(P.forca>=WP[w].req){P.weapon=w;render()}},
ui:id=>useItem(id),m:v=>{C.menu=v;render()},sk:id=>useSkill(id),next:()=>{const f=C.after;C=null;document.documentElement.style.setProperty('--acc','#c0243b');f()},
adv:()=>{G.adv++;if(G.adv>=10){log('Uma figura alta de cartola e máscara de médico da peste surge da névoa...','r');return startCombat(mk(BOSS.jack,1),()=>{view=vEnd;render()})}
const r=rnd(100);
if(r<50){const e=mk(pick(Object.values(E1)),1+(G.adv-1)*.07);startCombat(e,()=>toExplore('A rua volta a ficar quieta. Por enquanto.'))}
else if(r<68){M=mkShop(false);view=vShop;render()}
else if(r<82){D={room:1};log('Você encontra um casarão abandonado.');view=vDungeon;render()}
else if(r<94){view=vInn;render()}
else{M=mkShop(true);log('Um mercado raro surge entre as barracas.');view=vShop;render()}},
droom:()=>{const r=D.room,e=r===10?mk(BOSS.madame,1):mk(pick(E1D),1+r*.09);startCombat(e,()=>{if(r===10)chest();else{D.room++;view=vDungeon;render()}})},
leave:()=>{toExplore(pick(['Você segue em frente, devagar.','Os lampiões piscam quando você passa.','A névoa fecha atrás de você.']))},
buy:i=>{const x=M.s[i];if(x.sold||P.gold<x.p)return;
if(x.t==='i'){P.gold-=x.p;P.items[x.id]=(P.items[x.id]||0)+1}
else if(x.t==='w'){P.gold-=x.p;P.weapons.push(x.id);x.sold=1}
else{const L=SK[x.id].k==='phys'?P.phys:P.mag;if(L.length>=4){M.pend=i;return render()}P.gold-=x.p;L.push(x.id);x.sold=1}snd(700,.1,'triangle');render()},
rep:j=>{const x=M.s[M.pend],L=SK[x.id].k==='phys'?P.phys:P.mag;L[j]=x.id;P.gold-=x.p;x.sold=1;M.pend=null;render()},cancel:()=>{M.pend=null;render()},
sell:v=>{const[t,id]=v.split(':');if(t==='i'){P.items[id]--;P.gold+=IT[id].pr>>1}else{P.weapons.splice(P.weapons.indexOf(id),1);P.gold+=WP[id].pr>>1}render()},
rest:v=>{const[r,p]=v.split(':').map(Number);if(P.gold<p)return;P.gold-=p;P.hp=Math.min(hpMax(),P.hp+Math.round(hpMax()*r));if(r===1)P.en=enMax();log('Você descansa e se sente melhor.','g');render()},
restart:()=>{$('#scare').classList.remove('on');P=null;C=null;C0=newC0();document.documentElement.style.setProperty('--acc','#c0243b');view=vCreate;render()}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b&&!b.disabled){snd(220,.04,'square',.03);A[b.dataset.a](b.dataset.v)}});
document.addEventListener('input',e=>{if(e.target.id==='nm')C0.name=e.target.value});
view=vCreate;render();
