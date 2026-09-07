using System.Collections.Generic;


// Editor only
#if UNITY_EDITOR
using UnityEditor;
#endif


namespace UnityEngine.AzureSky
{
    [ExecuteInEditMode]
    [AddComponentMenu("Azure[Sky] Dynamic Skybox/Azure Weather Preset")]
    public sealed class AzureWeatherPreset : MonoBehaviour
    {
        /// <summary>
        /// Field: The weather system component associated to this preset.
        /// </summary>
        [SerializeField] private AzureWeatherController m_weatherController;

        /// <summary>
        /// Property: The weather system component associated to this preset.
        /// </summary>
        public AzureWeatherController WeatherController { get => m_weatherController; set => m_weatherController = value; }


        /// <summary>
        /// Field: The list storing all the preset properties of this weather preset.
        /// </summary>
        [SerializeField] private List<AzurePropertyData> m_propertyDataList = new List<AzurePropertyData>();

        /// <summary>
        /// Property: The list storing all the preset properties of this weather preset.
        /// </summary>
        public List<AzurePropertyData> PropertyDataList { get => m_propertyDataList; set => m_propertyDataList = value; }


        /// <summary>
        /// Register the events when the GameObject is enabled.
        /// </summary>
        private void OnEnable()
        {
            #if UNITY_EDITOR
            AzureNotificationCenterEditor.OnAddCustomProperty += OnAddCustomProperty;
            AzureNotificationCenterEditor.OnRemoveCustomProperty += OnRemoveCustomProperty;
            AzureNotificationCenterEditor.OnReorderCustomPropertyList += OnReoderCustomPropertiesList;
            #endif
        }


        /// <summary>
        /// Notify when this weather preset is destroyed.
        /// </summary>
        private void OnDestroy()
        {
            #if UNITY_EDITOR
            AzureNotificationCenterEditor.Invoke.DestroyWeatherPresetCallback(this);
            #endif
        }


        /// <summary>
        /// Unregister the events when the GameObject is disabled.
        /// </summary>
        private void OnDisable()
        {
            #if UNITY_EDITOR
            AzureNotificationCenterEditor.OnAddCustomProperty -= OnAddCustomProperty;
            AzureNotificationCenterEditor.OnRemoveCustomProperty -= OnRemoveCustomProperty;
            AzureNotificationCenterEditor.OnReorderCustomPropertyList -= OnReoderCustomPropertiesList;
            #endif
        }


        #if UNITY_EDITOR
        /// <summary>
        /// Reset is called when the user hits the Reset button in the Inspector's context menu or when adding the component the first time.
        /// </summary>
        private void Reset()
        {
            InitializePropertyList();
        }
        #endif


        #if UNITY_EDITOR
        /// <summary>
        /// Add a new element to the custom property list.
        /// </summary>
        private void OnAddCustomProperty(AzureWeatherController weatherController)
        {
            // If the sender climate component is the same component associated to this preset.
            if (weatherController == m_weatherController)
            {
                Undo.RecordObject(this, "Add Custom Property");

                AzurePropertyData newProperty = new AzurePropertyData();
                newProperty.FloatData = 1.0f;
                newProperty.ColorData = Color.white;
                newProperty.GradientData = new Gradient();
                newProperty.CurveData = AnimationCurve.Linear(0.0f, 1.0f, 24.0f, 1.0f);
                newProperty.Vector3Data = Vector3.zero;
                m_propertyDataList.Add(newProperty);
            }
        }
        #endif


        #if UNITY_EDITOR
        /// <summary>
        /// Remove an element of the custom property list.
        /// </summary>
        private void OnRemoveCustomProperty(AzureWeatherController weatherController, int index)
        {
            // If the sender climate component is the same component associated to this preset.
            if (weatherController == m_weatherController)
            {
                Undo.RecordObject(this, "Remove Custom Property");
                m_propertyDataList.RemoveAt(index);
            }
        }
        #endif


        #if UNITY_EDITOR
        /// <summary>
        /// Reorder the custom property list.
        /// </summary>
        private void OnReoderCustomPropertiesList(AzureWeatherController weatherController, int oldIndex, int newIndex)
        {
            // If the sender climate component is the same component associated to this preset.
            if (weatherController == m_weatherController)
            {
                Undo.RecordObject(this, "Reorder Custom Property");
                AzurePropertyData item = m_propertyDataList[oldIndex];
                m_propertyDataList.Remove(item);
                m_propertyDataList.Insert(newIndex, item);
            }
        }
        #endif


        #if UNITY_EDITOR
        /// <summary>
        /// Initialize the property list to match with the custom property list from the climate system component.
        /// </summary>
        private void InitializePropertyList()
        {
            // If the preset game object is a child of the Dynamic Climate System
            // Try to get the Dynamic Climate System component from the parent
            m_weatherController = GetComponentInParent<AzureWeatherController>();


            // If the m_climateSystem is still null, get the first game object in the scene using the Dynamic Climate System component
            if (m_weatherController == null)
            {
                m_weatherController = FindObjectOfType<AzureWeatherController>();
            }


            // If the m_climateSystem is still null, just give up
            // We can still use the Unity's component copy/paste feature to initialize it manually...
            // from another weather preset already configured in the scene
            if (m_weatherController == null)
            {
                return;
            }


            if (m_weatherController)
            {
                if (m_weatherController.PropertySetupList.Count == m_propertyDataList.Count)
                {
                    for (int i = 0; i < m_weatherController.PropertySetupList.Count; i++)
                    {
                        m_propertyDataList[i].Name = m_weatherController.PropertySetupList[i].Name;
                        m_propertyDataList[i].CustomPropertyInfo = m_weatherController.PropertySetupList[i];
                    }
                }
                else
                {
                    for (int i = 0; i < m_weatherController.PropertySetupList.Count; i++)
                    {
                        if (m_propertyDataList.Count < m_weatherController.PropertySetupList.Count)
                        {
                            m_propertyDataList.Add(new AzurePropertyData());
                        }

                        m_propertyDataList[i].Name = m_weatherController.PropertySetupList[i].Name;
                        m_propertyDataList[i].CustomPropertyInfo = m_weatherController.PropertySetupList[i];
                    }
                }
            }
        }
        #endif
    }
}