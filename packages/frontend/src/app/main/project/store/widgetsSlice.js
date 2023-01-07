import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getWidgets = createAsyncThunk('projectDashboardApp/widgets/getWidgets', async () => {
	const response = await axios.get(process.env.REACT_APP_API_URL + '/dashboard');
	const data = await response.data;
	return data;
});

export const getMetalPrice = createAsyncThunk('project/widgets/getMetalPrice', async params => {
	const response = await axios.get(`${process.env.REACT_APP_API_URL}/metal-price/1`);
	const data = await response.data;

	return data === undefined ? null : data;
});

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectWidgets, selectById: selectWidgetById } = widgetsAdapter.getSelectors(
	state => state.projectDashboardApp.widgets
);

const widgetsSlice = createSlice({
	name: 'projectDashboardApp/widgets',
	initialState: widgetsAdapter.getInitialState(),
	reducers: {},
	extraReducers: {
		[getWidgets.fulfilled]: widgetsAdapter.setAll
	}
});

export default widgetsSlice.reducer;
