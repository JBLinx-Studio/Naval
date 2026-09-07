using System;
using System.Collections.Generic;


// Editor only
#if UNITY_EDITOR
using UnityEditor;
#endif


namespace UnityEngine.AzureSky
{
    [ExecuteInEditMode]
    [AddComponentMenu("Azure[Sky] Dynamic Skybox/Azure Weather Controller")]
    public sealed class AzureWeatherController : MonoBehaviour
    {
        #if UNITY_EDITOR
        [SerializeField] private bool m_showOptionsTab;
        [SerializeField] private Transform m_globalWeathersParent;
        [SerializeField] private Transform m_weatherZonesParent;
        #endif


        /// <summary>
        /// Field: The parameter used to evaluate the curves and gradients.
        /// </summary>
        [SerializeField] private float m_evaluationTime = 6.5f;


        /// <summary>
        /// Field: The way all the weather stuffs should be updated.
        /// </summary>
        [SerializeField] private AzureUpdateMode m_updateMode = AzureUpdateMode.LocallyEveryFrame;

        /// <summary>
        /// Property: The way all the weather stuffs should be updated.
        /// </summary>
        public AzureUpdateMode UpdateMode { get => m_updateMode; set => m_updateMode = value; }


        /// <summary>
        /// Field: The trigger used to detect if it is entering a local weather zone.
        /// </summary>
        [SerializeField] private Transform m_weatherZoneTrigger;

        /// <summary>
        /// Property: The trigger used to detect if it is entering a local weather zone.
        /// </summary>
        public Transform WeatherZoneTrigger { get => m_weatherZoneTrigger; set => m_weatherZoneTrigger = value; }


        /// <summary>
        /// Field: The material used to blit the custom texture properties while a weather transition.
        /// </summary>
        [SerializeField] private Material m_weatherTextureBlitMaterial;

        /// <summary>
        /// Property: The material used to blit the custom texture properties while a weather transition.
        /// </summary>
        public Material BlitMaterial { get => m_weatherTextureBlitMaterial; set => m_weatherTextureBlitMaterial = value; }


        /// <summary>
        /// Field: List of global weather presets. Call 'SetNewWeather(int index)' to change the global weather by scripting.
        /// </summary>
        [SerializeField] private List<AzureGlobalWeather> m_globalWeatherList = new List<AzureGlobalWeather>();

        /// <summary>
        /// Property: List of global weather presets. Call 'SetNewWeather(int index)' to change the global weather by scripting.
        /// </summary>
        public List<AzureGlobalWeather> GlobalWeatherList => m_globalWeatherList;
        
        
        /// <summary>
        /// Field: List of local weather zones. Place here all the local weather zones and arrange according to its priorities.
        /// </summary>
        [SerializeField] private List<AzureWeatherZone> m_weatherZoneList = new List<AzureWeatherZone>();

        /// <summary>
        /// Property: List of local weather zones. Place here all the local weather zones and arrange according to its priorities.
        /// </summary>
        public List<AzureWeatherZone> WeatherZoneList => m_weatherZoneList;


        /// <summary>
        /// Field: The list storing all the custom property setups.
        /// </summary>
        [SerializeField] private List<AzurePropertySetup> m_propertySetupList = new List<AzurePropertySetup>();

        /// <summary>
        /// Property: The list storing all the custom properties.
        /// </summary>
        public List<AzurePropertySetup> PropertySetupList => m_propertySetupList;


        /// <summary>
        /// Field: Stores the custom property outputs in a list.
        /// </summary>
        [SerializeField] private List<AzurePropertyOutput> m_propertyOutputList = new List<AzurePropertyOutput>();

        /// <summary>
        /// Property: Stores the custom property outputs in a list.
        /// </summary>
        public List<AzurePropertyOutput> PropertyOutputList { get => m_propertyOutputList; set => m_propertyOutputList = value; }


        /// <summary>
        /// Field: Stores the current weather preset in use by the climate system.
        /// </summary>
        private AzureWeatherPreset m_currentWeatherPreset;

        /// <summary>
        /// Field: Stores the current weather preset in use by the climate system.
        /// </summary>
        public AzureWeatherPreset CurrentWeatherPreset => m_currentWeatherPreset;


        /// <summary>
        /// Field: Stores the target weather preset when runing a global weather transition.
        /// </summary>
        private AzureWeatherPreset m_targetWeatherPreset;

        /// <summary>
        /// Field: Stores the target weather preset when runing a global weather transition.
        /// </summary>
        public AzureWeatherPreset TargetWeatherPreset => m_targetWeatherPreset;


        /// <summary>
        /// Field: Is a global weather transition in progress?
        /// </summary>
        private bool m_isWeatherChanging = false;

        /// <summary>
        /// Property: Is a global weather transition in progress?
        /// </summary>
        public bool IsWeatherChanging => m_isWeatherChanging;


        /// <summary>
        /// Field: Stores the global weather transition progress.
        /// </summary>
        [SerializeField] private float m_weatherTransitionProgress = 0.0f;

        /// <summary>
        /// Property: Stores the global weather transition progress.
        /// </summary>
        public float WeatherTransitionProgress => m_weatherTransitionProgress;


