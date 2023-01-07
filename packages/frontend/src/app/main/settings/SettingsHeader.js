import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import _ from '@lodash';
import { saveSettings } from './store/SettingsSlice';

function SettingsHeader(props) {
	const { t } = useTranslation('common');
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;
	const featuredImageId = watch('featuredImageId');
	const name = watch('name');
	const theme = useTheme();
	const history = useHistory();

	function handleSaveSettings() {
		dispatch(saveSettings(getValues())).then(() => {
			history.push('/settings');
		});
	}

	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="flex flex-col items-start max-w-full min-w-0">
				<div className="flex items-center max-w-full">
					<motion.div
						className="hidden sm:flex"
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					>
						<Icon
							component={motion.span}
							initial={{ scale: 0 }}
							animate={{ scale: 1, transition: { delay: 0.2 } }}
							className="text-24 md:text-32"
						>
							settings
						</Icon>
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{t('General_Settings')}
							</Typography>
							<Typography variant="caption" className="font-medium">
								{t('User_Settings')}
							</Typography>
						</motion.div>
					</div>
				</div>
			</div>
			<motion.div
				className="flex"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
			>
				<Button
					className="whitespace-nowrap mx-4 mr-20"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields)}
					onClick={handleSaveSettings}
				>
					{t('save')}
				</Button>
			</motion.div>
		</div>
	);
}

export default SettingsHeader;
