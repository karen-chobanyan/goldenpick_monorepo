import { combineReducers } from '@reduxjs/toolkit';
import metal from './metalSlice';
import metals from './metalsSlice';
import gem from './gemSlice';
import gems from './gemsSlice';
import users from './usersSlice';
import user from './userSlice';

const reducer = combineReducers({
	gems,
	gem,
	metals,
	metal,
	users,
	user
});

export default reducer;
