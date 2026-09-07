//Based on Unity's GlobalFog.
namespace UnityEngine.AzureSky
{
    [ImageEffectAllowedInSceneView]
    [ExecuteInEditMode]
    [RequireComponent(typeof(Camera))]
    [AddComponentMenu("Azure[Sky] Dynamic Skybox/Azure Fog Scattering")]
    public sealed class AzureFogScattering : MonoBehaviour
    {
        /// <summary>
        /// Field: The material that will render the fog effect.
        /// </summary>
        [SerializeField] private Material m_fogMaterial;

        /// <summary>
        /// Property: The material that will render the fog effect.
        /// </summary>
        public Material FogMaterial { get => m_fogMaterial; set => m_fogMaterial = value; }



        /// <summary>
        /// Field: Local reference to the camera component.
        /// </summary>
        private Camera m_camera = null;


        /// <summary>
        /// Field: Local reference to the camera transform.
        /// </summary>
        private Transform m_cameraTransform = null;


        /// <summary>
        /// Field: The camera frunstum corners position.
        /// </summary>
        private Vector3[] m_frustumCorners = new Vector3[4];


        /// <summary>
        /// Field: The view port rect.
        /// </summary>
        private Rect m_viewRect = new Rect(0, 0, 1, 1);


        /// <summary>
        /// Field: The camera frustum corners matrix.
        /// </summary>
        private Matrix4x4 m_frustumCornersArray;


        private void Start()
        {
            m_camera = GetComponent<Camera>();
            m_cameraTransform = m_camera.transform;
        }
        

        [ImageEffectOpaque]
        void OnRenderImage(RenderTexture source, RenderTexture destination)
        {
            m_camera.depthTextureMode |= DepthTextureMode.Depth;


            if (m_fogMaterial == null)
            {
                Graphics.Blit(source, destination);
                return;
            }


            m_camera.CalculateFrustumCorners(m_viewRect, m_camera.farClipPlane, m_camera.stereoActiveEye, m_frustumCorners);
            m_frustumCornersArray = Matrix4x4.identity;
            m_frustumCornersArray.SetRow(0, m_cameraTransform.TransformVector(m_frustumCorners[0]));  // bottom left
            m_frustumCornersArray.SetRow(2, m_cameraTransform.TransformVector(m_frustumCorners[1]));  // top left
            m_frustumCornersArray.SetRow(3, m_cameraTransform.TransformVector(m_frustumCorners[2]));  // top right
            m_frustumCornersArray.SetRow(1, m_cameraTransform.TransformVector(m_frustumCorners[3]));  // bottom right


            m_fogMaterial.SetMatrix(AzureShaderUniforms.FrustumCornersMatrix, m_frustumCornersArray);
            Graphics.Blit(source, destination, m_fogMaterial, 0);
        }
    }
}