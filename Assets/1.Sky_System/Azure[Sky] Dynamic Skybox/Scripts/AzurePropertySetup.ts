using System;
using System.Reflection;


namespace UnityEngine.AzureSky
{
    /// <summary>
    /// Custom Property: The class that stores the custom property setup, it will be available for configuration on the custom property list.
    /// </summary>
    [Serializable]
    public sealed class AzurePropertySetup
    {
        #if UNITY_EDITOR
        /// <summary>
        /// Field: The name of the custom property.
        /// </summary>
        [SerializeField] private string m_name;

        /// <summary>
        /// Property: The name of the custom property.
        /// </summary>
        public string Name { get => m_name; set => m_name = value; }


        /// <summary>
        /// Field: The minimum value allowed for customization if the property type is returning a float.
        /// </summary>
        [SerializeField] private float m_minValue;

        /// <summary>
        /// Property: The minimum value allowed for customization if the property type is returning a float.
        /// </summary>
        public float MinValue { get => m_minValue; set => m_minValue = value; }


        // <summary>
        /// Field: The maximum value allowed for customization if the property type is returning a float.
        /// </summary>
        [SerializeField] private float m_maxValue;

        // <summary>
        /// Property: The maximum value allowed for customization if the property type is returning a float.
        /// </summary>
        public float MaxValue { get => m_maxValue; set => m_maxValue = value; }


        /// <summary>
        /// Field: Used by the editor script to perform the expand functionality.
        /// </summary>
        private bool m_isExpanded = false;

        /// <summary>
        /// Property: Used by the editor script to perform the expand functionality.
        /// </summary>
        public bool IsExpanded { get => m_isExpanded; set => m_isExpanded = value; }
        #endif


        /// <summary>
        /// Field: The type the custom property will return.
        /// </summary>
        [SerializeField] private CustomPropertyType m_propertyType;

        /// <summary>
        /// Property: The type the custom property will return.
        /// </summary>
        public CustomPropertyType PropertyType { get => m_propertyType; set => m_propertyType = value; }


        /// <summary>
        /// Field: The width of the internal render texture used to perform the blend transition between two weather presets.
        /// </summary>
        [SerializeField] private int m_textureWidth;

        /// <summary>
        /// Property: The width of the internal render texture used to perform the blend transition between two weather presets.
        /// </summary>
        public int TextureWidth { get => m_textureWidth; set => m_textureWidth = value; }


        /// <summary>
        /// Field: The height of the internal render texture used to perform the blend transition between two weather presets.
        /// </summary>
        [SerializeField] private int m_textureHeight;

        /// <summary>
        /// Property: The height of the internal render texture used to perform the blend transition between two weather presets.
        /// </summary>
        public int TextureHeight { get => m_textureHeight; set => m_textureHeight = value; }


        /// <summary>
        /// Field: The wrap mode of the internal render texture used to blit the weather transition.
        /// </summary>
        [SerializeField] private TextureWrapMode m_textureWrapMode = TextureWrapMode.Repeat;

        /// <summary>
        /// Property: The wrap mode of the internal render texture used to blit the weather transition.
        /// </summary>
        public TextureWrapMode TextureWrapMode { get => m_textureWrapMode; set => m_textureWrapMode = value; }


        /// <summary>
        /// Field: The filter mode of the internal render texture used to blit the weather transition.
        /// </summary>
        [SerializeField] private FilterMode m_textureFilterMode = FilterMode.Bilinear;

        /// <summary>
        /// Property: The filter mode of the internal render texture used to blit the weather transition.
        /// </summary>
        public FilterMode TextureFilterMode { get => m_textureFilterMode; set => m_textureFilterMode = value; }


        /// <summary>
        /// Field: Enable and disable the automatic override system for this custom property.
        /// </summary>
        [SerializeField] private TargetOverrideMode m_overrideMode;

        /// <summary>
        /// Field: Enable and disable the automatic override system for this custom property.
        /// </summary>
        public TargetOverrideMode OverrideMode { get => m_overrideMode; set => m_overrideMode = value; }


        /// <summary>
        /// Field: The type of the target property, which the custom property should override.
        /// </summary>
        [SerializeField] private TargetOverrideType m_targetType;

