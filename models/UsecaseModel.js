import mongoose from 'mongoose';

const createUsecaseModel = (connection) => {
  if (connection.models.Usecase) {
    return connection.models.Usecase;
  }

  const UsecaseSchema = new mongoose.Schema({
    apps: {
      type: [
        {
          app: { type: String, required: true },
          app_slug: { type: String, required: true },
          _id: false,
        },
      ],
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    createdBy: {
      type: Number,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  UsecaseSchema.index({ 'apps.app_slug': 1 });

  return connection.model('Usecase', UsecaseSchema);
};

export default createUsecaseModel;
