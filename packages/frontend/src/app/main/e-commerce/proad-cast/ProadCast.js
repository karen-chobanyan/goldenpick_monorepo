import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import reducer from '../store';
import ProadCastHeader from './ProadCastHeader';
import ProadCastContent from './ProadCastContent';

function ProadCast() {
	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-92 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<ProadCastHeader />}
			content={<ProadCastContent />}
			innerScroll
		/>
	);
}

export default withReducer('eCommerceApp', reducer)(ProadCast);
