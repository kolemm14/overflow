(function(w){'use strict';
  function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
  function bez(t,a,b,c,d){var m=1-t;return m*m*m*a+3*m*m*t*b+3*m*t*t*c+t*t*t*d;}
  function GraphEditor(canvas,onChange,onSelect){
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.curve=[.42,0,.58,1];this.drag=-1;this.special=null;this.onChange=onChange;this.onSelect=onSelect;this.preview=true;this.phase=0;this.bind();this.resize();this.animate();
  }
  GraphEditor.prototype.box=function(){return{x:36,y:20,w:Math.max(80,this.canvas.clientWidth-58),h:Math.max(80,this.canvas.clientHeight-55)};};
  GraphEditor.prototype.point=function(x,y,b){return{x:b.x+x*b.w,y:b.y+(1-(y+1)/3)*b.h};};
  GraphEditor.prototype.value=function(x,y,b){return{x:clamp((x-b.x)/b.w,.01,.99),y:clamp((1-(y-b.y)/b.h)*3-1,-1,2)};};
  GraphEditor.prototype.resize=function(){var d=window.devicePixelRatio||1;this.canvas.width=Math.round(this.canvas.clientWidth*d);this.canvas.height=Math.round(this.canvas.clientHeight*d);this.ctx.setTransform(d,0,0,d,0,0);this.draw();};
  GraphEditor.prototype.set=function(v,special,silent){this.curve=v?v.slice():this.curve;this.special=special||null;if(!silent&&this.onChange)this.onChange(this.curve);this.draw();};
  GraphEditor.prototype.bind=function(){var self=this;
    function pos(e){var r=self.canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
    self.canvas.addEventListener('mousedown',function(e){self.special=null;var p=pos(e),b=self.box(),hs=[self.point(self.curve[0],self.curve[1],b),self.point(self.curve[2],self.curve[3],b)];for(var i=0;i<2;i++)if(Math.hypot(p.x-hs[i].x,p.y-hs[i].y)<16){self.drag=i;self.onSelect&&self.onSelect(i,self.curve[i*2],self.curve[i*2+1]);e.preventDefault();return;}});
    window.addEventListener('mousemove',function(e){if(self.drag<0)return;var p=pos(e),v=self.value(p.x,p.y,self.box()),o=self.drag*2;self.curve[o]=v.x;self.curve[o+1]=v.y;self.onSelect&&self.onSelect(self.drag,v.x,v.y);self.onChange&&self.onChange(self.curve);self.draw();});
    window.addEventListener('mouseup',function(){self.drag=-1;});window.addEventListener('resize',function(){self.resize();});
  };
  GraphEditor.prototype.draw=function(){var c=this.ctx,w=this.canvas.clientWidth,h=this.canvas.clientHeight,b=this.box(),s=this.point(0,0,b),e=this.point(1,1,b),h1=this.point(this.curve[0],this.curve[1],b),h2=this.point(this.curve[2],this.curve[3],b),i;
    c.clearRect(0,0,w,h);c.fillStyle='#11161a';c.fillRect(0,0,w,h);c.strokeStyle='#293239';c.lineWidth=1;
    for(i=0;i<=8;i++){var gx=b.x+b.w*i/8,gy=b.y+b.h*i/8;c.beginPath();c.moveTo(gx,b.y);c.lineTo(gx,b.y+b.h);c.stroke();c.beginPath();c.moveTo(b.x,gy);c.lineTo(b.x+b.w,gy);c.stroke();}
    c.fillStyle='#b7c0c8';c.font='11px Arial';c.fillText('1',b.x-22,this.point(0,1,b).y+4);c.fillText('0',b.x-22,this.point(0,0,b).y+4);c.fillText('0',b.x-3,b.y+b.h+19);c.fillText('1',b.x+b.w-3,b.y+b.h+19);
    if(this.special==='hold'){c.strokeStyle='#e8edf1';c.lineWidth=3;c.beginPath();c.moveTo(s.x,s.y);c.lineTo(e.x,s.y);c.lineTo(e.x,e.y);c.stroke();return;}
    if(this.special==='bounce'){c.strokeStyle='#3193ff';c.lineWidth=3;c.beginPath();for(i=0;i<=90;i++){var t=i/90,y=t<.6?1-Math.pow(1-t/.6,3):1+Math.sin((t-.6)*Math.PI*7)*.18*(1-t)/.4,p=this.point(t,y,b);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);}c.stroke();return;}
    c.strokeStyle='#76828c';c.lineWidth=1.5;c.beginPath();c.moveTo(s.x,s.y);c.lineTo(h1.x,h1.y);c.moveTo(e.x,e.y);c.lineTo(h2.x,h2.y);c.stroke();c.strokeStyle='#3193ff';c.lineWidth=4;c.beginPath();c.moveTo(s.x,s.y);for(i=1;i<=100;i++){var t2=i/100,p2=this.point(bez(t2,0,this.curve[0],this.curve[2],1),bez(t2,0,this.curve[1],this.curve[3],1),b);c.lineTo(p2.x,p2.y);}c.stroke();
    [s,e].forEach(function(p){c.fillStyle='#edf3f8';c.beginPath();c.arc(p.x,p.y,5,0,Math.PI*2);c.fill();});[h1,h2].forEach(function(p){c.fillStyle='#737f89';c.beginPath();c.arc(p.x,p.y,7,0,Math.PI*2);c.fill();});
    if(this.preview){var tt=(Math.sin(this.phase)+1)/2,pp=this.point(bez(tt,0,this.curve[0],this.curve[2],1),bez(tt,0,this.curve[1],this.curve[3],1),b);c.fillStyle='#fff';c.strokeStyle='#3193ff';c.lineWidth=3;c.beginPath();c.arc(pp.x,pp.y,9,0,Math.PI*2);c.fill();c.stroke();}
  };
  GraphEditor.prototype.animate=function(){var self=this;function tick(){self.phase+=.025;if(self.preview)self.draw();requestAnimationFrame(tick);}requestAnimationFrame(tick);};
  GraphEditor.drawMini=function(canvas,item){var c=canvas.getContext('2d'),w=canvas.clientWidth,h=canvas.clientHeight,d=window.devicePixelRatio||1;canvas.width=w*d;canvas.height=h*d;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,w,h);c.strokeStyle='#eff3f6';c.lineWidth=2;c.beginPath();if(item.kind==='hold'){c.moveTo(8,h-9);c.lineTo(w-10,h-9);c.lineTo(w-10,9);}else if(item.kind==='bounce'){for(var i=0;i<=45;i++){var t=i/45,y=t<.58?1-Math.pow(1-t/.58,3):1+Math.sin((t-.58)*Math.PI*6)*.2*(1-t)/.42,x=8+t*(w-16),py=h-8-y*(h-16);i?c.lineTo(x,py):c.moveTo(x,py);}}else{for(i=0;i<=45;i++){t=i/45;var x2=8+bez(t,0,item.v[0],item.v[2],1)*(w-16),y2=h-8-bez(t,0,item.v[1],item.v[3],1)*(h-16);i?c.lineTo(x2,y2):c.moveTo(x2,y2);}}c.stroke();};
  w.GraphEditor=GraphEditor;
})(window);

