var FXP3={};
(function(H){
 H.tag='FXP_TWITCH_3';
 H.defaults={Amount:0,Speed:25,Seed:0,Chance:65,Hold:70,Decay:35,Sync:1,Slide:1,Scale:1,Rotation:0,Light:1,Blur:1,Color:0,RGB:1,'Slide Amount':45,'Slide Rate':1,'Slide Seed':0,'Slide Direction':0,'Slide Spread':45,'Scale Amount':8,'Scale Rate':1,'Scale Seed':0,'Rotation Amount':2,'Rotation Rate':1,'Rotation Seed':0,'Light Amount':1,'Light Rate':1,'Light Seed':0,'Light Mode':1,'Blur Amount':12,'Blur Rate':1,'Blur Seed':0,'Color Amount':60,'Color Rate':1,'Color Seed':0,'RGB Amount':8,'RGB Rate':1,'RGB Seed':0,'Motion Blur':180};
 H.checks={Sync:1,Slide:1,Scale:1,Rotation:1,Light:1,Blur:1,Color:1,RGB:1};
 function prop(f,names,match,optional){
  var v=match?f.property(match):null;if(v)return v;
  for(var i=1;i<=f.numProperties;i++)for(var j=0;j<names.length;j++)if(f.property(i).name.toLowerCase()===names[j].toLowerCase())return f.property(i);
  if(optional)return null;throw Error('Parametre absent : '+f.name+' / '+names[0]);
 }
 function fx(p,m,n){if(!p.canAddProperty(m))throw Error('Effet absent : '+m);var f=p.addProperty(m);f.name=n;return f;}
 function c(n){return 'effect("'+n+'")(1)';}
 H.expression=function(m,offset,formula){
  return 'var master=Math.max(0,'+c('Amount')+')/100;\n'+
   'var hz=Math.max(.1,'+c('Speed')+'*Math.max(.01,'+c(m+' Rate')+'));\n'+
   'var tick=Math.floor(time*hz), phase=time*hz-tick;\n'+
   'var sd='+c('Seed')+'+'+c(m+' Seed')+';\n'+
   'seedRandom(sd+tick*173+('+c('Sync')+'?0:'+offset+'),true);\n'+
   'var active=random(0,100)<Math.max(0,Math.min(100,'+c('Chance')+'));\n'+
   'var hold=Math.max(.01,Math.min(1,'+c('Hold')+'/100));\n'+
   'var decay=Math.max(0,Math.min(1,'+c('Decay')+'/100));\n'+
   'var env=phase>=hold?0:(decay==0?1:Math.min(1,(hold-phase)/(hold*decay)));\n'+
   'seedRandom(sd+tick*173+'+offset+',true);\n'+
   'var amp='+c(m+' Amount')+'*master*(active?env:0);\n'+
   '('+c(m)+' && master>0) ? ('+formula+') : value;';
 };
 function bind(f,names,match,expression,base){var v=prop(f,names,match);if(!v.canSetExpression)throw Error('Expression non permise : '+f.name+' / '+v.name+' / '+v.matchName);if(base!==undefined)v.setValue(base);v.expression=expression;if(v.expressionError)throw Error(v.name+': '+v.expressionError);}
 function layer(cmp){var s=cmp.selectedLayers;for(var i=0;i<s.length;i++)if(s[i].comment===H.tag)return s[i];for(i=1;i<=cmp.numLayers;i++)if(cmp.layer(i).comment===H.tag)return cmp.layer(i);return null;}
 H.layer=layer;
 H.build=function(cmp,q){
  var l=cmp.layers.addSolid([1,1,1],'TWITCH 3',cmp.width,cmp.height,cmp.pixelAspect,cmp.duration),warnings=[],source=l.source;
  try{
   l.adjustmentLayer=true;l.comment=H.tag;var p=l.property('ADBE Effect Parade');
   for(var key in H.defaults)if(H.defaults.hasOwnProperty(key)){var f=fx(p,H.checks[key]?'ADBE Checkbox Control':'ADBE Slider Control',key);f.property(1).setValue(q[key]===undefined?H.defaults[key]:q[key]);}
   var tile=null;
   try{tile=fx(p,'ADBE Tile','FXP Edges');prop(tile,['Output Width','Largeur de sortie']).setValue(200);prop(tile,['Output Height','Hauteur de sortie']).setValue(200);prop(tile,['Mirror Edges','Contours du miroir','Miroir sur les contours']).setValue(1);}catch(edgeError){if(tile)tile.remove();warnings.push('Bords miroir indisponibles : '+edgeError.toString());}
   var t=fx(p,'ADBE Geometry2','FXP Motion');
   bind(t,['Position'],'ADBE Geometry2-0002',H.expression('Slide',11,'(function(){var angle=degreesToRadians('+c('Slide Direction')+'+random(-'+c('Slide Spread')+','+c('Slide Spread')+'));var distance=random(-amp,amp);return value+[Math.cos(angle)*distance,Math.sin(angle)*distance];})()'));
   bind(t,['Scale','Scale Height'],'ADBE Geometry2-0003',H.expression('Scale',23,'value+random(0,Math.max(0,amp))'));
   bind(t,['Scale Width'],'ADBE Geometry2-0004',H.expression('Scale',23,'value+random(0,Math.max(0,amp))'));
   bind(t,['Rotation'],'ADBE Geometry2-0007',H.expression('Rotation',31,'value+random(-amp,amp)'));
   var useComp=prop(t,[], 'ADBE Geometry2-0009',true);
   var shutter=prop(t,[], 'ADBE Geometry2-0010',true);
   if(useComp&&shutter){useComp.setValue(0);if(shutter.canSetExpression)shutter.expression='Math.max(0,Math.min(360,'+c('Motion Blur')+'));';else shutter.setValue(q['Motion Blur']===undefined?180:q['Motion Blur']);}else warnings.push('Angle du flou de mouvement non accessible sur cette version.');
   var light=fx(p,'ADBE Exposure2','FXP Light');
   bind(light,['Exposure','Exposition'],null,H.expression('Light',43,'value+('+c('Light Mode')+'==2?-1:('+c('Light Mode')+'==3?(random()<.5?-1:1):1))*random(0,Math.max(0,amp))'),0);
   var blur=fx(p,'ADBE Box Blur2','FXP Blur');
   bind(blur,['Blur Radius','Rayon de flou'],null,H.expression('Blur',53,'value+random(0,Math.max(0,amp))'),0);
   prop(blur,['Repeat Edge Pixels','Répéter les pixels du contour','Répéter les pixels de la bordure']).setValue(1);
   var hue=fx(p,'ADBE Color Balance (HLS)','FXP Color');
   bind(hue,['Hue','Teinte'],null,H.expression('Color',67,'value+random(-amp,amp)'),0);
   var rgb=null;
   try{
    var match=null;
    for(var i=0;i<app.effects.length;i++)if(/chromatic.*aberr|aberr.*chromat/i.test(app.effects[i].displayName+' '+app.effects[i].matchName)){match=app.effects[i].matchName;break;}
    if(!match)throw Error('VR Chromatic Aberrations absent');
    rgb=fx(p,match,'FXP RGB');
    bind(rgb,['Aberration (Red)','Aberration (rouge)'],null,H.expression('RGB',79,'random(0,Math.max(0,amp))'),0);
    bind(rgb,['Aberration (Blue)','Aberration (bleu)'],null,H.expression('RGB',79,'-random(0,Math.max(0,amp))'),0);
    prop(rgb,['Aberration (Green)','Aberration (vert)']).setValue(0);
   }catch(rgbError){if(rgb)rgb.remove();p.property('RGB').property(1).setValue(0);warnings.push('RGB desactive : '+rgbError.toString());}
   l.property('ADBE Transform Group').property('ADBE Opacity').expression='effect("Amount")(1)>0 ? 100 : 0;';
   for(i=1;i<=cmp.numLayers;i++)cmp.layer(i).selected=false;l.selected=true;
   return {layer:l,warnings:warnings};
  }catch(e){l.remove();if(source.usedIn.length===0)source.remove();throw e;}
 };
 H.run=function(method,json){
  var q=eval('('+json+')'),cmp=app.project.activeItem;
  if(!(cmp instanceof CompItem))return 'ERR|Ouvrez une composition.';
  app.beginUndoGroup('FXP Twitch 3');
  try{
   var l=layer(cmp),p,k,skipped=[];
   if(method==='create'){
    if(l)return 'OK|TWITCH 3 existe deja. Utilisez Mettre a jour ou Impact.';
    var built=H.build(cmp,q);return 'OK|TWITCH 3 cree. '+built.warnings.join(' | ');
   }
   if(!l)return 'ERR|Creez TWITCH 3 dans cette composition.';
   p=l.property('ADBE Effect Parade');
   if(method==='update'){
    for(k in H.defaults)if(H.defaults.hasOwnProperty(k)&&q[k]!==undefined){var v=p.property(k).property(1);if(v.numKeys||v.expressionEnabled)skipped.push(k);else v.setValue(q[k]);}
    if(!p.property('FXP RGB'))p.property('RGB').property(1).setValue(0);
    return 'OK|Reglages appliques.'+(skipped.length?' Animation conservee : '+skipped.join(', '):'');
   }
   if(method==='impact'){
    var a=p.property('Amount').property(1),start=cmp.time,frames=Math.max(2,Math.round(q.frames||6)),end=start+frames*cmp.frameDuration;
    if(start-cmp.frameDuration<l.inPoint||end>=Math.min(l.outPoint,cmp.duration))return 'ERR|Placez la tete de lecture une image apres le debut et assez loin de la fin.';
    if(a.expressionEnabled)return 'ERR|Amount contient une expression.';
    for(var i=1;i<=a.numKeys;i++)if(a.keyTime(i)>=start-cmp.frameDuration-.0001&&a.keyTime(i)<=end+.0001)return 'ERR|Des cles Amount existent dans cette zone. Choisissez un autre instant.';
    a.setValueAtTime(start-cmp.frameDuration,0);a.setValueAtTime(start,Math.max(0,q.peak||80));a.setValueAtTime(end,0);
    return 'OK|Impact cree sur '+frames+' images.';
   }
   return 'ERR|Commande inconnue.';
  }catch(e){return 'ERR|'+e.toString();}finally{app.endUndoGroup();}
 };
})(FXP3);
