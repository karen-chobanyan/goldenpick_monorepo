import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import reducer from '../store';
import GemsHeader from './GemsHeader';
import GemsTable from './GemsTable';

function Gems() {
	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-92 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<GemsHeader />}
			content={<GemsTable />}
			innerScroll
		/>
	);
}

export default withReducer('production', reducer)(Gems);
