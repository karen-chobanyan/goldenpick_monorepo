import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Button, Icon, IconButton, Typography, ListItemSecondaryAction } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext, Controller } from 'react-hook-form';
import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { openNewRoleDialog, getRolesObject, selectRoles, openEditRoleDialog } from './store/rolesSlice';
import contactFields from '../settings/ContactFields';
import UserRole from './UserRole';
import reducer from './store';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: 410,
		backgroundColor: theme.palette.background.paper
	},
	paper: {
		width: '80%',
		maxHeight: 485
	}
}));

function UserRolesTab() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const roles = useSelector(selectRoles);
	const [rolesDdata, setRolesData] = useState(roles);

	useEffect(() => {
		dispatch(getRolesObject()).then(p => {});
	}, [dispatch]);

	useEffect(() => {
		setRolesData(roles);
	}, [roles]);

	console.log(roles);
	return (
		<div className={classes.root}>
			<div className="mb-16">
				<h1>User Roles</h1>
				<Button variant="outlined" color="secondary" onClick={ev => dispatch(openNewRoleDialog())}>
					Add new user role
				</Button>
				<List component="div" role="list">
					<ListItem button divider disabled role="listitem">
						<ListItemText primary="User Roles" />
					</ListItem>
					{rolesDdata.map(role => (
						<ListItem
							key={role._id}
							button
							divider
							role="listitem"
							onClick={ev => dispatch(openEditRoleDialog(role))}
						>
							{role.name}
							<ListItemSecondaryAction>
								<IconButton
									edge="end"
									aria-label="edit"
									onClick={ev => dispatch(openEditRoleDialog(role))}
								>
									<Icon color="action">edit</Icon>
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					))}
				</List>
			</div>
			<UserRole />
		</div>
	);
}

export default withReducer('role', reducer)(UserRolesTab);
