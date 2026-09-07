Shader "Azure Sky System/Extra/Panoramic Skybox"
{
	Properties
	{
		[NoScaleOffset] _MainTex ("MainTex", 2D) = "white" {}
	}
    

	SubShader
	{
		Tags { "Queue" = "Background" "RenderType" = "Background" "PreviewType" = "Skybox" "IgnoreProjector" = "True" }
		Cull Back     // Render side
		Fog{Mode Off} // Don't use fog
		ZWrite Off    // Don't draw to depth buffer


		Pass
		{
			HLSLPROGRAM

			#pragma vertex vertex_program
			#pragma fragment fragment_program
			#include "UnityCG.cginc"
			#define pi 3.141592653589


			// Mesh data
			struct Attributes
			{
				float4 vertex : POSITION;
			};


			// Vertex to fragment
			struct Varyings
			{
				float4 Position     : SV_POSITION;
    			float3 WorldPos     : TEXCOORD0;
			};


			sampler2D _MainTex;
			float4 _MainTex_TexelSize;
			

			// Vertex shader
			Varyings vertex_program(Attributes v)
			{
				Varyings Output = (Varyings)0;


				Output.Position = UnityObjectToClipPos(v.vertex);
    			Output.WorldPos = normalize(mul((float3x3)unity_ObjectToWorld, v.vertex.xyz));


				return Output;
			}
			

			// Fragment shader
			fixed4 fragment_program(Varyings IN) : SV_Target
			{
			    float3 viewDir    = normalize(IN.WorldPos);
				float2 uv = float2(-atan2(viewDir.z, -viewDir.x), -acos(viewDir.y)) / float2(2.0 * pi, pi) - float2(0.25, 0.0);
				return tex2D(_MainTex, uv);
			}

			ENDHLSL
		}
	}
}