namespace UnityEngine.AzureSky
{
    /// <summary>
    /// The system used to render the clouds.
    /// </summary>
    public enum SkyboxCloudMode
    {
        Off,
        Dynamic,
        Static
    }


    /// <summary>
    /// Will the sunset color be simulated or rendered from a custom color.
    /// </summary>
    public enum SunsetColorMode
    {
        Simulated,
        CustomColor
    }


    /// <summary>
    /// Should the skybox material be rendered on the current scene or not?
    /// </summary>
    public enum SkyboxRenderMode
    {
        Enabled,
        Disabled
    }


    /// <summary>
    /// Should the shader uniforms be updated by the referenced materials or glabally.
    /// </summary>
    public enum ShaderUpdateMode
    {
        ReferencedMaterial,
        GlobalShaderUniforms
    }
}