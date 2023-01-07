import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getRole = createAsyncThunk('userRoles/roles/getRole', async params => {
	const response = await axios.get(`${process.env.REACT_APP_API_URL}/roles/role/${params.roleId}`);
	const data = await response.data;
	return data === undefined ? null : data;
});

export const getRoles = createAsyncThunk('userRoles/roles/getRoles', async () => {
	const response = await axios.get(process.env.REACT_APP_API_URL + '/roles');
	const { data } = response;
	return data;
});

export const getRolesObject = createAsyncThunk('userRoles/roles/getRoles', async () => {
	const response = await axios.get(process.env.REACT_APP_API_URL + '/roles');
	const { data } = response;
	const pages = {};
	const statuses = {};
	console.log(data);
	data.map(role => {
		role.pages.forEach(page => {
			pages[page] = true;
		});
		role.statuses.forEach(status => {
			statuses[status] = true;
		});
		role.pages = pages;
		role.statuses = statuses;
		return role;
	});
	return data;
});

const rolesAdapter = createEntityAdapter({
	selectId: role => role._id
});

export const { selectAll: selectRoles, selectById: selectRoleById } = rolesAdapter.getSelectors(
	state => state.userRoles.roles
);

export const saveRole = createAsyncThunk('userRoles/roles/saveRole', async (roleData, { dispatch, getState }) => {
	const { role } = getState().userRoles;
	const newData = { ...role, ...roleData };
	const pages = [];
	const statuses = [];

	Object.keys(newData.pages).forEach(page => {
		if (newData.pages[page]) {
			pages.push(page);
		}
	});
	Object.keys(newData.statuses).forEach(status => {
		if (newData.statuses[status]) {
			statuses.push(status);
		}
	});

	newData.pages = pages;
	newData.statuses = statuses;

	const response = await axios.post(process.env.REACT_APP_API_URL + '/roles', newData);
	const data = await response.data;
	dispatch(getRoles());
	console.log(data);
	return data;
});

export const updateRole = createAsyncThunk('userRoles/roles/updateRole', async (role, { dispatch, getState }) => {
	const pages = [];
	const statuses = [];
	Object.keys(role.pages).forEach(page => {
		if (role.pages[page]) {
			pages.push(page);
		}
	});
	Object.keys(role.statuses).forEach(status => {
		if (role.statuses[status]) {
			statuses.push(status);
		}
	});
	role.pages = pages;
	role.statuses = statuses;

	const response = await axios.post(`${process.env.REACT_APP_API_URL}/roles`, role);
	const data = await response.data;
	dispatch(getRolesObject());
	return data;
});

export const removeRole = createAsyncThunk('userRoles/roles/removeRole', async (_id, { dispatch, getState }) => {
	await axios.post(`${process.env.REACT_APP_API_URL}/roles/delete`, { _id });
	dispatch(getRoles());
	return _id;
});

const rolesSlice = createSlice({
	name: 'userRoles/roles',
	initialState: rolesAdapter.getInitialState({
		routeParams: {},
		roleDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		resetRole: () => null,
		newRole: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					name: '',
					userType: 'user',
					pages: [],
					orderData: [],
					productData: [],
					customerData: [],
					dashboardData: [],
					settings: []
				}
			})
		},
		openNewRoleDialog: (state, action) => {
			state.roleDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewRoleDialog: (state, action) => {
			state.roleDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditRoleDialog: (state, action) => {
			state.roleDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditRoleDialog: (state, action) => {
			state.roleDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		}
	},
	extraReducers: {
		[getRole.fulfilled]: (state, action) => action.payload,
		[getRoles.fulfilled]: rolesAdapter.setAll
	}
});

export const { newRole, resetRole, openNewRoleDialog, closeNewRoleDialog, openEditRoleDialog, closeEditRoleDialog } =
	rolesSlice.actions;

export default rolesSlice.reducer;
