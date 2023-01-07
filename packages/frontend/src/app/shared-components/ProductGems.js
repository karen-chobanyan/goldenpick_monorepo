import { useFormContext, Controller } from 'react-hook-form';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGems, selectGems } from 'app/main/production/store/gemsSlice';
import reducer from 'app/main/production/store';
import withReducer from 'app/store/withReducer';

function ProductGems(props) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { control, formState } = methods;
	const [gms, setGems] = useState([{ name: '' }]);
	const gems = useSelector(selectGems);

	useEffect(() => {
		dispatch(getGems()).then(() => {});
	}, [dispatch]);

	useEffect(() => {
		setGems(gems);
	}, [gems]);

	return (
		<div className="flex flex-1 flex-row">
			<Controller
				name={`productGem${props.number}`}
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Autocomplete
						className="mt-8 mb-16 w-2/3 mr-12"
						freeSolo
						options={gms}
						value={value}
						onChange={(event, newValue) => {
							onChange(newValue);
						}}
						getOptionLabel={option => option.name || ''}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="Select Gem"
								label="Gem"
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
				name={`prGemCount${props.number}`}
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 w-1/3"
						label="Count"
						id="count"
						type="number"
						variant="outlined"
					/>
				)}
			/>
		</div>
	);
}

export default withReducer('production', reducer)(ProductGems);
