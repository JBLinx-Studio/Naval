using UnityEngine;
using UnityEditorInternal;
using UnityEngine.AzureSky;


namespace UnityEditor.AzureSky
{
    [CustomEditor(typeof(AzureThunderController))]
    public sealed class AzureThunderControllerEditor : Editor
    {
        // Target
        private AzureThunderController m_target;


        // Logo
        public Texture2D iconTexture;


        // Utilities
        private Rect m_controlRect;


        // Serialized properties
        SerializedProperty m_thunderSpawnerSettingsList;


        // Reorderable list
        ReorderableList m_thunderSpawnerSettingsReorderableList;


        private void OnEnable()
        {
            // Get target
            m_target = (AzureThunderController) target;


            // Find the serialized properties
            m_thunderSpawnerSettingsList = serializedObject.FindProperty("m_thunderSpawnerSettingsList");


            // Create the custom event list
            m_thunderSpawnerSettingsReorderableList = new ReorderableList(serializedObject, m_thunderSpawnerSettingsList, true, true, true, true)
            {
                drawElementCallback = (Rect rect, int index, bool isActive, bool isFocused) =>
                {
                    // Utilities
                    float height = 18f;
                    m_controlRect = new Rect(rect.x, rect.y, rect.width, height);


                    // Getting element properties
                    SerializedProperty element = m_thunderSpawnerSettingsList.GetArrayElementAtIndex(index);
                    SerializedProperty prefab = element.FindPropertyRelative("m_prefab");
                    SerializedProperty spawPos = element.FindPropertyRelative("m_spawPos");


                    // Prefab
                    EditorGUI.PropertyField(m_controlRect, prefab, new GUIContent("Prefab " + index));


                    // Spaw Pos
                    m_controlRect.y += 20;
                    EditorGUI.LabelField(m_controlRect, "Spaw Pos");
                    m_controlRect.x += EditorGUIUtility.labelWidth;
                    m_controlRect.width -= EditorGUIUtility.labelWidth;
                    EditorGUI.PropertyField(m_controlRect, spawPos, GUIContent.none);


                    // Test Button
                    m_controlRect.y += 20;
                    m_controlRect.x = rect.x;
                    m_controlRect.width = rect.width;
                    if (GUI.Button(m_controlRect, "Instantiate"))
                    {
                        if (Application.isPlaying)
                        {
                            m_target.InstantiateThunderObject(index);
                        }
                        else Debug.Log("The Application must be playing to instantiate a thunder object to the scene!");
                    }
                },


                drawHeaderCallback = (Rect rect) =>
                {
                    EditorGUI.LabelField(rect, "Thunder Spawner Settings", EditorStyles.boldLabel);
                },


                elementHeightCallback = (int index) =>
                {
                    return 70f;
                },


                drawElementBackgroundCallback = (rect, index, active, focused) =>
                {
                    if (active)
                        GUI.Label(new Rect(rect.x + 2f, rect.y - 2.5f, rect.width - 4f, rect.height - 8f), "", "selectionRect");
                }
            };
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
            GUI.Label(new Rect(m_controlRect.x + 38f, m_controlRect.y + 3f, m_controlRect.width, 22f), "Azure Thunder Controller", EditorStyles.whiteLargeLabel);
            GUI.Label(new Rect(m_controlRect.x + 38f, m_controlRect.y + 17f, m_controlRect.width, 22f), "Version 1.0.0", EditorStyles.whiteMiniLabel);


            // Spawner Settings List
            EditorGUILayout.Space();
            m_thunderSpawnerSettingsReorderableList.DoLayoutList();


            // Update the inspector when there is a change
            if (EditorGUI.EndChangeCheck())
            {
                serializedObject.ApplyModifiedProperties();
            }
        }
    }
}