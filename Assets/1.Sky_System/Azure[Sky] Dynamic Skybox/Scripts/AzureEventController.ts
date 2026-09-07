/// --- SUMMARY ---
/// AzureEventController (Rewritten, Expanded)
/// Enhanced, backwards-compatible rewrite of the original AzureEventController.
/// - Keeps original serialized field names (m_ prefix) for compatibility with existing editors/presets.
/// - Maintains -1 semantics (ignore field) so daily/recurring events work without year/day/month.
/// - Adds runtime helpers for triggering/querying events by name/category.
/// - Adds robust safety checks and more verbose comments in your preferred style.
/// -----------------------------------

using UnityEngine;
using UnityEngine.Events;
using System.Collections.Generic;

namespace UnityEngine.AzureSky
{
    [AddComponentMenu("Azure[Sky] Dynamic Skybox/Azure Event Controller")]
    public sealed class AzureEventController : MonoBehaviour
    {
        // --- SYSTEM TIME EVENTS --- // 
        // --- Minute Change Event --- // Field: The event triggered when the minute change.
        [SerializeField] private UnityEvent m_minuteChangeEvent;
        // --- Property: The event triggered when the minute change. --- //
        public UnityEvent MinuteChangeEvent => m_minuteChangeEvent;

        // --- Hour Change Event --- // Field: The event triggered when the hour change.
        [SerializeField] private UnityEvent m_hourChangeEvent;
        // --- Property: The event triggered when the hour change. --- //
        public UnityEvent HourChangeEvent => m_hourChangeEvent;

        // --- Day Change Event --- // Field: The event triggered when the day change.
        [SerializeField] private UnityEvent m_dayChangeEvent;
        // --- Property: The event triggered when the day change. --- //
        public UnityEvent DayChangeEvent => m_dayChangeEvent;

        // --- Month Change Event --- // Field: The event triggered when the month change.
        [SerializeField] private UnityEvent m_monthChangeEvent;
        // --- Property: The event triggered when the month change. --- //
        public UnityEvent MonthChangeEvent => m_monthChangeEvent;

        // --- Year Change Event --- // Field: The event triggered when the year change.
        [SerializeField] private UnityEvent m_yearChangeEvent;
        // --- Property: The event triggered when the year change. --- //
        public UnityEvent YearChangeEvent => m_yearChangeEvent;


        // --- CUSTOM EVENT SETTINGS --- //
        // --- Field: The interval time the custom event will be scanned. --- //
        [SerializeField] private AzureCustomEventUpdateMode m_eventScanMode = AzureCustomEventUpdateMode.ByHour;
        // --- Property: The interval time the custom event will be scanned. --- //
        public AzureCustomEventUpdateMode EventScanMode { get => m_eventScanMode; set => m_eventScanMode = value; }

        // --- Field: The custom event list. --- //
        [SerializeField] private List<AzureCustomEvent> m_customTimeEventList = new List<AzureCustomEvent>();
        // --- Property: The custom event list. --- //
        public List<AzureCustomEvent> CustomTimeEventList => m_customTimeEventList;


        // --- LIFECYCLE --- //
        // --- Register the events when the GameObject is enabled. --- //
        private void OnEnable()
        {
            AzureNotificationCenter.OnMinuteChange += OnMinuteChange;
            AzureNotificationCenter.OnHourChange += OnHourChange;
            AzureNotificationCenter.OnDayChange += OnDayChange;
            AzureNotificationCenter.OnMonthChange += OnMonthChange;
            AzureNotificationCenter.OnYearChange += OnYearChange;
        }

        // --- Unregister the events when the GameObject is disabled. --- //
        private void OnDisable()
        {
            AzureNotificationCenter.OnMinuteChange -= OnMinuteChange;
            AzureNotificationCenter.OnHourChange -= OnHourChange;
            AzureNotificationCenter.OnDayChange -= OnDayChange;
            AzureNotificationCenter.OnMonthChange -= OnMonthChange;
            AzureNotificationCenter.OnYearChange -= OnYearChange;
        }


