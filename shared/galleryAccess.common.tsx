import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { Platform } from "react-native";

const saveImage = (url: string) => {
  return new Promise((resolve, reject) => {
    switch (Platform.OS) {
      case "ios":
        CameraRoll.save(url, { type: "photo" })
          .then((res) => {
            console.log("__res__", res);
            resolve(res);
          })
          .catch((e) => {
            console.log("__e__", e);
            reject(e);
          });

        break;
      case "android":
        break;

      default:
        break;
    }
  });
};

export { saveImage };
