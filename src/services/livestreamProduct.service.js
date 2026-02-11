const LivestreamProduct = require("../models/LivestreamProduct.model");

const getOrCreate = async (livestreamId) => {
  let live = await LivestreamProduct.findOne({ livestreamId });

  if (!live) {
    live = await LivestreamProduct.create({
      livestreamId,
      products: [],
    });
  }

  return live;
};

/*  GET  */
const getProducts = async (livestreamId) => {
  return await LivestreamProduct.findOne({ livestreamId })
    .populate("products.product");
};

/*  ADD  */
const addProduct = async (livestreamId, productId) => {
  const live = await getOrCreate(livestreamId);

  const exists = live.products.find(
    (p) => p.product.toString() === productId
  );

  if (!exists) {
    live.products.push({ product: productId });
    await live.save();
  }

  return live;
};

/*  REMOVE  */
const removeProduct = async (livestreamId, productId) => {
  const live = await getOrCreate(livestreamId);

  live.products = live.products.filter(
    (p) => p.product.toString() !== productId
  );

  await live.save();
  return live;
};


/* PIN / UNPIN (TOGGLE)  */
const pinProduct = async (livestreamId, productId) => {
  const live = await getOrCreate(livestreamId);

  const item = live.products.find(
    (p) => p.product.toString() === productId
  );

  if (!item) throw new Error("Product not found");

  // nếu đang ghim → bỏ ghim
  if (item.isPinned) {
    item.isPinned = false;
  } else {
    // nếu chưa ghim → bỏ ghim tất cả và ghim cái này
    live.products.forEach((p) => (p.isPinned = false));
    item.isPinned = true;
  }

  await live.save();
  return live;
};


module.exports = {
  getProducts,
  addProduct,
  removeProduct,
  pinProduct,
};
