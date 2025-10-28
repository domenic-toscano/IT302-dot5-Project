let feedback;

module.exports = class FeedbackDAO {
  static async injectDB(conn, dbName = "it302", collectionName = "feedback_dot5") {
    if (feedback) return;
    try {
      feedback = await conn.db(dbName).collection(collectionName);
    } catch (e) {
      console.error(`Unable to establish collection handles in FeedbackDAO: ${e}`);
    }
  }

  static async addFeedback({ bike_id, user_id, name, text, date }) {
    try {
      const feedbackDoc = { bike_id, user_id, name, text, date };
      return await feedback.insertOne(feedbackDoc);
    } catch (e) {
      console.error(`Unable to post feedback: ${e}`);
      return { error: e };
    }
  }

  static async updateFeedback(feedbackId, userId, text, date) {
    try {
      const updateResponse = await feedback.updateOne(
        { _id: feedbackId, user_id: userId },
        { $set: { text: text, date: date } }
      );
      return updateResponse;
    } catch (e) {
      console.error(`Unable to update feedback: ${e}`);
      return { error: e };
    }
  }

  static async deleteFeedback(feedbackId, userId) {
    try {
      const deleteResponse = await feedback.deleteOne({
        _id: feedbackId,
        user_id: userId,
      });
      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete feedback: ${e}`);
      return { error: e };
    }
  }
};
