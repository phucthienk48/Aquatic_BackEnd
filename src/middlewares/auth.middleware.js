const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Chưa đăng nhập" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ" });
  }
};
// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   try {
//     // 1. Lấy header Authorization
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({
//         message: "Chưa đăng nhập (thiếu Authorization header)",
//       });
//     }

//     // 2. Kiểm tra format Bearer token
//     const parts = authHeader.split(" ");
//     if (parts.length !== 2 || parts[0] !== "Bearer") {
//       return res.status(401).json({
//         message: "Authorization không đúng định dạng Bearer",
//       });
//     }

//     const token = parts[1];

//     // 3. Verify token
//     const decoded = jwt.verify(
//       token,
//       process.env.ACCESS_TOKEN_SECRET
//     );

//     // 4. Gán user cho request
//     // Khuyến nghị: token payload phải có _id
//     req.user = {
//       _id: decoded._id || decoded.id,
//       role: decoded.role,
//       email: decoded.email,
//     };

//     next();
//   } catch (err) {
//     console.error("JWT ERROR:", err.message);

//     return res.status(403).json({
//       message: "Token không hợp lệ hoặc đã hết hạn",
//     });
//   }
// };
