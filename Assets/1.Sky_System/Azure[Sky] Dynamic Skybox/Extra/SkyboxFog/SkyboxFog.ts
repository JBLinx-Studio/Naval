Shader "Azure Sky System/Extra/Skybox Fog"
{
	Properties
	{
        [NoScaleOffset] _FogTex("_FogTex", 2D) = "white" {}
        [NoScaleOffset] _MainTex ("_MainTex", 2D) = "white" {}
	}


	SubShader
	{
        // No culling or depth
        Cull Off ZWrite Off ZTest Always


		Pass
		{
            HLSLPROGRAM
			
            #pragma vertex vertex_program
            #pragma fragment fragment_program
            #pragma target 3.0
            #include "UnityCG.cginc"
            

            // Constants
            #define PI 3.1415926535
            

            // Textures
            uniform sampler2D _MainTex, _FogTex;
            uniform sampler2D_float _CameraDepthTexture;
            uniform float4 _MainTex_TexelSize;
            uniform float4 _FogTex_TexelSize;


            // Directions
            uniform float4x4 _Azure_UpDirectionMatrix;
            uniform float4x4 _Azure_FrustumCornersMatrix;


            // Fog paramters
            uniform float _Azure_GlobalFogDistance;
            uniform float _Azure_GlobalFogSmooth;
            uniform float _Azure_GlobalFogDensity;
            uniform float _Azure_HeightFogDistance;
            uniform float _Azure_HeightFogSmooth;
            uniform float _Azure_HeightFogDensity;
            uniform float _Azure_HeightFogStart;
            uniform float _Azure_HeightFogEnd;


            // Mesh data
            struct Attributes
            {
                float4 vertex   : POSITION;
                float4 texcoord : TEXCOORD0;
            };


            // Vertex to fragment
            struct Varyings
            {
                float4 Position        : SV_POSITION;
                float2 screen_uv 	   : TEXCOORD0;
                float4 interpolatedRay : TEXCOORD1;
                float2 depth_uv        : TEXCOORD2;
            };


            // Vertex shader
            Varyings vertex_program (Attributes v)
            {
                Varyings Output = (Varyings)0;


                v.vertex.z = 0.1;
                Output.Position = UnityObjectToClipPos(v.vertex);
                Output.screen_uv = v.texcoord.xy;
                Output.depth_uv = v.texcoord.xy;
                #if UNITY_UV_STARTS_AT_TOP
                if (_MainTex_TexelSize.y < 0)
                    Output.screen_uv.y = 1 - Output.screen_uv.y;
                #endif


                // Based on Unity5.6 GlobalFog
                int index = v.texcoord.x + (2.0 * Output.screen_uv.y);
                Output.interpolatedRay   = _Azure_FrustumCornersMatrix[index];
                Output.interpolatedRay.xyz = mul((float3x3)_Azure_UpDirectionMatrix, Output.interpolatedRay.xyz);
                Output.interpolatedRay.w = index;


                return Output;
            }


            // Fragment shader
            float4 fragment_program (Varyings Input) : SV_Target
            {
                // Original scene
                float3 screen = tex2D(_MainTex, Input.screen_uv).rgb;


                // Reconstruct world space position and direction towards this screen pixel
                float depth = Linear01Depth(UNITY_SAMPLE_DEPTH(tex2D(_CameraDepthTexture, Input.depth_uv)));
                if(depth == 1.0) return float4(screen, 1.0);


                // Directions
                float3 viewDir = normalize(depth * Input.interpolatedRay.xyz);
                float2 uv = float2(atan2(viewDir.z, -viewDir.x), -acos(viewDir.y)) / float2(2.0 * PI, PI) + float2(0.25, 0.0);


                // Fog data from the texture
                float3 fogData = tex2D(_FogTex, uv).rgb;


                // Calcule fog distance
                float globalFog = smoothstep(-_Azure_GlobalFogSmooth, 1.25, length(depth * Input.interpolatedRay.xyz) / _Azure_GlobalFogDistance) * _Azure_GlobalFogDensity;
                float heightFogDistance = smoothstep(-_Azure_HeightFogSmooth, 1.25, length(depth * Input.interpolatedRay.xyz) / _Azure_HeightFogDistance);


                // Calcule height fog
                float3 worldSpaceDirection = mul((float3x3)_Azure_UpDirectionMatrix, _WorldSpaceCameraPos) + depth * Input.interpolatedRay.xyz;
                float heightFog = saturate((worldSpaceDirection.y - _Azure_HeightFogStart) / (_Azure_HeightFogEnd + _Azure_HeightFogStart));
                heightFog = 1.0 - heightFog;
                heightFog *= heightFog;
                heightFog *= heightFogDistance;
                heightFog *= _Azure_HeightFogDensity;
                float fog = saturate(globalFog + heightFog);


                float3 OutputColor = lerp(screen.rgb, fogData, fog);
                return float4(OutputColor, 1.0);
            }
            
            ENDHLSL
		}
	}
}