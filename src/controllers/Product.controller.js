const ProductService = require("../services/Product.service");

//  Create
exports.createProduct = async (req, res) => {
  try {
    const Product = await ProductService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: "Tạo cá cảnh thành công",
      data: Product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//  Get all
exports.getAllProduct = async (req, res) => {
  try {
    const Productes = await ProductService.getAllProduct();
    res.json({ success: true, data: Productes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get by id
exports.getProductById = async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "ID không hợp lệ",
    });
  }
};


// Update
exports.updateProduct = async (req, res) => {
  try {
    const Product = await ProductService.updateProduct(req.params.id, req.body);
    res.json({
      success: true,
      message: "Cập nhật cá cảnh thành công",
      data: Product,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//  Delete
exports.deleteProduct = async (req, res) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    res.json({
      success: true,
      message: "Xóa cá cảnh thành công",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
//  Search product by keyword
exports.searchProduct = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.json([]);
    }

    const products = await ProductService.searchProduct(keyword);

    res.json(products);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};