import { useState } from 'react';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { Button, Checkbox, FormControlLabel } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import clsx from 'clsx';
import { arrayMoveImmutable } from 'array-move';
import { Container, Draggable } from 'react-smooth-dnd';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

export default function StatusesTab() {
	const methods = useFormContext();
	const { control } = methods;
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'statuses'
	});
	const [statusText, setStatusText] = useState('Status Text');
	const [statusColor, setStatusColor] = useState('');
	const [sortedList, setSortedList] = useState([...fields]);

	const statusTextChange = e => {
		setStatusText(e.target.value);
	};

	const onColorChange = c => {
		setStatusColor(c?.color);
	};

	const onDrop = ({ removedIndex, addedIndex }) => {
		setSortedList(list => arrayMoveImmutable(sortedList, removedIndex, addedIndex));
	};

	return (
		<div className="flex-1 ml-6 p-12">
			<div className="mb-16">
				<h1>Order statuses</h1>
				<Button
					variant="outlined"
					color="secondary"
					onClick={() => {
						append({});
					}}
				>
					Add new status
				</Button>
			</div>
			<Container onDrop={onDrop}>
				{fields.map((item, i) => {
					const fieldName = `statuses[${i}]`;
					return (
						<Draggable key={item.id}>
							<div className="flex flex-row" key={item.id}>
								<DragHandleIcon className="mt-16" />
								<div className="flex flex-1 flex-row space-x-14" noValidate autoComplete="off">
									<Controller
										name={`${fieldName}.text`}
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												className="mt-8 mb-16 w-1/4"
												label="Status text"
												variant="outlined"
												fullWidth
												placeholder="Write text"
												InputLabelProps={{
													shrink: true
												}}
											/>
										)}
									/>
									<Controller
										name={`${fieldName}.color`}
										control={control}
										render={({ field: { onChange, value } }) => (
											<Autocomplete
												className="mt-8 mb-16 w-1/4"
												freeSolo
												options={labels}
												value={value}
												getOptionLabel={option => option.name}
												renderOption={option => (
													<>
														<div
															className={clsx(
																'text-12 font-semibold py-4 px-12 rounded-full truncate w-full text-center',
																option?.color
															)}
														>
															{item?.text ? item.text : 'Sample Status'}
														</div>
													</>
												)}
												renderInput={params => (
													<TextField
														{...params}
														label="Status color"
														placeholder="Select Color"
														variant="outlined"
														InputLabelProps={{
															shrink: true
														}}
													/>
												)}
												onChange={(event, newValue) => {
													onColorChange(newValue);
													onChange(newValue);
												}}
											/>
										)}
									/>
									<Controller
										name={`${fieldName}.notification`}
										control={control}
										render={({ field }) => (
											<FormControlLabel
												control={
													<Checkbox
														{...field}
														checked={field.value ? !!field.value : false}
													/>
												}
												label="Notify customer"
											/>
										)}
									/>
									<div className="md:p-16 text-center w-1/4">
										<div
											className={clsx(
												'text-12 font-semibold py-8 px-12 rounded-full truncate text-center',
												item?.color?.color || statusColor
											)}
										>
											{item?.text ? item.text : 'Sample Status'}
										</div>
									</div>
								</div>
								<div className="md:p-16">
									<Button
										color="secondary"
										onClick={() => {
											remove(i);
										}}
									>
										<ClearIcon />
									</Button>
								</div>
							</div>
						</Draggable>
					);
				})}
			</Container>
		</div>
	);
}

const labels = [
	{
		id: 1,
		name: 'Blue',
		color: 'bg-blue text-white'
	},
	{
		id: 2,
		name: 'Green',
		color: 'bg-green text-white'
	},
	{
		id: 3,
		name: 'Orange',
		color: 'bg-orange text-black'
	},
	{
		id: 4,
		name: 'Purple',
		color: 'bg-purple text-white'
	},
	{
		id: 5,
		name: 'Green 700',
		color: 'bg-green-700 text-white'
	},
	{
		id: 6,
		name: 'Pink',
		color: 'bg-pink text-white'
	},
	{
		id: 7,
		name: 'Red',
		color: 'bg-red text-white'
	},
	{
		id: 8,
		name: 'Red 700',
		color: 'bg-red-700 text-white'
	},
	{
		id: 9,
		name: 'Purple 300',
		color: 'bg-purple-300 text-white'
	},
	{
		id: 10,
		name: 'Blue',
		color: 'bg-blue text-white'
	},
	{
		id: 11,
		name: 'Blue 700',
		color: 'bg-blue-700 text-white'
	},
	{
		id: 12,
		name: 'Green 800',
		color: 'bg-green-800 text-white'
	},
	{
		id: 13,
		name: 'Purple 700',
		color: 'bg-purple-700 text-white'
	},
	{
		id: 14,
		name: 'Blue 800',
		color: 'bg-blue-800 text-white'
	}
];
