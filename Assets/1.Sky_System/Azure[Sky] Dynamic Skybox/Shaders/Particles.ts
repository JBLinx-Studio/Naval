// Unity built-in shader source. Copyright (c) 2016 Unity Technologies. MIT license (see license.txt)

Shader "Azure Sky System/Particles Additive"
{
    Properties
    {
        _TintColor ("Tint Color", Color) = (0.5,0.5,0.5,0.5)
        _MainTex ("Particle Texture", 2D) = "white" {}
        _InvFade ("Soft Particles Factor", Range(0.01,3.0)) = 1.0
    }


    Category
    {
        Tags { "Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent" "PreviewType"="Plane" }
        Blend SrcAlpha One
        ColorMask RGB
        Cull Back Lighting Off ZWrite Off
        

        SubShader
        {
            Pass
            {
                HLSLPROGRAM
                
                #pragma vertex vertex_program
                #pragma fragment fragment_program
                #pragma target 2.0
                #pragma multi_compile_particles
                #include "UnityCG.cginc"
                    

                sampler2D _MainTex;
                fixed4 _TintColor;
                    

                // Mesh data
                struct Attributes
                {
                    float4 vertex : POSITION;
                    fixed4 color : COLOR;
                    float2 texcoord : TEXCOORD0;
                    UNITY_VERTEX_INPUT_INSTANCE_ID // Stereo Instancing
                };
                    

                // Vertex to fragment
                struct Varyings
                {
                    float4 vertex : SV_POSITION;
                    fixed4 color : COLOR;
                    float2 texcoord : TEXCOORD0;


                    #ifdef SOFTPARTICLES_ON
                    float4 projPos : TEXCOORD1;
                    #endif


                    UNITY_VERTEX_OUTPUT_STEREO // Stereo Instancing
                };
                    

                float4 _MainTex_ST;
                    

                // Vertex shader
                Varyings vertex_program(Attributes v)
                {
                    Varyings Output = (Varyings)0;


                    UNITY_SETUP_INSTANCE_ID(v); // Stereo Instancing
                    UNITY_INITIALIZE_OUTPUT(Varyings, Output); // Stereo Instancing
                    UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(Output); // Stereo Instancing


                    Output.vertex = UnityObjectToClipPos(v.vertex);


                    #ifdef SOFTPARTICLES_ON
                    Output.projPos = ComputeScreenPos (Output.vertex);
                    COMPUTE_EYEDEPTH(Output.projPos.z);
                    #endif


                    Output.color = v.color;
                    Output.texcoord = TRANSFORM_TEX(v.texcoord,_MainTex);
                    return Output;
                }
                    

                UNITY_DECLARE_DEPTH_TEXTURE(_CameraDepthTexture);
                float _InvFade;
                    

                // Fragment shader
                float4 fragment_program(Varyings i) : SV_Target
                {
                    #ifdef SOFTPARTICLES_ON
                    float sceneZ = LinearEyeDepth (SAMPLE_DEPTH_TEXTURE_PROJ(_CameraDepthTexture, UNITY_PROJ_COORD(i.projPos)));
                    float partZ = i.projPos.z;
                    float fade = saturate (_InvFade * (sceneZ-partZ));
                    i.color.a *= fade;
                    #endif
                        

                    fixed4 col = 2.0f * i.color * _TintColor * tex2D(_MainTex, i.texcoord);
                    col.a = saturate(col.a); // alpha should not have double-brightness applied to it, but we can't fix that legacy behaior without breaking everyone's effects, so instead clamp the output to get sensible HDR behavior (case 967476)
                        
                        
                    // Color correction
                    #ifdef UNITY_COLORSPACE_GAMMA
                    col = pow(col, 2.0);
                    #endif
                        

                    return col;
                }
                
                ENDHLSL
            }
        }
    }
}