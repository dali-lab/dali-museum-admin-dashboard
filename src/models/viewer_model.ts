/* eslint-disable func-names */
import {
  createSchema, Type, typedModel,
} from 'ts-mongoose';

export const ViewerSchema = createSchema({
  startTime: Type.date({ required: true }),
  endTime: Type.date({ default: new Date(), required: true }),
  code: Type.string({ required: true }),
}, {
  toObject: { virtuals: true },
  toJSON: {
    virtuals: true,
    transform: (_doc, {
      startTime, endTime, ...user
    }) => user,
  },
  timestamps: true,
});

const ViewerModel = typedModel('Viewer', ViewerSchema);

export default ViewerModel;
