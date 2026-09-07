using System;

namespace UnityEngine.AzureSky
{
    [ExecuteInEditMode]
    [AddComponentMenu("Azure[Sky] Dynamic Skybox/Azure Render Controller")]
    public sealed class AzureRenderController : MonoBehaviour
    {
        #if UNITY_EDITOR
        [SerializeField] private bool m_showAssetDependenciesTab;
        [SerializeField] private bool m_showTransformReferencesTab;
        [SerializeField] private bool m_showScatteringTab;
        [SerializeField] private bool m_showOutterSpaceTab;
        [SerializeField] private bool m_showFogScatteringTab;
        [SerializeField] private bool m_showDynamicCloudTab;
        [SerializeField] private bool m_showStaticCloudTab;
        [SerializeField] private bool m_showOptionsTab;
        #endif


        /// <summary>
        /// Field: The material that renders the skybox.
        /// </summary>
        [SerializeField] private Material m_skyMaterial = null;
        
        /// <summary>
        /// Property: The material that renders the skybox.
        /// </summary>
        public Material SkyMaterial { get => m_skyMaterial; set => m_skyMaterial = value; }
        
        
        /// <summary>
        /// Field: The material that renders the fog scattering effect.
        /// </summary>
        [SerializeField] private Material m_fogMaterial = null;
        
        /// <summary>
        /// Property: The material that renders the fog scattering effect.
        /// </summary>
        public Material FogMaterial { get => m_fogMaterial; set => m_fogMaterial = value; }


        /// <summary>
        /// Field: The texture used to render the sun.
        /// </summary>
        [SerializeField] private Texture m_sunTexture = null;
        
        /// <summary>
        /// Property: The texture used to render the sun.
        /// </summary>
        public Texture SunTexture { get => m_sunTexture; set => m_sunTexture = value; }
        
        
        /// <summary>
        /// Field: The texture used to render the moon.
        /// </summary>
        [SerializeField] private Texture m_moonTexture = null;
        
        /// <summary>
        /// Property: The texture used to render the moon.
        /// </summary>
        public Texture MoonTexture { get => m_moonTexture; set => m_moonTexture = value; }


        /// <summary>
        /// Field: The texture used to render the regular stars and Milky Way.
        /// </summary>
        [SerializeField] private Cubemap m_starfieldTexture = null;
        
        /// <summary>
        /// Property: The texture used to render the regular stars and Milky Way.
        /// </summary>
        public Cubemap StarfieldTexture { get => m_starfieldTexture; set => m_starfieldTexture = value; }
        
        
        /// <summary>
        /// Field: The texture used to render the procedural clouds.
        /// </summary>
        [SerializeField] private Texture m_dynamicCloudTexture = null;
        
        /// <summary>
        /// Property: The texture used to render the procedural clouds.
        /// </summary>
        public Texture DynamicCloudTexture { get => m_dynamicCloudTexture; set => m_dynamicCloudTexture = value; }
        
        
        /// <summary>
        /// Field: The texture used to render the static clouds.
        /// </summary>
        [SerializeField] private Texture m_staticCloudTexture = null;
        
        /// <summary>
        /// Property: The texture used to render the static clouds.
        /// </summary>
        public Texture StaticCloudTexture { get => m_staticCloudTexture; set => m_staticCloudTexture = value; }
        
        
        /// <summary>
        /// Field: The shader used to render the sky without clouds.
        /// </summary>
        [SerializeField] private Shader m_emptySkyShader = null;
        
        /// <summary>
        /// Property: The shader used to render the sky without clouds.
        /// </summary>
        public Shader EmptySkyShader { get => m_emptySkyShader; set => m_emptySkyShader = value; }
        
        
        /// <summary>
        /// Field: The shader used to render the sky with the 2D procedural clouds.
        /// </summary>
        [SerializeField] private Shader m_dynamicCloudShader = null;
        
        /// <summary>
        /// Property: The shader used to render the sky with the 2D procedural clouds.
        /// </summary>
        public Shader DynamicCloudShader { get => m_dynamicCloudShader; set => m_dynamicCloudShader = value; }
        
        
        /// <summary>
        /// Field: The shader used to render the sky with the static clouds.
        /// </summary>
        [SerializeField] private Shader m_staticCloudShader = null;
        
        /// <summary>
        /// Property: The shader used to render the sky with the static clouds.
        /// </summary>
        public Shader StaticCloudShader { get => m_staticCloudShader; set => m_staticCloudShader = value; }
        
        
        /// <summary>
        /// Field: The transform that will represent the position of the sun in the sky.
        /// </summary>
        [SerializeField] private Transform m_sunTransform = null;
        
