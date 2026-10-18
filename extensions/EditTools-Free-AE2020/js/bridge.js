(function(w){'use strict';
  function esc(s){return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\r/g,'').replace(/\n/g,'\\n');}
  function hostLoader(){
    try{
      var root=decodeURI(w.__adobe_cep__.getSystemPath('extension')||'').replace(/^file:\/\/+/, '');
      var host=String(root+'/jsx/host.jsx').replace(/\\/g,'/').replace(/"/g,'\\"');
      return 'if(typeof EditToolsHost==="undefined"||!EditToolsHost.__ready){$.evalFile(new File("'+host+'"));}';
    }catch(e){return '';}
  }
  function call(method,arg,done){
    if(!w.__adobe_cep__){done&&done('DEMO|Aperçu navigateur : ouvrez le panneau dans After Effects.');return;}
    var code='(function(){try{'+hostLoader()+'if(typeof EditToolsHost==="undefined")return "ERR|Moteur EditTools introuvable.";return EditToolsHost.'+method+'("'+esc(arg||'')+'");}catch(e){return "ERR|Erreur EditTools : "+e.toString()+" (ligne "+(e.line||"?")+")";}}())';
    w.__adobe_cep__.evalScript(code,function(r){
      if(!r||r==='EvalScript error.')r='ERR|After Effects n’a pas pu exécuter la commande EditTools.';
      done&&done(r);
    });
  }
  w.EditToolsBridge={apply:function(id,cb){call('applyRecipe',id,cb);},selection:function(cb){call('selectionInfo','',cb);}};
})(window);
