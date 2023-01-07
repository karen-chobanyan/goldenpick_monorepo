import { createSelector, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import navigationConfig from 'app/fuse-configs/navigationConfig';
import FuseUtils from '@fuse/utils';
import i18next from 'i18next';
import _ from '@lodash';
import { indexOf } from 'lodash';

const navigationAdapter = createEntityAdapter();
const emptyInitialState = navigationAdapter.getInitialState();

const user = JSON.parse(localStorage.getItem('user'));
console.log(user);
const userPages = user?.userRole?.pages;

const userNav =
	user?.userType === 'Admin'
		? navigationConfig
		: navigationConfig.filter(nav => userPages?.find(u => '/' + u === nav.url));

console.log(userNav);

const initialState = navigationAdapter.upsertMany(emptyInitialState, userNav);

export const appendNavigationItem = (item, parentId) => (dispatch, getState) => {
	const navigation = selectNavigationAll(getState());

	return dispatch(setNavigation(FuseUtils.appendNavItem(navigation, item, parentId)));
};

export const prependNavigationItem = (item, parentId) => (dispatch, getState) => {
	const navigation = selectNavigationAll(getState());

	return dispatch(setNavigation(FuseUtils.prependNavItem(navigation, item, parentId)));
};

export const updateNavigationItem = (id, item) => (dispatch, getState) => {
	const navigation = selectNavigationAll(getState());

	return dispatch(setNavigation(FuseUtils.updateNavItem(navigation, id, item)));
};

export const removeNavigationItem = id => (dispatch, getState) => {
	const navigation = selectNavigationAll(getState());

	return dispatch(setNavigation(FuseUtils.removeNavItem(navigation, id)));
};

export const {
	selectAll: selectNavigationAll,
	selectIds: selectNavigationIds,
	selectById: selectNavigationItemById
} = navigationAdapter.getSelectors(state => state.fuse.navigation);

const navigationSlice = createSlice({
	name: 'navigation',
	initialState,
	reducers: {
		setNavigation: navigationAdapter.setAll,
		resetNavigation: (state, action) => initialState
	}
});

export const { setNavigation, resetNavigation } = navigationSlice.actions;

const getUserRole = state => state.auth.user.userRole.name;
const getUserType = state => state.auth.user.userType;

export const selectNavigation = createSelector(
	[selectNavigationAll, ({ i18n }) => i18n.language, getUserRole],
	(navigation, language, userRole) => {
		function setTranslationValues(data) {
			return data.map(item => {
				if (item.translate && item.title) {
					item.title = i18next.t(`navigation:${item.translate}`);
				}
				if (item.children) {
					item.children = setTranslationValues(item.children);
				}
				return item;
			});
		}
		return setTranslationValues(
			_.merge(
				[],
				FuseUtils.filterRecursive(navigation, item => FuseUtils.hasPermission(item.auth, getUserType))
			)
		);
	}
);

export const selectFlatNavigation = createSelector([selectNavigation], navigation =>
	FuseUtils.getFlatNavigation(navigation)
);

export default navigationSlice.reducer;
