import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getSettings = createAsyncThunk('getSettings', async params => {
	const response = await axios.get(`${process.env.REACT_APP_API_URL}/settings`);
	const data = await response.data;

	return data === undefined ? null : data;
});

export const saveSettings = createAsyncThunk('saveSettings', async (settingsData, { dispatch, getState }) => {
	const { settings } = getState();
	localStorage.setItem('settings', JSON.stringify(settingsData));

	const response = await axios.post(`${process.env.REACT_APP_API_URL}/settings`, {
		...settings,
		...settingsData
	});
	const data = await response.data;

	return data;
});

const settingsSlice = createSlice({
	name: 'settings',
	initialState: null,
	reducers: {
		resetSettings: () => null,
		newSettings: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					settings: {
						language: '',
						currency: [],
						statuses: [],
						contacts: [
							{
								name: '',
								fieldName: '',
								required: null,
								feature: null
							}
						]
					}
				}
			})
		}
	},
	extraReducers: {
		[getSettings.fulfilled]: (state, action) => action.payload,
		[saveSettings.fulfilled]: (state, action) => action.payload
	}
});

export const { newSettings, resetSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
