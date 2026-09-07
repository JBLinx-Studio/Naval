namespace UnityEngine.AzureSky
{
    public static class AzureNotificationCenter
    {
        public static class GlobalTimeInfo
        {
            public static AzureTimeSystemMode timeSystemMode = AzureTimeSystemMode.Simple;
            public static AzureTimeSystemDirection timeSystemDirection = AzureTimeSystemDirection.Forward;
            public static AzureTimeSystemLoop timeSystemLoop = AzureTimeSystemLoop.Off;
            public static float timeline = 6.5f;
            public static float timeOfDay = 6.5f;
            public static float evaluationTime = 6.5f;
            public static float sunElevation = 0f;
            public static float moonElevation = 0f;
            public static int hour = 6;
            public static int minute = 0;
            public static float utc = 0;
        }


        public static class Invoke
        {
            /// <summary>
            /// Triggers the OnMinuteChange callback when the time of day changes.
            /// </summary>
            public static void MinuteChangeCallback(AzureTimeController timeController) { OnMinuteChange?.Invoke(timeController); }


            /// <summary>
            /// Triggers the OnHourChange callback when the time of day changes.
            /// </summary>
            public static void HourChangeCallback(AzureTimeController timeController) { OnHourChange?.Invoke(timeController); }


            /// <summary>
            /// Triggers the OnDayChange callback.
            /// </summary>
            public static void DayChangeCallback(AzureTimeController timeController) { OnDayChange?.Invoke(timeController); }


            /// <summary>
            /// Triggers the OnMonthChange callback.
            /// </summary>
            public static void MonthChangeCallback(AzureTimeController timeController) { OnMonthChange?.Invoke(timeController); }


            /// <summary>
            /// Triggers the OnYearChange callback.
            /// </summary>
            public static void YearChangeCallback(AzureTimeController timeController) { OnYearChange?.Invoke(timeController); }
        }


        public delegate void TimeSystemDelegate(AzureTimeController timeController);
        public static event TimeSystemDelegate OnMinuteChange, OnHourChange, OnDayChange, OnMonthChange, OnYearChange;
    }


    // Editor only
    #if UNITY_EDITOR
    public static class AzureNotificationCenterEditor
    {
        public static class Invoke
        {
            /// <summary>
            /// Triggers the OnAddGlobalWeather callback.
            /// </summary>
            public static void AddGlobalWeatherCallback(AzureWeatherController weatherController)
            {
                OnAddGlobalWeather?.Invoke(weatherController);
            }


            /// <summary>
            /// Triggers the OnAddWeatherZone callback.
            /// </summary>
            public static void AddWeatherZoneCallback(AzureWeatherController weatherController)
            {
                OnAddWeatherZone?.Invoke(weatherController);
            }


            /// <summary>
            /// Triggers the OnAddCustomProperty callback.
            /// </summary>
            public static void AddCustomPropertyCallback(AzureWeatherController weatherController)
            {
                OnAddCustomProperty?.Invoke(weatherController);
            }


            /// <summary>
            /// Triggers the OnRemoveCustomProperty callback.
            /// </summary>
            public static void RemoveCustomPropertyCallback(AzureWeatherController weatherController, int index)
            {
                OnRemoveCustomProperty?.Invoke(weatherController, index);
            }


            /// <summary>
            /// Triggers the OnRemoveGlobalWeather callback.
            /// </summary>
            public static void RemoveGlobalWeatherCallback(AzureWeatherController weatherController, int index)
            {
                OnRemoveGlobalWeather?.Invoke(weatherController, index);
            }


            /// <summary>
            /// Triggers the OnRemoveWeatherZone callback.
            /// </summary>
            public static void RemoveWeatherZoneCallback(AzureWeatherController weatherController, int index)
            {
                OnRemoveWeatherZone?.Invoke(weatherController, index);
            }


            /// <summary>
            /// Triggers the OnReorderCustomPropertyList callback.
            /// </summary>
            public static void ReorderCustomPropertyListCallback(AzureWeatherController weatherController, int oldIndex, int newIndex)
            {
                OnReorderCustomPropertyList?.Invoke(weatherController, oldIndex, newIndex);
            }


            /// <summary>
            /// Triggers the OnReorderGlobalWeatherList callback.
            /// </summary>
            public static void ReorderGlobalWeatherListCallback(AzureWeatherController weatherController, int oldIndex, int newIndex)
            {
                OnReorderGlobalWeatherList?.Invoke(weatherController, oldIndex, newIndex);
            }


            /// <summary>
            /// Triggers the OnReorderWeatherZoneList callback.
            /// </summary>
            public static void ReorderWeatherZoneListCallback(AzureWeatherController weatherController, int oldIndex, int newIndex)
            {
                OnReorderWeatherZoneList?.Invoke(weatherController, oldIndex, newIndex);
            }


            /// <summary>
            /// Triggers the OnResetWeatherSystem callback.
            /// </summary>
            public static void ResetWeatherSystemCallback(AzureWeatherController weatherController)
            {
                OnResetWeatherSystem?.Invoke(weatherController);
            }


            /// <summary>
            /// Triggers the OnDayChange callback when changing the calendar day in the Inspector.
            /// </summary>
            public static void DayChangeCallback(AzureTimeController timeController) { OnDayChange?.Invoke(timeController); }


            /// <summary>
            /// Triggers the OnMonthChange callback when changing the calendar month in the Inspector.
            /// </summary>
            public static void MonthChangeCallback(AzureTimeController timeController) { OnMonthChange?.Invoke(timeController); }


            /// <summary>
            /// Triggers the OnYearChange callback when changing the calendar year in the Inspector.
            /// </summary>
            public static void YearChangeCallback(AzureTimeController timeController) { OnYearChange?.Invoke(timeController); }


            /// <summary>
            /// Triggers the OnDestroyWeatherPreset callback when a weather preset game object is destroyed.
            /// </summary>
            public static void DestroyWeatherPresetCallback(AzureWeatherPreset weatherPreset)
            {
                OnDestroyWeatherPreset?.Invoke(weatherPreset);
            }


            /// <summary>
            /// Triggers the OnDestroyWeatherZone callback when a weather zone game object is destroyed.
            /// </summary>
            public static void DestroyWeatherZoneCallback(AzureWeatherZone weatherZone)
            {
                OnDestroyWeatherZone?.Invoke(weatherZone);
            }


            /// <summary>
            /// Triggers the OnForceAzureUpdate callback when the system needs a complete update.
            /// </summary>
            public static void ForceAzureUpdateCallback()
            {
                OnForceAzureUpdate?.Invoke();
            }
        }


        public delegate void AddListDelegate(AzureWeatherController weatherController);
        public static event AddListDelegate OnAddCustomProperty, OnAddGlobalWeather, OnAddWeatherZone;


        public delegate void RemoveListDelegate(AzureWeatherController weatherController, int index);
        public static event RemoveListDelegate OnRemoveCustomProperty, OnRemoveGlobalWeather, OnRemoveWeatherZone;


        public delegate void ReorderListDelegate(AzureWeatherController weatherController, int oldIndex, int newIndex);
        public static event ReorderListDelegate OnReorderCustomPropertyList, OnReorderGlobalWeatherList, OnReorderWeatherZoneList;


        public delegate void ForceAzureUpdateDelegate();
        public static event ForceAzureUpdateDelegate OnForceAzureUpdate;


        public delegate void TimeSystemDelegate(AzureTimeController timeController);
        public static event TimeSystemDelegate OnDayChange, OnMonthChange, OnYearChange;


        public delegate void ResetWeatherSystemDelegate(AzureWeatherController weatherController);
        public static event ResetWeatherSystemDelegate OnResetWeatherSystem;


        public delegate void WeatherPresetDelegate(AzureWeatherPreset weatherPreset);
        public static event WeatherPresetDelegate OnDestroyWeatherPreset;


        public delegate void WeatherZoneDelegate(AzureWeatherZone weatherZone);
        public static event WeatherZoneDelegate OnDestroyWeatherZone;
    }
    #endif
}