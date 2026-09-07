using System;
using System.Collections.Generic;


namespace UnityEngine.AzureSky
{
    /// <summary>
    /// Class that handles the Time, Date, Calendar, Time Events and transform of celestial bodies based on the time, date and location.
    /// </summary>
    [ExecuteInEditMode]
    [AddComponentMenu("Azure[Sky] Dynamic Skybox/Azure Time Controller")]
    public sealed class AzureTimeController : MonoBehaviour
    {
        /// <summary>
        /// Field: Array with 42 numeric strings used to fill a calendar.
        /// </summary>
        private string[] m_calendarNumericList = new string[]
        {
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
            "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41"
        };

        /// <summary>
        /// Property: Array with 42 numeric strings used to fill a calendar.
        /// </summary>
        public string[] CalendarNumericList => m_calendarNumericList;


        /// <summary>
        /// Field: String array that stores the name of each day of week.
        /// </summary>
        private readonly string[] m_calendarWeekList = new string[]
        {
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        };

        /// <summary>
        /// Property: String array that stores the name of each day of week.
        /// </summary>
        public string[] CalendarWeekList => m_calendarWeekList;


        /// <summary>
        /// Field: String array that stores the name of each month.
        /// </summary>
        private readonly string[] m_calendarMonthList = new string[]
        {
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        };

        /// <summary>
        /// Property: String array that stores the name of each month.
        /// </summary>
        public string[] CalendarMonthList => m_calendarMonthList;


        /// <summary>
        /// Field: The day used by the calendar and date system.
        /// </summary>
        [SerializeField] private int m_day = 1;

        /// <summary>
        /// Property: The day used by the calendar and date system.
        /// </summary>
        public int Day
        {
            get => m_day;
            set { m_day = value; UpdateCalendar(); }
        }


        /// <summary>
        /// Field: The month used by the calendar and date system.
        /// </summary>
        [SerializeField] private int m_month = 1;

        /// <summary>
        /// Property: The month used by the calendar and date system.
        /// </summary>
        public int Month
        {
            get => m_month;
            set { m_month = value; UpdateCalendar(); }
        }


        /// <summary>
        /// Field: The year used by the calendar and date system.
        /// </summary>
        [SerializeField] private int m_year = 2023;

        /// <summary>
        /// Property: The year used by the calendar and date system.
        /// </summary>
        public int Year
        {
            get => m_year;
            set { m_year = value; UpdateCalendar(); }
        }


        /// <summary>
        /// Field: The current day of week.
        /// </summary>
        [SerializeField] private AzureDayOfWeek m_dayOfWeek = AzureDayOfWeek.Sunday;

        /// <summary>
        /// Property: The current day of week.
        /// </summary>
        public AzureDayOfWeek DayOfWeek => m_dayOfWeek;


        /// <summary>
        /// Field: The current selected day in the calendar.
        /// </summary>
        [SerializeField] private int m_selectedCalendarDay = 1;

        /// <summary>
        /// Property: The current selected day in the calendar.
        /// </summary>
        public int SelectedCalendarDay => m_selectedCalendarDay;


        /// <summary>
        /// Field: The number of days in the current month.
        /// </summary>
        [SerializeField] private int m_daysInMonth = 30;

        /// <summary>
        /// Property: The number of days in the current month.
        /// </summary>
        public int DaysInMonth { get => m_daysInMonth; set => m_daysInMonth = value; }


        /// <summary>
        /// Field: Used internally to create custom dates.
        /// </summary>
        private DateTime m_teporaryDateTime;


        /// <summary>
        /// Field: Used internally to get the previous month when the time direction is set to backward.
        /// </summary>
        private int m_temporaryPreviousMonth = 1;


        /// <summary>
        /// Field: Used internally to get the amount of days in the previous month when the time direction is set to backward.
        /// </summary>
        private int m_temporaryPreviousDaysInMonth = 30;


        /// <summary>
        /// Field: Used internally to get the day of week from a custom date.
        /// </summary>
        private int m_temporaryDayOfWeek = 0;


        /// <summary>
        /// Field: The transform that will represent the position of the sun in the sky.
        /// </summary>
        [SerializeField] private Transform m_sunTransform = null;

        /// <summary>
        /// Property: The transform that will represent the position of the sun in the sky.
        /// </summary>
        public Transform SunTransform { get => m_sunTransform; set => m_sunTransform = value; }


        /// <summary>
        /// Field: Stores the sun elevation in the sky.
        /// </summary>
        private float m_sunElevation = 0.0f;

        /// <summary>
        /// Property: Returns the sun elevation in the sky.
        /// </summary>
        public float SunElevation => m_sunElevation;


        /// <summary>
        /// Field: The transform that will represent the position of the moon in the sky.
        /// </summary>
        [SerializeField] private Transform m_moonTransform = null;

        /// <summary>
        /// Property: The transform that will represent the position of the moon in the sky.
        /// </summary>
        public Transform MoonTransform { get => m_moonTransform; set => m_moonTransform = value; }


        /// <summary>
        /// Field: Stores the moon elevation in the sky.
        /// </summary>
        private float m_moonElevation = 0.0f;

        /// <summary>
        /// Property: Returns the moon elevation in the sky.
        /// </summary>
        public float MoonElevation => m_moonElevation;


        /// <summary>
        /// Field: The directional light that will apply the sun and moon lighting to the scene.
        /// </summary>
        [SerializeField] private Transform m_directionalLight = null;

        /// <summary>
        /// Property: The directional light that will apply the sun and moon lighting to the scene.
        /// </summary>
        public Transform DirectionalLight { get => m_directionalLight; set => m_directionalLight = value; }

        /// <summary>
        /// Field: Used internally to compute the directional light direction.
        /// </summary>
        private Vector3 m_directionalLightDirection = Vector3.zero;


