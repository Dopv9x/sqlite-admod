/* eslint-disable react-native/no-inline-styles */
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  ImageTableType,
  ImagesForm,
  addData,
  createTable,
  getData,
  isExistTable,
} from "./shared/sqlite.common";
import { getLocalData } from "./shared/rnfs.common";
import { convertCsvToJson } from "./shared/csvtojson.common";
import { saveImage } from "./shared/galleryAccess.common";
import {
  RewardedAd,
  BannerAd,
  BannerAdSize,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";

const reward_UnitId =
  Platform.OS === "ios"
    ? "ca-app-pub-9711240182969577/8958353614"
    : "ca-app-pub-7122371230490146/8716316086";

const AppMain = () => {
  const [images, setImages] = useState<ImagesForm[] | []>([]);
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    const load = async () => {
      await getTestCsv();
    };
    load();
  }, []);

  const getTestCsv = async () => {
    const csvData = await getLocalData("testCsv.csv");
    if (!csvData) {
      return;
    }
    const jsonData = (await convertCsvToJson(csvData)) as ImageTableType[];
    if (jsonData.length) {
      const checkImages = await isExistTable("images");
      if (!checkImages) {
        await createTable("images", [
          { name: "name", type: "TEXT" },
          { name: "url", type: "TEXT" },
        ]);
        for (const iterator of jsonData) {
          await addData(
            "images",
            ["name", "url"],
            [iterator.Name, iterator.url]
          );
        }
      } else {
        const res = (await getData("images")) as ImagesForm[];
        if (res.length) {
          setImages(res);
        }
      }
    }
  };

  const incre_Count = () => {
    setCount(count + 1);
    if (count === 5) {
      reset_Count();
    }
  };

  const reset_Count = () => {
    setCount(0);
  };

  const _onItem = async (url: string) => {
    incre_Count();
    showRewardAds();
    const res = await saveImage(url);
    if (res) {
      Alert.alert("save image success");
    }
  };

  const showRewardAds = () => {
    const rewarded = RewardedAd.createForAdRequest(reward_UnitId);
    rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      rewarded.show();
    });

    rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log("User earned reward of ", reward);
      // AsyncStorage.setItem(WebViewScene.dl_count_Key, '0');
    });

    rewarded.load();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 20 }}>
        {images &&
          images.map((e, i) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  _onItem(e.url);
                }}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  flexDirection: "row",
                  borderWidth: 1,
                  borderColor: "lightgray",
                  marginTop: 5,
                }}
                key={i}
              >
                <Image
                  source={{ uri: e.url }}
                  style={{ height: 60, width: 60, resizeMode: "cover" }}
                />
                <Text style={{ paddingLeft: 20 }}>{e.name}</Text>
              </TouchableOpacity>
            );
          })}
      </View>
    </SafeAreaView>
  );
};

export default AppMain;
