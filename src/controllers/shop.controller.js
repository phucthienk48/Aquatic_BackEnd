const shopService = require("../services/shop.service");

// Thêm shop
exports.createShop = async (req, res) => {
  try {
    const shop = await shopService.createShop(req.body);
    res.status(201).json({
      message: "Thêm shop thành công",
      shop
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm shop" });
  }
};

// Lấy tất cả shop
exports.getAllShops = async (req, res) => {
  try {
    const shops = await shopService.getAllShops();
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách shop" });
  }
};

// Lấy shop theo ID
exports.getShopById = async (req, res) => {
  try {
    const shop = await shopService.getShopById(req.params.id);
    if (!shop)
      return res.status(404).json({ message: "Không tìm thấy shop" });

    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Cập nhật shop
exports.updateShop = async (req, res) => {
  try {
    const shop = await shopService.updateShop(req.params.id, req.body);
    if (!shop)
      return res.status(404).json({ message: "Không tìm thấy shop" });

    res.json({
      message: "Cập nhật shop thành công",
      shop
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật shop" });
  }
};

// Xóa shop
exports.deleteShop = async (req, res) => {
  try {
    const shop = await shopService.deleteShop(req.params.id);
    if (!shop)
      return res.status(404).json({ message: "Không tìm thấy shop" });

    res.json({ message: "Xóa shop thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa shop" });
  }
};
