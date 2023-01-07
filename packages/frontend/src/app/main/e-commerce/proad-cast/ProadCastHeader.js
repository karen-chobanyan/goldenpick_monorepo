import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { useTranslation } from 'react-i18next';
import { setContactsSearchText } from 'app/main/contacts/store/contactsSlice';

function ProadCastHeader(props) {
	const mainTheme = useSelector(selectMainTheme);
	const searchText = useSelector(({ contactsApp }) => contactsApp.contacts.searchText);
	const dispatch = useDispatch();
	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="ml-20 flex items-center">
				<Icon
					component={motion.span}
					initial={{ scale: 0 }}
					animate={{ scale: 1, transition: { delay: 0.2 } }}
					className="text-24 md:text-32"
				>
					settings_remote
				</Icon>
				<Typography
					component={motion.span}
					initial={{ x: -20 }}
					animate={{ x: 0, transition: { delay: 0.2 } }}
					delay={300}
					className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
				>
					Proad Cast
				</Typography>
			</div>
			<div className="flex flex-1 items-center justify-center px-8 sm:px-12">
				<ThemeProvider theme={mainTheme}>
					<Paper
						component={motion.div}
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
						className="flex p-4 items-center w-full max-w-512 h-48 px-16 py-4 shadow"
					>
						<Icon color="action">search</Icon>

						<Input
							placeholder="Search for anything"
							className="flex flex-1 px-16"
							disableUnderline
							fullWidth
							value={searchText}
							inputProps={{
								'aria-label': 'Search'
							}}
							onChange={ev => dispatch(setContactsSearchText(ev))}
						/>
					</Paper>
				</ThemeProvider>
			</div>
		</div>
	);
}

export default ProadCastHeader;
