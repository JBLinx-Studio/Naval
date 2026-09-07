using UnityEngine;
using UnityEngine.AzureSky;


namespace UnityEditor.AzureSky
{
    [CustomEditor(typeof(AzureRenderController))]
    public sealed class AzureRenderControllerEditor : Editor
    {
        // Target
        private AzureRenderController m_target;


        // Logo
        public Texture2D iconTexture;
        private Rect m_controlRect;


        // Serialized properties
        private SerializedProperty m_showAssetDependenciesTab;
        private SerializedProperty m_showTransformReferencesTab;
        private SerializedProperty m_showScatteringTab;
        private SerializedProperty m_showOutterSpaceTab;
        private SerializedProperty m_showFogScatteringTab;
        private SerializedProperty m_showDynamicCloudTab;
        private SerializedProperty m_showStaticCloudTab;
        private SerializedProperty m_showOptionsTab;
        private SerializedProperty m_skyMaterial;
        private SerializedProperty m_fogMaterial;
        private SerializedProperty m_sunTexture;
        private SerializedProperty m_moonTexture;
        private SerializedProperty m_starfieldTexture;
        private SerializedProperty m_dynamicCloudTexture;
        private SerializedProperty m_staticCloudTexture;
        private SerializedProperty m_emptySkyShader;
        private SerializedProperty m_dynamicCloudShader;
        private SerializedProperty m_staticCloudShader;
        private SerializedProperty m_sunTransform;
        private SerializedProperty m_moonTransform;
        private SerializedProperty m_wavelength;
        private SerializedProperty m_molecularDensity;
        private SerializedProperty m_skyScale;
        private SerializedProperty m_kr;
        private SerializedProperty m_km;
        private SerializedProperty m_rayleigh;
        private SerializedProperty m_mie;
        private SerializedProperty m_mieDirectionalityFactor;
        private SerializedProperty m_scattering;
        private SerializedProperty m_luminance;
        private SerializedProperty m_exposure;
        private SerializedProperty m_rayleighColor;
        private SerializedProperty m_mieColor;
        private SerializedProperty m_scatteringColor;
        private SerializedProperty m_sunTextureSize;
        private SerializedProperty m_sunTextureIntensity;
        private SerializedProperty m_sunTextureColor;
        private SerializedProperty m_moonTextureSize;
        private SerializedProperty m_moonTextureIntensity;
        private SerializedProperty m_moonTextureColor;
        private SerializedProperty m_starsIntensity;
        private SerializedProperty m_milkyWayIntensity;
        private SerializedProperty m_starfieldColor;
        private SerializedProperty m_starfieldRotationPos;
        private SerializedProperty m_mieDistance;
        private SerializedProperty m_globalFogDistance;
        private SerializedProperty m_globalFogSmoothStep;
        private SerializedProperty m_globalFogDensity;
        private SerializedProperty m_heightFogDistance;
        private SerializedProperty m_heightFogSmoothStep;
        private SerializedProperty m_heightFogDensity;
        private SerializedProperty m_heightFogStart;
        private SerializedProperty m_heightFogEnd;
        private SerializedProperty m_dynamicCloudAltitude;
        private SerializedProperty m_dynamicCloudDirection;
        private SerializedProperty m_dynamicCloudSpeed;
        private SerializedProperty m_dynamicCloudDensity;
        private SerializedProperty m_dynamicCloudColor1;
        private SerializedProperty m_dynamicCloudColor2;
        private SerializedProperty m_staticCloudLayer1Speed;
        private SerializedProperty m_staticCloudLayer2Speed;
        private SerializedProperty m_staticCloudScattering;
        private SerializedProperty m_staticCloudExtinction;
        private SerializedProperty m_staticCloudSaturation;
        private SerializedProperty m_staticCloudOpacity;
        private SerializedProperty m_staticCloudColor;
        private SerializedProperty m_sunsetColorMode;
        private SerializedProperty m_cloudMode;
        private SerializedProperty m_skyboxRenderMode;
        private SerializedProperty m_updateMode;


        private void OnDisable()
        {
            Undo.undoRedoPerformed -= UpdateSkyShader;
            Undo.undoRedoPerformed -= UpdateSkyboxRenderMode;
        }


