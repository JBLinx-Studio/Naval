using System;


namespace UnityEngine.AzureSky
{
    [ExecuteInEditMode]
    [AddComponentMenu("Azure[Sky] Dynamic Skybox/Azure Weather Zone")]
    public sealed class AzureWeatherZone : MonoBehaviour
    {
        /// <summary>
        /// Field: How smooth is the weather change when entering a local weather zone.
        /// </summary>
        [SerializeField] private float m_blendDistance = 0f;

        /// <summary>
        /// Property: How smooth is the weather change when entering a local weather zone.
        /// </summary>
        public float BlendDistance { get => m_blendDistance; set => m_blendDistance = value; }


        /// <summary>
        /// Field: The collider used as volume by this local weather zone.
        /// </summary>
        [SerializeField] private Collider m_collider;

        /// <summary>
        /// Property: The collider used as volume by this local weather zone.
        /// </summary>
        public Collider Collider { get => m_collider; set => m_collider = value; }


        /// <summary>
        /// Field: The weather preset associated to this local zone.
        /// </summary>
        [SerializeField] private AzureWeatherPreset m_weatherPreset;

        /// <summary>
        /// Property: The weather preset associated to this local zone.
        /// </summary>
        public AzureWeatherPreset WeatherPreset { get => m_weatherPreset; set => m_weatherPreset = value; }


        private void Awake()
        {
            if (!m_collider) m_collider = GetComponent<Collider>();
        }


        /// <summary>
        /// Notify when this weather zone is destroyed.
        /// </summary>
        private void OnDestroy()
        {
            // Editor only
            #if UNITY_EDITOR
            AzureNotificationCenterEditor.Invoke.DestroyWeatherZoneCallback(this);
            #endif
        }


        // Editor only
        #if UNITY_EDITOR
        /// <summary>
        /// The color used to draw the volume gizmo.
        /// </summary>
        private Color m_gizmosColor1 = new Color(0, 1, 0, 0.25f);


        /// <summary>
        /// Draws the zone collider gizmos.
        /// Based on Unity's PostProcessVolume.cs.
        /// </summary>
        private void OnDrawGizmos()
        {
            if (!m_collider) m_collider = GetComponent<Collider>();
            if (m_collider == null) return;


            if (m_collider.enabled)
            {
                Vector3 scale = transform.lossyScale;
                Vector3 invScale = new Vector3(1f / scale.x, 1f / scale.y, 1f / scale.z);
                Gizmos.matrix = Matrix4x4.TRS(transform.position, transform.rotation, scale);

                
                Type type = m_collider.GetType();
                if (type == typeof(BoxCollider))
                {
                    BoxCollider c = (BoxCollider) m_collider;
                    Gizmos.color = m_gizmosColor1;
                    Gizmos.DrawCube(c.center, c.size);
                    Gizmos.color = Color.green;
                    Gizmos.DrawWireCube(c.center, c.size + invScale * m_blendDistance * 4f);
                }
                else if (type == typeof(SphereCollider))
                {
                    SphereCollider c = (SphereCollider) m_collider;
                    Gizmos.color = m_gizmosColor1;
                    Gizmos.DrawSphere(c.center, c.radius);
                    Gizmos.color = Color.green;
                    Gizmos.DrawWireSphere(c.center, c.radius + invScale.x * m_blendDistance * 2f);
                }
                else if (type == typeof(MeshCollider))
                {
                    MeshCollider c = (MeshCollider) m_collider;

                    // Only convex mesh collider are allowed
                    if (!c.convex)
                        c.convex = true;

                    // Mesh pivot should be centered or this won't work
                    Gizmos.color = m_gizmosColor1;
                    Gizmos.DrawMesh(c.sharedMesh);
                    Gizmos.color = Color.green;
                    Gizmos.DrawWireMesh(c.sharedMesh, Vector3.zero, Quaternion.identity, Vector3.one + invScale * m_blendDistance * 4f);
                }
            }
        }
        #endif
    }
}