import React from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CContainer, CLink,
  CRow,
} from '@coreui/react';
import "firebase/compat/auth";
import firebase from "firebase/compat/app";
import queryString from 'query-string';
import PropTypes from "prop-types";

class VerifyEmail extends React.Component{
  static propTypes = {
    location: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      verified: false,
      expired: false
    }
    this.init();
  }

  init = () => {
    if(!this.props.location || !this.props.location.search){
      return;
    }
    // verifyEmail?mode=verifyEmail&oobCode=fqRiWS2QjF8W9rRGLTG-jsPgMRVSZ5h0gp5hG775ICMAAAF8eke7Rg&apiKey=AIzaSyDOsK1hSk9A3-7_Npl2Yca2bxdjXkDThu4&lang=en
    let params = queryString.parse(this.props.location.search);
    const actionCode = params.oobCode??'';

    firebase.auth().applyActionCode(actionCode).then((resp) => {
      this.setState({loading: false, verified: true});
    }).catch((err) => {
      console.log('err', err);
      this.setState({loading: false, expired: true});
    })
  }


  render() {
    const {loading, verified, expired} = this.state;
    return (
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center mt-4">
            <CCol md={6}>
              <CCard className="p-4">
                <CCardBody>
                  {loading && <h1>Verifying...</h1>}
                  {
                    !loading && verified &&
                      <>
                        <h1>Verify Email</h1>
                        <h3 className="text-medium-emphasis">Your email was verified</h3>
                        <CLink href={"vipbillionaires://"}>Continue</CLink>
                      </>
                  }
                  {
                    !loading && expired &&
                    <>
                      <h2>Verify Email</h2>
                      <h3>This link was expired</h3>
                    </>
                  }
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }
}

export default VerifyEmail;
