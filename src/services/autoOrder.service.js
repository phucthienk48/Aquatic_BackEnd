const Order = require("../models/order.model");
const ProductLive = require("../models/LivestreamProduct.model");
const User = require("../models/User");

class AutoOrderService {
  static async handle({ livestreamId, userId, content }) {
    try {
      // console.log("===== AUTO ORDER START =====");
      // console.log("LivestreamId:", livestreamId);
      // console.log("UserId:", userId);
      // console.log("Content:", content);

      // Kiểm tra comment có phải chốt không
      const match = content.match(/(ch[oố]t|mua)\s*(\d+)/i);
      // console.log("Regex match:", match);

      if (!match) {
        console.log(" Không khớp regex");
        return;
      }

      const quantity = parseInt(match[2]);
      if (quantity <= 0) {
        console.log(" Số lượng không hợp lệ");
        return;
      }

      console.log("✔ Phát hiện chốt:", quantity);

      // Tìm document livestream product
      const liveProductDoc = await ProductLive.findOne({
        livestreamId,
      }).populate("products.product");

      if (!liveProductDoc) {
        console.log(" Không tìm thấy livestream product");
        return;
      }

      // Tìm sản phẩm đang ghim trong mảng
      const pinnedItem = liveProductDoc.products.find(
        (item) => item.isPinned === true
      );

      if (!pinnedItem) {
        console.log(" Không có sản phẩm đang ghim");
  return;
}

const product = pinnedItem.product;

      // Lấy user
      const user = await User.findById(userId);
      console.log("User:", user);

      if (!user) {
        console.log(" Không tìm thấy user");
        return;
      }

      // Chống spam (2 phút)
      const existingOrder = await Order.findOne({
        user: user._id,
        status: "chờ xử lý",
        createdAt: { $gte: new Date(Date.now() - 10 * 1000) },
      });

      if (existingOrder) {
        console.log("⚠ User vừa tạo đơn gần đây");
        return;
      }

      // Tính tổng tiền
      const totalPrice = product.price * quantity;

      console.log("Chuẩn bị tạo order:", {
        product: product._id,
        quantity,
        totalPrice,
      });

      // Tạo order
      const newOrder = await Order.create({
        user: user._id,
        items: [
          {
            product: product._id,
            name: product.name,
            image: product.images?.[0] || "",
            price: product.price,
            quantity,
          },
        ],
        totalPrice,
        shippingAddress: {
          fullName: user.username,
          phone: user.phone || "",
          address: user.address || "",
          note: "Đặt từ livestream",
        },
        paymentMethod: "cod",
      });

      console.log(" Tạo đơn thành công:", newOrder._id);

      return newOrder;
    } catch (error) {
      console.error(" AutoOrderService error:", error);
    }
  }
}

module.exports = AutoOrderService;