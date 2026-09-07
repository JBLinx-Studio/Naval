using System;
using UnityEngine.Events;


namespace UnityEngine.AzureSky
{
    /// <summary>
    /// Base class for setting a custom time event.
    /// </summary>
    [Serializable]
    public sealed class AzureCustomEvent
    {
        #if UNITY_EDITOR
        /// <summary>
        /// Field: Used by the editor script to perform the expand functionality.
        /// </summary>
        private bool m_isExpanded = false;

        /// <summary>
        /// Property: Used by the editor script to perform the expand functionality.
        /// </summary>
        public bool IsExpanded { get => m_isExpanded; set => m_isExpanded = value; }
        #endif


        /// <summary>
        /// Field: The minute value of this custom time event.
        /// </summary>
        [SerializeField] private int m_minute = 0;

        /// <summary>
        /// Property: The minute value of this custom time event.
        /// </summary>
        public int Minute { get => m_minute; set => m_minute = value; }


        /// <summary>
        /// Field: The hour value of this custom time event.
        /// </summary>
        [SerializeField] private int m_hour = 0;

        /// <summary>
        /// Property: The hour value of this custom time event.
        /// </summary>
        public int Hour { get => m_hour; set => m_hour = value; }


        /// Field: The day value of this custom time event.
        /// </summary>
        [SerializeField] private int m_day = 0;

        /// <summary>
        /// Property: The day value of this custom time event.
        /// </summary>
        public int Day { get => m_day; set => m_day = value; }


        /// Field: The month value of this custom time event.
        /// </summary>
        [SerializeField] private int m_month = 0;

        /// <summary>
        /// Property: The month value of this custom time event.
        /// </summary>
        public int Month { get => m_month; set => m_month = value; }


        /// Field: The year value of this custom time event.
        /// </summary>
        [SerializeField] private int m_year = 0;

        /// <summary>
        /// Property: The year value of this custom time event.
        /// </summary>
        public int Year { get => m_year; set => m_year = value; }


        /// <summary>
        /// Field: Stores the hour when the event was executed.
        /// </summary>
        private int m_executedHour = -1;

        /// <summary>
        /// Property: Stores the hour when the event was executed.
        /// </summary>
        public int ExecutedHour { get => m_executedHour; set => m_executedHour = value; }


        /// <summary>
        /// Field: Is the event already executed on the current hour?
        /// </summary>
        private bool m_isAlreadyExecutedOnThisHour = false;

        /// <summary>
        /// Property: Is the event already executed on the current hour?
        /// </summary>
        public bool IsAlreadyExecutedOnThisHour { get => m_isAlreadyExecutedOnThisHour; set => m_isAlreadyExecutedOnThisHour = value; }


        /// <summary>
        /// Property: Returns the number of listeners attached to this custom event.
        /// </summary>
        public int EventListenersCount
        {
            get => m_event.GetPersistentEventCount();
        }


        /// <summary>
        /// Field: The UnityEvent associated to this custom event.
        /// </summary>
        [SerializeField] private UnityEvent m_event;

        /// <summary>
        /// Property: The UnityEvent associated to this custom event.
        /// </summary>
        public UnityEvent Event { get => m_event; set => m_event = value; }

    }
}