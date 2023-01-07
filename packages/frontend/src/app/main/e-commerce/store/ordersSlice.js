import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getOrders = createAsyncThunk('eCommerceApp/orders/getOrders', async status => {
	console.log(status);
	const response = await axios.get(process.env.REACT_APP_API_URL + '/orders/' + status.orderStatus);
	const data = await response.data;

	return data;
});

export const removeOrders = createAsyncThunk(
	'eCommerceApp/orders/removeOrders',
	async (orderIds, { dispatch, getState }) => {
		await axios.post(process.env.REACT_APP_API_URL + '/orders/remove', { orderIds });

		return orderIds;
	}
);

const ordersAdapter = createEntityAdapter({
	selectId: order => order._id
});

export const { selectAll: selectOrders, selectById: selectOrderById } = ordersAdapter.getSelectors(
	state => state.eCommerceApp.orders
);

const ordersSlice = createSlice({
	name: 'eCommerceApp/orders',
	initialState: ordersAdapter.getInitialState({
		searchText: ''
	}),
	reducers: {
		setOrdersSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		}
	},
	extraReducers: {
		[getOrders.fulfilled]: ordersAdapter.setAll,
		[removeOrders.fulfilled]: (state, action) => ordersAdapter.removeMany(state, action.payload)
	}
});

export const { setOrdersSearchText } = ordersSlice.actions;

export default ordersSlice.reducer;
