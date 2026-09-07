using UnityEngine;


namespace UnityEditor.AzureSky
{
    public sealed class AzureEditorStyles
    {
        public static GUIStyle centeredLabel = new GUIStyle()
        {
            alignment = TextAnchor.MiddleCenter,
            normal = { textColor = Color.white},
        };


        public static GUIStyle rightLabel = new GUIStyle("Label")
        {
            alignment = TextAnchor.MiddleRight,
        };
    }
}