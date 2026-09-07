/// --- SUMMARY ---
/// AzureEventControllerEditor (Enhanced Layout Fix)
/// Custom inspector for AzureEventController with corrected element stacking.
/// - Fixes foldout overlap / incorrect rect heights.
/// - Keeps name/category labeling, search/filter, and runtime flag management.
/// - Auto-calculates dynamic height based on actually drawn content.
/// - Stable UnityEvent rendering.
/// -----------------------------------

using UnityEditor;
using UnityEditorInternal;
using UnityEngine;
using UnityEngine.AzureSky;

namespace UnityEditor.AzureSky
{
    [CustomEditor(typeof(AzureEventController))]
    public sealed class AzureEventControllerEditor : Editor
    {
        private AzureEventController m_target;
        public Texture2D iconTexture;
        private Rect m_controlRect;

        private int[] m_hourMinute;
        private int[] m_dayMonthYear;
        private readonly GUIContent[] m_hourMinuteContents = { new GUIContent("Hour"), new GUIContent("Minute") };
        private readonly GUIContent[] m_dayMonthYearContents = { new GUIContent("Day"), new GUIContent("Month"), new GUIContent("Year") };

        private SerializedProperty m_minuteChangeEvent;
        private SerializedProperty m_hourChangeEvent;
        private SerializedProperty m_dayChangeEvent;
        private SerializedProperty m_monthChangeEvent;
        private SerializedProperty m_yearChangeEvent;
        private SerializedProperty m_eventScanMode;
        private SerializedProperty m_customTimeEventList;

        private ReorderableList m_customTimeEventsReorderableList;

        private string m_searchFilter = string.Empty;

        private void OnEnable()
        {
            m_target = (AzureEventController)target;

            m_minuteChangeEvent = serializedObject.FindProperty("m_minuteChangeEvent");
            m_hourChangeEvent = serializedObject.FindProperty("m_hourChangeEvent");
            m_dayChangeEvent = serializedObject.FindProperty("m_dayChangeEvent");
            m_monthChangeEvent = serializedObject.FindProperty("m_monthChangeEvent");
            m_yearChangeEvent = serializedObject.FindProperty("m_yearChangeEvent");
            m_eventScanMode = serializedObject.FindProperty("m_eventScanMode");
            m_customTimeEventList = serializedObject.FindProperty("m_customTimeEventList");

            m_customTimeEventsReorderableList = new ReorderableList(serializedObject, m_customTimeEventList, true, true, true, true)
            {
                drawHeaderCallback = rect =>
                {
                    EditorGUI.LabelField(rect, $"Custom Time Events ({m_customTimeEventList.arraySize})", EditorStyles.boldLabel);
                },

                drawElementCallback = (rect, index, isActive, isFocused) =>
                {
                    if (index < 0 || index >= m_customTimeEventList.arraySize) return;

                    var element = m_customTimeEventList.GetArrayElementAtIndex(index);
                    if (element == null) return;

                    SerializedProperty nameProp = FindPropertyByNames(element, new[] { "Name", "name", "eventName", "m_name" });
                    SerializedProperty categoryProp = FindPropertyByNames(element, new[] { "Category", "category", "m_category" });

                    string label = $"Custom Event: {index}";
                    if (nameProp != null && !string.IsNullOrEmpty(nameProp.stringValue)) label = nameProp.stringValue;
                    if (categoryProp != null && !string.IsNullOrEmpty(categoryProp.stringValue)) label += $" [{categoryProp.stringValue}]";

                    EnsureExpandedFlag(index);
                    float y = rect.y;
                    float line = EditorGUIUtility.singleLineHeight + 2f;
                    Rect foldRect = new Rect(rect.x, y, rect.width, line);

                    bool expanded = m_target.CustomTimeEventList[index].IsExpanded;
                    bool newExpanded = EditorGUI.BeginFoldoutHeaderGroup(foldRect, expanded, label);
                    if (newExpanded != expanded)
                    {
                        m_target.CustomTimeEventList[index].IsExpanded = newExpanded;
                        EditorUtility.SetDirty(m_target);
                    }
                    EditorGUI.EndFoldoutHeaderGroup();

                    if (!newExpanded) return;

                    y += line + 4f;
                    EditorGUI.indentLevel++;

                    // Time fields
                    SerializedProperty minuteProp = FindPropertyByNames(element, new[] { "m_minute", "Minute" });
                    SerializedProperty hourProp = FindPropertyByNames(element, new[] { "m_hour", "Hour" });
                    SerializedProperty dayProp = FindPropertyByNames(element, new[] { "m_day", "Day" });
                    SerializedProperty monthProp = FindPropertyByNames(element, new[] { "m_month", "Month" });
                    SerializedProperty yearProp = FindPropertyByNames(element, new[] { "m_year", "Year" });
                    SerializedProperty unityEventProp = FindPropertyByNames(element, new[] { "m_event", "Event" });

                    // Hour / Minute
                    Rect rowRect = new Rect(rect.x + 16f, y, rect.width - 16f, line);
                    m_hourMinute = new int[]
                    {
                        hourProp != null ? hourProp.intValue : -1,
                        minuteProp != null ? minuteProp.intValue : -1
                    };
                    EditorGUI.MultiIntField(rowRect, m_hourMinuteContents, m_hourMinute);
                    if (hourProp != null) hourProp.intValue = Mathf.Clamp(m_hourMinute[0], -1, 23);
                    if (minuteProp != null) minuteProp.intValue = Mathf.Clamp(m_hourMinute[1], -1, 59);

                    y += line + 2f;
                    EditorGUI.LabelField(new Rect(rect.x + 16f, y, rect.width, line),
                        new GUIContent("Use -1 to ignore this field (wildcard)."), EditorStyles.miniLabel);

                    // Day / Month / Year
                    y += line + 2f;
                    m_dayMonthYear = new int[]
                    {
                        dayProp != null ? dayProp.intValue : -1,
                        monthProp != null ? monthProp.intValue : -1,
                        yearProp != null ? yearProp.intValue : -1
                    };
                    EditorGUI.MultiIntField(new Rect(rect.x + 16f, y, rect.width - 16f, line), m_dayMonthYearContents, m_dayMonthYear);
                    if (dayProp != null) dayProp.intValue = Mathf.Clamp(m_dayMonthYear[0], -1, 31);
                    if (monthProp != null) monthProp.intValue = Mathf.Clamp(m_dayMonthYear[1], -1, 12);
                    if (yearProp != null) yearProp.intValue = m_dayMonthYear[2];

                    // Name / Category
                    y += line + 4f;
                    if (nameProp != null)
                    {
                        EditorGUI.PropertyField(new Rect(rect.x + 16f, y, rect.width - 16f, line), nameProp);
                        y += line + 2f;
                    }
                    if (categoryProp != null)
                    {
                        EditorGUI.PropertyField(new Rect(rect.x + 16f, y, rect.width - 16f, line), categoryProp);
                        y += line + 2f;
                    }

                    // Unity Event
                    if (unityEventProp != null)
                    {
                        float eventHeight = EditorGUI.GetPropertyHeight(unityEventProp, true);
                        EditorGUI.PropertyField(new Rect(rect.x + 16f, y, rect.width - 16f, eventHeight), unityEventProp, true);
                        y += eventHeight + 4f;
                    }

                    EditorGUI.indentLevel--;
                },

                elementHeightCallback = (index) =>
                {
                    if (index < 0 || index >= m_customTimeEventList.arraySize) return 22f;
                    var runtimeList = m_target?.CustomTimeEventList;
                    if (runtimeList == null || index >= runtimeList.Count || runtimeList[index] == null)
                        return 22f;
                    if (!runtimeList[index].IsExpanded) return 22f;

                    var element = m_customTimeEventList.GetArrayElementAtIndex(index);
                    SerializedProperty unityEventProp = FindPropertyByNames(element, new[] { "m_event", "Event" });
                    float unityEventHeight = unityEventProp != null ? EditorGUI.GetPropertyHeight(unityEventProp, true) : 0f;

                    float total =
                        (EditorGUIUtility.singleLineHeight + 2f) * 6f + // time + hint + date + name + category
                        unityEventHeight + 20f;
                    return total;
                },

                drawElementBackgroundCallback = (rect, index, active, focused) =>
                {
                    if (active)
                        GUI.Label(new Rect(rect.x + 2f, rect.y - 2f, rect.width - 4f, rect.height), "", "selectionRect");
                }
            };
        }

