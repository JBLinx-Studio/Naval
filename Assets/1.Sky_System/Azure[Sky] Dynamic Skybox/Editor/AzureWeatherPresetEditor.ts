using UnityEngine;
using UnityEditorInternal;
using UnityEngine.AzureSky;


namespace UnityEditor.AzureSky
{
    [CustomEditor(typeof(AzureWeatherPreset))]
    public sealed class AzureWeatherPresetEditor : Editor
    {
        // Target
        private AzureWeatherPreset m_target;


        // Logo
        public Texture2D iconTexture;


        // Utilities
        private Rect m_controlRect;


        // Serialized properties
        private SerializedProperty m_propertyDataList;


        // Reorderable list
        private ReorderableList m_profilePropertyReorderableList;


        private void OnEnable()
        {
            // Get target
            m_target = (AzureWeatherPreset) target;


            UpdatePropertiesInfo();


            // Find the serialized properties
            m_propertyDataList = serializedObject.FindProperty("m_propertyDataList");


            // Create the reorderable list
            m_profilePropertyReorderableList = new ReorderableList(serializedObject, m_propertyDataList, false, true, false, false)
            {
                drawElementCallback = (Rect rect, int index, bool isActive, bool isFocused) =>
                {
                    // Utilities
                    float height = 20f;
                    m_controlRect = new Rect(rect.x, rect.y, rect.width, height);


                    // Getting element properties
                    SerializedProperty element = m_propertyDataList.GetArrayElementAtIndex(index);
                    SerializedProperty customPropertyInfo = element.FindPropertyRelative("m_customPropertyInfo");
                    SerializedProperty name = element.FindPropertyRelative("m_name");
                    SerializedProperty propertyType = customPropertyInfo.FindPropertyRelative("m_propertyType");
                    SerializedProperty min = customPropertyInfo.FindPropertyRelative("m_minValue");
                    SerializedProperty max = customPropertyInfo.FindPropertyRelative("m_maxValue");
                    string propertyName = index + " - " + name.stringValue;

                    
                    switch (propertyType.enumValueIndex)
                    {
                        case 0: // Float
                            EditorGUI.Slider(m_controlRect, element.FindPropertyRelative("m_floatData"), min.floatValue, max.floatValue, propertyName);
                            break;

                        case 1: // Color
                            EditorGUI.PropertyField(m_controlRect, element.FindPropertyRelative("m_colorData"), new GUIContent(propertyName));
                            break;

                        case 2: // Curve
                            EditorGUI.CurveField(m_controlRect, element.FindPropertyRelative("m_curveData"), Color.green, new Rect(0.0f, min.floatValue, 24.0f, max.floatValue), new GUIContent(propertyName));
                            break;

                        case 3: // Gradient
                            EditorGUI.PropertyField(m_controlRect, element.FindPropertyRelative("m_gradientData"), new GUIContent(propertyName));
                            break;

                        case 4: // Texture
                            EditorGUI.PropertyField(m_controlRect, element.FindPropertyRelative("m_textureData"), new GUIContent(propertyName));
                            break;

                        case 5: // Vector3
                            SerializedProperty vec = element.FindPropertyRelative("m_vector3Data");
                            EditorGUI.LabelField(m_controlRect, propertyName);
                            m_controlRect.x += EditorGUIUtility.labelWidth;
                            m_controlRect.width -= EditorGUIUtility.labelWidth;
                            vec.vector3Value = EditorGUI.Vector3Field(m_controlRect, GUIContent.none, vec.vector3Value);
                            break;
                    }
                },


                drawHeaderCallback = (Rect rect) =>
                {
                    EditorGUI.LabelField(rect, "Custom Properties (Data)", EditorStyles.boldLabel);
                },


                drawElementBackgroundCallback = (rect, index, active, focused) =>
                {

                }
            };
        }


        public override void OnInspectorGUI()
        {
            // Start custom inspector
            //serializedObject.Update();
            if (!m_target.enabled) m_target.enabled = true;
            if (!m_target.gameObject.activeSelf) m_target.gameObject.SetActive(true);
            EditorGUI.BeginChangeCheck();


            // Title
            m_controlRect = EditorGUILayout.GetControlRect(GUILayout.Height(38f));
            EditorGUI.LabelField(m_controlRect, "", "", "selectionRect");
            if (iconTexture) GUI.DrawTexture(new Rect(m_controlRect.x + 3f, m_controlRect.y + 3f, 32f, 32f), iconTexture);
            GUI.Label(new Rect(m_controlRect.x + 38f, m_controlRect.y + 3f, m_controlRect.width, 22f), "Azure Weather Preset", EditorStyles.whiteLargeLabel);
            GUI.Label(new Rect(m_controlRect.x + 38f, m_controlRect.y + 17f, m_controlRect.width, 22f), "Version 1.0.0", EditorStyles.whiteMiniLabel);


            // Draw the reorderable list
            EditorGUILayout.Space();
            m_profilePropertyReorderableList.DoLayoutList();


            // Update the inspector when there is a change
            if (EditorGUI.EndChangeCheck())
            {
                serializedObject.ApplyModifiedProperties();
            }
        }


        /// <summary>
        /// Update each property info to match the custom property list from the climate system component.
        /// </summary>
        private void UpdatePropertiesInfo()
        {
            if (m_target.WeatherController)
            {
                for (int i = 0; i < m_target.PropertyDataList.Count; i++)
                {
                    m_target.PropertyDataList[i].Name = m_target.WeatherController.PropertySetupList[i].Name;
                    m_target.PropertyDataList[i].CustomPropertyInfo = m_target.WeatherController.PropertySetupList[i];
                }
            }
        }
    }
}