        private void OnEnable()
        {
            // Get target
            m_target = (AzureRenderController) target;
            Undo.undoRedoPerformed += UpdateSkyShader;
            Undo.undoRedoPerformed += UpdateSkyboxRenderMode;


            UpdateSkyShader();
            UpdateSkyboxRenderMode();
            m_target.UpdateTextureUniforms();
            m_target.UpdateShaderUniforms();


            // Find the serialized properties
            m_showAssetDependenciesTab = serializedObject.FindProperty("m_showAssetDependenciesTab");
            m_showTransformReferencesTab = serializedObject.FindProperty("m_showTransformReferencesTab");
            m_showScatteringTab = serializedObject.FindProperty("m_showScatteringTab");
            m_showOutterSpaceTab = serializedObject.FindProperty("m_showOutterSpaceTab");
            m_showFogScatteringTab = serializedObject.FindProperty("m_showFogScatteringTab");
            m_showDynamicCloudTab = serializedObject.FindProperty("m_showDynamicCloudTab");
            m_showStaticCloudTab = serializedObject.FindProperty("m_showStaticCloudTab");
            m_showOptionsTab = serializedObject.FindProperty("m_showOptionsTab");
            m_skyMaterial = serializedObject.FindProperty("m_skyMaterial");
            m_fogMaterial = serializedObject.FindProperty("m_fogMaterial");
            m_sunTexture = serializedObject.FindProperty("m_sunTexture");
            m_moonTexture = serializedObject.FindProperty("m_moonTexture");
            m_starfieldTexture = serializedObject.FindProperty("m_starfieldTexture");
            m_dynamicCloudTexture = serializedObject.FindProperty("m_dynamicCloudTexture");
            m_staticCloudTexture = serializedObject.FindProperty("m_staticCloudTexture");
            m_emptySkyShader = serializedObject.FindProperty("m_emptySkyShader");
            m_dynamicCloudShader = serializedObject.FindProperty("m_dynamicCloudShader");
            m_staticCloudShader = serializedObject.FindProperty("m_staticCloudShader");
            m_sunTransform = serializedObject.FindProperty("m_sunTransform");
            m_moonTransform = serializedObject.FindProperty("m_moonTransform");
            m_wavelength = serializedObject.FindProperty("m_wavelength");
            m_molecularDensity = serializedObject.FindProperty("m_molecularDensity");
            m_skyScale = serializedObject.FindProperty("m_skyScale");
            m_kr = serializedObject.FindProperty("m_kr");
            m_km = serializedObject.FindProperty("m_km");
            m_rayleigh = serializedObject.FindProperty("m_rayleigh");
            m_mie = serializedObject.FindProperty("m_mie");
            m_mieDirectionalityFactor = serializedObject.FindProperty("m_mieDirectionalityFactor");
            m_scattering = serializedObject.FindProperty("m_scattering");
            m_luminance = serializedObject.FindProperty("m_luminance");
            m_exposure = serializedObject.FindProperty("m_exposure");
            m_rayleighColor = serializedObject.FindProperty("m_rayleighColor");
            m_mieColor = serializedObject.FindProperty("m_mieColor");
            m_scatteringColor = serializedObject.FindProperty("m_scatteringColor");
            m_sunTextureSize = serializedObject.FindProperty("m_sunTextureSize");
            m_sunTextureIntensity = serializedObject.FindProperty("m_sunTextureIntensity");
            m_sunTextureColor = serializedObject.FindProperty("m_sunTextureColor");
            m_moonTextureSize = serializedObject.FindProperty("m_moonTextureSize");
            m_moonTextureIntensity = serializedObject.FindProperty("m_moonTextureIntensity");
            m_moonTextureColor = serializedObject.FindProperty("m_moonTextureColor");
            m_starsIntensity = serializedObject.FindProperty("m_starsIntensity");
            m_milkyWayIntensity = serializedObject.FindProperty("m_milkyWayIntensity");
            m_starfieldColor = serializedObject.FindProperty("m_starfieldColor");
            m_starfieldRotationPos = serializedObject.FindProperty("m_starfieldRotationPos");
            m_mieDistance = serializedObject.FindProperty("m_mieDistance");
            m_globalFogDistance = serializedObject.FindProperty("m_globalFogDistance");
            m_globalFogSmoothStep = serializedObject.FindProperty("m_globalFogSmoothStep");
            m_globalFogDensity = serializedObject.FindProperty("m_globalFogDensity");
            m_heightFogDistance = serializedObject.FindProperty("m_heightFogDistance");
            m_heightFogSmoothStep = serializedObject.FindProperty("m_heightFogSmoothStep");
            m_heightFogDensity = serializedObject.FindProperty("m_heightFogDensity");
            m_heightFogStart = serializedObject.FindProperty("m_heightFogStart");
            m_heightFogEnd = serializedObject.FindProperty("m_heightFogEnd");
            m_dynamicCloudAltitude = serializedObject.FindProperty("m_dynamicCloudAltitude");
            m_dynamicCloudDirection = serializedObject.FindProperty("m_dynamicCloudDirection");
            m_dynamicCloudSpeed = serializedObject.FindProperty("m_dynamicCloudSpeed");
            m_dynamicCloudDensity = serializedObject.FindProperty("m_dynamicCloudDensity");
            m_dynamicCloudColor1 = serializedObject.FindProperty("m_dynamicCloudColor1");
            m_dynamicCloudColor2 = serializedObject.FindProperty("m_dynamicCloudColor2");
            m_staticCloudLayer1Speed = serializedObject.FindProperty("m_staticCloudLayer1Speed");
            m_staticCloudLayer2Speed = serializedObject.FindProperty("m_staticCloudLayer2Speed");
            m_staticCloudScattering = serializedObject.FindProperty("m_staticCloudScattering");
            m_staticCloudExtinction = serializedObject.FindProperty("m_staticCloudExtinction");
            m_staticCloudSaturation = serializedObject.FindProperty("m_staticCloudSaturation");
            m_staticCloudOpacity = serializedObject.FindProperty("m_staticCloudOpacity");
            m_staticCloudColor = serializedObject.FindProperty("m_staticCloudColor");
            m_sunsetColorMode = serializedObject.FindProperty("m_sunsetColorMode");
            m_cloudMode = serializedObject.FindProperty("m_cloudMode");
            m_skyboxRenderMode = serializedObject.FindProperty("m_skyboxRenderMode");
            m_updateMode = serializedObject.FindProperty("m_updateMode");
        }


