import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import reducer from '../store';
import MetalsHeader from './MetalsHeader';
import MetalsTable from './MetalsTable';

function Metals() {
	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-92 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<MetalsHeader />}
			content={<MetalsTable />}
			innerScroll
		/>
	);
}

export default withReducer('production', reducer)(Metals);
