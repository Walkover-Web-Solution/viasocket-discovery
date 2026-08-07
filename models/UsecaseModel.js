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
          iconUrl: String,
          domain: String,
          _id: false,
        },
      ],
      required: true,
    },
    app: {
      type: String,
    },
    app_slug: {
      type: String,
    },
    audience: {
      type: String,
    },
    h1: {
      type: String,
    },
    subheader: {
      type: String,
    },
    meta_title: {
      type: String,
    },
    meta_description: {
      type: String,
    },
    related_apps: {
      type: Array,
      default: [],
    },
    phases: {
      type: Array,
      default: [],
    },
    createdBy: {
      type: Number,
      default: null,
    },
    contributors: {
      type: [Number],
      default: [],
    },
    comments: {
      type: Object,
      default: {},
    },
    toUpdate: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }, { minimize: false });

  UsecaseSchema.index({ 'apps.app_slug': 1 });

  return connection.model('Usecase', UsecaseSchema);
};

export default createUsecaseModel;
