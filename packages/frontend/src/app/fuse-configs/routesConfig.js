import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import LoginConfig from 'app/main/login/LoginConfig';
import LogoutConfig from 'app/main/logout/LogoutConfig';
import ProjectDashboardAppConfig from 'app/main/project/ProjectDashboardAppConfig';
import ECommerceAppConfig from 'app/main/e-commerce/ECommerceAppConfig';
import ContactsAppConfig from 'app/main/contacts/ContactsAppConfig';
import { authRoles } from 'app/auth';
import ProductionAppConfig from 'app/main/production/productionAppConfig';
import SettingsConfig from 'app/main/settings/SettingsConfig';

const routeConfigs = [
	LoginConfig,
	LogoutConfig,
	SettingsConfig,
	ProjectDashboardAppConfig,
	ECommerceAppConfig,
	ContactsAppConfig,
	ProductionAppConfig
];

const routes = [
	// if you want to make whole app auth protected by default change defaultAuth for example:
	// ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
	// The individual route configs which has auth option won't be overridden.
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, authRoles.admin),
	{
		auth: authRoles.admin,
		path: '/',
		component: () => <Redirect to="/dashboard" />
	}
];

export default routes;
