using System;


namespace UnityEngine.AzureSky
{
    /// <summary>
    /// Follow target item.
    /// </summary>
    [Serializable]
    public sealed class AzureFollowTarget
    {
        /// <summary>
        /// Field: The transform that will follow the target.
        /// </summary>
        [SerializeField] private Transform m_follower;

        /// <summary>
        /// Property: The transform that will follow the target.
        /// </summary>
        public Transform Follower { get => m_follower; set => m_follower = value; }


        /// <summary>
        /// Field: The transform to follow.
        /// </summary>
        [SerializeField] private Transform m_target;

        /// <summary>
        /// Property: The transform to follow.
        /// </summary>
        public Transform Target { get => m_target; set => m_target = value; }
    }
}