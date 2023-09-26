import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {name: 'example.db', location: 'default'},
  () => {
    console.log('___connect_to_db_success__');
  },
  e => {
    console.log('e', e);
  },
);

type fieldType = {
  name: string;
  type: 'TEXT' | 'INTEGER';
};

export interface ImageTableType {
  Name: string;
  url: string;
}

export interface ImagesForm {
  _id: number;
  name: string;
  url: string;
}

const isExistTable = (tableName: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
        [tableName.toLocaleLowerCase()],
        (_, result) => {
          if (result.rows.length > 0) {
            resolve(true); // Table exists
          } else {
            resolve(false); // Table does not exist
          }
        },
        (_, error) => {
          console.log(`check table ${tableName} exist: false`);
          reject(false); // Error occurred while executing the query
        },
      );
    });
  });
};

const createTable = async (tableName: string, fields: fieldType[]) => {
  const fieldName = fields.reduce(
    (total, e) => total + `, ${e.name} ${e.type.toUpperCase()}`,
    '',
  );

  return await db.transaction(
    tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableName} (_id  integer primary key not null${fieldName});`,
      );
    },
    e => {
      console.log('___e___create table___', e);
    },
  );
};

const addData = async (table: string, fields: string[], value: string[]) => {
  await db.transaction(async tx => {
    await tx.executeSql(
      `INSERT INTO ${table} (${fields.toString()}) VALUES (?,?)`,
      value,
      () => {},
      e => {
        console.log('__err__add___', e);
      },
    );
    console.log('__add__success');
  });
};

const getData = (table: string) => {
  return new Promise(async (resolve, reject) => {
    await db.transaction(
      async tx => {
        await tx.executeSql(`SELECT * FROM ${table}`, [], (_, res) => {
          var leng = res.rows.length;
          let data = [];
          if (leng) {
            for (let index = 0; index < leng; index++) {
              const element = res.rows.item(index);
              data.push(element);
            }
          }
          resolve(data);
        });
      },
      e => {
        reject(e);
      },
    );
  });
};

export {createTable, addData, getData, isExistTable};
