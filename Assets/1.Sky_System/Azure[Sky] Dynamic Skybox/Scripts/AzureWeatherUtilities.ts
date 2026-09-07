namespace UnityEngine.AzureSky
{
    /// <summary>
    /// Used to Set or campare the type of each custom property.
    /// </summary>
    public enum CustomPropertyType
    {
        Float,
        Color,
        Curve,
        Gradient,
        Texture,
        Vector3
    }


    /// <summary>
    /// If the override system will be automatic or manually.
    /// </summary>
    public enum TargetOverrideMode
    {
        Off,
        On
    }


    /// <summary>
    /// Is the custom vector property a position or a direction?
    /// It will interpolate different while in a weather transition.
    /// </summary>
    public enum VectorInterpolationMode
    {
        Position,
        Direction
    }


    /// <summary>
    /// If the target property to override is a field or property.
    /// </summary>
    public enum TargetOverrideType
    {
        Property,
        Field,
        GlobalShaderUniform,
        MaterialProperty,
        GlobalProperty,
        GlobalField
    }
}