        /// <summary>
        /// Field: Stores the current global weather index in use.
        /// </summary>
        private int m_globalWeatherIndex = 0;

        /// <summary>
        /// Property: Stores the current global weather index in use.
        /// </summary>
        public int GlobalWeatherIndex => m_globalWeatherIndex;


        /// <summary>
        /// Field: Used internally to perform a global weather transition.
        /// </summary>
        private float m_weatherTransitionStart = 0.0f;


        /// <summary>
        /// Field: Used internally to perform a global weather transition.
        /// </summary>
        private float m_weatherTransitionLength = 0.0f;


        /// <summary>
        /// Field: Used internally to perform a local weather zone transition.
        /// </summary>
        private Vector3 m_weatherZoneTriggerPosition = Vector3.zero;


        /// <summary>
        /// Field: Used internally to perform a local weather zone transition.
        /// </summary>
        private Collider m_weatherZoneCollider;


        /// <summary>
        /// Field: Used internally to perform a local weather zone transition.
        /// </summary>
        private float m_weatherZoneClosestDistanceSqr = 0.0f;


        /// <summary>
        /// Field: Used internally to perform a local weather zone transition.
        /// </summary>
        private Vector3 m_weatherZoneClosestPoint = Vector3.zero;


        /// <summary>
        /// Field: Used internally to perform a local weather zone transition.
        /// </summary>
        private float m_weatherZoneDistance = 0.0f;


        /// <summary>
        /// Field: Used internally to perform a local weather zone transition.
        /// </summary>
        private float m_weatherZoneBlendDistanceSqr = 0.0f;


        /// <summary>
        /// Field: Used internally to perform a local weather zone transition.
        /// </summary>
        private float m_weatherZoneInterpolationFactor = 0.0f;


        /// <summary>
        /// Field: Used internally to perform the vector3 weather transitions.
        /// </summary>
        private Vector3 m_vector3Angle;


        /// <summary>
        /// Awake is called when the instance of the script is loaded.
        /// </summary>
        private void Awake()
        {
            // Update PropertyInfos and FieldInfos targets
            RefreshCustomPropertyTargets();


            // Get the first weather preset from the global weather list to be used as default weather preset
            if (m_globalWeatherList.Count > 0)
            {
                m_currentWeatherPreset = m_globalWeatherList[0].preset;
            }


            // First update of the weather system
            if (Application.isPlaying)
            {
                if (m_updateMode == AzureUpdateMode.LocallyEveryFrame)
                {
                    UpdateWeatherSystem();
                }
            }
        }


        #if UNITY_EDITOR
        private void Reset()
        {
            AzureNotificationCenterEditor.Invoke.ResetWeatherSystemCallback(this);
        }
        #endif


        /// <summary>
        /// Update is called every frame if the MonoBehaviour is enabled.
        /// </summary>
        private void Update()
        {
            if (Application.isPlaying)
            {
                if (m_updateMode == AzureUpdateMode.LocallyEveryFrame)
                {
                    UpdateWeatherSystem();
                }
            }


            #if UNITY_EDITOR
            if (!Application.isPlaying)
            {
                m_evaluationTime = AzureNotificationCenter.GlobalTimeInfo.evaluationTime;


                // Get the first weather preset from the global weather list to be used as default weather preset
                if (m_globalWeatherList.Count > 0)
                {
                    m_currentWeatherPreset = m_globalWeatherList[0].preset;
                }


                EvaluateCurrentWeather();
            }
            #endif
        }


