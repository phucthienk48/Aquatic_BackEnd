const Shop = require("../models/shop.model");

// Thêm shop
exports.createShop = async (data) => {
  return await Shop.create(data);
};

// Lấy danh sách shop
exports.getAllShops = async () => {
  return await Shop.find().sort({ createdAt: -1 });
};

// Lấy shop theo ID
exports.getShopById = async (id) => {
  return await Shop.findById(id);
};

// Cập nhật shop
exports.updateShop = async (id, data) => {
  return await Shop.findByIdAndUpdate(id, data, {
    new: true
  });
};

// Xóa shop
exports.deleteShop = async (id) => {
  return await Shop.findByIdAndDelete(id);
};
