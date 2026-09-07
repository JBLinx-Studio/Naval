using UnityEngine;
using UnityEditorInternal;
using UnityEngine.AzureSky;


namespace UnityEditor.AzureSky
{
    [CustomEditor(typeof(AzureWeatherZone))]
    public sealed class AzureWeatherZoneEditor : Editor
    {
        // Target
        private AzureWeatherZone m_target;


        // Logo
        public Texture2D iconTexture;


        // Utilities
        private Rect m_controlRect;


        // Serialized properties
        private SerializedProperty m_blendDistance;
        private SerializedProperty m_collider;
        private SerializedProperty m_weatherPreset;


        // Reorderable list
        private ReorderableList m_weatherReorderableList;


        private void OnEnable()
        {
            // Get target
            m_target = (AzureWeatherZone) target;


            // Find the serialized properties
            m_blendDistance = serializedObject.FindProperty("m_blendDistance");
            m_collider = serializedObject.FindProperty("m_collider");
            m_weatherPreset = serializedObject.FindProperty("m_weatherPreset");
        }


        public override void OnInspectorGUI()
        {
            // Start custom inspector
            //serializedObject.Update();
            EditorGUI.BeginChangeCheck();


            // Title
            m_controlRect = EditorGUILayout.GetControlRect(GUILayout.Height(38f));
            EditorGUI.LabelField(m_controlRect, "", "", "selectionRect");
            if (iconTexture) GUI.DrawTexture(new Rect(m_controlRect.x + 3f, m_controlRect.y + 3f, 32f, 32f), iconTexture);
            GUI.Label(new Rect(m_controlRect.x + 38f, m_controlRect.y + 3f, m_controlRect.width, 22f), "Azure Weather Zone", EditorStyles.whiteLargeLabel);
            GUI.Label(new Rect(m_controlRect.x + 38f, m_controlRect.y + 17f, m_controlRect.width, 22f), "Version 1.0.0", EditorStyles.whiteMiniLabel);


            // Blend Distance
            EditorGUILayout.PropertyField(m_blendDistance);


            // Collider
            EditorGUILayout.PropertyField(m_collider);


            // Weather Preset
            EditorGUILayout.PropertyField(m_weatherPreset);


            // Update the inspector when there is a change
            if (EditorGUI.EndChangeCheck())
            {
                serializedObject.ApplyModifiedProperties();
            }
        }
    }
}