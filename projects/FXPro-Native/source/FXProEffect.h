#pragma once

typedef unsigned char u_char;
typedef unsigned short u_short;
typedef unsigned short u_int16;
typedef unsigned long u_long;
typedef short int int16;

#define PF_DEEP_COLOR_AWARE 1
#include "AEConfig.h"
#ifdef AE_OS_WIN
#include <Windows.h>
#endif
#include "entry.h"
#include "AE_Effect.h"
#include "AE_EffectCB.h"
#include "AE_Macros.h"
#include "Param_Utils.h"

#define FXPRO_MAJOR 1
#define FXPRO_MINOR 0
#define FXPRO_BUG 0
#define FXPRO_BUILD 1
#define FXPRO_VERSION_VALUE 524289

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

enum {
    FX_INPUT = 0,
    FX_P1,
    FX_P2,
    FX_P3,
    FX_P4,
    FX_P5,
    FX_P6,
    FX_P7,
    FX_P8,
    FX_NUM_PARAMS
};

enum {
    FX_P1_ID = 1,
    FX_P2_ID,
    FX_P3_ID,
    FX_P4_ID,
    FX_P5_ID,
    FX_P6_ID,
    FX_P7_ID,
    FX_P8_ID
};

extern "C" {
DllExport PF_Err EffectMain(PF_Cmd, PF_InData*, PF_OutData*, PF_ParamDef*[], PF_LayerDef*, void*);
}
