(function(w){'use strict';
  function escapeJsString(value){return String(value).replace(/\\/g,'/').replace(/"/g,'\\"');}
  function hostPath(){
    try{
      var root=decodeURI(w.__adobe_cep__.getSystemPath('extension')||'').replace(/^file:\/\/+/, '');
      return escapeJsString(root+'/jsx/host.jsx');
    }catch(error){return '';}
  }
  function finish(result,callback){
    if(!result||result==='EvalScript error.')result='ERR|After Effects n’a pas pu exécuter la commande Ease Pro.';
    callback&&callback(result);
  }
  function call(expression,callback){
    if(!w.__adobe_cep__){callback&&callback('ERR|Pont Adobe CEP indisponible dans ce mode de prévisualisation.');return;}
    var load='$.evalFile(new File("'+hostPath()+'"))';
    w.__adobe_cep__.evalScript(load,function(loadResult){
      if(!loadResult||loadResult==='EvalScript error.'){
        finish('ERR|Le moteur de script After Effects n’a pas pu charger Ease Pro.',callback);
        return;
      }
      w.__adobe_cep__.evalScript(expression,function(result){finish(result,callback);});
    });
  }
  function curveExpr(name,curve,part){return 'EaseProHost.'+name+'('+curve.map(function(n){return Number(n).toFixed(6);}).join(',')+(part?',"'+part+'"':'')+')';}
  w.EaseBridge={
    apply:function(curve,part,cb){call(curveExpr('applyCurve',curve,part||'both'),cb);},
    mode:function(mode,cb){call('EaseProHost.setMode("'+mode+'")',cb);},
    copy:function(cb){call('EaseProHost.copyEase()',cb);},
    paste:function(cb){call('EaseProHost.pasteEase()',cb);},
    bounce:function(cb){call('EaseProHost.createBounce()',cb);}
  };
})(window);
