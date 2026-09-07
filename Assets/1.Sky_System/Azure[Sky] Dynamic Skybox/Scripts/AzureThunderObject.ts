namespace UnityEngine.AzureSky
{
    [RequireComponent(typeof(AudioSource))]
    [AddComponentMenu("Azure[Sky] Dynamic Skybox/Azure Thunder Object")]
    public sealed class AzureThunderObject : MonoBehaviour
    {
        /// <summary>
        /// Field: The audio source attached to this game object.
        /// </summary>
        [SerializeField] private AudioSource m_audioSource;

        /// <summary>
        /// Property: The audio source attached to this game object.
        /// </summary>
        public AudioSource AudioSource { get => m_audioSource; set => m_audioSource = value; }


        /// <summary>
        /// Field: The child directional light used to simulate the lightining effect.
        /// </summary>
        [SerializeField] private Light m_directionalLight;

        /// <summary>
        /// Property: The child directional light used to simulate the lightining effect.
        /// </summary>
        public Light DirectionalLight { get => m_directionalLight; set => m_directionalLight = value; }


        /// <summary>
        /// Field: The light curve frequency the thunder effect will apply to the scene and clouds.
        /// </summary>
        [SerializeField] private AnimationCurve m_lightFrequency;

        /// <summary>
        /// Property: The light curve frequency the thunder effect will apply to the scene and clouds.
        /// </summary>
        public AnimationCurve LightFrequency { get => m_lightFrequency; set => m_lightFrequency = value; }


        /// <summary>
        /// Field: The time delay to play the audio clip after the thunder is instantiated.
        /// </summary>
        [SerializeField] private float m_audioDelay;

        /// <summary>
        /// Property: The time delay to play the audio clip after the thunder is instantiated.
        /// </summary>
        public float AudioDelay { get => m_audioDelay; set => m_audioDelay = value; }


        /// <summary>
        /// Field: The since this thunder object was instantiated.
        /// </summary>
        private float m_time = 0.0f;


        /// <summary>
        /// Field: Used to avoid more than one call to AudioSource.Play().
        /// </summary>
        private bool m_canPlayAudioClip = true;


        private void Awake()
        {
            if (!m_audioSource) m_audioSource = GetComponent<AudioSource>();
            if (!m_directionalLight) m_directionalLight = GetComponentInChildren<Light>();
        }


        private void Update()
        {
            // Increase the time since the thunder was instantiated
            m_time += Time.deltaTime;


            // Set the directional light intensity according to the light frequency curve
            if (m_directionalLight)
            {
                m_directionalLight.intensity = m_lightFrequency.Evaluate(m_time / m_audioSource.clip.length);
            }


            // Send the light frequency to the shader, so the effect can also be applied to the clouds
            //Shader.SetGlobalFloat(AzureShaderUniforms.ThunderLightningEffect, m_directionalLight.intensity);


            // Play the thunder sound effect
            if (m_canPlayAudioClip)
            {
                if (m_time >= m_audioDelay)
                {
                    if (m_audioSource)
                    {
                        m_audioSource.Play();
                        m_canPlayAudioClip = false;
                    }
                }
            }


            // Destroy the thunder game object after the audio clip ends
            if (m_time >= m_audioDelay + m_audioSource.clip.length)
                Destroy(gameObject);
        }
    }
}