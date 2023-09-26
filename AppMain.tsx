/* eslint-disable react-native/no-inline-styles */
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  ImageTableType,
  ImagesForm,
  addData,
  createTable,
  getData,
  isExistTable,
} from './shared/sqlite.common';
import {getLocalData} from './shared/rnfs.common';
import {convertCsvToJson} from './shared/csvtojson.common';
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
    const csvData = await getLocalData('testCsv.csv');
    if (!csvData) {
      return;
    }
    const jsonData = (await convertCsvToJson(csvData)) as ImageTableType[];
    console.log(jsonData);
    if (jsonData.length) {
      const checkImages = await isExistTable('images');
      if (!checkImages) {
        await createTable('images', [
          {name: 'name', type: 'TEXT'},
          {name: 'url', type: 'TEXT'},
        ]);
        for (const iterator of jsonData) {
          await addData(
            'images',
            ['name', 'url'],
            [iterator.Name, iterator.url],
          );
        }
      } else {
        const res = (await getData('images')) as ImagesForm[];
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
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{paddingHorizontal: 20}}>
        {images &&
          images.map((e, i) => {
            return (
              <TouchableOpacity
                onPress={incre_Count}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: 'lightgray',
                  marginTop: 5,
                }}
                key={i}>
                <Image
                  source={{uri: e.url}}
                  style={{height: 60, width: 60, resizeMode: 'cover'}}
                />
                <Text style={{paddingLeft: 20}}>{e.name}</Text>
              </TouchableOpacity>
            );
          })}
      </View>
    </SafeAreaView>
  );
};

export default AppMain;