        // <summary>
        /// Field: The time system mode used to perform the celestial bodies transform rotations.
        /// </summary>
        [SerializeField] private AzureTimeSystemMode m_timeSystemMode = AzureTimeSystemMode.Simple;

        /// <summary>
        /// Property: The time system mode used to perform the celestial bodies transform rotations.
        /// </summary>
        public AzureTimeSystemMode TimeSystemMode { get => m_timeSystemMode; set => m_timeSystemMode = value; }


        /// <summary>
        /// Field: The direction in which the time of day will flow.
        /// </summary>
        [SerializeField] private AzureTimeSystemDirection m_timeSystemDirection = AzureTimeSystemDirection.Forward;

        /// <summary>
        /// Property: The direction in which the time of day will flow.
        /// </summary>
        public AzureTimeSystemDirection TimeSystemDirection { get => m_timeSystemDirection; set => m_timeSystemDirection = value; }


        /// <summary>
        /// Field: How the time system should perform the day cycle loop.
        /// </summary>
        [SerializeField] private AzureTimeSystemLoop m_timeSystemLoop = AzureTimeSystemLoop.Off;

        /// <summary>
        /// Property: How the time system should perform the day cycle loop.
        /// </summary>
        public AzureTimeSystemLoop TimeSystemLoop { get => m_timeSystemLoop; set => m_timeSystemLoop = value; }


        /// <summary>
        /// Field: The way the sun, moon and directional light transforms should be updated.
        /// </summary>
        [SerializeField] private AzureUpdateMode m_updateMode = AzureUpdateMode.LocallyEveryFrame;

        /// <summary>
        /// Property: The way the sun, moon and directional light transforms should be updated.
        /// </summary>
        public AzureUpdateMode UpdateMode { get => m_updateMode; set => m_updateMode = value; }


        /// <summary>
        /// Field: If the time of day will be initialized using the local time or the global time.
        /// </summary>
        [SerializeField] private AzureTimeStartSource m_startTimeSource = AzureTimeStartSource.FromLocalTime;

        /// <summary>
        /// Property: If the time of day will be initialized using the local time or the global time.
        /// </summary>
        public AzureTimeStartSource StartTimeSource { get => m_startTimeSource; set => m_startTimeSource = value; }


        /// <summary>
        /// Field: The current 'time position' in the day-night cycle. Note that this may not represent the correct time of day.
        /// </summary>
        [SerializeField] private float m_timeline = 6.0f;

        /// <summary>
        /// Property: The current 'time position' in the day-night cycle. Note that this may not represent the correct time of day.
        /// </summary>
        public float Timeline { get => m_timeline; set => m_timeline = value; }


        /// <summary>
        /// Field: The hour converted from the timeline.
        /// </summary>
        [SerializeField] private int m_hour = 6;

        /// <summary>
        /// Property: The hour converted from the timeline.
        /// </summary>
        public int Hour => m_hour;


        /// <summary>
        /// Field: The minute converted from the timeline.
        /// </summary>
        [SerializeField] private int m_minute = 0;

        /// <summary>
        /// Property: The minute converted from the timeline.
        /// </summary>
        public int Minute => m_minute;


        /// <summary>
        /// Field: The north-south angle of a position on the Earth's surface.
        /// </summary>
        [SerializeField] private float m_latitude = 0;

        /// <summary>
        /// Property: The north-south angle of a position on the Earth's surface.
        /// </summary>
        public float Latitude { get => m_latitude; set => m_latitude = value; }


        /// <summary>
        /// Field: The east-west angle of a position on the Earth's surface.
        /// </summary>
        [SerializeField] private float m_longitude = 0;

        /// <summary>
        /// Property: The east-west angle of a position on the Earth's surface.
        /// </summary>
        public float Longitude { get => m_longitude; set => m_longitude = value; }


        /// <summary>
        /// Field: Universal Time Coordinated.
        /// </summary>
        [SerializeField] private float m_utc = 0;

        /// <summary>
        /// Property: Universal Time Coordinated.
        /// </summary>
        public float Utc { get => m_utc; set => m_utc = value; }


        /// <summary>
        /// Field: Duration of the day-night cycle in minutes.
        /// </summary>
        [SerializeField] private float m_dayLength = 24.0f;

        /// <summary>
        /// Property: Duration of the day-night cycle in minutes.
        /// </summary>
        public float DayLength
        {
            get => m_dayLength;
            set { m_dayLength = value; ComputeTimeProgressionStep(); }
        }


        /// <summary>
        /// Field: The minimum directional light altitude (0° - 90°). You can use this to avoid the shadows to get stretched when the sun is close to the horizon at sunset.
        /// </summary>
        [SerializeField] private float m_minLightAltitude = 0.0f;

        /// <summary>
        /// Property: The minimum directional light altitude (0° - 90°). You can use this to avoid the shadows to get stretched when the sun is close to the horizon at sunset.
        /// </summary>
        public float MinLightAltitude { get => m_minLightAltitude; set => m_minLightAltitude = value; }


        /// <summary>
        /// Field: Will the 'time of day' be evaluated based on the timeline or based on the day-night length curve?
        /// </summary>
        [SerializeField] private bool m_evaluateTimeByCurve = false;

        /// <summary>
        /// Property: Will the 'time of day' be evaluated based on the timeline or based on the day-night length curve?
        /// </summary>
        public bool EvaluateTimeByCurve { get => m_evaluateTimeByCurve; set => m_evaluateTimeByCurve = value; }


        /// <summary>
        /// Field: The curve that will evaluate the daytime and nightime length.
        /// </summary>
        [SerializeField] private AnimationCurve m_timeLengthCurve = AnimationCurve.Linear(0f, 0f, 24f, 24f);

        /// <summary>
        /// Property: The curve that will evaluate the daytime and nightime length.
        /// </summary>
        public AnimationCurve TimeLengthCurve { get => m_timeLengthCurve; set => m_timeLengthCurve = value; }


