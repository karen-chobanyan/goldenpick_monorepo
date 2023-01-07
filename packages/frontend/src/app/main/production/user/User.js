import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from '@lodash';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { resetUser, newUser, getUser } from '../store/userSlice';
import reducer from '../store';
import UserHeader from './UserHeader';
import UserInfoTab from './tab/UserInfoTab';

const schema = yup.object().shape({
	email: yup.string().email('You must enter a valid email').required('You must enter a email'),
	fname: yup.string().required('You must enter a user name').min(2, 'The user name must be at least 2 characters'),
	lname: yup.string().required('Please enter your lastname'),
	phone: yup.string().min(5, 'The phone number must be at least 5 characters'),
	userType: yup.string(),
	password: yup.string().min(3, 'Password is too short - should be 3 chars minimum.')
});

const defaultValues = {
	fname: '',
	lname: '',
	email: '',
	phone: '',
	userRole: '',
	userType: '',
	password: ''
};

function User(props) {
	const { t } = useTranslation('production');
	const dispatch = useDispatch();
	const user = useSelector(({ production }) => production.user);
	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noUser, setNoUser] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { reset, watch, setValue, control, onChange, trigger, formState } = methods;
	const form = watch();

	useEffect(() => {
		setValue('fname', '', { shouldDirty: false, shouldValidate: false });
		setValue('lname', '', { shouldDirty: true, shouldValidate: false });
		setValue('email', '', { shouldDirty: true, shouldValidate: false });
		setValue('phone', '', { shouldDirty: true, shouldValidate: false });
		setValue('userRole', '', { shouldDirty: true, shouldValidate: false });
		setValue('userType', 'user', { shouldDirty: true, shouldValidate: false });
		setValue('password', '', { shouldDirty: true, shouldValidate: false });
	}, [reset, setValue, trigger]);

	useDeepCompareEffect(() => {
		const { userId } = routeParams;
		if (userId === 'new') {
			dispatch(newUser());
		} else {
			dispatch(getUser(routeParams)).then(action => {
				if (!action.payload) {
					setNoUser(true);
				}
			});
		}
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!user) {
			return;
		}
		reset(user);
	}, [user, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetUser());
			setNoUser(false);
		};
	}, [dispatch]);

	if (noUser) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					There is no user!
				</Typography>
			</motion.div>
		);
	}

	if (_.isEmpty(form) || (user && routeParams.userId !== user._id && routeParams.userId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-92 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<UserHeader />}
				contentToolbar={
					<Tabs
						value={tabValue}
						indicatorColor="primary"
						textColor="primary"
						classes={{ root: 'w-full h-64' }}
					>
						<Tab className="h-64" label={t('user_info')} />
					</Tabs>
				}
				content={
					<div className="p-16 sm:p-24 max-w-2xl">
						<UserInfoTab />
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
}

export default withReducer('production', reducer)(User);
