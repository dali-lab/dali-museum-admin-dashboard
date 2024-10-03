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
    favicon: 'https://images.squarespace-cdn.com/content/v1/551cbdc5e4b0cd11d2597487/1608046670777-X9DQPJV4BGM0ZYM970FD/favicon.ico?format=100w',
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