        // --- SYSTEM EVENT CALLBACKS --- //
        // --- Triggers the events attached to the minute change UnityEvent. --- //
        private void OnMinuteChange(AzureTimeController timeController)
        {
            // --- Invoke minute change listeners (safe invoke) --- //
            try { m_minuteChangeEvent?.Invoke(); } catch { Debug.LogWarning("[AzureEventController] Exception invoking minute event."); }

            if (m_eventScanMode == AzureCustomEventUpdateMode.ByMinute)
            {
                ScanCustomEventList(timeController);
            }
        }

        // --- Triggers the events attached to the hour change UnityEvent. --- //
        private void OnHourChange(AzureTimeController timeController)
        {
            try { m_hourChangeEvent?.Invoke(); } catch { Debug.LogWarning("[AzureEventController] Exception invoking hour event."); }

            if (m_eventScanMode == AzureCustomEventUpdateMode.ByHour)
            {
                ScanCustomEventList(timeController);
            }
        }

        // --- Triggers the events attached to the day change UnityEvent. --- //
        private void OnDayChange(AzureTimeController timeController)
        {
            try { m_dayChangeEvent?.Invoke(); } catch { Debug.LogWarning("[AzureEventController] Exception invoking day event."); }
        }

        // --- Triggers the events attached to the month change UnityEvent. --- //
        private void OnMonthChange(AzureTimeController timeController)
        {
            try { m_monthChangeEvent?.Invoke(); } catch { Debug.LogWarning("[AzureEventController] Exception invoking month event."); }
        }

        // --- Triggers the events attached to the year change UnityEvent. --- //
        private void OnYearChange(AzureTimeController timeController)
        {
            try { m_yearChangeEvent?.Invoke(); } catch { Debug.LogWarning("[AzureEventController] Exception invoking year event."); }
        }


        // --- CUSTOM EVENT SCANNING LOGIC --- //
        /// <summary>
        /// Scans the custom event list and perform the event that match with the current date and time.
        /// - Retains original semantics: Year/Month/Day/Hour/Minute may be set to -1 to mean "any".
        /// - Prevents multiple triggers in same hour via IsAlreadyExecutedOnThisHour + ExecutedHour.
        /// </summary>
        private void ScanCustomEventList(AzureTimeController timeController)
        {
            if (m_customTimeEventList == null || m_customTimeEventList.Count == 0)
                return;

            // Iterate in forward order (stable). Use indexing to avoid allocation from foreach in older Unity.
            for (int i = 0; i < m_customTimeEventList.Count; i++)
            {
                var entry = m_customTimeEventList[i];

                // --- Basic validation: must have listeners to be relevant --- //
                if (entry == null)
                    continue;

                if (entry.EventListenersCount <= 0)
                    continue;

                // --- Year/Month/Day checks (keep -1 = wildcard) --- //
                if (entry.Year != -1 && entry.Year != timeController.Year)
                    continue;

                if (entry.Month != -1 && entry.Month != timeController.Month)
                    continue;

                if (entry.Day != -1 && entry.Day != timeController.Day)
                    continue;

                // --- Reset per-hour execution state if we entered a new hour --- //
                if (timeController.Hour != entry.ExecutedHour)
                    entry.IsAlreadyExecutedOnThisHour = false;

                // --- Hour match check (wildcard -1 allowed) --- //
                if (entry.Hour != -1 && entry.Hour != timeController.Hour)
                    continue;

                // --- Minute handling:
                // If minute == -1 => trigger immediately on match of hour/day/month/year.
                // If minute >= 0 => trigger only once when timeController.Minute >= entry.Minute for that hour.
                if (entry.Minute == -1)
                {
                    TryInvokeCustomEvent(entry);
                }
                else
                {
                    if (!entry.IsAlreadyExecutedOnThisHour)
                    {
                        if (timeController.Minute >= entry.Minute)
                        {
                            entry.ExecutedHour = timeController.Hour;
                            entry.IsAlreadyExecutedOnThisHour = true;
                            TryInvokeCustomEvent(entry);
                        }
                    }
                }
            }
        }

