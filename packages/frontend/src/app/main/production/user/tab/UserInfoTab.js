import TextField from '@material-ui/core/TextField';
import { useDeepCompareEffect } from '@fuse/hooks';
import { useFormContext, Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import { InputLabel, NativeSelect } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { useDispatch, useSelector } from 'react-redux';
import { getRoles, selectRoles } from 'app/main/user-roles/store/rolesSlice';

function BasicInfoTab(props) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;
	const [showPassword, setShowPassword] = useState(false);
	const roles = useSelector(selectRoles);
	const [rls, setRls] = useState([]);
	const [selectedOpt, setSelectedOpt] = useState([]);

	useEffect(() => {
		dispatch(getRoles()).then();
	}, [dispatch]);

	useEffect(() => {
		setRls(roles);
	}, [roles]);

	useDeepCompareEffect(() => {
		setSelectedOpt(roles);
	}, [roles]);

	return (
		<div>
			<Controller
				name="fname"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.fname}
						required
						helperText={errors?.fname?.message}
						label="Name"
						autoFocus
						id="fname"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<Controller
				name="lname"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.lname}
						helperText={errors?.lname?.message}
						label="Lastname"
						id="lname"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-16"
						type="text"
						error={!!errors.email}
						helperText={errors?.email?.message}
						label="Email"
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>
			<Controller
				name="phone"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-16"
						type="number"
						error={!!errors.phone}
						helperText={errors?.phone?.message}
						label="Phone number"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<Controller
				name="userRole"
				control={control}
				render={({ field: { onChange, value } }) => (
					<Autocomplete
						value={value}
						onChange={(event, newValue) => {
							onChange(newValue);
						}}
						variant="outlined"
						className="mt-8 mb-16"
						fullWidth
						id="parent"
						native
						label="Role"
						options={selectedOpt}
						getOptionLabel={option => (option ? option?.name : '')}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="User role"
								fullWidth
								variant="outlined"
								InputLabelProps={{
									shrink: true
								}}
							/>
						)}
					/>
				)}
			/>
			<Controller
				name="userType"
				control={control}
				defaultValue="user"
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 hidden"
						// error={!!errors.userType}
						required
						// helperText={errors?.userType?.message}
						label="User type"
						autoFocus
						id="userType"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-16"
						label="Password"
						type="password"
						error={!!errors.password}
						helperText={errors?.password?.message}
						variant="outlined"
						InputProps={{
							className: 'pr-2',
							type: showPassword ? 'text' : 'password',
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={() => setShowPassword(!showPassword)}>
										<Icon className="text-20" color="action">
											{showPassword ? 'visibility' : 'visibility_off'}
										</Icon>
									</IconButton>
								</InputAdornment>
							)
						}}
						fullWidth
						required
					/>
				)}
			/>
		</div>
	);
}

export default BasicInfoTab;