        /// <summary>
        /// Call it always you want to update the weather system (custom properies, weather transitions, local weather zones, etc..).
        /// Remember to also set the time of day, sun and elevation if you are using the component alone.
        /// </summary>
        public void UpdateWeatherSystem()
        {
            m_evaluationTime = AzureNotificationCenter.GlobalTimeInfo.evaluationTime;

            if (!m_isWeatherChanging)
            {
                EvaluateCurrentWeather();
            }
            else
            {
                // Performs the global weather transition
                m_weatherTransitionProgress = Mathf.Clamp01((Time.time - m_weatherTransitionStart) / m_weatherTransitionLength);
                EvaluateGlobalWeatherTransition(m_currentWeatherPreset, m_targetWeatherPreset, m_weatherTransitionProgress);


                // Ends the global weather transition
                if (Mathf.Abs(m_weatherTransitionProgress - 1.0f) <= 0.0f)
                {
                    m_isWeatherChanging = false;
                    m_weatherTransitionProgress = 0.0f;
                    m_weatherTransitionStart = 0.0f;
                    m_currentWeatherPreset = m_targetWeatherPreset;
                }
            }


            // Computes weather zones influence
            // Based on Unity's Post Processing v2
            if (!m_weatherZoneTrigger)
                return;


            m_weatherZoneTriggerPosition = m_weatherZoneTrigger.position;


            // Traverse all weather zones in the weather zone list
            foreach (AzureWeatherZone weatherZone in m_weatherZoneList)
            {
                // Skip if the list index is null
                if (weatherZone == null)
                    continue;


                // If weather zone has no collider, skip it as it's useless
                m_weatherZoneCollider = weatherZone.Collider;
                if (!m_weatherZoneCollider)
                    continue;


                // Skip if the collider or the game object is disabled
                if (!m_weatherZoneCollider.enabled || !m_weatherZoneCollider.gameObject.activeInHierarchy)
                    continue;


                // Find closest distance to weather zone, 0 means it's inside it
                m_weatherZoneClosestDistanceSqr = float.PositiveInfinity;
                m_weatherZoneClosestPoint = m_weatherZoneCollider.ClosestPoint(m_weatherZoneTriggerPosition); // 5.6-only API
                m_weatherZoneDistance = ((m_weatherZoneClosestPoint - m_weatherZoneTriggerPosition) / 2f).sqrMagnitude;

                if (m_weatherZoneDistance < m_weatherZoneClosestDistanceSqr)
                    m_weatherZoneClosestDistanceSqr = m_weatherZoneDistance;

                m_weatherZoneCollider = null;
                m_weatherZoneBlendDistanceSqr = weatherZone.BlendDistance * weatherZone.BlendDistance;


                // Weather zone has no influence, ignore it
                // Note: Weather zone doesn't do anything when `closestDistanceSqr = blendDistSqr` but
                // we can't use a >= comparison as blendDistSqr could be set to 0 in which
                // case weather zone would have total influence
                if (m_weatherZoneClosestDistanceSqr > m_weatherZoneBlendDistanceSqr)
                    continue;


                // Weather zone has influence
                m_weatherZoneInterpolationFactor = 1f;
                if (m_weatherZoneBlendDistanceSqr > 0f)
                    m_weatherZoneInterpolationFactor = 1f - (m_weatherZoneClosestDistanceSqr / m_weatherZoneBlendDistanceSqr);

                // No need to clamp01 the interpolation factor as it'll always be in [0;1[ range
                EvaluateWeatherZonesInfluence(weatherZone.WeatherPreset, m_weatherZoneInterpolationFactor);
            }
        }


        /// <summary>
        /// Register the events when the GameObject is enabled.
        /// </summary>
        private void OnEnable()
        {
            #if UNITY_EDITOR
            AzureNotificationCenterEditor.OnAddGlobalWeather += OnAddGlobalWeather;
            AzureNotificationCenterEditor.OnAddWeatherZone += OnAddWeatherZone;
            AzureNotificationCenterEditor.OnRemoveGlobalWeather += OnRemoveGlobalWeather;
            AzureNotificationCenterEditor.OnRemoveWeatherZone += OnRemoveWeatherZone;
            AzureNotificationCenterEditor.OnReorderGlobalWeatherList += OnReorderGlobalWeatherList;
            AzureNotificationCenterEditor.OnReorderWeatherZoneList += OnReorderWeatherZoneList;
            AzureNotificationCenterEditor.OnResetWeatherSystem += OnResetWeatherSystem;
            AzureNotificationCenterEditor.OnDestroyWeatherPreset += OnDestroyWeatherPreset;
            AzureNotificationCenterEditor.OnDestroyWeatherZone += OnDestroyWeatherZone;
            #endif
        }


        /// <summary>
        /// Register the events when the GameObject is disable.
        /// </summary>
        private void OnDisable()
        {
            #if UNITY_EDITOR
            AzureNotificationCenterEditor.OnAddGlobalWeather -= OnAddGlobalWeather;
            AzureNotificationCenterEditor.OnAddWeatherZone -= OnAddWeatherZone;
            AzureNotificationCenterEditor.OnRemoveGlobalWeather -= OnRemoveGlobalWeather;
            AzureNotificationCenterEditor.OnRemoveWeatherZone -= OnRemoveWeatherZone;
            AzureNotificationCenterEditor.OnReorderGlobalWeatherList -= OnReorderGlobalWeatherList;
            AzureNotificationCenterEditor.OnReorderWeatherZoneList -= OnReorderWeatherZoneList;
            AzureNotificationCenterEditor.OnResetWeatherSystem -= OnResetWeatherSystem;
            AzureNotificationCenterEditor.OnDestroyWeatherPreset -= OnDestroyWeatherPreset;
            AzureNotificationCenterEditor.OnDestroyWeatherZone -= OnDestroyWeatherZone;
            #endif
        }


        /// <summary>
        /// Starts a global weather transition using the preset from the global weather list. It changes the weather index to the selected one.
        /// </summary>
        public void SetNewWeather(int index)
        {
            index = Mathf.Clamp(index, 0, m_globalWeatherList.Count);
            if (m_globalWeatherList[index].preset == null) return;
            

            m_targetWeatherPreset = m_globalWeatherList[index].preset;
            m_weatherTransitionLength = m_globalWeatherList[index].transition;
            m_weatherTransitionProgress = 0.0f;
            m_weatherTransitionStart = Time.time;
            m_globalWeatherIndex = index;
            m_isWeatherChanging = true;
        }


        /// <summary>
        /// Changes the current weather with a transition.
        /// It keepes the current weather index.
        /// </summary>
        public void SetCurrentWeather(AzureWeatherPreset preset, float transitionTime)
        {
            m_targetWeatherPreset = preset;
            m_weatherTransitionLength = transitionTime;
            m_weatherTransitionProgress = 0.0f;
            m_weatherTransitionStart = Time.time;
            m_isWeatherChanging = true;
        }


