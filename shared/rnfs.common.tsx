import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

const getLocalData = (fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    switch (Platform.OS) {
      case 'ios':
        RNFS.readDir(RNFS.MainBundlePath)
          .then(data => {
            const fileDetail = data.find(e => e.name === fileName);
            if (fileDetail) {
              RNFS.readFile(fileDetail.path, 'utf8')
                .then((data: string) => {
                  resolve(data);
                })
                .catch(error => {
                  console.error(
                    `Error readFile ${fileName} file:`,
                    error.message,
                  );
                  reject(error.message);
                });
            }
          })
          .catch(error => {
            console.error(`Error readDir ${fileName} file:`, error.message);
            reject(error.message);
          });
        break;
      case 'android':
        RNFS.readFileAssets(`custom/${fileName}`)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.error(`Error readDir ${fileName} file:`, e.message);
            reject(e);
          });
        break;
      default:
        break;
    }
  });
};

export {getLocalData};
