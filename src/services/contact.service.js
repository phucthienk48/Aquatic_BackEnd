const Contact = require("../models/Contact");

/*  CREATE  */
const createContact = async (data) => {
  const contact = new Contact(data);
  return await contact.save();
};

/*  GET ALL  */
const getAllContacts = async () => {
  return await Contact.find().sort({ createdAt: -1 });
};

/*  UPDATE STATUS  */
const updateContactStatus = async (id, status) => {
  return await Contact.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
};

/*  DELETE  */
const deleteContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};

module.exports = {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
};
