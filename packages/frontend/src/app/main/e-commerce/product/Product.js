import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import ImageUploader from 'app/shared-components/ImageUploader';
import FileUploader from 'app/shared-components/FileUploader';
import _ from '@lodash';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { resetProduct, newProduct, getProduct } from '../store/productSlice';
import reducer from '../store';
import ProductHeader from './ProductHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import PricingTab from './tabs/PricingTab';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	name: yup
		.string()
		.required('You must enter a product name')
		.min(2, 'The product name must be at least 5 characters')
});

function Product(props) {
	const { t } = useTranslation('common');
	const dispatch = useDispatch();
	const product = useSelector(({ eCommerceApp }) => eCommerceApp.product);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noProduct, setNoProduct] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema)
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		const { productId } = routeParams;

		if (productId === 'new') {
			dispatch(newProduct());
		} else {
			dispatch(getProduct(routeParams)).then(action => {
				if (!action.payload) {
					setNoProduct(true);
				}
			});
		}
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!product) {
			return;
		}

		reset(product);
	}, [product, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetProduct());
			setNoProduct(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noProduct) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					There is no such product!
				</Typography>
				<Button className="mt-24" component={Link} variant="outlined" to="/products" color="inherit">
					Go to Products Page
				</Button>
			</motion.div>
		);
	}

	if (_.isEmpty(form) || (product && routeParams.productId !== product._id && routeParams.productId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-92 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<ProductHeader />}
				contentToolbar={
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						indicatorColor="primary"
						textColor="primary"
						variant="scrollable"
						scrollButtons="auto"
						classes={{ root: 'w-full h-64' }}
					>
						<Tab className="h-64" label={t('Basic_Info')} />
						<Tab className="h-64" label={t('Product_Images')} />
						<Tab className="h-64" label={t('Pricing')} />
						<Tab className="h-64" label={t('Attachments')} />
					</Tabs>
				}
				content={
					<div className="p-16 sm:p-24 max-w-2xl">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<BasicInfoTab />
						</div>

						<div className={tabValue !== 1 ? 'hidden' : ''}>
							<ImageUploader />
						</div>

						<div className={tabValue !== 2 ? 'hidden' : ''}>
							<PricingTab />
						</div>
						<div className={tabValue !== 3 ? 'hidden' : ''}>
							<FileUploader />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
}

export default Product;
