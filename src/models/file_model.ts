/* eslint-disable func-names */
import {
    createSchema, Type, typedModel,
  } from 'ts-mongoose';
  
  export const FileSchema = createSchema({
    uploadTime: Type.date({ default: new Date() }),
    filename: Type.string({ required: true }),
    url: Type.string({ required: true }),
  }, {
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform: (_doc, {
        startTime, filename, ...user
      }) => user,
    },
    timestamps: true,
  });
  
  const FileModel = typedModel('File', FileSchema);
  
  export default FileModel;
  