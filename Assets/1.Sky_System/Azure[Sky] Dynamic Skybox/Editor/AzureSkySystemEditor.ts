using UnityEngine;
using UnityEditorInternal;
using UnityEngine.AzureSky;


namespace UnityEditor.AzureSky
{
    [CustomEditor(typeof(AzureSkySystem))]
    public sealed class AzureSkySystemEditor : Editor
    {
        // Target
        private AzureSkySystem m_target;


        // Logo
        public Texture2D iconTexture;
        private Rect m_controlRect;


        // Serialized properties
        private SerializedProperty m_showFollowTargetsTab;
        private SerializedProperty m_showTimerSystemTab;
        private SerializedProperty m_reflectionProbe;
        private SerializedProperty m_followTargetList;
        private SerializedProperty m_timerSettingsList;


        // Reorderable list
        private ReorderableList m_followTargetReorderableList;
        private ReorderableList m_timerSettingsReorderableList;


        private void OnEnable()
        {
            // Get target
            m_target = (AzureSkySystem) target;


            // Find the serialized properties
            m_showFollowTargetsTab = serializedObject.FindProperty("m_showFollowTargetsTab");
            m_showTimerSystemTab = serializedObject.FindProperty("m_showTimerSystemTab");
            m_reflectionProbe = serializedObject.FindProperty("m_reflectionProbe");
            m_followTargetList = serializedObject.FindProperty("m_followTargetList");
            m_timerSettingsList = serializedObject.FindProperty("m_timerSettingsList");


            // Create the follow targets reorderable list
            m_followTargetReorderableList = new ReorderableList(serializedObject, m_followTargetList, true, true, true, true)
            {
                drawElementCallback = (Rect rect, int index, bool isActive, bool isFocused) =>
                {
                    // Utilities
                    float height = 18f;
                    m_controlRect = new Rect(rect.x, rect.y, rect.width, height);
                    m_controlRect.y += 2f;


                    // Getting element properties
                    SerializedProperty element = m_followTargetList.GetArrayElementAtIndex(index);
                    SerializedProperty follower = element.FindPropertyRelative("m_follower");
                    SerializedProperty target = element.FindPropertyRelative("m_target");


                    // Draw the transform fields
                    EditorGUI.PropertyField(m_controlRect, follower);
                    m_controlRect.y += 20f;
                    EditorGUI.PropertyField(m_controlRect, target);
                },


                drawHeaderCallback = (Rect rect) =>
                {
                    EditorGUI.LabelField(rect, "Follow Targets", EditorStyles.boldLabel);
                },


                elementHeightCallback = (int index) =>
                {
                    return 45f;
                },


                drawElementBackgroundCallback = (rect, index, active, focused) =>
                {
                    if (active)
                        GUI.Label(new Rect(rect.x + 2f, rect.y - 2.0f, rect.width - 4f, rect.height), "", "selectionRect");
                }
            };


            // Create the quality settings reorderable list
            m_timerSettingsReorderableList = new ReorderableList(serializedObject, m_timerSettingsList, true, true, true, true)
            {
                drawElementCallback = (Rect rect, int index, bool isActive, bool isFocused) =>
                {
                    // Utilities
                    float height = 18f;
                    m_controlRect = new Rect(rect.x, rect.y, rect.width, height);


                    m_controlRect.x += 13f;
                    m_controlRect.width -= 18f;
                    m_target.TimerSettingsList[index].IsExpanded = EditorGUI.BeginFoldoutHeaderGroup(m_controlRect, m_target.TimerSettingsList[index].IsExpanded, "Timer Number: " + index.ToString());
                    m_controlRect.x -= 13f;
                    m_controlRect.width += 18f;


                    if (m_target.TimerSettingsList[index].IsExpanded)
                    {
                        // Getting element properties
                        SerializedProperty element = m_timerSettingsList.GetArrayElementAtIndex(index);
                        SerializedProperty refreshRate = element.FindPropertyRelative("m_refreshRate");
                        SerializedProperty executeOnAwake = element.FindPropertyRelative("m_executeOnAwake");
                        SerializedProperty timerEvent = element.FindPropertyRelative("m_timerEvent");


                        // Refresh Rate
                        m_controlRect.y += 20f;
                        EditorGUI.PropertyField(m_controlRect, refreshRate);
                        
                        
                        // Execute on Awake event
                        m_controlRect.y += 20f;
                        EditorGUI.PropertyField(m_controlRect, executeOnAwake);


                        // Timer Events
                        m_controlRect.y += 20f;
                        EditorGUI.PropertyField(m_controlRect, timerEvent);
                    }
                    EditorGUI.EndFoldoutHeaderGroup();
                },


                drawHeaderCallback = (Rect rect) =>
                {
                    EditorGUI.LabelField(rect, "Timer Settings", EditorStyles.boldLabel);
                },


                onAddCallback = (ReorderableList l) =>
                {
                    ReorderableList.defaultBehaviours.DoAddButton(l);
                    serializedObject.ApplyModifiedProperties();

                    m_target.TimerSettingsList[l.index].RefreshRate = 0.1f;

                    for (int i = 0; i < m_target.TimerSettingsList[l.index].EventListenersCount; i++)
                    {
                        m_target.TimerSettingsList[l.index].TimerEvent = new UnityEngine.Events.UnityEvent();
                    }
                },


                elementHeightCallback = (int index) =>
                {
                    if (m_timerSettingsList.arraySize > 0)
                    {
                        if (m_target.TimerSettingsList[index].IsExpanded)
                        {
                            if (m_target.TimerSettingsList[index].EventListenersCount > 0)
                            {
                                return m_target.TimerSettingsList[index].EventListenersCount * 49f + 120f;
                            }

                            return 169f;
                        }
                    }

                    return 22f;
                },


                drawElementBackgroundCallback = (rect, index, active, focused) =>
                {
                    if (active)
                        GUI.Label(new Rect(rect.x + 2f, rect.y - 3.0f, rect.width - 4f, rect.height), "", "selectionRect");
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
            EditorGUI.LabelField(new Rect(m_controlRect.x - 14f, m_controlRect.y, m_controlRect.width + 14f, m_controlRect.height), "", "", "selectionRect");
            if (iconTexture) GUI.DrawTexture(new Rect(m_controlRect.x + 3f, m_controlRect.y + 3f, 32f, 32f), iconTexture);
            GUI.Label(new Rect(m_controlRect.x + 38f, m_controlRect.y + 3f, m_controlRect.width, 22f), "Azure Sky System", EditorStyles.whiteLargeLabel);
            GUI.Label(new Rect(m_controlRect.x + 38f, m_controlRect.y + 17f, m_controlRect.width, 22f), "Version 8.0.0", EditorStyles.whiteMiniLabel);


            EditorGUILayout.Space();
            EditorGUILayout.PropertyField(m_reflectionProbe);


            // Begin the follow targets tab
            m_controlRect = EditorGUILayout.GetControlRect();
            m_controlRect.width -= 4f;
            m_showFollowTargetsTab.isExpanded = EditorGUI.BeginFoldoutHeaderGroup(m_controlRect, m_showFollowTargetsTab.isExpanded, "    Follow Targets", "HelpBox");
            EditorGUI.Foldout(m_controlRect, m_showFollowTargetsTab.isExpanded, "");
            if (m_showFollowTargetsTab.isExpanded)
            {
                m_followTargetReorderableList.DoLayoutList();
                EditorGUILayout.Space();
            }
            EditorGUILayout.EndFoldoutHeaderGroup();


            // Begin the timer settings tab
            m_controlRect = EditorGUILayout.GetControlRect();
            m_controlRect.width -= 4f;
            m_showTimerSystemTab.isExpanded = EditorGUI.BeginFoldoutHeaderGroup(m_controlRect, m_showTimerSystemTab.isExpanded, "    Timer System", "HelpBox");
            EditorGUILayout.EndFoldoutHeaderGroup();
            EditorGUI.Foldout(m_controlRect, m_showTimerSystemTab.isExpanded, "");
            if (m_showTimerSystemTab.isExpanded)
            {
                m_timerSettingsReorderableList.DoLayoutList();
                EditorGUILayout.Space();
            }


            // Update the inspector when there is a change
            if (EditorGUI.EndChangeCheck())
            {
                serializedObject.ApplyModifiedProperties();
            }
        }
    }
}