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
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useTranslation } from 'react-i18next';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeGems } from '../store/gemsSlice';

const useStyles = makeStyles(theme => ({
	actionsButtonWrapper: {
		background: theme.palette.background.paper
	}
}));

function GemsTableHead(props) {
	const { t } = useTranslation('production');
	const rows = [
		{
			id: 'image',
			align: 'left',
			disablePadding: true,
			label: '',
			sort: false
		},
		{
			id: 'name',
			align: 'left',
			disablePadding: false,
			label: t('Name'),
			sort: true
		},
		{
			id: 'price1',
			align: 'right',
			disablePadding: false,
			label: t('PriceUsd'),
			sort: true
		},
		{
			id: 'price2',
			align: 'right',
			disablePadding: false,
			label: t('PriceAmd'),
			sort: true
		},
		{
			id: 'active',
			align: 'right',
			disablePadding: false,
			label: t('Active'),
			sort: true
		}
	];
	const classes = useStyles(props);
	const { selectedGemIds } = props;
	const numSelected = selectedGemIds.length;

	const [selectedGemsMenu, setSelectedGemsMenu] = useState(null);

	const dispatch = useDispatch();

	const createSortHandler = property => event => {
		props.onRequestSort(event, property);
	};

	function openSelectedGemsMenu(event) {
		setSelectedGemsMenu(event.currentTarget);
	}

	function closeSelectedGemsMenu() {
		setSelectedGemsMenu(null);
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
								aria-owns={selectedGemsMenu ? 'selectedGemsMenu' : null}
								aria-haspopup="true"
								onClick={openSelectedGemsMenu}
							>
								<Icon>more_horiz</Icon>
							</IconButton>
							<Menu
								id="selectedGemsMenu"
								anchorEl={selectedGemsMenu}
								open={Boolean(selectedGemsMenu)}
								onClose={closeSelectedGemsMenu}
							>
								<MenuList>
									<MenuItem
										onClick={() => {
											dispatch(removeGems(selectedGemIds));
											props.onMenuItemClick();
											closeSelectedGemsMenu();
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

export default GemsTableHead;
