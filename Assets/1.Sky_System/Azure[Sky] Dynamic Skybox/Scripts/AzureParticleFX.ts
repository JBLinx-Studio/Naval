namespace UnityEngine.AzureSky
{
    [RequireComponent(typeof(ParticleSystem))]
    [AddComponentMenu("Azure[Sky] Dynamic Skybox/Azure Particle FX")]
    public sealed class AzureParticleFX : MonoBehaviour
    {
        /// <summary>
        /// Field: The particle system attached to this game object.
        /// </summary>
        private ParticleSystem m_particleSystem;


        /// <summary>
        /// Field: The reference to the emission module of the attached particle system.
        /// </summary>
        private ParticleSystem.EmissionModule m_particleEmission;


        /// <summary>
        /// Field: The emission intensity of the particle system attached to this game object.
        /// </summary>
        private float m_intensity;

        /// <summary>
        /// Field: The emission intensity of the particle system attached to this game object.
        /// </summary>
        public float Intensity
        {
            get => m_intensity;
            set
            {
                m_intensity = value;

                if (m_particleSystem)
                {
                    m_particleEmission.rateOverTimeMultiplier = value;
                    if (value > 0)
                    {
                        if (!m_particleSystem.isPlaying) m_particleSystem.Play();
                    }
                    else if (m_particleSystem.isPlaying) m_particleSystem.Stop();
                }
            }
        }


        private void Awake()
        {
            m_particleSystem = GetComponent<ParticleSystem>();
            if (m_particleSystem) m_particleEmission = m_particleSystem.emission;
        }
    }
}