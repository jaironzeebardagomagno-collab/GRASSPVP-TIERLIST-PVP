const KITS=[
 ["DiaSMP","◆"],["NethPOT","⚗"],["NethSMP","✦"],["Sword","⚔"],["Axe","◈"],["UHC","✦"],["Crystal","◇"],["Mace","⬟"],["SpearMace","✦"]
];
const TIERS=["No Tier","LT5","HT5","LT4","HT4","LT3","HT3","LT2","HT2","LT1","HT1"];
const DEFAULT_TIER_ICONS=Object.fromEntries(["LT5","HT5","LT4","HT4","LT3","HT3","LT2","HT2","LT1","HT1"].map(t=>[t,""]));
const TIER_AURAS={LT5:"#a855f7",HT5:"#ef4444",LT4:"#38bdf8",HT4:"#f59e0b",LT3:"#22c55e",HT3:"#ec4899",LT2:"#06b6d4",HT2:"#f97316",LT1:"#2563eb",HT1:"#8b5cf6"};
const DEFAULT_CODE="GRASS-9xK!27mQ#";
const DEFAULT_AURAS={"1":"#b86cff","2":"#ff4b4b","3":"#4da6ff","4-10":"#8d63ff","11-50":"#31c9ff","51-100":"#42e06f"};
const DEFAULT_KIT_LOGOS={DiaSMP:"DiaSMP.png",NethPOT:"NethPOT.png",NethSMP:"NethSMP.png",Sword:"Sword.png",Axe:"Axe.png",UHC:"UHC.png",Crystal:"Crystal.png",Mace:"Mace.png",SpearMace:"SpearMace.png"};
const DEFAULT_KIT_SETTINGS=Object.fromEntries(KITS.map(([k])=>[k,{logo:"",aura:"#9b7cff"}]));
const old=JSON.parse(localStorage.getItem("grassV3")||localStorage.getItem("grassV2")||'null');
let data=old||{players:[],events:[],settings:{title:"Minecraft PvP Rankings",description:"Official GRASS player rankings, kit tiers, and Champions Events.",code:DEFAULT_CODE,auras:DEFAULT_AURAS,kitSettings:DEFAULT_KIT_SETTINGS}};
if(!data.players)data.players=[];if(!data.events)data.events=[];if(!data.settings)data.settings={};
data.settings.title=data.settings.title||"Minecraft PvP Rankings";
data.settings.description=data.settings.description||"Official GRASS player rankings, kit tiers, and Champions Events.";
data.settings.code=data.settings.code||DEFAULT_CODE;
data.settings.auras={...DEFAULT_AURAS,...(data.settings.auras||{})};data.settings.tierAuras={...TIER_AURAS,...(data.settings.tierAuras||{})};data.settings.tierIcons={...DEFAULT_TIER_ICONS,...(data.settings.tierIcons||{})};
data.settings.kitSettings={...DEFAULT_KIT_SETTINGS,...(data.settings.kitSettings||{})};
KITS.forEach(([k])=>data.settings.kitSettings[k]={...DEFAULT_KIT_SETTINGS[k],...(data.settings.kitSettings[k]||{})});
let editId=null,eventEdit=null,logged=sessionStorage.getItem("grassEditorSession")==="1";
const $=id=>document.getElementById(id),esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function save(){localStorage.setItem("grassV3",JSON.stringify(data))}
function tierClass(t){return String(t).toLowerCase().replace(/\s/g,"-")}
function bustUrl(name){return `https://render.crafty.gg/3d/bust/${encodeURIComponent(name)}`}
function iconSvg(k){
 const s=data.settings.kitSettings[k]||{};
 if(s.logo)return `<img src="${esc(s.logo)}" alt="${esc(k)} logo" onerror="this.remove()">`;
 const map={
  DiaSMP:'<path d="M12 2 21 8v8l-9 6-9-6V8z"/><path d="m12 2 9 6-9 6-9-6z"/>',
  NethPOT:'<path d="M8 3h8v4c0 2-1 3-3 4v6h4v3H7v-3h4v-6C9 11 8 9 8 7z"/>',
  NethSMP:'<path d="M12 2c2 4 6 5 6 10a6 6 0 0 1-12 0c0-3 2-5 4-7 0 3 1 4 2 5 1-3 0-5 0-8z"/>',
  Sword:'<path d="m5 19 8-8 2 2-8 8H5zM13 3l8 8-3 3-8-8z"/>',
  Axe:'<path d="M8 3h7l4 4-4 4H9l-5 5-2-2 5-5V3zM10 11h3v10h-3z"/>',
  UHC:'<path d="M12 2a7 7 0 0 1 7 7v2a7 7 0 1 1-14 0V9a7 7 0 0 1 7-7zM9 9h6v4a3 3 0 1 1-6 0z"/>',
  Crystal:'<path d="m12 2 7 5-2 10-5 5-5-5L5 7zM5 7h14M8 17h8M12 2v20"/>',
  Mace:'<path d="M8 3h8v4H8zM11 7h2v11h-2zM7 18h6l3 3H4z"/>',
  SpearMace:'<path d="m12 2 2 8h5l-7 12-2-8H5z"/>'
 };
 return `<svg viewBox="0 0 24 24" aria-hidden="true">${map[k]||'<circle cx="12" cy="12" r="8"/>'}</svg>`;
}
function iconFor(k){const src=data.settings.kitSettings?.[k]?.logo||DEFAULT_KIT_LOGOS[k];return src?`<img src="${esc(src)}" alt="${esc(k)} icon" onerror="this.style.display='none'">`:iconSvg(k)}
function auraStyle(color){return `--aura:${esc(color||"#9b7cff")}`}
function tierBadge(kit,t,small=false){
 if(t==="No Tier")return `<span class="tier-empty">—</span>`;
 const color=data.settings.tierAuras[t]||TIER_AURAS[t]||"#9b7cff";
 const src=data.settings.tierIcons?.[t]||"";
 return `<span class="tier-badge ${small?"tier-badge-small":""}" style="--tier-aura:${esc(color)}" title="${esc(kit)} • ${esc(t)}"><span class="tier-badge-glow"></span>${src?`<img class="tier-badge-img" src="${esc(src)}" alt="${esc(t)} icon" onerror="this.style.display='none'">`:``}<b>${esc(t)}</b></span>`
}
function rankAuraKey(pos){if(pos===1)return "1";if(pos===2)return "2";if(pos===3)return "3";if(pos>=4&&pos<=10)return "4-10";if(pos>=11&&pos<=50)return "11-50";if(pos>=51&&pos<=100)return "51-100";return null}
function rankAuraClass(pos){const k=rankAuraKey(pos);return k?k.replace(/[^0-9-]/g,"-"):"none"}
function render(){
 $("siteTitle").textContent=data.settings.title;$("siteDescription").textContent=data.settings.description;
 renderPlayers();renderKits();renderChampions();renderSettings();updateAdmin();save();
}
function updateAdmin(){document.querySelectorAll(".admin-only").forEach(x=>x.style.display=logged?"":"none");$("loginBtn").textContent=logged?"🔓 Editor Mode":"🔐 Editor Login"}
function renderPlayers(){
 const players=data.players.slice();
 $("playersGrid").innerHTML=players.length?players.map((p,i)=>{
  const pos=i+1, key=rankAuraKey(pos), aura=data.settings.auras[key]||DEFAULT_AURAS[key]||"#8d63ff";
  const tiers=KITS.map(([k])=>{const t=p.tiers?.[k]||"No Tier";return t!=="No Tier"?`<span class="player-tier-chip" style="--tier-aura:${esc(data.settings.tierAuras[t]||TIER_AURAS[t])}"><span class="player-kit-icon">${iconFor(k)}</span><span class="player-kit-name">${esc(k)}</span><b>${esc(t)}</b></span>`:""}).join("");
  return `<article class="player-card" style="--rank-aura:${esc(aura)}"><div class="player-rank">#${pos}</div><div class="player-avatar"><img src="${esc(p.image||bustUrl(p.name))}" alt="${esc(p.name)}" onerror="this.src='https://render.crafty.gg/3d/bust/Steve';this.onerror=null"></div><div class="player-main"><div class="player-name"><h3>${esc(p.name)}</h3><span>${p.rank?esc(p.rank):"No rank"}${p.region?" • "+esc(p.region):""}</span></div><div class="player-tier-chips">${tiers||'<span class="muted">No kit tiers assigned</span>'}</div></div>${logged?`<div class="player-actions"><button class="small-btn" onclick="editPlayer('${esc(p.id)}')">Edit</button><button class="small-btn danger" onclick="delPlayer('${esc(p.id)}')">Delete</button></div>`:""}</article>`;
 }).join(""):"";
 $("playersEmpty").classList.toggle("hidden",players.length>0);
}
function renderKits(){
 const tierOrder=TIERS.filter(t=>t!=="No Tier");
 $("kitBoards").innerHTML=KITS.map(([k])=>{
   const ks=data.settings.kitSettings[k]||{};
   const groups=tierOrder.map(t=>{
     const arr=data.players.filter(p=>(p.tiers?.[k]||"No Tier")===t);
     return `<div class="tier-group" style="--tier-aura:${esc(data.settings.tierAuras[t]||TIER_AURAS[t])}">
       <div class="tier-group-head">${tierBadge(k,t,true)}<div class="tier-label"><strong>${esc(t)}</strong><span>${arr.length} player${arr.length===1?"":"s"}</span></div></div>
       <div class="tier-players">${arr.length?arr.map((p,i)=>`<div class="tier-player">
         <span class="tier-player-rank">${i+1}</span>
         <div class="tier-player-avatar"><img src="${esc(p.image||bustUrl(p.name))}" alt="${esc(p.name)}" onerror="this.src='https://render.crafty.gg/3d/bust/Steve';this.onerror=null"></div>
         <div class="tier-player-info"><b>${esc(p.name)}</b><small>${p.rank?esc(p.rank):"No rank"}${p.region?" • "+esc(p.region):""}</small></div>
         <div class="tier-player-badge">${tierBadge(k,t,true)}</div>
         ${logged?`<button class="small-btn" onclick="editPlayer('${esc(p.id)}')">Edit</button>`:""}
       </div>`).join(""):`<div class="tier-empty-row">No players in ${esc(t)}</div>`}</div>
     </div>`;
   }).join("");
   return `<div class="kit-board" style="--kit-aura:${esc(ks.aura||"#9b7cff")}">
     <div class="kit-board-head"><div class="board-icon kit-main-icon">${iconFor(k)}</div><div><h3>${esc(k)}</h3><p>Same kit icon at every tier</p></div></div>
     <div class="tier-groups">${groups}</div>
   </div>`;
 }).join("");
 $("emptyState").classList.toggle("hidden",data.players.length>0);
}
function winnerName(e){return String(e.winner||e.winnerName||"").trim()}
function championCounts(){const counts={};data.events.forEach(e=>{const w=winnerName(e);if(!w)return;const key=w.toLowerCase();if(!counts[key])counts[key]={name:w,wins:0,events:[]};counts[key].wins++;counts[key].events.push(e.name||"Champions Event")});return Object.values(counts).sort((a,b)=>b.wins-a.wins||a.name.localeCompare(b.name)).slice(0,20)}
function renderChampions(){
 const champs=championCounts();
 $("championLeaderboard").innerHTML=champs.length?champs.map((c,i)=>`<div class="champion-row rank-${Math.min(i+1,3)}"><div class="champ-rank">${i+1}</div><div class="champ-medal">${i===0?"👑":i===1?"🥈":i===2?"🥉":"✦"}</div><div class="champ-info"><b>${esc(c.name)}</b><small>${c.events.slice(0,3).map(esc).join(" • ")}${c.events.length>3?" • …":""}</small></div><div class="wins"><strong>${c.wins}</strong><span>${c.wins===1?"WIN":"WINS"}</span></div></div>`).join(""):"<div class='empty'>No Champions Event winners yet.</div>";
 $("events").innerHTML=data.events.map((e,i)=>`<article class="event-card"><div class="event-meta">${esc(e.date||"DATE TBA")}</div><h3>${esc(e.name)}</h3><p>${esc(e.desc)}</p><b>🏆 ${esc(winnerName(e)||"Winner TBA")}</b>${logged?`<div class="card-actions"><button class="small-btn" onclick="editEvent(${i})">Edit</button> <button class="small-btn danger" onclick="delEvent(${i})">Delete</button></div>`:""}</article>`).join("")||"<div class='empty'>No Champions Events yet.</div>";
}
function renderSettings(){
 if(!logged)return;
 $("titleInput").value=data.settings.title;$("descInput").value=data.settings.description;$("codeInput").value="";
 $("kitSettings").innerHTML=KITS.map(([k])=>{let s=data.settings.kitSettings[k]||{};return `<div class="setting-row"><strong>${esc(k)}</strong><input data-kit-logo="${esc(k)}" placeholder="Logo image URL" value="${esc(s.logo||"")}"><label class="color-label">Aura <input type="color" data-kit-aura="${esc(k)}" value="${esc(s.aura||"#9b7cff")}"></label></div>`}).join("");
 const tierRows=TIERS.filter(t=>t!=="No Tier");
 $("tierSettings").innerHTML=tierRows.map(t=>`<div class="tier-setting-row"><div class="tier-setting-top"><b>${esc(t)}</b><input type="color" data-tier-aura="${esc(t)}" value="${esc(data.settings.tierAuras[t]||TIER_AURAS[t])}"></div><input class="tier-icon-url" data-tier-icon="${esc(t)}" placeholder="Paste ${esc(t)} icon image URL" value="${esc(data.settings.tierIcons?.[t]||"")}"></div>`).join("");
 const auraRows=[["1","#1"],["2","#2"],["3","#3"],["4-10","#4–10"],["11-50","#11–50"],["51-100","#51–100"]];
 $("rankSettings").innerHTML=auraRows.map(([key,label])=>`<label class="rank-color"><b>${label}</b><input type="color" data-rank-aura="${key}" value="${esc(data.settings.auras[key]||DEFAULT_AURAS[key])}"></label>`).join("")
}
function openPlayer(id=null){if(!logged)return login();editId=id;let p=id?data.players.find(x=>x.id===id):{name:"",region:"NA",rank:"",image:"",tiers:{}};$("playerModalTitle").textContent=id?"Edit Player":"Add Player";$("pName").value=p.name||"";$("pRegion").value=p.region||"NA";$("pRank").value=p.rank||"";$("pImage").value=p.image||"";$("kitInputs").innerHTML=KITS.map(([k])=>`<label class="kit-row"><strong>${esc(k)}</strong><select data-kit="${esc(k)}">${TIERS.map(t=>`<option ${((p.tiers||{})[k]||"No Tier")==t?"selected":""}>${t}</option>`).join("")}</select></label>`).join("");$("playerModal").classList.remove("hidden")}
function closePlayer(){$("playerModal").classList.add("hidden");editId=null}
function savePlayer(){if(!logged)return login();let name=$("pName").value.trim();if(!name)return alert("Enter a player name.");let tiers={};document.querySelectorAll("[data-kit]").forEach(s=>tiers[s.dataset.kit]=s.value);let p={id:editId||crypto.randomUUID(),name,region:$("pRegion").value,rank:$("pRank").value.trim(),image:$("pImage").value.trim(),tiers};if(editId)data.players=data.players.map(x=>x.id===editId?p:x);else data.players.push(p);save();render();closePlayer()}
function editPlayer(id){if(!logged)return login();openPlayer(id)}function delPlayer(id){if(!logged)return login();if(confirm("Delete this player?")){data.players=data.players.filter(p=>p.id!==id);save();render()}}
function login(){$("loginModal").classList.remove("hidden");$("loginCode").value="";$("loginCode").focus()}
function doLogin(){const entered=$("loginCode").value.trim();if(entered===(data.settings.code||DEFAULT_CODE)){logged=true;sessionStorage.setItem("grassEditorSession","1");$("loginModal").classList.add("hidden");render()}else alert("Wrong editor code.")}
function openEvent(i=null){if(!logged)return login();eventEdit=i;$("eventTitle").textContent=i===null?"Add Event":"Edit Event";let e=i===null?{}:data.events[i];$("eName").value=e.name||"";$("eDate").value=e.date||"";$("eWinnerCustom").value="";const sel=$("eWinner");sel.innerHTML='<option value="">Select winner</option>'+data.players.map(p=>`<option value="${esc(p.name)}">${esc(p.name)}</option>`).join("");const w=winnerName(e);if(w&&!data.players.some(p=>p.name.toLowerCase()===w.toLowerCase())){$("eWinnerCustom").value=w;sel.value=""}else sel.value=w||"";$("eDesc").value=e.desc||"";$("eventModal").classList.remove("hidden")}
function saveEvent(){if(!logged)return login();const selected=$("eWinner").value.trim(),custom=$("eWinnerCustom").value.trim();let e={name:$("eName").value.trim(),date:$("eDate").value.trim(),winner:custom||selected,desc:$("eDesc").value.trim()};if(!e.name)return alert("Enter an event name.");if(!e.winner)return alert("Select or enter the event winner.");if(eventEdit===null)data.events.push(e);else data.events[eventEdit]=e;save();render();$("eventModal").classList.add("hidden")}
function editEvent(i){openEvent(i)}function delEvent(i){if(!logged)return login();if(confirm("Delete this Champions Event?")){data.events.splice(i,1);save();render()}}
function saveSettings(){
 if(!logged)return login();
 data.settings.title=$("titleInput").value.trim()||"Minecraft PvP Rankings";data.settings.description=$("descInput").value.trim();
 let newCode=$("codeInput").value.trim();if(newCode)data.settings.code=newCode;
 KITS.forEach(([k])=>{data.settings.kitSettings[k]={logo:document.querySelector(`[data-kit-logo="${CSS.escape(k)}"]`)?.value.trim()||"",aura:document.querySelector(`[data-kit-aura="${CSS.escape(k)}"]`)?.value||"#9b7cff"}});
 ["1","2","3","4-10","11-50","51-100"].forEach(key=>data.settings.auras[key]=document.querySelector(`[data-rank-aura="${key}"]`)?.value||DEFAULT_AURAS[key]);
 document.querySelectorAll("[data-tier-aura]").forEach(input=>data.settings.tierAuras[input.dataset.tierAura]=input.value);document.querySelectorAll("[data-tier-icon]").forEach(input=>data.settings.tierIcons[input.dataset.tierIcon]=input.value.trim());
 save();render();alert("Settings saved!")
}
function exportData(){if(!logged)return login();const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="grass-tier-list.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function importData(file){if(!logged)return login();const r=new FileReader();r.onload=()=>{try{const incoming=JSON.parse(r.result);if(!incoming||!Array.isArray(incoming.players)||!Array.isArray(incoming.events))throw Error();data={...data,...incoming,settings:{...data.settings,...(incoming.settings||{})},};data.settings.auras={...DEFAULT_AURAS,...(data.settings.auras||{})};data.settings.tierAuras={...TIER_AURAS,...(data.settings.tierAuras||{})};data.settings.tierIcons={...DEFAULT_TIER_ICONS,...(data.settings.tierIcons||{})};data.settings.kitSettings={...DEFAULT_KIT_SETTINGS,...(data.settings.kitSettings||{})};KITS.forEach(([k])=>data.settings.kitSettings[k]={...DEFAULT_KIT_SETTINGS[k],...(data.settings.kitSettings[k]||{})});save();render();alert("Imported!")}catch{alert("Invalid GRASS JSON file.")}};r.readAsText(file)}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{if(b.classList.contains("admin-only")&&!logged)return login();document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.page).classList.add("active")});
$("addBtn").onclick=()=>openPlayer();$("closePlayer").onclick=closePlayer;$("cancelPlayer").onclick=closePlayer;$("savePlayer").onclick=savePlayer;$("loginBtn").onclick=()=>logged?(logged=false,sessionStorage.removeItem("grassEditorSession"),render()):login();$("closeLogin").onclick=$("closeLogin2").onclick=()=>$("loginModal").classList.add("hidden");$("doLogin").onclick=doLogin;$("addEvent").onclick=()=>openEvent();$("closeEvent").onclick=$("cancelEvent").onclick=()=>$("eventModal").classList.add("hidden");$("saveEvent").onclick=saveEvent;$("saveSettings").onclick=saveSettings;$("exportBtn").onclick=exportData;$("importBtn").onclick=()=>logged?$("importFile").click():login();$("importFile").onchange=e=>{if(e.target.files[0])importData(e.target.files[0]);e.target.value=""};render();
