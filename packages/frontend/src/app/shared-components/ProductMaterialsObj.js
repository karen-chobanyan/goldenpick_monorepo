import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import { useEffect, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMetals, selectMetals } from 'app/main/production/store/metalsSlice';
import { Button } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

function ProductMaterialsObj(props, ref) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const [mets, setMetals] = useState([{ name: '' }]);

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'productMetals'
	});

	const metals = useSelector(selectMetals);

	useEffect(() => {
		dispatch(getMetals()).then(() => {});
	}, [dispatch]);

	useEffect(() => {
		setMetals(metals);
	}, [metals]);

	console.log(watch());

	useImperativeHandle(ref, () => ({
		add() {
			append();
		}
	}));

	return (
		<div className="flex flex-row flex-1 mt-12">
			<div className="flex-1">
				{fields.map((f, index) => {
					const fieldName = `productMetals[${index}]`;
					return (
						<fieldset control={control} name={fieldName} key={fieldName} className="flex flex-1 flex-row">
							<Controller
								name={`${fieldName}.metal`}
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
										getOptionLabel={option => option.name || ''}
										renderInput={params => (
											<TextField
												{...params}
												placeholder="Select Metal"
												label={`Metal ${index + 1}`}
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
								name={`${fieldName}.wight`}
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
							<Button
								color="secondary"
								onClick={() => {
									remove(index);
								}}
							>
								<ClearIcon />
							</Button>
						</fieldset>
					);
				})}
			</div>
		</div>
	);
}

export default ProductMaterialsObj;
