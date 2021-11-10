import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol, CModal, CModalBody,
  CRow,
  CTable, CTableBody,
  CTableCaption, CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
  CFormLabel, CModalHeader, CModalTitle, CImage
} from "@coreui/react";
import {
  ASSET_TYPE_PRODUCT,
  getBackendAPI, OPTION_HEADER_ITEMS, TBL_OPTIONS,
} from "../../lib/backend";
import ImageUpload from 'image-upload-react';
import random from "../../lib/random";

class HeaderItems extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showAdding: false,
      list: [],
      item_id: null,
      image_url: null,
      imageFile: null,
      order: 0,
      label: '',
    }
    this.init();
  }

  init = async () => {
    getBackendAPI().getOptionData(OPTION_HEADER_ITEMS).then(headerItems => {
      const items = headerItems.data?headerItems.data.sort((a, b) => a.order - b.order):[];
      this.setState({list: items});
      console.log('headerItems', items);
    })
  }

  onAddItem = () => {
    this.setState({showAdding: true});
  }

  handleImageSelect = (e) => {
    this.setState({image_url: URL.createObjectURL(e.target.files[0]), imageFile: e.target.files[0]});
  }

  onRemove = (id) => {
    const newList = this.state.list.filter(i => i.id !== id);
    getBackendAPI().setOptionData(OPTION_HEADER_ITEMS, {data: newList}).then(() => {
      this.init();
    }).catch((error) => {
      console.log('error', error);
    })
  }

  onEdit = (item) => {
    this.setState({
      showAdding: true,
      item_id: item.id,
      label: item.label,
      image_url: item.image_url,
      order: item.order
    });
  }

  onSave = async () => {
    const {item_id, image_url, imageFile, label, order, list} = this.state;

    if(!imageFile && !image_url){
      return alert('Please select item image');
    }
    if(!label.trim().length){
      return alert('Please input item label');
    }

    try {
      const item_image_url = imageFile?await getBackendAPI().uploadMedia(ASSET_TYPE_PRODUCT, imageFile):image_url;

      const item = {
        label: label,
        image_url: item_image_url,
        order: order
      }
      let newList = [];
      if(this.state.item_id){
        newList = list.map(i => {
          if (i.id === item_id){
            return {
              ...i,
              ...item
            }
          }
          return i;
        })
      } else {
        newList = list;
        newList.push({
          id: random(13),
          ...item
        })
      }

      getBackendAPI().setOptionData(OPTION_HEADER_ITEMS, {data: newList}).then(() => {
        this.init();
        this.setState({showAdding: false, item_id: null, label: '', order: 0, image_url: null, imageFile: null});
      }).catch((error) => {
        console.log('error', error);
        alert('Saving item was failed');
      })
    } catch (e) {
      console.log('error', e);
      alert('Saving item was failed');
    }
  }

  render() {
    const {list, showAdding, image_url, label, order} = this.state;
    return (
      <div className="item-list-page">
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Header Items</strong> <small></small>
              </CCardHeader>
              <CCardBody>
                <CRow className="my-3">
                  <CCol xs className="text-right">
                    <CButton color="primary" onClick={() => this.onAddItem()}>+ Add</CButton>
                  </CCol>
                </CRow>
                <CTable caption="top">
                  <CTableCaption>List of items</CTableCaption>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Label</CTableHeaderCell>
                      <CTableHeaderCell scope="col"></CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {
                      list.map((row, index) => (
                        <CTableRow key={row.id}>
                          <CTableHeaderCell scope="row">{row.order}</CTableHeaderCell>
                          <CTableDataCell><CImage src={row.image_url} size="md" style={{height: 120, width: 120}}/></CTableDataCell>
                          <CTableDataCell>{row.label}</CTableDataCell>
                          <CTableDataCell><CButton color="primary" style={{color: 'white'}} onClick={() => this.onEdit(row)}>Edit</CButton><CButton color="danger" style={{color: 'white', marginLeft: 4}} onClick={() => this.onRemove(row.id)}>Remove</CButton></CTableDataCell>
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
          visible={showAdding}
          centered
          size="xl"
          className="mobile-preview-model"
        >
          <CModalHeader>
            <CModalTitle>Add Item</CModalTitle>
          </CModalHeader>
          <CModalBody className="p-0">
            <CCard>
              <CCardBody>
                <div className="input-row">
                  <CFormLabel className="item-image-label" htmlFor="item-image">Item Image</CFormLabel>
                  <ImageUpload
                    handleImageSelect={this.handleImageSelect}
                    imageSrc={image_url}
                    setImageSrc={(value) => {
                      this.setState({image_url: value})
                    }}
                    style={{
                      width: 200,
                      height: 200,
                      background: '#f2f2f2',
                      marginTop: '0.5rem'
                    }}
                  />
                </div>
                <div className="input-row">
                  <CFormLabel htmlFor="item-label">Label</CFormLabel>
                  <CFormInput id="item-label" type={"string"} value={label} onChange={e => {
                    this.setState({label: e.target.value})
                  }} name="item-label" placeholder=""/>
                </div>
                <div className="input-row">
                  <CFormLabel htmlFor="item-order">order</CFormLabel>
                  <CFormInput id="item-order" type={"number"} value={order} onChange={e => {
                    this.setState({order: e.target.value})
                  }} name="item-order" placeholder=""/>
                </div>
                <div className="input-row">
                  <CButton type="submit" onClick={() => this.onSave()}>Save</CButton>
                </div>
              </CCardBody>
            </CCard>
          </CModalBody>
        </CModal>
      </div>
    );
  }
}

export default HeaderItems
