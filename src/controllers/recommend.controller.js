const RecommendService = require("../services/recommend.service");

exports.getRecommend = async (req, res) => {
  try {
    const userId = req.query.userId || null;

    const products = await RecommendService.getRecommendProducts(userId);

    res.status(200).json(products);
  } catch (err) {
    console.error("RECOMMEND ERROR:", err);
    res.status(500).json({
      message: "Không thể lấy danh sách gợi ý",
    });
  }
};
