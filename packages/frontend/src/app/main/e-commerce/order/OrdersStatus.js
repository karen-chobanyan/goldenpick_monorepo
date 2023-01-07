import _ from '@lodash';
import clsx from 'clsx';

function OrdersStatus(props) {
	const orderStatuses = JSON.parse(localStorage.getItem('settings'))?.statuses;
	return (
		<div
			className={clsx(
				'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
				props.status.color?.color || props.status?.color
			)}
		>
			{props.status.name || props.status.text}
		</div>
	);
}

export default OrdersStatus;
