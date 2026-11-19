/* The dashboard page: one file, no libraries; it asks for the token and reads /api/stats every 15 seconds. */
export const DASHBOARD = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>BCS Store Live</title>
<style>
:root{--bg:#07080a;--panel:#12151a;--edge:#232830;--text:#f2f4f7;--dim:#8f98a6;--red:#e4002b;--ok:#2ecc71}
@media (prefers-color-scheme: light){:root{--bg:#f4f5f7;--panel:#fff;--edge:#dfe2e8;--text:#14171c;--dim:#5d6675}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
header{display:flex;align-items:center;gap:12px;padding:18px 20px;border-bottom:1px solid var(--edge)}
header b{font-size:20px;letter-spacing:.02em}header i{display:inline-block;width:34px;height:12px;background:linear-gradient(100deg,#1c69d4 0 33%,#0a3d8f 33% 66%,var(--red) 66%);transform:skew(-20deg)}
header span{color:var(--dim);margin-left:auto;font-size:13px}
main{max-width:1100px;margin:0 auto;padding:20px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
.card{background:var(--panel);border:1px solid var(--edge);border-radius:6px;padding:16px;border-left:3px solid var(--red)}
.card small{color:var(--dim);display:block;text-transform:uppercase;font-size:12px;letter-spacing:.06em}
.card strong{font-size:38px;font-weight:650;display:block;line-height:1.15}
.live strong{color:var(--ok)}
h2{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--dim);margin:28px 0 8px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}
table{width:100%;border-collapse:collapse;background:var(--panel);border:1px solid var(--edge);border-radius:6px;overflow:hidden}
th,td{text-align:left;padding:8px 12px;border-bottom:1px solid var(--edge);white-space:nowrap}th{color:var(--dim);font-weight:500;font-size:12px}
td.n{text-align:right;font-variant-numeric:tabular-nums}.wrap{overflow-x:auto}
.dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--dim);margin-right:8px}.dot.on{background:var(--ok);box-shadow:0 0 6px var(--ok)}
#login{max-width:360px;margin:15vh auto;text-align:center}#login input,#login button{width:100%;padding:11px;margin-top:10px;font-size:15px;border-radius:5px;border:1px solid var(--edge);background:var(--panel);color:var(--text)}
#login button{background:var(--red);border-color:var(--red);color:#fff;cursor:pointer}
.err{color:var(--red);min-height:1.4em;margin-top:8px}.empty{color:var(--dim);padding:14px}
</style></head><body>
<header><i></i><b>BCS Store Live</b><span id="stamp"></span></header>
<div id="login" hidden><h2>Dashboard token</h2><input id="tok" type="password" placeholder="Token" autocomplete="off"><button id="go">Open</button><div class="err" id="err"></div></div>
<main id="main" hidden>
<div class="cards">
<div class="card live"><small>Online now</small><strong id="online">-</strong></div>
<div class="card"><small>Installed</small><strong id="installed">-</strong></div>
<div class="card"><small>Active 24 hours</small><strong id="d1">-</strong></div>
<div class="card"><small>Active 7 days</small><strong id="d7">-</strong></div>
</div>
<div class="grid">
<div><h2>Countries</h2><div class="wrap"><table id="tc"></table></div></div>
<div><h2>Store versions</h2><div class="wrap"><table id="tv"></table></div><h2>iDrive</h2><div class="wrap"><table id="th"></table></div></div>
</div>
<h2>Latest installs</h2><div class="wrap"><table id="tr"></table></div>
<p class="empty">Every Store 3.3.0 or later that reaches the internet is counted once. Online = heard from in the last 10 minutes. Addresses are shortened.</p>
</main>
<script>
var tok=sessionStorage.getItem('bcs-token')||'';
function $(i){return document.getElementById(i)}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function ago(t,now){var s=Math.max(0,now-t);return s<90?s+' s ago':s<5400?Math.round(s/60)+' min ago':s<172800?Math.round(s/3600)+' h ago':Math.round(s/86400)+' days ago'}
function flag(c){return c&&c.length===2?String.fromCodePoint.apply(null,c.toUpperCase().split('').map(function(x){return 127397+x.charCodeAt(0)}))+' ':''}
function rows(el,head,list,fn){el.innerHTML='<tr>'+head.map(function(h){return '<th'+(h[1]?' class="n"':'')+'>'+h[0]+'</th>'}).join('')+'</tr>'+(list.length?list.map(fn).join(''):'<tr><td colspan="'+head.length+'" class="empty">Nothing yet</td></tr>')}
function draw(d){
 $('online').textContent=d.online;$('installed').textContent=d.installed;$('d1').textContent=d.active24h;$('d7').textContent=d.active7d;
 rows($('tc'),[['Country'],['Installs',1],['Online',1]],d.byCountry,function(r){return '<tr><td>'+flag(r.k)+esc(r.k||'Unknown')+'</td><td class="n">'+r.n+'</td><td class="n">'+(r.online||0)+'</td></tr>'});
 rows($('tv'),[['Version'],['Installs',1]],d.byVersion,function(r){return '<tr><td>'+esc(r.k||'Unknown')+'</td><td class="n">'+r.n+'</td></tr>'});
 rows($('th'),[['Head unit'],['Installs',1]],d.byHmi,function(r){return '<tr><td>'+esc(r.k||'Unknown')+'</td><td class="n">'+r.n+'</td></tr>'});
 rows($('tr'),[['Status'],['Install'],['Location'],['Address'],['Store'],['iDrive'],['Last seen'],['First seen']],d.recent,function(r){
  var on=d.now-r.lastSeen<=d.onlineWindow;
  return '<tr><td><span class="dot'+(on?' on':'')+'"></span>'+(on?'Online':'Offline')+'</td><td>'+esc(r.id)+'</td><td>'+flag(r.country)+esc([r.city,r.region,r.country].filter(Boolean).join(', ')||'Unknown')+'</td><td>'+esc(r.ip)+'</td><td>'+esc(r.ver)+'</td><td>'+esc(r.hmi)+'</td><td>'+ago(r.lastSeen,d.now)+'</td><td>'+ago(r.firstSeen,d.now)+'</td></tr>'});
 $('stamp').textContent='Updated '+new Date().toLocaleTimeString();
}
function load(){
 fetch('/api/stats',{headers:{authorization:'Bearer '+tok},cache:'no-store'}).then(function(r){
  if(r.status===401){sessionStorage.removeItem('bcs-token');$('main').hidden=true;$('login').hidden=false;$('err').textContent=tok?'Wrong token':'';tok='';return null}
  return r.json()}).then(function(d){if(d){$('login').hidden=true;$('main').hidden=false;draw(d)}}).catch(function(){$('stamp').textContent='Offline'})}
$('go').onclick=function(){tok=$('tok').value.trim();sessionStorage.setItem('bcs-token',tok);load()};
$('tok').onkeydown=function(e){if(e.key==='Enter'){$('go').onclick()}};
if(tok){load()}else{$('login').hidden=false}
setInterval(function(){if(tok){load()}},15000);
</script></body></html>`;
