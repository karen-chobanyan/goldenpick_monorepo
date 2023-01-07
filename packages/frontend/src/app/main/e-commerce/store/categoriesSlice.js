import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getCategories = createAsyncThunk('eCommerceApp/categories/getCategories', async () => {
	const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
	const data = await response.data;

	return data;
});

export const removeCategories = createAsyncThunk(
	'eCommerceApp/categories/removeCategories',
	async (categoryIds, { dispatch, getState }) => {
		await axios.post(`${process.env.REACT_APP_API_URL}/remove-categories`, { categoryIds });

		return categoryIds;
	}
);

const categoriesAdapter = createEntityAdapter({
	selectId: cat => cat._id
});

export const { selectAll: selectCategories, selectById: selectCategoryById } = categoriesAdapter.getSelectors(
	state => state.eCommerceApp.categories
);

const categoriesSlice = createSlice({
	name: 'eCommerceApp/categories',
	initialState: categoriesAdapter.getInitialState({
		searchText: ''
	}),
	reducers: {
		setCategoriesSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		}
	},
	extraReducers: {
		[getCategories.fulfilled]: categoriesAdapter.setAll,
		[removeCategories.fulfilled]: (state, action) => categoriesAdapter.removeMany(state, action.payload)
	}
});

export const { setCategoriesSearchText } = categoriesSlice.actions;

export default categoriesSlice.reducer;
