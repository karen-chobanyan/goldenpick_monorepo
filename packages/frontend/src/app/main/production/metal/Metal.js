import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ImageUploader from 'app/shared-components/ImageUploader';
import { resetMetal, newMetal, getMetal } from '../store/metalSlice';
import reducer from '../store';
import MetalHeader from './MetalHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import InventoryTab from './tabs/InventoryTab';
import PricingTab from './tabs/PricingTab';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	name: yup.string().required('You must enter a metal name').min(5, 'The metal name must be at least 5 characters')
});

function Metal(props) {
	const { t } = useTranslation('production');
	const dispatch = useDispatch();
	const metal = useSelector(({ production }) => production.metal);
	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noMetal, setNoMetal] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema)
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		const { metalId } = routeParams;

		if (metalId === 'new') {
			/**
			 * Create New Metal data
			 */
			dispatch(newMetal());
		} else {
			/**
			 * Get Metal data
			 */
			dispatch(getMetal(routeParams)).then(action => {
				/**
				 * If the requested metal is not exist show message
				 */
				if (!action.payload) {
					setNoMetal(true);
				}
			});
		}
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!metal) {
			return;
		}
		/**
		 * Reset the form on metal state changes
		 */
		reset(metal);
	}, [metal, reset]);

	useEffect(() => {
		return () => {
			/**
			 * Reset Metal on component unload
			 */
			dispatch(resetMetal());
			setNoMetal(false);
		};
	}, [dispatch]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	/**
	 * Show Message if the requested metals is not exists
	 */
	if (noMetal) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					There is no such metal!
				</Typography>
				<Button className="mt-24" component={Link} variant="outlined" to="/metals" color="inherit">
					Go to Metals Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while metal data is loading and form is setted
	 */
	if (_.isEmpty(form) || (metal && routeParams.metalId !== metal._id && routeParams.metalId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-92 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<MetalHeader />}
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
						<Tab className="h-64" label={t('Metal_Images')} />
						<Tab className="h-64" label={t('pricing')} />
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
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
}

export default withReducer('production', reducer)(Metal);
