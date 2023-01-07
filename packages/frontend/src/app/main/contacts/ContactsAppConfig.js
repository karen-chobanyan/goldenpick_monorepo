import { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import i18next from 'i18next';
import am from './i18n/am';
import en from './i18n/en';
import ru from './i18n/ru';

i18next.addResourceBundle('en', 'common', en);
i18next.addResourceBundle('am', 'common', am);
i18next.addResourceBundle('ru', 'common', ru);

const ContactsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/contacts/:id',
			component: lazy(() => import('./ContactsApp'))
		},
		{
			path: '/contacts',
			component: () => <Redirect to="/contacts/all" />
		}
	]
};

export default ContactsAppConfig;