        /// <summary>
        /// Field: List of celestial bodies to simulate in the realistic time system mode.
        /// </summary>
        [SerializeField] private List<AzureCelestialBody> m_celestialBodiesList = new List<AzureCelestialBody>();

        /// <summary>
        /// Property: List of celestial bodies to simulate in the realistic time system mode.
        /// </summary>
        public List<AzureCelestialBody> CelestialBodiesList { get => m_celestialBodiesList; set => m_celestialBodiesList = value; }


        /// <summary>
        /// Field: Stores the correct time of day converted from the timeline and or time length curve.
        /// </summary>
        [SerializeField] private float m_timeOfDay = 6.5f;


        /// <summary>
        /// Field: The sun elevation converted from Range(-1.0, 1.0) to Range(0.0, 1.0).
        /// </summary>
        [SerializeField] private float m_sunElevationTime = 0.0f;


        /// <summary>
        /// Field: The time progression step used to change the time of day.
        /// </summary>
        private float m_timeProgressionStep = 0f;


        /// <summary>
        /// Field: Used internally to trigger the OnMinuteChange event.
        /// </summary>
        private int m_previousMinute = 0;


        /// <summary>
        /// Field: Used internally to trigger the OnHourChange event.
        /// </summary>
        private int m_previousHour = 6;


        /// <summary>
        /// Field: The exactly Time.time the timeline transition started.
        /// </summary>
        private float m_timelineTransitionStartTime = 0.0f;


        /// <summary>
        /// Field: The start timeline point the timeline transition started.
        /// </summary>
        private float m_timelineTransitionStartPoint = 0.0f;


        /// <summary>
        /// Field: The end timeline point of the timeline transition.
        /// </summary>
        private float m_timelineTransitionEndPoint = 0.0f;


        /// <summary>
        /// Field: The duration in seconds of the timeline transition.
        /// </summary>
        private float m_timelineTransitionDuration = 0.0f;


        /// <summary>
        /// Field: The smooth step of the timeline transition.
        /// </summary>
        private float m_timelineTransitionStep = 0.0f;


        /// <summary>
        /// Field: The temporary timeline value used by the timeline transition.
        /// </summary>
        private float m_temporaryTimeline = 0.0f;


        /// <summary>
        /// Field: Is a timeline transition current running?
        /// </summary>
        private bool m_isPlayingTimelineTransition = false;

        /// <summary>
        /// Property: Is a timeline transition current running?
        /// </summary>
        public bool IsPlayingTimelineTransition => m_isPlayingTimelineTransition;


        // Awake is called before the start
        private void Awake()
        {
            ComputeTimeProgressionStep();
            m_previousMinute = m_minute;
            m_previousHour = m_hour;


            // Set the start time if it is configured to use the global time
            if (m_startTimeSource == AzureTimeStartSource.FromGlobalTime)
            {
                m_timeline = AzureNotificationCenter.GlobalTimeInfo.timeline;
            }


            // First update of the calendar to sync with the start time and date
            UpdateCalendar();


            // First update of the sun, moon and directional light transforms
            // to sync with the start time and date
            if (m_updateMode == AzureUpdateMode.LocallyEveryFrame)
            {
                UpdateCelestialBodies();
            }
        }


        // Update is called once per frame
        void Update()
        {
            // Only in gameplay
            if (Application.isPlaying)
            {
                if (!m_isPlayingTimelineTransition)
                {
                    // Moves the timeline forward
                    if (m_timeSystemDirection == AzureTimeSystemDirection.Forward)
                    {
                        m_timeline += m_timeProgressionStep * Time.deltaTime;

                        // Change to the next day in the calendar
                        if (m_timeline > 24.0f)
                        {
                            IncreaseDay();
                            m_timeline = 0.0f;
                        }
                    }
                    // Moves the timeline backward
                    else
                    {
                        m_timeline -= m_timeProgressionStep * Time.deltaTime;

                        // Change to the previous day in the calendar
                        if (m_timeline < 0.0f)
                        {
                            DecreaseDay();
                            m_timeline = 24.0f;
                        }
                    }
                }
                else
                {
                    ApplyTimelineTransition();
                }


                // Get the correct time of day from the timeline cycle
                m_timeOfDay = m_evaluateTimeByCurve ? m_timeLengthCurve.Evaluate(m_timeline) : m_timeline;


                // Convert the time of day to hour and minute
                m_hour = (int) Mathf.Floor(m_timeOfDay);
                m_minute = (int) Mathf.Floor(m_timeOfDay * 60 % 60);


                if (!m_isPlayingTimelineTransition)
                {
                    // On minute change event
                    if (m_previousMinute != m_minute)
                    {
                        m_previousMinute = m_minute;
                        AzureNotificationCenter.Invoke.MinuteChangeCallback(this);
                    }


                    // On hour change event
                    if (m_previousHour != m_hour)
                    {
                        m_previousHour = m_hour;
                        AzureNotificationCenter.Invoke.HourChangeCallback(this);
                    }


                    // Update the sun, moon and directional light internally every frame
                    if (m_updateMode == AzureUpdateMode.LocallyEveryFrame)
                    {
                        UpdateCelestialBodies();
                    }
                }
            }


            #if UNITY_EDITOR
            if (!Application.isPlaying)
            {
                // Get the correct time of day from the timeline cycle
                m_timeOfDay = m_evaluateTimeByCurve ? m_timeLengthCurve.Evaluate(m_timeline) : m_timeline;


                // Convert the time of day to hour and minute
                m_hour = (int) Mathf.Floor(m_timeOfDay);
                m_minute = (int) Mathf.Floor(m_timeOfDay * 60 % 60);


                // Update the sun, moon and directional light if there is a change made in edit mode
                UpdateCelestialBodies();
            }
            #endif


            // Set the global time info
            AzureNotificationCenter.GlobalTimeInfo.timeSystemMode = m_timeSystemMode;
            AzureNotificationCenter.GlobalTimeInfo.timeSystemDirection = m_timeSystemDirection;
            AzureNotificationCenter.GlobalTimeInfo.timeSystemLoop = m_timeSystemLoop;
            AzureNotificationCenter.GlobalTimeInfo.timeline = m_timeline;
            AzureNotificationCenter.GlobalTimeInfo.timeOfDay = m_timeOfDay;
            AzureNotificationCenter.GlobalTimeInfo.sunElevation = m_sunElevation;
            AzureNotificationCenter.GlobalTimeInfo.moonElevation = m_moonElevation;
            AzureNotificationCenter.GlobalTimeInfo.hour = m_hour;
            AzureNotificationCenter.GlobalTimeInfo.minute = m_minute;
            AzureNotificationCenter.GlobalTimeInfo.utc = m_utc;

            if (m_timeSystemMode == AzureTimeSystemMode.Simple)
            {
                AzureNotificationCenter.GlobalTimeInfo.evaluationTime = m_timeOfDay;
            }
            else
            {
                m_sunElevationTime = Mathf.InverseLerp(-1.0f, 1.0f, m_sunElevation);
                AzureNotificationCenter.GlobalTimeInfo.evaluationTime = Mathf.Lerp(0.0f, 12.0f, m_sunElevationTime);
            }
        }


