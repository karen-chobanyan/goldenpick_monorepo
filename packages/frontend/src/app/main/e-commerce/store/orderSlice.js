import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getOrder = createAsyncThunk('eCommerceApp/order/getOrder', async params => {
	const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/order/${params.orderId}`);
	const data = await response.data;
	return data === undefined ? null : data;
});

export const saveOrder = createAsyncThunk('eCommerceApp/order/saveOrder', async (orderData, { dispatch, getState }) => {
	const { order } = getState().eCommerceApp;
	const response = await axios.post(process.env.REACT_APP_API_URL + '/orders', { ...order, ...orderData });
	const data = await response.data;
	console.log(data);

	return data;
});

export const removeOrder = createAsyncThunk('eCommerceApp/order/removeOrder', async (val, { dispatch, getState }) => {
	const { _id } = getState().eCommerceApp.order;
	const response = await axios.post(process.env.REACT_APP_API_URL + '/orders/delete', { _id });
	const data = await response.data;
	return data;
});
const orderSlice = createSlice({
	name: 'eCommerceApp/order',
	initialState: null,
	reducers: {
		resetOrder: () => null,
		newOrder: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					name: '',
					handle: '',
					description: '',
					customer: null,
					product: { name: '' },
					payment: {},
					shippingDetails: [],
					teammate: null,
					status: { text: '', color: {} },
					price1: 0,
					price2: 0,
					active: true
				}
			})
		}
	},
	extraReducers: {
		[getOrder.fulfilled]: (state, action) => action.payload,
		[saveOrder.fulfilled]: (state, action) => action.payload
	}
});

export const { newOrder, resetOrder } = orderSlice.actions;

export default orderSlice.reducer;
