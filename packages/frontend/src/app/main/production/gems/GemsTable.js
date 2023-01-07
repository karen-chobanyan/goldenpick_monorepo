import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useCookies } from 'react-cookie';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import { getGems, selectGems } from '../store/gemsSlice';
import GemsTableHead from './GemsTableHead';

function GemsTable(props) {
	const [cookies, setCookie] = useCookies(['sorted']);
	const { t } = useTranslation('production');
	const dispatch = useDispatch();
	const gems = useSelector(selectGems);
	const searchText = useSelector(({ production }) => production.gems.searchText);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(gems);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(Number(cookies.perPage ? cookies.perPage : 100));
	const [order, setOrder] = useState(cookies);
	useEffect(() => {
		dispatch(getGems()).then(() => setLoading(false));
	}, [dispatch]);

	useEffect(() => {
		if (searchText.length !== 0) {
			setData(_.filter(gems, item => item.name.toLowerCase().includes(searchText.toLowerCase())));
			setPage(0);
		} else {
			setData(gems);
		}
	}, [gems, searchText]);

	function handleRequestSort(event, property) {
		const sortId = property;
		let sortDirection = 'desc';

		if (order.sortId === property && order.sortDirection === 'desc') {
			sortDirection = 'asc';
		}

		setOrder({
			sortDirection,
			sortId
		});
		setCookie('sortId', sortId, { path: '/gems' });
		setCookie('sortDirection', sortDirection, { path: '/gems' });
	}

	function handleSelectAllClick(event) {
		if (event.target.checked) {
			setSelected(data.map(n => n.id));
			return;
		}
		setSelected([]);
	}

	function handleDeselect() {
		setSelected([]);
	}

	function handleClick(item) {
		props.history.push(`/gems/${item._id}`);
	}

	function handleCheck(event, id) {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	}

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
		setCookie('perPage', event.target.value, { path: '/gems' });
	}

	if (loading) {
		return <FuseLoading />;
	}

	if (data.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					{t('No_gem')}
				</Typography>
			</motion.div>
		);
	}

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<GemsTableHead
						selectedGemIds={selected}
						order={order}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data.length}
						onMenuItemClick={handleDeselect}
					/>

					<TableBody>
						{_.orderBy(
							data,
							[
								o => {
									switch (order.sortId) {
										case 'name': {
											return o.name;
										}
										case 'categories': {
											return o.categories;
										}
										case 'price1': {
											return o.price1;
										}
										case 'price2': {
											return o.price2;
										}
										default: {
											return o[order.id];
										}
									}
								}
							],
							[order.sortDirection]
						)
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map(n => {
								const isSelected = selected.indexOf(n.id) !== -1;
								return (
									<TableRow
										className="h-72 cursor-pointer"
										hover
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={n._id}
										selected={isSelected}
										onClick={event => handleClick(n)}
									>
										<TableCell className="w-40 md:w-64 text-center" padding="none">
											<Checkbox
												checked={isSelected}
												onClick={event => event.stopPropagation()}
												onChange={event => handleCheck(event, n.id)}
											/>
										</TableCell>

										<TableCell
											className="w-52 px-4 md:px-0"
											component="th"
											scope="row"
											padding="none"
										>
											<Tooltip
												title={
													<img
														className=""
														src={n.images?.length && n.images[0].url}
														alt="product orig"
													/>
												}
											>
												{n.images.length > 0 ? (
													<img
														className="w-full block rounded"
														src={n.images[0].url}
														alt={n.name}
													/>
												) : (
													<img
														className="w-full block rounded"
														src="assets/images/ecommerce/product-image-placeholder.png"
														alt={n.name}
													/>
												)}
											</Tooltip>
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.name}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
											<span>$</span>
											{n.price1}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
											<span>֏</span>
											{n.price2}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
											{n.active ? (
												<Icon className="text-green text-20">check_circle</Icon>
											) : (
												<Icon className="text-red text-20">remove_circle</Icon>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</FuseScrollbars>

			<TablePagination
				labelRowsPerPage={t('row_page')}
				className="flex-shrink-0 border-t-1"
				component="div"
				count={data.length}
				rowsPerPage={rowsPerPage}
				page={page}
				backIconButtonProps={{
					'aria-label': 'Previous Page'
				}}
				nextIconButtonProps={{
					'aria-label': 'Next Page'
				}}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</div>
	);
}

export default withRouter(GemsTable);
