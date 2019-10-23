export default class FileService {

  saveFile(filename, data) {
    const fs = require('fs');
    fs.writeFile(filename, JSON.stringify(data), function (err) {
      if (err) {
        return console.log(err);
      }
    });
  }

  readFile(filename, callbk) {
    const fs = require('fs');
    fs.readFile(filename, callbk);
  }
}