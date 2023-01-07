import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import ImageUploaderContact from 'app/shared-components/ImageUploaderContact';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useCallback, useEffect } from 'react';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import _ from '@lodash';
import * as yup from 'yup';

import {
	removeContact,
	updateContact,
	addContact,
	closeNewContactDialog,
	closeEditContactDialog
} from './store/contactsSlice';

const useStyles = makeStyles(theme => ({
	uploadedImage: {
		position: 'absolute',
		zIndex: 99999,
		borderRadius: 50
	}
}));

const defaultValues = {
	fname: '',
	lname: '',
	avatar: 'assets/images/avatars/profile.jpg',
	nickname: '',
	company: '',
	jobTitle: '',
	email: '',
	phone: '',
	address: '',
	birthday: '',
	notes: ''
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	name: yup.string().min(2, 'Name must be  2 charactres at last.')
});

function ContactDialog(props) {
	const classes = useStyles(props);
	const { t } = useTranslation('common');
	const dispatch = useDispatch();
	const contactDialog = useSelector(({ contactsApp }) => contactsApp.contacts.contactDialog);
	const settings = localStorage.getItem('settings');
	const fieldControll = JSON.parse(settings)?.contacts;
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema)
	});
	const { formState, watch, getValues, control, reset, handleSubmit } = methods;
	// const { control, reset, handleSubmit } = useForm();

	const { isValid, dirtyFields, errors } = formState;

	const _id = watch('_id');
	const name = watch('name');
	const avatar = watch('avatar');

	/**
	 * Initialize Dialog with Data
	 */
	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (contactDialog.type === 'edit' && contactDialog.data) {
			reset({ ...contactDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (contactDialog.type === 'new') {
			reset({
				...defaultValues,
				...contactDialog.data
				// _id: FuseUtils.generateGUID()
			});
		}
	}, [contactDialog.data, contactDialog.type, reset]);

	/**
	 * On Dialog Open
	 */
	useEffect(() => {
		if (contactDialog.props.open) {
			initDialog();
		}
	}, [contactDialog.props.open, initDialog]);

	/**
	 * Close Dialog
	 */
	function closeComposeDialog() {
		return contactDialog.type === 'edit' ? dispatch(closeEditContactDialog()) : dispatch(closeNewContactDialog());
	}

	/**
	 * Form Submit
	 */
	function onSubmit(data) {
		if (contactDialog.type === 'new') {
			dispatch(addContact(data));
		} else {
			dispatch(updateContact({ ...contactDialog.data, ...data }));
		}
		closeComposeDialog();
	}

	/**
	 * Remove Event
	 */
	function handleRemove() {
		dispatch(removeContact(_id));
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24'
			}}
			{...contactDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<FormProvider {...methods}>
				<AppBar position="static" elevation={0}>
					<Toolbar className="flex w-full">
						<Typography variant="subtitle1" color="inherit">
							{contactDialog.type === 'new' ? t('New_Contact') : t('Edit_Contact')}
						</Typography>
					</Toolbar>
					<div className="flex flex-col items-center justify-center pb-24">
						<div className={classes.uploadedImage}>
							<ImageUploaderContact />
						</div>
						<Avatar className="w-96 h-96 position-relative" alt="contact avatar" src={avatar} />
						{contactDialog.type === 'edit' && (
							<Typography variant="h6" color="inherit" className="pt-8">
								{name}
							</Typography>
						)}
					</div>
				</AppBar>
				<form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
					<DialogContent classes={{ root: 'p-24' }}>
						{fieldControll?.fname?.feature ? (
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">account_circle</Icon>
								</div>
								<Controller
									control={control}
									name="fname"
									rules={{
										required:
											fieldControll.fname.required && !fieldControll.fname.feature
												? 'First name is required'
												: ''
									}}
									render={({ field: { onChange, value }, fieldState: { error } }) => (
										<TextField
											className="mb-24"
											label={t('name')}
											_id="fname"
											variant="outlined"
											fullWidth
											value={value}
											error={!!error}
											helperText={error ? error.message : null}
											onChange={onChange}
										/>
									)}
								/>
							</div>
						) : (
							''
						)}

						{fieldControll?.lname?.feature ? (
							<div className="flex">
								<div className="min-w-48 pt-20" />

								<Controller
									control={control}
									name="lname"
									render={({ field }) => (
										<TextField
											{...field}
											className="mb-24"
											label={t('LAst_name')}
											_id="lname"
											variant="outlined"
											fullWidth
										/>
									)}
								/>
							</div>
						) : (
							''
						)}
						{fieldControll?.nickname?.feature ? (
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">star</Icon>
								</div>
								<Controller
									control={control}
									name="nickname"
									render={({ field }) => (
										<TextField
											{...field}
											className="mb-24"
											label={t('Nickname')}
											_id="nickname"
											variant="outlined"
											fullWidth
										/>
									)}
								/>
							</div>
						) : (
							''
						)}
						{fieldControll?.phone?.feature ? (
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">phone</Icon>
								</div>
								<Controller
									control={control}
									name="phone"
									render={({ field }) => (
										<TextField
											{...field}
											className="mb-24"
											label={t('Phone 1')}
											_id="phone"
											variant="outlined"
											fullWidth
										/>
									)}
								/>
							</div>
						) : (
							''
						)}
						{fieldControll?.phone2?.feature ? (
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">phone</Icon>
								</div>
								<Controller
									control={control}
									name="phone2"
									render={({ field }) => (
										<TextField
											{...field}
											className="mb-24"
											label={t('Phone 2')}
											_id="phone2"
											variant="outlined"
											fullWidth
										/>
									)}
								/>
							</div>
						) : (
							''
						)}
						{fieldControll?.phone3?.feature ? (
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">phone</Icon>
								</div>
								<Controller
									control={control}
									name="phone3"
									render={({ field }) => (
										<TextField
											{...field}
											className="mb-24"
											label={t('Phone 3')}
											_id="phone3"
											variant="outlined"
											fullWidth
										/>
									)}
								/>
							</div>
						) : (
							''
						)}
						{fieldControll?.viber?.feature ? (
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">phone_iphone</Icon>
								</div>
								<Controller
									control={control}
									name="viberId"
									render={({ field }) => (
										<TextField
											{...field}
											className="mb-24"
											label={t('Viber_ID')}
											_id="viber"
											variant="outlined"
											fullWidth
										/>
									)}
								/>
							</div>
						) : (
							''
						)}
						{fieldControll?.email?.feature ? (
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">email</Icon>
								</div>
								<Controller
									control={control}
									name="email"
									render={({ field }) => (
										<TextField
											{...field}
											className="mb-24"
											label={t('Email')}
											_id="email"
											variant="outlined"
											fullWidth
										/>
									)}
								/>
							</div>
						) : (
							''
						)}
						{fieldControll?.company?.feature ? (
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">domain</Icon>
								</div>
								<Controller
									control={control}
									name="company"
									render={({ field }) => (
										<TextField
											{...field}
											className="mb-24"
											label={t('Company')}
											_id="company"
											variant="outlined"
											fullWidth
										/>
									)}
								/>
							</div>
						) : (
							''
						)}
						{fieldControll?.jobTitle?.feature ? (
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">work</Icon>
								</div>
								<Controller
									control={control}
									name="jobTitle"
									render={({ field }) => (
										<TextField
											{...field}
											className="mb-24"
											label={t('jobTitle')}
											_id="jobTitle"
											name="jobTitle"
											variant="outlined"
											fullWidth
										/>
									)}
								/>
							</div>
						) : (
							''
						)}
						{fieldControll?.address?.feature ? (
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">home</Icon>
								</div>
								<Controller
									control={control}
									name="address"
									render={({ field }) => (
										<TextField
											{...field}
											className="mb-24"
											label={t('Address')}
											_id="address"
											variant="outlined"
											fullWidth
										/>
									)}
								/>
							</div>
						) : (
							''
						)}
						{fieldControll?.notes?.feature ? (
							<div className="flex">
								<div className="min-w-48 pt-20">
									<Icon color="action">note</Icon>
								</div>
								<Controller
									control={control}
									name="notes"
									render={({ field }) => (
										<TextField
											{...field}
											className="mb-24"
											label={t('Notes')}
											_id="notes"
											variant="outlined"
											multiline
											rows={5}
											fullWidth
										/>
									)}
								/>
							</div>
						) : (
							''
						)}
					</DialogContent>

					{contactDialog.type === 'new' ? (
						<DialogActions className="justify-between p-4 pb-16">
							<div className="px-16">
								<Button
									variant="contained"
									color="secondary"
									type="submit"
									disabled={_.isEmpty(dirtyFields)}
								>
									{t('add')}
								</Button>
							</div>
						</DialogActions>
					) : (
						<DialogActions className="justify-between p-4 pb-16">
							<div className="px-16">
								<Button
									variant="contained"
									color="secondary"
									type="submit"
									disabled={_.isEmpty(dirtyFields)}
								>
									{t('save')}
								</Button>
							</div>
							<IconButton onClick={handleRemove}>
								<Icon>delete</Icon>
							</IconButton>
						</DialogActions>
					)}
				</form>
			</FormProvider>
		</Dialog>
	);
}

export default ContactDialog;
