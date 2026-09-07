using System;


namespace UnityEngine.AzureSky
{
    /// <summary>
    /// Custom Property: The class that stores the custom property data, it will be available for customization on the weather presets.
    /// </summary>
    [Serializable]
    public sealed class AzurePropertyData
    {
        // Editor only
        #if UNITY_EDITOR
        /// <summary>
        /// Field: The name of this property data, it receives the name defined on the property setup.
        /// </summary>
        [SerializeField] private string m_name;

        /// <summary>
        /// Property: The name of this property data, it receives the name defined on the property setup.
        /// </summary>
        public string Name { get => m_name; set => m_name = value; }


        /// <summary>
        /// Field: The property setup associated to this property data.
        /// </summary>
        [SerializeField] private AzurePropertySetup m_customPropertyInfo;

        /// <summary>
        /// Property: The property setup associated to this property data.
        /// </summary>
        public AzurePropertySetup CustomPropertyInfo { get => m_customPropertyInfo; set => m_customPropertyInfo = value; }
        #endif


        /// <summary>
        /// Field: The data container for customization the custom property if it is configured to return a float output.
        /// </summary>
        [SerializeField] private float m_floatData;

        /// <summary>
        /// Property: The data container for customization the custom property if it is configured to return a float output.
        /// </summary>
        public float FloatData { get => m_floatData; set => m_floatData = value; }


        /// <summary>
        /// Field: The data container for customization the custom property if it is configured to return a color output.
        /// </summary>
        [SerializeField] private Color m_colorData;

        /// <summary>
        /// Property: The data container for customization the custom property if it is configured to return a color output.
        /// </summary>
        public Color ColorData { get => m_colorData; set => m_colorData = value; }


        /// <summary>
        /// Field: The data container for customization the custom property if it is configured to return a dynamic float output based on the timeline.
        /// </summary>
        [SerializeField] private AnimationCurve m_curveData;

        /// <summary>
        /// Property: The data container for customization the custom property if it is configured to return a dynamic float output based on the timeline.
        /// </summary>
        public AnimationCurve CurveData { get => m_curveData; set => m_curveData = value; }


        /// <summary>
        /// Field: The data container for customization the custom property if it is configured to return a dynamic color output based on the timeline.
        /// </summary>
        [SerializeField] private Gradient m_gradientData;

        /// <summary>
        /// Property: The data container for customization the custom property if it is configured to return a dynamic color output based on the timeline.
        /// </summary>
        public Gradient GradientData { get => m_gradientData; set => m_gradientData = value; }


        /// <summary>
        /// Field: The data container for customization the custom property if it is configured to return a texture.
        /// </summary>
        [SerializeField] private Texture m_textureData;

        /// <summary>
        /// Property: The data container for customization the custom property if it is configured to return a texture.
        /// </summary>
        public Texture TextureData { get => m_textureData; set => m_textureData = value; }


        /// <summary>
        /// Field: The data container for customization the custom property if it is configured to return a vector3.
        /// </summary>
        [SerializeField] private Vector3 m_vector3Data;

        /// <summary>
        /// Property: The data container for customization the custom property if it is configured to return a vector3.
        /// </summary>
        public Vector3 Vector3Data { get => m_vector3Data; set => m_vector3Data = value; }
    }
}