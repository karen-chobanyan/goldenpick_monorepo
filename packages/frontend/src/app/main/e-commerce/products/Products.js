import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import reducer from '../store';
import ProductsHeader from './ProductsHeader';
import ProductsTable from './ProductsTable';
import ProductsTableGrid from './ProductsTableGrid';

function Products() {
	const showGrid = useSelector(({ eCommerceApp }) => eCommerceApp.products.showGrid);
	const [grid, setGrid] = useState(showGrid);

	useEffect(() => {
		setGrid(showGrid);
		console.log(showGrid);
	}, [showGrid]);

	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-92 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<ProductsHeader />}
			content={showGrid?.payload ? <ProductsTableGrid /> : <ProductsTable />}
			innerScroll
		/>
	);
}

export default withReducer('eCommerceApp', reducer)(Products);
