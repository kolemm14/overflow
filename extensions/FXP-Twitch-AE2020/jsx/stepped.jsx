var FXPTwitchHost={};
(function(H){
 H.__ready=true;
 function find(f,names,match){
  if(match&&f.property(match))return f.property(match);
  for(var i=1;i<=f.numProperties;i++)for(var j=0;j<names.length;j++)if(f.property(i).name.toLowerCase()===names[j].toLowerCase())return f.property(i);
  throw Error('Parametre introuvable: '+names[0]);
 }
 function expression(m,k,body){return 'var s=Math.max(.1,effect("Speed")(1));posterizeTime(s);var a=Math.max(0,effect("Amount")(1));seedRandom(effect("Seed")(1)+'+k+'+Math.floor(time*s)*101,true);(effect("'+m+'")(1)==1 && a>0)?('+body+'):value;';}
 function add(p,m,n){var f=p.addProperty(m);f.name=n;return f;}
 H.applyConfig=function(s){
  app.beginUndoGroup('FXP Twitch Saccades');var l=null,created=false;
  try{
   var q=eval('('+s+')'),c=app.project.activeItem;
   if(!(c instanceof CompItem))throw Error('Ouvrez une composition.');
   for(var i=1;i<=c.numLayers;i++)if(c.layer(i).comment==='FXP_TWITCH_V2'){l=c.layer(i);break;}
   if(!l){l=c.layers.addSolid([1,1,1],'TWITCH',c.width,c.height,c.pixelAspect,c.duration);l.adjustmentLayer=true;l.comment='FXP_TWITCH_V2';created=true;}
   var p=l.property('ADBE Effect Parade'),names=['Amount','Speed','Seed','Slide','Scale','Light','Blur','Color'],vals=[q.amount,q.speed,q.seed,q.slideOn?1:0,q.scaleOn?1:0,q.lightOn?1:0,q.blurOn?1:0,q.colorOn?1:0];
   for(i=0;i<names.length;i++){var f=p.property(names[i]);if(!f)f=add(p,i<3?'ADBE Slider Control':'ADBE Checkbox Control',names[i]);var v=f.property(1);if(!v.numKeys&&!v.expressionEnabled)v.setValue(vals[i]);}
   if(created){
    var t=add(p,'ADBE Geometry2','Twitch Transform');
    find(t,['Position'],'ADBE Geometry2-0002').expression=expression('Slide',1,'value+[random(-a,a),random(-a,a)]');
    find(t,['Scale Height'],'ADBE Geometry2-0004').expression=expression('Scale',2,'value+random(0,a/4)');
    find(t,['Scale Width'],'ADBE Geometry2-0005').expression=expression('Scale',2,'value+random(0,a/4)');
    var e=add(p,'ADBE Exposure2','Twitch Light');
    find(e,['Exposure','Exposition']).expression=expression('Light',3,'value+Math.max(0,random(-a/15,a/15))');
    var b=add(p,'ADBE Box Blur2','Twitch Blur');
    find(b,['Blur Radius','Rayon de flou']).expression=expression('Blur',4,'value+Math.max(0,random(-a/4,a/4))');
    find(b,['Repeat Edge Pixels','Répéter les pixels du contour','Répéter les pixels de la bordure']).setValue(1);
    var h=add(p,'ADBE HUE SATURATION','Twitch Color');
    find(h,['Master Hue','Phase de la teinte','Teinte principale']).expression=expression('Color',5,'value+random(-a*2,a*2)');
   }
   l.selected=true;
   return 'OK|TWITCH prêt. Animez Amount dans Options d’effets : 0 → 100 → 0. Les contrôles déjà animés sont conservés.';
  }catch(e){if(created&&l)l.remove();return 'ERR|'+e.toString();}finally{app.endUndoGroup();}
 };
})(FXPTwitchHost);