        /// <summary>
        /// Property: The transform that will represent the position of the sun in the sky.
        /// </summary>
        public Transform SunTransform { get => m_sunTransform; set => m_sunTransform = value; }
        
        
        /// <summary>
        /// Field: The transform that will represent the position of the moon in the sky.
        /// </summary>
        [SerializeField] private Transform m_moonTransform = null;
        
        /// <summary>
        /// Property: The transform that will represent the position of the moon in the sky.
        /// </summary>
        public Transform MoonTransform { get => m_moonTransform; set => m_moonTransform = value; }


        // Scattering
        /// <summary>
        /// Field: The wavelength of the visible light.
        /// </summary>
        [SerializeField] private Vector3 m_wavelength = new Vector3(680.0f, 550.0f, 450.0f);

        /// <summary>
        /// Property: The wavelength of the visible light.
        /// </summary>
        public Vector3 Wavelength { get => m_wavelength; set => m_wavelength = value; }


        /// <summary>
        /// Field: The molecular density of the air.
        /// </summary>
        [SerializeField] private float m_molecularDensity = 2.545f;

        /// <summary>
        /// Property: The molecular density of the air.
        /// </summary>
        public float MolecularDensity { get => m_molecularDensity; set => m_molecularDensity = value; }


        /// <summary>
        /// Field: The sky scale factor.
        /// </summary>
        [SerializeField] private float m_skyScale = 1.0f;

        /// <summary>
        /// Property: The sky scale factor.
        /// </summary>
        public float SkyScale { get => m_skyScale; set => m_skyScale = value; }


        /// <summary>
        /// Field: The mie directionality factor.
        /// </summary>
        [SerializeField] private float m_mieDirectionalityFactor = 0.75f;

        /// <summary>
        /// Property: The mie directionality factor.
        /// </summary>
        public float MieDirectionalityFactor { get => m_mieDirectionalityFactor; set => m_mieDirectionalityFactor = value; }
        
        
        /// <summary>
        /// Field: The rayleigh altitude in kilometers.
        /// </summary>
        [SerializeField] private float m_kr = 84000.0f;
        
        /// <summary>
        /// Property: The rayleigh altitude in kilometers.
        /// </summary>
        public float Kr { get => m_kr; set => m_kr = value; }
        
        
        /// <summary>
        /// Field: The mie altitude in kilometers.
        /// </summary>
        [SerializeField] private float m_km = 12000.0f;
        
        /// <summary>
        /// Property: The mie altitude in kilometers.
        /// </summary>
        public float Km { get => m_km; set => m_km = value; }
        
        
        /// <summary>
        /// Field: The rayleigh scattering multiplier.
        /// </summary>
        [SerializeField] private float m_rayleigh = 1.5f;
        
        /// <summary>
        /// Property: The rayleigh scattering multiplier.
        /// </summary>
        public float Rayleigh { get => m_rayleigh; set => m_rayleigh = value; }
        
        
        /// <summary>
        /// Field: The mie scattering multiplier.
        /// </summary>
        [SerializeField] private float m_mie = 1.0f;
        
        /// <summary>
        /// Property: The mie scattering multiplier.
        /// </summary>
        public float Mie { get => m_mie; set => m_mie = value; }
        
        
        /// <summary>
        /// Field: The scattering intensity.
        /// </summary>
        [SerializeField] private float m_scattering = 15.0f;
        
        /// <summary>
        /// Property: The scattering intensity.
        /// </summary>
        public float Scattering { get => m_scattering; set => m_scattering = value; }
        
        
        /// <summary>
        /// Field: The sky luminance, useful when there is no moon at night sky.
        /// </summary>
        [SerializeField] private float m_luminance = 1.5f;
        
        /// <summary>
        /// Property: The sky luminance, useful when there is no moon at night sky.
        /// </summary>
        public float Luminance { get => m_luminance; set => m_luminance = value; }
        
        
        /// <summary>
        /// Field: The exposure of the internal sky shader tonemapping.
        /// </summary>
        [SerializeField] private float m_exposure = 2.0f;
        
        /// <summary>
        /// Property: The exposure of the internal sky shader tonemapping.
        /// </summary>
        public float Exposure { get => m_exposure; set => m_exposure = value; }
        
        
        /// <summary>
        /// Field: The rayleigh color multiplier.
        /// </summary>
        [SerializeField] private Color m_rayleighColor = Color.white;
        
        /// <summary>
        /// Property: The rayleigh color multiplier.
        /// </summary>
        public Color RayleighColor { get => m_rayleighColor; set => m_rayleighColor = value; }
        
        
        /// <summary>
        /// Field: The mie color multiplier.
        /// </summary>
        [SerializeField] private Color m_mieColor = Color.white;
        
        /// <summary>
        /// Property: The mie color multiplier.
        /// </summary>
        public Color MieColor { get => m_mieColor; set => m_mieColor = value; }
        
        
        /// <summary>
        /// Field: The scattering color multiplier.
        /// </summary>
        [SerializeField] private Color m_scatteringColor = Color.white;
        
