import { combineReducers } from '@reduxjs/toolkit';
import roles from './rolesSlice';

const reducer = combineReducers({
	roles
});

export default reducer;
