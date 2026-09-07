using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace OC.ExampleContent
{
    public class Demo : MonoBehaviour
    {
        [SerializeField] private OverCloudCamera m_OverCloudCamera = null;
        [SerializeField] private TextMeshProUGUI m_ControlsText = null;
        [SerializeField] private TextMeshProUGUI m_OutputText = null;
        [SerializeField] private TextMeshProUGUI m_FPSText = null;
        [SerializeField] private ReflectionProbe m_DynamicReflectionProbe = null;
        [SerializeField] private OverCloudProbe m_CloudProbe = null;
        [SerializeField] private AudioLowPassFilter m_PropellerFilter = null;
        [SerializeField] private WindZone m_WindZone = null; // Add reference to the Wind Zone
        [SerializeField] private TMP_Dropdown m_PresetsDropdown = null;

        private string m_CachedControlsText;

        private int m_CloudQuality = 2;

        private void Start()
        {
            m_CachedControlsText = m_ControlsText.text;
            UpdateControlsText();
            Application.targetFrameRate = 60;
            SetupDropdown();
        }

        private void SetupDropdown()
        {
            m_PresetsDropdown.onValueChanged.AddListener(delegate { OnDropdownValueChanged(); });
        }

        private void OnDropdownValueChanged()
        {
            m_CloudQuality = m_PresetsDropdown.value;
            UpdateCloudSettings();
            UpdateControlsText();
        }

        private void UpdateControlsText()
        {
            m_ControlsText.text = m_CachedControlsText + "\n";
            m_ControlsText.text += "<b>Cloud Quality:</b> ";
            switch (m_CloudQuality)
            {
                case 0:
                    m_ControlsText.text += "<color=#FF0000>Low</color>";
                    break;
                case 1:
                    m_ControlsText.text += "<color=#FFFF00>Medium</color>";
                    break;
                case 2:
                    m_ControlsText.text += "<color=#00FF00>High</color>";
                    break;
            }
        }

        private void Update()
        {
            // Update FPS display
            m_FPSText.text = "<b>FPS:</b> " + Mathf.CeilToInt(1f / Time.smoothDeltaTime);

            // Toggle controls text visibility
            if (Input.GetKeyDown(KeyCode.H))
            {
                ToggleTextVisibility();
            }

            // Toggle dynamic reflection probe
            if (Input.GetKeyDown(KeyCode.R))
            {
                ToggleDynamicReflectionProbe();
            }

            // Apply low pass filter based on cloud density
            ApplyPropellerFilter();

            // Change time of day
            HandleTimeOfDayChange();

            // Update output text
            UpdateOutputText();
        }

        private void UpdateCloudSettings()
        {
            switch (m_CloudQuality)
            {
                case 0:
                    SetCloudSettings(DownSampleFactor.Quarter, false, false, SampleCount.Low);
                    break;
                case 1:
                    SetCloudSettings(DownSampleFactor.Quarter, true, true, SampleCount.Normal);
                    break;
                case 2:
                    SetCloudSettings(DownSampleFactor.Half, true, true, SampleCount.High);
                    break;
            }
        }

        private void SetCloudSettings(DownSampleFactor downsampleFactor, bool renderScatteringMask, bool highQualityClouds, SampleCount lightSampleCount)
        {
            m_OverCloudCamera.downsampleFactor = downsampleFactor;
            m_OverCloudCamera.renderScatteringMask = renderScatteringMask;
            m_OverCloudCamera.highQualityClouds = highQualityClouds;
            m_OverCloudCamera.lightSampleCount = lightSampleCount;
        }

        private void ToggleTextVisibility()
        {
            m_OutputText.enabled = !m_OutputText.enabled;
            m_FPSText.enabled = !m_FPSText.enabled;
            m_ControlsText.enabled = !m_ControlsText.enabled;
        }

        private void ToggleDynamicReflectionProbe()
        {
            m_DynamicReflectionProbe.enabled = !m_DynamicReflectionProbe.enabled;
        }

        private void ApplyPropellerFilter()
        {
            m_PropellerFilter.cutoffFrequency = Mathf.Lerp(22000, 800, m_CloudProbe.density);
        }

        private void HandleTimeOfDayChange()
        {
            float scroll = Input.GetAxis("Mouse ScrollWheel");
            if (Mathf.Abs(scroll) > Mathf.Epsilon)
            {
                OverCloud.timeOfDay.time += Mathf.Sign(scroll) * 0.2f;
            }

            if (Input.GetKeyDown(KeyCode.Space))
            {
                OverCloud.timeOfDay.play = !OverCloud.timeOfDay.play;
            }
        }

        private void UpdateOutputText()
        {
            // Clear previous text
            m_OutputText.text = "";

            // Time of Day information
            m_OutputText.text += "<color=#FFFFFF><size=22><b>Time of Day:</b></size></color>\n";
            m_OutputText.text += "<color=#FFFFFF>    - Status: " + (OverCloud.timeOfDay.play ? "<color=#00FF00>Playing</color>" : "<color=#FF0000>Paused</color>") + "</color>\n";
            m_OutputText.text += "<color=#FFFFFF>    - Timescale: " + OverCloud.timeOfDay.playSpeed.ToString("F2") + "</color>\n";
            m_OutputText.text += "<color=#FFFFFF>    - Date: " + OverCloud.timeOfDay.day + "/" + OverCloud.timeOfDay.month + "/" + OverCloud.timeOfDay.year + "</color>\n";
            m_OutputText.text += "<color=#FFFFFF>    - Time: " + FormatTime(OverCloud.timeOfDay.hour, OverCloud.timeOfDay.minute, OverCloud.timeOfDay.second) + "</color>\n\n";

            // Season information
            string season = GetSeason(OverCloud.timeOfDay.month);
            m_OutputText.text += "<color=#FFFFFF><size=22><b>Season:</b></size></color>\n";
            m_OutputText.text += "<color=#FFFFFF>    - Current Season: " + season + "</color>\n\n";

            // Weather information
            m_OutputText.text += "<color=#FFFFFF><size=22><b>Weather:</b></size></color>\n";
            m_OutputText.text += "<color=#FFFFFF>    - Current Weather: " + (OverCloud.current != null ? OverCloud.current.name : "Unknown") + "</color>\n\n";

            // Display wind-related parameters if available
            if (OverCloud.weather != null)
            {
                m_OutputText.text += "<color=#FFFFFF><size=22><b>Wind:</b></size></color>\n";
                m_OutputText.text += "<color=#FFFFFF>    - Wind Time: " + OverCloud.weather.windTime.ToString("F2") + "</color>\n";
                m_OutputText.text += "<color=#FFFFFF>    - Wind Timescale: " + OverCloud.weather.windTimescale.ToString("F2") + "</color>\n";

                // Unity Wind Zone direction
                if (m_WindZone != null)
                {
                    Vector3 windDirectionVector = m_WindZone.transform.forward;
                    string windDirection = windDirectionVector.ToString();
                    m_OutputText.text += "<color=#FFFFFF>    - Wind Direction:</color> " + windDirection + "\n";
                }
                else
                {
                    m_OutputText.text += "<color=#FFFFFF>    - Wind Direction:</color> No Wind Zone assigned\n";
                }
            }
            else
            {
                m_OutputText.text += "<color=#FFFFFF><size=22><b>Wind:</b></size></color>\n";
                m_OutputText.text += "<color=#FFFFFF>    - Wind Information: Not available</color>\n";
            }

            // Display additional weather parameters
            DisplayWeatherParameters();
        }

        private void DisplayWeatherParameters()
        {
            if (OverCloud.current != null)
            {
                m_OutputText.text += "\n<color=#FFFFFF><size=22><b>Additional Weather Parameters:</b></size></color>\n";

                // Temperature (example based on altitude)
                float temperature = CalculateTemperature(OverCloud.current.cloudPlaneAltitude);
                m_OutputText.text += "<color=#FFFFFF>    - Temperature:</color> " + temperature.ToString("F1") + "°C\n";

                // Humidity (example based on cloud density)
                float humidity = CalculateHumidity(OverCloud.current.cloudPlaneAltitude);
                m_OutputText.text += "<color=#FFFFFF>    - Humidity:</color> " + humidity.ToString("P0") + "\n";

                // Visibility (using cloud visibility function)
                float visibility = CalculateVisibility();
                m_OutputText.text += "<color=#FFFFFF>    - Visibility:</color> " + visibility.ToString("F1") + " km\n";

                // Precipitation Type (based on precipitation intensity)
                string precipitationType = DeterminePrecipitationType();
                m_OutputText.text += "<color=#FFFFFF>    - Precipitation:</color> " + precipitationType + "\n";
            }
        }


        private float CalculateTemperature(float altitude)
        {
            // Simplified temperature calculation based on altitude
            float baseTemperature = 15f; // Base temperature at sea level
            float temperatureDropPerMeter = 0.0065f; // Temperature drop per meter
            return baseTemperature - (altitude * temperatureDropPerMeter);
        }

        private float CalculateHumidity(float altitude)
        {
            // Simplified humidity calculation based on cloud density
            var cloudDensity = OverCloud.GetDensity(new Vector3(0, altitude, 0));
            return cloudDensity.coverage; // Assuming coverage is proportional to humidity
        }

        private float CalculateVisibility()
        {
            // Using CloudVisibility function for visibility calculation
            float sampleDistance = 1000f; // Distance between sample points
            Vector3 startPoint = new Vector3(0, OverCloud.current.cloudPlaneAltitude, 0);
            Vector3 endPoint = startPoint + Vector3.forward * sampleDistance;
            float cloudVisibility = OverCloud.CloudVisibility(startPoint, endPoint);
            return (1 - cloudVisibility) * 10; // Assuming visibility in km
        }

        private string DeterminePrecipitationType()
        {
            // Get cloud density at the current altitude
            CloudDensity cloudDensity = OverCloud.GetDensity(new Vector3(0, OverCloud.current.cloudPlaneAltitude, 0));

            // Determine precipitation intensity based on rain density
            float precipitationIntensity = cloudDensity.rain;

            // Determine precipitation type based on intensity thresholds
            if (precipitationIntensity > 0.8f)
            {
                return "Torrential Rain";
            }
            else if (precipitationIntensity > 0.6f)
            {
                return "Heavy Rain";
            }
            else if (precipitationIntensity > 0.4f)
            {
                return "Moderate Rain";
            }
            else if (precipitationIntensity > 0.2f)
            {
                return "Light Rain";
            }
            else if (precipitationIntensity > 0.05f)
            {
                return "Drizzle";
            }
            else
            {
                return "No Precipitation";
            }
        }

        private string FormatTime(float hour, float minute, float second)
        {
            int h = Mathf.FloorToInt(hour);
            int m = Mathf.FloorToInt(minute);
            int s = Mathf.FloorToInt(second);
            return $"{h:D2}:{m:D2}:{s:D2}";
        }

        private string GetSeason(int month)
        {
            switch (month)
            {
                case 12:
                case 1:
                case 2:
                    return "Winter";
                case 3:
                case 4:
                case 5:
                    return "Spring";
                case 6:
                case 7:
                case 8:
                    return "Summer";
                case 9:
                case 10:
                case 11:
                    return "Autumn";
                default:
                    return "Unknown";
            }
        }
    }
}
