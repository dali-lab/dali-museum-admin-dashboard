import uploadFeature from '@adminjs/upload';

// import FileModel from '../models/file_model.js';
import PaintingModel from '../models/painting_model.js';

import componentLoader from '../admin/component-loader.js';

export const paintingFileUpload = {
    resource: PaintingModel,
    features: [
        uploadFeature({
            componentLoader,
            provider: { aws: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION,
                bucket: process.env.AWS_BUCKET,
              } },
            validation: { mimeTypes: ['image/jpeg', 'image/png', 'image/jpg'] },
            properties: {
                key: 'url',
                mimeType: 'mimeType'
            },
        }),
    ],
    label: 'File Upload',
};