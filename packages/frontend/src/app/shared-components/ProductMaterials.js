import { useFormContext, Controller } from 'react-hook-form';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMetals, selectMetals } from 'app/main/production/store/metalsSlice';

function ProductMaterials(props) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { control, formState } = methods;
	const [mets, setMetals] = useState([{ name: '' }]);

	const metals = useSelector(selectMetals);

	useEffect(() => {
		dispatch(getMetals()).then(() => {});
	}, [dispatch]);

	useEffect(() => {
		setMetals(metals);
	}, [metals]);

	return (
		<div className="flex flex-1 flex-row">
			<Controller
				name={`productMetal${props.number}`}
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Autocomplete
						className="mt-8 mb-16 w-2/3 mr-12"
						freeSolo
						options={mets}
						value={value}
						onChange={(event, newValue) => {
							onChange(newValue);
						}}
						getOptionLabel={option => option.name}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="Select Metal"
								label="Metal"
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
				name={`prMetalWeight${props.number}`}
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 w-1/3"
						label="Weight"
						id="price1"
						type="number"
						variant="outlined"
					/>
				)}
			/>
		</div>
	);
}

export default ProductMaterials;
