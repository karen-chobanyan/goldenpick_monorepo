import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getGem = createAsyncThunk('production/gem/getGem', async params => {
	const response = await axios.get(`${process.env.REACT_APP_API_URL}/gems/${params.gemId}`);
	const data = await response.data;

	return data === undefined ? null : data;
});

export const removeGem = createAsyncThunk('production/gem/removeGem', async (val, { dispatch, getState }) => {
	const { _id } = getState().production.gem;
	await axios.post(process.env.REACT_APP_API_URL + '/gems/delete', { _id });

	return _id;
});

export const saveGem = createAsyncThunk('production/gem/saveGem', async (gemData, { dispatch, getState }) => {
	const { gem } = getState().production;

	const response = await axios.post(process.env.REACT_APP_API_URL + '/gems', { ...gem, ...gemData });
	const data = await response.data;

	return data;
});

const gemSlice = createSlice({
	name: 'production/gem',
	initialState: null,
	reducers: {
		resetGem: () => null,
		newGem: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					name: '',
					handle: '',
					description: '',
					images: [],
					price1: 0,
					price2: 0,
					active: true
				}
			})
		}
	},
	extraReducers: {
		[getGem.fulfilled]: (state, action) => action.payload,
		[saveGem.fulfilled]: (state, action) => action.payload
	}
});

export const { newGem, resetGem } = gemSlice.actions;

export default gemSlice.reducer;
