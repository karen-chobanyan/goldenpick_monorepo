import reducer from 'app/main/production/store';
import withReducer from 'app/store/withReducer';

function MetalsChildrenWrapper(props) {
	return (
		<div className="flex flex-row flex-1 mt-12">
			<div className="flex-1">{props.childrenMetals}</div>
		</div>
	);
}

export default withReducer('production', reducer)(MetalsChildrenWrapper);
