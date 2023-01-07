import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useFormContext, Controller } from 'react-hook-form';
import contactFields from './ContactFields';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: 410,
		backgroundColor: theme.palette.background.paper
	},
	paper: {
		width: '80%',
		maxHeight: 485
	}
}));

export default function ContactsFieldTab() {
	const methods = useFormContext();
	const { control } = methods;
	const classes = useStyles();
	const fields = Object.values(contactFields);

	return (
		<div className={classes.root}>
			<List component="div" role="list">
				<ListItem button divider disabled role="listitem">
					<ListItemText primary="Contacts Fields Control" />
				</ListItem>
				{fields.map((fld, index) => {
					const { fieldName } = fld;
					return (
						<ListItem key={index}>
							<ListItemText primary={fld.name + ':'} />
							<Controller
								name={`contacts[${fieldName}].required`}
								control={control}
								render={({ field }) => (
									<FormControlLabel
										control={<Checkbox {...field} checked={field.value ? !!field.value : false} />}
										label="Required"
									/>
								)}
							/>
							<Controller
								name={`contacts[${fieldName}].feature`}
								control={control}
								render={({ field }) => (
									<FormControlLabel
										control={<Checkbox {...field} checked={field.value ? !!field.value : false} />}
										label="Feature"
									/>
								)}
							/>
						</ListItem>
					);
				})}
			</List>
		</div>
	);
}
