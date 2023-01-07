import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const sendPhoto = createAsyncThunk(
	'eCommerceApp/proad-cast/sendPhoto',
	async (sendData, { dispatch, getState }) => {
		const { send } = getState().eCommerceApp;
		const response = await axios.post(process.env.REACT_APP_API_URL + '/viber/proad-cast', {
			...send,
			...sendData
		});
		const data = await response.data;
		return data;
	}
);

const proadCastSlice = createSlice({
	name: 'eCommerceApp/proad-cast',
	initialState: null,
	reducers: {
		photo: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					description: '',
					attachments: []
				}
			})
		}
	},
	extraReducers: {
		[sendPhoto.fulfilled]: (state, action) => action.payload
	}
});

export const { photo } = proadCastSlice.actions;

export default proadCastSlice.reducer;
