import FusePageCarded from '@fuse/core/FusePageCarded';
import { yupResolver } from '@hookform/resolvers/yup';
import { Tab, Tabs } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { useDeepCompareEffect } from '@fuse/hooks';
import SettingsHeader from './SettingsHeader';
import CurrencyTab from './CurrencyTab';
import ContactsFieldTab from './ContactsFieldTab';
import StatusesTab from './StatusesTab';
import UserRolesTab from '../user-roles/UserRolesTab';
import { getSettings } from './store/SettingsSlice';

const schema = yup.object().shape({
	name: yup
		.string()
		.required('You must enter a category name')
		.min(5, 'The category name must be at least 5 characters')
});

function Settings(props) {
	const { t } = useTranslation('common');
	const [tabValue, setTabValue] = useState(0);
	const dispatch = useDispatch();
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema)
	});

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	useDeepCompareEffect(() => {
		dispatch(getSettings()).then(action => {});
	}, [dispatch]);
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();
	const setts = useSelector(({ settings }) => settings);
	useEffect(() => {
		if (!setts) {
			return;
		}

		reset(setts);
	}, [setts, reset]);

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-92 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<SettingsHeader />}
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
						<Tab className="h-64" label="Currency" />
						<Tab className="h-64" label="Statuses" />
						<Tab className="h-64" label="Contacts" />
						<Tab className="h-64" label="User Roles" />
					</Tabs>
				}
				content={
					<div className="p-16 sm:p-24 max-w-2xl">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<CurrencyTab />
						</div>
						<div className={tabValue !== 1 ? 'hidden' : ''}>
							<StatusesTab />
						</div>
						<div className={tabValue !== 2 ? 'hidden' : ''}>
							<ContactsFieldTab />
						</div>
						<div className={tabValue !== 3 ? 'hidden' : ''}>
							<UserRolesTab />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
}

export default Settings;
