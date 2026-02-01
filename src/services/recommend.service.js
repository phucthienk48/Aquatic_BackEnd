const Product = require("../models/Product.model");
const Cart = require("../models/Cart.model");
const Order = require("../models/Order.model");
const Comment = require("../models/Comment.model");

exports.getRecommendProducts = async (userId) => {

  if (!userId) {
    let fishProducts = await Product.find({
      status: "available",
      type: "fish",
    })
      .sort({ sold: -1, createdAt: -1 })
      .limit(8);

    // fallback thêm sản phẩm khác nếu cá ít
    if (fishProducts.length < 8) {
      const more = await Product.find({
        status: "available",
        _id: { $nin: fishProducts.map(p => p._id) },
      })
        .sort({ sold: -1 })
        .limit(10 - fishProducts.length);

      fishProducts = [...fishProducts, ...more];
    }

    return fishProducts;
  }

  const excludeIds = new Set();
  const typeSet = new Set();
  const speciesSet = new Set();

  let hasCartOrOrder = false;

  /* ===== CART ===== */
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "type species",
  });

  if (cart && cart.items.length > 0) {
    hasCartOrOrder = true;

    cart.items.forEach(item => {
      if (!item.product) return;

      excludeIds.add(item.product._id.toString());
      if (item.product.type) typeSet.add(item.product.type);
      if (item.product.species) speciesSet.add(item.product.species);
    });
  }

  /* ===== ORDER HOÀN THÀNH ===== */
  const orders = await Order.find({
    user: userId,
    status: "hoàn thành",
  }).populate({
    path: "items.product",
    select: "type species",
  });

  if (orders.length > 0) hasCartOrOrder = true;

  orders.forEach(order => {
    order.items.forEach(item => {
      if (!item.product) return;

      excludeIds.add(item.product._id.toString());
      if (item.product.type) typeSet.add(item.product.type);
      if (item.product.species) speciesSet.add(item.product.species);
    });
  });

  /* ===== COMMENT ĐÁNH GIÁ THẤP ===== */
  const badProductIds = await Comment.find({
    user: userId,
    rating: { $lte: 2 },
  }).distinct("product");

  badProductIds.forEach(id => excludeIds.add(id.toString()));

  const priorityTypes = hasCartOrOrder
    ? ["medicine", "equipment"]
    : [...typeSet];

  /* ===== QUERY GỢI Ý CHÍNH ===== */
  let recommend = await Product.find({
    status: "available",
    _id: { $nin: [...excludeIds] },
    $or: [
      { type: { $in: priorityTypes } },
      { species: { $in: [...speciesSet] } },
    ],
  })
    .sort({ sold: -1, createdAt: -1 })
    .limit(10);


  if (recommend.length < 5) {
    const more = await Product.find({
      status: "available",
      _id: { $nin: [...excludeIds, ...recommend.map(p => p._id)] },
    })
      .sort({ sold: -1 })
      .limit(10 - recommend.length);

    recommend = [...recommend, ...more];
  }

  return recommend;
};
