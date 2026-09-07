using System;
using UnityEngine.AzureSky;
using UnityEngine;
using UnityEditorInternal;
using System.Reflection;
using System.Collections.Generic;


namespace UnityEditor.AzureSky
{
    [CustomEditor(typeof(AzureWeatherController))]
    public sealed class AzureWeatherControllerEditor : Editor
    {
        // Target
        private AzureWeatherController m_target;


        // Logo
        public Texture2D iconTexture;


        // Utilities
        private Rect m_controlRect;


        // Serialized properties
        private SerializedProperty m_showOptionsTab;
        private SerializedProperty m_globalWeathersParent;
        private SerializedProperty m_weatherZonesParent;

        private SerializedProperty m_updateMode;
        private SerializedProperty m_weatherZoneTrigger;
        private SerializedProperty m_weatherTransitionProgress;
        private SerializedProperty m_globalWeatherList;
        private SerializedProperty m_weatherZoneList;
        private SerializedProperty m_propertySetupList;


        // Reorderable list
        private ReorderableList m_globalWeatherReorderableList;
        private ReorderableList m_weatherZoneReorderableList;
        private ReorderableList m_customPropertyReorderableList;


        private void OnDisable()
        {
            Undo.undoRedoPerformed -= UpdateCustomPropertyListTargets;
        }


