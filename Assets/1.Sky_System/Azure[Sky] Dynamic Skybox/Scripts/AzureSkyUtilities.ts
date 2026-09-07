namespace UnityEngine.AzureSky
{
    /// <summary>
    /// The way some component features should be updated.
    /// </summary>
    public enum AzureUpdateMode
    {
        LocallyEveryFrame,
        Externally
    }


    /// <summary>
    /// The interval time the custom event will be scanned.
    /// </summary>
    public enum AzureCustomEventUpdateMode
    {
        ByMinute,
        ByHour
    }
}