        /// <summary>
        /// Property: The scattering color multiplier.
        /// </summary>
        public Color ScatteringColor { get => m_scatteringColor; set => m_scatteringColor = value; }


        // Outter Space
        /// <summary>
        /// Field: The size of the sun texture.
        /// </summary>
        [SerializeField] private float m_sunTextureSize = 1.5f;

        /// <summary>
        /// Property: The size of the sun texture.
        /// </summary>
        public float SunTextureSize { get => m_sunTextureSize; set => m_sunTextureSize = value; }


        /// <summary>
        /// Field: The intensity of the sun texture.
        /// </summary>
        [SerializeField] private float m_sunTextureIntensity = 1.0f;

        /// <summary>
        /// Property: The intensity of the sun texture.
        /// </summary>
        public float SunTextureIntensity { get => m_sunTextureIntensity; set => m_sunTextureIntensity = value; }


        /// <summary>
        /// Field: The sun texture color multiplier.
        /// </summary>
        [SerializeField] private Color m_sunTextureColor = Color.white;

        /// <summary>
        /// Property: The sun texture color multiplier.
        /// </summary>
        public Color SunTextureColor { get => m_sunTextureColor; set => m_sunTextureColor = value; }


        /// <summary>
        /// Field: The size of the moon texture.
        /// </summary>
        [SerializeField] private float m_moonTextureSize = 10.0f;

        /// <summary>
        /// Property: The size of the moon texture.
        /// </summary>
        public float MoonTextureSize { get => m_moonTextureSize; set => m_moonTextureSize = value; }


        /// <summary>
        /// Field: The intensity of the moon texture.
        /// </summary>
        [SerializeField] private float m_moonTextureIntensity = 1.0f;

        /// <summary>
        /// Property: The intensity of the moon texture.
        /// </summary>
        public float MoonTextureIntensity { get => m_moonTextureIntensity; set => m_moonTextureIntensity = value; }


        /// <summary>
        /// Field: The moon texture color multiplier.
        /// </summary>
        [SerializeField] private Color m_moonTextureColor = Color.white;

        /// <summary>
        /// Property: The moon texture color multiplier.
        /// </summary>
        public Color MoonTextureColor { get => m_moonTextureColor; set => m_moonTextureColor = value; }


        /// <summary>
        /// Field: The intensity of the regular stars.
        /// </summary>
        [SerializeField] private float m_starsIntensity = 0.5f;

        /// <summary>
        /// Property: The intensity of the regular stars.
        /// </summary>
        public float StarsIntensity { get => m_starsIntensity; set => m_starsIntensity = value; }


        /// <summary>
        /// Field: The intensity of the Milky Way.
        /// </summary>
        [SerializeField] private float m_milkyWayIntensity = 0.0f;

        /// <summary>
        /// Property: The intensity of the Milky Way.
        /// </summary>
        public float MilkyWayIntensity { get => m_milkyWayIntensity; set => m_milkyWayIntensity = value; }


        /// <summary>
        /// Field: The star field color multiplier.
        /// </summary>
        [SerializeField] private Color m_starfieldColor = Color.white;

        /// <summary>
        /// Property: The star field color multiplier.
        /// </summary>
        public Color StarfieldColor { get => m_starfieldColor; set => m_starfieldColor = value; }


        /// <summary>
        /// Field: The rotation position of the starfield cubemap.
        /// </summary>
        [SerializeField] private Vector3 m_starfieldRotationPos = Vector3.zero;

        /// <summary>
        /// Property: The rotation position of the starfield cubemap.
        /// </summary>
        public Vector3 StarfieldRotationPos { get => m_starfieldRotationPos; set => m_starfieldRotationPos = value; }


        /// <summary>
        /// Field: The starfield quaternion rotation.
        /// </summary>
        private Quaternion m_starfieldRotation;


        /// <summary>
        /// Field: The starfield rotation matrix.
        /// </summary>
        private Matrix4x4 m_starfieldRotationMatrix;


        // Fog Scattering
        /// <summary>
        /// Field: The fog scattering mie distance.
        /// </summary>
        [SerializeField] private float m_mieDistance = 1.0f;

        /// <summary>
        /// Property: The fog scattering mie distance.
        /// </summary>
        public float MieDistance { get => m_mieDistance; set => m_mieDistance = value; }


        /// <summary>
        /// Field: The distance of the global fog scattering.
        /// </summary>
        [SerializeField] private float m_globalFogDistance = 1000.0f;

        /// <summary>
        /// Property: The distance of the global fog scattering.
        /// </summary>
        public float GlobalFogDistance { get => m_globalFogDistance; set => m_globalFogDistance = value; }


