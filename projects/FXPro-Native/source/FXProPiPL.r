#include "AEConfig.h"
#include "AE_EffectVers.h"

#ifndef FX_KIND
#define FX_KIND 1
#endif
#if FX_KIND == 1
#define FX_NAME "FX Pro Shake"
#define FX_MATCH "FXPRO Shake"
#elif FX_KIND == 2
#define FX_NAME "FX Pro Aura Glow"
#define FX_MATCH "FXPRO Aura Glow"
#elif FX_KIND == 3
#define FX_NAME "FX Pro Smooth Time"
#define FX_MATCH "FXPRO Smooth Time"
#elif FX_KIND == 4
#define FX_NAME "FX Pro Motion Blur"
#define FX_MATCH "FXPRO Motion Blur"
#elif FX_KIND == 5
#define FX_NAME "FX Pro Zoom Whip"
#define FX_MATCH "FXPRO Zoom Whip"
#elif FX_KIND == 6
#define FX_NAME "FX Pro RGB Split"
#define FX_MATCH "FXPRO RGB Split"
#else
#define FX_NAME "FX Pro Impact"
#define FX_MATCH "FXPRO Impact"
#endif

resource 'PiPL' (16000) {
  {
    Kind { AEEffect },
    Name { FX_NAME },
    Category { "FX Pro" },
    CodeWin64X86 { "EffectMain" },
    AE_PiPL_Version { 2, 0 },
    AE_Effect_Spec_Version { PF_PLUG_IN_VERSION, PF_PLUG_IN_SUBVERS },
    AE_Effect_Version { 524289 },
    AE_Effect_Info_Flags { 0 },
    AE_Effect_Global_OutFlags { 0x02000000 },
    AE_Effect_Global_OutFlags_2 { 0x00000000 },
    AE_Effect_Match_Name { FX_MATCH },
    AE_Reserved_Info { 0 }
  }
};