        /// <summary>
        /// Property: The type of the target property, which the custom property should override.
        /// </summary>
        public TargetOverrideType TargetType { get => m_targetType; set => m_targetType = value; }


        // <summary>
        /// Field: The target game object to access and get the target component.
        /// </summary>
        [SerializeField] private GameObject m_targetObject;

        // <summary>
        /// Property: The target game object to access and get the target component.
        /// </summary>
        public GameObject TargetObject { get => m_targetObject; set => m_targetObject = value; }


        // <summary>
        /// Field: The target component to access and get the target property that will be overridden.
        /// </summary>
        [SerializeField] private Component m_targetComponent;

        // <summary>
        /// Property: The target component to access and get the target property that will be overridden.
        /// </summary>
        public Component TargetComponent { get => m_targetComponent; set => m_targetComponent = value; }


        // <summary>
        /// Field: The global target type to access and get the global target property that will be overridden.
        /// </summary>
        [SerializeField] private Type m_targetGlobalType;

        // <summary>
        /// Property: The global target type to access and get the global target property that will be overridden.
        /// </summary>
        public Type TargetGlobalType { get => m_targetGlobalType; set => m_targetGlobalType = value; }


        // <summary>
        /// Field: The target material to access and set the target property.
        /// </summary>
        [SerializeField] private Material m_targetMaterial;

        // <summary>
        /// Property: The target material to access and set the target property.
        /// </summary>
        public Material TargetMaterial { get => m_targetMaterial; set => m_targetMaterial = value; }


        /// <summary>
        /// Field: Stores the name used to get the target component.
        /// </summary>
        [SerializeField] private string m_targetComponentName;

        /// <summary>
        /// Property: Stores the name used to get the target component.
        /// </summary>
        public string TargetComponentName { get => m_targetComponentName; set => m_targetComponentName = value; }


        /// <summary>
        /// Field: Stores the name used to get the target property.
        /// </summary>
        [SerializeField] private string m_targetPropertyName;

        /// <summary>
        /// Property: Stores the name used to get the target property.
        /// </summary>
        public string TargetPropertyName { get => m_targetPropertyName; set => m_targetPropertyName = value; }


        /// <summary>
        /// Field: The field info that stores the target property field.
        /// </summary>
        private FieldInfo m_fieldInfo;

        /// <summary>
        /// Property: The field info that stores the target property field.
        /// </summary>
        public FieldInfo FieldInfo { get => m_fieldInfo; set => m_fieldInfo = value; }


        /// <summary>
        /// Field: The property info that stores the target property.
        /// </summary>
        private PropertyInfo m_propertyInfo;

        /// <summary>
        /// Property: The property info that stores the target property.
        /// </summary>
        public PropertyInfo PropertyInfo { get => m_propertyInfo; set => m_propertyInfo = value; }


        /// <summary>
        /// Field: The render texture used to blend/blit the custom texture property when runing a global weather transition.
        /// </summary>
        [SerializeField] private RenderTexture m_globalWeatherTexture;

        /// <summary>
        /// Property: The render texture used to blend/blit the custom texture property when runing a global weather transition.
        /// </summary>
        public RenderTexture GlobalWeatherTexture { get => m_globalWeatherTexture; set => m_globalWeatherTexture = value; }


        /// <summary>
        /// Field: The render texture used to blend/blit the custom texture property when runing a local weather transition.
        /// </summary>
        [SerializeField] private RenderTexture m_localWeatherTexture;

        /// <summary>
        /// Property: The render texture used to blend/blit the custom texture property when runing a local weather transition.
        /// </summary>
        public RenderTexture LocalWeatherTexture { get => m_localWeatherTexture; set => m_localWeatherTexture = value; }


        /// <summary>
        /// Field: If this custom vector property should be interpolated as a position or as a direction.
        /// </summary>
        [SerializeField] private VectorInterpolationMode m_vectorInterpolationMode;

        /// <summary>
        /// Property: If this custom vector property should be interpolated as a position or as a direction.
        /// </summary>
        public VectorInterpolationMode VectorInterpolationMode { get => m_vectorInterpolationMode; set => m_vectorInterpolationMode = value; }
    }
}