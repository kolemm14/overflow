(function(w){'use strict';
  var KEY='easeProUserPresets';
  function load(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[];}catch(e){return[];}}
  function save(list){localStorage.setItem(KEY,JSON.stringify(list));}
  function exportFile(list){var json=JSON.stringify({format:'ease-pro-presets',version:1,presets:list},null,2);if(w.cep&&w.cep.fs){var r=w.cep.fs.showSaveDialogEx('Exporter les presets','JSON',['json'],'ease-pro-presets.json');if(r&&r.data){var p=Array.isArray(r.data)?r.data[0]:r.data;w.cep.fs.writeFile(p,json);return true;}}var blob=new Blob([json],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ease-pro-presets.json';a.click();setTimeout(function(){URL.revokeObjectURL(a.href);},500);return true;}
  function parse(text){var x=JSON.parse(text),arr=Array.isArray(x)?x:x.presets;if(!Array.isArray(arr))throw new Error('Format de presets invalide.');return arr.filter(function(p){return p&&p.name&&Array.isArray(p.v)&&p.v.length===4;});}
  w.EasePresets={load:load,save:save,exportFile:exportFile,parse:parse};
})(window);

