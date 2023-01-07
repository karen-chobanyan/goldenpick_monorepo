import { InputLabel, NativeSelect } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { Autocomplete } from '@material-ui/lab';
import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from '@material-ui/core/Select';
import { getCategories, selectCategories } from '../../store/categoriesSlice';

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	}
}));
function BasicInfoTab(props) {
	const methods = useFormContext();
	const { control, formState } = methods;

	const { errors } = formState;
	const parentConfig = ['aaaaaaa', 'bbbbbbb'];
	const dispatch = useDispatch();
	const categories = useSelector(selectCategories);
	const [options, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const classes = useStyles();

	useEffect(() => {
		dispatch(getCategories()).then(() => setLoading(false));
	}, [dispatch]);

	useEffect(() => {
		setData(categories);
	}, [categories]);

	const getOpObj = option => {
		if (!option._id) option = options.find(op => op._id === option);
		return option;
	};
	return (
		<div>
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.name}
						required
						helperText={errors?.name?.message}
						label="Name"
						autoFocus
						id="name"
						variant="outlined"
					/>
				)}
			/>
			<Controller
				name="parent"
				control={control}
				variant="outlined"
				className={classes.formControl}
				render={({ field }) => (
					<>
						<InputLabel htmlFor="outlined-age-native-simple">Paren Category</InputLabel>
						<Select {...field} id="parent" native label="Parent">
							<option aria-label="None" value="" />
							{options.map(o => (
								<option key={o._id} aria-label="None" value={o._id}>
									{o.name}
								</option>
							))}
						</Select>
					</>
				)}
			/>
		</div>
	);
}

export default BasicInfoTab;
