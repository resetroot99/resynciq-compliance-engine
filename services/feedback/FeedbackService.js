import { db } from '../database/DatabaseService';

class FeedbackService {
  async submitFeedback(estimateId, feedback) {
    await db.collection('feedback').insertOne({
      estimateId,
      feedback,
      timestamp: new Date()
    });
  }

  async getFeedbackForModel(modelName) {
    return await db.collection('feedback')
      .find({ model: modelName })
      .toArray();
  }
}

export const feedbackService = new FeedbackService(); 