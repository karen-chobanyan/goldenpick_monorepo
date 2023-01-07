import ClearIcon from '@material-ui/icons/Clear';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import currencies from './Currencies';

const { Button } = require('@material-ui/core');
const { useFormContext, useFieldArray, Controller } = require('react-hook-form');

function countryToFlag(isoCode) {
	return typeof String.fromCodePoint !== 'undefined'
		? isoCode
				.slice(0, -1)
				.toUpperCase()
				.replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
		: isoCode;
}

export default function CurrencyTab(props) {
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const currs = Object.values(currencies);

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'currency'
	});

	return (
		<div className="flex-1 ml-6 p-12">
			<div className="mb-16">
				<h1>Currencies</h1>
				<Button
					variant="outlined"
					color="secondary"
					onClick={() => {
						append({});
					}}
				>
					Add Currency
				</Button>
			</div>
			{fields.map((item, i) => {
				const fieldName = `currency[${i}]`;
				return (
					<div className="flex flex-row" key={item.id}>
						<div className="flex flex-1 flex-row">
							<Controller
								name={`${fieldName}`}
								control={control}
								render={({ field: { onChange, value } }) => (
									<Autocomplete
										className="mt-8 mb-16 w-2/3 mr-12"
										freeSolo
										options={currs}
										value={value}
										onChange={(event, newValue) => {
											onChange(newValue);
										}}
										getOptionLabel={option => option.name || ''}
										renderInput={params => (
											<TextField
												{...params}
												placeholder="Select Metal"
												label="Currency"
												variant="outlined"
												InputLabelProps={{
													shrink: true
												}}
											/>
										)}
										renderOption={option => (
											<>
												<span className="mr-10">{countryToFlag(option.code)}</span>{' '}
												{option.name}
											</>
										)}
									/>
								)}
							/>
						</div>
						<div>
							<Button color="secondary" onClick={() => remove(i)}>
								<ClearIcon />
							</Button>
						</div>
					</div>
				);
			})}
		</div>
	);
}
