import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getMetals = createAsyncThunk('production/metals/getMetals', async () => {
	const response = await axios.get(process.env.REACT_APP_API_URL + '/metals');
	const data = await response.data;

	return data;
});

export const removeMetals = createAsyncThunk(
	'production/metals/removeMetals',
	async (metalIds, { dispatch, getState }) => {
		await axios.post(process.env.REACT_APP_API_URL + '/remove-metals', { metalIds });

		return metalIds;
	}
);

const metalsAdapter = createEntityAdapter({
	selectId: metal => metal._id
});

export const { selectAll: selectMetals, selectById: selectMetalById } = metalsAdapter.getSelectors(
	state => state.production.metals
);

const metalsSlice = createSlice({
	name: 'production/metals',
	initialState: metalsAdapter.getInitialState({
		searchText: ''
	}),
	reducers: {
		setMetalsSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		}
	},
	extraReducers: {
		[getMetals.fulfilled]: metalsAdapter.setAll,
		[removeMetals.fulfilled]: (state, action) => metalsAdapter.removeMany(state, action.payload)
	}
});

export const { setMetalsSearchText } = metalsSlice.actions;

export default metalsSlice.reducer;
