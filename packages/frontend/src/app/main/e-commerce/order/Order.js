import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { useDeepCompareEffect } from '@fuse/hooks';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import OrderDetailsTab from './OrderDetails';
import reducer from '../store';
import { resetOrder, getOrder, newOrder } from '../store/orderSlice';
import OrderHeader from './OrderHeader';

const schema = yup.object().shape({
	name: yup
		.string()
		.required('You must enter a product name')
		.min(5, 'The product name must be at least 5 characters')
});

function Order(props) {
	const dispatch = useDispatch();
	const order = useSelector(({ eCommerceApp }) => eCommerceApp.order);

	const routeParams = useParams();
	console.log(routeParams);
	const [noOrder, setNoOrder] = useState(false);

	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema)
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		const { orderId } = routeParams;
		if (orderId === 'new') {
			dispatch(newOrder());
		} else {
			dispatch(getOrder(routeParams)).then(action => {
				if (!action.payload) {
					setNoOrder(true);
				}
			});
		}
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!order) {
			return;
		}
		reset(order);
	}, [order, reset]);

	if (noOrder) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					There is no such order!
				</Typography>
				<Button className="mt-24" component={Link} variant="outlined" to="/orders" color="inherit">
					Go to Orders Page
				</Button>
			</motion.div>
		);
	}

	if (_.isEmpty(form) || (order && routeParams.orderId !== order._id && routeParams.orderId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				classes={{
					content: 'flex',
					header: 'min-h-92 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<OrderHeader />}
				content={
					order && (
						<div className="p-16 sm:p-24 w-full ">
							<OrderDetailsTab />
						</div>
					)
				}
				innerScroll
			/>
		</FormProvider>
	);
}

export default withReducer('eCommerceApp', reducer)(Order);
