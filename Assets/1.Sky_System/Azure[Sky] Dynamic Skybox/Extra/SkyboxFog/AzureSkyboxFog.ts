namespace UnityEngine.AzureSky
{
    [ImageEffectAllowedInSceneView]
    [ExecuteInEditMode]
    [RequireComponent(typeof(Camera))]
    public class AzureSkyboxFog : MonoBehaviour
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
        /// Field: The global fog distance.
        /// </summary>
        [SerializeField] private float m_globalFogDistance = 1000.0f;
        /// <summary>
        /// Property: The global fog distance.
        /// </summary>
        public float GlobalFogDistance { get => m_globalFogDistance; set => m_globalFogDistance = value; }


        /// <summary>
        /// Field: The global fog smooth step.
        /// </summary>
        [SerializeField] private float m_globalFogSmoothStep = 0.25f;

        /// <summary>
        /// Property: The global fog smooth step.
        /// </summary>
        public float GlobalFogSmoothStep { get => m_globalFogSmoothStep; set => m_globalFogSmoothStep = value; }


        /// <summary>
        /// Field: The global fog density/opacity.
        /// </summary>
        [SerializeField] private float m_globalFogDensity = 1.0f;

        /// <summary>
        /// Property: The global fog density/opacity.
        /// </summary>
        public float GlobalFogDensity { get => m_globalFogDensity; set => m_globalFogDensity = value; }


        /// <summary>
        /// Field: The height fog distance.
        /// </summary>
        [SerializeField] private float m_heightFogDistance = 100.0f;

        /// <summary>
        /// Property: The height fog distance.
        /// </summary>
        public float HeightFogDistance { get => m_heightFogDistance; set => m_heightFogDistance = value; }


        /// <summary>
        /// Field: The height fog smooth step.
        /// </summary>
        [SerializeField] private float m_heightFogSmoothStep = 1.0f;

        /// <summary>
        /// Property: The height fog smooth step.
        /// </summary>
        public float HeightFogSmoothStep { get => m_heightFogSmoothStep; set => m_heightFogSmoothStep = value; }


        /// <summary>
        /// Field: The height fog density/opcaity.
        /// </summary>
        [SerializeField] private float m_heightFogDensity = 0.0f;

        /// <summary>
        /// Property: The height fog density/opcaity.
        /// </summary>
        public float HeightFogDensity { get => m_heightFogDensity; set => m_heightFogDensity = value; }


        /// <summary>
        /// Field: The height fog start altitude.
        /// </summary>
        [SerializeField] private float m_heightFogStart = 0.0f;

        /// <summary>
        /// Property: The height fog start altitude.
        /// </summary>
        public float HeightFogStart { get => m_heightFogStart; set => m_heightFogStart = value; }


        /// <summary>
        /// Field: The height fog end altitude.
        /// </summary>
        [SerializeField] private float m_heightFogEnd = 100.0f;

        /// <summary>
        /// Property: The height fog end altitude.
        /// </summary>
        public float HeightFogEnd { get => m_heightFogEnd; set => m_heightFogEnd = value; }



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
            m_fogMaterial.SetFloat(AzureShaderUniforms.GlobalFogDistance, m_globalFogDistance);
            m_fogMaterial.SetFloat(AzureShaderUniforms.GlobalFogSmoothStep, m_globalFogSmoothStep);
            m_fogMaterial.SetFloat(AzureShaderUniforms.GlobalFogDensity, m_globalFogDensity);
            m_fogMaterial.SetFloat(AzureShaderUniforms.HeightFogDistance, m_heightFogDistance);
            m_fogMaterial.SetFloat(AzureShaderUniforms.HeightFogSmoothStep, m_heightFogSmoothStep);
            m_fogMaterial.SetFloat(AzureShaderUniforms.HeightFogDensity, m_heightFogDensity);
            m_fogMaterial.SetFloat(AzureShaderUniforms.HeightFogStart, m_heightFogStart);
            m_fogMaterial.SetFloat(AzureShaderUniforms.HeightFogEnd, m_heightFogEnd);


            Graphics.Blit(source, destination, m_fogMaterial, 0);
        }
    }
}