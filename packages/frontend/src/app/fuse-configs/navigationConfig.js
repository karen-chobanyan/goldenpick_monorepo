import i18next from 'i18next';
import am from './navigation-i18n/am';
import en from './navigation-i18n/en';
import ru from './navigation-i18n/ru';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('am', 'navigation', am);
i18next.addResourceBundle('ru', 'navigation', ru);

const navigationConfig = [
	{
		id: 'dashboard-component',
		title: 'Dashboard',
		translate: 'DASHBOARD',
		type: 'item',
		icon: 'dashboard',
		url: '/dashboard'
	},
	{
		id: 'orders-component',
		title: 'Active Orders',
		translate: 'ACTIVE_ORDERS',
		type: 'item',
		icon: 'local_florist',
		url: '/orders/active'
	},
	{
		id: 'contacts-component',
		title: 'Contacts',
		translate: 'CONTACTS',
		type: 'item',
		icon: 'account_box',
		url: '/contacts'
	},
	{
		id: 'products-component',
		title: 'Products',
		translate: 'PRODUCTS',
		type: 'item',
		icon: 'scatter_plot',
		url: '/products'
	},
	{
		id: 'gems-component',
		title: 'Gems',
		translate: 'GEMS',
		type: 'item',
		icon: 'palette',
		url: '/gems'
	},
	{
		id: 'metals-component',
		title: 'Metals',
		translate: 'METALS',
		type: 'item',
		icon: 'layers',
		url: '/metals'
	},
	{
		id: 'product-categories',
		title: 'Product Categories',
		translate: 'Product_Categories',
		type: 'item',
		icon: 'layers',
		url: '/categories'
	},
	{
		id: 'users-component',
		title: 'Users',
		translate: 'USERS',
		type: 'item',
		icon: 'people',
		url: '/users'
	},
	{
		id: 'settings',
		title: 'Settings',
		translate: 'SETTINGS',
		type: 'item',
		icon: 'settings',
		url: '/settings'
	},
	{
		id: 'orders-archive-component',
		title: 'Order Archive',
		translate: 'ARCHIVED_ORDERS',
		type: 'item',
		icon: 'local_florist',
		url: '/orders/Completed'
	},
	{
		id: 'proad-cast-component',
		title: 'Proad cast',
		// translate: 'PROAD_CAST',
		type: 'item',
		icon: 'settings_remote',
		url: '/proad-cast'
	}
];

export default navigationConfig;
