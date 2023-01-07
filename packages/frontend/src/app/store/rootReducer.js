import { combineReducers } from '@reduxjs/toolkit';
import auth from 'app/auth/store';
import production from 'app/main/production/store';
import eCommerceApp from 'app/main/e-commerce/store';
import settings from 'app/main/settings/store/SettingsSlice';
import contactsApp from 'app/main/contacts/store';
import fuse from './fuse';
import i18n from './i18nSlice';

const createReducer = asyncReducers => (state, action) => {
	const combinedReducer = combineReducers({
		auth,
		fuse,
		i18n,
		production,
		eCommerceApp,
		contactsApp,
		settings,
		...asyncReducers
	});

	/*
	Reset the redux store when user logged out
	 */
	if (action.type === 'auth/user/userLoggedOut') {
		state = undefined;
	}

	return combinedReducer(state, action);
};

export default createReducer;