        public override void OnInspectorGUI()
        {
            // Start custom inspector
            //serializedObject.Update();
            EditorGUI.BeginChangeCheck();


            // Title
            m_controlRect = EditorGUILayout.GetControlRect(GUILayout.Height(38f));
            EditorGUI.LabelField(new Rect(m_controlRect.x - 14f, m_controlRect.y, m_controlRect.width + 14f, m_controlRect.height), "", "", "selectionRect");
            if (iconTexture) GUI.DrawTexture(new Rect(m_controlRect.x + 3f, m_controlRect.y + 3f, 32f, 32f), iconTexture);
            GUI.Label(new Rect(m_controlRect.x + 38f, m_controlRect.y + 3f, m_controlRect.width, 22f), "Azure Render Controller", EditorStyles.whiteLargeLabel);
            GUI.Label(new Rect(m_controlRect.x + 38f, m_controlRect.y + 17f, m_controlRect.width, 22f), "Version 1.0.0", EditorStyles.whiteMiniLabel);


            // Begin the dependencies tab
            m_controlRect = EditorGUILayout.GetControlRect();
            m_controlRect.width -= 4f;
            m_showAssetDependenciesTab.isExpanded = EditorGUI.BeginFoldoutHeaderGroup(m_controlRect, m_showAssetDependenciesTab.isExpanded, "    Asset Dependencies", "HelpBox");
            EditorGUI.Foldout(m_controlRect, m_showAssetDependenciesTab.isExpanded, "");
            if (m_showAssetDependenciesTab.isExpanded)
            {
                EditorGUILayout.PropertyField(m_skyMaterial);
                EditorGUILayout.PropertyField(m_fogMaterial);
                EditorGUILayout.PropertyField(m_sunTexture);
                EditorGUILayout.PropertyField(m_moonTexture);
                EditorGUILayout.PropertyField(m_starfieldTexture);
                EditorGUILayout.PropertyField(m_dynamicCloudTexture);
                EditorGUILayout.PropertyField(m_staticCloudTexture);
                EditorGUILayout.PropertyField(m_emptySkyShader);
                EditorGUILayout.PropertyField(m_dynamicCloudShader);
                EditorGUILayout.PropertyField(m_staticCloudShader);
                EditorGUILayout.Space();
            }
            EditorGUILayout.EndFoldoutHeaderGroup();


            // Begin the transform references tab
            m_controlRect = EditorGUILayout.GetControlRect();
            m_controlRect.width -= 4f;
            m_showTransformReferencesTab.isExpanded = EditorGUI.BeginFoldoutHeaderGroup(m_controlRect, m_showTransformReferencesTab.isExpanded, "    Transform References", "HelpBox");
            EditorGUI.Foldout(m_controlRect, m_showTransformReferencesTab.isExpanded, "");
            if (m_showTransformReferencesTab.isExpanded)
            {
                EditorGUILayout.PropertyField(m_sunTransform);
                EditorGUILayout.PropertyField(m_moonTransform);
                EditorGUILayout.Space();
            }
            EditorGUILayout.EndFoldoutHeaderGroup();


            // Begin the scattering tab
            m_controlRect = EditorGUILayout.GetControlRect();
            m_controlRect.width -= 4f;
            m_showScatteringTab.isExpanded = EditorGUI.BeginFoldoutHeaderGroup(m_controlRect, m_showScatteringTab.isExpanded, "    Scattering", "HelpBox");
            EditorGUI.Foldout(m_controlRect, m_showScatteringTab.isExpanded, "");
            if (m_showScatteringTab.isExpanded)
            {
                EditorGUILayout.PropertyField(m_wavelength);
                EditorGUILayout.PropertyField(m_molecularDensity);
                EditorGUILayout.PropertyField(m_skyScale);
                EditorGUILayout.PropertyField(m_kr);
                EditorGUILayout.PropertyField(m_km);
                EditorGUILayout.PropertyField(m_rayleigh);
                EditorGUILayout.PropertyField(m_mie);
                EditorGUILayout.PropertyField(m_mieDirectionalityFactor);
                EditorGUILayout.PropertyField(m_scattering);
                EditorGUILayout.PropertyField(m_luminance);
                EditorGUILayout.PropertyField(m_exposure);
                EditorGUILayout.PropertyField(m_rayleighColor);
                EditorGUILayout.PropertyField(m_mieColor);
                EditorGUILayout.PropertyField(m_scatteringColor);
                EditorGUILayout.Space();
            }
            EditorGUILayout.EndFoldoutHeaderGroup();


            // Begin the outter space tab
            m_controlRect = EditorGUILayout.GetControlRect();
            m_controlRect.width -= 4f;
            m_showOutterSpaceTab.isExpanded = EditorGUI.BeginFoldoutHeaderGroup(m_controlRect, m_showOutterSpaceTab.isExpanded, "    Outter Space", "HelpBox");
            EditorGUI.Foldout(m_controlRect, m_showOutterSpaceTab.isExpanded, "");
            if (m_showOutterSpaceTab.isExpanded)
            {
                EditorGUILayout.PropertyField(m_sunTextureSize);
                EditorGUILayout.PropertyField(m_sunTextureIntensity);
                EditorGUILayout.PropertyField(m_sunTextureColor);
                EditorGUILayout.PropertyField(m_moonTextureSize);
                EditorGUILayout.PropertyField(m_moonTextureIntensity);
                EditorGUILayout.PropertyField(m_moonTextureColor);
                EditorGUILayout.PropertyField(m_starsIntensity);
                EditorGUILayout.PropertyField(m_milkyWayIntensity);
                EditorGUILayout.PropertyField(m_starfieldColor);
                EditorGUILayout.PropertyField(m_starfieldRotationPos);
                EditorGUILayout.Space();
            }
            EditorGUILayout.EndFoldoutHeaderGroup();


            // Begin the fog scattering tab
            m_controlRect = EditorGUILayout.GetControlRect();
            m_controlRect.width -= 4f;
            m_showFogScatteringTab.isExpanded = EditorGUI.BeginFoldoutHeaderGroup(m_controlRect, m_showFogScatteringTab.isExpanded, "    Fog Scattering", "HelpBox");
            EditorGUI.Foldout(m_controlRect, m_showFogScatteringTab.isExpanded, "");
            if (m_showFogScatteringTab.isExpanded)
            {
                EditorGUILayout.PropertyField(m_mieDistance);
                EditorGUILayout.PropertyField(m_globalFogDistance);
                EditorGUILayout.PropertyField(m_globalFogSmoothStep);
                EditorGUILayout.PropertyField(m_globalFogDensity);
                EditorGUILayout.PropertyField(m_heightFogDistance);
                EditorGUILayout.PropertyField(m_heightFogSmoothStep);
                EditorGUILayout.PropertyField(m_heightFogDensity);
                EditorGUILayout.PropertyField(m_heightFogStart);
                EditorGUILayout.PropertyField(m_heightFogEnd);
                EditorGUILayout.Space();
            }
            EditorGUILayout.EndFoldoutHeaderGroup();


            // Begin the dynamic cloud tab
            m_controlRect = EditorGUILayout.GetControlRect();
            m_controlRect.width -= 4f;
            m_showDynamicCloudTab.isExpanded = EditorGUI.BeginFoldoutHeaderGroup(m_controlRect, m_showDynamicCloudTab.isExpanded, "    Dynamic Cloud", "HelpBox");
            EditorGUI.Foldout(m_controlRect, m_showDynamicCloudTab.isExpanded, "");
            if (m_showDynamicCloudTab.isExpanded)
            {
                EditorGUILayout.PropertyField(m_dynamicCloudAltitude);
                EditorGUILayout.PropertyField(m_dynamicCloudDirection);
                EditorGUILayout.PropertyField(m_dynamicCloudSpeed);
                EditorGUILayout.PropertyField(m_dynamicCloudDensity);
                EditorGUILayout.PropertyField(m_dynamicCloudColor1);
                EditorGUILayout.PropertyField(m_dynamicCloudColor2);
                EditorGUILayout.Space();
            }
            EditorGUILayout.EndFoldoutHeaderGroup();


            // Begin the static cloud tab
            m_controlRect = EditorGUILayout.GetControlRect();
            m_controlRect.width -= 4f;
            m_showStaticCloudTab.isExpanded = EditorGUI.BeginFoldoutHeaderGroup(m_controlRect, m_showStaticCloudTab.isExpanded, "    Static Cloud", "HelpBox");
            EditorGUI.Foldout(m_controlRect, m_showStaticCloudTab.isExpanded, "");
            if (m_showStaticCloudTab.isExpanded)
            {
                EditorGUILayout.PropertyField(m_staticCloudLayer1Speed);
                EditorGUILayout.PropertyField(m_staticCloudLayer2Speed);
                EditorGUILayout.PropertyField(m_staticCloudScattering);
                EditorGUILayout.PropertyField(m_staticCloudExtinction);
                EditorGUILayout.PropertyField(m_staticCloudSaturation);
                EditorGUILayout.PropertyField(m_staticCloudOpacity);
                EditorGUILayout.PropertyField(m_staticCloudColor);
                EditorGUILayout.Space();
            }
            EditorGUILayout.EndFoldoutHeaderGroup();


            // Begin the options tab
            m_controlRect = EditorGUILayout.GetControlRect();
            m_controlRect.width -= 4f;
            m_showOptionsTab.isExpanded = EditorGUI.BeginFoldoutHeaderGroup(m_controlRect, m_showOptionsTab.isExpanded, "    Options", "HelpBox");
            EditorGUI.Foldout(m_controlRect, m_showOptionsTab.isExpanded, "");
            if (m_showOptionsTab.isExpanded)
            {
                EditorGUILayout.PropertyField(m_sunsetColorMode);
                EditorGUILayout.PropertyField(m_cloudMode);
                EditorGUILayout.PropertyField(m_skyboxRenderMode);
                EditorGUILayout.PropertyField(m_updateMode);
                EditorGUILayout.Space();
            }
            EditorGUILayout.EndFoldoutHeaderGroup();


            // Update the inspector when there is a change
            if (EditorGUI.EndChangeCheck())
            {
                serializedObject.ApplyModifiedProperties();
                UpdateSkyShader();
                UpdateSkyboxRenderMode();
                m_target.UpdateTextureUniforms();
                m_target.UpdateShaderUniforms();
            }
        }


        private void UpdateSkyShader()
        {
            switch (m_target.CloudMode)
            {
                case SkyboxCloudMode.Off:
                    if (m_target.SkyMaterial.shader != m_target.EmptySkyShader)
                    {
                        m_target.SkyMaterial.shader = m_target.EmptySkyShader;
                    }
                    break;
                case SkyboxCloudMode.Dynamic:
                    if (m_target.SkyMaterial.shader != m_target.DynamicCloudShader)
                    {
                        m_target.SkyMaterial.shader = m_target.DynamicCloudShader;
                    }
                    break;
                case SkyboxCloudMode.Static:
                    if (m_target.SkyMaterial.shader != m_target.StaticCloudShader)
                    {
                        m_target.SkyMaterial.shader = m_target.StaticCloudShader;
                    }
                    break;
            }
        }


        private void UpdateSkyboxRenderMode()
        {
            switch (m_target.SkyboxRenderMode)
            {
                case SkyboxRenderMode.Enabled:
                    RenderSettings.skybox = m_target.SkyMaterial;
                    break;
                case SkyboxRenderMode.Disabled:
                    if (RenderSettings.skybox == m_target.SkyMaterial)
                    {
                        RenderSettings.skybox = null;
                    }
                    break;
            }
        }
    }
}