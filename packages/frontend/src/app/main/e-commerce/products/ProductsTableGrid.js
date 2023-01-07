import _ from '@lodash';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import { getProducts, selectProducts } from '../store/productsSlice';

const useStyles = makeStyles(theme => ({
	container: {
		display: 'grid',
		gridTemplateColumns: 'repeat(12, 1fr)',
		gridGap: theme.spacing(3)
	},
	paper: {
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary,
		whiteSpace: 'nowrap',
		marginBottom: theme.spacing(1),
		cursor: 'pointer'
	},
	divider: {
		margin: theme.spacing(2, 0)
	},
	itemImg: {
		width: 100,
		height: 100,
		overflow: 'hidden',
		margin: 'auto'
	}
}));

function ProductsTableGrid(props) {
	const [cookies, setCookie] = useCookies(['sorted']);
	const { t } = useTranslation('common');
	const classes = useStyles();
	const dispatch = useDispatch();
	const products = useSelector(selectProducts);
	const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.products.searchText);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(products);
	const [page, setPage] = useState(0);
	const [order, setOrder] = useState(cookies);

	function productDetails(item) {
		props.history.push(`/products/${item._id}`);
	}

	useEffect(() => {
		dispatch(getProducts()).then(() => setLoading(false));
	}, [dispatch]);

	useEffect(() => {
		if (searchText.length !== 0) {
			setData(_.filter(products, item => item.name.toLowerCase().includes(searchText.toLowerCase())));
			setPage(0);
		} else {
			setData(products);
		}
	}, [products, searchText]);

	if (loading) {
		return <FuseLoading />;
	}

	if (data.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					{t('no_products')}
				</Typography>
			</motion.div>
		);
	}

	return (
		<div className="w-full flex flex-col p-20">
			<Grid container spacing={3}>
				{_.orderBy(
					data,
					[
						o => {
							switch (order.sortId) {
								case 'name': {
									return o.name;
								}
								case 'price1': {
									return o.price1;
								}
								case 'price2': {
									return o.price2;
								}
								default: {
									return o[order.id];
								}
							}
						}
					],
					[order.sortDirection]
				).map(n => {
					const isSelected = selected.indexOf(n._id) !== -1;
					return (
						<Grid key={n._id} item xs={2}>
							<Paper className={classes.paper}>
								<div onClick={event => productDetails(n)}>
									<div className={classes.itemImg}>
										<img
											className="w-full h-full"
											src={n.images?.length && n.images[0].url}
											alt="product orig"
										/>
									</div>
									<div className="text-center text-xl">{n.name}</div>
									<div>
										<h2 className="text-15">{n.price1}$</h2>
										<h2 className="text-15">{n.price2}֏</h2>
									</div>
								</div>
							</Paper>
						</Grid>
					);
				})}
			</Grid>
		</div>
	);
}

export default withRouter(ProductsTableGrid);
