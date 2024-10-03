import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

export const Components = {
    Dashboard: componentLoader.add('Dashboard', '../components/dashboard'),
}

export default componentLoader;
