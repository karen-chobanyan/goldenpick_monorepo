import FuseUtils from '@fuse/utils';
import AppContext from 'app/AppContext';
import { Component } from 'react';
import { connect } from 'react-redux';
import { matchRoutes } from 'react-router-config';
import { withRouter } from 'react-router-dom';

class FuseAuthorization extends Component {
	constructor(props, context) {
		super(props);
		const { routes } = context;
		this.state = {
			accessGranted: true,
			routes
		};
	}

	componentDidMount() {
		if (!this.state.accessGranted) {
			this.redirectRoute();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.accessGranted !== this.state.accessGranted;
	}

	componentDidUpdate() {
		if (!this.state.accessGranted) {
			this.redirectRoute();
		}
	}

	static getDerivedStateFromProps(props, state) {
		const { location, userRole, userType } = props;
		const { pathname } = location;
		console.log(userType)
		const matched = matchRoutes(state.routes, pathname)[0];
		return {
			accessGranted: matched ? FuseUtils.hasPermission(matched.route.auth, userType) : true
		};
	}

	redirectRoute() {
		const { location, userRole, history } = this.props;
		const { pathname, state } = location;
		const redirectUrl = state && state.redirectUrl ? state.redirectUrl : '/';

		/*
        User is guest
        Redirect to Login Page
        */
		if (!userRole || userRole.length === 0) {
			history.push({
				pathname: '/login',
				state: { redirectUrl: pathname }
			});
		} else {
			history.push({
				pathname: redirectUrl
			});
		}
	}

	render() {
		return this.state.accessGranted ? <>{this.props.children}</> : null;
	}
}

function mapStateToProps({ auth }) {
	return {
		userRole: auth.user.userRole?.name || auth.user.userRole,
		userType: auth.user.userType
	};
}

FuseAuthorization.contextType = AppContext;

export default withRouter(connect(mapStateToProps)(FuseAuthorization));
