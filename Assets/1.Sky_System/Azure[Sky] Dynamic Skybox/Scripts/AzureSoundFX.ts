namespace UnityEngine.AzureSky
{
    [RequireComponent(typeof(AudioSource))]
    [AddComponentMenu("Azure[Sky] Dynamic Skybox/Azure Sound FX")]
    public sealed class AzureSoundFX : MonoBehaviour
    {
        /// <summary>
        /// Field: The audio source attached to this game object.
        /// </summary>
        private AudioSource m_audioSource;


        /// <summary>
        /// Field: The volume of the audio source attached to this game object.
        /// </summary>
        private float m_volume;

        /// <summary>
        /// Field: The volume of the audio source attached to this game object.
        /// </summary>
        public float Volume
        {
            get => m_volume;
            set
            {
                m_volume = value;

                if (m_audioSource)
                {
                    m_audioSource.volume = value;
                    if (value > 0)
                    {
                        if (!m_audioSource.isPlaying) m_audioSource.Play();
                    }
                    else if (m_audioSource.isPlaying) m_audioSource.Stop();
                }
            }
        }


        private void Awake()
        {
            m_audioSource = GetComponent<AudioSource>();
        }
    }
}