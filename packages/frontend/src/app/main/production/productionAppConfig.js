import { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import i18next from 'i18next';
import am from './i18n/am';
import en from './i18n/en';
import ru from './i18n/ru';

i18next.addResourceBundle('en', 'production', en);
i18next.addResourceBundle('am', 'production', am);
i18next.addResourceBundle('ru', 'production', ru);

const ProductionAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/gems/:gemId/:gemHandle?',
			component: lazy(() => import('./gem/Gem'))
		},
		{
			path: '/gems',
			component: lazy(() => import('./gems/Gems'))
		},
		{
			path: '/metals/:metalId',
			component: lazy(() => import('./metal/Metal'))
		},
		{
			path: '/metals',
			component: lazy(() => import('./metals/Metals'))
		},
		{
			path: '/users/:userId',
			component: lazy(() => import('./user/User'))
		},
		{
			path: '/users',
			component: lazy(() => import('./users/Users'))
		}
	]
};

export default ProductionAppConfig;
