import { createSchema, Type, typedModel } from 'ts-mongoose';

export const PaintingSchema = createSchema({
  name: Type.string({ required: true }),
  description: Type.string({ required: false }),
  year: Type.number({ required: true }),
  url: Type.string({ required: false }),
  alias: Type.string({ required: true }),
}, {
  toObject: { virtuals: true },
  toJSON: {
    virtuals: true,
    transform: (_doc, { __v, ...resource }) => resource,
  },
  timestamps: true,
});

const PaintingModel = typedModel('Painting', PaintingSchema);

export default PaintingModel;
