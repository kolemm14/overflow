(function(w){'use strict';
  function call(expression,callback){
    if(!w.__adobe_cep__){callback&&callback('ERR|Pont Adobe CEP indisponible dans ce mode de prévisualisation.');return;}
    w.__adobe_cep__.evalScript(expression,function(result){callback&&callback(result||'');});
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

