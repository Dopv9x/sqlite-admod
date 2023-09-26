import csvtojson from 'csvtojson';

const convertCsvToJson = (data: string) => {
  return new Promise(resolve => {
    csvtojson()
      .fromString(data)
      .then(async (jsonData: any) => {
        resolve(jsonData);
      });
  });
};

export {convertCsvToJson};
