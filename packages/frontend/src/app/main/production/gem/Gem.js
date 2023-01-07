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
import ImageUploader from 'app/shared-components/ImageUploader';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { resetGem, newGem, getGem } from '../store/gemSlice';
import reducer from '../store';
import GemHeader from './GemHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import PricingTab from './tabs/PricingTab';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	name: yup.string().required('You must enter a gem name').min(5, 'The gem name must be at least 5 characters')
});

function Gem(props) {
	const { t } = useTranslation('production');
	const dispatch = useDispatch();
	const gem = useSelector(({ production }) => production.gem);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noGem, setNoGem] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema)
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		const { gemId } = routeParams;
		if (gemId === 'new') {
			dispatch(newGem());
		} else {
			dispatch(getGem(routeParams)).then(action => {
				if (!action.payload) {
					setNoGem(true);
				}
			});
		}
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!gem) {
			return;
		}
		reset(gem);
	}, [gem, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetGem());
			setNoGem(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	/**
	 * Show Message if the requested gems is not exists
	 */
	if (noGem) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					There is no such gem!
				</Typography>
				<Button className="mt-24" component={Link} variant="outlined" to="/gems" color="inherit">
					Go to Gems Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while gem data is loading and form is setted
	 */
	if (_.isEmpty(form) || (gem && routeParams.gemId !== gem._id && routeParams.gemId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-92 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<GemHeader />}
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
						<Tab className="h-64" label={t('Gem_Images')} />
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

export default withReducer('production', reducer)(Gem);