        // --- Helper: safely invoke an AzureCustomEvent.Event with protection. --- //
        private void TryInvokeCustomEvent(AzureCustomEvent customEvent)
        {
            if (customEvent == null || customEvent.Event == null)
                return;

            try
            {
                customEvent.Event?.Invoke();
            }
            catch (System.Exception ex)
            {
                Debug.LogWarning($"[AzureEventController] Exception invoking custom event: {ex.Message}");
            }
        }


        // --- RUNTIME HELPERS / UTILITIES --- //
        /// <summary>Trigger events whose name matches (exact match). Uses EventListenersCount check for optimization.</summary>
        public int TriggerCustomEventsByName(string name)
        {
            if (string.IsNullOrEmpty(name) || m_customTimeEventList == null) return 0;
            int triggered = 0;
            for (int i = 0; i < m_customTimeEventList.Count; i++)
            {
                var e = m_customTimeEventList[i];
                if (e == null) continue;
                // Some AzureCustomEvent implementations might not have a name; use reflection fallback? Keep conservative: check property 'Name' if exists.
                var nameProp = GetEventNameSafe(e);
                if (nameProp == name && e.EventListenersCount > 0)
                {
                    TryInvokeCustomEvent(e);
                    triggered++;
                }
            }
            return triggered;
        }

        /// <summary>Trigger events by category if AzureCustomEvent supports a 'Category' field. Returns number triggered.</summary>
        public int TriggerCustomEventsByCategory(string category)
        {
            if (string.IsNullOrEmpty(category) || m_customTimeEventList == null) return 0;
            int triggered = 0;
            for (int i = 0; i < m_customTimeEventList.Count; i++)
            {
                var e = m_customTimeEventList[i];
                if (e == null) continue;
                var cat = GetEventCategorySafe(e);
                if (cat == category && e.EventListenersCount > 0)
                {
                    TryInvokeCustomEvent(e);
                    triggered++;
                }
            }
            return triggered;
        }

        // --- Safe reflection helpers to read optional Name / Category fields if present on AzureCustomEvent.
        // --- This lets the controller remain backwards-compatible if your AzureCustomEvent lacks those fields.
        private string GetEventNameSafe(AzureCustomEvent e)
        {
            // Try direct property if your AzureCustomEvent defines Name (case-sensitive)
            try
            {
                var type = e.GetType();
                var f = type.GetField("Name");
                if (f != null) return f.GetValue(e) as string ?? string.Empty;

                var p = type.GetProperty("Name");
                if (p != null) return p.GetValue(e) as string ?? string.Empty;
            }
            catch { /* ignore reflection issues */ }
            return string.Empty;
        }

        private string GetEventCategorySafe(AzureCustomEvent e)
        {
            try
            {
                var type = e.GetType();
                var f = type.GetField("Category");
                if (f != null) return f.GetValue(e) as string ?? string.Empty;

                var p = type.GetProperty("Category");
                if (p != null) return p.GetValue(e) as string ?? string.Empty;
            }
            catch { /* ignore reflection issues */ }
            return string.Empty;
        }


        /// <summary>Validate all custom entries and return number of invalid entries found.</summary>
        public int ValidateCustomEvents(out List<int> invalidIndices)
        {
            invalidIndices = new List<int>();
            if (m_customTimeEventList == null) return 0;
            for (int i = 0; i < m_customTimeEventList.Count; i++)
            {
                var e = m_customTimeEventList[i];
                if (e == null || e.EventListenersCount <= 0)
                {
                    invalidIndices.Add(i);
                }
            }
            return invalidIndices.Count;
        }

        /// <summary>Quick utility: Clear executed-hour flags (useful for testing or editor operations).</summary>
        public void ResetExecutedFlags()
        {
            if (m_customTimeEventList == null) return;
            for (int i = 0; i < m_customTimeEventList.Count; i++)
            {
                var e = m_customTimeEventList[i];
                if (e == null) continue;
                e.ExecutedHour = -1;
                e.IsAlreadyExecutedOnThisHour = false;
            }
        }
    }
}
