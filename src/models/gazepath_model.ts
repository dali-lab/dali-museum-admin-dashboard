import { createSchema, Type, typedModel } from 'ts-mongoose';
import { PaintingSchema } from './painting_model.js';
import { ViewerSchema } from './viewer_model.js';

export const GazePathSchema = createSchema({
  startTime: Type.string({ required: true }),
  endTime: Type.string({ required: true }),
  viewer: Type.ref(Type.objectId({ required: true })).to('Viewer', ViewerSchema),
  painting: Type.ref(Type.objectId({ required: true })).to('Painting', PaintingSchema),
  coordinates: Type.array({ required: true }).of({
    x: Type.number({ required: true }),
    y: Type.number({ required: true }),
  }),
  screenWidth: Type.number({ required: true }),
});

const GazePathModel = typedModel('GazePath', GazePathSchema);

export default GazePathModel;
