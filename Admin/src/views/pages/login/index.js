import React from 'react'
import { connect } from "react-redux";
import {
  CButton,
  CCard,
  CCardBody,
  CImage,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { loginUser as loginUserAction } from "../../../store/actions";
import PropTypes from "prop-types";

class Login extends React.Component{
  static propTypes = {
    error: PropTypes.object,
    history: PropTypes.object,
    user: PropTypes.object,
    loginUser: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {error} = this.props;
    if(error && prevProps.error !== error){
      alert("Invalid User!");
    }
  }

  onLogin = () => {
    const { loginUser } = this.props;
    const { email, password } = this.state;
    console.log('email', email, password);
    loginUser({email, password});
  }

  render() {
    return (
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={4} className="text-center">
              <CImage fluid src="/images/logo.png" />
              <CImage fluid src="/images/logo_text.png" className="mt-2" />
            </CCol>
          </CRow>
          <CRow className="justify-content-center mt-4">
            <CCol md={6}>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={(event) => {this.setState({email: event.target.value})}}
                        placeholder="Email"
                        autoComplete="email" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        onChange={(event) => {this.setState({password: event.target.value})}}
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={this.onLogin}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  error: state.Login.error,
  user: state.Login.user
});

const mapDispatchToProps = dispatch => ({
  loginUser: (param1, param2) => dispatch(loginUserAction(param1, param2)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
