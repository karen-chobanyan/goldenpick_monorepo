import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseUtils from '@fuse/utils';
import _ from '@lodash';
import { useDeepCompareEffect } from '@fuse/hooks';
import Moment from 'react-moment';
import moment from 'moment';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { TextField } from '@material-ui/core';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { selectContacts } from 'app/main/contacts/store/contactsSlice';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { useParams, withRouter, Link, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Autocomplete } from '@material-ui/lab';
import { useFormContext, Controller, FormProvider, useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import FuseLoading from '@fuse/core/FuseLoading';
import OrdersStatus from '../order/OrdersStatus';
import { saveOrder } from '../store/orderSlice';

import { selectOrders, getOrders } from '../store/ordersSlice';
import OrdersTableHead from './OrdersTableHead';

function OrdersTable(props) {
	const settings = JSON.parse(localStorage.getItem('settings'));
	const [cookies, setCookie] = useCookies(['sorted']);
	const contacts = useSelector(selectContacts);
	const { t } = useTranslation('common');
	const dispatch = useDispatch();
	const { control } = useForm();
	const orders = useSelector(selectOrders);
	const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.orders.searchText);
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(orders);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(Number(cookies.perPage ? cookies.perPage : 100));
	const [order, setOrder] = useState(cookies);
	const [conts, setContacts] = useState([{ fname: '', lname: '' }]);
	const routeParams = useParams();
	const [activeStatus, setActiveStatus] = useState([]);

	const user = JSON.parse(localStorage.getItem('user'));
	const userStatus = user?.userRole?.statuses;

	useDeepCompareEffect(() => {
		setContacts(contacts);
	}, [contacts]);

	useEffect(() => {
		dispatch(getOrders(routeParams)).then(() => setLoading(false));
		console.log(routeParams);
	}, [dispatch, routeParams]);

	useEffect(() => {
		settings?.statuses.forEach(s => {
			Object.keys(userStatus).forEach(k => {
				if (userStatus[k] === true && k.split('__').join(' ') === s.text) {
					setActiveStatus(a => [...a, s]);
				}
			});
		});
	}, []);

	useEffect(() => {
		let index = orders.length - 1;
		while (index >= 0) {
			if (activeStatus[index] && orders[index].status.text !== activeStatus[index].text) {
				orders.splice(index, 1);
			}

			index -= 1;
		}
		if (searchText.length !== 0) {
			setData(FuseUtils.filterArrayByString(orders, searchText));
			setPage(0);
		} else {
			setData(orders);
		}
	}, [activeStatus, orders, searchText]);

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
		setCookie('sortId', sortId, { path: '/orders' });
		setCookie('sortDirection', sortDirection, { path: '/orders' });
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
		setRowsPerPage(Number(event.target.value));
		setCookie('perPage', event.target.value, { path: '/orders' });
	}

	if (loading) {
		return <FuseLoading />;
	}

	if (data && data.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					{t('no_orders')}
				</Typography>
			</motion.div>
		);
	}
	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<OrdersTableHead
						selectedOrderIds={selected}
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
										case 'id': {
											return parseInt(o.id, 10);
										}
										case 'customer': {
											return o.customer?.fname;
										}
										case 'payment': {
											return o.payment?.method;
										}
										case 'teammate': {
											return o.teammate?.fname;
										}
										case 'total': {
											return o.product?.price1;
										}
										case 'status': {
											return o.status?.text;
										}
										case 'dueDate': {
											return o.dueDate;
										}
										case 'createDate': {
											return o.createDate;
										}
										case 'statusUpdateDate': {
											return o.statusUpdateDate;
										}
										case 'size': {
											return o.size;
										}
										case 'primary_color': {
											return o.primary_color;
										}
										case 'probe': {
											return o.probe;
										}
										case 'name': {
											return o.product?.name;
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
										className="h-72"
										hover
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={n._id}
										selected={isSelected}
										// onClick={event => handleClick(n)}
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
														src={n.product?.images?.length && n.product?.images[0]?.url}
														alt="product orig"
													/>
												}
											>
												<Typography component={Link} to={'/order/' + n._id}>
													{n.product?.images?.length > 0 ? (
														<img
															className="group-hover:w-full w-7/12 block rounded"
															src={n.product?.images[0]?.url}
															alt="product orig"
														/>
													) : (
														<img
															className="w-7/12 block rounded"
															src="assets/images/ecommerce/product-image-placeholder.png"
															alt="product alt"
														/>
													)}
												</Typography>
											</Tooltip>
										</TableCell>
										<TableCell className="max-w-0 p-4 md:p-16 truncate" component="th" scope="row">
											<Typography
												className="block text-center pt-14 pb-14"
												role="button"
												component={Link}
												to={'/order/' + n._id}
											>
												{`${n.customer?.fname} ${n.customer?.lname}`}
											</Typography>
										</TableCell>
										{/* <TableCell className="max-w-0 p-4 md:p-16 truncate" component="th" scope="row">
											<Typography
												className="block pt-14 pb-14"
												role="button"
												component={Link}
												to={'/order/' + n._id}
											>
												{`${n.teammate?.fname} ${n.teammate?.lname}`}
											</Typography>
										</TableCell> */}
										<TableCell
											className="max-w-0 p-4 md:p-16"
											component="th"
											scope="row"
											align="right"
										>
											<Typography
												className="block text-center pt-14 pb-14"
												role="button"
												component={Link}
												to={'/order/' + n._id}
											>
												<span>$</span>
												{n.product?.price2}
											</Typography>
										</TableCell>
										<TableCell className="text-center p-4 md:p-16" component="th" scope="row">
											{n.status && <OrdersStatus status={n.status[0] || n.status} />}
											<Controller
												name="status"
												control={control}
												render={({ field: { onChange, value } }) => (
													<Autocomplete
														value={n.status}
														onChange={(event, newValue) => {
															onChange(newValue);
															dispatch(saveOrder({ ...n, status: newValue })).then(() =>
																dispatch(getOrders(routeParams)).then(() =>
																	setLoading(false)
																)
															);
														}}
														className="opacity-0 cursor-pointer -mt-36 mt-8 w-2/3 mr-12 ml-12 w-full"
														freeSolo
														options={settings?.statuses}
														getOptionLabel={option => `${option.text}`}
														renderInput={params => (
															<TextField
																{...params}
																placeholder="Select Status"
																variant="outlined"
																className="cursor-pointer"
																InputLabelProps={{
																	shrink: true
																}}
															/>
														)}
													/>
												)}
											/>
										</TableCell>
										<TableCell className="max-w-0 p-4 md:p-16" component="th" scope="row">
											<Typography
												className="block text-center pt-14 pb-14"
												role="button"
												component={Link}
												to={'/order/' + n._id}
											>
												<Moment fromNow ago>
													{n.createDate}
												</Moment>
											</Typography>
										</TableCell>
										<TableCell className="max-w-0 p-4 md:p-16" component="th" scope="row">
											<Typography
												className="block text-center pt-14 pb-14"
												role="button"
												component={Link}
												to={'/order/' + n._id}
											>
												<Moment fromNow>{n.statusUpdateDate}</Moment>
											</Typography>
										</TableCell>
										<TableCell className="max-w-0 p-4 md:p-16" component="th" scope="row">
											<Typography
												className="block text-center pt-14 pb-14"
												role="button"
												component={Link}
												to={'/order/' + n._id}
											>
												<Moment fromNow>{n.dueDate}</Moment>
											</Typography>
										</TableCell>
										<TableCell className="max-w-0 p-4 md:p-16" component="th" scope="row">
											<Typography
												className="block text-center pt-14 pb-14"
												role="button"
												component={Link}
												to={'/order/' + n._id}
											>
												{n?.size}
											</Typography>
										</TableCell>
										<TableCell className="max-w-0 p-4 md:p-16" component="th" scope="row">
											<Typography
												className="block text-center pt-14 pb-14"
												role="button"
												component={Link}
												to={'/order/' + n._id}
											>
												{n?.primary_color}
											</Typography>
										</TableCell>
										<TableCell className="max-w-0 p-4 md:p-16" component="th" scope="row">
											<Typography
												className="block text-center pt-14 pb-14"
												role="button"
												component={Link}
												to={'/order/' + n._id}
											>
												{n?.probe}
											</Typography>
										</TableCell>
										<TableCell className="max-w-0 p-4 md:p-16" component="th" scope="row">
											<Typography
												className="block text-center pt-14 pb-14"
												role="button"
												component={Link}
												to={'/order/' + n._id}
											>
												{n.product?.name}
											</Typography>
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

export default withRouter(OrdersTable);
