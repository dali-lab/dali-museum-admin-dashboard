import { AdminJSOptions } from 'adminjs';

import componentLoader, { Components } from './component-loader.js';

import { paintingFileUpload } from '../resources/paintingFileUpload.js';

import importExportFeature from '@adminjs/import-export';

import { Viewers, GazePaths, Paintings  } from '../models/index.js';

const options: AdminJSOptions = {
  dashboard: {
    component: Components.Dashboard,
  },
  branding: {
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMCQaL23jEfo0Qdbx7WijK-MnNuagxzrwsXw&s',
    companyName: 'DALI Lab',
    favicon: 'https://how-do-i-look.s3.us-east-2.amazonaws.com/assets/hdil-eye.png',
  },
  componentLoader,
  rootPath: '/',
  resources: [
    {
      resource: Viewers,
      features: [
        importExportFeature({ componentLoader }),
      ],
    },
    {
      resource: GazePaths,
      features: [
        importExportFeature({ componentLoader }),
      ],
    },
    paintingFileUpload
  ],
  databases: [],
};

export default options;
