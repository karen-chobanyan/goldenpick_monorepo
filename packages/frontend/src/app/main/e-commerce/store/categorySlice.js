import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getCategory = createAsyncThunk('eCommerceApp/category/getCategory', async params => {
	const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories/${params.categoryId}`);
	const data = await response.data;

	return data === undefined ? null : data;
});

export const removeCategory = createAsyncThunk(
	'eCommerceApp/category/removeCategory',
	async (val, { dispatch, getState }) => {
		const { _id } = getState().eCommerceApp.category;
		await axios.post(process.env.REACT_APP_API_URL + '/categories/delete', { _id });

		return _id;
	}
);

export const saveCategory = createAsyncThunk(
	'eCommerceApp/category/saveCategory',
	async (categoryData, { dispatch, getState }) => {
		const { category } = getState().eCommerceApp;

		const response = await axios.post(`${process.env.REACT_APP_API_URL}/categories`, {
			...category,
			...categoryData
		});
		const data = await response.data;

		return data;
	}
);

const categorySlice = createSlice({
	name: 'eCommerceApp/category',
	initialState: null,
	reducers: {
		resetCategory: () => null,
		newCategory: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					name: '',
					handle: '',
					images: [],
					active: true,
					parent: ''
				}
			})
		}
	},
	extraReducers: {
		[getCategory.fulfilled]: (state, action) => action.payload,
		[saveCategory.fulfilled]: (state, action) => action.payload,
		[removeCategory.fulfilled]: (state, action) => null
	}
});

export const { newCategory, resetCategory } = categorySlice.actions;

export default categorySlice.reducer;
