import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getProjects = createAsyncThunk('projectDashboardApp/projects/getProjects', async () => {
	const response = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/projects`);
	return response.data;
});

const projectsAdapter = createEntityAdapter({});

export const {
	selectAll: selectProjects,
	selectEntities: selectProjectsEntities,
	selectById: selectProjectById
} = projectsAdapter.getSelectors(state => state.projectDashboardApp.projects);

const projectsSlice = createSlice({
	name: 'projectDashboardApp/projects',
	initialState: projectsAdapter.getInitialState(),
	reducers: {},
	extraReducers: {
		[getProjects.fulfilled]: projectsAdapter.setAll
	}
});

export default projectsSlice.reducer;
