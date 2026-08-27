Shader "SyntyStudios/WaterShader"
{
	Properties
	{
		_Opacity("Opacity", Range(0 , 1)) = 1
		_OpacityFalloff("Opacity Falloff", Float) = 1
		_OpacityMin("Opacity Min", Range(0 , 1)) = 0.5
		_Specular("Specular", Range(0 , 1)) = 0.141
		_Smoothness("Smoothness", Float) = 2
		_ReflectionPower("Reflection Power", Range(0 , 1)) = 0.346
		[Header(Colour)]_ShallowColour("Shallow Colour", Color) = (0.9607843,0.7882353,0.5764706,0)
		_DeepColour("Deep Colour", Color) = (0.04705882,0.3098039,0.1960784,0)
		_VeryDeepColour("Very Deep Colour", Color) = (0.05959199,0.08247829,0.191,0)
		_ShallowFalloff("ShallowFalloff", Float) = 0.4
		_OverallFalloff("OverallFalloff", Range(0 , 10)) = 0.76
		_Depth("Depth", Float) = 0.28
		[Header(Caustics)]_CausticColour("Caustic Colour", Color) = (0.496,0.496,0.496,0)
		_CausticScale("Caustic Scale", Float) = 1
		_CausticDepthFade("CausticDepthFade", Float) = 0.05
		_CausticSpeed("Caustic Speed", Float) = 1
		[Header(Refraction)]_DistortionMap("Distortion Map", 2D) = "bump" {}
		_DistortionTiling("Distortion Tiling", Float) = 0.33
		_Distortion("Distortion", Range(0 , 1)) = 0.292
		_DistortionSpeed("Distortion Speed", Range(0 , 1)) = 0.236
		[Header(Foam)]_FoamColor("Foam Color", Color) = (0.5215687,0.8980392,0.8470588,0)
		_FoamSmoothness("Foam Smoothness", Float) = 0
		_FoamShoreline("Foam Shoreline", Range(0 , 1)) = 0
		_FoamSpread("Foam Spread", Float) = 0.019
		_FoamFalloff("Foam Falloff", Float) = -56
		_Foam_Texture("Foam_Texture", 2D) = "white" {}
		[Header(Waves)]_RipplesNormal("Ripples Normal", 2D) = "white" {}
		_NormalTiling("Normal Tiling", Float) = 0.2
		_RipplesNormal2("Ripples Normal 2", 2D) = "bump" {}
		_NormalTiling2("Normal Tiling 2", Float) = 0.2
		_NormalScale("Normal Scale", Range(0 , 1)) = 0.669
		_RippleSpeed("Ripple Speed", Range(0 , 1)) = 0.092
		_WaveDirection("Wave Direction", Range(0 , 6.25)) = 0
		_WaveWavelength("Wave Wavelength", Float) = -0.18
		_WaveAmplitude("Wave Amplitude", Range(0 , 1)) = 0.958
		_WaveSpeed("Wave Speed", Range(0 , 1)) = 0.303
		_WaveFoamOpacity("Wave Foam Opacity", Range(0 , 1)) = 0.5
		_WaveMask("Wave Mask", 2D) = "white" {}
		_FoamMask("Foam Mask", 2D) = "white" {}
		_WaveNoiseAmount("Wave Noise Amount", Float) = 0.1
		_WaveNoiseScale("Wave Noise Scale", Float) = 1
		[Header(Glow)]_DepthGlowColour("Depth Glow Colour", Color) = (0,0,0,0)
		_GlowDepth("Glow Depth", Float) = 0.1
		_GlowFalloff("Glow Falloff", Range(0 , 1)) = 0.1
		_FoamEmitColour("Foam Emit Colour", Color) = (0,0,0,0)
		_FoamGlowMultiplier("Foam Glow Multiplier", Float) = 1
		[HideInInspector] _texcoord("", 2D) = "white" {}
		[HideInInspector] __dirty("", Int) = 1
	}

		SubShader
		{
			Tags{ "RenderType" = "Transparent"  "Queue" = "Transparent+0" "IgnoreProjector" = "True" "IsEmissive" = "true"  }
			Cull Back
			GrabPass{ }
			CGINCLUDE
			#include "UnityShaderVariables.cginc"
			#include "UnityStandardUtils.cginc"
			#include "UnityCG.cginc"
			#include "UnityPBSLighting.cginc"
			#include "Lighting.cginc"

			// Azure[Sky] Start
			#include "Assets/ASSETS/-Templets/Azure[Sky] Dynamic Skybox/Shaders/Transparent/AzureFogCore.cginc"
			// Azure[Sky] End

			#pragma target 3.0
			#if defined(UNITY_STEREO_INSTANCING_ENABLED) || defined(UNITY_STEREO_MULTIVIEW_ENABLED)
			#define ASE_DECLARE_SCREENSPACE_TEXTURE(tex) UNITY_DECLARE_SCREENSPACE_TEXTURE(tex);
			#else
			#define ASE_DECLARE_SCREENSPACE_TEXTURE(tex) UNITY_DECLARE_SCREENSPACE_TEXTURE(tex)
			#endif
			struct Input
			{
				float3 worldPos;
				float4 screenPos;
				float2 uv_texcoord;
			};

			uniform sampler2D _WaveMask;
			uniform float _WaveSpeed;
			uniform half _WaveNoiseScale;
			uniform half _WaveNoiseAmount;
			uniform half _WaveDirection;
			uniform half _WaveWavelength;
			uniform float _WaveAmplitude;
			uniform sampler2D _RipplesNormal;
			uniform float _RippleSpeed;
			uniform half _NormalTiling;
			uniform sampler2D _RipplesNormal2;
			uniform half _NormalTiling2;
			uniform float _NormalScale;
			UNITY_DECLARE_DEPTH_TEXTURE(_CameraDepthTexture);
			uniform float4 _CameraDepthTexture_TexelSize;
			uniform float _Depth;
			uniform float _OverallFalloff;
			uniform half _ShallowFalloff;
			uniform float4 _ShallowColour;
			uniform float4 _DeepColour;
			uniform float4 _VeryDeepColour;
			ASE_DECLARE_SCREENSPACE_TEXTURE(_GrabTexture)
			uniform sampler2D _DistortionMap;
			uniform float _DistortionSpeed;
			uniform half _DistortionTiling;
			uniform float _Distortion;
			uniform float4 _FoamColor;
			uniform half _FoamSpread;
			uniform float _FoamShoreline;
			uniform float _FoamFalloff;
			uniform sampler2D _Foam_Texture;
			uniform sampler2D _FoamMask;
			uniform half _WaveFoamOpacity;
			uniform half4 _DepthGlowColour;
			uniform half _GlowDepth;
			uniform half _GlowFalloff;
			uniform half _FoamGlowMultiplier;
			uniform half4 _FoamEmitColour;
			uniform half _CausticScale;
			uniform half _CausticSpeed;
			uniform half4 _CausticColour;
			uniform half _CausticDepthFade;
			uniform float _Specular;
			uniform float _Smoothness;
			uniform float _FoamSmoothness;
			uniform float _ReflectionPower;
			uniform half _OpacityFalloff;
			uniform half _OpacityMin;
			uniform float _Opacity;


			float3 mod2D289(float3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }

			float2 mod2D289(float2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }

			float3 permute(float3 x) { return mod2D289(((x * 34.0) + 1.0) * x); }

			float snoise(float2 v)
			{
				const float4 C = float4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
				float2 i = floor(v + dot(v, C.yy));
				float2 x0 = v - i + dot(i, C.xx);
				float2 i1;
				i1 = (x0.x > x0.y) ? float2(1.0, 0.0) : float2(0.0, 1.0);
				float4 x12 = x0.xyxy + C.xxzz;
				x12.xy -= i1;
				i = mod2D289(i);
				float3 p = permute(permute(i.y + float3(0.0, i1.y, 1.0)) + i.x + float3(0.0, i1.x, 1.0));
				float3 m = max(0.5 - float3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
				m = m * m;
				m = m * m;
				float3 x = 2.0 * frac(p * C.www) - 1.0;
				float3 h = abs(x) - 0.5;
				float3 ox = floor(x + 0.5);
				float3 a0 = x - ox;
				m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
				float3 g;
				g.x = a0.x * x0.x + h.x * x0.y;
				g.yz = a0.yz * x12.xz + h.yz * x12.yw;
				return 130.0 * dot(m, g);
			}


			inline float4 ASE_ComputeGrabScreenPos(float4 pos)
			{
				#if UNITY_UV_STARTS_AT_TOP
				float scale = -1.0;
				#else
				float scale = 1.0;
				#endif
				float4 o = pos;
				o.y = pos.w * 0.5f;
				o.y = (pos.y - o.y) * _ProjectionParams.x * scale + o.y;
				return o;
			}


			float3 mod3D289(float3 x) { return x - floor(x / 289.0) * 289.0; }

			float4 mod3D289(float4 x) { return x - floor(x / 289.0) * 289.0; }

			float4 permute(float4 x) { return mod3D289((x * 34.0 + 1.0) * x); }

			float4 taylorInvSqrt(float4 r) { return 1.79284291400159 - r * 0.85373472095314; }

			float snoise(float3 v)
			{
				const float2 C = float2(1.0 / 6.0, 1.0 / 3.0);
				float3 i = floor(v + dot(v, C.yyy));
				float3 x0 = v - i + dot(i, C.xxx);
				float3 g = step(x0.yzx, x0.xyz);
				float3 l = 1.0 - g;
				float3 i1 = min(g.xyz, l.zxy);
				float3 i2 = max(g.xyz, l.zxy);
				float3 x1 = x0 - i1 + C.xxx;
				float3 x2 = x0 - i2 + C.yyy;
				float3 x3 = x0 - 0.5;
				i = mod3D289(i);
				float4 p = permute(permute(permute(i.z + float4(0.0, i1.z, i2.z, 1.0)) + i.y + float4(0.0, i1.y, i2.y, 1.0)) + i.x + float4(0.0, i1.x, i2.x, 1.0));
				float4 j = p - 49.0 * floor(p / 49.0);  // mod(p,7*7)
				float4 x_ = floor(j / 7.0);
				float4 y_ = floor(j - 7.0 * x_);  // mod(j,N)
				float4 x = (x_ * 2.0 + 0.5) / 7.0 - 1.0;
				float4 y = (y_ * 2.0 + 0.5) / 7.0 - 1.0;
				float4 h = 1.0 - abs(x) - abs(y);
				float4 b0 = float4(x.xy, y.xy);
				float4 b1 = float4(x.zw, y.zw);
				float4 s0 = floor(b0) * 2.0 + 1.0;
				float4 s1 = floor(b1) * 2.0 + 1.0;
				float4 sh = -step(h, 0.0);
				float4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
				float4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
				float3 g0 = float3(a0.xy, h.x);
				float3 g1 = float3(a0.zw, h.y);
				float3 g2 = float3(a1.xy, h.z);
				float3 g3 = float3(a1.zw, h.w);
				float4 norm = taylorInvSqrt(float4(dot(g0, g0), dot(g1, g1), dot(g2, g2), dot(g3, g3)));
				g0 *= norm.x;
				g1 *= norm.y;
				g2 *= norm.z;
				g3 *= norm.w;
				float4 m = max(0.6 - float4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
				m = m * m;
				m = m * m;
				float4 px = float4(dot(x0, g0), dot(x1, g1), dot(x2, g2), dot(x3, g3));
				return 42.0 * dot(m, px);
			}


			float2 voronoihash110(float2 p)
			{

				p = float2(dot(p, float2(127.1, 311.7)), dot(p, float2(269.5, 183.3)));
				return frac(sin(p) * 43758.5453);
			}


			float voronoi110(float2 v, float time, inout float2 id, inout float2 mr, float smoothness, inout float2 smoothId)
			{
				float2 n = floor(v);
				float2 f = frac(v);
				float F1 = 8.0;
				float F2 = 8.0; float2 mg = 0;
				for (int j = -2; j <= 2; j++)
				{
					for (int i = -2; i <= 2; i++)
					{
						float2 g = float2(i, j);
						float2 o = voronoihash110(n + g);
						o = (sin(time + o * 6.2831) * 0.5 + 0.5); float2 r = f - g - o;
						float d = 0.5 * dot(r, r);
						if (d < F1) {
							F2 = F1;
							F1 = d; mg = g; mr = r; id = o;
						}
	 else if (d < F2) {
	  F2 = d;

  }
}
}
return (F2 + F1) * 0.5;
}


half2 UnStereo(float2 UV)
{
	#if UNITY_SINGLE_PASS_STEREO
	float4 scaleOffset = unity_StereoScaleOffset[unity_StereoEyeIndex];
	UV.xy = (UV.xy - scaleOffset.zw) / scaleOffset.xy;
	#endif
	return UV;
}


half3 InvertDepthDir72_g4(half3 In)
{
	float3 result = In;
	#if !defined(ASE_SRP_VERSION) || ASE_SRP_VERSION <= 70301
	result *= float3(1,1,-1);
	#endif
	return result;
}


void vertexDataFunc(inout appdata_full v, out Input o)
{
	UNITY_INITIALIZE_OUTPUT(Input, o);
	half2 temp_cast_0 = (_WaveSpeed).xx;
	half mulTime307 = _Time.y * 0.001;
	half2 temp_cast_1 = (mulTime307).xx;
	float2 uv_TexCoord312 = v.texcoord.xy + temp_cast_1;
	half simplePerlin2D320 = snoise(uv_TexCoord312 * _WaveNoiseScale);
	float3 ase_worldPos = mul(unity_ObjectToWorld, v.vertex);
	half2 appendResult59 = (half2(ase_worldPos.x , ase_worldPos.z));
	float cos302 = cos(_WaveDirection);
	float sin302 = sin(_WaveDirection);
	half2 rotator302 = mul(((simplePerlin2D320 * _WaveNoiseAmount) + appendResult59) - float2(0,0) , float2x2(cos302 , -sin302 , sin302 , cos302)) + float2(0,0);
	half2 temp_output_60_0 = (rotator302 * _WaveWavelength);
	half2 panner127 = (1.0 * _Time.y * temp_cast_0 + temp_output_60_0);
	half4 temp_cast_2 = 0;
	half4 lerpResult149 = lerp(tex2Dlod(_WaveMask, float4(panner127, 0, 1.0)) , temp_cast_2 , (1.0 - _WaveAmplitude));
	half4 waveCrestVertoffset153 = lerpResult149;
	half grayscale298 = Luminance(waveCrestVertoffset153.rgb);
	half4 appendResult301 = (half4(0.0 , grayscale298 , 0.0 , 0.0));
	v.vertex.xyz += appendResult301.xyz;
	v.vertex.w = 1;
}

void surf(Input i , inout SurfaceOutputStandardSpecular o)
{
	half2 temp_cast_0 = (_RippleSpeed).xx;
	float3 ase_worldPos = i.worldPos;
	half2 appendResult93 = (half2(ase_worldPos.x , ase_worldPos.z));
	half2 panner119 = (1.0 * _Time.y * temp_cast_0 + (appendResult93 * _NormalTiling));
	half2 temp_cast_2 = (-_RippleSpeed).xx;
	half2 panner118 = (1.0 * _Time.y * temp_cast_2 + (appendResult93 * _NormalTiling2));
	half3 waveNormalMaps157 = UnpackScaleNormal(half4(BlendNormals(tex2D(_RipplesNormal, panner119).rgb , UnpackNormal(tex2D(_RipplesNormal2, panner118))) , 0.0), _NormalScale);
	o.Normal = waveNormalMaps157;
	float4 ase_screenPos = float4(i.screenPos.xyz , i.screenPos.w + 0.00000000001);
	half4 ase_screenPosNorm = ase_screenPos / ase_screenPos.w;
	ase_screenPosNorm.z = (UNITY_NEAR_CLIP_VALUE >= 0) ? ase_screenPosNorm.z : ase_screenPosNorm.z * 0.5 + 0.5;
	float screenDepth170 = LinearEyeDepth(SAMPLE_DEPTH_TEXTURE(_CameraDepthTexture, ase_screenPosNorm.xy));
	half distanceDepth170 = abs((screenDepth170 - LinearEyeDepth(ase_screenPosNorm.z)) / (_Depth));
	half temp_output_99_0 = pow(distanceDepth170 , _OverallFalloff);
	half temp_output_235_0 = (temp_output_99_0 + _ShallowFalloff);
	half4 lerpResult115 = lerp(_ShallowColour , _DeepColour , temp_output_235_0);
	half4 lerpResult177 = lerp(_DeepColour , _VeryDeepColour , saturate((temp_output_99_0 - 1.0)));
	half4 temp_output_175_0 = (temp_output_235_0 < 1.0 ? lerpResult115 : lerpResult177);
	float4 ase_grabScreenPos = ASE_ComputeGrabScreenPos(ase_screenPos);
	half4 ase_grabScreenPosNorm = ase_grabScreenPos / ase_grabScreenPos.w;
	half2 temp_cast_4 = (_DistortionSpeed).xx;
	half2 appendResult19 = (half2(ase_worldPos.x , ase_worldPos.z));
	half2 panner45 = (1.0 * _Time.y * temp_cast_4 + (appendResult19 * _DistortionTiling));
	float4 screenColor100 = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_GrabTexture,((ase_grabScreenPosNorm).xy + ((UnpackNormal(tex2D(_DistortionMap, panner45)) * _Distortion)).xy));
	half4 Refraction107 = screenColor100;
	half4 lerpResult121 = lerp(temp_output_175_0 , Refraction107 , temp_output_175_0);
	half2 temp_output_14_0 = (ase_worldPos).xz;
	half2 panner166 = (0.1 * _Time.y * float2(1,0) + temp_output_14_0);
	half simplePerlin3D44 = snoise(half3((panner166 * 1.5) ,  0.0));
	half2 panner22 = (0.1 * _Time.y * float2(-1,0) + temp_output_14_0);
	half simplePerlin3D43 = snoise(half3((panner22 * 3) ,  0.0));
	half2 panner37 = (1.0 * _Time.y * float2(-0.01,0.01) + i.uv_texcoord);
	half foam62 = (saturate(pow((distanceDepth170 + _FoamShoreline) , _FoamFalloff)) * tex2D(_Foam_Texture, panner37).r);
	half4 foamNoise114 = saturate(((_FoamColor * (1.0 - step((simplePerlin3D44 + simplePerlin3D43) , (distanceDepth170 * _FoamSpread)))) + (_FoamColor * foam62)));
	half4 lerpResult141 = lerp(lerpResult121 , float4(1,1,1,0) , foamNoise114);
	half4 temp_cast_7 = 0;
	half4 temp_cast_8 = 0;
	half2 temp_cast_9 = (_WaveSpeed).xx;
	half mulTime307 = _Time.y * 0.001;
	half2 temp_cast_10 = (mulTime307).xx;
	float2 uv_TexCoord312 = i.uv_texcoord + temp_cast_10;
	half simplePerlin2D320 = snoise(uv_TexCoord312 * _WaveNoiseScale);
	half2 appendResult59 = (half2(ase_worldPos.x , ase_worldPos.z));
	float cos302 = cos(_WaveDirection);
	float sin302 = sin(_WaveDirection);
	half2 rotator302 = mul(((simplePerlin2D320 * _WaveNoiseAmount) + appendResult59) - float2(0,0) , float2x2(cos302 , -sin302 , sin302 , cos302)) + float2(0,0);
	half2 temp_output_60_0 = (rotator302 * _WaveWavelength);
	half2 panner70 = (1.0 * _Time.y * temp_cast_9 + temp_output_60_0);
	half2 temp_output_13_0 = (ase_worldPos).xz;
	half2 panner20 = (0.1 * _Time.y * float2(1,0) + temp_output_13_0);
	half simplePerlin3D46 = snoise(half3((panner20 * 2) ,  0.0));
	half2 panner27 = (0.1 * _Time.y * float2(-1,0) + temp_output_13_0);
	half simplePerlin3D41 = snoise(half3((panner27 * 0.8) ,  0.0));
	half waveCrestNoise0277 = step((simplePerlin3D46 + simplePerlin3D41) , 0.0);
	half4 lerpResult97 = lerp(temp_cast_8 , tex2D(_FoamMask, panner70) , waveCrestNoise0277);
	half2 temp_output_25_0 = (ase_worldPos).xz;
	half2 panner34 = (0.1 * _Time.y * float2(1,0) + temp_output_25_0);
	half simplePerlin3D58 = snoise(half3((panner34 * 0.05) ,  0.0));
	half2 panner28 = (0.1 * _Time.y * float2(-1,0) + temp_output_25_0);
	half simplePerlin3D56 = snoise(half3((panner28 * 0.08) ,  0.0));
	half waveCrestNoise0182 = step((simplePerlin3D58 + simplePerlin3D56) , 0.0);
	half4 lerpResult109 = lerp(temp_cast_7 , lerpResult97 , waveCrestNoise0182);
	half4 lerpResult116 = lerp(float4(0,0,0,0) , lerpResult109 , _WaveFoamOpacity);
	half4 waveCrestColour131 = lerpResult116;
	half4 waterAlbedo155 = (lerpResult141 + waveCrestColour131);
	o.Albedo = waterAlbedo155.rgb;
	float screenDepth333 = LinearEyeDepth(SAMPLE_DEPTH_TEXTURE(_CameraDepthTexture, ase_screenPosNorm.xy));
	half distanceDepth333 = abs((screenDepth333 - LinearEyeDepth(ase_screenPosNorm.z)) / (_GlowDepth));
	half4 lerpResult337 = lerp(_DepthGlowColour , float4(0,0,0,0) , (1.0 - pow(distanceDepth333 , _GlowFalloff)));
	half4 lerpResult329 = lerp(_FoamEmitColour , float4(0,0,0,0) , (1.0 - foamNoise114));
	half mulTime90 = _Time.y * _CausticSpeed;
	half time110 = mulTime90;
	half2 voronoiSmoothId0 = 0;
	half2 temp_output_73_0_g4 = ase_screenPosNorm.xy;
	half2 UV22_g5 = half4(temp_output_73_0_g4, 0.0 , 0.0).xy;
	half2 localUnStereo22_g5 = UnStereo(UV22_g5);
	half2 break64_g4 = localUnStereo22_g5;
	half clampDepth69_g4 = SAMPLE_DEPTH_TEXTURE(_CameraDepthTexture, half4(temp_output_73_0_g4, 0.0 , 0.0).xy);
	#ifdef UNITY_REVERSED_Z
		float staticSwitch38_g4 = (1.0 - clampDepth69_g4);
	#else
		float staticSwitch38_g4 = clampDepth69_g4;
	#endif
	half3 appendResult39_g4 = (half3(break64_g4.x , break64_g4.y , staticSwitch38_g4));
	half4 appendResult42_g4 = (half4((appendResult39_g4 * 2.0 + -1.0) , 1.0));
	half4 temp_output_43_0_g4 = mul(unity_CameraInvProjection, appendResult42_g4);
	half3 In72_g4 = ((temp_output_43_0_g4).xyz / (temp_output_43_0_g4).w);
	half3 localInvertDepthDir72_g4 = InvertDepthDir72_g4(In72_g4);
	half4 appendResult49_g4 = (half4(localInvertDepthDir72_g4 , 1.0));
	float2 coords110 = (mul(unity_CameraToWorld, appendResult49_g4)).xz * _CausticScale;
	float2 id110 = 0;
	float2 uv110 = 0;
	float voroi110 = voronoi110(coords110, time110, id110, uv110, 0, voronoiSmoothId0);
	half smoothstepResult122 = smoothstep(0.0 , 1.0 , voroi110);
	float screenDepth237 = LinearEyeDepth(SAMPLE_DEPTH_TEXTURE(_CameraDepthTexture, ase_screenPosNorm.xy));
	half distanceDepth237 = abs((screenDepth237 - LinearEyeDepth(ase_screenPosNorm.z)) / (_CausticDepthFade));
	half4 Caustics152 = (saturate(smoothstepResult122) * _CausticColour * (1.0 - saturate(distanceDepth237)));
	o.Emission = (lerpResult337 + (_FoamGlowMultiplier * lerpResult329) + Caustics152).rgb;
	half lerpResult147 = lerp(_Specular , 0.0 , foam62);
	half specular154 = lerpResult147;
	half3 temp_cast_21 = (specular154).xxx;
	o.Specular = temp_cast_21;
	half lerpResult132 = lerp(_Smoothness , _FoamSmoothness , foam62);
	half smoothness156 = (lerpResult132 * _ReflectionPower);
	o.Smoothness = smoothness156;
	float screenDepth234 = LinearEyeDepth(SAMPLE_DEPTH_TEXTURE(_CameraDepthTexture, ase_screenPosNorm.xy));
	half distanceDepth234 = abs((screenDepth234 - LinearEyeDepth(ase_screenPosNorm.z)) / (1.0));
	half waterOpacity218 = ((_OpacityMin + (saturate((distanceDepth234 / _OpacityFalloff)) - 0.0) * (1.0 - _OpacityMin) / (1.0 - 0.0)) * _Opacity);
	o.Alpha = waterOpacity218;
}

ENDCG
CGPROGRAM
#pragma surface surf StandardSpecular alpha:fade keepalpha fullforwardshadows vertex:vertexDataFunc 

ENDCG
Pass
{
	Name "ShadowCaster"
	Tags{ "LightMode" = "ShadowCaster" }
	ZWrite On
	CGPROGRAM
	#pragma vertex vert
	#pragma fragment frag
	#pragma target 3.0
	#pragma multi_compile_shadowcaster
	#pragma multi_compile UNITY_PASS_SHADOWCASTER
	#pragma skip_variants FOG_LINEAR FOG_EXP FOG_EXP2
	#include "HLSLSupport.cginc"
	#if ( SHADER_API_D3D11 || SHADER_API_GLCORE || SHADER_API_GLES || SHADER_API_GLES3 || SHADER_API_METAL || SHADER_API_VULKAN )
		#define CAN_SKIP_VPOS
	#endif
	#include "UnityCG.cginc"
	#include "Lighting.cginc"
	#include "UnityPBSLighting.cginc"
	sampler3D _DitherMaskLOD;
	struct v2f
	{
		V2F_SHADOW_CASTER;
		float2 customPack1 : TEXCOORD1;
		float3 worldPos : TEXCOORD2;
		float4 screenPos : TEXCOORD3;
		float4 tSpace0 : TEXCOORD4;
		float4 tSpace1 : TEXCOORD5;
		float4 tSpace2 : TEXCOORD6;
		UNITY_VERTEX_INPUT_INSTANCE_ID
		UNITY_VERTEX_OUTPUT_STEREO

		// Azure[Sky] Start
		float3 worldPos : TEXCOORD3;
		// Azure[Sky] End
	};
	v2f vert(appdata_full v)
	{
		v2f o;
		UNITY_SETUP_INSTANCE_ID(v);
		UNITY_INITIALIZE_OUTPUT(v2f, o);
		UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);
		UNITY_TRANSFER_INSTANCE_ID(v, o);
		Input customInputData;
		vertexDataFunc(v, customInputData);
		float3 worldPos = mul(unity_ObjectToWorld, v.vertex).xyz;
		half3 worldNormal = UnityObjectToWorldNormal(v.normal);
		half3 worldTangent = UnityObjectToWorldDir(v.tangent.xyz);
		half tangentSign = v.tangent.w * unity_WorldTransformParams.w;
		half3 worldBinormal = cross(worldNormal, worldTangent) * tangentSign;
		o.tSpace0 = float4(worldTangent.x, worldBinormal.x, worldNormal.x, worldPos.x);
		o.tSpace1 = float4(worldTangent.y, worldBinormal.y, worldNormal.y, worldPos.y);
		o.tSpace2 = float4(worldTangent.z, worldBinormal.z, worldNormal.z, worldPos.z);
		o.customPack1.xy = customInputData.uv_texcoord;
		o.customPack1.xy = v.texcoord;
		o.worldPos = worldPos;
		TRANSFER_SHADOW_CASTER_NORMALOFFSET(o)
		o.screenPos = ComputeScreenPos(o.pos);

		// Azure[Sky] Start
		o.worldPos = mul(unity_ObjectToWorld, v.vertex);
		// Azure[Sky] End

		return o;
	}
	half4 frag(v2f IN
	#if !defined( CAN_SKIP_VPOS )
	, UNITY_VPOS_TYPE vpos : VPOS
	#endif
	) : SV_Target
	{
		UNITY_SETUP_INSTANCE_ID(IN);
		Input surfIN;
		UNITY_INITIALIZE_OUTPUT(Input, surfIN);
		surfIN.uv_texcoord = IN.customPack1.xy;
		float3 worldPos = IN.worldPos;
		half3 worldViewDir = normalize(UnityWorldSpaceViewDir(worldPos));
		surfIN.worldPos = worldPos;
		surfIN.screenPos = IN.screenPos;
		SurfaceOutputStandardSpecular o;
		UNITY_INITIALIZE_OUTPUT(SurfaceOutputStandardSpecular, o)
		surf(surfIN, o);
		#if defined( CAN_SKIP_VPOS )
		float2 vpos = IN.pos;
		#endif
		half alphaRef = tex3D(_DitherMaskLOD, float3(vpos.xy * 0.25, o.Alpha * 0.9375)).a;
		clip(alphaRef - 0.01);
		SHADOW_CASTER_FRAGMENT(IN)
	}
	ENDCG
}
		}
			Fallback "Diffuse"
			CustomEditor "ASEMaterialInspector"
}