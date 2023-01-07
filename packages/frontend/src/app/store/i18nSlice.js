import { createSlice } from '@reduxjs/toolkit';
import i18n from 'i18n';
import { setDefaultSettings } from './fuse/settingsSlice';
import { saveUser } from '../main/production/store/userSlice';

export const changeLanguage = languageId => (dispatch, getState) => {
	const { direction } = getState().fuse.settings.defaults;

	const newLangDirection = i18n.dir(languageId);

	/*
    If necessary, change theme direction
     */
	if (newLangDirection !== direction) {
		dispatch(setDefaultSettings({ direction: newLangDirection }));
	}

	/*
    Change Language
     */
	return i18n.changeLanguage(languageId).then(async () => {
		const userData = JSON.parse(await localStorage.getItem('user'));
		userData.settings ? (userData.settings.language = languageId) : (userData.settings = { language: languageId });
		dispatch(saveUser(userData));
		await localStorage.setItem('user', JSON.stringify(userData));
		dispatch(i18nSlice.actions.languageChanged(languageId));
	});
};

const i18nSlice = createSlice({
	name: 'i18n',
	initialState: {
		language: i18n.options.lng
	},
	reducers: {
		languageChanged: (state, action) => {
			state.language = action.payload;
		}
	}
});

export default i18nSlice.reducer;
