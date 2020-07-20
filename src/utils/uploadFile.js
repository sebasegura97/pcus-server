const { createWriteStream, existsSync, mkdirSync } = require("fs");
const path = require("path");
const moment = require("moment");

export default async function uploadFile(file, folder, subfolder, filenameToSave) {
  if (file) {
    const { createReadStream, filename } = await file;
    const fileExt = path.extname(filename);
    const baseDir = path.resolve("static");
    let dir = path.join(baseDir, `${folder}`, `${subfolder}`);

    if (!existsSync(dir)) {
      mkdirSync(dir);
    }

    const savedFilename = `${moment().unix()}-${filenameToSave}${fileExt}`;

    await new Promise((res) =>
      createReadStream()
        .pipe(createWriteStream(path.join(dir, savedFilename)))
        .on("close", res)
    );

    return `http://localhost:${process.env.REACT_APP_SERVER_PORT}/static/${folder}/${subfolder}/${savedFilename}`;
  } else {
    return null;
  }
}
