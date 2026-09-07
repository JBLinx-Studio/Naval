using System.Collections.Generic;


namespace UnityEditor.AzureSky
{
    /// <summary>
    /// Class used to trigger the "OnEnable()" of all the ScriptableObjects in the project when the editor is
    /// loaded. By default, the ScriptableObjects seems to call OnEnabled only when they became visible in the project window or selected.
    /// </summary>
    [InitializeOnLoad]
    internal sealed class InitializeScriptableObjects : Editor
    {
        //static InitializeScriptableObjects()
        //{
        //    // Find all ScriptableObjects in the project to initialize it. Using SetDirt() just do the trick
        //    List<AzureWeatherPreset> presets = FindAssetsByType<AzureWeatherPreset>();
        //    foreach (var p in presets)
        //    {
        //        EditorUtility.SetDirty(p);
        //    }
        //}


        /// <summary>
        /// Find any asset type in the Editor.
        /// </summary>
        static public List<T> FindAssetsByType<T>() where T : UnityEngine.Object
        {
            List<T> assets = new List<T>();
            string[] guids = AssetDatabase.FindAssets(string.Format("t:{0}", typeof(T)));
            for (int i = 0; i < guids.Length; i++)
            {
                string assetPath = AssetDatabase.GUIDToAssetPath(guids[i]);
                T asset = AssetDatabase.LoadAssetAtPath<T>(assetPath);
                if (asset != null)
                {
                    assets.Add(asset);
                }
            }
            return assets;
        }
    }
}