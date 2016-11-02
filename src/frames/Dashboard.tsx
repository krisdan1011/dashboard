import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import { logout } from "../actions/session";
import { getSources } from "../actions/source";
import Content from "../components/Content";
import Header from "../components/Header";
import Layout from "../components/Layout";
import UserControl from "../components/UserControl";
import { CLASSES } from "../constants";
import User from "../models/user";
import { State } from "../reducers";

interface DashboardProps {
  user: User;
  login: () => void;
  logout: () => (dispatch: Redux.Dispatch<any>) => void;
  getSources: () => Redux.ThunkAction<any, any, any>;
}

function mapStateToProps(state: State.All) {
  return {
    user: state.session.user
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    login: function () {
      dispatch(push("/login"));
    },
    logout: function () {
      return dispatch(logout());
    },
    getSources: function () {
      return dispatch(getSources());
    }
  };
}

class Dashboard extends React.Component<DashboardProps, any> {

  drawerClasses() {
    return classNames(CLASSES.TEXT.BLUE_GREY_50, CLASSES.COLOR.BLUE_GREY_900);
  }

  headerClasses() {
    return classNames(CLASSES.COLOR.GREY_100, CLASSES.TEXT.GREY_600);
  }

  componentWillMount() {
    this.props.getSources();
  }

  render() {
    return (
      <Layout header={true}>
        <Header className={this.headerClasses()} >
          <UserControl
            login={this.props.login}
            logout={this.props.logout}
            user={this.props.user} />
        </Header>
        <Content>
          {this.props.children}
        </Content>
      </Layout>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);