        // Called when reset the component
        private void Reset()
        {
            UpdateCalendar();
        }


        /// <summary>
        /// Computes the time progression step according to the day length value.
        /// </summary>
        public void ComputeTimeProgressionStep()
        {
            if (m_dayLength > 0.0f)
            {
                m_timeProgressionStep = (24.0f / 60.0f) / m_dayLength;
            }
            else
            {
                m_timeProgressionStep = 0.0f;
            }
        }

        
        /// <summary>
        /// Starts a timeline transition to a desired time.
        /// </summary>
        public void StartTimeTransition(float targetTime, float transitionTime)
        {
            Mathf.Clamp(targetTime, 0.0f, 24.0f);
            m_timelineTransitionStartTime = Time.time;
            m_timelineTransitionStartPoint = m_timeline;
            m_timelineTransitionDuration = transitionTime;

            if (m_timeSystemDirection == AzureTimeSystemDirection.Forward)
            {
                if (targetTime < m_timeline)
                {
                    m_timelineTransitionEndPoint = m_timeline + (targetTime - m_timeline + 24f);
                }
                else { m_timelineTransitionEndPoint = targetTime; }
            }
            else
            {
                if (targetTime > m_timeline)
                {
                    m_timelineTransitionEndPoint = m_timeline - (24f - targetTime + m_timeline);
                }
                else { m_timelineTransitionEndPoint = targetTime; }
            }

            m_isPlayingTimelineTransition = true;
        }


        /// <summary>
        /// Performs the timeline transition feature.
        /// </summary>
        private void ApplyTimelineTransition()
        {
            m_timelineTransitionStep = (Time.time - m_timelineTransitionStartTime) / m_timelineTransitionDuration;
            m_temporaryTimeline = Mathf.SmoothStep(m_timelineTransitionStartPoint, m_timelineTransitionEndPoint, m_timelineTransitionStep);


            m_timeline = m_temporaryTimeline;


            if (m_timeSystemDirection == AzureTimeSystemDirection.Forward)
            {
                // Change to the next day in the calendar
                if (m_timeline > 24.0f)
                {
                    IncreaseDay();
                    m_timeline = 0.0f;
                    m_timelineTransitionStartPoint -= 24f;
                    m_timelineTransitionEndPoint -= 24f;
                }


                if (m_timeline >= m_timelineTransitionEndPoint)
                {
                    m_isPlayingTimelineTransition = false;
                }
            }
            else
            {
                // Change to the previous day in the calendar
                if (m_timeline < 0.0f)
                {
                    DecreaseDay();
                    m_timeline = 24.0f;
                    m_timelineTransitionStartPoint += 24f;
                    m_timelineTransitionEndPoint += 24f;
                }


                if (m_timeline <= m_timelineTransitionEndPoint)
                {
                    m_isPlayingTimelineTransition = false;
                }
            }
        }


