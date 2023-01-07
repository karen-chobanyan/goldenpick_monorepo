import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { Autocomplete } from '@material-ui/lab';
import { useFormContext, Controller } from 'react-hook-form';

function BasicInfoTab(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

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
						fullWidth
					/>
				)}
			/>

			<Controller
				name="description"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						id="description"
						label="Description"
						type="text"
						multiline
						rows={5}
						variant="outlined"
						fullWidth
					/>
				)}
			/>
		</div>
	);
}

export default BasicInfoTab;
