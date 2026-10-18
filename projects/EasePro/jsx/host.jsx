#target aftereffects

var EaseProHost = EaseProHost || {};

(function(api){
    var copiedEase = null;
    function clamp(n,a,b){ return Math.max(a,Math.min(b,n)); }
    function targets(){
        var out=[],comp=app.project&&app.project.activeItem;
        if(!(comp&&comp instanceof CompItem)) return out;
        var props=comp.selectedProperties;
        for(var i=0;i<props.length;i++){
            try{if(props[i].propertyType===PropertyType.PROPERTY&&props[i].canVaryOverTime&&props[i].selectedKeys.length)out.push(props[i]);}catch(ignore){}
        }
        return out;
    }
    function rates(prop,a,b,count){
        var dt=Math.max(.000001,Math.abs(prop.keyTime(b)-prop.keyTime(a))),va=prop.keyValue(a),vb=prop.keyValue(b),r=[],i;
        if(count===1){
            if(va instanceof Array&&vb instanceof Array){var d=0;for(i=0;i<Math.min(va.length,vb.length);i++)d+=Math.pow(vb[i]-va[i],2);r[0]=Math.sqrt(d)/dt;}
            else r[0]=(Number(vb)-Number(va))/dt;
        }else{
            for(i=0;i<count;i++)r[i]=((vb instanceof Array?Number(vb[i]):Number(vb))-(va instanceof Array?Number(va[i]):Number(va)))/dt;
        }
        return r;
    }
    function easeArray(count,r,slope,influence){var out=[];for(var i=0;i<count;i++)out.push(new KeyframeEase((r[Math.min(i,r.length-1)]||0)*slope,clamp(influence,.1,100)));return out;}
    api.applyCurve=function(x1,y1,x2,y2,part){
        var list=targets();if(!list.length)return "ERR|Sélectionne au moins une image clé avec une voisine.";
        x1=clamp(Number(x1),.001,.999);x2=clamp(Number(x2),.001,.999);y1=Number(y1);y2=Number(y2);
        if(isNaN(y1)||isNaN(y2))return "ERR|Coordonnées de courbe invalides.";
        part=part||"both";var changed=0;app.beginUndoGroup("Ease Pro - Appliquer "+part);
        try{
            for(var p=0;p<list.length;p++){var prop=list[p],keys=prop.selectedKeys;
                for(var j=0;j<keys.length;j++){var k=keys[j],ic=prop.keyInTemporalEase(k).length,oc=prop.keyOutTemporalEase(k).length;
                    var ir=k>1?rates(prop,k-1,k,ic):[0],or=k<prop.numKeys?rates(prop,k,k+1,oc):[0];
                    var oldIn=prop.keyInTemporalEase(k),oldOut=prop.keyOutTemporalEase(k),oldInType=prop.keyInInterpolationType(k),oldOutType=prop.keyOutInterpolationType(k);
                    var newIn=easeArray(ic,ir,(1-y2)/(1-x2),(1-x2)*100),newOut=easeArray(oc,or,y1/x1,x1*100);
                    prop.setInterpolationTypeAtKey(k,part==="out"?oldInType:KeyframeInterpolationType.BEZIER,part==="in"?oldOutType:KeyframeInterpolationType.BEZIER);
                    try{prop.setTemporalAutoBezierAtKey(k,false);}catch(a){}try{prop.setTemporalContinuousAtKey(k,false);}catch(c){}
                    prop.setTemporalEaseAtKey(k,part==="out"?oldIn:newIn,part==="in"?oldOut:newOut);changed++;
                }
            }
        }catch(e){return "ERR|Propriété incompatible : "+e.toString();}finally{app.endUndoGroup();}
        return changed+" image(s) clé(s) modifiée(s).";
    };
    api.setMode=function(mode){
        var list=targets();if(!list.length)return "ERR|Sélectionne les images clés à modifier.";var changed=0;
        app.beginUndoGroup("Ease Pro - "+mode);
        try{for(var p=0;p<list.length;p++){var prop=list[p],keys=prop.selectedKeys;for(var j=0;j<keys.length;j++){var k=keys[j];
            if(mode==="hold")prop.setInterpolationTypeAtKey(k,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);
            else if(mode==="linear")prop.setInterpolationTypeAtKey(k,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.LINEAR);
            else{prop.setInterpolationTypeAtKey(k,KeyframeInterpolationType.BEZIER,KeyframeInterpolationType.BEZIER);try{prop.setTemporalAutoBezierAtKey(k,false);}catch(a){}try{prop.setTemporalContinuousAtKey(k,true);}catch(c){}}
            changed++;}}}catch(e){return "ERR|Commande impossible : "+e.toString();}finally{app.endUndoGroup();}
        return changed+" image(s) clé(s) : "+(mode==="hold"?"maintien":mode==="linear"?"linéaire":"continu")+".";
    };
    api.copyEase=function(){
        var list=targets();if(!list.length)return "ERR|Sélectionne une image clé à copier.";var p=list[0],k=p.selectedKeys[0];
        copiedEase={i:p.keyInTemporalEase(k),o:p.keyOutTemporalEase(k),it:p.keyInInterpolationType(k),ot:p.keyOutInterpolationType(k)};
        if(copiedEase.it===KeyframeInterpolationType.HOLD&&copiedEase.ot===KeyframeInterpolationType.HOLD)return "MODE|hold";
        if(copiedEase.it===KeyframeInterpolationType.LINEAR&&copiedEase.ot===KeyframeInterpolationType.LINEAR)return "MODE|linear";
        var x1=clamp(copiedEase.o[0].influence/100,.01,.99),x2=clamp(1-copiedEase.i[0].influence/100,.01,.99);
        var ir=k>1?rates(p,k-1,k,copiedEase.i.length):[0],or=k<p.numKeys?rates(p,k,k+1,copiedEase.o.length):[0];
        var outSlope=Math.abs(or[0])>.000001?copiedEase.o[0].speed/or[0]:0,inSlope=Math.abs(ir[0])>.000001?copiedEase.i[0].speed/ir[0]:0;
        return "DATA|"+[x1,x1*outSlope,x2,1-(1-x2)*inSlope].join(",");
    };
    function fit(src,n){var out=[];for(var i=0;i<n;i++){var e=src[Math.min(i,src.length-1)];out.push(new KeyframeEase(e.speed,e.influence));}return out;}
    api.pasteEase=function(){if(!copiedEase)return "ERR|Copie d'abord un easing.";var list=targets();if(!list.length)return "ERR|Sélectionne les destinations.";var changed=0;app.beginUndoGroup("Ease Pro - Coller");try{for(var p=0;p<list.length;p++){var prop=list[p],keys=prop.selectedKeys;for(var j=0;j<keys.length;j++){var k=keys[j];prop.setInterpolationTypeAtKey(k,copiedEase.it,copiedEase.ot);if(copiedEase.it===KeyframeInterpolationType.BEZIER||copiedEase.ot===KeyframeInterpolationType.BEZIER){try{prop.setTemporalAutoBezierAtKey(k,false);}catch(a){}prop.setTemporalEaseAtKey(k,fit(copiedEase.i,prop.keyInTemporalEase(k).length),fit(copiedEase.o,prop.keyOutTemporalEase(k).length));}changed++;}}}catch(e){return "ERR|Collage impossible : "+e.toString();}finally{app.endUndoGroup();}return changed+" image(s) clé(s) mise(s) à jour.";};
    function bounceValue(start,end,factor){
        if(start instanceof Array&&end instanceof Array){var out=[];for(var i=0;i<Math.min(start.length,end.length);i++)out[i]=end[i]+(end[i]-start[i])*factor;return out;}
        return Number(end)+(Number(end)-Number(start))*factor;
    }
    api.createBounce=function(){
        var list=targets();if(!list.length)return "ERR|Sélectionne deux images clés par propriété pour créer le rebond.";
        var created=0,skipped=0;app.beginUndoGroup("Ease Pro - Custom Bounce Pro");
        try{
            for(var p=0;p<list.length;p++){
                var prop=list[p],keys=prop.selectedKeys;
                if(keys.length<2){skipped++;continue;}
                var first=keys[0],last=keys[keys.length-1],t0=prop.keyTime(first),t1=prop.keyTime(last),v0=prop.keyValue(first),v1=prop.keyValue(last),dt=t1-t0;
                if(dt<=0){skipped++;continue;}
                var times=[t0+dt*.62,t0+dt*.78,t0+dt*.91];
                var values=[bounceValue(v0,v1,.12),bounceValue(v0,v1,-.045),bounceValue(v0,v1,.018)];
                for(var n=0;n<times.length;n++){
                    prop.setValueAtTime(times[n],values[n]);
                    var k=prop.nearestKeyIndex(times[n]);
                    prop.setInterpolationTypeAtKey(k,KeyframeInterpolationType.BEZIER,KeyframeInterpolationType.BEZIER);
                    try{prop.setTemporalAutoBezierAtKey(k,true);}catch(a){}
                    try{prop.setTemporalContinuousAtKey(k,true);}catch(c){}
                    created++;
                }
                var endIndex=prop.nearestKeyIndex(t1);
                try{prop.setTemporalAutoBezierAtKey(endIndex,true);}catch(endAuto){}
            }
        }catch(e){return "ERR|Rebond impossible sur cette propriété : "+e.toString();}finally{app.endUndoGroup();}
        if(!created)return "ERR|Il faut sélectionner deux clés compatibles sur la même propriété.";
        return "Custom Bounce : "+created+" clé(s) amortie(s) créée(s)"+(skipped?" · "+skipped+" propriété(s) ignorée(s)":"")+".";
    };
})(EaseProHost);