        /// <summary>
        /// Field: The smooth step transition from where there is no global fog to where is completely foggy.
        /// </summary>
        [SerializeField] private float m_globalFogSmoothStep = 0.25f;

        /// <summary>
        /// Property: The smooth step transition from where there is no global fog to where is completely foggy.
        /// </summary>
        public float GlobalFogSmoothStep { get => m_globalFogSmoothStep; set => m_globalFogSmoothStep = value; }


        /// <summary>
        /// Field: The global fog scattering density.
        /// </summary>
        [SerializeField] private float m_globalFogDensity = 1.0f;

        /// <summary>
        /// Property: The global fog scattering density.
        /// </summary>
        public float GlobalFogDensity { get => m_globalFogDensity; set => m_globalFogDensity = value; }


        /// <summary>
        /// Field: The distance of the height fog scattering.
        /// </summary>
        [SerializeField] private float m_heightFogDistance = 100.0f;

        /// <summary>
        /// Property: The distance of the height fog scattering.
        /// </summary>
        public float HeightFogDistance { get => m_heightFogDistance; set => m_heightFogDistance = value; }


        /// <summary>
        /// Field: The smooth step transition from where there is no height fog to where is completely foggy.
        /// </summary>
        [SerializeField] private float m_heightFogSmoothStep = 1.0f;

        /// <summary>
        /// Property: The smooth step transition from where there is no height fog to where is completely foggy.
        /// </summary>
        public float HeightFogSmoothStep { get => m_heightFogSmoothStep; set => m_heightFogSmoothStep = value; }


        /// <summary>
        /// Field: The height fog scattering density.
        /// </summary>
        [SerializeField] private float m_heightFogDensity = 0.0f;

        /// <summary>
        /// Property: The height fog scattering density.
        /// </summary>
        public float HeightFogDensity { get => m_heightFogDensity; set => m_heightFogDensity = value; }


        /// <summary>
        /// Field: The height fog start height.
        /// </summary>
        [SerializeField] private float m_heightFogStart = 0.0f;

        /// <summary>
        /// Property: The height fog start height.
        /// </summary>
        public float HeightFogStart { get => m_heightFogStart; set => m_heightFogStart = value; }


        /// <summary>
        /// Field: The height fog end height.
        /// </summary>
        [SerializeField] private float m_heightFogEnd = 100.0f;

        /// <summary>
        /// Property: The height fog end height.
        /// </summary>
        public float HeightFogEnd { get => m_heightFogEnd; set => m_heightFogEnd = value; }


        // Dynamic Clouds
        /// <summary>
        /// Field: The altitude of the dynamic clouds in the sky.
        /// </summary>
        [SerializeField] private float m_dynamicCloudAltitude = 7.5f;

        /// <summary>
        /// Property: The altitude of the dynamic clouds in the sky.
        /// </summary>
        public float DynamicCloudAltitude { get => m_dynamicCloudAltitude; set => m_dynamicCloudAltitude = value; }


        /// <summary>
        /// Field: The movement direction of the dynamic clouds.
        /// </summary>
        [SerializeField] private float m_dynamicCloudDirection = 0.0f;

        /// <summary>
        /// Property: The movement direction of the dynamic clouds.
        /// </summary>
        public float DynamicCloudDirection { get => m_dynamicCloudDirection; set => m_dynamicCloudDirection = value; }


        /// <summary>
        /// Field: The movement speed of the dynamic clouds.
        /// </summary>
        [SerializeField] private float m_dynamicCloudSpeed = 0.1f;

        /// <summary>
        /// Property: The movement speed of the dynamic clouds.
        /// </summary>
        public float DynamicCloudSpeed { get => m_dynamicCloudSpeed; set => m_dynamicCloudSpeed = value; }


        /// <summary>
        /// Field: The coverage of the dynamic clouds.
        /// </summary>
        [SerializeField] private float m_dynamicCloudDensity = 0.75f;

        /// <summary>
        /// Property: The coverage of the dynamic clouds.
        /// </summary>
        public float DynamicCloudDensity { get => m_dynamicCloudDensity; set => m_dynamicCloudDensity = value; }


        /// <summary>
        /// Field: The first color of the dynamic clouds.
        /// </summary>
        [SerializeField] private Color m_dynamicCloudColor1 = Color.white;

        /// <summary>
        /// Property: The first color of the dynamic clouds.
        /// </summary>
        public Color DynamicCloudColor1 { get => m_dynamicCloudColor1; set => m_dynamicCloudColor1 = value; }


        /// <summary>
        /// Field: The second color of the dynamic clouds.
        /// </summary>
        [SerializeField] private Color m_dynamicCloudColor2 = Color.white;

        /// <summary>
        /// Property: The second color of the dynamic clouds.
        /// </summary>
        public Color DynamicCloudColor2 { get => m_dynamicCloudColor2; set => m_dynamicCloudColor2 = value; }


