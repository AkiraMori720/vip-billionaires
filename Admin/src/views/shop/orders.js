import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable, CTableBody,
  CTableCaption, CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CImage, CBadge, CModal, CModalHeader, CModalTitle, CModalBody, CFormLabel, CFormInput, CCardText
} from "@coreui/react";
import DatePicker from 'react-date-picker';

import {
  DB_ACTION_DELETE, DB_ACTION_UPDATE,
  getBackendAPI, MAIL_TYPE_CANCEL_ORDER, MAIL_TYPE_COMPLETE_ORDER, MAIL_TYPE_SHIPPING_ORDER, ORDER_STATUS_CANCEL,
  ORDER_STATUS_COMPLETE,
  ORDER_STATUS_PAID,
  ORDER_STATUS_PENDING, ORDER_STATUS_REFUND,
  ORDER_STATUS_SHIPPING,
  TBL_ORDERS,
  TBL_POST,
  TBL_USER
} from "../../lib/backend";
import default_avatar from "../../assets/images/AvatarPlaceholderProfile.png";
import firebase from "firebase/compat";
import {date_str_format} from "../../helper";
import * as apiCall from "../../lib/apiCall";

class OrderList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      showShippingDlg: false,
      shipping_date: null,
      shipping_order: null
    }
    this.init();
  }

  init = async () => {
    const userSnaps = await firebase.firestore().collection(TBL_USER).get();
    await firebase.firestore().collection(TBL_ORDERS).get().then(snapshot => {
      const users = [];
      userSnaps.forEach(s => users.push(s.data()));

      let data = [];
      snapshot.forEach(doc => {
        let obj = doc.data();
        const owner = users.find(u => u.userId === obj.userId);
        Object.assign(obj, {id: doc.id, owner});
        data.push(obj);
      })

      data.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);

      this.setState({list: data});
      console.log('orders', data);
    })
  }
  onRemove = (id) => {
    const product = {id};
    getBackendAPI().setData(TBL_ORDERS, DB_ACTION_DELETE, product).then(() => {
      this.init();
    }).catch((error) => {
      console.log('error', error);
    })
  }

  confirmShipping = async () => {
    const {shipping_order, shipping_date} = this.state;
    if(!shipping_date){
      alert('Please select delivery date');
      return false;
    }
    try {
      let orderInfo = {
        id: shipping_order.id,
        status: ORDER_STATUS_SHIPPING,
        deliveryDate: shipping_date
      }

      this.sendMail(shipping_order, MAIL_TYPE_SHIPPING_ORDER);
      getBackendAPI().setData(TBL_ORDERS, DB_ACTION_UPDATE, orderInfo).then(() => {
        this.init();
        this.setState({showShippingDlg: false, shipping_date: null, shipping_order: null});
      }).catch((error) => {
        console.log('error', error);
        alert('Publishing product failed');
      })
    } catch (e) {
      console.log('error', e);
      alert('Publishing product failed');
    }
  }

  onShipping = async (order) => {
    this.setState({
      showShippingDlg: true,
      shipping_date: null,
      shipping_order: order
    })
  }

  onComplete = async (order) => {
    let orderInfo = {
      id: order.id,
      status: ORDER_STATUS_COMPLETE
    }

    getBackendAPI().setData(TBL_ORDERS, DB_ACTION_UPDATE, orderInfo).then(() => {
      this.sendMail(order, MAIL_TYPE_COMPLETE_ORDER);
      this.init();
    }).catch((error) => {
      console.log('error', error);
    })
  }

  onRefund = async (order) => {
    if(!order.payment_intent_id){
      return alert('This order can not be refunded');
    }

    const total = order.total + order.shipping_charges;
    const url = `/cancelOrder?payment_intent_id=${order.payment_intent_id}&amount=${total}`;

    apiCall.getCall(url, (refund) => {
      if(refund.status === 'succeeded'){
        let orderInfo = {
          id: order.id,
          status: ORDER_STATUS_REFUND,
          refund_amount: refund.amount
        }

        this.sendMail(order, MAIL_TYPE_CANCEL_ORDER);
        getBackendAPI().setData(TBL_ORDERS, DB_ACTION_UPDATE, orderInfo).then(() => {
          this.init();
        }).catch((error) => {
          console.log('error', error);
        })
      } else {
        console.log('refund error', refund);
        alert('Refund Failed');
      }
    }, (err) => {
      console.log('error', err);
      alert('API Call Failed');
    })
  }

  sendMail = (order, type) => {
    const url = `/sendMail?order_id=${order.id}&type=${type}`;
    apiCall.getCall(url, () => {
      alert('success');
    }, (error) => {
      console.log('error', error);
    });
  }

  renderStatus = (status) => {
    switch (status){
      case ORDER_STATUS_PENDING:
        return <CBadge color="secondary">Pending</CBadge>
      case ORDER_STATUS_PAID:
        return <CBadge color="primary">Paid</CBadge>
      case ORDER_STATUS_SHIPPING:
        return <CBadge color="info">Shipping</CBadge>
      case ORDER_STATUS_COMPLETE:
        return <CBadge color="success">Complete</CBadge>
      case ORDER_STATUS_REFUND:
        return <CBadge color="danger">Refund</CBadge>
      case ORDER_STATUS_CANCEL:
        return <CBadge color="warning">Cancel</CBadge>
    }
    return null;
  }

  render() {
    const {list, showShippingDlg, shipping_order, shipping_date} = this.state;
    return (
      <div className="order-list-page">
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Orders</strong> <small></small>
              </CCardHeader>
              <CCardBody>
                <CTable caption="top">
                  <CTableCaption>List of orders</CTableCaption>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">No</CTableHeaderCell>
                      <CTableHeaderCell scope="col">CreatedAt</CTableHeaderCell>
                      <CTableHeaderCell scope="col">User</CTableHeaderCell>
                      <CTableHeaderCell scope="col">OrderItems</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Product Cost</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Shipping Charges</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Purchased Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Delivery Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col"></CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {
                      list.map((row, index) => (
                        <CTableRow key={row.id}>
                          <CTableHeaderCell scope="row" style={{textTransform: 'uppercase'}}>{row.id}</CTableHeaderCell>
                          <CTableDataCell>{date_str_format(new Date(row.createdAt.seconds * 1000), 'dd/mm/yy')}</CTableDataCell>
                          <CTableDataCell><CImage src={row.owner.avatar?row.owner.avatar:default_avatar} size="md" style={{height: 40, width: 40, borderRadius: 20}}/><span>{row.owner.displayName}</span></CTableDataCell>
                          <CTableDataCell>
                            {
                              row.orderItems.map(i =>
                                <div key={i.id}>
                                  <CImage src={i.image_url} size="md" style={{height: 40, width: 40}}/><span>{i.name} X {i.quantity}</span>
                                  <label>Size: {i.size}, Color: {i.color}</label>
                                </div>
                              )
                            }
                          </CTableDataCell>
                          <CTableDataCell>${row.total}</CTableDataCell>
                          <CTableDataCell>{row.shipping_charges??0}</CTableDataCell>
                          <CTableDataCell>${row.total + (row.shipping_charges??0)}</CTableDataCell>
                          <CTableDataCell className={"text-center"}>{this.renderStatus(row.status)}</CTableDataCell>
                          <CTableDataCell>{row.purchasedAt?date_str_format(new Date(row.purchasedAt.seconds * 1000), 'dd/mm/yy'):''}</CTableDataCell>
                          <CTableDataCell>{row.deliveryDate?date_str_format(new Date(row.deliveryDate.seconds * 1000), 'dd/mm/yy'):''}</CTableDataCell>
                          <CTableDataCell className={"text-right"}>
                            { row.status === ORDER_STATUS_PAID && <CButton color="primary" style={{color: 'white', margin: 4}} onClick={() => this.onShipping(row)}>Shipping</CButton>}
                            { row.status === ORDER_STATUS_SHIPPING && <CButton color="info" style={{color: 'white', margin: 4}} onClick={() => this.onComplete(row)}>Complete</CButton>}
                            { row.status > ORDER_STATUS_PENDING && row.status < ORDER_STATUS_REFUND && <CButton color="warning" style={{color: 'white', margin: 4}} onClick={() => this.onRefund(row)}>Refund</CButton>}
                            <CButton color="danger" style={{color: 'white', margin: 4}} onClick={() => this.onRemove(row.id)}>Remove</CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    }
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CModal
          visible={showShippingDlg}
          centered
          size="xl"
          className="mobile-preview-model"
        >
          <CModalHeader>
            <CModalTitle>Shipping Order</CModalTitle>
          </CModalHeader>
          <CModalBody className="p-0">
            <CCard>
              <CCardBody>
                {
                  shipping_order &&
                  <div className="input-row">
                    <CCardText scope="row" style={{textTransform: 'uppercase'}}><label className={"shipping_label"}>ORDER NO: </label>{shipping_order.id}</CCardText>
                    <CCardText><label className={"shipping_label"}>Created At: </label>{date_str_format(new Date(shipping_order.createdAt.seconds * 1000), 'dd/mm/yy')}</CCardText>
                    <CCardText><CImage src={shipping_order.owner.avatar?shipping_order.owner.avatar:default_avatar} size="md" style={{height: 40, width: 40, borderRadius: 20}}/><span>{shipping_order.owner.displayName}</span></CCardText>
                    <CCardText style={{marginLeft: 12}}>
                      {
                        shipping_order.orderItems.map(i =>
                          <div key={i.id}>
                            <CImage src={i.image_url} size="md" style={{height: 40, width: 40}}/><span>{i.name} X {i.quantity}</span>
                            <CCardText>Size: {i.size}, Color: {i.color}</CCardText>
                          </div>
                        )
                      }
                    </CCardText>
                    <CCardText><label className={"shipping_label"}>Product Cost: </label> ${shipping_order.total}</CCardText>
                    <CCardText><label className={"shipping_label"}>Shipping Charges: </label> {shipping_order.shipping_charges??0}</CCardText>
                    <CCardText><label className={"shipping_label"}>Order Total: </label> ${shipping_order.total + (shipping_order.shipping_charges??0)}</CCardText>
                    <CCardText><label className={"shipping_label"}>Status: </label> {this.renderStatus(shipping_order.status)}</CCardText>
                    <CCardText><label className={"shipping_label"}>Purchased Date: </label> {shipping_order.purchasedAt?date_str_format(new Date(shipping_order.purchasedAt.seconds * 1000), 'dd/mm/yy'):''}</CCardText>
                  </div>
                }
                <div className="input-row">
                  <CFormLabel htmlFor="item-label">Delivery Date</CFormLabel>
                  <DatePicker
                    clearIcon={null}
                    value={shipping_date}
                    minDate={new Date()}
                    className={"cs-date-picker"}
                    onChange={(date) => this.setState({shipping_date: date})}
                  />
                </div>
                <div className="input-row">
                  <CButton type="submit" onClick={() => this.confirmShipping()}>Delivery</CButton>
                </div>
              </CCardBody>
            </CCard>
          </CModalBody>
        </CModal>
      </div>
    );
  }
}

export default OrderList
