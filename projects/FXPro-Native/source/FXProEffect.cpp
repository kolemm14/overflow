#include "FXProEffect.h"
#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstring>

struct ParamSpec { const char* name; double minv; double maxv; double defv; };

static const ParamSpec* Specs() {
#if FX_KIND == 1
    static ParamSpec s[8]={{"Amount",0,200,75},{"Position",0,300,55},{"Rotation",0,45,8},{"Scale",0,30,3},{"Frequency",0.1,30,6},{"Smoothness",0,100,70},{"Random Seed",1,999,42},{"Direction",0,360,0}};
#elif FX_KIND == 2
    static ParamSpec s[8]={{"Threshold",0,100,62},{"Radius",1,300,80},{"Intensity",0,5,1.5},{"Exposure",-2,5,0.35},{"Gamma",0.2,3,1},{"Saturation",0,200,120},{"Falloff",0.2,3,1.25},{"Mix",0,100,100}};
#elif FX_KIND == 3
    static ParamSpec s[8]={{"Speed",5,400,50},{"Frame Blend",0,100,70},{"Motion Sensitivity",0,100,70},{"Smoothness",0,100,60},{"Frame Offset",-10,10,0},{"Detail",0,100,50},{"Edge Protection",0,100,80},{"Mix",0,100,100}};
#elif FX_KIND == 4
    static ParamSpec s[8]={{"Blur Amount",0,200,40},{"Direction",0,360,0},{"Samples",2,32,12},{"Shutter Angle",0,720,240},{"Sensitivity",0,100,60},{"Vector Scale",25,300,100},{"Direction Bias",-180,180,0},{"Mix",0,100,100}};
#elif FX_KIND == 5
    static ParamSpec s[8]={{"Progress",0,100,0},{"Zoom",50,350,140},{"Rotation",-45,45,8},{"Direction",0,360,0},{"Whip",0,200,65},{"Blur",0,100,30},{"Overshoot",0,50,12},{"Edge Extend",100,500,220}};
#elif FX_KIND == 6
    static ParamSpec s[8]={{"Amount",0,100,45},{"Red Shift",-80,80,12},{"Green Shift",-80,80,0},{"Blue Shift",-80,80,-12},{"Angle",0,360,0},{"Protect Center",0,100,55},{"Edge Falloff",0,100,65},{"Mix",0,100,100}};
#else
    static ParamSpec s[8]={{"Progress",0,100,100},{"Strength",0,200,100},{"Shake",0,200,75},{"Zoom",50,250,145},{"RGB Split",0,100,55},{"Glow",0,300,120},{"Motion Blur",0,200,45},{"Random Seed",1,999,42}};
#endif
    return s;
}

static PF_Err About(PF_OutData* out) {
    std::snprintf(out->return_msg, PF_MAX_EFFECT_MSG_LEN, "%s v1.0\rNative effect pack for After Effects 2020\rFX Pro", FX_NAME);
    return PF_Err_NONE;
}

static PF_Err GlobalSetup(PF_OutData* out) {
    out->my_version=FXPRO_VERSION_VALUE;
    out->out_flags=PF_OutFlag_DEEP_COLOR_AWARE;
    return PF_Err_NONE;
}

static PF_Err ParamsSetup(PF_InData* in_data, PF_OutData* out) {
    PF_Err err=PF_Err_NONE;
    PF_ParamDef def;
    const ParamSpec* s=Specs();
    for(int i=0;i<8;i++){
        AEFX_CLR_STRUCT(def);
        PF_ADD_FLOAT_SLIDERX(s[i].name,s[i].minv,s[i].maxv,s[i].minv,s[i].maxv,s[i].defv,PF_Precision_HUNDREDTHS,0,0,FX_P1_ID+i);
    }
    out->num_params=FX_NUM_PARAMS;
    return err;
}

template<class P> static inline double chanMax();
template<> inline double chanMax<PF_Pixel8>(){return PF_MAX_CHAN8;}
template<> inline double chanMax<PF_Pixel16>(){return PF_MAX_CHAN16;}

static inline int mirrorIndex(int v,int size){if(size<=1)return 0;while(v<0||v>=size){if(v<0)v=-v-1;else v=2*size-v-1;}return v;}

template<class P> static inline P readPixel(const PF_LayerDef* src,int x,int y){
    x=mirrorIndex(x,src->width); y=mirrorIndex(y,src->height);
    const char* row=(const char*)src->data+y*src->rowbytes;
    return ((const P*)row)[x];
}

