import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { Controller, useFormContext } from 'react-hook-form';

function PricingTab(props) {
	const methods = useFormContext();
	const { control } = methods;

	return (
		<div>
			<Controller
				name="price1"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						label="Price for 1 gram in USD"
						id="price1"
						InputProps={{
							startAdornment: <InputAdornment position="start">$/g</InputAdornment>
						}}
						type="number"
						variant="outlined"
						autoFocus
						fullWidth
					/>
				)}
			/>

			<Controller
				name="price2"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						label="Price for 1 gram in AMD"
						id="price2"
						InputProps={{
							startAdornment: <InputAdornment position="start">֏/g</InputAdornment>
						}}
						type="number"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
		</div>
	);
}

export default PricingTab;