        /// <summary>
        /// Field: The dynamic cloud uv.
        /// </summary>
        private Vector2 m_dynamicCloudUV = Vector2.zero;
        
        /// <summary>
        /// Property: The dynamic cloud uv.
        /// </summary>
        public Vector2 DynamicCloudUV => m_dynamicCloudUV;


        // Static Clouds
        /// <summary>
        /// Field: The rotation speed of the static cloud layer 1.
        /// </summary>
        [SerializeField] private float m_staticCloudLayer1Speed = 0.0025f;

        /// <summary>
        /// Property: The rotation speed of the static cloud layer 1.
        /// </summary>
        public float StaticCloudLayer1Speed { get => m_staticCloudLayer1Speed; set => m_staticCloudLayer1Speed = value; }


        /// <summary>
        /// Field: The rotation speed of the static cloud layer 2.
        /// </summary>
        [SerializeField] private float m_staticCloudLayer2Speed = 0.0075f;

        /// <summary>
        /// Property: The rotation speed of the static cloud layer 2.
        /// </summary>
        public float StaticCloudLayer2Speed { get => m_staticCloudLayer2Speed; set => m_staticCloudLayer2Speed = value; }


        /// <summary>
        /// Field: The current rotation of the static cloud layer 1.
        /// </summary>
        private float m_staticCloudLayer1Rotation = 0.0f;

        /// <summary>
        /// Property: The current rotation of the static cloud layer 1.
        /// </summary>
        public float StaticCloudLayer1Rotation => m_staticCloudLayer1Rotation;


        /// <summary>
        /// Field: The current rotation of the static cloud layer 2.
        /// </summary>
        private float m_staticCloudLayer2Rotation = 0.0f;

        /// <summary>
        /// Property: The current rotation of the static cloud layer 2.
        /// </summary>
        public float StaticCloudLayer2Rotation => m_staticCloudLayer2Rotation;


        /// <summary>
        /// Field: The static cloud scattering intensity.
        /// </summary>
        [SerializeField] private float m_staticCloudScattering = 1.0f;

        /// <summary>
        /// Property: The static cloud scattering intensity.
        /// </summary>
        public float StaticCloudScattering { get => m_staticCloudScattering; set => m_staticCloudScattering = value; }


        /// <summary>
        /// Field: The static cloud extinction.
        /// </summary>
        [SerializeField] private float m_staticCloudExtinction = 1.5f;

        /// <summary>
        /// Property: The static cloud extinction.
        /// </summary>
        public float StaticCloudExtinction { get => m_staticCloudExtinction; set => m_staticCloudExtinction = value; }


        /// <summary>
        /// Field: The static cloud saturation.
        /// </summary>
        [SerializeField] private float m_staticCloudSaturation = 2.5f;

        /// <summary>
        /// Property: The static cloud saturation.
        /// </summary>
        public float StaticCloudSaturation { get => m_staticCloudSaturation; set => m_staticCloudSaturation = value; }


        /// <summary>
        /// Field: The static cloud opacity.
        /// </summary>
        [SerializeField] private float m_staticCloudOpacity = 1.25f;

        /// <summary>
        /// Property: The static cloud opacity.
        /// </summary>
        public float StaticCloudOpacity { get => m_staticCloudOpacity; set => m_staticCloudOpacity = value; }


        /// <summary>
        /// Field: The static cloud color.
        /// </summary>
        [SerializeField] private Color m_staticCloudColor = Color.white;

        /// <summary>
        /// Property: The static cloud color.
        /// </summary>
        public Color StaticCloudColor { get => m_staticCloudColor; set => m_staticCloudColor = value; }


        // Options
        /// <summary>
        /// Field: The mode the sunset color should be rendered.
        /// </summary>
        [SerializeField] private SunsetColorMode m_sunsetColorMode = SunsetColorMode.Simulated;

        /// <summary>
        /// Property: The mode the sunset color should be rendered.
        /// </summary>
        public SunsetColorMode SunsetColorMode
        {
            get => m_sunsetColorMode;
            set
            {
                m_sunsetColorMode = value;
                UpdateShaderUniforms();
            }
        }


        /// <summary>
        /// Field: The mode the clouds should be rendered.
        /// </summary>
        [SerializeField] private SkyboxCloudMode m_cloudMode = SkyboxCloudMode.Off;

        /// <summary>
        /// Property: The mode the clouds should be rendered.
        /// </summary>
        public SkyboxCloudMode CloudMode
        {
            get => m_cloudMode;
            set
            {
                SetCloudMode();
            }
        }


        /// <summary>
        /// Field: Should the skybox material be rendered on the current scene or not?
        /// </summary>
        [SerializeField] private SkyboxRenderMode m_skyboxRenderMode = SkyboxRenderMode.Enabled;

