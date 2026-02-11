const Product = require("../models/Product.model");
const Cart = require("../models/Cart.model");
const Order = require("../models/order.model");
const Comment = require("../models/Comment.model");

/*  GỢI Ý CHO KHÁCH (CHƯA ĐĂNG NHẬP) */
const getGuestRecommendProducts = async (limit = 16) => {
  // Ưu tiên cá bán chạy
  let products = await Product.find({
    status: "available",
    type: "fish",
  })
    .sort({ sold: -1, createdAt: -1 })
    .limit(limit);

  // Bù thêm nếu thiếu
  if (products.length < limit) {
    const more = await Product.find({
      status: "available",
      _id: { $nin: products.map(p => p._id) },
    })
      .sort({ sold: -1 })
      .limit(limit - products.length);

    products = [...products, ...more];
  }

  return products;
};

/* 
   2 GỢI Ý PHỔ BIẾN THEO CỘNG ĐỒNG (MỚI)
   → dùng khi user quá ít dữ liệu
 */
const getTrendingProducts = async (excludeIds = [], limit = 12) => {
  return Product.find({
    status: "available",
    _id: { $nin: excludeIds },
  })
    .sort({
      sold: -1,
      ratingAvg: -1, // nếu có
      createdAt: -1,
    })
    .limit(limit);
};

/* 
   3️ GỢI Ý CHO USER ĐÃ ĐĂNG NHẬP (CHÍNH)
 */
exports.getRecommendProducts = async (userId, limit = 16) => {
  /*  KHÁCH  */
  if (!userId) {
    return await getGuestRecommendProducts(limit);
  }

  const excludeIds = new Set();
  const typeSet = new Set();
  const speciesSet = new Set();
  let hasBoughtFish = false;

  /*  CART  */
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "type species",
  });

  if (cart?.items?.length) {
    cart.items.forEach(({ product }) => {
      if (!product) return;
      excludeIds.add(product._id.toString());
      typeSet.add(product.type);
      speciesSet.add(product.species);
      if (product.type === "fish") hasBoughtFish = true;
    });
  }

  /*  ORDER  */
  const orders = await Order.find({
    user: userId,
    status: "hoàn thành",
  }).populate({
    path: "items.product",
    select: "type species",
  });

  orders.forEach(order => {
    order.items.forEach(({ product }) => {
      if (!product) return;
      excludeIds.add(product._id.toString());
      typeSet.add(product.type);
      speciesSet.add(product.species);
      if (product.type === "fish") hasBoughtFish = true;
    });
  });

  /*  COMMENT XẤU (LOẠI TRỪ)  */
  const badIds = await Comment.find({
    user: userId,
    rating: { $lte: 2 },
  }).distinct("product");

  badIds.forEach(id => excludeIds.add(id.toString()));

  /*  ƯU TIÊN LOẠI  */
  let priorityTypes = [...typeSet];

  // Nếu đã mua cá → gợi ý thuốc + thiết bị + thức ăn
  if (hasBoughtFish) {
    priorityTypes = ["medicine", "equipment", "food"];
  }

  /*  QUERY GỢI Ý CÁ NHÂN  */
  let recommend = await Product.find({
    status: "available",
    _id: { $nin: [...excludeIds] },
    $or: [
      { type: { $in: priorityTypes } },
      { species: { $in: [...speciesSet] } },
    ],
  })
    .sort({ sold: -1, createdAt: -1 })
    .limit(limit);

  /*  GỢI Ý TRENDING (MỚI)  */
  if (recommend.length < limit) {
    const trending = await getTrendingProducts(
      [...excludeIds, ...recommend.map(p => p._id)],
      limit - recommend.length
    );

    recommend = [...recommend, ...trending];
  }

  return recommend;
};
