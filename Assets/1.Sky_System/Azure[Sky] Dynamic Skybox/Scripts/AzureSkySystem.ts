using UnityEngine.Rendering;
using System.Collections.Generic;


namespace UnityEngine.AzureSky
{
    [ExecuteInEditMode]
    [AddComponentMenu("Azure[Sky] Dynamic Skybox/Azure Sky System")]
    public sealed class AzureSkySystem : MonoBehaviour
    {
        // Editor only
        #if UNITY_EDITOR
        [SerializeField] private bool m_showFollowTargetsTab;
        [SerializeField] private bool m_showTimerSystemTab;
        #endif


        /// <summary>
        /// Field: The reference to the reflection probe this component will handle by calling UpdateReflectionProbe.
        /// </summary>
        [SerializeField] private ReflectionProbe m_reflectionProbe;

        /// <summary>
        /// Property: The reference to the reflection probe this component will handle by calling UpdateReflectionProbe.
        /// </summary>
        public ReflectionProbe ReflectionProbe { get => m_reflectionProbe; set => m_reflectionProbe = value; }


        /// <summary>
        /// Field: List of follow targets.
        /// </summary>
        [SerializeField] private List<AzureFollowTarget> m_followTargetList = new List<AzureFollowTarget>();

        /// <summary>
        /// Property: List of follow targets.
        /// </summary>
        public List<AzureFollowTarget> FollowTargetList { get => m_followTargetList; set => m_followTargetList = value; }


        /// <summary>
        /// Field: List of timers.
        /// </summary>
        [SerializeField] private List<AzureTimerSettings> m_timerSettingsList = new List<AzureTimerSettings>();

        /// <summary>
        /// Property: List of timers.
        /// </summary>
        public List<AzureTimerSettings> TimerSettingsList { get => m_timerSettingsList; set => m_timerSettingsList = value; }


        private void Awake()
        {
            // Execute timers on Awake
            if (Application.isPlaying)
            {
                for (int i = 0; i < m_timerSettingsList.Count; i++)
                {
                    if (m_timerSettingsList[i].ExecuteOnAwake)
                    {
                        m_timerSettingsList[i].TimerEvent?.Invoke();
                    }
                }
            }
        }


        private void Update()
        {
            if (Application.isPlaying)
            {
                // Update follow targets
                for (int i = 0; i < m_followTargetList.Count; i++)
                {
                    if (!m_followTargetList[i].Follower) continue;
                    if (!m_followTargetList[i].Target) continue;


                    if (m_followTargetList[i].Follower.position != m_followTargetList[i].Target.position)
                    {
                        m_followTargetList[i].Follower.position = m_followTargetList[i].Target.position;
                    }
                }


                // Execute timer events
                for (int i = 0; i < m_timerSettingsList.Count; i++)
                {
                    m_timerSettingsList[i].TimeSisnceLastUpdate += Time.deltaTime;

                    if (m_timerSettingsList[i].TimeSisnceLastUpdate >= m_timerSettingsList[i].RefreshRate)
                    {
                        m_timerSettingsList[i].TimerEvent?.Invoke();
                        m_timerSettingsList[i].TimeSisnceLastUpdate = 0.0f;
                    }
                }
            }
        }


        /// <summary>
        /// Update the reflection probe attached to the references tab.
        /// Note: It can be very slow!!!
        /// </summary>
        public void UpdateReflectionProbe()
        {
            if (m_reflectionProbe)
            {
                if (m_reflectionProbe.refreshMode == ReflectionProbeRefreshMode.ViaScripting)
                {
                    m_reflectionProbe.RenderProbe();
                }
            }
        }


        /// <summary>
        /// Update the environment cubemap texture from DynamicGI.
        /// Note: It can be very slow!!!
        /// </summary>
        public void UpdateDynamicGI()
        {
            DynamicGI.UpdateEnvironment();
        }
    }
}