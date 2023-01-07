import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { setDefaults, useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { memo, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import { getMetalPrice } from '../store/widgetsSlice';

const useStyles = makeStyles(theme => ({
	gold: {
		flexGrow: 1,
		marginBottom: 15
	},
	silver: {
		flexGrow: 1,
		marginBottom: 15
	},
	paper: {
		padding: theme.spacing(2),
		margin: 'auto',
		maxWidth: 500,
		height: 120,
		marginTop: 12,
		marginBottom: 1,
	},
	image: {
		width: 128,
		height: 85
	},
	img: {
		margin: 'auto',
		marginTop: 0,
		display: 'block',
		maxWidth: '100%',
		maxHeight: '100%'
	}
}));

function Widget10(props) {
	const { t } = useTranslation('common');
	const classes = useStyles();
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(true);
	const [goldData, setGoldData] = useState([]);
	const [silverData, setSilverData] = useState([]);
	const [platinumData, setPlatinumData] = useState([]);

	useEffect(() => {
		dispatch(getMetalPrice()).then(action => {
			setGoldData(action.payload[0]);
			setSilverData(action.payload[1]);
			setPlatinumData(action.payload[2]);
		});
	}, [dispatch]);

	const metalItem = [
		{
			iD: '2',
			metalName: 'Silver',
			metalPrice: silverData?.price,
			metalImg: 'assets/images/metals/silver.png'
		},
		{
			iD: '1',
			metalName: 'Gold',
			metalPrice: goldData?.price,
			metalImg: 'assets/images/metals/golds.png'
		},
		{
			iD: '3',
			metalName: 'Platinum',
			metalPrice: platinumData?.price,
			metalImg: 'assets/images/metals/platinum.jpeg'
		}
	];

	return (
		<Paper className="w-full rounded-20 shadow overflow-hidden">
			<div className="flex self-center items-center justify-between h-64">
				<Typography className="text-16 mx-20 font-medium">{t('Metal_Prices')}</Typography>
			</div>
			<div className="table-responsive">
				{metalItem.map(metals => {
					return (
						<Paper key={metals.iD} className={classes.paper}>
							<div className="flex items-center justify-between px-4 pt-8">
								<ButtonBase className={classes.image} >
									<img className={classes.img} alt="complex" src={metals.metalImg} />
								</ButtonBase >
								<Typography className="text-16 px-15 font-medium" color="textSecondary">
									{metals.metalName}
								</Typography>
								<Typography className="text-16 px-15 font-medium" color="textSecondary">
									$ {metals.metalPrice}
								</Typography>
							</div>
						</Paper>
					);
				})}
			</div>
		</Paper>
	);
}

export default memo(Widget10);
