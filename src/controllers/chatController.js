const { model } = require("../configs/gemini");
const express = require("express");
const Product = require("../models/Product.model");
const FishCareKnowledge = require("../models/FishCareKnowledge.model");

const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    // 1. Extract keywords to search DB (ignoring common Vietnamese stop words could be complex, 
    // we use a simple regex by removing punctuation and splitting words >= 2 chars)
    const keywords = message
      .replace(/[?.,!]/g, "")
      .split(" ")
      .filter((w) => w.length >= 2);

    let searchRegex;
    // Fallback if no valid keywords (e.g. user just said "?")
    if (keywords.length === 0) {
      searchRegex = new RegExp(message, "i");
    } else {
      searchRegex = new RegExp(keywords.join("|"), "i");
    }

    // 2. Query Products and Knowledge 
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { type: searchRegex },
        { species: searchRegex },
      ],
      status: "available"
    }).select("name price description").limit(5);

    const knowledge = await FishCareKnowledge.find({
      $or: [
        { title: searchRegex },
        { summary: searchRegex },
      ],
    }).select("title summary instructions").limit(3);

    // 3. Construct DB formatted text
    let dbContext = ``;
    
    if (products.length > 0) {
      dbContext += `\n--- DANH MỤC SẢN PHẨM ---\n`;
      products.forEach(p => {
        dbContext += `- ${p.name}: Giá ${p.price?.toLocaleString() || 'Liên hệ'}đ\n`;
        if (p.description) dbContext += `  Mô tả: ${p.description.substring(0, 100)}...\n`;
      });
    }

    if (knowledge.length > 0) {
      dbContext += `\n--- KIẾN THỨC NUÔI CÁ ---\n`;
      knowledge.forEach(k => {
        dbContext += `- ${k.title}\n`;
        if (k.summary) dbContext += `  Nội dung: ${k.summary}\n`;
      });
    }

    if (!dbContext) {
      dbContext = "Hiện tại không tìm thấy thông tin phù hợp trong CSDL Hệ thống.";
    }

    // 4. Gemini prompt definition exactly matching the user's requested rules
    const prompt = `Bạn là AI Chat Assistant của hệ thống web cá cảnh AquaWorld.

Nhiệm vụ:
Trả lời câu hỏi người dùng bằng cách ƯU TIÊN sử dụng dữ liệu nội bộ trước, sau đó mới dùng kiến thức bên ngoài.

========================================
I. NGUỒN DỮ LIỆU ĐƯỢC CUNG CẤP (NỘI BỘ SHOP)
========================================
${dbContext}

========================================
II. CÁCH XỬ LÝ CÂU HỎI
========================================

Bước 1: Phân tích câu hỏi
- Người dùng hỏi về:
  + sản phẩm? (giá, loại cá, mua gì)
  + cách nuôi? (chăm sóc, bệnh, thức ăn)
  + hay câu hỏi chung?

Bước 2: Tìm trong database (dựa vào NGUỒN DỮ LIỆU ĐƯỢC CUNG CẤP ở mục I)

Bước 3: Trả lời theo độ ưu tiên:
1. Nếu tìm thấy thông tin trong mục I:
   -> Trả lời phần lớn dựa trên dữ liệu đó. Có thể diễn giải lại cho thân thiện, dễ hiểu.
2. Nếu KHÔNG tìm thấy trong mục I:
   -> Trả lời bằng kiến thức chung của bạn (AI knowledge).

========================================
III. FORMAT TRẢ LỜI
========================================

- Ngắn gọn, dễ hiểu, thân thiện.
- Có thể gợi ý thêm sản phẩm liên quan từ nguồn dữ liệu (nếu phù hợp).
- KHÔNG tự bịa sản phẩm nếu không có trong mục I.
- KHÔNG trả lời sai lệch dữ liệu shop ở mục I.
- Ưu tiên thông tin nội bộ > kiến thức ngoài.
- Nếu bạn hoàn toàn không chắc chắn hoặc người dùng hỏi giá của thứ không có trong hệ thống -> nói rõ: "Hiện tại shop chưa có thông tin cụ thể, nhưng..."

========================================
Câu hỏi của người dùng: "${message}"
`;

    // 5. Generate Response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("Chat Controller Error:", error);
    res.status(500).json({ error: "Lỗi AI" });
  }
};

module.exports = { handleChat };