        private void OnEnable()
        {
            // Get target
            m_target = (AzureWeatherController)target;
            Undo.undoRedoPerformed += UpdateCustomPropertyListTargets;


            UpdateCustomPropertyListTargets();


            // Find the serialized properties
            m_showOptionsTab = serializedObject.FindProperty("m_showOptionsTab");
            m_globalWeathersParent = serializedObject.FindProperty("m_globalWeathersParent");
            m_weatherZonesParent = serializedObject.FindProperty("m_weatherZonesParent");
            m_updateMode = serializedObject.FindProperty("m_updateMode");
            m_weatherZoneTrigger = serializedObject.FindProperty("m_weatherZoneTrigger");
            m_weatherTransitionProgress = serializedObject.FindProperty("m_weatherTransitionProgress");
            m_globalWeatherList = serializedObject.FindProperty("m_globalWeatherList");
            m_weatherZoneList = serializedObject.FindProperty("m_weatherZoneList");
            m_propertySetupList = serializedObject.FindProperty("m_propertySetupList");


            // Create the global weather list
            m_globalWeatherReorderableList = new ReorderableList(serializedObject, m_globalWeatherList, true, true, true, true)
            {
                drawElementCallback = (Rect rect, int index, bool isActive, bool isFocused) =>
                {
                    // Utilities
                    float height = 18f;
                    m_controlRect = new Rect(rect.x, rect.y, rect.width, height);


                    // Getting element properties
                    SerializedProperty element = m_globalWeatherList.GetArrayElementAtIndex(index);
                    SerializedProperty preset = element.FindPropertyRelative("preset");
                    SerializedProperty transition = element.FindPropertyRelative("transition");


                    // Preset Index
                    EditorGUI.LabelField(m_controlRect, "Preset  " + index.ToString());


                    // Object Field
                    m_controlRect = new Rect(rect.x + 65f, rect.y, rect.width - 140f, height);
                    EditorGUI.PropertyField(m_controlRect, preset, GUIContent.none);


                    // Transition Time
                    m_controlRect = new Rect(rect.width - 33f, rect.y, 36f, height);
                    EditorGUI.PropertyField(m_controlRect, transition, GUIContent.none);


                    // Go button
                    m_controlRect = new Rect(rect.width + 5f, rect.y, 36f, height);
                    if (GUI.Button(m_controlRect, "Go"))
                    {
                        if (Application.isPlaying)
                        {
                            m_target.SetNewWeather(index);
                        }
                        else
                        {
                            Debug.Log("To perform a weather transition, the application must be playing.");
                        }
                    }
                },


                onAddCallback = (ReorderableList l) =>
                {
                    Undo.RecordObject(m_target, "Add Global Weather");
                    ReorderableList.defaultBehaviours.DoAddButton(l);
                    serializedObject.ApplyModifiedProperties();
                    AzureNotificationCenterEditor.Invoke.AddGlobalWeatherCallback(m_target);
                },


                onRemoveCallback = (ReorderableList l) =>
                {
                    Undo.RecordObject(m_target, "Remove Global Weather");
                    AzureNotificationCenterEditor.Invoke.RemoveGlobalWeatherCallback(m_target, l.index);
                    ReorderableList.defaultBehaviours.DoRemoveButton(l);
                },


                onReorderCallbackWithDetails = (ReorderableList l, int oldIndex, int newIndex) =>
                {
                    Undo.RecordObject(m_target, "Reorder Global Weather List");
                    AzureNotificationCenterEditor.Invoke.ReorderGlobalWeatherListCallback(m_target, oldIndex, newIndex);
                    DynamicGI.UpdateEnvironment(); // Hack to force the editor to update!
                },


                drawHeaderCallback = (Rect rect) =>
                {
                    EditorGUI.LabelField(rect, "Global Weather Presets", EditorStyles.boldLabel);
                },


                drawElementBackgroundCallback = (rect, index, active, focused) =>
                {
                    if (active)
                        GUI.Label(new Rect(rect.x + 2f, rect.y - 2.5f, rect.width - 4f, rect.height), "", "selectionRect");
                }
            };


            // Create the local weather zone list
            m_weatherZoneReorderableList = new ReorderableList(serializedObject, m_weatherZoneList, true, true, true, true)
            {
                drawElementCallback = (Rect rect, int index, bool isActive, bool isFocused) =>
                {
                    // Utilities
                    float height = 18f;
                    m_controlRect = new Rect(rect.x, rect.y, rect.width, height);


                    // Getting element properties
                    SerializedProperty element = m_weatherZoneList.GetArrayElementAtIndex(index);


                    // Priority Index
                    EditorGUI.LabelField(m_controlRect, "Priority  " + index.ToString());


                    // Object Field
                    m_controlRect = new Rect(rect.x + 65f, rect.y, rect.width - 63f, height);
                    EditorGUI.PropertyField(m_controlRect, element, GUIContent.none);
                },


                drawHeaderCallback = (Rect rect) =>
                {
                    EditorGUI.LabelField(rect, "Local Weather Zones", EditorStyles.boldLabel);
                },


                onAddCallback = (ReorderableList l) =>
                {
                    // Save to the undo system
                    Undo.RecordObject(m_target, "Add Weather Zone");
                    ReorderableList.defaultBehaviours.DoAddButton(l);
                    serializedObject.ApplyModifiedProperties();
                    AzureNotificationCenterEditor.Invoke.AddWeatherZoneCallback(m_target);
                },


                onRemoveCallback = (ReorderableList l) =>
                {
                    Undo.RecordObject(m_target, "Remove Weather Zone");
                    AzureNotificationCenterEditor.Invoke.RemoveWeatherZoneCallback(m_target, l.index);
                    ReorderableList.defaultBehaviours.DoRemoveButton(l);
                },


                onReorderCallbackWithDetails = (ReorderableList l, int oldIndex, int newIndex) =>
                {
                    Undo.RecordObject(m_target, "Reorder Weather Zone List");
                    AzureNotificationCenterEditor.Invoke.ReorderWeatherZoneListCallback(m_target, oldIndex, newIndex);
                },


                drawElementBackgroundCallback = (rect, index, active, focused) =>
                {
                    if (active)
                        GUI.Label(new Rect(rect.x + 2f, rect.y - 2.5f, rect.width - 4f, rect.height), "", "selectionRect");
                }
            };


            // Create the custom property list
            m_customPropertyReorderableList = new ReorderableList(serializedObject, m_propertySetupList, true, true, true, true)
            {
                drawElementCallback = (Rect rect, int index, bool isActive, bool isFocused) =>
                {
                    // Utilities
                    float height = 20f;
                    m_controlRect = new Rect(rect.x + 15f, rect.y, rect.width - 18f, 18f);


                    m_target.PropertySetupList[index].IsExpanded = EditorGUI.BeginFoldoutHeaderGroup(m_controlRect, m_target.PropertySetupList[index].IsExpanded, index.ToString() + " - " + m_target.PropertySetupList[index].Name);

                    if (m_target.PropertySetupList[index].IsExpanded)
                    {
                        // Getting element properties
                        SerializedProperty element = m_propertySetupList.GetArrayElementAtIndex(index);
                        SerializedProperty propertyType = element.FindPropertyRelative("m_propertyType");
                        SerializedProperty name = element.FindPropertyRelative("m_name");
                        SerializedProperty minValue = element.FindPropertyRelative("m_minValue");
                        SerializedProperty maxValue = element.FindPropertyRelative("m_maxValue");
                        SerializedProperty textureWidth = element.FindPropertyRelative("m_textureWidth");
                        SerializedProperty textureHeight = element.FindPropertyRelative("m_textureHeight");
                        SerializedProperty textureWrapMode = element.FindPropertyRelative("m_textureWrapMode");
                        SerializedProperty textureFilterMode = element.FindPropertyRelative("m_textureFilterMode");
                        SerializedProperty vectorInterpolationMode = element.FindPropertyRelative("m_vectorInterpolationMode");
                        SerializedProperty overrideMode = element.FindPropertyRelative("m_overrideMode");
                        SerializedProperty targetType = element.FindPropertyRelative("m_targetType");
                        SerializedProperty targetObject = element.FindPropertyRelative("m_targetObject");
                        SerializedProperty targetMaterial = element.FindPropertyRelative("m_targetMaterial");
                        SerializedProperty targetComponentName = element.FindPropertyRelative("m_targetComponentName");
                        SerializedProperty targetPropertyName = element.FindPropertyRelative("m_targetPropertyName");


                        // Avoid empty name
                        if (name.stringValue == "") name.stringValue = "My Name...";


                        // Property Type
                        m_controlRect.y += height;
                        EditorGUI.PropertyField(m_controlRect, propertyType);


                        // Property Name
                        m_controlRect.y += height;
                        name.stringValue = EditorGUI.DelayedTextField(m_controlRect, "Property Name", name.stringValue);


                        // Property Type
                        switch (propertyType.enumValueIndex)
                        {
                            // Show the min/max values only if the custom property is a float type
                            case 0: // Float
                            case 2: // Curve

                                // Min value
                                m_controlRect.y += height;
                                minValue.floatValue = EditorGUI.DelayedFloatField(m_controlRect, "Min Value", minValue.floatValue);


                                // Max value
                                m_controlRect.y += height;
                                maxValue.floatValue = EditorGUI.DelayedFloatField(m_controlRect, "Max Value", maxValue.floatValue);
                                break;


                            // Texture Settings
                            case 4:
                                // Width
                                m_controlRect.y += height;
                                textureWidth.intValue = EditorGUI.DelayedIntField(m_controlRect, "Width", textureWidth.intValue);


                                // Height
                                m_controlRect.y += height;
                                textureHeight.intValue = EditorGUI.DelayedIntField(m_controlRect, "Height", textureHeight.intValue);

                                // Wrap Mode
                                m_controlRect.y += height;
                                EditorGUI.PropertyField(m_controlRect, textureWrapMode, new GUIContent("Wrap Mode"));


                                // Filter Mode
                                m_controlRect.y += height;
                                EditorGUI.PropertyField(m_controlRect, textureFilterMode, new GUIContent("Filter Mode"));
                                break;


                            // Vector3 Settings
                            case 5:
                                // Interpolation Mode
                                m_controlRect.y += height;
                                EditorGUI.PropertyField(m_controlRect, vectorInterpolationMode, new GUIContent("Interpolate As"));
                                break;
                        }


                        // Override Mode
                        m_controlRect.y += height;
                        EditorGUI.PropertyField(m_controlRect, overrideMode);


                        // Show the target settings only if the override mode is on
                        if (overrideMode.enumValueIndex == 1)
                        {
                            // Target Type
                            m_controlRect.y += height;
                            EditorGUI.PropertyField(m_controlRect, targetType);


                            // Target Object
                            switch (targetType.enumValueIndex)
                            {
                                case 0: // Property
                                case 1: // Field
                                    m_controlRect.y += height;
                                    GUI.color = m_target.PropertySetupList[index].TargetObject ? Color.white : Color.red;
                                    EditorGUI.PropertyField(m_controlRect, targetObject);
                                    break;
                            }


                            // Target Component
                            switch (targetType.enumValueIndex)
                            {
                                case 0: // Property
                                    m_controlRect.y += height;
                                    GUI.color = (m_target.PropertySetupList[index].TargetComponent != null) ? Color.white : Color.red;
                                    EditorGUI.DelayedTextField(m_controlRect, targetComponentName, new GUIContent("Target Component"));
                                    GUI.color = (m_target.PropertySetupList[index].PropertyInfo != null) ? Color.white : Color.red;
                                    break;


                                case 1: // Field
                                    m_controlRect.y += height;
                                    GUI.color = (m_target.PropertySetupList[index].TargetComponent != null) ? Color.white : Color.red;
                                    EditorGUI.DelayedTextField(m_controlRect, targetComponentName, new GUIContent("Target Component"));
                                    GUI.color = (m_target.PropertySetupList[index].FieldInfo != null) ? Color.white : Color.red;
                                    break;


                                case 4: // Global Property
                                    m_controlRect.y += height;
                                    GUI.color = (m_target.PropertySetupList[index].TargetGlobalType != null) ? Color.white : Color.red;
                                    EditorGUI.DelayedTextField(m_controlRect, targetComponentName, new GUIContent("Target Component"));
                                    GUI.color = (m_target.PropertySetupList[index].PropertyInfo != null) ? Color.white : Color.red;
                                    break;


                                case 5: // Global Field
                                    m_controlRect.y += height;
                                    GUI.color = (m_target.PropertySetupList[index].TargetGlobalType != null) ? Color.white : Color.red;
                                    EditorGUI.DelayedTextField(m_controlRect, targetComponentName, new GUIContent("Target Component"));
                                    GUI.color = (m_target.PropertySetupList[index].FieldInfo != null) ? Color.white : Color.red;
                                    break;
                            }


                            // Material
                            if (targetType.enumValueIndex == 3)
                            {
                                m_controlRect.y += height;
                                GUI.color = (targetMaterial.objectReferenceValue) ? Color.white : Color.red;
                                EditorGUI.PropertyField(m_controlRect, targetMaterial);


                                // Set the color of the target property name field
                                if (targetMaterial.objectReferenceValue)
                                {
                                    if (((Material)targetMaterial.objectReferenceValue).HasProperty(targetPropertyName.stringValue))
                                    {
                                        GUI.color = Color.white;
                                    }
                                    else GUI.color = Color.red;
                                }
                            }


                            // Check if the PropertyInfo type matches with the target type
                            if (targetType.enumValueIndex == 0 || targetType.enumValueIndex == 4)
                            {
                                if (!CheckTargetMatch(propertyType.enumValueIndex, m_target.PropertySetupList[index].PropertyInfo))
                                {
                                    GUI.color = Color.red;
                                }
                            }


                            // Check if the FieldInfo type matches with the target type
                            if (targetType.enumValueIndex == 1 || targetType.enumValueIndex == 5)
                            {
                                if (!CheckTargetMatch(propertyType.enumValueIndex, m_target.PropertySetupList[index].FieldInfo))
                                {
                                    GUI.color = Color.red;
                                }
                            }


                            // Target Property Name
                            m_controlRect.y += height;
                            EditorGUI.DelayedTextField(m_controlRect, targetPropertyName, new GUIContent("Target Property"));
                            GUI.color = Color.white;
                        }
                    }

                    // End foldout element group
                    EditorGUILayout.EndFoldoutHeaderGroup();
                },


                onAddCallback = (ReorderableList l) =>
                {
                    // Save to the undo system
                    Undo.RecordObject(m_target, "Add Custom Property");


                    // Create a new element
                    ReorderableList.defaultBehaviours.DoAddButton(l);


                    // Initialize the new element
                    SerializedProperty element = m_propertySetupList.GetArrayElementAtIndex(l.index);
                    element.FindPropertyRelative("m_propertyType").intValue = 0;
                    element.FindPropertyRelative("m_name").stringValue = "My Name...";
                    element.FindPropertyRelative("m_minValue").floatValue = 0.0f;
                    element.FindPropertyRelative("m_maxValue").floatValue = 1.0f;
                    element.FindPropertyRelative("m_textureWidth").intValue = 32;
                    element.FindPropertyRelative("m_textureHeight").intValue = 32;
                    element.FindPropertyRelative("m_overrideMode").intValue = 0;
                    element.FindPropertyRelative("m_targetType").intValue = 0;
                    element.FindPropertyRelative("m_targetObject").objectReferenceValue = null;
                    element.FindPropertyRelative("m_targetComponent").objectReferenceValue = null;
                    element.FindPropertyRelative("m_targetMaterial").objectReferenceValue = null;
                    element.FindPropertyRelative("m_targetComponentName").stringValue = "";
                    element.FindPropertyRelative("m_targetPropertyName").stringValue = "";


                    // Notify a new custom property was created
                    serializedObject.ApplyModifiedProperties();
                    AzureNotificationCenterEditor.Invoke.AddCustomPropertyCallback(m_target);
                },


                onRemoveCallback = (ReorderableList l) =>
                {
                    Undo.RecordObject(m_target, "Remove Custom Property");
                    AzureNotificationCenterEditor.Invoke.RemoveCustomPropertyCallback(m_target, l.index);
                    ReorderableList.defaultBehaviours.DoRemoveButton(l);
                },


                onReorderCallbackWithDetails = (ReorderableList l, int oldIndex, int newIndex) =>
                {
                    Undo.RecordObject(m_target, "Reorder Custom Property");
                    AzureNotificationCenterEditor.Invoke.ReorderCustomPropertyListCallback(m_target, oldIndex, newIndex);
                    UpdateCustomPropertyListTargets();
                },


                drawHeaderCallback = (Rect rect) =>
                {
                    EditorGUI.LabelField(rect, "Custom Properties (Setup)", EditorStyles.boldLabel);
                },


                elementHeightCallback = (int index) =>
                {
                    if (m_target.PropertySetupList.Count > 0)
                    {
                        if (m_target.PropertySetupList[index].IsExpanded)
                        {
                            switch (m_target.PropertySetupList[index].PropertyType)
                            {
                                case CustomPropertyType.Float:
                                case CustomPropertyType.Curve:
                                    if (m_target.PropertySetupList[index].OverrideMode == TargetOverrideMode.On)
                                    {
                                        switch (m_target.PropertySetupList[index].TargetType)
                                        {
                                            case TargetOverrideType.Property:
                                            case TargetOverrideType.Field:
                                                return 200f;
                                            case TargetOverrideType.GlobalShaderUniform:
                                                return 160f;
                                            case TargetOverrideType.MaterialProperty:
                                            case TargetOverrideType.GlobalProperty:
                                            case TargetOverrideType.GlobalField:
                                                return 180f;
                                        }
                                    }
                                    else return 120f;
                                    break;


                                case CustomPropertyType.Color:
                                case CustomPropertyType.Gradient:
                                    if (m_target.PropertySetupList[index].OverrideMode == TargetOverrideMode.On)
                                    {
                                        switch (m_target.PropertySetupList[index].TargetType)
                                        {
                                            case TargetOverrideType.Property:
                                            case TargetOverrideType.Field:
                                                return 160f;
                                            case TargetOverrideType.GlobalShaderUniform:
                                                return 120f;
                                            case TargetOverrideType.MaterialProperty:
                                            case TargetOverrideType.GlobalProperty:
                                            case TargetOverrideType.GlobalField:
                                                return 140f;
                                        }
                                    }
                                    else return 80f;
                                    break;


                                case CustomPropertyType.Texture:
                                    if (m_target.PropertySetupList[index].OverrideMode == TargetOverrideMode.On)
                                    {
                                        switch (m_target.PropertySetupList[index].TargetType)
                                        {
                                            case TargetOverrideType.Property:
                                            case TargetOverrideType.Field:
                                                return 240f;
                                            case TargetOverrideType.GlobalShaderUniform:
                                                return 200f;
                                            case TargetOverrideType.MaterialProperty:
                                            case TargetOverrideType.GlobalProperty:
                                            case TargetOverrideType.GlobalField:
                                                return 220f;
                                        }
                                    }
                                    else return 160f;
                                    break;


                                case CustomPropertyType.Vector3:
                                    if (m_target.PropertySetupList[index].OverrideMode == TargetOverrideMode.On)
                                    {
                                        switch (m_target.PropertySetupList[index].TargetType)
                                        {
                                            case TargetOverrideType.Property:
                                            case TargetOverrideType.Field:
                                                return 180f;
                                            case TargetOverrideType.GlobalShaderUniform:
                                                return 140f;
                                            case TargetOverrideType.MaterialProperty:
                                            case TargetOverrideType.GlobalProperty:
                                            case TargetOverrideType.GlobalField:
                                                return 160f;
                                        }
                                    }
                                    else return 100f;
                                    break;
                            }
                        }
                    }

                    return 22f;
                },


                drawElementBackgroundCallback = (rect, index, active, focused) =>
                {
                    if (active)
                        GUI.Label(new Rect(rect.x + 2f, rect.y - 2f, rect.width - 4f, rect.height), "", "selectionRect");
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
            GUI.Label(new Rect(m_controlRect.x + 38f, m_controlRect.y + 3f, m_controlRect.width, 22f), "Azure Weather Controller", EditorStyles.whiteLargeLabel);
            GUI.Label(new Rect(m_controlRect.x + 38f, m_controlRect.y + 17f, m_controlRect.width, 22f), "Version 1.0.0", EditorStyles.whiteMiniLabel);


            // Progress bar
            EditorGUILayout.Space(2f);
            m_controlRect = EditorGUILayout.GetControlRect(GUILayout.Height(14f));
            EditorGUI.ProgressBar(m_controlRect, m_weatherTransitionProgress.floatValue, "Transition Progress");


            // Draw the global weather list
            m_globalWeatherReorderableList.DoLayoutList();


            // Draw the local weather zone list
            EditorGUILayout.Space(25f);
            m_weatherZoneReorderableList.DoLayoutList();


            // Draw the custom property list
            EditorGUILayout.Space(25f);
            m_customPropertyReorderableList.DoLayoutList();


            // Begin the options tab
            EditorGUILayout.Space(25f);
            m_controlRect = EditorGUILayout.GetControlRect();
            m_controlRect.width -= 4f;
            m_showOptionsTab.isExpanded = EditorGUI.BeginFoldoutHeaderGroup(m_controlRect, m_showOptionsTab.isExpanded, "    Options", "HelpBox");
            EditorGUI.Foldout(m_controlRect, m_showOptionsTab.isExpanded, "");
            if (m_showOptionsTab.isExpanded)
            {
                EditorGUILayout.PrefixLabel("Runtime:");
                EditorGUILayout.PropertyField(m_weatherZoneTrigger);
                EditorGUILayout.PropertyField(m_updateMode);

                EditorGUILayout.Space();

                EditorGUILayout.PrefixLabel("Editor:");
                EditorGUILayout.PropertyField(m_globalWeathersParent);
                EditorGUILayout.PropertyField(m_weatherZonesParent);
            }
            EditorGUILayout.EndFoldoutHeaderGroup();


            // Update the inspector when there is a change
            if (EditorGUI.EndChangeCheck())
            {
                serializedObject.ApplyModifiedProperties();
                UpdateCustomPropertyListTargets();
            }
        }


        /// <summary>
        /// Update the custom property list targets when there is a change in the Inspector settings.
        /// </summary>
        private void UpdateCustomPropertyListTargets()
        {
            // Create an empty output list
            m_target.PropertyOutputList = new List<AzurePropertyOutput>();


            for (int i = 0; i < m_target.PropertySetupList.Count; i++)
            {
                // Sync the output list size with the custom property list size
                m_target.PropertyOutputList.Add(new AzurePropertyOutput());


                // Try to get the target fields and target properties according to the Inspector setup
                if (m_target.PropertySetupList[i].OverrideMode == TargetOverrideMode.On)
                {
                    switch (m_target.PropertySetupList[i].TargetType)
                    {
                        case TargetOverrideType.Property:
                            if (!m_target.PropertySetupList[i].TargetObject) continue;
                            m_target.PropertySetupList[i].TargetComponent = m_target.PropertySetupList[i].TargetObject?.GetComponent(m_target.PropertySetupList[i].TargetComponentName);
                            m_target.PropertySetupList[i].PropertyInfo = m_target.PropertySetupList[i].TargetComponent?.GetType().GetProperty(m_target.PropertySetupList[i].TargetPropertyName);

                            // PropertyInfo.SetValue is called only if it is not null, so make sure it is null if the target type don't match the custom property type
                            if (m_target.PropertySetupList[i].PropertyInfo == null) continue;
                            if (m_target.PropertySetupList[i].PropertyInfo.PropertyType != m_customPropertyTypes[(int)m_target.PropertySetupList[i].PropertyType])
                                m_target.PropertySetupList[i].PropertyInfo = null;
                            break;


                        case TargetOverrideType.Field:
                            if (!m_target.PropertySetupList[i].TargetObject) continue;
                            m_target.PropertySetupList[i].TargetComponent = m_target.PropertySetupList[i].TargetObject?.GetComponent(m_target.PropertySetupList[i].TargetComponentName);
                            m_target.PropertySetupList[i].FieldInfo = m_target.PropertySetupList[i].TargetComponent?.GetType().GetField(m_target.PropertySetupList[i].TargetPropertyName);

                            // FieldInfo.SetValue is called only if it is not null, so make sure it is null if the target type don't match the custom property type
                            if (m_target.PropertySetupList[i].FieldInfo == null) continue;
                            if (m_target.PropertySetupList[i].FieldInfo.FieldType != m_customPropertyTypes[(int)m_target.PropertySetupList[i].PropertyType])
                                m_target.PropertySetupList[i].FieldInfo = null;
                            break;


                        case TargetOverrideType.GlobalProperty:
                            m_target.PropertySetupList[i].TargetGlobalType = Type.GetType(m_target.PropertySetupList[i].TargetComponentName);
                            m_target.PropertySetupList[i].PropertyInfo = m_target.PropertySetupList[i].TargetGlobalType?.GetProperty(m_target.PropertySetupList[i].TargetPropertyName);

                            // PropertyInfo.SetValue is called only if it is not null, so make sure it is null if the target type don't match the custom property type
                            if (m_target.PropertySetupList[i].PropertyInfo == null) continue;
                            if (m_target.PropertySetupList[i].PropertyInfo.PropertyType != m_customPropertyTypes[(int)m_target.PropertySetupList[i].PropertyType])
                                m_target.PropertySetupList[i].PropertyInfo = null;
                            break;


                        case TargetOverrideType.GlobalField:
                            m_target.PropertySetupList[i].TargetGlobalType = Type.GetType(m_target.PropertySetupList[i].TargetComponentName);
                            m_target.PropertySetupList[i].FieldInfo = m_target.PropertySetupList[i].TargetGlobalType?.GetField(m_target.PropertySetupList[i].TargetPropertyName);

                            // FieldInfo.SetValue is called only if it is not null, so make sure it is null if the target type don't match the custom property type
                            if (m_target.PropertySetupList[i].FieldInfo == null) continue;
                            if (m_target.PropertySetupList[i].FieldInfo.FieldType != m_customPropertyTypes[(int)m_target.PropertySetupList[i].PropertyType])
                                m_target.PropertySetupList[i].FieldInfo = null;
                            break;
                    }
                }
            }
        }


        /// <summary>
        /// The type list used to check if the type of the target property to override match the custom property type.
        /// </summary>
        private Type[] m_customPropertyTypes = new Type[]
        {
            typeof(float),   // Float
            typeof(Color),   // Color
            typeof(float),   // Curve
            typeof(Color),   // Gradient
            typeof(Texture), // Texture
            typeof(Vector3)  // Vector3
        };


        /// <summary>
        /// Returns true if the custom property type is the same type as the target property.
        /// </summary>
        private bool CheckTargetMatch(int index, PropertyInfo propertyInfo)
        {
            if (propertyInfo == null) return false;
            if (propertyInfo.PropertyType == m_customPropertyTypes[(int)index])
            {
                return true;
            }
            else return false;
        }


        /// <summary>
        /// Returns true if the custom property type is the same type as the target property.
        /// </summary>
        private bool CheckTargetMatch(int index, FieldInfo fieldInfo)
        {
            if (fieldInfo == null) return false;
            if (fieldInfo.FieldType == m_customPropertyTypes[(int)index])
            {
                return true;
            }
            else return false;
        }
    }
}