import { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import i18next from 'i18next';
import am from './i18n/am';
import en from './i18n/en';
import ru from './i18n/ru';

i18next.addResourceBundle('en', 'common', en);
i18next.addResourceBundle('am', 'common', am);
i18next.addResourceBundle('ru', 'common', ru);

const ECommerceAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/products/:productId/:productHandle?',
			component: lazy(() => import('./product/Product'))
		},
		{
			path: '/products',
			component: lazy(() => import('./products/Products'))
		},
		{
			path: '/order/:orderId',
			component: lazy(() => import('./order/Order'))
		},
		{
			path: '/orders/:orderStatus',
			component: lazy(() => import('./orders/Orders'))
		},
		{
			path: '/categories/:categoryId',
			component: lazy(() => import('./category/Category'))
		},
		{
			path: '/categories',
			component: lazy(() => import('./categories/Categories'))
		},
		{
			path: '/orders',
			component: () => <Redirect to="/orders/active" />
		},
		{
			path: '/proad-cast',
			component: lazy(() => import('./proad-cast/ProadCast'))
			// component: lazy(() => import('./products/Products'))
		}
	]
};

export default ECommerceAppConfig;
