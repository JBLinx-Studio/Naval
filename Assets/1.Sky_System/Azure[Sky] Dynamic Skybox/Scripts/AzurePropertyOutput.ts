using System;


namespace UnityEngine.AzureSky
{
    /// <summary>
    /// Custom Property: The class that stores the custom property output.
    /// </summary>
    [Serializable]
    public sealed class AzurePropertyOutput
    {
        /// <summary>
        /// Field: The float that stores the outputted value of the associated custom property after performing the blend transition.
        /// </summary>
        private float m_floatOutput;

        /// <summary>
        /// Property: The float that stores the outputted value of the associated custom property after performing the blend transition.
        /// </summary>
        public float FloatOutput { get => m_floatOutput; set => m_floatOutput = value; }


        /// <summary>
        /// Field: The color that stores the outputted value of the associated custom property after performing the blend transition.
        /// </summary>
        private Color m_colorOutput;

        /// <summary>
        /// Property: The color that stores the outputted value of the associated custom property after performing the blend transition.
        /// </summary>
        public Color ColorOutput { get => m_colorOutput; set => m_colorOutput = value; }


        /// <summary>
        /// Field: The texture that stores the outputted value of the associated custom property after performing the blend transition.
        /// </summary>
        private Texture m_textureOutput;

        /// <summary>
        /// Property: The color that stores the outputted value of the associated custom property after performing the blend transition.
        /// </summary>
        public Texture TextureOutput { get => m_textureOutput; set => m_textureOutput = value; }


        /// <summary>
        /// Field: The vector3 that stores the outputted value of the associated custom property after performing the blend transition.
        /// </summary>
        private Vector3 m_vector3Output;

        /// <summary>
        /// Property: The vector3 that stores the outputted value of the associated custom property after performing the blend transition.
        /// </summary>
        public Vector3 Vector3Output { get => m_vector3Output; set => m_vector3Output = value; }
    }
}