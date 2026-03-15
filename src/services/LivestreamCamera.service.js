const fs = require("fs");
const path = require("path");
const LivestreamCamera = require("../models/LivestreamCamera.model");

const VIDEO_FOLDER = path.join(__dirname, "../videos");

class LivestreamCameraService {

  // ======================
  // START CAMERA
  // ======================
  async startCamera(livestreamId) {

    let camera = await LivestreamCamera.findOne({ livestreamId });

    if (!camera) {

      camera = await LivestreamCamera.create({
        livestreamId,
        isCameraOn: true,
        startedAt: new Date()
      });

    } else {

      camera.isCameraOn = true;
      camera.startedAt = new Date();
      camera.endedAt = null;

      await camera.save();

    }

    const streamFolder = path.join(
      VIDEO_FOLDER,
      livestreamId.toString()
    );

    if (!fs.existsSync(streamFolder)) {

      fs.mkdirSync(streamFolder, { recursive: true });

    }

    return camera;

  }



    saveChunk(livestreamId, chunk) {

      const streamFolder = path.join(
        VIDEO_FOLDER,
        livestreamId.toString()
      );

      if (!fs.existsSync(streamFolder)) {
        fs.mkdirSync(streamFolder, { recursive: true });
      }

      const fileName = `chunk_${Date.now()}.webm`;

      const filePath = path.join(streamFolder, fileName);

      fs.writeFileSync(filePath, chunk);

      // giữ tối đa 30 chunk
      const files = fs.readdirSync(streamFolder).sort();

      if (files.length > 50) {

        const oldFile = files[0];

        fs.unlinkSync(path.join(streamFolder, oldFile));

      }

      return filePath;

    }



// ======================
// GET CHUNKS
// ======================
    getChunks(livestreamId) {

      const streamFolder = path.join(
        VIDEO_FOLDER,
        livestreamId.toString()
      );

      if (!fs.existsSync(streamFolder)) return [];

      const files = fs.readdirSync(streamFolder).sort();

      const latestFiles = files.slice(-10);

      return latestFiles.map(file => {

        const filePath = path.join(streamFolder, file);

        return fs.readFileSync(filePath);

      });

    }


  // ======================
  // STOP CAMERA
  // ======================
  async stopCamera(livestreamId) {

    const camera = await LivestreamCamera.findOne({ livestreamId });

    if (!camera) return null;

    camera.isCameraOn = false;
    camera.endedAt = new Date();

    await camera.save();

    return camera;

  }



  // ======================
  // DELETE ALL CHUNKS
  // ======================
  deleteChunks(livestreamId) {

    const streamFolder = path.join(
      VIDEO_FOLDER,
      livestreamId.toString()
    );

    if (fs.existsSync(streamFolder)) {

      fs.rmSync(streamFolder, {
        recursive: true,
        force: true
      });

    }

  }

}

module.exports = new LivestreamCameraService();