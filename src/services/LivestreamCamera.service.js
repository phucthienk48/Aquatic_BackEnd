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

      // giữ tối đa 30 chunk, LUÔN BẢO TOÀN CHUNK ĐẦU TIÊN (Header) tại index 0 !
      const files = fs.readdirSync(streamFolder).sort();

      if (files.length > 30) {
        const oldFile = files[1]; // Xóa phần tử thứ 2, giữ lại thẻ 0
        if (oldFile) fs.unlinkSync(path.join(streamFolder, oldFile));
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

      // Lấy 10 file gần nhất để live (giảm trễ)
      let latestFiles = files.slice(-10);

      // Nếu 10 file này đã bị đẩy ra khỏi index 0, BẮT BUỘC chèn chunk Header (files[0]) vào
      if (files.length > 10 && !latestFiles.includes(files[0])) {
         latestFiles.unshift(files[0]);
      }

      // User requested newest chunks at the top (index 0). Header goes to the bottom.
      latestFiles.reverse();

      return latestFiles.map(file => {
        return { url: `/videos/${livestreamId}/${file}` };
      });

    }


  // ======================
  // GET STATUS
  // ======================
  async getStatus(livestreamId) {
    const camera = await LivestreamCamera.findOne({ livestreamId });
    if (!camera) return false;
    return camera.isCameraOn;
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