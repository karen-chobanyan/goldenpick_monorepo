import { combineReducers } from '@reduxjs/toolkit';
import users from 'app/main/production/store/userSlice';
import login from './loginSlice';
import register from './registerSlice';
import user from './userSlice';

const authReducers = combineReducers({
	user,
	login,
	register,
	users
});

export default authReducers;
