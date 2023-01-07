import TextField from '@material-ui/core/TextField';
import { Autocomplete } from '@material-ui/lab';
import { useFormContext, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { getMetals, selectMetals } from 'app/main/production/store/metalsSlice';
import ClearIcon from '@material-ui/icons/Clear';
import { getGems, selectGems } from 'app/main/production/store/gemsSlice';
import { useTranslation } from 'react-i18next';
import { getCategories, selectCategories } from '../../store/categoriesSlice';

function BasicInfoTab() {
	const { t } = useTranslation('common');
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const { errors } = formState;
	const [cats, setCats] = useState([{ name: '' }]);
	const [gemsCount, setGemsCount] = useState(0);
	const categories = useSelector(selectCategories);
	const metals = useSelector(selectMetals);
	const dispatch = useDispatch();
	const [mets, setMetals] = useState([{ name: '' }]);
	const [gms, setGems] = useState([{ name: '' }]);
	const gems = useSelector(selectGems);

	const mettalArray = useFieldArray({
		control,
		name: 'productMetals'
	});

	const gemArray = useFieldArray({
		control,
		name: 'productGems'
	});

	useEffect(() => {
		setCats(categories);
	}, [categories]);

	useEffect(() => {
		dispatch(getCategories()).then();
		dispatch(getMetals()).then(() => {});
		dispatch(getGems()).then(() => {});
	}, [dispatch]);

	useEffect(() => {
		setMetals(metals);
	}, [metals]);

	useEffect(() => {
		setGems(gems);
	}, [gems]);

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
			<div className="flex flex-row">
				<Controller
					name="categories"
					control={control}
					defaultValue={[]}
					render={({ field: { onChange, value } }) => (
						<Autocomplete
							className="mt-8 mb-16 w-1/2 pr-6"
							multiple
							freeSolo
							options={cats}
							value={value}
							onChange={(event, newValue) => {
								onChange(newValue);
							}}
							getOptionLabel={option => option.name}
							renderInput={params => (
								<TextField
									{...params}
									placeholder="Select multiple categories"
									label="Categories"
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
					name="size"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 ml-6"
							error={!!errors.name}
							helperText={errors?.name?.size}
							label="Size"
							autoFocus
							id="size"
							type="number"
							variant="outlined"
						/>
					)}
				/>
			</div>
			<div className="flex flex-row flex-1 full-width">
				<div className="border-2 flex-1 border-light-blue-400 rounded mr-6 p-12">
					<div className="mb-24">
						<h1>{t('Metals_Used')}</h1>
						<Button variant="outlined" color="secondary" onClick={() => mettalArray.append({})}>
							{t('add_metal')}
						</Button>
					</div>
					{mettalArray.fields.map(({ id, weight, metal }, index) => {
						const fieldName = `productMetals[${index}]`;
						return (
							<div key={id} className="flex flex-1 flex-row">
								<Controller
									name={`${fieldName}.metal`}
									control={control}
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
										mettalArray.remove(index);
									}}
								>
									<ClearIcon />
								</Button>
							</div>
						);
					})}
				</div>
				<div className="border-2 flex-1 border-light-blue-400 rounded mr-6 p-12">
					<div className="mb-24">
						<h1>{t('Gems_Used')}</h1>
						<Button
							variant="outlined"
							color="secondary"
							onClick={() => {
								gemArray.append({});
							}}
						>
							{t('add_gem')}
						</Button>
					</div>
					{gemArray.fields.map(({ id, weight, metal }, index) => {
						const fieldName = `productGems[${index}]`;
						return (
							<div className="flex flex-1 flex-row" key={id}>
								<Controller
									name={`${fieldName}.gem`}
									control={control}
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
									name={`${fieldName}.count`}
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
								<Button
									color="secondary"
									onClick={() => {
										gemArray.remove(index);
									}}
								>
									<ClearIcon />
								</Button>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default BasicInfoTab;
