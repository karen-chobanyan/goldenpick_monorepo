/**
 * Authorization Roles
 */
const authRoles = {
	admin: ['admin', 'Admin', 'Manager', 'User', 'user'],
	staff: ['admin', 'staff'],
	user: ['admin', 'staff', 'user'],
	onlyGuest: []
};

export default authRoles;
