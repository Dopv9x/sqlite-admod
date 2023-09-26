/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {name: 'example.db', location: 'default'},
  () => {
    console.log('___connect__success__');
  },
  e => {
    console.log('e', e);
  },
);
function App(): JSX.Element {
  const [users, setUsers] = useState<any[] | null>(null);

  useEffect(() => {
    createTable();
  }, []);

  const createTable = () => {
    db.transaction(
      tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS Users (_id  integer primary key not null, Name TEXT, Age INTERGER);',
        );
      },
      e => {
        console.log('___e___create table___', e);
      },
    );
  };

  const addData = async (name: string, age: number) => {
    console.log('__add_func___', name, age);

    await db.transaction(async tx => {
      await tx.executeSql(
        'INSERT INTO Users (Name,Age) VALUES (?,?)',
        [name, age],
        () => {},
        e => {
          console.log('__err__add___', e);
        },
      );
      console.log('__add__success');
    });
  };

  const getData = async () => {
    await db.transaction(
      async tx => {
        await tx.executeSql('SELECT * FROM Users', [], (tx, res) => {
          var leng = res.rows.length;
          let data = [];
          if (leng) {
            for (let index = 0; index < leng; index++) {
              const element = res.rows.item(index);
              data.push(element);
            }
            setUsers(data);
          }
        });
        console.log('__get_success___');
      },
      e => {
        console.log('__err__get___', e);
      },
    );
  };

  const randomData = async () => {
    const random = Math.floor(Math.random() * 100);
    await addData(`name ${random}`, random);
  };

  type ItemProps = {Name: string; Age: number; _id: number};

  const Item = ({Name, Age}: ItemProps) => (
    <View style={{paddingVertical: 6, flexDirection: 'row'}}>
      <Text style={{flex: 1}}>{Name}</Text>
      <Text style={{flex: 1}}>{Age}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, paddingHorizontal: 10}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 10,
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            backgroundColor: 'tomato',
          }}
          onPress={randomData}>
          <Text>add</Text>
        </TouchableOpacity>
        <View style={{width: 10}} />
        <TouchableOpacity
          style={{
            flex: 1,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            backgroundColor: 'lightgreen',
          }}
          onPress={getData}>
          <Text>get</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        style={{flex: 1}}
        renderItem={({item}: {item: ItemProps}) => (
          <Item Name={item.Name} Age={item.Age} _id={item._id} />
        )}
        keyExtractor={item => item._id.toString()}
      />
    </SafeAreaView>
  );
}

export default App;
