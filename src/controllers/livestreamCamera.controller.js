const livestreamCameraService = require(
  "../services/LivestreamCamera.service"
);

exports.startCamera = async (req, res) => {

  try {

    const { livestreamId } = req.body;

    const camera = await livestreamCameraService.startCamera(
      livestreamId
    );

    res.json({
      success: true,
      camera
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};



exports.stopCamera = async (req, res) => {

  try {

    const { livestreamId } = req.body;

    const camera = await livestreamCameraService.stopCamera(
      livestreamId
    );

    res.json({
      success: true,
      camera
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};



exports.getChunks = async (req, res) => {

  try {

    const { livestreamId } = req.params;

    const chunks = livestreamCameraService.getChunks(
      livestreamId
    );

    res.json(chunks);

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};



exports.deleteChunks = async (req, res) => {

  try {

    const { livestreamId } = req.params;

    livestreamCameraService.deleteChunks(livestreamId);

    res.json({
      success: true
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};