const FishCareKnowledge = require("../models/FishCareKnowledge.model");

//  Create
const create = (data) => {
  return FishCareKnowledge.create(data);
};

//  Get all
const getAll = () => {
  return FishCareKnowledge.find().sort({ createdAt: -1 });
};

//  Get by knowledgeId
const getByKnowledgeId = (knowledgeId) => {
  return FishCareKnowledge.findOne({ knowledgeId });
};

//  Update by knowledgeId
const update = (knowledgeId, data) => {
  return FishCareKnowledge.findOneAndUpdate(
    { knowledgeId },
    data,
    { new: true }
  );
};

//  Delete by knowledgeId
const remove = (knowledgeId) => {
  return FishCareKnowledge.findOneAndDelete({ knowledgeId });
};

module.exports = {
  create,
  getAll,
  getByKnowledgeId,
  update,
  remove,
};
