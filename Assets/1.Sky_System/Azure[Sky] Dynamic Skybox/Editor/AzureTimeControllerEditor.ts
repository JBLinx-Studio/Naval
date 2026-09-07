using System;
using UnityEditorInternal;
using UnityEngine;
using UnityEngine.AzureSky;


namespace UnityEditor.AzureSky
{
    [CustomEditor(typeof(AzureTimeController))]
    public sealed class AzureTimeControllerEditor : Editor
    {
        // Target
        private AzureTimeController m_target;


        // Logo
        public Texture2D iconTexture;


        // Utilities
        private Rect m_controlRect;
        private bool m_showFastDateSelector;
        private int[] m_fastDateSelector = new int[3];
        private readonly GUIContent[] m_dateSelectorContent = new[]
        {
            new GUIContent("Month", ""),
            new GUIContent("Day", ""),
            new GUIContent("Year", "")
        };


        // Serialized properties
        private SerializedProperty m_sunTransform;
        private SerializedProperty m_moonTransform;
        private SerializedProperty m_directionalLight;
        private SerializedProperty m_selectedCalendarDay;
        private SerializedProperty m_day;
        private SerializedProperty m_month;
        private SerializedProperty m_year;
        private SerializedProperty m_timeSystemMode;
        private SerializedProperty m_timeSystemDirection;
        private SerializedProperty m_timeSystemLoop;
        private SerializedProperty m_updateMode;
        private SerializedProperty m_startTimeSource;
        private SerializedProperty m_timeline;
        private SerializedProperty m_latitude;
        private SerializedProperty m_longitude;
        private SerializedProperty m_utc;
        private SerializedProperty m_dayLength;
        private SerializedProperty m_minLightAltitude;
        private SerializedProperty m_evaluateTimeByCurve;
        private SerializedProperty m_timeLengthCurve;
        private SerializedProperty m_celestialBodiesList;


        private int m_tempSelectedCalendarDay;
        private string m_dateDisplay = "January 01, 2022";
        private string m_timeDisplay = "Friday, 06:00";
        private GUIContent[] m_contents = new GUIContent[]
        {
            new GUIContent("Evaluate Time of Day by Curve?", "Will the 'time of day' be evaluated based on the timeline or based on the day-night length curve?"),
            new GUIContent("Current Time of Day:", "Displays the current 'time of day' based on the 'time position' of the day-night cycle"),
            new GUIContent("Sun Transform", "The transform that will represent the position of the sun in the sky."),
            new GUIContent("Moon Transform", "The transform that will represent the position of the moon in the sky."),
            new GUIContent("Directional Light", "The directional light that will apply the sun and moon lighting to the scene."),
            new GUIContent(" ", " "),
            new GUIContent("Time Direction", "The direction in which the time of day will flow."),
            new GUIContent("Time Loop", "How the time system should perform the day cycle loop."),
            new GUIContent("Update Mode", "The way the sun, moon and directional light transforms should be updated."),
            new GUIContent("Timeline", "The current 'time position' in the day-night cycle. Note that this may not represent the correct time of day."),
            new GUIContent("Latitude", "The north-south angle of a position on the Earth's surface."),
            new GUIContent("Longitude", "The east-west angle of a position on the Earth's surface."),
            new GUIContent("UTC", "Universal Time Coordinated."),
            new GUIContent("Day Length", "Duration of the day-night cycle in minutes."),
            new GUIContent("Min Light Altitude", "The minimum directional light altitude (0° - 90°). You can use this to avoid the shadows to get stretched when the sun is close to the horizon at sunset."),
            new GUIContent("Time Mode", "The time system mode used to perform the celestial bodies transform rotations.")
        };


        // Reorderable list
        private ReorderableList m_celestialBodiesReorderableList;


