import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getMetal = createAsyncThunk('production/metal/getMetal', async params => {
	const response = await axios.get(`${process.env.REACT_APP_API_URL}/metals/${params.metalId}`);
	const data = await response.data;

	return data === undefined ? null : data;
});

export const removeMetal = createAsyncThunk('production/metal/removeMetal', async (val, { dispatch, getState }) => {
	const { _id } = getState().production.metal;
	await axios.post(process.env.REACT_APP_API_URL + '/metals/delete', { _id });

	return _id;
});

export const saveMetal = createAsyncThunk('production/metal/saveMetal', async (metalData, { dispatch, getState }) => {
	const { metal } = getState().production;

	const response = await axios.post(`${process.env.REACT_APP_API_URL}/metals`, { ...metal, ...metalData });
	const data = await response.data;

	return data;
});

const metalSlice = createSlice({
	name: 'production/metal',
	initialState: null,
	reducers: {
		resetMetal: () => null,
		newMetal: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					name: '',
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
		[getMetal.fulfilled]: (state, action) => action.payload,
		[saveMetal.fulfilled]: (state, action) => action.payload
	}
});

export const { newMetal, resetMetal } = metalSlice.actions;

export default metalSlice.reducer;
