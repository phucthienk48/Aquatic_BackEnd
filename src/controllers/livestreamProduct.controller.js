const service = require("../services/livestreamProduct.service");

exports.getLivestreamProducts = async (req, res) => {
  try {
    const { livestreamId } = req.params;
    const data = await service.getProducts(livestreamId);
    res.json(data || { products: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { livestreamId } = req.params;
    const { productId } = req.body;

    const data = await service.addProduct(
      livestreamId,
      productId
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeProduct = async (req, res) => {
  try {
    const { livestreamId, productId } = req.params;
    const data = await service.removeProduct(
      livestreamId,
      productId
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.pinProduct = async (req, res) => {
  try {
    const { livestreamId, productId } = req.params;
    const data = await service.pinProduct(
      livestreamId,
      productId
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
