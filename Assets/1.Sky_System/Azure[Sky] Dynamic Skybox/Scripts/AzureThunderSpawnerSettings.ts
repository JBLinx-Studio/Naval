using System;


namespace UnityEngine.AzureSky
{
    /// <summary>
    /// This class is used to setup the thunder spawner settings list on the DynamicThunderSystem component.
    /// </summary>
    [Serializable]
    public sealed class AzureThunderSpawnerSettings
    {
        /// <summary>
        /// Field: The thunder prefab to be spawned.
        /// </summary>
        [SerializeField] private Transform m_prefab;

        /// <summary>
        /// Property: The thunder prefab to be spawned.
        /// </summary>
        public Transform Prefab { get => m_prefab; set => m_prefab = value; }


        /// <summary>
        /// Field: The prefab spawn position.
        /// </summary>
        [SerializeField] private Vector3 m_spawPos;

        /// <summary>
        /// Property: The prefab spawn position.
        /// </summary>
        public Vector3 SpawPos { get => m_spawPos; set => m_spawPos = value; }
    }
}