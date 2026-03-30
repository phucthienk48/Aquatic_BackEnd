const Product = require("../models/Product.model");
const Cart = require("../models/Cart.model");
const Order = require("../models/order.model");
const Comment = require("../models/Comment.model");

/* 1. GUEST (CHƯA LOGIN)*/
const getGuestRecommendProducts = async (limit = 16) => {
  let products = await Product.find({
    status: "available",
    type: "fish",
  })
    .sort({ sold: -1, createdAt: -1 })
    .limit(limit);

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

/*2. USER MỚI*/
const getNewUserRecommend = async (limit = 12) => {
  return Product.find({
    status: "available",
    type: "fish",
  })
    .sort({
      sold: -1,
      ratingAvg: -1,
      createdAt: -1,
    })
    .limit(limit);
};

/* 3. TRENDING*/
const getTrendingProducts = async (excludeIds = [], limit = 12) => {
  return Product.find({
    status: "available",
    _id: { $nin: excludeIds },
  })
    .sort({
      sold: -1,
      ratingAvg: -1,
      createdAt: -1,
    })
    .limit(limit);
};

/*  4. TOP RATED*/
const getTopRatedProducts = async (excludeIds = [], limit = 8) => {
  return Product.find({
    status: "available",
    _id: { $nin: excludeIds },
    ratingAvg: { $gte: 4 },
  })
    .sort({ ratingAvg: -1, sold: -1 })
    .limit(limit);
};

/* 5. NEW ARRIVAL*/
const getNewProducts = async (excludeIds = [], limit = 8) => {
  return Product.find({
    status: "available",
    _id: { $nin: excludeIds },
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

/* 6. SPECIES (QUAN TRỌNG)*/
const getSpeciesBasedRecommend = async (
  speciesList = [],
  excludeIds = [],
  limit = 10
) => {
  if (!speciesList.length) return [];

  return Product.find({
    status: "available",
    _id: { $nin: excludeIds },
    species: { $in: speciesList },
  })
    .sort({
      sold: -1,
      ratingAvg: -1,
    })
    .limit(limit);
};

/* 
   7. MAIN FUNCTION
*/
exports.getRecommendProducts = async (userId, limit = 12) => {
  /* KHÁCH */
  if (!userId) {
    return await getGuestRecommendProducts(limit);
  }

  const excludeIds = new Set();
  const typeSet = new Set();
  const speciesSet = new Set();
  let hasBoughtFish = false;

  /* CART */
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

  /* ORDER */
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

  /* USER MỚI */
  const isNewUser =
    (!cart || !cart.items.length) && orders.length === 0;

  if (isNewUser) {
    return await getNewUserRecommend(limit);
  }

  /* DISLIKE */
  const badIds = await Comment.find({
    user: userId,
    rating: { $lte: 2 },
  }).distinct("product");

  badIds.forEach(id => excludeIds.add(id.toString()));

  /* PRIORITY TYPE */
  let priorityTypes = [...typeSet];

  if (hasBoughtFish) {
    priorityTypes = ["medicine", "equipment", "food"];
  }

  let recommend = [];

  /* 1. ƯU TIÊN SPECIES */
  const speciesRecommend = await getSpeciesBasedRecommend(
    [...speciesSet],
    [...excludeIds],
    limit
  );

  recommend = [...speciesRecommend];

  /* 2. THEO TYPE + SPECIES */
  if (recommend.length < limit) {
    const more = await Product.find({
      status: "available",
      _id: {
        $nin: [...excludeIds, ...recommend.map(p => p._id)],
      },
      $or: [
        { type: { $in: priorityTypes } },
        { species: { $in: [...speciesSet] } },
      ],
    })
      .sort({ sold: -1, createdAt: -1 })
      .limit(limit - recommend.length);

    recommend = [...recommend, ...more];
  }

  /* 3. TRENDING */
  if (recommend.length < limit) {
    const trending = await getTrendingProducts(
      [...excludeIds, ...recommend.map(p => p._id)],
      limit - recommend.length
    );

    recommend = [...recommend, ...trending];
  }

  /* 4. TOP RATED + NEW */
  if (recommend.length < limit) {
    const needed = limit - recommend.length;

    const [topRated, newProducts] = await Promise.all([
      getTopRatedProducts(
        [...excludeIds, ...recommend.map(p => p._id)],
        needed
      ),
      getNewProducts(
        [...excludeIds, ...recommend.map(p => p._id)],
        needed
      ),
    ]);

    const extra = [...topRated, ...newProducts].slice(0, needed);
    recommend = [...recommend, ...extra];
  }

  return recommend;
};