        /// <summary>
        /// Updates the transforms of the sun, moon and directional light according to the time of day.
        /// </summary>
        public void UpdateCelestialBodies()
        {
            // Compute the direction of the transforms
            if (m_timeSystemMode == AzureTimeSystemMode.Simple)
            {
                m_sunTransform.localRotation = Quaternion.Euler(0.0f, m_longitude, -m_latitude) * Quaternion.Euler((m_timeOfDay * 360.0f / 24.0f) - 90.0f, 180.0f, 0.0f);
                m_moonTransform.localRotation = m_sunTransform.localRotation * Quaternion.Euler(0.0f, -180.0f, 0.0f);
                Shader.SetGlobalMatrix(AzureShaderUniforms.StarfieldMatrix, m_sunTransform.worldToLocalMatrix);
            }
            else
            {
                // Initializations
                float hour = m_timeOfDay - m_utc;
                float rad = Mathf.Deg2Rad;
                float deg = Mathf.Rad2Deg;
                float latitude = m_latitude * rad;


                // The time scale
                float d = 367 * m_year - 7 * (m_year + (m_month + 9) / 12) / 4 + 275 * m_month / 9 + m_day - 730530;
                d = d + (hour / 24.0f);


                // Obliquity of the ecliptic: The tilt of earth's axis of rotation
                float ecl = 23.4393f - 3.563E-7f * d;
                ecl *= rad;


                // Orbital elements of the sun
                float N = 0.0f;
                float i = 0.0f;
                float w = 282.9404f + 4.70935E-5f * d;
                float a = 1.000000f;
                float e = 0.016709f - 1.151E-9f * d;
                float M = 356.0470f + 0.9856002585f * d;


                // Eccentric anomaly
                M *= rad;
                float E = M + e * Mathf.Sin(M) * (1f + e * Mathf.Cos(M));


                // Sun's distance (r) and its true anomaly (v)
                float xv = Mathf.Cos(E) - e;
                float yv = Mathf.Sqrt(1.0f - (e * e)) * Mathf.Sin(E);
                float v = Mathf.Atan2(yv, xv) * deg;
                float r = Mathf.Sqrt((xv * xv) + (yv * yv));


                // Sun's true longitude
                float lonsun = (v + w) * rad;


                // Convert lonsun,r to ecliptic rectangular geocentric coordinates xs,ys:
                float xs = r * Mathf.Cos(lonsun);
                float ys = r * Mathf.Sin(lonsun);
                //    zs = 0;


                // To convert this to equatorial, rectangular, geocentric coordinates, compute:
                float xe = xs;
                float ye = ys * Mathf.Cos(ecl);
                float ze = ys * Mathf.Sin(ecl);


                // Sun's right ascension (RA) and declination (Decl):
                float RA = Mathf.Atan2(ye, xe);
                float Decl = Mathf.Atan2(ze, Mathf.Sqrt((xe * xe) + (ye * ye)));


                // The sidereal time
                float Ls = v + w;
                float GMST0 = Ls + 180.0f;
                float GMST = GMST0 + (hour * 15.0f);
                float LST = (GMST + m_longitude) * rad;


                // Azimuthal coordinates
                float HA = LST - RA;

                float x = Mathf.Cos(HA) * Mathf.Cos(Decl);
                float y = Mathf.Sin(HA) * Mathf.Cos(Decl);
                float z = Mathf.Sin(Decl);

                float xhor = (x * Mathf.Sin(latitude)) - (z * Mathf.Cos(latitude));
                float yhor = y;
                float zhor = (x * Mathf.Cos(latitude)) + (z * Mathf.Sin(latitude));

                float azimuth = Mathf.Atan2(yhor, xhor);
                float altitude = Mathf.Asin(zhor);


                // Gets the celestial rotation
                Vector3 celestialRotation;
                celestialRotation.x = altitude * deg;
                celestialRotation.y = azimuth * deg;
                celestialRotation.z = 0.0f;
                m_sunTransform.localRotation = Quaternion.Euler(celestialRotation);
                Shader.SetGlobalMatrix(AzureShaderUniforms.StarfieldMatrix,
                Matrix4x4.TRS(Vector3.zero, Quaternion.Euler(90.0f - m_latitude, 0.0f, 0.0f) * Quaternion.Euler(0.0f, m_longitude, 0.0f) * Quaternion.Euler(0.0f, LST * deg, 0.0f), Vector3.one).inverse);


                // Orbital elements of the Moon
                N = 125.1228f - 0.0529538083f * d;
                i = 5.1454f;
                w = 318.0634f + 0.1643573223f * d;
                //a = 0.002566882112227f; (AU)
                a = 60.2666f; // Earth radius
                e = 0.054900f;
                M = 115.3654f + 13.0649929509f * d;


                // Eccentric anomaly
                M *= rad;
                E = M + e * Mathf.Sin(M) * (1f + e * Mathf.Cos(M));


                // Moon's distance and true anomaly
                xv = a * (Mathf.Cos(E) - e);
                yv = a * (Mathf.Sqrt(1f - e * e) * Mathf.Sin(E));
                v = Mathf.Atan2(yv, xv) * deg;
                r = Mathf.Sqrt(xv * xv + yv * yv);


                // Moon's true longitude
                lonsun = (v + w) * rad;
                float sinLongitude = Mathf.Sin(lonsun);
                float cosLongitude = Mathf.Cos(lonsun);


                // The position in space - for the planets
                // Geocentric (Earth-centered) coordinates - for the moon
                N *= rad;
                i *= rad;

                float xh = r * (Mathf.Cos(N) * cosLongitude - Mathf.Sin(N) * sinLongitude * Mathf.Cos(i));
                float yh = r * (Mathf.Sin(N) * cosLongitude + Mathf.Cos(N) * sinLongitude * Mathf.Cos(i));
                float zh = r * (sinLongitude * Mathf.Sin(i));


                // Geocentric (Earth-centered) coordinates
                // For the moon this is the same as the position in space, there is no need to calculate again
                // float xg = xh;
                // float yg = yh;
                // float zg = zh;


                // Equatorial coordinates
                xe = xh;
                ye = yh * Mathf.Cos(ecl) - zh * Mathf.Sin(ecl);
                ze = yh * Mathf.Sin(ecl) + zh * Mathf.Cos(ecl);


                // Moon's right ascension (RA) and declination (Decl)
                RA = Mathf.Atan2(ye, xe);
                Decl = Mathf.Atan2(ze, Mathf.Sqrt(xe * xe + ye * ye));


                // The sidereal time
                // It is already calculated for the sun, there is no need to calculate again


                // Azimuthal coordinates
                HA = LST - RA;

                x = Mathf.Cos(HA) * Mathf.Cos(Decl);
                y = Mathf.Sin(HA) * Mathf.Cos(Decl);
                z = Mathf.Sin(Decl);

                xhor = x * Mathf.Sin(latitude) - z * Mathf.Cos(latitude);
                yhor = y;
                zhor = x * Mathf.Cos(latitude) + z * Mathf.Sin(latitude);

                azimuth = Mathf.Atan2(yhor, xhor);
                altitude = Mathf.Asin(zhor);


                // Gets the celestial rotation
                celestialRotation.x = altitude * deg;
                celestialRotation.y = azimuth * deg;
                celestialRotation.z = 0.0f;
                m_moonTransform.localRotation = Quaternion.Euler(celestialRotation);


                // Planets
                if (m_celestialBodiesList.Count > 0)
                {
                    AzureCelestialBody celestialBody;
                    for (int index = 0; index < m_celestialBodiesList.Count; index++)
                    {
                        celestialBody = m_celestialBodiesList[index];
                        if (!celestialBody.Transform) continue;


                        // Orbital elements of the planets
                        switch (celestialBody.Type)
                        {
                            case AzureCelestialBody.CelestialBodyType.Mercury:
                                N = 48.3313f + 3.24587E-5f * d;
                                i = 7.0047f + 5.00E-8f * d;
                                w = 29.1241f + 1.01444E-5f * d;
                                a = 0.387098f;
                                e = 0.205635f + 5.59E-10f * d;
                                M = 168.6562f + 4.0923344368f * d;
                                break;


                            case AzureCelestialBody.CelestialBodyType.Venus:
                                N = 76.6799f + 2.46590E-5f * d;
                                i = 3.3946f + 2.75E-8f * d;
                                w = 54.8910f + 1.38374E-5f * d;
                                a = 0.723330f;
                                e = 0.006773f - 1.302E-9f * d;
                                M = 48.0052f + 1.6021302244f * d;
                                break;


                            case AzureCelestialBody.CelestialBodyType.Mars:
                                N = 49.5574f + 2.11081E-5f * d;
                                i = 1.8497f - 1.78E-8f * d;
                                w = 286.5016f + 2.92961E-5f * d;
                                a = 1.523688f;
                                e = 0.093405f + 2.516E-9f * d;
                                M = 18.6021f + 0.5240207766f * d;
                                break;


                            case AzureCelestialBody.CelestialBodyType.Jupiter:
                                N = 100.4542f + 2.76854E-5f * d;
                                i = 1.3030f - 1.557E-7f * d;
                                w = 273.8777f + 1.64505E-5f * d;
                                a = 5.20256f;
                                e = 0.048498f + 4.469E-9f * d;
                                M = 19.8950f + 0.0830853001f * d;
                                break;


                            case AzureCelestialBody.CelestialBodyType.Saturn:
                                N = 113.6634f + 2.38980E-5f * d;
                                i = 2.4886f - 1.081E-7f * d;
                                w = 339.3939f + 2.97661E-5f * d;
                                a = 9.55475f;
                                e = 0.055546f - 9.499E-9f * d;
                                M = 316.9670f + 0.0334442282f * d;
                                break;


                            case AzureCelestialBody.CelestialBodyType.Uranus:
                                N = 74.0005f + 1.3978E-5f * d;
                                i = 0.7733f + 1.9E-8f * d;
                                w = 96.6612f + 3.0565E-5f * d;
                                a = 19.18171f - 1.55E-8f * d;
                                e = 0.047318f + 7.45E-9f * d;
                                M = 142.5905f + 0.011725806f * d;
                                break;


                            case AzureCelestialBody.CelestialBodyType.Neptune:
                                N = 131.7806f + 3.0173E-5f * d;
                                i = 1.7700f - 2.55E-7f * d;
                                w = 272.8461f - 6.027E-6f * d;
                                a = 30.05826f + 3.313E-8f * d;
                                e = 0.008606f + 2.15E-9f * d;
                                M = 260.2471f + 0.005995147f * d;
                                break;


                            // No analytical theory has ever been constructed for the planet Pluto.
                            // Our most accurate representation of the motion of this planet is from numerical integrations.
                            case AzureCelestialBody.CelestialBodyType.Pluto:
                                float S = 50.03f + 0.033459652f * d;
                                float P = 238.95f + 0.003968789f * d;

                                S *= rad;
                                P *= rad;

                                float pluto_lonecl = 238.9508f + 0.00400703f * d
                                                   - 19.799f * Mathf.Sin(P) + 19.848f * Mathf.Cos(P)
                                                   + 0.897f * Mathf.Sin(2 * P) - 4.956f * Mathf.Cos(2 * P)
                                                   + 0.610f * Mathf.Sin(3 * P) + 1.211f * Mathf.Cos(3 * P)
                                                   - 0.341f * Mathf.Sin(4 * P) - 0.190f * Mathf.Cos(4 * P)
                                                   + 0.128f * Mathf.Sin(5 * P) - 0.034f * Mathf.Cos(5 * P)
                                                   - 0.038f * Mathf.Sin(6 * P) + 0.031f * Mathf.Cos(6 * P)
                                                   + 0.020f * Mathf.Sin(S - P) - 0.010f * Mathf.Cos(S - P);

                                float pluto_latecl = -3.9082f
                                                   - 5.453f * Mathf.Sin(P) - 14.975f * Mathf.Cos(P)
                                                   + 3.527f * Mathf.Sin(2 * P) + 1.673f * Mathf.Cos(2 * P)
                                                   - 1.051f * Mathf.Sin(3 * P) + 0.328f * Mathf.Cos(3 * P)
                                                   + 0.179f * Mathf.Sin(4 * P) - 0.292f * Mathf.Cos(4 * P)
                                                   + 0.019f * Mathf.Sin(5 * P) + 0.100f * Mathf.Cos(5 * P)
                                                   - 0.031f * Mathf.Sin(6 * P) - 0.026f * Mathf.Cos(6 * P)
                                                                               + 0.011f * Mathf.Cos(S - P);

                                float pluto_r = 40.72f
                                              + 6.68f * Mathf.Sin(P) + 6.90f * Mathf.Cos(P)
                                              - 1.18f * Mathf.Sin(2 * P) - 0.03f * Mathf.Cos(2 * P)
                                              + 0.15f * Mathf.Sin(3 * P) - 0.14f * Mathf.Cos(3 * P);


                                // Geocentric (Earth-centered) coordinates
                                pluto_lonecl *= rad;
                                pluto_latecl *= rad;
                                float pluto_cosLatecl = Mathf.Cos(pluto_latecl);
                                xh = pluto_r * Mathf.Cos(pluto_lonecl) * pluto_cosLatecl;
                                yh = pluto_r * Mathf.Sin(pluto_lonecl) * pluto_cosLatecl;
                                zh = pluto_r * Mathf.Sin(pluto_latecl);


                                // From the sun computation
                                // xs = r * cosLongitude;
                                // ys = r * sinLongitude;


                                float pluto_xg = xh + xs;
                                float pluto_yg = yh + ys;
                                float pluto_zg = zh;


                                // Equatorial coordinates
                                xe = pluto_xg;
                                ye = pluto_yg * Mathf.Cos(ecl) - pluto_zg * Mathf.Sin(ecl);
                                ze = pluto_yg * Mathf.Sin(ecl) + pluto_zg * Mathf.Cos(ecl);


                                // Moon's right ascension (RA) and declination (Decl)
                                RA = Mathf.Atan2(ye, xe);
                                Decl = Mathf.Atan2(ze, Mathf.Sqrt(xe * xe + ye * ye));


                                // The sidereal time
                                // It is already calculated for the sun, there is no need to calculate again


                                // Azimuthal coordinates
                                HA = LST - RA;

                                x = Mathf.Cos(HA) * Mathf.Cos(Decl);
                                y = Mathf.Sin(HA) * Mathf.Cos(Decl);
                                z = Mathf.Sin(Decl);

                                xhor = x * Mathf.Sin(latitude) - z * Mathf.Cos(latitude);
                                yhor = y;
                                zhor = x * Mathf.Cos(latitude) + z * Mathf.Sin(latitude);

                                azimuth = Mathf.Atan2(yhor, xhor);
                                altitude = Mathf.Asin(zhor);


                                // Gets the celestial rotation
                                celestialRotation.x = altitude * deg;
                                celestialRotation.y = azimuth * deg;
                                celestialRotation.z = 0.0f;

                                celestialBody.Transform.localRotation = Quaternion.Euler(celestialRotation);
                                continue;
                        }


                        // Eccentric anomaly
                        M *= rad;
                        E = M + e * Mathf.Sin(M) * (1f + e * Mathf.Cos(M));


                        // Planet's distance and true anomaly
                        xv = a * (Mathf.Cos(E) - e);
                        yv = a * (Mathf.Sqrt(1f - e * e) * Mathf.Sin(E));
                        v = Mathf.Atan2(yv, xv) * deg;
                        r = Mathf.Sqrt(xv * xv + yv * yv);


                        // Planet's true longitude
                        lonsun = (v + w) * rad;
                        cosLongitude = Mathf.Cos(lonsun);
                        sinLongitude = Mathf.Sin(lonsun);


                        // The position in space - heliocentric (Sun-centered) position
                        N *= rad;
                        i *= rad;

                        xh = r * (Mathf.Cos(N) * cosLongitude - Mathf.Sin(N) * sinLongitude * Mathf.Cos(i));
                        yh = r * (Mathf.Sin(N) * cosLongitude + Mathf.Cos(N) * sinLongitude * Mathf.Cos(i));
                        zh = r * (sinLongitude * Mathf.Sin(i));

                        float lonecl = Mathf.Atan2(yh, xh);
                        float latecl = Mathf.Atan2(zh, Mathf.Sqrt(xh * xh + yh * yh));


                        // Geocentric (Earth-centered) coordinates
                        float cosLatecl = Mathf.Cos(latecl);
                        xh = r * Mathf.Cos(lonecl) * cosLatecl;
                        yh = r * Mathf.Sin(lonecl) * cosLatecl;
                        zh = r * Mathf.Sin(latecl);


                        // From the sun computation
                        // xs = r * cosLongitude;
                        // ys = r * sinLongitude;


                        float xg = xh + xs;
                        float yg = yh + ys;
                        float zg = zh;


                        // Equatorial coordinates
                        xe = xg;
                        ye = yg * Mathf.Cos(ecl) - zg * Mathf.Sin(ecl);
                        ze = yg * Mathf.Sin(ecl) + zg * Mathf.Cos(ecl);


                        // Moon's right ascension (RA) and declination (Decl)
                        RA = Mathf.Atan2(ye, xe);
                        Decl = Mathf.Atan2(ze, Mathf.Sqrt(xe * xe + ye * ye));


                        // The sidereal time
                        // It is already calculated for the sun, there is no need to calculate again


                        // Azimuthal coordinates
                        HA = LST - RA;

                        x = Mathf.Cos(HA) * Mathf.Cos(Decl);
                        y = Mathf.Sin(HA) * Mathf.Cos(Decl);
                        z = Mathf.Sin(Decl);

                        xhor = x * Mathf.Sin(latitude) - z * Mathf.Cos(latitude);
                        yhor = y;
                        zhor = x * Mathf.Cos(latitude) + z * Mathf.Sin(latitude);

                        azimuth = Mathf.Atan2(yhor, xhor);
                        altitude = Mathf.Asin(zhor);


                        // Gets the celestial rotation
                        celestialRotation.x = altitude * deg;
                        celestialRotation.y = azimuth * deg;
                        celestialRotation.z = 0.0f;

                        celestialBody.Transform.localRotation = Quaternion.Euler(celestialRotation);
                    }
                }
            }


            // Computes sun and moon elevation
            m_sunElevation = Vector3.Dot(-m_sunTransform.forward, Vector3.up);
            m_moonElevation = Vector3.Dot(-m_moonTransform.forward, Vector3.up);


            // Set directional light direction
            m_directionalLight.localRotation = Quaternion.LookRotation(m_sunElevation >= 0.0f ? m_sunTransform.forward : m_moonTransform.forward);


            // Avoid the directional light to get close to the horizon line
            m_directionalLightDirection = m_directionalLight.localEulerAngles;
            if (m_directionalLightDirection.x <= m_minLightAltitude) { m_directionalLightDirection.x = m_minLightAltitude; }
            m_directionalLight.localEulerAngles = m_directionalLightDirection;
        }


