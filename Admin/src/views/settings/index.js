import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol, CFormInput, CFormLabel, CImage,
  CRow,
  CTable, CTableBody,
  CTableCaption, CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from "@coreui/react";
import {
  getBackendAPI,
  OPTION_HEADER_ITEMS,
  OPTION_SHIPPING_CHARGES, OPTION_TAX,
  TBL_POST,
  TBL_REPORTS,
  TBL_USER
} from "../../lib/backend";
import firebase from "firebase/compat";
import default_avatar from "../../assets/images/AvatarPlaceholderProfile.png";
import {date_str_format} from "../../helper";
import {DocsExample} from "../../components";

class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      shipping_charges: 0,
      tax: 0
    }
    this.init();
  }

  init = async () => {
    getBackendAPI().getOptionData(OPTION_SHIPPING_CHARGES).then(shipping_charges => {
      const value = (shipping_charges && shipping_charges.data)?shipping_charges.data:0;
      this.setState({shipping_charges: value});
      console.log('shipping_charges', value);
    })
    getBackendAPI().getOptionData(OPTION_TAX).then(tax => {
      const value = (tax && tax.data)?tax.data:0;
      this.setState({tax: value});
      console.log('tax', value);
    })
  }


  onSave = async () => {
    const {shipping_charges, tax} = this.state;
    getBackendAPI().setOptionData(OPTION_SHIPPING_CHARGES, {data: shipping_charges??0}).then(() => {
      getBackendAPI().setOptionData(OPTION_TAX, {data: tax??0}).then(() => {
        alert('Updating success!');
      });
    });
  }

  render() {
    const {shipping_charges, tax} = this.state;
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Settings</strong> <small></small>
            </CCardHeader>
            <CCardBody>
              <div className="input-row">
                <CFormLabel htmlFor="product-name">Shipping Charges ($)</CFormLabel>
                <CFormInput type="number" id="product-name" value={shipping_charges} onChange={e => {
                  this.setState({shipping_charges: Math.abs(e.target.value)})
                }} name="product-name" placeholder=""/>
              </div>
              <div className="input-row">
                <CFormLabel htmlFor="product-name-kana">TAX (%)</CFormLabel>
                <CFormInput type="number" id="product-name-kana" value={tax} onChange={e => {
                  this.setState({tax: Math.abs(e.target.value)})
                }} name="product-name-kana" placeholder=""/>
              </div>
              <div className="input-row">
                <CButton type="submit" onClick={() => this.onSave()}>Update</CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }
}

export default Settings;