        /// <summary>
        /// Property: Should the skybox material be rendered on the current scene or not?
        /// </summary>
        public SkyboxRenderMode SkyboxRenderMode
        {
            get => m_skyboxRenderMode;
            set
            {
                m_skyboxRenderMode = value;
                switch (value)
                {
                    case SkyboxRenderMode.Enabled:
                        RenderSettings.skybox = m_skyMaterial;
                        break;
                    case SkyboxRenderMode.Disabled:
                        if (RenderSettings.skybox == m_skyMaterial)
                        {
                            RenderSettings.skybox = null;
                        }
                        break;
                }
            }
        }


        /// <summary>
        /// Field: The way the shader uniforms will be updated.
        /// </summary>
        [SerializeField] private AzureUpdateMode m_updateMode = AzureUpdateMode.LocallyEveryFrame;
        
        /// <summary>
        /// Property: The way the shader uniforms will be updated.
        /// </summary>
        public AzureUpdateMode UpdateMode { get => m_updateMode; set => m_updateMode = value; }


        void Awake()
        {
            SetCloudMode();

            UpdateTextureUniforms();

            // First update of the shader uniforms
            if (Application.isPlaying)
            {
                if (m_updateMode == AzureUpdateMode.LocallyEveryFrame)
                {
                    UpdateShaderUniforms();
                }
            }
        }
        
        
        void Update()
        {
            // Only in gameplay
            if (Application.isPlaying)
            {
                // Clouds movement
                if (m_cloudMode == SkyboxCloudMode.Dynamic)
                {
                    m_dynamicCloudUV = CalculeDynamicCloudUV();
                    m_skyMaterial.SetVector(AzureShaderUniforms.DynamicCloudDirection, m_dynamicCloudUV);
                }
                else if (m_cloudMode == SkyboxCloudMode.Static)
                {
                    m_staticCloudLayer1Rotation += m_staticCloudLayer1Speed * Time.deltaTime;
                    m_staticCloudLayer2Rotation += m_staticCloudLayer2Speed * Time.deltaTime;
                    if (m_staticCloudLayer1Rotation >= 1.0f) { m_staticCloudLayer1Rotation -= 1.0f; }
                    if (m_staticCloudLayer2Rotation >= 1.0f) { m_staticCloudLayer2Rotation -= 1.0f; }
                    m_skyMaterial.SetFloat(AzureShaderUniforms.StaticCloudLayer1Rotation, m_staticCloudLayer1Rotation);
                    m_skyMaterial.SetFloat(AzureShaderUniforms.StaticCloudLayer2Rotation, m_staticCloudLayer2Rotation);
                }


                // Update the shader uniforms every frame
                if (m_updateMode == AzureUpdateMode.LocallyEveryFrame)
                {
                    UpdateShaderUniforms();
                }
            }
            

            #if UNITY_EDITOR
            if (!Application.isPlaying)
            {
                UpdateTextureUniforms();
                UpdateShaderUniforms();
            }
            #endif
        }


        private void OnEnable()
        {
            if (m_skyboxRenderMode == SkyboxRenderMode.Enabled)
                RenderSettings.skybox = m_skyMaterial;
        }


        public void UpdateTextureUniforms()
        {
            m_skyMaterial.SetTexture(AzureShaderUniforms.SunTexture, m_sunTexture);
            m_skyMaterial.SetTexture(AzureShaderUniforms.MoonTexture, m_moonTexture);
            m_skyMaterial.SetTexture(AzureShaderUniforms.StarFieldTexture, m_starfieldTexture);
            m_skyMaterial.SetTexture(AzureShaderUniforms.DynamicCloudTexture, m_dynamicCloudTexture);
            m_skyMaterial.SetTexture(AzureShaderUniforms.StaticCloudTexture, m_staticCloudTexture);
        }


        public void UpdateShaderUniforms()
        {
            m_starfieldRotation = Quaternion.Euler(m_starfieldRotationPos);
            m_starfieldRotationMatrix = Matrix4x4.TRS(Vector3.zero, m_starfieldRotation, Vector3.one);

            UpdateGlobalShaderUniforms();
        }


