using UnityEngine;
using UnityEngine.AzureSky;


namespace UnityEditor.AzureSky
{
    [CustomEditor(typeof(AzureThunderObject))]
    public sealed class AzureThunderObjectEditor : Editor
    {
        // Target
        private AzureThunderObject m_target;


        // Logo
        public Texture2D iconTexture;


        // Utilities
        private Rect m_controlRect;


        // Serialized properties
        SerializedProperty m_audioSource;
        SerializedProperty m_directionalLight;
        SerializedProperty m_lightFrequency;
        SerializedProperty m_audioDelay;


        private void OnEnable()
        {
            // Get target
            m_target = (AzureThunderObject) target;


            // Find the serialized properties
            m_audioSource = serializedObject.FindProperty("m_audioSource");
            m_directionalLight = serializedObject.FindProperty("m_directionalLight");
            m_lightFrequency = serializedObject.FindProperty("m_lightFrequency");
            m_audioDelay = serializedObject.FindProperty("m_audioDelay");
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
            GUI.Label(new Rect(m_controlRect.x + 38f, m_controlRect.y + 3f, m_controlRect.width, 22f), "Azure Thunder Object", EditorStyles.whiteLargeLabel);
            GUI.Label(new Rect(m_controlRect.x + 38f, m_controlRect.y + 17f, m_controlRect.width, 22f), "Version 1.0.0", EditorStyles.whiteMiniLabel);


            // Audio Delay
            EditorGUILayout.Space();
            EditorGUILayout.PropertyField(m_audioSource);
            EditorGUILayout.PropertyField(m_directionalLight);
            EditorGUILayout.CurveField(m_lightFrequency, Color.yellow, new Rect(0.0f, 0.0f, 1.0f, 1.0f), new GUIContent("Light Frequency", ""));
            EditorGUILayout.PropertyField(m_audioDelay);


            // Update the inspector when there is a change
            if (EditorGUI.EndChangeCheck())
            {
                serializedObject.ApplyModifiedProperties();
            }
        }
    }
}