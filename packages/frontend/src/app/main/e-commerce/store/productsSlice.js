import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getProducts = createAsyncThunk('eCommerceApp/products/getProducts', async () => {
	const response = await axios.get(process.env.REACT_APP_API_URL + '/products');
	const data = await response.data;

	return data;
});

export const removeProducts = createAsyncThunk(
	'eCommerceApp/products/removeProducts',
	async (productIds, { dispatch, getState }) => {
		await axios.post(process.env.REACT_APP_API_URL + '/remove-products', { productIds });

		return productIds;
	}
);

const productsAdapter = createEntityAdapter({
	selectId: product => product._id
});

export const { selectAll: selectProducts, selectById: selectProductById } = productsAdapter.getSelectors(
	state => state.eCommerceApp.products
);

const productsSlice = createSlice({
	name: 'eCommerceApp/products',
	initialState: productsAdapter.getInitialState({
		searchText: '',
		showGrid: false
	}),
	reducers: {
		setProductsSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		setProductsShowGrid: {
			reducer: (state, action) => {
				state.showGrid = action;
				console.log(action);
			},
			prepare: event => ({ payload: event })
		}
	},
	extraReducers: {
		[getProducts.fulfilled]: productsAdapter.setAll,
		[removeProducts.fulfilled]: (state, action) => productsAdapter.removeMany(state, action.payload)
	}
});

export const { setProductsSearchText } = productsSlice.actions;
export const { setProductsShowGrid } = productsSlice.actions;

export default productsSlice.reducer;