        /// <summary>
        /// Changes the current weather without a transition.
        /// It keepes the current weather index.
        /// </summary>
        public void SetCurrentWeather(AzureWeatherPreset preset)
        {
            m_currentWeatherPreset = preset;
        }


        /// <summary>
        /// Evaluate the weather according to the current weather preset in use.
        /// </summary>
        private void EvaluateCurrentWeather()
        {
            if (m_currentWeatherPreset == null) return;

            //if (m_propertySetupList.Count != m_propertyOutputList.Count) Debug.Log("The setup list Is Diferrent than the output list!!!");

            for (int i = 0; i < m_propertySetupList.Count; i++)
            {
                switch (m_propertySetupList[i].PropertyType)
                {
                    case CustomPropertyType.Float:

                        m_propertyOutputList[i].FloatOutput = m_currentWeatherPreset.PropertyDataList[i].FloatData;
                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalFloat(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetFloat(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].FloatOutput);
                                break;
                        }
                        break;


                    case CustomPropertyType.Color:

                        m_propertyOutputList[i].ColorOutput = m_currentWeatherPreset.PropertyDataList[i].ColorData;
                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalColor(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetColor(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].ColorOutput);
                                break;
                        }
                        break;


                    case CustomPropertyType.Curve:

                        m_propertyOutputList[i].FloatOutput = m_currentWeatherPreset.PropertyDataList[i].CurveData.Evaluate(m_evaluationTime);
                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalFloat(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetFloat(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].FloatOutput);
                                break;
                        }
                        break;


                    case CustomPropertyType.Gradient:

                        m_propertyOutputList[i].ColorOutput = m_currentWeatherPreset.PropertyDataList[i].GradientData.Evaluate(m_evaluationTime / 24f);
                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalColor(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetColor(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].ColorOutput);
                                break;
                        }
                        break;


