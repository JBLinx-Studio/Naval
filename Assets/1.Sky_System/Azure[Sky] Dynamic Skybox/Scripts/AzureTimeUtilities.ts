using System;

namespace UnityEngine.AzureSky
{
    /// <summary>
    /// Used to set the direction in which the time of day will flow.
    /// </summary>
    public enum AzureTimeSystemDirection
    {
        Forward,
        Backward
    }


    /// <summary>
    /// Used to set the cycle of the time system loop.
    /// </summary>
    public enum AzureTimeSystemLoop
    {
        Off,
        Daily,
        Monthly,
        Yearly
    }


    /// <summary>
    /// The source where the time controller will initialize the time of day.
    /// Local: The time of day will start using the configuration from the local component timeline.
    /// Global: The time of day will start using the value from the global time variable.
    /// </summary>
    public enum AzureTimeStartSource
    {
        FromLocalTime,
        FromGlobalTime
    }


    /// <summary>
    /// The time system used to perform the celestial bodies transform rotations.
    /// </summary>
    public enum AzureTimeSystemMode
    {
        Simple,
        Realistic
    }


    /// <summary>
    /// An celestial body instance.
    /// </summary>
    [Serializable]
    public sealed class AzureCelestialBody
    {
        /// <summary>
        /// Field: The Transform that will receive the celestial body coordinate.
        /// </summary>
        [SerializeField] private Transform m_transform;

        /// <summary>
        /// Property: The Transform that will receive the celestial body coordinate.
        /// </summary>
        public Transform Transform { get => m_transform; set => m_transform = value; }


        /// <summary>
        /// Field: The celestial body this instance will simulate.
        /// </summary>
        [SerializeField] private CelestialBodyType m_type;

        /// <summary>
        /// Property: The celestial body this instance will simulate.
        /// </summary>
        public CelestialBodyType Type { get => m_type; set => m_type = value; }


        /// <summary>
        /// A list of celestial bodies this instance can simulate.
        /// </summary>
        public enum CelestialBodyType
        {
            Mercury,
            Venus,
            Mars,
            Jupiter,
            Saturn,
            Uranus,
            Neptune,
            Pluto
        }
    }


    /// <summary>
    /// List of days of week as a custom enum type.
    /// </summary>
    public enum AzureDayOfWeek
    {
        Sunday,
        Monday,
        Tuesday,
        Wednesday,
        Thursday,
        Friday,
        Saturday
    }


    /// <summary>
    /// List of months as a custom enum type.
    /// </summary>
    public enum AzureMonthOfYear
    {
        January, February, March, April, May, June, July, August, September, October, November, December
    }
}