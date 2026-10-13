import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const readJSON = (path) => require(path);
const pkg = readJSON('./package.json');
import fs from 'node:fs';
import path from 'node:path';
import fileBytes from 'file-bytes';
import prettyBytes from 'pretty-bytes';
import { glob } from 'glob';

export default function generateData() {
  const SRC_PATH = 'src/banner_list';
  const SRC_PATH_ZIPS = 'dist/ZIPS/*';
  const FOLDER = getFolders(SRC_PATH);
  const sizeArray = [];

  function getFolders(dir) {
    return fs.readdirSync(dir).filter(function() {
      return fs.statSync(path.join(dir)).isDirectory();
    });
  }

  const files = glob.sync(SRC_PATH_ZIPS);

  if (files.length !== 0) {
    for (const file of files) {
      const size = prettyBytes(fileBytes.sync(file));
      sizeArray.push(size);
    }
  }

  const getDir = FOLDER.filter((path) => path !== '.DS_Store');

  const getDirUrl = FOLDER.filter((path) => path !== '.DS_Store').map((path) => `${path}/index.html`);

  const data = {};
  data.info = [];

  const obj = {
    campaign: pkg.campaign,
    advertiser: pkg.advertiser,
    disclaimer: pkg.disclaimer,
    sizes: getDir,
    path: getDirUrl,
    fileSize: sizeArray,
  };

  data.info.push(obj);

  fs.writeFile('./src/data.json', JSON.stringify(data), function(err) {
    if (err) throw err;
  });

  return getDir;
};
