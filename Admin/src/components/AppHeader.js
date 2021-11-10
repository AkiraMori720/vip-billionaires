import React from 'react'
import {useSelector, useDispatch, connect} from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler, CImage
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {  cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { logoutUser as logoutUserAction, setSidebar as setSlideShowAction } from '../store/actions';
import PropTypes from "prop-types";

class AppHeader extends React.Component{
  static propTypes = {
    sidebarShow: PropTypes.bool,
    history: PropTypes.object,
    user: PropTypes.object,
    logoutUser: PropTypes.func,
    setSlideShow: PropTypes.func
  }

  constructor(props) {
    super(props);
  }

  render() {
    const {sidebarShow, logoutUser, setSlideShow, user} = this.props;
    return (
      <CHeader position="sticky" className="mb-4">
        <CContainer fluid>
          <CHeaderToggler
            className="ps-1"
            onClick={() => setSlideShow(!sidebarShow )}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <CHeaderBrand className="mx-auto d-md-none" to="/">
            <CImage fluid src="/images/logo.png" width={64} alt="Logo" />
          </CHeaderBrand>
          <CHeaderNav className="ms-3">
            <AppHeaderDropdown logout={logoutUser} user={user}/>
          </CHeaderNav>
        </CContainer>
        <CHeaderDivider />
        <CContainer fluid>
          <AppBreadcrumb />
        </CContainer>
      </CHeader>
    );
  }

}

const mapStateToProps = state => ({
  sidebarShow: state.Layout.sidebarShow,
  user: state.Login.user
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUserAction()),
  setSlideShow: (param) => dispatch(setSlideShowAction(param))
});

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader)
