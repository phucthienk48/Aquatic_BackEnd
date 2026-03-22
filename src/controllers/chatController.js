const { model } = require("../configs/gemini");
const express = require("express");
const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `
Bạn là chatbot tư vấn cá cảnh cho AquaWorld.
Trả lời thân thiện, dễ hiểu.

Câu hỏi: ${message}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error(error);
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Lỗi AI" });
  }
};

module.exports = { handleChat };