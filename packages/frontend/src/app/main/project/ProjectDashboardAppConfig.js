import { authRoles } from 'app/auth';
import { lazy } from 'react';
import i18next from 'i18next';
import am from './i18n/am';
import en from './i18n/en';
import ru from './i18n/ru';

i18next.addResourceBundle('en', 'common', en);
i18next.addResourceBundle('am', 'common', am);
i18next.addResourceBundle('ru', 'common', ru);

const ProjectDashboardAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: '/dashboard',
			component: lazy(() => import('./ProjectDashboardApp'))
		}
	]
};

export default ProjectDashboardAppConfig;