        /// <summary>
        /// Update the shader uniforms globally to all the shaders using it.
        /// </summary>
        private void UpdateGlobalShaderUniforms()
        {
            Shader.SetGlobalVector(AzureShaderUniforms.SunDirection, transform.InverseTransformDirection(-m_sunTransform.forward));
            Shader.SetGlobalVector(AzureShaderUniforms.MoonDirection, transform.InverseTransformDirection(-m_moonTransform.forward));
            Shader.SetGlobalMatrix(AzureShaderUniforms.SunMatrix, m_sunTransform.worldToLocalMatrix);
            Shader.SetGlobalMatrix(AzureShaderUniforms.MoonMatrix, m_moonTransform.worldToLocalMatrix);
            Shader.SetGlobalMatrix(AzureShaderUniforms.UpDirectionMatrix, transform.worldToLocalMatrix);
            Shader.SetGlobalMatrix(AzureShaderUniforms.StarFieldRotationMatrix, m_starfieldRotationMatrix);
            Shader.SetGlobalInt(AzureShaderUniforms.ScatteringMode, (int)m_sunsetColorMode);
            Shader.SetGlobalFloat(AzureShaderUniforms.Kr, m_kr);
            Shader.SetGlobalFloat(AzureShaderUniforms.Km, m_km);
            Shader.SetGlobalVector(AzureShaderUniforms.Rayleigh, ComputeRayleigh() * m_rayleigh);
            Shader.SetGlobalVector(AzureShaderUniforms.Mie, ComputeMie() * m_mie);
            Shader.SetGlobalVector(AzureShaderUniforms.MieG, ComputeMieG());
            Shader.SetGlobalFloat(AzureShaderUniforms.MieDistance, m_mieDistance);
            Shader.SetGlobalFloat(AzureShaderUniforms.Scattering, m_scattering);
            Shader.SetGlobalFloat(AzureShaderUniforms.Luminance, m_luminance);
            Shader.SetGlobalFloat(AzureShaderUniforms.Exposure, m_exposure);
            Shader.SetGlobalColor(AzureShaderUniforms.RayleighColor, m_rayleighColor);
            Shader.SetGlobalColor(AzureShaderUniforms.MieColor, m_mieColor);
            Shader.SetGlobalColor(AzureShaderUniforms.ScatteringColor, m_scatteringColor);
            Shader.SetGlobalFloat(AzureShaderUniforms.SunTextureSize, m_sunTextureSize);
            Shader.SetGlobalFloat(AzureShaderUniforms.SunTextureIntensity, m_sunTextureIntensity);
            Shader.SetGlobalColor(AzureShaderUniforms.SunTextureColor, m_sunTextureColor);
            Shader.SetGlobalFloat(AzureShaderUniforms.MoonTextureSize, m_moonTextureSize);
            Shader.SetGlobalFloat(AzureShaderUniforms.MoonTextureIntensity, m_moonTextureIntensity);
            Shader.SetGlobalColor(AzureShaderUniforms.MoonTextureColor, m_moonTextureColor);
            Shader.SetGlobalFloat(AzureShaderUniforms.StarsIntensity, m_starsIntensity);
            Shader.SetGlobalFloat(AzureShaderUniforms.MilkyWayIntensity, m_milkyWayIntensity);
            Shader.SetGlobalColor(AzureShaderUniforms.StarFieldColor, m_starfieldColor);
            Shader.SetGlobalFloat(AzureShaderUniforms.SkyScale, m_skyScale);
            Shader.SetGlobalFloat(AzureShaderUniforms.GlobalFogDistance, m_globalFogDistance);
            Shader.SetGlobalFloat(AzureShaderUniforms.GlobalFogSmoothStep, m_globalFogSmoothStep);
            Shader.SetGlobalFloat(AzureShaderUniforms.GlobalFogDensity, m_globalFogDensity);
            Shader.SetGlobalFloat(AzureShaderUniforms.HeightFogDistance, m_heightFogDistance);
            Shader.SetGlobalFloat(AzureShaderUniforms.HeightFogSmoothStep, m_heightFogSmoothStep);
            Shader.SetGlobalFloat(AzureShaderUniforms.HeightFogDensity, m_heightFogDensity);
            Shader.SetGlobalFloat(AzureShaderUniforms.HeightFogStart, m_heightFogStart);
            Shader.SetGlobalFloat(AzureShaderUniforms.HeightFogEnd, m_heightFogEnd);
            Shader.SetGlobalFloat(AzureShaderUniforms.DynamicCloudAltitude, m_dynamicCloudAltitude);
            Shader.SetGlobalFloat(AzureShaderUniforms.DynamicCloudDensity, Mathf.Lerp(25.0f, 0.0f, m_dynamicCloudDensity));
            Shader.SetGlobalVector(AzureShaderUniforms.DynamicCloudColor1, m_dynamicCloudColor1);
            Shader.SetGlobalVector(AzureShaderUniforms.DynamicCloudColor2, m_dynamicCloudColor2);
            Shader.SetGlobalFloat(AzureShaderUniforms.StaticCloudLayer1Rotation, m_staticCloudLayer1Speed);
            Shader.SetGlobalFloat(AzureShaderUniforms.StaticCloudLayer2Rotation, m_staticCloudLayer2Speed);
            Shader.SetGlobalFloat(AzureShaderUniforms.StaticCloudScattering, m_staticCloudScattering);
            Shader.SetGlobalFloat(AzureShaderUniforms.StaticCloudExtinction, m_staticCloudExtinction);
            Shader.SetGlobalFloat(AzureShaderUniforms.StaticCloudSaturation, m_staticCloudSaturation);
            Shader.SetGlobalFloat(AzureShaderUniforms.StaticCloudOpacity, m_staticCloudOpacity);
            Shader.SetGlobalVector(AzureShaderUniforms.StaticCloudColor, m_staticCloudColor);
        }