template<class P> static inline P mixPixel(const P& a,const P& b,double m){
    P o; double mx=chanMax<P>();
    o.alpha=(decltype(o.alpha))std::clamp(a.alpha*(1-m)+b.alpha*m,0.0,mx);
    o.red=(decltype(o.red))std::clamp(a.red*(1-m)+b.red*m,0.0,mx);
    o.green=(decltype(o.green))std::clamp(a.green*(1-m)+b.green*m,0.0,mx);
    o.blue=(decltype(o.blue))std::clamp(a.blue*(1-m)+b.blue*m,0.0,mx);
    return o;
}

template<class P> static P sampleLinear(const PF_LayerDef* src,double x,double y){
    int x0=(int)std::floor(x),y0=(int)std::floor(y);double fx=x-x0,fy=y-y0;
    P a=readPixel<P>(src,x0,y0),b=readPixel<P>(src,x0+1,y0),c=readPixel<P>(src,x0,y0+1),d=readPixel<P>(src,x0+1,y0+1);
    P ab=mixPixel(a,b,fx),cd=mixPixel(c,d,fx);return mixPixel(ab,cd,fy);
}

template<class P> static PF_Err RenderPixels(PF_InData* in,PF_ParamDef* params[],PF_LayerDef* out){
    const PF_LayerDef* src=&params[FX_INPUT]->u.ld; const ParamSpec* sp=Specs();
    double p[8];for(int i=0;i<8;i++)p[i]=params[FX_P1+i]->u.fs_d.value;
    double t=in->time_scale?double(in->current_time)/double(in->time_scale):0.0;
    double cx=(out->width-1)*0.5,cy=(out->height-1)*0.5,mx=chanMax<P>();
    for(int y=0;y<out->height;y++){
        P* dst=(P*)((char*)out->data+y*out->rowbytes);
        for(int x=0;x<out->width;x++){
            P original=readPixel<P>(src,x,y),result=original;
#if FX_KIND == 1
            double amp=p[0]/100.0,pos=p[1]*amp,freq=p[4]*(1.0-p[5]/140.0),seed=p[6],dir=p[7]*3.141592653589793/180.0;
            double nx=std::sin((t*freq+seed*.137)*6.28318),ny=std::sin((t*freq*1.171+seed*.293)*6.28318);
            double dx=(nx*std::cos(dir)-ny*std::sin(dir))*pos,dy=(nx*std::sin(dir)+ny*std::cos(dir))*pos;
            double rot=std::sin((t*freq*.73+seed)*6.28318)*p[2]*amp*3.141592653589793/180.0,sc=1.0+std::sin((t*freq*.51+seed*.7)*6.28318)*p[3]*amp/100.0;
            double xx=(x-cx)/sc,yy=(y-cy)/sc;result=sampleLinear<P>(src,cx+xx*std::cos(rot)+yy*std::sin(rot)-dx,cy-xx*std::sin(rot)+yy*std::cos(rot)-dy);
#elif FX_KIND == 2
            double threshold=p[0]/100.0*mx,r=std::max(1.0,p[1]/10.0),intensity=p[2],mix=p[7]/100.0;double sr=0,sg=0,sb=0,sa=0,w=0;
            const int ox[9]={0,1,-1,0,0,1,1,-1,-1},oy[9]={0,0,0,1,-1,1,-1,1,-1};
            for(int k=0;k<9;k++){P q=readPixel<P>(src,x+(int)(ox[k]*r),y+(int)(oy[k]*r));double lum=(q.red+q.green+q.blue)/3.0;if(lum>threshold){double wk=k?0.7:1.0;sr+=q.red*wk;sg+=q.green*wk;sb+=q.blue*wk;sa+=q.alpha*wk;w+=wk;}}
            if(w>0){P g=original;g.red=(decltype(g.red))std::clamp(original.red+sr/w*intensity,0.0,mx);g.green=(decltype(g.green))std::clamp(original.green+sg/w*intensity,0.0,mx);g.blue=(decltype(g.blue))std::clamp(original.blue+sb/w*intensity,0.0,mx);result=mixPixel(original,g,mix);}
#elif FX_KIND == 3
            double smooth=p[3]/100.0,detail=std::max(1.0,p[5]/25.0);P a=readPixel<P>(src,x-(int)detail,y),b=readPixel<P>(src,x+(int)detail,y),c=readPixel<P>(src,x,y-(int)detail),d=readPixel<P>(src,x,y+(int)detail);P avg=mixPixel(mixPixel(a,b,.5),mixPixel(c,d,.5),.5);result=mixPixel(original,avg,smooth*(p[7]/100.0)*.35);
#elif FX_KIND == 4
            double len=p[0],ang=(p[1]+p[6])*3.141592653589793/180.0,mix=p[7]/100.0;int samples=std::max(2,std::min(32,(int)p[2]));double sr=0,sg=0,sb=0,sa=0;
            for(int k=0;k<samples;k++){double u=double(k)/(samples-1)-.5;P q=sampleLinear<P>(src,x+std::cos(ang)*len*u,y+std::sin(ang)*len*u);sr+=q.red;sg+=q.green;sb+=q.blue;sa+=q.alpha;}P mb=original;mb.red=(decltype(mb.red))(sr/samples);mb.green=(decltype(mb.green))(sg/samples);mb.blue=(decltype(mb.blue))(sb/samples);mb.alpha=(decltype(mb.alpha))(sa/samples);result=mixPixel(original,mb,mix);
#elif FX_KIND == 5
            double prog=p[0]/100.0,zoom=1.0+(p[1]/100.0-1.0)*prog,rot=p[2]*prog*3.141592653589793/180.0,dir=p[3]*3.141592653589793/180.0,whip=p[4]*prog;double xx=(x-cx)/zoom,yy=(y-cy)/zoom;result=sampleLinear<P>(src,cx+xx*std::cos(rot)+yy*std::sin(rot)-std::cos(dir)*whip,cy-xx*std::sin(rot)+yy*std::cos(rot)-std::sin(dir)*whip);
#elif FX_KIND == 6
            double amount=p[0]/100.0,ang=p[4]*3.141592653589793/180.0,mix=p[7]/100.0,dx=std::cos(ang),dy=std::sin(ang);P rr=sampleLinear<P>(src,x+dx*p[1]*amount,y+dy*p[1]*amount),gg=sampleLinear<P>(src,x+dx*p[2]*amount,y+dy*p[2]*amount),bb=sampleLinear<P>(src,x+dx*p[3]*amount,y+dy*p[3]*amount);P split=original;split.red=rr.red;split.green=gg.green;split.blue=bb.blue;double dist=std::sqrt((x-cx)*(x-cx)+(y-cy)*(y-cy))/std::max(1.0,std::sqrt(cx*cx+cy*cy)),edge=std::clamp((dist-p[5]/100.0)/(std::max(.01,p[6]/100.0)),0.0,1.0);result=mixPixel(original,split,mix*edge);
#else
            double prog=p[0]/100.0,str=p[1]/100.0,seed=p[7],shake=p[2]*str*prog*.35,zoom=1.0+(p[3]/100.0-1.0)*prog,dx=std::sin((t*11+seed)*6.28318)*shake,dy=std::sin((t*13.7+seed*.37)*6.28318)*shake;P z=sampleLinear<P>(src,cx+(x-cx)/zoom-dx,cy+(y-cy)/zoom-dy);double split=p[4]*str*prog*.25;P rr=sampleLinear<P>(src,x+split,y),bb=sampleLinear<P>(src,x-split,y);z.red=rr.red;z.blue=bb.blue;double glow=p[5]/100.0*str*prog;z.red=(decltype(z.red))std::clamp(z.red*(1+glow),0.0,mx);z.green=(decltype(z.green))std::clamp(z.green*(1+glow),0.0,mx);z.blue=(decltype(z.blue))std::clamp(z.blue*(1+glow),0.0,mx);result=z;
#endif
            dst[x]=result;
        }
    }
    return PF_Err_NONE;
}