                    case CustomPropertyType.Texture:
                        m_propertyOutputList[i].TextureOutput = m_currentWeatherPreset.PropertyDataList[i].TextureData;
                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].TextureOutput);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].TextureOutput);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalTexture(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].TextureOutput);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetTexture(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].TextureOutput);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].TextureOutput);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].TextureOutput);
                                break;
                        }
                        break;


                    case CustomPropertyType.Vector3:
                        m_propertyOutputList[i].Vector3Output = m_currentWeatherPreset.PropertyDataList[i].Vector3Data;
                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].Vector3Output);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].Vector3Output);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalVector(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].Vector3Output);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetVector(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].Vector3Output);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].Vector3Output);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].Vector3Output);
                                break;
                        }
                        break;
                }
            }
        }


        /// <summary>
        /// Performs a global weather transition.
        /// </summary>
        private void EvaluateGlobalWeatherTransition(AzureWeatherPreset from, AzureWeatherPreset to, float t)
        {
            if (from == null || to == null) return;

            for (int i = 0; i < m_propertySetupList.Count; i++)
            {
                switch (m_propertySetupList[i].PropertyType)
                {
                    case CustomPropertyType.Float:

                        m_propertyOutputList[i].FloatOutput = FloatInterpolation(from.PropertyDataList[i].FloatData, to.PropertyDataList[i].FloatData, t);
                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalFloat(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetFloat(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].FloatOutput);
                                break;
                        }
                        break;


                    case CustomPropertyType.Color:

                        m_propertyOutputList[i].ColorOutput = ColorInterpolation(from.PropertyDataList[i].ColorData, to.PropertyDataList[i].ColorData, t);
                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalColor(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetColor(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].ColorOutput);
                                break;
                        }
                        break;


                    case CustomPropertyType.Curve:

                        m_propertyOutputList[i].FloatOutput = FloatInterpolation(from.PropertyDataList[i].CurveData.Evaluate(m_evaluationTime), to.PropertyDataList[i].CurveData.Evaluate(m_evaluationTime), t);
                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalFloat(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetFloat(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].FloatOutput);
                                break;
                        }
                        break;


                    case CustomPropertyType.Gradient:

                        m_propertyOutputList[i].ColorOutput = ColorInterpolation(from.PropertyDataList[i].GradientData.Evaluate(m_evaluationTime / 24f), to.PropertyDataList[i].GradientData.Evaluate(m_evaluationTime / 24f), t);
                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalColor(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetColor(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].ColorOutput);
                                break;
                        }
                        break;


                    case CustomPropertyType.Texture:
                        m_weatherTextureBlitMaterial.SetTexture("_FromTex", from.PropertyDataList[i].TextureData);
                        m_weatherTextureBlitMaterial.SetTexture("_ToTex", to.PropertyDataList[i].TextureData);
                        m_weatherTextureBlitMaterial.SetFloat("_Interpolator", m_weatherTransitionProgress);
                        Graphics.Blit(null, m_propertySetupList[i].GlobalWeatherTexture, m_weatherTextureBlitMaterial);
                        m_propertyOutputList[i].TextureOutput = m_propertySetupList[i].GlobalWeatherTexture;
                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].TextureOutput);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].TextureOutput);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalTexture(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].TextureOutput);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetTexture(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].TextureOutput);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].TextureOutput);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].TextureOutput);
                                break;
                        }
                        break;


                    case CustomPropertyType.Vector3:
                        if (m_propertySetupList[i].VectorInterpolationMode == VectorInterpolationMode.Position)
                        {
                            m_propertyOutputList[i].Vector3Output = Vector3.Lerp(from.PropertyDataList[i].Vector3Data, to.PropertyDataList[i].Vector3Data, t);
                        }
                        else
                        {
                            m_vector3Angle.x = Mathf.LerpAngle(from.PropertyDataList[i].Vector3Data.x, to.PropertyDataList[i].Vector3Data.x, t);
                            m_vector3Angle.y = Mathf.LerpAngle(from.PropertyDataList[i].Vector3Data.y, to.PropertyDataList[i].Vector3Data.y, t);
                            m_vector3Angle.z = Mathf.LerpAngle(from.PropertyDataList[i].Vector3Data.z, to.PropertyDataList[i].Vector3Data.z, t);
                            m_propertyOutputList[i].Vector3Output = m_vector3Angle;
                        }

                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].Vector3Output);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].Vector3Output);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalVector(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].Vector3Output);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetVector(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].Vector3Output);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].Vector3Output);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].Vector3Output);
                                break;
                        }
                        break;
                }
            }
        }


        /// <summary>
        /// Computes the local weather zones influence.
        /// </summary>
        private void EvaluateWeatherZonesInfluence(AzureWeatherPreset preset, float t)
        {
            if (preset == null) return;

            for (int i = 0; i < m_propertySetupList.Count; i++)
            {
                switch (m_propertySetupList[i].PropertyType)
                {
                    case CustomPropertyType.Float:

                        m_propertyOutputList[i].FloatOutput = FloatInterpolation(m_propertyOutputList[i].FloatOutput, preset.PropertyDataList[i].FloatData, t);
                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalFloat(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetFloat(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].FloatOutput);
                                break;
                        }
                        break;


                    case CustomPropertyType.Color:

                        m_propertyOutputList[i].ColorOutput = ColorInterpolation(m_propertyOutputList[i].ColorOutput, preset.PropertyDataList[i].ColorData, t);
                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalColor(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetColor(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].ColorOutput);
                                break;
                        }
                        break;


                    case CustomPropertyType.Curve:

                        m_propertyOutputList[i].FloatOutput = FloatInterpolation(m_propertyOutputList[i].FloatOutput, preset.PropertyDataList[i].CurveData.Evaluate(m_evaluationTime), t);
                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalFloat(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetFloat(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].FloatOutput);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].FloatOutput);
                                break;
                        }
                        break;


                    case CustomPropertyType.Gradient:

                        m_propertyOutputList[i].ColorOutput = ColorInterpolation(m_propertyOutputList[i].ColorOutput, preset.PropertyDataList[i].GradientData.Evaluate(m_evaluationTime / 24f), t);
                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalColor(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetColor(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].ColorOutput);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].ColorOutput);
                                break;
                        }
                        break;


                    case CustomPropertyType.Texture:
                        m_weatherTextureBlitMaterial.SetTexture("_FromTex", m_propertyOutputList[i].TextureOutput);
                        m_weatherTextureBlitMaterial.SetTexture("_ToTex", preset.PropertyDataList[i].TextureData);
                        m_weatherTextureBlitMaterial.SetFloat("_Interpolator", t);
                        Graphics.Blit(null, m_propertySetupList[i].LocalWeatherTexture, m_weatherTextureBlitMaterial);
                        m_propertyOutputList[i].TextureOutput = m_propertySetupList[i].LocalWeatherTexture;
                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].TextureOutput);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].TextureOutput);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalTexture(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].TextureOutput);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetTexture(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].TextureOutput);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].TextureOutput);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].TextureOutput);
                                break;
                        }
                        break;


                    case CustomPropertyType.Vector3:
                        if (m_propertySetupList[i].VectorInterpolationMode == VectorInterpolationMode.Position)
                        {
                            m_propertyOutputList[i].Vector3Output = Vector3.Lerp(m_propertyOutputList[i].Vector3Output, preset.PropertyDataList[i].Vector3Data, t);
                        }
                        else
                        {
                            m_vector3Angle.x = Mathf.LerpAngle(m_propertyOutputList[i].Vector3Output.x, preset.PropertyDataList[i].Vector3Data.x, t);
                            m_vector3Angle.y = Mathf.LerpAngle(m_propertyOutputList[i].Vector3Output.y, preset.PropertyDataList[i].Vector3Data.y, t);
                            m_vector3Angle.z = Mathf.LerpAngle(m_propertyOutputList[i].Vector3Output.z, preset.PropertyDataList[i].Vector3Data.z, t);
                            m_propertyOutputList[i].Vector3Output = m_vector3Angle;
                        }

                        if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.Off) continue;

                        switch (m_propertySetupList[i].TargetType)
                        {
                            case TargetOverrideType.Property:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].Vector3Output);
                                break;

                            case TargetOverrideType.Field:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetComponent, m_propertyOutputList[i].Vector3Output);
                                break;

                            case TargetOverrideType.GlobalShaderUniform:
                                Shader.SetGlobalVector(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].Vector3Output);
                                break;

                            case TargetOverrideType.MaterialProperty:
                                if (m_propertySetupList[i].TargetMaterial == null) continue;
                                m_propertySetupList[i].TargetMaterial.SetVector(m_propertySetupList[i].TargetPropertyName, m_propertyOutputList[i].Vector3Output);
                                break;

                            case TargetOverrideType.GlobalProperty:
                                m_propertySetupList[i].PropertyInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].Vector3Output);
                                break;

                            case TargetOverrideType.GlobalField:
                                m_propertySetupList[i].FieldInfo?.SetValue(m_propertySetupList[i].TargetGlobalType, m_propertyOutputList[i].Vector3Output);
                                break;
                        }
                        break;
                }
            }
        }


        /// <summary>
        /// Returns the float output of a given custom property index.
        /// </summary>
        public float GetCustomFloatOutput(int index)
        {
            return m_propertyOutputList[index].FloatOutput;
        }


        /// <summary>
        /// Returns the color output of a given custom property index.
        /// </summary>
        public Color GetCustomColorOutput(int index)
        {
            return m_propertyOutputList[index].ColorOutput;
        }


        /// <summary>
        /// Returns the texture output of a given custom property index.
        /// </summary>
        public Texture GetCustomTextureOutput(int index)
        {
            return m_propertyOutputList[index].TextureOutput;
        }


        /// <summary>
        /// Returns the vector3 output of a given custom property index.
        /// </summary>
        public Vector3 GetCustomVector3Output(int index)
        {
            return m_propertyOutputList[index].Vector3Output;
        }


        /// <summary>
        /// Interpolates between two values given an interpolation factor.
        /// </summary>
        private float FloatInterpolation(float from, float to, float t)
        {
            return from + (to - from) * t;
        }


        /// <summary>
        /// Interpolates between two colors given an interpolation factor.
        /// </summary>
        private Color ColorInterpolation(Color from, Color to, float t)
        {
            Color ret;
            ret.r = from.r + (to.r - from.r) * t;
            ret.g = from.g + (to.g - from.g) * t;
            ret.b = from.b + (to.b - from.b) * t;
            ret.a = from.a + (to.a - from.a) * t;
            return ret;
        }


        /// <summary>
        /// PropertInfo and FieldInfo are not serializable, so the targets must always be reassigned when the scene starts.
        /// We also took the opportunity to instantiate materials and textures using the same loop.
        /// </summary>
        private void RefreshCustomPropertyTargets()
        {
            // Create an empty output list
            m_propertyOutputList = new List<AzurePropertyOutput>();


            // Create the weather blit material
            m_weatherTextureBlitMaterial = new Material(Shader.Find("Azure Sky System/Weather Texture Blit"));


            for (int i = 0; i < m_propertySetupList.Count; i++)
            {
                // Sync the output list size with the custom property list size
                m_propertyOutputList.Add(new AzurePropertyOutput());


                // Instantiate the blit render textures if the custom property is a texture
                if (m_propertySetupList[i].PropertyType == CustomPropertyType.Texture)
                {
                    m_propertySetupList[i].GlobalWeatherTexture = new RenderTexture(m_propertySetupList[i].TextureWidth, m_propertySetupList[i].TextureHeight, 0, RenderTextureFormat.ARGB32)
                    {
                        name = "GlobalWeather_RT",
                        wrapMode = m_propertySetupList[i].TextureWrapMode,
                        filterMode = m_propertySetupList[i].TextureFilterMode
                    };
                    m_propertySetupList[i].GlobalWeatherTexture.Create();


                    m_propertySetupList[i].LocalWeatherTexture = new RenderTexture(m_propertySetupList[i].TextureWidth, m_propertySetupList[i].TextureHeight, 0, RenderTextureFormat.ARGB32)
                    {
                        name = "LocalWeather_RT",
                        wrapMode = m_propertySetupList[i].TextureWrapMode,
                        filterMode = m_propertySetupList[i].TextureFilterMode
                    };
                    m_propertySetupList[i].LocalWeatherTexture.Create();

                    continue;
                }


                // Get the PropertyInfos and FieldInfos
                if (m_propertySetupList[i].OverrideMode == TargetOverrideMode.On)
                {
                    switch (m_propertySetupList[i].TargetType)
                    {
                        case TargetOverrideType.Property:
                            if (!m_propertySetupList[i].TargetObject) continue;
                            m_propertySetupList[i].TargetComponent = m_propertySetupList[i].TargetObject.GetComponent(m_propertySetupList[i].TargetComponentName);
                            m_propertySetupList[i].PropertyInfo = m_propertySetupList[i].TargetComponent?.GetType().GetProperty(m_propertySetupList[i].TargetPropertyName);
                            break;


                        case TargetOverrideType.Field:
                            if (!m_propertySetupList[i].TargetObject) continue;
                            m_propertySetupList[i].TargetComponent = m_propertySetupList[i].TargetObject.GetComponent(m_propertySetupList[i].TargetComponentName);
                            m_propertySetupList[i].FieldInfo = m_propertySetupList[i].TargetComponent?.GetType().GetField(m_propertySetupList[i].TargetPropertyName);
                            break;


                        case TargetOverrideType.GlobalProperty:
                            m_propertySetupList[i].TargetGlobalType = Type.GetType(m_propertySetupList[i].TargetComponentName);
                            m_propertySetupList[i].PropertyInfo = m_propertySetupList[i].TargetGlobalType?.GetProperty(m_propertySetupList[i].TargetPropertyName);
                            break;


                        case TargetOverrideType.GlobalField:
                            m_propertySetupList[i].TargetGlobalType = Type.GetType(m_propertySetupList[i].TargetComponentName);
                            m_propertySetupList[i].FieldInfo = m_propertySetupList[i].TargetGlobalType?.GetField(m_propertySetupList[i].TargetPropertyName);
                            break;
                    }
                }
            }
        }


        #if UNITY_EDITOR
        /// <summary>
        /// Editor Only: Instantiate a new weather preset when the user creates a new global weather.
        /// </summary>
        private void OnAddGlobalWeather(AzureWeatherController weatherController)
        {
            // If the sender weather system is this component
            if (weatherController == this)
            {
                if (m_globalWeathersParent)
                {
                    // Create a new game object
                    GameObject globalWeatherObject = new GameObject();


                    // Set an unique name to the new game object
                    Transform t;
                    string newName = "NewWeather";
                    int count = 1;

                    for (int i = 0; i < m_globalWeathersParent.childCount; i++)
                    {
                        t = m_globalWeathersParent.GetChild(i).transform;

                        if (t.name == newName)
                        {
                            newName = "NewWeather" + " (" + count + ")";
                            count++;
                        }
                    }

                    globalWeatherObject.name = newName;


                    // Set the game object to the weather presets parent
                    globalWeatherObject.transform.SetParent(m_globalWeathersParent);


                    // Add the components to the game object
                    AzureWeatherPreset weatherPresetComponent = globalWeatherObject.AddComponent<AzureWeatherPreset>();
                    weatherPresetComponent.WeatherController = this;


                    // Add the weather preset to the global weather list
                    int index = Mathf.Max(0, m_globalWeatherList.Count - 1);
                    m_globalWeatherList[index].preset = weatherPresetComponent;
                    m_globalWeatherList[index].transition = 10f;


                    Undo.RegisterCreatedObjectUndo(globalWeatherObject, "Create Global Weather");
                    EditorGUIUtility.PingObject(globalWeatherObject);
                }
            }
        }
        #endif


        #if UNITY_EDITOR
        /// <summary>
        /// Editor Only: Instantiate a new weather zone when the user creates a new weather zone.
        /// </summary>
        private void OnAddWeatherZone(AzureWeatherController weatherController)
        {
            // If the sender weather system is this component
            if (weatherController == this)
            {
                if (m_weatherZonesParent)
                {
                    // Create a new weather zone game object
                    GameObject weatherZoneObject = new GameObject();
                    

                    // Set an unique name to the new game object
                    Transform t;
                    string newName = "NewWeatherZone";
                    int count = 1;

                    for (int i = 0; i < m_weatherZonesParent.childCount; i++)
                    {
                        t = m_weatherZonesParent.GetChild(i).transform;

                        if (t.name == newName)
                        {
                            newName = "NewWeatherZone" + " (" + count + ")";
                            count++;
                        }
                    }

                    weatherZoneObject.name = newName;


                    // Set the game object to the weather presets parent
                    weatherZoneObject.transform.SetParent(m_weatherZonesParent);


                    // Add the components to the game object
                    BoxCollider collider = weatherZoneObject.AddComponent<BoxCollider>();
                    collider.isTrigger = true;
                    AzureWeatherZone weatherZoneComponent = weatherZoneObject.AddComponent<AzureWeatherZone>();
                    weatherZoneComponent.BlendDistance = 0.25f;
                    Undo.RegisterCreatedObjectUndo(weatherZoneObject, "Create Weather Zone");


                    // Add the weather zone to the weather zone list
                    int index = m_weatherZoneList.Count - 1;
                    m_weatherZoneList[index] = weatherZoneComponent;


                    // Create a new weather preset game object
                    GameObject weatherPresetObject = new GameObject();
                    weatherPresetObject.name = "Weather Preset";


                    weatherPresetObject.transform.SetParent(weatherZoneObject.transform);


                    // Add the components to the game object
                    AzureWeatherPreset weatherPresetComponent = weatherPresetObject.AddComponent<AzureWeatherPreset>();
                    weatherPresetComponent.WeatherController = this;
                    Undo.RegisterCreatedObjectUndo(weatherPresetObject, "Create Weather Zone");


                    // Reference the weather preset to the weather zone component
                    weatherZoneComponent.WeatherPreset = weatherPresetComponent;


                    EditorGUIUtility.PingObject(weatherZoneObject);
                }
            }
        }
        #endif


        #if UNITY_EDITOR
        /// <summary>
        /// Editor Only: Delete the game object with the correspondent weather preset attached.
        /// </summary>
        private void OnRemoveGlobalWeather(AzureWeatherController weatherController, int index)
        {
            // If the sender weather system is this component
            if (weatherController == this)
            {
                if (m_globalWeathersParent)
                {
                    Undo.DestroyObjectImmediate(weatherController.GlobalWeatherList[index].preset.gameObject);
                }
            }
        }
        #endif


        #if UNITY_EDITOR
        /// <summary>
        /// Editor Only: Delete the game object with the correspondent weather zone component attached.
        /// </summary>
        private void OnRemoveWeatherZone(AzureWeatherController weatherController, int index)
        {
            // If the sender weather system is this component
            if (weatherController == this)
            {
                if (m_weatherZonesParent)
                {
                    Undo.DestroyObjectImmediate(weatherController.WeatherZoneList[index].gameObject);
                }
            }
        }
        #endif


        #if UNITY_EDITOR
        /// <summary>
        /// Editor Only: Reorder the global weather preset game objects according to the global weather list.
        /// </summary>
        private void OnReorderGlobalWeatherList(AzureWeatherController weatherController, int oldIndex, int newIndex)
        {
            // If the sender weather system is this component
            if (weatherController == this)
            {
                if (m_globalWeathersParent)
                {
                    AzureWeatherPreset weatherPreset = weatherController.GlobalWeatherList[newIndex].preset;
                    for (int i = 0; i < m_globalWeathersParent.childCount; i++)
                    {
                        Transform t = m_globalWeathersParent.GetChild(i);
                        AzureWeatherPreset weather = t.GetComponent<AzureWeatherPreset>();
                        if (weather == weatherPreset)
                        {
                            Undo.RegisterCompleteObjectUndo(m_globalWeathersParent, "Reorder Global Weather List");
                            t.SetSiblingIndex(newIndex);
                            return;
                        }
                    }
                }
            }
        }
        #endif


        #if UNITY_EDITOR
        /// <summary>
        /// Editor Only: Reorder the weather zone game objects according to the local weather zone list.
        /// </summary>
        private void OnReorderWeatherZoneList(AzureWeatherController weatherController, int oldIndex, int newIndex)
        {
            // If the sender weather system is this component
            if (weatherController == this)
            {
                if (m_weatherZonesParent)
                {
                    AzureWeatherZone weatherZone = weatherController.WeatherZoneList[newIndex];
                    for (int i = 0; i < m_weatherZonesParent.childCount; i++)
                    {
                        Transform t = m_weatherZonesParent.GetChild(i);
                        AzureWeatherZone zone = t.GetComponent<AzureWeatherZone>();
                        if (zone == weatherZone)
                        {
                            Undo.RegisterCompleteObjectUndo(m_weatherZonesParent, "Reorder Weather Zone List");
                            t.SetSiblingIndex(newIndex);
                            return;
                        }
                    }
                }
            }
        }
        #endif


        #if UNITY_EDITOR
        /// <summary>
        /// Editor Only: Remove all the global weathers and local weather zones game objects.
        /// </summary>
        private void OnResetWeatherSystem(AzureWeatherController weatherController)
        {
            // If the sender weather system is this component
            if (weatherController == this)
            {
                if (m_globalWeathersParent)
                {
                    int count = m_globalWeathersParent.childCount;
                    for (int i = 0; i < count; i++)
                    {
                        Undo.DestroyObjectImmediate(m_globalWeathersParent.GetChild(0).gameObject);
                    }
                }


                if (m_weatherZonesParent)
                {
                    int count = m_weatherZonesParent.childCount;
                    for (int i = 0; i < count; i++)
                    {
                        Undo.DestroyObjectImmediate(m_weatherZonesParent.GetChild(0).gameObject);
                    }
                }
            }
        }
        #endif


        #if UNITY_EDITOR
        /// <summary>
        /// Remove the item list that have attached a deleted weather preset game object.
        /// </summary>
        private void OnDestroyWeatherPreset(AzureWeatherPreset weatherPreset)
        {
            if (m_globalWeathersParent)
            {
                for (int i = 0; i < m_globalWeatherList.Count; i++)
                {
                    if (m_globalWeatherList[i].preset == weatherPreset)
                    {
                        Undo.RegisterCompleteObjectUndo(this, "Destroy Weather Preset");
                        m_globalWeatherList.RemoveAt(i);
                        return;
                    }
                }
            }
        }
        #endif


        #if UNITY_EDITOR
        /// <summary>
        /// Remove the item list that have attached a deleted weather zone game object.
        /// </summary>
        private void OnDestroyWeatherZone(AzureWeatherZone weatherZone)
        {
            if (m_weatherZonesParent)
            {
                for (int i = 0; i < m_weatherZoneList.Count; i++)
                {
                    if (m_weatherZoneList[i] == weatherZone)
                    {
                        Undo.RegisterCompleteObjectUndo(this, "Destroy Weather Zone");
                        m_weatherZoneList.RemoveAt(i);
                        return;
                    }
                }
            }
        }
        #endif
    }
}