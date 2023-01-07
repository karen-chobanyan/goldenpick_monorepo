import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useTranslation } from 'react-i18next';

import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeOrders } from '../store/ordersSlice';

const useStyles = makeStyles(theme => ({
	actionsButtonWrapper: {
		background: theme.palette.background.paper
	}
}));

function OrdersTableHead(props) {
	const { t } = useTranslation('common');
	console.log(props.order);
	const rows = [
		{
			id: 'photo',
			align: 'left',
			disablePadding: false,
			label: <Icon className="text-3xl">redeem</Icon>,
			sort: true,
			tooltip: 'Product'
		},
		{
			id: 'customer',
			align: 'left',
			disablePadding: false,
			label: <Icon className="text-3xl center">perm_identity</Icon>,
			sort: true,
			tooltip: 'Customer'
		},
		// {
		// 	id: 'teammate',
		// 	align: 'left',
		// 	disablePadding: false,
		// 	label: <Icon className="text-3xl">groups</Icon>,
		// 	sort: true,
		// 	tooltip: 'Team Mate'
		// },
		{
			id: 'total',
			align: 'right',
			disablePadding: false,
			label: <Icon className="text-3xl">attach_money</Icon>,
			sort: true,
			tooltip: 'Total'
		},
		{
			id: 'status',
			align: 'left',
			disablePadding: false,
			label: <Icon className="text-3xl">timeline</Icon>,
			sort: true,
			tooltip: 'Status'
		},
		{
			id: 'createDate',
			align: 'left',
			disablePadding: false,
			label: <Icon className="text-3xl">event_available</Icon>,
			sort: true,
			tooltip: 'Created At'
		},
		{
			id: 'statusUpdateDate',
			align: 'left',
			disablePadding: false,
			label: <Icon className="text-3xl">update</Icon>,
			sort: true,
			tooltip: 'Status Updated At'
		},
		{
			id: 'dueDate',
			align: 'center',
			disablePadding: false,
			label: <Icon className="text-3xl">schedule</Icon>,
			sort: true,
			tooltip: 'Due Date'
		},
		{
			id: 'size',
			align: 'center',
			disablePadding: false,
			label: <Icon className="text-3xl">open_in_full</Icon>,
			sort: true,
			tooltip: 'Size'
		},
		{
			id: 'primary_color',
			align: 'center',
			disablePadding: false,
			label: <Icon className="text-3xl">palette</Icon>,
			sort: true,
			tooltip: 'Color'
		},
		{
			id: 'probe',
			align: 'center',
			disablePadding: false,
			label: <Icon className="text-3xl">loyalty</Icon>,
			sort: true,
			tooltip: 'Probe'
		},
		{
			id: 'name',
			align: 'center',
			disablePadding: false,
			label: <Icon className="text-3xl">view_agenda</Icon>,
			sort: true,
			tooltip: 'Shifr'
		}
	];
	const classes = useStyles(props);
	const { selectedOrderIds } = props;
	const numSelected = selectedOrderIds.length;

	const [selectedOrdersMenu, setSelectedOrdersMenu] = useState(null);

	const dispatch = useDispatch();

	const createSortHandler = property => event => {
		props.onRequestSort(event, property);
	};

	function openSelectedOrdersMenu(event) {
		setSelectedOrdersMenu(event.currentTarget);
	}

	function closeSelectedOrdersMenu() {
		setSelectedOrdersMenu(null);
	}

	// const {onSelectAllClick, order, orderBy, numSelected, rowCount} = props;

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
								aria-owns={selectedOrdersMenu ? 'selectedOrdersMenu' : null}
								aria-haspopup="true"
								onClick={openSelectedOrdersMenu}
							>
								<Icon>more_horiz</Icon>
							</IconButton>
							<Menu
								id="selectedOrdersMenu"
								anchorEl={selectedOrdersMenu}
								open={Boolean(selectedOrdersMenu)}
								onClose={closeSelectedOrdersMenu}
							>
								<MenuList>
									<MenuItem
										onClick={() => {
											dispatch(removeOrders(selectedOrderIds));
											props.onMenuItemClick();
											closeSelectedOrdersMenu();
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
							className="p-4 md:p-16 text-center"
							key={row.id}
							align={row.align}
							padding={row.disablePadding ? 'none' : 'default'}
							sortDirection={props.order.sortId === row.id ? props.order.sortDirection : false}
						>
							{row.sort && (
								<Tooltip
									title={row.tooltip}
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

export default OrdersTableHead;
