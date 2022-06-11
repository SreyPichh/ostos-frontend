const functions = require("firebase-functions");
const os = require("os");
const path = require("path");
const spawn = require("child-process-promise").spawn;
const cors = require("cors")({ origin: true });
const BusBoy = require("busboy");
const fs = require("fs");
const { randomFillSync } = require("crypto");

const random = (() => {
  const buf = Buffer.alloc(16);
  return () => randomFillSync(buf).toString("hex");
})();

const gcconfig = {
  projectId: "ostos-sticker-2022",
  keyFilename: "ostos-sticker-2022-firebase-adminsdk-8hpnj-14261ff583.json",
};

const { Storage } = require("@google-cloud/storage");

let gcs = new Storage(gcconfig);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.onFileChange = functions.storage.object().onFinalize((event) => {
  const bucket = event.bucket;
  const contentType = event.contentType;
  const filePath = event.name;

  const distBucket = gcs.bucket(bucket);
  const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
  const metadata = { contentType: contentType };

  if (path.basename(filePath).startsWith("resized-")) {
    return;
  }

  return distBucket
    .file(filePath)
    .download({
      destination: tempFilePath,
    })
    .then(() => {
      return spawn("convert", [
        tempFilePath,
        "-resize",
        "500x500",
        tempFilePath,
      ]);
    })
    .then(() => {
      return distBucket.upload(tempFilePath, {
        destination: "resized-" + path.basename(filePath),
        metadata: metadata,
      });
    });
});

exports.uploadFile = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(500).json({
        message: "Not allowed",
      });
    }
    const busboy = BusBoy({ headers: req.headers });
    let uploadData = null;

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const filepath = path.join(os.tmpdir(), `img-${random()}`);
      uploadData = { file: filepath, type: mimetype };
      file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on("finish", () => {
      const bucket = gcs.bucket("ostos-sticker-2022.appspot.com");
      bucket
        .upload(uploadData.file, {
          uploadType: "media",
          metadata: {
            metadata: {
              contentType: uploadData.type,
            },
          },
        })
        .then(() => {
          res.status(200).json({
            message: "It worked!",
          });
        })
        .catch((err) => {
          return res.status(500).json({
            error: err,
          });
        });
    });
    busboy.end(req.rawBody);
  });
});
