const contactService = require("../services/contact.service");

/*  GỬI LIÊN HỆ (PUBLIC)  */
exports.createContact = async (req, res) => {
  try {
    const contact = await contactService.createContact(req.body);
    res.status(201).json({
      message: "Gửi liên hệ thành công",
      data: contact,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/*  ADMIN: LẤY DANH SÁCH  */
exports.getContacts = async (req, res) => {
  try {
    const contacts = await contactService.getAllContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*  CẬP NHẬT TRẠNG THÁI  */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await contactService.updateContactStatus(
      req.params.id,
      status
    );
    res.json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/*  XÓA  */
exports.deleteContact = async (req, res) => {
  try {
    await contactService.deleteContact(req.params.id);
    res.json({ message: "Đã xóa liên hệ" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
