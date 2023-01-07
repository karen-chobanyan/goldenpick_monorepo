import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getUserData = createAsyncThunk('contactsApp/user/getUserData', async () => {
	const response = await localStorage.getItem('user');
	const data = JSON.parse(response);
	return data;
});

const userSlice = createSlice({
	name: 'contactsApp/user',
	initialState: {},
	reducers: {},
	extraReducers: {
		[getUserData.fulfilled]: (state, action) => action.payload
	}
});

export default userSlice.reducer;
