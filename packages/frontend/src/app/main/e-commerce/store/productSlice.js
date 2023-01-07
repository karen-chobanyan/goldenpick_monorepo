import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getProduct = createAsyncThunk('eCommerceApp/product/getProduct', async params => {
	const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${params.productId}`);
	const data = await response.data;
	return data === undefined ? null : data;
});

export const removeProduct = createAsyncThunk(
	'eCommerceApp/product/removeProduct',
	async (val, { dispatch, getState }) => {
		const { _id } = getState().eCommerceApp.product;
		await axios.post(process.env.REACT_APP_API_URL + '/products/delete', { _id });

		return _id;
	}
);

export const saveProduct = createAsyncThunk(
	'eCommerceApp/product/saveProduct',
	async (productData, { dispatch, getState }) => {
		const { product } = getState().eCommerceApp;
		const response = await axios.post(process.env.REACT_APP_API_URL + '/products', { ...product, ...productData });
		const data = await response.data;

		return data;
	}
);

const productSlice = createSlice({
	name: 'eCommerceApp/product',
	initialState: null,
	reducers: {
		resetProduct: () => null,
		newProduct: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					name: '',
					handle: '',
					description: '',
					categories: [],
					productMetals: [],
					productGems: [],
					tags: [],
					images: [],
					attachments: [],
					price1: 0,
					price2: 0,
					size: '',
					active: true
				}
			})
		}
	},
	extraReducers: {
		[getProduct.fulfilled]: (state, action) => action.payload,
		[saveProduct.fulfilled]: (state, action) => action.payload,
		[removeProduct.fulfilled]: (state, action) => null
	}
});

export const { newProduct, resetProduct } = productSlice.actions;

export default productSlice.reducer;
