import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getUser = createAsyncThunk('production/user/getUser', async params => {
	const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/${params.userId}`);
	const data = await response.data;

	return data === undefined ? null : data;
});

export const removeUser = createAsyncThunk('production/user/removeUser', async (val, { dispatch, getState }) => {
	const { _id } = getState().production.user;
	await axios.post(`${process.env.REACT_APP_API_URL}/auth/delete`, { _id });

	return _id;
});

export const saveUser = createAsyncThunk('production/user/saveUser', async (userData, { dispatch, getState }) => {
	const { user } = getState().production;
	const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, { ...user, ...userData });
	const data = await response.data;

	return data;
});

const userSlice = createSlice({
	name: 'production/user',
	initialState: null,
	reducers: {
		resetUser: () => null,
		newUser: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					fname: '',
					lname: '',
					email: '',
					userRole: '',
					password: ''
				}
			})
		}
	},
	extraReducers: {
		[getUser.fulfilled]: (state, action) => action.payload,
		[saveUser.fulfilled]: (state, action) => action.payload,
		[removeUser.fulfilled]: (state, action) => null
	}
});

export const { newUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
