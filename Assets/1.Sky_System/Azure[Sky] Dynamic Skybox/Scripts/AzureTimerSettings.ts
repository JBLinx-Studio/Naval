using System;
using UnityEngine.Events;


namespace UnityEngine.AzureSky
{
    /// <summary>
    /// Base class for setting a timer refresh rate.
    /// </summary>
    [Serializable]
    public sealed class AzureTimerSettings
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
        /// Field: The refresh rate the timer will update.
        /// </summary>
        [SerializeField] private float m_refreshRate = 1.0f;

        /// <summary>
        /// Property: The refresh rate the timer will update.
        /// </summary>
        public float RefreshRate { get => m_refreshRate; set => m_refreshRate = value; }


        /// <summary>
        /// Field: Execute this timer on the Awake event?
        /// </summary>
        [SerializeField] private bool m_executeOnAwake = true;

        /// <summary>
        /// Property: Execute this timer on the Awake event?
        /// </summary>
        public bool ExecuteOnAwake { get => m_executeOnAwake; set => m_executeOnAwake = value; }


        /// <summary>
        /// Field: Stores the current time since the last update.
        /// </summary>
        [SerializeField] private float m_timeSisnceLastUpdate = 1.0f;

        /// <summary>
        /// Property: Stores the current time since the last update.
        /// </summary>
        public float TimeSisnceLastUpdate { get => m_timeSisnceLastUpdate; set => m_timeSisnceLastUpdate = value; }


        /// <summary>
        /// Property: Returns the number of listeners attached to this timer event.
        /// </summary>
        public int EventListenersCount
        {
            get => m_timerEvent.GetPersistentEventCount();
        }


        /// <summary>
        /// Field: The event associated to this timer instance.
        /// </summary>
        [SerializeField] private UnityEvent m_timerEvent;

        /// <summary>
        /// Property: The event associated to this timer instance.
        /// </summary>
        public UnityEvent TimerEvent { get => m_timerEvent; set => m_timerEvent = value; }

    }
}