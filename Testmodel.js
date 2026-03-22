require('dotenv').config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      console.error("Lỗi từ Google:", data.error.message);
      return;
    }

    console.log("--- CÁC MODEL BẠN CÓ THỂ DÙNG ---");
    data.models.forEach(m => {
      if (m.supportedGenerationMethods.includes("generateContent")) {
        console.log("- " + m.name.replace("models/", ""));
      }
    });
  } catch (error) {
    console.error("Không thể kết nối internet hoặc lỗi hệ thống:", error.message);
  }
}

listModels();