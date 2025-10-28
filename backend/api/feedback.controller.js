const FeedbackDAO = require("../dao/feedbackDAO");
const { ObjectId } = require("mongodb");

module.exports = class FeedbackController {
  static async apiPostFeedback(req, res) {
    try {
      const bike_id = req.body.bike_id;
      const user_id = req.body.user_id;
      const name = req.body.name;
      const text = req.body.text;
      const date = new Date();

      const feedbackResponse = await FeedbackDAO.addFeedback({
        bike_id,
        user_id,
        name,
        text,
        lastModified: new Date()
      });

      res.json({ status: "success", feedback: feedbackResponse });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateFeedback(req, res) {
    try {
      const feedbackId = new ObjectId(req.params.id);
      const text = req.body.text;
      const userId = req.body.user_id;
      const date = new Date();

      const updateResponse = await FeedbackDAO.updateFeedback(feedbackId, userId, text, date);
      res.json({ status: "success", update: updateResponse });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteFeedback(req, res) {
    try {
      const feedbackId = new ObjectId(req.params.id);
      const userId = req.body.user_id;

      const deleteResponse = await FeedbackDAO.deleteFeedback(feedbackId, userId);
      res.json({ status: "success", delete: deleteResponse });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};
