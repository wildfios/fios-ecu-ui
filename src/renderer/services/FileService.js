export default class FileService {

  saveFile(data) {
    const fs = require('fs');
    fs.writeFile("/tmp/test.txt", JSON.stringify(data), function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  }

  readFile(callbk) {
    const fs = require('fs');
    fs.readFile("/tmp/test.txt", callbk);
  }
}