import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import { useTranslation } from 'react-i18next';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeUsers } from '../store/usersSlice';

const useStyles = makeStyles(theme => ({
	actionsButtonWrapper: {
		background: theme.palette.background.paper
	}
}));

function UsersTableHead(props) {
	const { t } = useTranslation('common');
	const rows = [
		{
			id: 'fname',
			align: 'left',
			disablePadding: false,
			label: t('Name'),
			sort: true
		},
		{
			id: 'email',
			align: 'left',
			disablePadding: false,
			label: t('Email'),
			sort: true
		},
		{
			id: 'userRole',
			align: 'left',
			disablePadding: false,
			label: t('Role'),
			sort: true
		},
		{
			id: 'phone',
			align: 'left',
			disablePadding: false,
			label: t('PhoneNumber'),
			sort: true
		}
		// {
		// 	id: 'active',
		// 	align: 'left',
		// 	disablePadding: false,
		// 	label: 'Active',
		// 	sort: true
		// }
	];
	const classes = useStyles(props);
	const { selectedUserIds } = props;
	const numSelected = selectedUserIds.length;

	const [selectedUsersMenu, setSelectedUsersMenu] = useState(null);

	const dispatch = useDispatch();

	const createSortHandler = property => event => {
		props.onRequestSort(event, property);
	};

	function openSelectedUsersMenu(event) {
		setSelectedUsersMenu(event.currentTarget);
	}

	function closeSelectedUsersMenu() {
		setSelectedUsersMenu(null);
	}

	return (
		<TableHead>
			<TableRow className="h-48 sm:h-64">
				<TableCell padding="none" className="w-40 md:w-64 text-center z-99">
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < props.rowCount}
						checked={props.rowCount !== 0 && numSelected === props.rowCount}
						onChange={props.onSelectAllClick}
					/>
					{numSelected > 0 && (
						<div
							className={clsx(
								'flex items-center justify-center absolute w-64 top-0 ltr:left-0 rtl:right-0 mx-56 h-64 z-10 border-b-1',
								classes.actionsButtonWrapper
							)}
						>
							<IconButton
								aria-owns={selectedUsersMenu ? 'selectedUsersMenu' : null}
								aria-haspopup="true"
								onClick={openSelectedUsersMenu}
							>
								<Icon>more_horiz</Icon>
							</IconButton>
							<Menu
								id="selectedUsersMenu"
								anchorEl={selectedUsersMenu}
								open={Boolean(selectedUsersMenu)}
								onClose={closeSelectedUsersMenu}
							>
								<MenuList>
									<MenuItem
										onClick={() => {
											dispatch(removeUsers(selectedUserIds));
											props.onMenuItemClick();
											closeSelectedUsersMenu();
										}}
									>
										<ListItemIcon className="min-w-40">
											<Icon>delete</Icon>
										</ListItemIcon>
										<ListItemText primary="Remove" />
									</MenuItem>
								</MenuList>
							</Menu>
						</div>
					)}
				</TableCell>
				{rows.map(row => {
					return (
						<TableCell
							className="p-4 md:p-16"
							key={row.id}
							align={row.align}
							padding={row.disablePadding ? 'none' : 'default'}
							sortDirection={props.order.sortId === row.id ? props.order.sortDirection : false}
						>
							{row.sort && (
								<Tooltip
									title="Sort"
									placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
									enterDelay={300}
								>
									<TableSortLabel
										active={props.order.sortId === row.id}
										direction={props.order.sortDirection}
										onClick={createSortHandler(row.id)}
										className="font-semibold"
									>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							)}
						</TableCell>
					);
				}, this)}
			</TableRow>
		</TableHead>
	);
}

export default UsersTableHead;
