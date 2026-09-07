using System.Collections.Generic;


namespace UnityEngine.AzureSky
{
    [AddComponentMenu("Azure[Sky] Dynamic Skybox/Azure Thunder Controller")]
    public sealed class AzureThunderController : MonoBehaviour
    {
        /// <summary>
        /// Field: The list of thunder spawner settings.
        /// </summary>
        [SerializeField] private List<AzureThunderSpawnerSettings> m_thunderSpawnerSettingsList = new List<AzureThunderSpawnerSettings>();

        /// <summary>
        /// Property: The list of thunder spawner settings.
        /// </summary>
        public List<AzureThunderSpawnerSettings> ThunderSpawnerSettingsList { get => m_thunderSpawnerSettingsList; set => m_thunderSpawnerSettingsList = value; }


        /// <summary>
		/// Instantiate a thunder object to the scene. When the thunder audio clip is over, the instance is automatically deleted.
		/// </summary>
		public void InstantiateThunderObject(int index)
        {
            if (m_thunderSpawnerSettingsList.Count > 0)
            {
                if (m_thunderSpawnerSettingsList.Count >= index)
                {
                    if (m_thunderSpawnerSettingsList[index].Prefab)
                    {
                        Instantiate(m_thunderSpawnerSettingsList[index].Prefab, m_thunderSpawnerSettingsList[index].SpawPos, m_thunderSpawnerSettingsList[index].Prefab.rotation);
                    }
                }
            }
        }
    }
}