import { forwardRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import _ from '@lodash';
import { useTranslation } from 'react-i18next';
import { saveGem, removeGem } from '../store/gemSlice';

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function GemHeader(props) {
	const { t } = useTranslation('production');
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;
	const images = watch('images', []);
	const featuredImageId = watch('featuredImageId');
	const name = watch('name');
	const theme = useTheme();
	const history = useHistory();
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	function handleSaveGem() {
		dispatch(saveGem(getValues())).then(() => {
			history.push('/gems');
		});
	}

	function handleRemoveGem() {
		dispatch(removeGem()).then(() => {
			history.push('/gems');
		});
	}

	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="flex flex-col items-start max-w-full min-w-0">
				<motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}>
					<Typography
						className="flex items-center sm:mb-12"
						component={Link}
						role="button"
						to="/gems"
						color="inherit"
					>
						<Icon className="text-20">{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}</Icon>
						<span className="hidden sm:flex mx-4 font-medium">{t('gems_title')}</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					<motion.div
						className="hidden sm:flex"
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					>
						{images.length > 0 && featuredImageId ? (
							<img
								className="w-32 sm:w-48 rounded"
								src={_.find(images, { id: featuredImageId }).url}
								alt={name}
							/>
						) : (
							<img
								className="w-32 sm:w-48 rounded"
								src="assets/images/ecommerce/product-image-placeholder.png"
								alt={name}
							/>
						)}
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{name || t('gems_title')}
							</Typography>
							<Typography variant="caption" className="font-medium">
								{t('Gem_Detail')}
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
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					onClick={handleClickOpen}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					{t('remove')}
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveGem}
				>
					{t('save')}
				</Button>
			</motion.div>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle id="alert-dialog-slide-title">Remove gem?</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						Let Google help apps determine location. This means sending anonymous location data to Google,
						even when no apps are running.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleRemoveGem} color="primary">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default GemHeader;
