import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { openNewContactDialog } from './store/contactsSlice';

const useStyles = makeStyles(theme => ({
	listItem: {
		color: 'inherit!important',
		textDecoration: 'none!important',
		height: 40,
		width: '100%',
		borderRadius: 6,
		paddingLeft: 12,
		paddingRight: 12,
		marginBottom: 4,
		'&.active': {
			backgroundColor:
				theme.palette.type === 'light' ? 'rgba(0, 0, 0, .05)!important' : 'rgba(255, 255, 255, .1)!important',
			pointerEvents: 'none',
			'& .list-item-icon': {
				color: 'inherit'
			}
		},
		'& .list-item-icon': {
			fontSize: 16,
			width: 16,
			height: 16,
			marginRight: 16
		}
	}
}));

function ContactsSidebarContent(props) {
	const { t } = useTranslation('common');
	const user = useSelector(({ contactsApp }) => contactsApp.user);

	const dispatch = useDispatch();

	const classes = useStyles(props);

	return (
		<div className="p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4">
			<Paper
				component={motion.div}
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
				className="rounded-0 shadow-none lg:rounded-16 lg:shadow"
			>
				<div className="p-24 flex items-center">
					<Avatar alt={user.name} src={user.avatar} />
					<Typography className="mx-12">{user.name}</Typography>
				</div>

				<Divider />

				<div className="p-24">
					<Button
						variant="contained"
						color="secondary"
						className="w-full"
						onClick={ev => dispatch(openNewContactDialog())}
					>
						{t('New_Contact')}
					</Button>
				</div>
			</Paper>
		</div>
	);
}

export default ContactsSidebarContent;
