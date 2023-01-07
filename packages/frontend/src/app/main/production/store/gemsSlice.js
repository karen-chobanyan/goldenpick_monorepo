import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getGems = createAsyncThunk('production/gems/getGems', async () => {
	const response = await axios.get(process.env.REACT_APP_API_URL + '/gems');
	const data = await response.data;

	return data;
});

export const removeGems = createAsyncThunk('production/gems/removeGems', async (gemIds, { dispatch, getState }) => {
	await axios.delete(process.env.REACT_APP_API_URL + '/gems', { gemIds });

	return gemIds;
});

const gemsAdapter = createEntityAdapter({
	selectId: gem => gem._id
});

export const { selectAll: selectGems, selectById: selectGemById } = gemsAdapter.getSelectors(
	state => state.production.gems
);

const gemsSlice = createSlice({
	name: 'production/gems',
	initialState: gemsAdapter.getInitialState({
		searchText: ''
	}),
	reducers: {
		setGemsSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		}
	},
	extraReducers: {
		[getGems.fulfilled]: gemsAdapter.setAll,
		[removeGems.fulfilled]: (state, action) => gemsAdapter.removeMany(state, action.payload)
	}
});

export const { setGemsSearchText } = gemsSlice.actions;

export default gemsSlice.reducer;