        /// <summary>
        /// Adjust the calendar when there is a change in the date.
        /// </summary>
        public void UpdateCalendar()
        {
            // Get the number of days in the current month
            m_daysInMonth = DateTime.DaysInMonth(m_year, m_month);


            // Avoid selecting a date that does not exist
            m_day = Mathf.Clamp(m_day, 1, m_daysInMonth);
            m_month = Mathf.Clamp(m_month, 1, 12);
            m_year = Mathf.Clamp(m_year, 0, 9999);


            // Creates a custom DateTime at the first day of the current month
            m_teporaryDateTime = new DateTime(m_year, m_month, 1);


            // Gets the day of week corresponding to this custom DateTime
            m_temporaryDayOfWeek = (int) m_teporaryDateTime.DayOfWeek;


            // Keeps the same day selected in the calendar even when the date is changed externally.
            m_selectedCalendarDay = m_day - 1 + m_temporaryDayOfWeek;

            for (int i = 0; i < m_calendarNumericList.Length; i++)
            {
                // Make null all the calendar buttons
                if (i < m_temporaryDayOfWeek || i >= (m_temporaryDayOfWeek + m_daysInMonth))
                {
                    m_calendarNumericList[i] = "";
                    continue;
                }

                // Sets the day number only on the valid buttons of the current month in use by the calendar.
                m_teporaryDateTime = new DateTime(m_year, m_month, (i - m_temporaryDayOfWeek) + 1);
                m_calendarNumericList[i] = m_teporaryDateTime.Day.ToString();
            }


            // Update the day of week
            m_teporaryDateTime = new DateTime(m_year, m_month, m_day);
            m_dayOfWeek = (AzureDayOfWeek) m_teporaryDateTime.DayOfWeek;
        }


