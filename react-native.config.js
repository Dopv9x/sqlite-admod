module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/data'],
  dependencies: {
    'react-native-sqlite-storage': {
      platforms: {
        android: {
          sourceDir:
            '../node_modules/react-native-sqlite-storage/platforms/android-native',
          packageImportPath: 'import io.liteglue.SQLitePluginPackage;',
          packageInstance: 'new SQLitePluginPackage()',
        },
      },
    },
    'react-native-fs': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-fs/android',
          packageImportPath: 'import com.rnfs.RNFSPackage;',
          packageInstance: 'new RNFSPackage()',
        },
      },
    },
  },
};