static PF_Err Render(PF_InData* in,PF_ParamDef* params[],PF_LayerDef* out){
    return PF_WORLD_IS_DEEP(out)?RenderPixels<PF_Pixel16>(in,params,out):RenderPixels<PF_Pixel8>(in,params,out);
}

extern "C" DllExport PF_Err PluginDataEntryFunction(PF_PluginDataPtr p,PF_PluginDataCB cb,SPBasicSuite*,const char*,const char*){
    PF_Err result=PF_Err_INVALID_CALLBACK;
    PF_REGISTER_EFFECT(p,cb,FX_NAME,FX_MATCH,"FX Pro",AE_RESERVED_INFO);
    return result;
}

PF_Err EffectMain(PF_Cmd cmd,PF_InData* in,PF_OutData* out,PF_ParamDef* params[],PF_LayerDef* output,void*){
    try{
        switch(cmd){case PF_Cmd_ABOUT:return About(out);case PF_Cmd_GLOBAL_SETUP:return GlobalSetup(out);case PF_Cmd_PARAMS_SETUP:return ParamsSetup(in,out);case PF_Cmd_RENDER:return Render(in,params,output);default:return PF_Err_NONE;}
    }catch(...){return PF_Err_INTERNAL_STRUCT_DAMAGED;}
}