        /// <summary>
        /// Returns the day of the week from a custom date as an enum type.
        /// </summary>
        public AzureDayOfWeek GetDayOfWeek(int year, int month, int day)
        {
            m_teporaryDateTime = new DateTime(year, month, day);
            return (AzureDayOfWeek) m_teporaryDateTime.DayOfWeek;
        }


        /// <summary>
        /// Retuns the day of the week from a custom date as an integer between 0 and 6.
        /// </summary>
        public int GetDayOfWeekIndex(int year, int month, int day)
        {
            m_teporaryDateTime = new DateTime(year, month, day);
            return (int) m_teporaryDateTime.DayOfWeek;
        }


        /// <summary>
        /// Returns the day of the week from a custom date as string.
        /// </summary>
        public string GetDayOfWeekString(int year, int month, int day)
        {
            m_teporaryDateTime = new DateTime(year, month, day);
            return m_teporaryDateTime.DayOfWeek.ToString();
        }


        /// <summary>
        /// Sets a new custom date to the time system.
        /// </summary>
        public void SetDate(int year, int month, int day)
        {
            this.m_year = year;
            this.m_month = month;
            this.m_day = day;
            UpdateCalendar();
        }


        /// <summary>
        /// Increases a day in the calendar.
        /// </summary>
        public void IncreaseDay()
        {
            if (m_timeSystemLoop != AzureTimeSystemLoop.Daily)
            {
                m_day++;

                if (m_day > m_daysInMonth)
                {
                    m_day = 1;
                    IncreaseMonth();
                }

                AzureNotificationCenter.Invoke.DayChangeCallback(this);
            }

            UpdateCalendar();
        }


