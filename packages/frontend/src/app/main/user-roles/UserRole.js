import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useCallback, useEffect, forwardRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';
import * as yup from 'yup';
import navigationConfig from 'app/fuse-configs/navigationConfig';
import { Checkbox, DialogContentText, DialogContent, DialogTitle, Slide } from '@material-ui/core';

import withReducer from 'app/store/withReducer';
import { saveRole, closeNewRoleDialog, closeEditRoleDialog, updateRole, removeRole } from './store/rolesSlice';
import reducer from './store';

const schema = yup.object().shape({
	name: yup.string().required()
});

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function UserRole() {
	const { t } = useTranslation('common');
	const dispatch = useDispatch();
	const roleDialog = useSelector(({ userRoles }) => {
		return userRoles.roles.roleDialog;
	});
	const settings = JSON.parse(localStorage.getItem('settings'));

	const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const _id = watch('_id');
	const name = watch('name');
	const [open, setOpen] = useState(false);

	function onSubmit(data) {
		if (roleDialog.type === 'new') {
			dispatch(saveRole(data));
		} else {
			dispatch(updateRole({ ...roleDialog.data, ...data }));
		}
		closeComposeDialog();
	}

	const initDialog = useCallback(() => {
		if (roleDialog?.type === 'edit' && roleDialog?.data) {
			reset({ ...roleDialog.data });
		}

		if (roleDialog?.type === 'new') {
			reset({
				...roleDialog.data
			});
		}
	}, [roleDialog?.data, roleDialog?.type, reset]);

	useEffect(() => {
		if (roleDialog?.props?.open) {
			initDialog();
		}
	}, [roleDialog?.props?.open, initDialog]);

	function closeComposeDialog() {
		return roleDialog?.type === 'edit' ? dispatch(closeEditRoleDialog()) : dispatch(closeNewRoleDialog());
	}

	function handleRemove() {
		dispatch(removeRole(_id));
		closeComposeDialog();
	}

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Dialog
			classes={{
				paper: 'm-24'
			}}
			{...roleDialog?.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={0}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{roleDialog?.type === 'new' ? t('New_Role') : t('Edit_Role')}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden p-24">
				<div classes={{ root: 'p-24' }}>
					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">account_circle</Icon>
						</div>
						<Controller
							control={control}
							name="name"
							render={({ field: { onChange, value }, fieldState: { error } }) => (
								<TextField
									className="mb-24"
									label={t('role name')}
									variant="outlined"
									fullWidth
									required
									value={value}
									error={!!error}
									helperText={error ? error.message : null}
									onChange={onChange}
								/>
							)}
						/>
					</div>
					<div className="">
						<div className="min-w-48 pt-8">
							<Typography variant="subtitle1" className="p-0">
								Pages
							</Typography>
						</div>

						<div className="p-0">
							{navigationConfig.map(page => (
								<Controller
									key={page.url}
									className="inline-block min-w-150 w-1/4"
									control={control}
									name={'pages.' + page.url.replace('/', '')}
									render={({ field: { onChange, value }, fieldState: { error } }) => (
										<label className="inline-block">
											<Checkbox
												onChange={onChange}
												checked={value}
												onClick={event => event.stopPropagation()}
											/>
											{page.title}
										</label>
									)}
								/>
							))}
						</div>
					</div>
					<div className="">
						<div className="min-w-48 pt-8">
							<Typography variant="subtitle1" className="p-0">
								Order Statuses
							</Typography>
						</div>
						<div>
							{settings?.statuses.map(status => (
								<Controller
									key={status.text}
									className="inline-block min-w-150 w-1/4"
									control={control}
									name={'statuses.' + status.text}
									render={({ field: { onChange, value }, fieldState: { error } }) => (
										<label className="inline-block">
											<Checkbox
												onChange={onChange}
												checked={value}
												onClick={event => event.stopPropagation()}
											/>
											{status.text}
										</label>
									)}
								/>
							))}
						</div>
					</div>
				</div>
				<DialogActions className="justify-between p-4 pb-16">
					<div className="px-16">
						<Button
							variant="contained"
							color="secondary"
							type="submit"
							disabled={_.isEmpty(dirtyFields) || !isValid}
						>
							{t('save')}
						</Button>
					</div>
					<IconButton onClick={handleClickOpen}>
						<Icon>delete</Icon>
					</IconButton>
				</DialogActions>
			</form>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle id="alert-dialog-slide-title">Remove Role?</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						Are you sure you want to delete this role?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleRemove}>Delete</Button>
				</DialogActions>
			</Dialog>
		</Dialog>
	);
}
export default withReducer('userRoles', reducer)(UserRole);