        private void OnEnable()
        {
            // Get target
            m_target = (AzureTimeController) target;


            // Always update the calendar when enabled
            m_target.UpdateCalendar();


            // Find the serialized properties
            m_sunTransform = serializedObject.FindProperty("m_sunTransform");
            m_moonTransform = serializedObject.FindProperty("m_moonTransform");
            m_directionalLight = serializedObject.FindProperty("m_directionalLight");
            m_selectedCalendarDay = serializedObject.FindProperty("m_selectedCalendarDay");
            m_day = serializedObject.FindProperty("m_day");
            m_month = serializedObject.FindProperty("m_month");
            m_year = serializedObject.FindProperty("m_year");
            m_timeSystemMode = serializedObject.FindProperty("m_timeSystemMode");
            m_timeSystemDirection = serializedObject.FindProperty("m_timeSystemDirection");
            m_timeSystemLoop = serializedObject.FindProperty("m_timeSystemLoop");
            m_updateMode = serializedObject.FindProperty("m_updateMode");
            m_startTimeSource = serializedObject.FindProperty("m_startTimeSource");
            m_timeline = serializedObject.FindProperty("m_timeline");
            m_latitude = serializedObject.FindProperty("m_latitude");
            m_longitude = serializedObject.FindProperty("m_longitude");
            m_utc = serializedObject.FindProperty("m_utc");
            m_dayLength = serializedObject.FindProperty("m_dayLength");
            m_minLightAltitude = serializedObject.FindProperty("m_minLightAltitude");
            m_evaluateTimeByCurve = serializedObject.FindProperty("m_evaluateTimeByCurve");
            m_timeLengthCurve = serializedObject.FindProperty("m_timeLengthCurve");
            m_celestialBodiesList = serializedObject.FindProperty("m_celestialBodiesList");


            // Create the celestial bodies list
            m_celestialBodiesReorderableList = new ReorderableList(serializedObject, m_celestialBodiesList, true, true, true, true)
            {
                drawElementCallback = (Rect rect, int index, bool isActive, bool isFocused) =>
                {
                    // Utilities
                    float height = 18f;
                    m_controlRect = new Rect(rect.x, rect.y, rect.width, height);


                    // Getting element properties
                    SerializedProperty element = m_celestialBodiesList.GetArrayElementAtIndex(index);
                    SerializedProperty transform = element.FindPropertyRelative("m_transform");
                    SerializedProperty type = element.FindPropertyRelative("m_type");


                    // Celestial Body Transform
                    EditorGUI.PropertyField(m_controlRect, transform);


                    // Celestial Body Type
                    m_controlRect.y += 20f;
                    EditorGUI.PropertyField(m_controlRect, type);
                },


                drawHeaderCallback = (Rect rect) =>
                {
                    EditorGUI.LabelField(rect, "Celestial Bodies", EditorStyles.boldLabel);
                },


                elementHeightCallback = (int index) =>
                {
                    return 42f;
                },


                drawElementBackgroundCallback = (rect, index, active, focused) =>
                {
                    if (active)
                        GUI.Label(new Rect(rect.x + 2f, rect.y - 2.5f, rect.width - 4f, rect.height), "", "selectionRect");
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
            if (iconTexture) GUI.DrawTexture(new Rect(m_controlRect.x +  3f, m_controlRect.y + 3f, 32f, 32f), iconTexture);
            GUI.Label(new Rect(m_controlRect.x + 38f, m_controlRect.y +  3f, m_controlRect.width, 22f), "Azure Time Controller", EditorStyles.whiteLargeLabel);
            GUI.Label(new Rect(m_controlRect.x + 38f, m_controlRect.y + 17f, m_controlRect.width, 22f), "Version 1.0.0", EditorStyles.whiteMiniLabel);


            // Calendar header buttons
            EditorGUILayout.BeginHorizontal("box");
            if (GUILayout.Button("<<", EditorStyles.miniButtonLeft, GUILayout.Width(25))) { DecreaseYear(); }
            if (GUILayout.Button("<", EditorStyles.miniButtonMid, GUILayout.Width(25))) { DecreaseMonth(); }
            m_dateDisplay = m_target.CalendarMonthList[m_month.intValue - 1] + " " + m_day.intValue + ", " + m_year.intValue;
            if (GUILayout.Button(m_dateDisplay, EditorStyles.miniButtonMid))
            {
                m_showFastDateSelector = !m_showFastDateSelector;
                m_fastDateSelector[0] = m_month.intValue;
                m_fastDateSelector[1] = m_day.intValue;
                m_fastDateSelector[2] = m_year.intValue;
            }
            if (GUILayout.Button(">", EditorStyles.miniButtonMid, GUILayout.Width(25))) { IncreaseMonth(); }
            if (GUILayout.Button(">>", EditorStyles.miniButtonRight, GUILayout.Width(25))) { IncreaseYear(); }
            EditorGUILayout.EndHorizontal();


            // Display the faster day selector
            if (m_showFastDateSelector)
            {
                EditorGUILayout.Space(-4);
                EditorGUILayout.BeginVertical("box");
                EditorGUI.MultiIntField(EditorGUILayout.GetControlRect(), m_dateSelectorContent, m_fastDateSelector);
                m_fastDateSelector[0] = Mathf.Clamp(m_fastDateSelector[0], 1, 12);
                m_fastDateSelector[2] = Mathf.Clamp(m_fastDateSelector[2], 0, 9999);
                m_fastDateSelector[1] = Mathf.Min(m_fastDateSelector[1], DateTime.DaysInMonth(m_fastDateSelector[2], m_fastDateSelector[0]));
                if (GUILayout.Button("Go To", EditorStyles.miniButtonMid))
                {
                    Undo.RecordObject(m_target, "Undo Azure Time Controller");
                    m_target.SetDate(m_fastDateSelector[2], m_fastDateSelector[0], m_fastDateSelector[1]);
                    m_showFastDateSelector = false;
                }
                EditorGUILayout.EndVertical();
                EditorGUILayout.Space(3);
            }


            // Draws the days of the week strings above the selectable grid
            EditorGUILayout.BeginHorizontal("box");
            GUILayout.Label("Sun");
            GUILayout.Label("Mon");
            GUILayout.Label("Tue");
            GUILayout.Label("Wed");
            GUILayout.Label("Thu");
            GUILayout.Label("Fri");
            GUILayout.Label("Sat");
            EditorGUILayout.EndHorizontal();


            // Creates the calendar selectable grid
            EditorGUILayout.BeginVertical("Box");
            m_controlRect = EditorGUILayout.GetControlRect(GUILayout.Height(130f));
            m_tempSelectedCalendarDay = GUI.SelectionGrid(m_controlRect, m_selectedCalendarDay.intValue, m_target.CalendarNumericList, 7);
            if (m_target.CalendarNumericList[m_tempSelectedCalendarDay] != "")
            {
                if (m_selectedCalendarDay.intValue != m_tempSelectedCalendarDay)
                {
                    m_selectedCalendarDay.intValue = m_tempSelectedCalendarDay;
                    m_day.intValue = m_selectedCalendarDay.intValue + 1 - m_target.GetDayOfWeekIndex(m_year.intValue, m_month.intValue, 1);
                    AzureNotificationCenterEditor.Invoke.DayChangeCallback(m_target);
                }
            }
            EditorGUILayout.EndVertical();


            // Transform references
            EditorGUILayout.PropertyField(m_sunTransform, m_contents[2]);
            EditorGUILayout.PropertyField(m_moonTransform, m_contents[3]);
            EditorGUILayout.PropertyField(m_directionalLight, m_contents[4]);


            // Time modes
            EditorGUILayout.PropertyField(m_timeSystemMode, m_contents[15]);
            EditorGUILayout.PropertyField(m_timeSystemDirection, m_contents[6]);
            EditorGUILayout.PropertyField(m_timeSystemLoop, m_contents[7]);
            EditorGUILayout.PropertyField(m_updateMode, m_contents[8]);
            EditorGUILayout.PropertyField(m_startTimeSource);


            // Sliders
            EditorGUILayout.Slider(m_timeline, 0.0f, 24.0f, m_contents[9]);
            EditorGUILayout.Slider(m_latitude, -90.0f, 90.0f, m_contents[10]);
            EditorGUILayout.Slider(m_longitude, -180.0f, 180.0f, m_contents[11]);
            if (m_timeSystemMode.enumValueIndex == 1)
            {
                EditorGUILayout.Slider(m_utc, -12.0f, 12.0f, m_contents[12]);
            }


            // Time options
            EditorGUILayout.PropertyField(m_dayLength, m_contents[13]);
            EditorGUILayout.PropertyField(m_minLightAltitude, m_contents[14]);
            m_minLightAltitude.floatValue = Mathf.Clamp(m_minLightAltitude.floatValue, 0.0f, 90.0f);


            // Day-Night length START
            m_controlRect = EditorGUILayout.GetControlRect(GUILayout.Height(90f));
            EditorGUI.LabelField(m_controlRect, "", "", "box");


            // Title
            GUI.Label(new Rect(m_controlRect.x, m_controlRect.y, m_controlRect.width, 18f), "Day and Night Length", AzureEditorStyles.centeredLabel);


            // Toggle
            GUI.Label(new Rect(m_controlRect.x + 3f, m_controlRect.y + 18f, m_controlRect.width, 18f), m_contents[0]);
            EditorGUI.PropertyField(new Rect(m_controlRect.x + m_controlRect.width - 15f, m_controlRect.y + 18f, 18f, 18f), m_evaluateTimeByCurve, GUIContent.none);


            // Reset Button
            if (GUI.Button(new Rect(m_controlRect.x + 3f, m_controlRect.y + 36f, 36f, 36f), "R"))
            {
                //Undo.RecordObject(m_target, "Undo Dynamic Time System");
                m_timeLengthCurve.animationCurveValue = AnimationCurve.Linear(0f, 0f, 24f, 24f);
            }


            // Time length curve
            EditorGUI.CurveField(new Rect(m_controlRect.x + 42f, m_controlRect.y + 36f, m_controlRect.width - 42f, 36f), m_timeLengthCurve, Color.yellow, new Rect(0f, 0f, 24f, 24f), GUIContent.none);


            // Time of day display
            m_timeDisplay = m_target.DayOfWeek.ToString() + ", " + m_target.Hour.ToString("00") + ":" + m_target.Minute.ToString("00");
            GUI.Label(new Rect(m_controlRect.x + 3f, m_controlRect.y + 72f, m_controlRect.width, 18f), m_contents[1]);
            GUI.Label(new Rect(m_controlRect.x, m_controlRect.y + 72f, m_controlRect.width - 3f, 18f), m_timeDisplay, AzureEditorStyles.rightLabel);


            if (m_timeSystemMode.enumValueIndex == 1)
            {
                EditorGUILayout.Space();
                m_celestialBodiesReorderableList.DoLayoutList();
            }


            // Update the inspector when there is a change
            if (EditorGUI.EndChangeCheck())
            {
                serializedObject.ApplyModifiedProperties();
                m_target.UpdateCalendar();
                m_target.ComputeTimeProgressionStep();
            }
        }


        /// <summary>
        /// Increases a month in the calendar.
        /// </summary>
        private void IncreaseMonth()
        {
            m_month.intValue++;

            if (m_month.intValue > 12)
            {
                m_month.intValue = 1;
                IncreaseYear();
                AzureNotificationCenterEditor.Invoke.MonthChangeCallback(m_target);
            }
        }


        /// <summary>
        /// Decreases a month in the calendar.
        /// </summary>
        private void DecreaseMonth()
        {
            m_month.intValue--;

            if (m_month.intValue < 1)
            {
                m_month.intValue = 12;
                DecreaseYear();
                AzureNotificationCenterEditor.Invoke.MonthChangeCallback(m_target);
            }
        }


        /// <summary>
        /// Increases a year in the calendar.
        /// </summary>
        private void IncreaseYear()
        {
            m_year.intValue++;
            if (m_year.intValue > 9999) m_year.intValue = 0;
            AzureNotificationCenterEditor.Invoke.YearChangeCallback(m_target);
        }


        /// <summary>
        /// Decreases a year in the calendar.
        /// </summary>
        private void DecreaseYear()
        {
            m_year.intValue--;
            if (m_year.intValue < 0) m_year.intValue = 9999;
            AzureNotificationCenterEditor.Invoke.YearChangeCallback(m_target);
        }
    }
}