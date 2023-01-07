import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setMetalsSearchText } from '../store/metalsSlice';

function MetalsHeader(props) {
	const dispatch = useDispatch();
	const { t } = useTranslation('production');
	const searchText = useSelector(({ production }) => production.metals.searchText);
	const mainTheme = useSelector(selectMainTheme);

	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="ml-20 flex items-center">
				<Icon
					component={motion.span}
					initial={{ scale: 0 }}
					animate={{ scale: 1, transition: { delay: 0.2 } }}
					className="text-24 md:text-32"
				>
					layers
				</Icon>
				<Typography
					component={motion.span}
					initial={{ x: -20 }}
					animate={{ x: 0, transition: { delay: 0.2 } }}
					delay={300}
					className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
				>
					{t('category_title')}
				</Typography>
			</div>

			<div className="flex flex-1 items-center justify-center px-12">
				<ThemeProvider theme={mainTheme}>
					<Paper
						component={motion.div}
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
						className="flex items-center w-full max-w-512 px-8 py-4 rounded-16 shadow"
					>
						<Icon color="action">search</Icon>

						<Input
							placeholder="Search"
							className="flex flex-1 mx-8"
							disableUnderline
							fullWidth
							value={searchText}
							inputProps={{
								'aria-label': 'Search'
							}}
							onChange={ev => dispatch(setMetalsSearchText(ev))}
						/>
					</Paper>
				</ThemeProvider>
			</div>
			<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}>
				<Button
					component={Link}
					to="/metals/new"
					className="whitespace-nowrap mr-20"
					variant="contained"
					color="secondary"
				>
					<span className="hidden sm:flex">{t('Add_New_Category')}</span>
					<span className="flex sm:hidden">New</span>
				</Button>
			</motion.div>
		</div>
	);
}

export default MetalsHeader;
