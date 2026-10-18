#target aftereffects
(function(g){
    var api={};
    api.__ready=true;
    api.__version='1.0.1';
    function comp(){var c=app.project.activeItem;return(c&&c instanceof CompItem)?c:null;}
    function selected(){var c=comp();return c?c.selectedLayers:[];}
    function effects(layer){try{return layer.property('ADBE Effect Parade');}catch(e){return null;}}
    function add(layer,names,label){var parade=effects(layer);if(!parade)return null;for(var i=0;i<names.length;i++){try{if(parade.canAddProperty(names[i])){var fx=parade.addProperty(names[i]);if(fx&&label)fx.name='ETF - '+label;return fx;}}catch(e){}}return null;}
    function setp(fx,index,value){try{if(fx&&fx.property(index))fx.property(index).setValue(value);}catch(e){}}
    function stack(layer,list){var result={added:0,missing:[]};for(var i=0;i<list.length;i++){var fx=add(layer,list[i].names,list[i].label);if(fx){result.added++;if(list[i].index)setp(fx,list[i].index,list[i].value);}else result.missing.push(list[i].label);}return result;}
    var recipes={
      impact:[{names:['ADBE Glo2'],label:'Impact Glow'},{names:['ADBE Gaussian Blur 2'],label:'Impact Blur',index:1,value:8},{names:['ADBE Turbulent Displace'],label:'Impact Distort'},{names:['ADBE Sharpen'],label:'Impact Sharpen',index:1,value:18}],
      core:[{names:['ADBE Gaussian Blur 2'],label:'Core Blur',index:1,value:6},{names:['ADBE Unsharp Mask2','ADBE Sharpen'],label:'Core Sharpen'},{names:['ADBE Noise'],label:'Core Grain',index:1,value:5},{names:['ADBE Turbulent Displace'],label:'Core Distort'}],
      style:[{names:['ADBE Exposure2'],label:'Style Exposure',index:1,value:0.25},{names:['ADBE Glo2'],label:'Style Glow'},{names:['ADBE Noise'],label:'Style Grain',index:1,value:4},{names:['ADBE Sharpen'],label:'Style Detail',index:1,value:12}],
      color:[{names:['ADBE CurvesCustom'],label:'Color Curves'},{names:['ADBE Exposure2'],label:'Color Exposure'},{names:['ADBE Tint'],label:'Color Tone'},{names:['ADBE Noise'],label:'Color Grain',index:1,value:3}],
      pixel:[{names:['ADBE Mosaic'],label:'Pixel Blocks'},{names:['ADBE Turbulent Displace'],label:'Pixel Shift'},{names:['ADBE Geometry2'],label:'Pixel Transform'}],
      signal:[{names:['ADBE Wave Warp'],label:'Signal Warp'},{names:['ADBE Posterize Time'],label:'Signal FPS'},{names:['ADBE Noise'],label:'Signal Noise',index:1,value:8}],
      glitch:[{names:['ADBE Turbulent Displace'],label:'Glitch Distort'},{names:['ADBE Mosaic'],label:'Glitch Pixels'},{names:['ADBE Wave Warp'],label:'Glitch Scan'},{names:['ADBE Posterize Time'],label:'Glitch FPS'},{names:['ADBE Noise'],label:'Glitch Noise',index:1,value:12}],
      poly:[{names:['ADBE Find Edges'],label:'Poly Edges'},{names:['ADBE Tint'],label:'Poly Tone'},{names:['ADBE Easy Levels2'],label:'Poly Contrast'}]
    };
    function motion(layers){var done=0;for(var i=0;i<layers.length;i++){var l=layers[i];try{if(l.canSetTimeRemapEnabled){l.timeRemapEnabled=true;l.frameBlending=true;l.frameBlendingType=FrameBlendingType.PIXEL_MOTION;done++;}}catch(e){}}return done;}
    function flare(c){try{var l=c.layers.addSolid([0,0,0],'ETF - Lens Light',c.width,c.height,c.pixelAspect,c.duration);l.startTime=c.time;l.blendingMode=BlendingMode.SCREEN;var fx=add(l,['ADBE Lens Flare'],'Lens Light');if(!fx){l.remove();return 0;}setp(fx,1,[c.width/2,c.height/2]);return 1;}catch(e){return 0;}}
    api.applyRecipe=function(id){var c=comp();if(!c)return 'ERR|Ouvrez une composition.';var layers=selected();if(id!=='flare'&&!layers.length)return 'ERR|Sélectionnez au moins un calque.';var changed=0,added=0,missing=[];app.beginUndoGroup('EditTools Free - '+id);try{if(id==='motion')changed=motion(layers);else if(id==='flare')changed=flare(c);else if(recipes[id]){for(var i=0;i<layers.length;i++){var result=stack(layers[i],recipes[id]);if(result.added){changed++;added+=result.added;}for(var m=0;m<result.missing.length;m++)missing.push(result.missing[m]);}}else return 'ERR|Module inconnu.';}catch(e){return 'ERR|Application impossible : '+e.toString()+' (ligne '+(e.line||'?')+').';}finally{app.endUndoGroup();}if(!changed)return 'ERR|Aucun effet compatible n’a pu être ajouté'+(missing.length?' : '+missing.join(', '):'')+'.';return 'OK|'+changed+' calque(s) traité(s)'+(added?' • '+added+' effet(s) ajouté(s)':'')+(missing.length?' • indisponible(s) : '+missing.join(', '):'')+'.';};
    api.selectionInfo=function(){var c=comp();if(!c)return 'ERR|Aucune composition active.';var n=c.selectedLayers.length;return n?'OK|'+n+' calque(s) sélectionné(s).':'ERR|Aucun calque sélectionné.';};
    g.EditToolsHost=api;
})(this);
