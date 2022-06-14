require('./app/stringHelper');
require('./app/arrayHelper');
require('./app/helper');
const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');
const OUTPUT_DIR = './output/';

const links = ['https://whatmyuseragent.com/platforms/and/android/android-13', 'https://whatmyuseragent.com/platforms/and/android/android-12', 'https://whatmyuseragent.com/platforms/and/android/android-11', 'https://whatmyuseragent.com/platforms/and/android/android-10', 'https://whatmyuseragent.com/platforms/and/android/android-9', 'https://whatmyuseragent.com/platforms/ios/ios/ios-15', 'https://whatmyuseragent.com/platforms/ios/ios/ios-14', 'https://whatmyuseragent.com/platforms/ios/ios/ios-13', 'https://whatmyuseragent.com/platforms/ios/ios/ios-12', 'https://whatmyuseragent.com/platforms/ios/ios/ios-11', 'https://whatmyuseragent.com/platforms/ios/ios/ios-10'];

/*-----------------*/
const parseUserAgent = async (userAgent) => {
  const response = await axios.get(`https://whatmyuseragent.com/api?ua=${userAgent}&key=NOTREQUIED`);
  const parsedByApi = response.data;
  let result = {};
  result.userAgent = userAgent;
  Object.entries(parsedByApi).forEach((entry) => {
    const entryName = entry[0];
    let entryVal = {};
    Object.entries(entry[1]).forEach((childEntry) => {
      entryVal = {
        ...entryVal,
        [`${entryName}${childEntry[0].ucfirst()}`]: childEntry[1],
      };
    });
    result = {
      ...result,
      ...entryVal,
    };
  });

  return result;
};

/*-----------*/
const parser = async (link) => {
  const response = await axios.get(link);
  const $ = cheerio.load(response.data);
  let result = [];
  const preResult = $('div.card table.table-useragents tbody tr').each((trId, tr) => {
    const userAgent = $($(tr).find('td')[0]).text();
    result = [...result, userAgent];
  });

  return result;
};

const skratchdotParsed = async () => {
  const response = await axios.get('https://raw.githubusercontent.com/skratchdot/random-useragent/master/useragent-data.json');
  const raw = response.data;
  const result = await Promise.all(
    raw.map(async (device) => {
      const parsed = await parseUserAgent(device.userAgent);

      return parsed;
    }),
  );
  return result;
};
const pzbUserAgents = async () => {
  const response = await axios.get('https://gist.githubusercontent.com/pzb/b4b6f57144aea7827ae4/raw/cf847b76a142955b1410c8bcef3aabe221a63db1/user-agents.txt');
  const raw = response.data.split('\n');
  const result = await Promise.all(
    raw.map(async (uA) => {
      const parsed = await parseUserAgent(uA);

      return parsed;
    }),
  );
  return result;
};

const addUserAgentToJSON = (deviceTobeSaved = {}, jsonFileName = 'user-agents.json') => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  const filePath = OUTPUT_DIR + jsonFileName;
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), { flag: 'w+' });
  }

  const lastSavedRaw = fs.readFileSync(filePath);
  const lastSaved = JSON.parse(lastSavedRaw);
  let isUnique = true;
  lastSaved.forEach((device) => {
    if (device.userAgent == deviceTobeSaved.userAgent) {
      isUnique = false;
    }
  });
  if (isUnique) {
    const content = [...lastSaved, deviceTobeSaved];
    try {
      fs.writeFileSync(filePath, JSON.stringify(content));
      // console.log(content);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  } else {
    console.log('not Unique', deviceTobeSaved);
    return false;
  }
};
const parseAndSave = async (link) => {
  const useragent = await parser(link);
  const parsed = await Promise.all(
    useragent.map(async (userAgent) => {
      const result = await parseUserAgent(userAgent);
      const saved = addUserAgentToJSON(result, 'user-agents.json');
      return { saved: saved, content: result };
    }),
  );
  // const parsed = await skratchdotParsed();
  console.log(parsed);
};

(function () {
  links.forEach((link) => {
    parseAndSave(link);
  });
})();