        /// <summary>
        /// Total rayleigh computation.
        /// </summary>
        private Vector3 ComputeRayleigh()
        {
            Vector3 rayleigh = Vector3.one;
            Vector3 lambda = m_wavelength * 1e-9f;
            float n = 1.0003f; // Refractive index of air
            float pn = 0.035f; // Depolarization factor for standard air.
            float n2 = n * n;
            //float N = 2.545E25f;
            float N = m_molecularDensity * 1E25f;
            float temp = (8.0f * Mathf.PI * Mathf.PI * Mathf.PI * ((n2 - 1.0f) * (n2 - 1.0f))) / (3.0f * N) * ((6.0f + 3.0f * pn) / (6.0f - 7.0f * pn));

            rayleigh.x = temp / Mathf.Pow(lambda.x, 4.0f);
            rayleigh.y = temp / Mathf.Pow(lambda.y, 4.0f);
            rayleigh.z = temp / Mathf.Pow(lambda.z, 4.0f);

            return rayleigh;
        }


        /// <summary>
        /// Total mie computation.
        /// </summary>
        private Vector3 ComputeMie()
        {
            Vector3 mie;

            //float c = (0.6544f * Turbidity - 0.6510f) * 1e-16f;
            float c = (0.6544f * 5.0f - 0.6510f) * 10f * 1e-9f;
            //float c = (65440000f * 2.0f - 65100000f) * Mathf.Pow(10.0f, -16.0f);
            Vector3 k = new Vector3(686.0f, 678.0f, 682.0f);

            mie.x = (434.0f * c * Mathf.PI * Mathf.Pow((4.0f * Mathf.PI) / m_wavelength.x, 2.0f) * k.x);
            mie.y = (434.0f * c * Mathf.PI * Mathf.Pow((4.0f * Mathf.PI) / m_wavelength.y, 2.0f) * k.y);
            mie.z = (434.0f * c * Mathf.PI * Mathf.Pow((4.0f * Mathf.PI) / m_wavelength.z, 2.0f) * k.z);

            //float c = (6544f * 5.0f - 6510f) * 10.0f * 1.0e-9f;
            //mie.x = (0.434f * c * Mathf.PI * Mathf.Pow((2.0f * Mathf.PI) / wavelengthR, 2.0f) * k.x) / 3.0f;
            //mie.y = (0.434f * c * Mathf.PI * Mathf.Pow((2.0f * Mathf.PI) / wavelengthG, 2.0f) * k.y) / 3.0f;
            //mie.z = (0.434f * c * Mathf.PI * Mathf.Pow((2.0f * Mathf.PI) / wavelengthB, 2.0f) * k.z) / 3.0f;

            return mie;
        }


        /// <summary>
        /// Computed the mie directionality factor.
        /// </summary>
        private Vector3 ComputeMieG()
        {
            return new Vector3(1.0f - m_mieDirectionalityFactor * m_mieDirectionalityFactor, 1.0f + m_mieDirectionalityFactor * m_mieDirectionalityFactor, 2.0f * m_mieDirectionalityFactor);
        }


        /// <summary>
        /// Compute the dynamic cloud uv position based on the direction and speed and returns it as a Vector2.
        /// </summary>
        private Vector2 CalculeDynamicCloudUV()
        {
            float x = m_dynamicCloudUV.x;
            float z = m_dynamicCloudUV.y;
            float windSpeed = m_dynamicCloudSpeed * 0.05f * Time.deltaTime;
        
            x += windSpeed * Mathf.Sin(0.01745329f * m_dynamicCloudDirection);
            z += windSpeed * Mathf.Cos(0.01745329f * m_dynamicCloudDirection);
        
            if (x >= 1.0f) x -= 1.0f;
            if (z >= 1.0f) z -= 1.0f;
        
            return new Vector2(x, z);
        }


        /// <summary>
        /// Changes the material shader according to the cloud mode.
        /// </summary>
        private void SetCloudMode()
        {
            switch (m_cloudMode)
            {
                case SkyboxCloudMode.Off:
                    m_skyMaterial.shader = m_emptySkyShader;
                    break;
                case SkyboxCloudMode.Dynamic:
                    m_skyMaterial.shader = m_dynamicCloudShader;
                    break;
                case SkyboxCloudMode.Static:
                    m_skyMaterial.shader = m_staticCloudShader;
                    break;
            }
        }
    }
}