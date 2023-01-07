import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getUsers = createAsyncThunk('production/users/getUsers', async () => {
	const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth`);
	const data = await response.data;

	return data;
});

export const removeUsers = createAsyncThunk('production/users/removeUsers', async (userIds, { dispatch, getState }) => {
	await axios.post(`${process.env.REACT_APP_API_URL}/auth`, { userIds });

	return userIds;
});

export const usersAdapter = createEntityAdapter({
	selectId: user => user._id
});

export const { selectAll: selectUsers, selectById: selectUserById } = usersAdapter.getSelectors(
	state => state.production.users
);

const usersSlice = createSlice({
	name: 'production/users',
	initialState: usersAdapter.getInitialState({
		searchText: ''
	}),
	reducers: {
		setUsersSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		}
	},
	extraReducers: {
		[getUsers.fulfilled]: usersAdapter.setAll
		// [removeUsers.fulfilled]: (state, action) => usersAdapter.removeMany(state, action.payload)
	}
});

export const { setUsersSearchText } = usersSlice.actions;

export default usersSlice.reducer;
