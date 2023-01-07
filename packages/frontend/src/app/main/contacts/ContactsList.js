import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContactsMultiSelectMenu from './ContactsMultiSelectMenu';
import ContactsTable from './ContactsTable';
import { openEditContactDialog, removeContact, toggleStarredContact, selectContacts } from './store/contactsSlice';

function ContactsList(props) {
	const dispatch = useDispatch();
	const contacts = useSelector(selectContacts);
	const searchText = useSelector(({ contactsApp }) => contactsApp.contacts.searchText);
	const user = useSelector(({ contactsApp }) => contactsApp.user);
	const [filteredData, setFilteredData] = useState(null);

	const { t } = useTranslation('common');
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
					console.log(row);
					return (
						<Avatar
							className="mx-8"
							alt={row.original.name}
							src={row.original.images && row.original.images[0]?.url}
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
			// {
			// 	Header: t('Company'),
			// 	accessor: 'company',
			// 	sortable: true
			// },
			// {
			// 	Header: t('jobTitle'),
			// 	accessor: 'jobTitle',
			// 	sortable: true
			// },
			{
				Header: t('Email'),
				accessor: 'email',
				className: 'max-w-0 overflow-hidden',
				sortable: true
			},
			{
				Header: t('Phone 1'),
				accessor: 'phone',
				sortable: true
			},
			{
				Header: t('Phone 2'),
				accessor: 'phone2',
				sortable: true
			},
			{
				Header: t('Phone 3'),
				accessor: 'phone3',
				sortable: true
			},
			{
				id: 'action',
				width: 128,
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						<IconButton
							onClick={ev => {
								ev.stopPropagation();
								dispatch(toggleStarredContact(row.original.id));
							}}
						>
							{user.starred && user.starred.includes(row.original.id) ? (
								<Icon className="text-yellow-700">star</Icon>
							) : (
								<Icon>star_border</Icon>
							)}
						</IconButton>
						<IconButton
							onClick={ev => {
								ev.stopPropagation();
								dispatch(removeContact(row.original.id));
							}}
						>
							<Icon>delete</Icon>
						</IconButton>
					</div>
				)
			}
		],
		[dispatch, user.starred]
	);

	console.log(columns);

	useEffect(() => {
		function getFilteredArray(entities, _searchText) {
			if (_searchText.length === 0) {
				return contacts;
			}
			return FuseUtils.filterArrayByString(contacts, _searchText);
		}

		if (contacts) {
			setFilteredData(getFilteredArray(contacts, searchText));
		}
	}, [contacts, searchText]);

	if (!filteredData) {
		return null;
	}

	if (filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					{t('no_contact')}
				</Typography>
			</div>
		);
	}

	return (
		<motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}>
			<ContactsTable
				columns={columns}
				data={filteredData}
				control={null}
				onRowClick={(ev, row) => {
					if (row) {
						dispatch(openEditContactDialog(row.original));
					}
				}}
			/>
		</motion.div>
	);
}

export default ContactsList;