        /// <summary>
        /// Decreases a day in the calendar.
        /// </summary>
        public void DecreaseDay()
        {
            if (m_timeSystemLoop != AzureTimeSystemLoop.Daily)
            {
                m_day--;
                m_temporaryPreviousMonth = m_timeSystemLoop == AzureTimeSystemLoop.Monthly ? m_month : m_month - 1;
                if (m_temporaryPreviousMonth < 1) m_temporaryPreviousMonth = 12;
                m_temporaryPreviousDaysInMonth = DateTime.DaysInMonth(m_year, m_temporaryPreviousMonth);

                if (m_day < 1)
                {
                    m_day = m_temporaryPreviousDaysInMonth;
                    DecreaseMonth();
                }

                AzureNotificationCenter.Invoke.DayChangeCallback(this);
            }

            UpdateCalendar();
        }


        /// <summary>
        /// Increases a month in the calendar.
        /// </summary>
        public void IncreaseMonth()
        {
            if (m_timeSystemLoop != AzureTimeSystemLoop.Monthly)
            {
                m_month++;

                if (m_month > 12)
                {
                    m_month = 1;
                    IncreaseYear();
                }

                AzureNotificationCenter.Invoke.MonthChangeCallback(this);
            }

            UpdateCalendar();
        }


        /// <summary>
        /// Decreases a month in the calendar.
        /// </summary>
        public void DecreaseMonth()
        {
            if (m_timeSystemLoop != AzureTimeSystemLoop.Monthly)
            {
                m_month--;

                if (m_month < 1)
                {
                    m_month = 12;
                    DecreaseYear();
                }

                AzureNotificationCenter.Invoke.MonthChangeCallback(this);
            }

            UpdateCalendar();
        }


        /// <summary>
        /// Increases a year in the calendar.
        /// </summary>
        public void IncreaseYear()
        {
            if (m_timeSystemLoop != AzureTimeSystemLoop.Yearly)
            {
                m_year++;
                if (m_year > 9999) m_year = 0;
                AzureNotificationCenter.Invoke.YearChangeCallback(this);
            }

            UpdateCalendar();
        }


        /// <summary>
        /// Decreases a year in the calendar.
        /// </summary>
        public void DecreaseYear()
        {
            if (m_timeSystemLoop != AzureTimeSystemLoop.Yearly)
            {
                m_year--;
                if (m_year < 0) m_year = 9999;
                AzureNotificationCenter.Invoke.YearChangeCallback(this);
            }

            UpdateCalendar();
        }
    }
}