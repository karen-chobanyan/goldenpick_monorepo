import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import reducer from '../store';
import UsersHeader from './UsersHeader';
import UsersTable from './UsersTable';

function Users() {
	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-92 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<UsersHeader />}
			content={<UsersTable />}
			innerScroll
		/>
	);
}

export default withReducer('production', reducer)(Users);