        private SerializedProperty FindPropertyByNames(SerializedProperty parent, string[] names)
        {
            if (parent == null) return null;
            foreach (var n in names)
            {
                var p = parent.FindPropertyRelative(n);
                if (p != null) return p;
            }
            return null;
        }

        private void EnsureExpandedFlag(int index)
        {
            if (m_target == null || m_target.CustomTimeEventList == null) return;
            if (index < 0 || index >= m_target.CustomTimeEventList.Count) return;
        }

        public override void OnInspectorGUI()
        {
            serializedObject.Update();
            EditorGUI.BeginChangeCheck();

            DrawHeader();

            EditorGUILayout.Space();
            EditorGUILayout.PropertyField(m_minuteChangeEvent);
            EditorGUILayout.PropertyField(m_hourChangeEvent);
            EditorGUILayout.PropertyField(m_dayChangeEvent);
            EditorGUILayout.PropertyField(m_monthChangeEvent);
            EditorGUILayout.PropertyField(m_yearChangeEvent);

            EditorGUILayout.Space(10);
            EditorGUILayout.PropertyField(m_eventScanMode);

            EditorGUILayout.BeginHorizontal();
            m_searchFilter = EditorGUILayout.TextField(m_searchFilter, GUILayout.MinWidth(120));
            if (GUILayout.Button("Clear", GUILayout.Width(50))) m_searchFilter = string.Empty;
            if (GUILayout.Button("Add Event", GUILayout.Width(90)))
            {
                m_customTimeEventList.arraySize++;
                serializedObject.ApplyModifiedProperties();
            }
            EditorGUILayout.EndHorizontal();

            EditorGUILayout.Space(4);
            m_customTimeEventsReorderableList.DoLayoutList();

            if (EditorGUI.EndChangeCheck())
            {
                serializedObject.ApplyModifiedProperties();
                EditorUtility.SetDirty(m_target);
            }
        }

        private void DrawHeader()
        {
            m_controlRect = EditorGUILayout.GetControlRect(GUILayout.Height(40f));
            EditorGUI.LabelField(m_controlRect, "", "", "selectionRect");
            if (iconTexture) GUI.DrawTexture(new Rect(m_controlRect.x + 4f, m_controlRect.y + 4f, 32f, 32f), iconTexture);
            GUI.Label(new Rect(m_controlRect.x + 42f, m_controlRect.y + 6f, m_controlRect.width, 18f), "Azure Event Controller", EditorStyles.whiteLargeLabel);
            GUI.Label(new Rect(m_controlRect.x + 42f, m_controlRect.y + 22f, m_controlRect.width, 14f), "Version 1.2.0 (Editor)", EditorStyles.whiteMiniLabel);
        }
    }
}
