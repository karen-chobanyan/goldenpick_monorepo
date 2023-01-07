import { authRoles } from 'app/auth';
import i18next from 'i18next';
import Settings from './Settings';
import am from './i18n/am';
import en from './i18n/en';
import ru from './i18n/ru';

i18next.addResourceBundle('en', 'common', en);
i18next.addResourceBundle('am', 'common', am);
i18next.addResourceBundle('ru', 'common', ru);

const SettingsConfig = {
	settings: {
		layout: {}
	},
	// auth: authRoles.user,
	routes: [
		{
			path: '/settings',
			component: Settings
		}
	]
};

export default SettingsConfig;
