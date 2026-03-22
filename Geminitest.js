// test-gemini.js
require('dotenv').config(); // Nạp biến môi trường từ file .env
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function runTest() {
  console.log("--- Bắt đầu kiểm tra Gemini API ---");
  
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("1. Kiểm tra API Key:", apiKey ? "Đã tìm thấy Key" : "KHÔNG tìm thấy Key trong .env");

  if (!apiKey) return;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Sử dụng gemini-1.5-flash (ổn định và nhanh hơn)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log("2. Đang gửi yêu cầu thử nghiệm tới Google AI...");
    const result = await model.generateContent("Viết một câu chào ngắn gọn.");
    const response = await result.response;
    const text = response.text();

    console.log("3. Kết quả phản hồi từ AI:", text);
    console.log("--- KIỂM TRA THÀNH CÔNG ---");
  } catch (error) {
    console.error("!!! LỖI RỒI !!!");
    console.error("Chi tiết lỗi:", error.message);
  }
}

runTest();