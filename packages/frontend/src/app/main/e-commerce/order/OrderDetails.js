/* eslint-disable no-template-curly-in-string */
import { useDeepCompareEffect } from '@fuse/hooks';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Autocomplete } from '@material-ui/lab';
import { useState, forwardRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Dialog, DialogContent, DialogContentText, Slide, TextField } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useParams } from 'react-router';
import moment from 'moment';
import { getUsers, selectUsers } from 'app/main/production/store/usersSlice';
import { getContacts, selectContacts } from 'app/main/contacts/store/contactsSlice';
import { getProducts, selectProducts } from '../store/productsSlice';

// const Transition = forwardRef(function Transition(props, ref) {
// 	return <Slide direction="up" ref={ref} {...props} />;
// });

function OrderDetailsTab(props) {
	const { t } = useTranslation('common');
	const methods = useFormContext();
	const routeParams = useParams();
	const { control, formState } = methods;
	const dispatch = useDispatch();
	const order = useSelector(({ eCommerceApp }) => eCommerceApp.order);
	const contacts = useSelector(selectContacts);
	const [conts, setContacts] = useState([{ fname: '', lname: '' }]);
	const users = useSelector(selectUsers);
	const [usrs, setUsers] = useState([{ fname: '', lname: '' }]);
	const products = useSelector(selectProducts);
	const [prods, setProducts] = useState([{ name: '' }]);
	const [productId, setProductId] = useState('');
	const settings = JSON.parse(localStorage.getItem('settings'));
	const [open, setOpen] = useState(false);
	const primaryColor = ['White', 'Red', 'Yellow', 'Pink'];
	const secondaryColor = ['White', 'Red', 'Yellow', 'Pink'];
	const probe = ['585', '750', '958'];
	const [ordId, setOrdId] = useState();

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	localStorage.getItem('settings', JSON.stringify());
	console.log(settings.statuses);

	useDeepCompareEffect(() => {
		const idDate = new Date();
		setOrdId(
			idDate.getFullYear().toString() +
				idDate.getMonth().toString() +
				idDate.getDay().toString() +
				Math.floor(1000 + Math.random() * 9000)
		);
		dispatch(getContacts());
		dispatch(getUsers());
		dispatch(getProducts());
	}, [dispatch]);
	console.log(ordId);

	useDeepCompareEffect(() => {
		setProducts(products);
	}, [products]);

	useDeepCompareEffect(() => {
		setContacts(contacts);
	}, [contacts]);

	useDeepCompareEffect(() => {
		setUsers(users);
		setProductId(order?.product._id);
	}, [users]);
	return (
		<div className="flex flex-row w-full flex-1">
			<div className="w-6/12 border-r-2 pr-12 print:w-full">
				<div className="pb-6">
					<div className="pb-16 flex items-center  print:hidden">
						<Icon color="action">account_circle</Icon>
						<Typography className="h2 mx-12 font-medium" color="textSecondary">
							{t('Customer')}
						</Typography>
					</div>
					<div className="flex items-center  print:hidden">
						<Controller
							name="customer"
							control={control}
							defaultValue={order.customer}
							render={({ field: { onChange, value } }) => (
								<Autocomplete
									value={value}
									onChange={(event, newValue) => {
										onChange(newValue);
									}}
									className="mt-8 mb-16 w-2/3"
									freeSolo
									options={conts}
									getOptionLabel={option => (option ? `${option?.fname} ${option?.lname}` : '')}
									renderInput={params => (
										<TextField
											{...params}
											placeholder="Select Customer"
											label="Customer"
											variant="outlined"
											InputLabelProps={{
												shrink: true
											}}
										/>
									)}
								/>
							)}
						/>
					</div>
					<div className="flex flex-row">
						<div className="table-responsive">
							<Controller
								name="order_id"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										defaultValue={ordId}
										className="mt-8 mb-16"
										label="Order Id"
										autoFocus
										id="order_id"
										variant="outlined"
									/>
								)}
							/>
						</div>
						<div className="table-responsive ">
							<Controller
								name="size"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mt-8 mb-16"
										label="Size"
										autoFocus
										id="order_size"
										variant="outlined"
									/>
								)}
							/>
						</div>
						<div className="table-responsive">
							<Controller
								name="primary_color"
								control={control}
								render={({ field: { onChange, value } }) => (
									<Autocomplete
										value={value}
										onChange={(event, newValue) => {
											onChange(newValue);
										}}
										options={primaryColor}
										getOptionLabel={option => option}
										renderInput={params => (
											<TextField
												{...params}
												className="mt-8 mb-16"
												autoFocus
												label="Primary Color"
												variant="outlined"
												id="order_pcolor"
											/>
										)}
									/>
								)}
							/>
						</div>
					</div>
					<div className="flex flex-row">
						<div className="table-responsive">
							<Controller
								name="secondary_color"
								control={control}
								render={({ field: { onChange, value } }) => (
									<Autocomplete
										value={value}
										onChange={(event, newValue) => {
											onChange(newValue);
										}}
										options={secondaryColor}
										getOptionLabel={option => option}
										renderInput={params => (
											<TextField
												{...params}
												className="mt-8 mb-16"
												autoFocus
												label="Secondary Color"
												variant="outlined"
												id="order_scolor"
											/>
										)}
									/>
								)}
							/>
						</div>
						<div className="table-responsive">
							<Controller
								name="probe"
								control={control}
								render={({ field: { onChange, value } }) => (
									<Autocomplete
										value={value}
										onChange={(event, newValue) => {
											onChange(newValue);
										}}
										options={probe}
										getOptionLabel={option => option}
										renderInput={params => (
											<TextField
												{...params}
												className="mt-8 mb-16"
												autoFocus
												label="Probe"
												variant="outlined"
												id="order_probe"
											/>
										)}
									/>
								)}
							/>
						</div>
						<div className="table-responsive">
							<Controller
								name="expected_weight"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mt-8 mb-16"
										label="Expected Weight"
										autoFocus
										id="order_wight"
										variant="outlined"
									/>
								)}
							/>
						</div>
					</div>
				</div>
				<div className="pb-6">
					<div>
						<Controller
							name="description"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mt-8 mb-16"
									id="description"
									label="Order Notes"
									type="text"
									InputProps={{ style: { fontSize: 17 } }}
									multiline
									rows={5}
									variant="outlined"
									fullWidth
								/>
							)}
						/>
					</div>
				</div>
			</div>
			<div className="w-6/12 pl-12 print:hidden ">
				<div className="pb-48 border-b-1">
					<div className="pb-16 flex items-center">
						<Icon color="action">access_time</Icon>
						<Typography className="h2 mx-12 font-medium" color="textSecondary">
							{t('Order_Status')}
						</Typography>{' '}
						<br />
					</div>
					<Controller
						name="status"
						control={control}
						render={({ field: { onChange, value } }) => (
							<Autocomplete
								value={value}
								onChange={(event, newValue) => {
									onChange(newValue);
								}}
								className="mt-8 mb-16 w-2/3 mr-12 ml-12 w-full"
								freeSolo
								options={settings?.statuses}
								getOptionLabel={option => `${option.text}`}
								renderInput={params => (
									<TextField
										{...params}
										placeholder="Select Status"
										label="Status"
										variant="outlined"
										InputLabelProps={{
											shrink: true
										}}
									/>
								)}
							/>
						)}
					/>
				</div>
				<div className="pb-16 flex items-center">
					<Icon color="action">account_circle</Icon>
					<Typography className="h2 mx-12 font-medium" color="textSecondary">
						{t('Assigned_to')}
					</Typography>
				</div>
				<div className="flex items-center">
					<Avatar src={order.teammate?.avatar} />
					<Controller
						name="teammate"
						control={control}
						render={({ field: { onChange, value } }) => (
							<Autocomplete
								value={value}
								onChange={(event, newValue) => {
									onChange(newValue);
								}}
								className="mt-8 mb-16 w-2/3 mr-12 ml-12"
								freeSolo
								options={usrs}
								getOptionLabel={option => (option ? `${option?.fname} ${option?.lname}` : '')}
								renderInput={params => (
									<TextField
										{...params}
										placeholder="Select Customer"
										label="Team Member"
										variant="outlined"
										InputLabelProps={{
											shrink: true
										}}
									/>
								)}
							/>
						)}
					/>
				</div>
				<div className="flex flex-row pt-12">
					<div className="w-1/2">
						<div className="pb-16 flex items-center">
							<Icon color="action">shopping_basket</Icon>
							<Typography className="h2 mx-12 font-medium" color="textSecondary">
								{t('Product')}
							</Typography>
							<Typography
								className="flex items-center"
								component={Link}
								role="button"
								to={'/products/' + productId}
								color="inherit"
							>
								{productId ? <Icon className="text-20">arrow_forward</Icon> : null}
							</Typography>
						</div>
						<Controller
							name="product"
							control={control}
							defaultValue={order.product}
							render={({ field: { onChange, value } }) => (
								<Autocomplete
									value={value}
									onChange={(event, newValue) => {
										setProductId(newValue?._id);
										onChange(newValue);
									}}
									className="mt-8 mb-16 w-2/3 mr-12 ml-12 w-300"
									freeSolo
									options={prods}
									getOptionLabel={option => `${option.name}`}
									renderOption={option => {
										return (
											<Tooltip
												title={
													<img
														className=""
														src={option.images?.length && option.images[0].url}
														alt="product orig"
													/>
												}
											>
												{option.images.length > 0 ? (
													<div className="flex flex-row">
														<img
															className="w-32 sm:w-48 rounded"
															src={option.images[0].url}
															alt={option.name}
														/>
														<div className="flex">
															<p className="mt-12 ml-12 text-xs">{option.name}</p>
														</div>
													</div>
												) : (
													<img
														className="w-32 sm:w-48 rounded"
														src="assets/images/ecommerce/product-image-placeholder.png"
														alt={option.name}
													/>
												)}
											</Tooltip>
										);
									}}
									renderInput={params => (
										<TextField
											{...params}
											placeholder="Attach Product"
											label="Product"
											variant="outlined"
											InputLabelProps={{
												shrink: true
											}}
										/>
									)}
								/>
							)}
						/>
					</div>
					<div className="w-1/2">
						<div className="pb-16 flex items-center">
							<Icon color="action">access_alarms</Icon>
							<Typography className="h2 mx-12 font-medium" color="textSecondary">
								{t('Due_Date')}
							</Typography>
						</div>
						<Controller
							name="dueDate"
							control={control}
							defaultValue={moment(order.dueDate).add(7, 'days')}
							render={({ field }) => (
								<KeyboardDatePicker
									{...field}
									variant="outlined"
									className="mt-8 mb-16 w-2/3 mr-12 ml-12"
								/>
							)}
						/>
					</div>
				</div>
				<div onClick={handleClickOpen} className="w-2/12 cursor-pointer">
					{!!order.product?.images?.length && (
						<img className="product-image" src={order.product?.images[0]?.url} alt="product" />
					)}
				</div>
				{order.logs ? <Typography>Order changes</Typography> : null}
				{order.logs?.map((log, index) => {
					return (
						<div key={index}>
							<div className="w-2/4 py-7">
								<Typography className="font-semibold">
									{log.user}{' '}
									<span className="font-normal"> {moment(log.date).format('YYYY-MM-DD, h:mm')}</span>
								</Typography>
								<div className="">
									<Typography>{log.activity}</Typography>
								</div>
							</div>
						</div>
					);
				})}
			</div>
			{order.product?.images?.length ? (
				<Dialog
					open={open}
					keepMounted
					onClose={handleClose}
					aria-labelledby="alert-dialog-slide-title"
					aria-describedby="alert-dialog-slide-description"
				>
					<DialogContent>
						<DialogContentText id="alert-dialog-slide-description">
							<img className="product-image" src={order.product?.images[0]?.url} alt="product" />
						</DialogContentText>
					</DialogContent>
				</Dialog>
			) : (
				''
			)}
		</div>
	);
}

export default OrderDetailsTab;
