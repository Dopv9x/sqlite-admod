import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { Platform, PermissionsAndroid } from "react-native";
import RNFetchBlob from "rn-fetch-blob";

const saveImage = (url: string): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    switch (Platform.OS) {
      case "ios":
        CameraRoll.save(url, { type: "photo" })
          .then((res) => {
            if (res) {
              resolve(true);
            } else {
              reject(false);
            }
          })
          .catch((e) => {
            console.log("__ios_save_image_error_", e);
            reject(false);
          });

        break;
      case "android":
        const check = await hasAndroidPermission();
        if (!check) {
          reject(false);
        }
        RNFetchBlob.config({
          fileCache: true,
          appendExt: "png",
        })
          .fetch("GET", url)
          .then((res) => {
            CameraRoll.saveToCameraRoll(res.data, "photo")
              .then((res) => {
                if (res) {
                  resolve(true);
                } else {
                  reject(false);
                }
              })
              .catch((e) => {
                console.log("__android_save_image_error_", e);
                reject(false);
              });
          })
          .catch((e) => {
            console.log("__RNFetchBlob_android_url_image_FALSE:", e);
            reject(e);
          });

        break;
      default:
        break;
    }
  });
};

async function hasAndroidPermission() {
  const getCheckPermissionPromise = () => {
    if (Platform.Version >= 33) {
      return Promise.all([
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        ),
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
        ),
      ]).then(
        ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
          hasReadMediaImagesPermission && hasReadMediaVideoPermission
      );
    } else {
      return PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
    }
  };

  const hasPermission = await getCheckPermissionPromise();
  if (hasPermission) {
    return true;
  }
  const getRequestPermissionPromise = () => {
    if (Platform.Version >= 33) {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]).then(
        (statuses) =>
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
            PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      ).then((status) => status === PermissionsAndroid.RESULTS.GRANTED);
    }
  };

  return await getRequestPermissionPromise();
}

export { saveImage };
