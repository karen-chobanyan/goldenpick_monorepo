import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';
import { getProjects, selectProjects } from './store/projectsSlice';
import { selectWidgets } from './store/widgetsSlice';

const useStyles = makeStyles(theme => ({
	selectedProject: {
		background: lighten(theme.palette.primary.dark, 0.1),
		color: theme.palette.primary.contrastText,
		borderRadius: '16px 0 0 0'
	},
	projectMenuButton: {
		background: lighten(theme.palette.primary.dark, 0.1),
		color: theme.palette.primary.contrastText,
		borderRadius: '0 16px 0 0',
		marginLeft: 1
	}
}));

function ProjectDashboardAppHeader(props) {
	const { pageLayout } = props;
	const classes = useStyles(props);
	const { t } = useTranslation('common');
	const dispatch = useDispatch();
	const widgets = useSelector(selectWidgets);
	const projects = useSelector(selectProjects);
	const user = useSelector(({ auth }) => auth.user);

	const [selectedProject, setSelectedProject] = useState({
		id: 1,
		menuEl: null
	});

	useEffect(() => {
		dispatch(getProjects());
	}, [dispatch]);

	function handleChangeProject(id) {
		setSelectedProject({
			id,
			menuEl: null
		});
	}

	function handleOpenProjectMenu(event) {
		setSelectedProject({
			id: selectedProject.id,
			menuEl: event.currentTarget
		});
	}

	function handleCloseProjectMenu() {
		setSelectedProject({
			id: selectedProject.id,
			menuEl: null
		});
	}

	if (_.isEmpty(projects)) {
		return null;
	}

	return (
		<div className="flex flex-col justify-between flex-1 min-w-0 px-24 pt-24">
			<div className="flex justify-between items-center">
				<div className="flex items-center min-w-0">
					{user.photoURL ? (
						<Avatar className="w-52 h-52 sm:w-64 sm:h-64" alt="user photo" src={user.photoURL} />
					) : (
						<Avatar className="w-52 h-52 sm:w-64 sm:h-64">{user.fname[0]}</Avatar>
					)}
					<div className="mx-12 min-w-0">
						<Typography className="text-18 sm:text-24 md:text-32 font-bold leading-none mb-8 tracking-tight">
							{t('Welcome')}, {user.fname}!
						</Typography>

						<div className="flex items-center opacity-60 truncate">
							<Icon className="text-14 sm:text-24">notifications</Icon>
							<Typography className="text-12 sm:text-14 font-medium mx-4 truncate">
								{t('you_have_mess')}
							</Typography>
						</div>
					</div>
				</div>
				<Hidden lgUp>
					<IconButton
						onClick={ev => pageLayout.current.toggleRightSidebar()}
						aria-label="open left sidebar"
						color="inherit"
					>
						<Icon>menu</Icon>
					</IconButton>
				</Hidden>
			</div>
		</div>
	);
}

export default ProjectDashboardAppHeader;
