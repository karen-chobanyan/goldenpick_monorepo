import ProadCastUplader from 'app/shared-components/ProadCastUplader';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import { Autocomplete } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import { useDeepCompareEffect } from '@fuse/hooks';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useEffect, useMemo, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import ContactsTable from 'app/main/contacts/ContactsTable';
import ContactsMultiSelectMenu from 'app/main/contacts/ContactsMultiSelectMenu';
import {
	getContacts,
	removeContact,
	selectContacts,
	toggleStarredContact
} from 'app/main/contacts/store/contactsSlice';
import { Checkbox, Icon, IconButton } from '@material-ui/core';
import { sendPhoto } from '../store/proadCastSlice';

const defaultValues = {
	avatar: 'assets/images/avatars/profile.jpg'
};

const filterId = [];

function ProadCastContent(props) {
	const dispatch = useDispatch();
	const { t } = useTranslation('common');
	const history = useHistory();
	const contacts = useSelector(selectContacts);
	const [filteredData, setFilteredData] = useState([]);
	const searchText = useSelector(({ contactsApp }) => contactsApp.contacts.searchText);
	const routeParams = useParams();
	const user = useSelector(({ contactsApp }) => contactsApp.user);
	const [excludeds, setExcludeds] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		function getFilteredArray(entities, _searchText) {
			if (_searchText.length === 0) {
				return contacts.filter(id => id.viberId);
			}
			return FuseUtils.filterArrayByString(contacts, _searchText);
		}

		if (contacts) {
			const filteredContacts = filteredData.filter(id => id.viberId);
			console.log(filteredContacts);
			setFilteredData(getFilteredArray(filteredContacts, searchText));
		}
	}, [contacts, searchText]);
	const columns = useMemo(
		() => [
			{
				Header: ({ selectedFlatRows }) => {
					const selectedRowIds = selectedFlatRows.map(row => row.original.id);
					return (
						selectedFlatRows.length > 0 && <ContactsMultiSelectMenu selectedContactIds={selectedRowIds} />
					);
				},
				accessor: 'avatar',
				Cell: ({ row }) => {
					return (
						<Avatar
							className="mx-8"
							alt={row.original.name}
							src={row.original.images?.length && row.original.images[0]?.url}
						/>
					);
				},
				className: 'justify-center',
				width: 64,
				sortable: false
			},
			{
				Header: t('first_name'),
				accessor: 'fname',
				className: 'font-medium',
				sortable: true
			},
			{
				Header: t('LAst_name'),
				accessor: 'lname',
				className: 'font-medium',
				sortable: true
			},
			{
				Header: t('Phone 1'),
				accessor: 'phone',
				sortable: true
			},
			{
				Header: t('Viber'),
				accessor: 'viberId',
				className: 'font-medium',
				sortable: true
			}
		],
		[dispatch, user.starred]
	);

	useDeepCompareEffect(() => {
		dispatch(getContacts(routeParams));
	}, [dispatch, routeParams]);

	const methods = useForm({
		defaultValues: {}
	});

	const { formState, watch, control, getValues, reset } = methods;
	const form = watch();

	function sendViber() {
		setLoading(true);
		dispatch(sendPhoto(getValues())).then(() => setLoading(false));
		reset(defaultValues);
	}

	function handelCheckboxChange(e) {
		const temp = [...excludeds];
		if (e.target.checked) {
			temp.push(e.target.value);
			setExcludeds(temp);
		} else {
			const i = temp.indexOf(e.target.value);
			setExcludeds(temp.splice(i, 1));
		}
		setTimeout(() => {
			console.log(excludeds);
		}, 100);
	}
	if (loading) {
		return <FuseLoading />;
	}
	return (
		<>
			<div className="m-16 flex flex-col w-full">
				<FormProvider {...methods}>
					<ProadCastUplader />{' '}
					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16 w-4/5"
								id="description"
								label="Description"
								type="text"
								multiline
								rows={5}
								variant="outlined"
							/>
						)}
					/>
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
					>
						<Button
							onClick={sendViber}
							className="whitespace-nowrap mr-20"
							variant="contained"
							color="secondary"
						>
							<span className="hidden sm:flex">Send to Viber</span>
						</Button>
					</motion.div>{' '}
				</FormProvider>
			</div>
			<div className="m-16 flex flex-col">
				<ContactsTable columns={columns} data={filteredData} onRowClick={(ev, row) => {}} control={control} />
			</div>
		</>
	);
}
ProadCastContent.propTypes = {
	onRowClick: PropTypes.func
};

export default withRouter(ProadCastContent);
