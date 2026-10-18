(function(){
 'use strict';function el(id){return document.getElementById(id);}
 el('apply').onclick=function(){
  if(!window.__adobe_cep__){el('status').textContent='Ouvrez ce panneau dans After Effects.';return;}
  var q={amount:Math.max(0,Number(el('amount').value)||0),speed:Math.max(.1,Number(el('speed').value)||15),seed:Number(el('seed').value)||0};
  ['slide','scale','light','blur','color'].forEach(function(m){q[m+'On']=el(m+'On').checked;});
  var root=decodeURI(window.__adobe_cep__.getSystemPath('extension')).replace(/^file:\/\/\//,'').replace(/\\/g,'/');
  var script='(function(){try{$.evalFile(new File('+JSON.stringify(root+'/jsx/stepped.jsx')+'));return FXPTwitchHost.applyConfig('+JSON.stringify(JSON.stringify(q))+');}catch(e){return "ERR|"+e.toString();}}())';
  el('apply').disabled=true;el('status').textContent='Application…';
  window.__adobe_cep__.evalScript(script,function(r){el('apply').disabled=false;el('status').textContent=String(r||'Réponse vide').replace(/^(OK|ERR)\|/,'');});
 };
})();
