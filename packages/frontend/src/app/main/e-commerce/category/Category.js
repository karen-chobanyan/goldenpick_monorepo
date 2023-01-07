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
import _ from '@lodash';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import ImageUploader from 'app/shared-components/ImageUploader';
import { resetCategory, newCategory, getCategory } from '../store/categorySlice';
import reducer from '../store';
import CategorieHeader from './CategoryHeader';
import BasicInfoTab from './tabs/BasicInfoTab';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	name: yup
		.string()
		.required('You must enter a category name')
		.min(5, 'The category name must be at least 5 characters')
});

function Category(props) {
	const { t } = useTranslation('common');
	const dispatch = useDispatch();
	const category = useSelector(({ eCommerceApp }) => eCommerceApp.category);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noCategory, setNoCategory] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema)
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		const { categoryId } = routeParams;

		if (categoryId === 'new') {
			/**
			 * Create New Category data
			 */
			dispatch(newCategory());
		} else {
			/**
			 * Get Category data
			 */
			dispatch(getCategory(routeParams)).then(action => {
				/**
				 * If the requested category is not exist show message
				 */
				if (!action.payload) {
					setNoCategory(true);
				}
			});
		}
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!category) {
			return;
		}
		/**
		 * Reset the form on category state changes
		 */
		reset(category);
	}, [category, reset]);

	useEffect(() => {
		return () => {
			/**
			 * Reset Category on component unload
			 */
			dispatch(resetCategory());
			setNoCategory(false);
		};
	}, [dispatch]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	/**
	 * Show Message if the requested categories is not exists
	 */
	if (noCategory) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					{t('No_Category')}
				</Typography>
				<Button className="mt-24" component={Link} variant="outlined" to="/categories" color="inherit">
					{t('Go_to_Categories_Page')}
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while category data is loading and form is setted
	 */
	if (_.isEmpty(form) || (category && routeParams.categoryId !== category._id && routeParams.categoryId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-92 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<CategorieHeader />}
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
						<Tab className="h-64" label={t('Category_Images')} />
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
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
}

export default withReducer('eCommerceApp', reducer)(Category);
