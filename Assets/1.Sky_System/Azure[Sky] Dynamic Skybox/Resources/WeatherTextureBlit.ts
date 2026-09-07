Shader "Azure Sky System/Weather Texture Blit"
{
    Properties
    {
        _FromTex("From", 2D) = "white" {}
        _ToTex("To", 2D) = "white" {}
        _Interpolator("Interpolator", Range(0.0, 1.0)) = 0.0
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
            #include "UnityCG.cginc"


            // Mesh data
            struct Attributes
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };
            
            
            // Vertex to fragment
            struct Varyings
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
            };


            // Vertex shader
            Varyings vertex_program(Attributes v)
            {
                Varyings Output = (Varyings)0;


                Output.vertex = UnityObjectToClipPos(v.vertex);
                Output.uv = v.uv;


                return Output;
            }


            uniform sampler2D _FromTex, _ToTex;
            uniform float _Interpolator;


            // Fragment shader
            float4 fragment_program(Varyings i) : SV_Target
            {
                float4 from = tex2D(_FromTex, i.uv);
                float4 to = tex2D(_ToTex, i.uv);
                

                return lerp(from, to, _Interpolator);
            }

            ENDHLSL
        }
    }
}