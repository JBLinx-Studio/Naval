using System;


namespace UnityEngine.AzureSky
{
    /// <summary>
    /// Global weather list item.
    /// </summary>
    [Serializable]
    public sealed class AzureGlobalWeather
    {
        public AzureWeatherPreset preset;
        public float transition;
    }
}