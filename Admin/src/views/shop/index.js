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
  DB_ACTION_ADD,
  DB_ACTION_DELETE,
  DB_ACTION_UPDATE,
  getBackendAPI,
  TBL_PRODUCTS
} from "../../lib/backend";
import ImageUpload from 'image-upload-react';
import CIcon from "@coreui/icons-react";
import {cilX} from "@coreui/icons";
import default_avatar from "../../assets/images/AvatarPlaceholderProfile.png";

class ProductList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showAdding: false,
      list: [],
      product_id: null,
      image_url: null,
      imageFile: null,
      product_name: '',
      product_name_kana: '',
      price: 0,
      caption: '',
      sizes: [],
      size: '',
      colors: [],
      color: '',
      colorImageSrc: null,
      colorImageFile: null,
    }
    this.init();
  }

  init = async () => {
    getBackendAPI().getData(TBL_PRODUCTS).then(products => {
      this.setState({list: products});
      console.log('products', products);
    })
  }

  onAddProduct = () => {
    this.setState({showAdding: true});
  }

  handleImageSelect = (e) => {
    this.setState({image_url: URL.createObjectURL(e.target.files[0]), imageFile: e.target.files[0]});
  }

  handleColorImageSelect = (e) => {
    this.setState({colorImageSrc: URL.createObjectURL(e.target.files[0]), colorImageFile: e.target.files[0]});
  }

  onAddSize = () => {
    const {sizes} = this.state;
    this.setState({sizes: [...sizes, this.state.size], size: ''});
  }

  removeSize = (value) => {
    this.setState({sizes: this.state.sizes.filter(s => s !== value)});
  }

  removeColor = (id) => {
    this.setState({colors: this.state.colors.filter(s => s.id !== id)});
  }

  onAddColor = () => {
    const {colors} = this.state;
    const newColor = {
      id: this.state.color,
      text: this.state.color,
      image_url: this.state.colorImageSrc,
      image_file: this.state.colorImageFile
    }
    this.setState({colors: [...colors, newColor], color: '', colorImageSrc: null, colorImageFile: null});
  }

  onRemove = (id) => {
    const product = {id};
    getBackendAPI().setData(TBL_PRODUCTS, DB_ACTION_DELETE, product).then(() => {
      this.init();
    }).catch((error) => {
      console.log('error', error);
    })
  }

  onEdit = (product) => {
    this.setState({
      showAdding: true,
      product_id: product.id,
      product_name: product.name,
      caption: product.caption,
      product_name_kana: product.name_kana,
      price: product.price,
      image_url: product.image_url,
      sizes: product.sizes,
      colors: product.colors
    });
  }

  onSave = async () => {
    const {product_id, image_url, imageFile, product_name, product_name_kana, price, caption, sizes, colors} = this.state;

    if(!imageFile && !image_url){
      return alert('Please select product image');
    }
    if(!product_name.trim().length){
      return alert('Please input product name');
    }
    if(!product_name_kana.trim().length){
      return alert('Please input product name kana');
    }
    if(!price){
      return alert('Please input product price');
    }

    try {
      const product_image_url = imageFile?await getBackendAPI().uploadMedia(ASSET_TYPE_PRODUCT, imageFile):image_url;

      let targetColors = [];
      for(let i = 0; i<colors.length; i++){
        const color_image_url = colors[i].image_file?await getBackendAPI().uploadMedia(ASSET_TYPE_PRODUCT, colors[i].image_file):colors[i].image_url;
        targetColors.push({
          id: colors[i].id,
          text: colors[i].text,
          image_url: color_image_url
        });
      }

      let product = {
        name: product_name,
        name_kana: product_name_kana,
        price: price,
        caption: caption,
        image_url: product_image_url,
        sizes,
        colors: targetColors
      }
      if(this.state.product_id){
        product['id'] = this.state.product_id;
      }

      getBackendAPI().setData(TBL_PRODUCTS, product_id?DB_ACTION_UPDATE:DB_ACTION_ADD, product).then(() => {
        this.init();
        this.setState({showAdding: false, product_id: null, product_name: '', product_name_kana: '', price: 0, caption: '', sizes: [], colors: [], image_url: null, imageFile: null, colorImageSrc: null, colorImageFile: null});
      }).catch((error) => {
        console.log('error', error);
        alert('Publishing product failed');
      })
    } catch (e) {
      console.log('error', e);
      alert('Publishing product failed');
    }
  }

  render() {
    const {list, showAdding, image_url, product_name, product_name_kana, price, caption, sizes, size, colors, color, colorImageSrc} = this.state;
    return (
      <div className="product-list-page">
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Products</strong> <small></small>
              </CCardHeader>
              <CCardBody>
                <CRow className="my-3">
                  <CCol xs className="text-right">
                    <CButton color="primary" onClick={() => this.onAddProduct()}>+ Add</CButton>
                  </CCol>
                </CRow>
                <CTable caption="top">
                  <CTableCaption>List of products</CTableCaption>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Name (Kana)</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Caption</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Sizes</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Colors</CTableHeaderCell>
                      <CTableHeaderCell scope="col"></CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {
                      list.map((row, index) => (
                        <CTableRow key={row.id}>
                          <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                          <CTableDataCell><CImage src={row.image_url?row.image_url:default_avatar} size="md" style={{height: 60, width: 60}}/><span className="p-2">{row.name}</span></CTableDataCell>
                          <CTableDataCell>{row.name_kana}</CTableDataCell>
                          <CTableDataCell>${row.price}</CTableDataCell>
                          <CTableDataCell>{row.caption}</CTableDataCell>
                          <CTableDataCell>{row.sizes.join(',')}</CTableDataCell>
                          <CTableDataCell>{row.colors.map(c => c.text).join(',')}</CTableDataCell>
                          <CTableDataCell><CButton color="primary" style={{color: 'white', margin: 4}} onClick={() => this.onEdit(row)}>Edit</CButton><CButton color="danger" style={{color: 'white', margin: 4}} onClick={() => this.onRemove(row.id)}>Remove</CButton></CTableDataCell>
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
            <CModalTitle>Add Product</CModalTitle>
          </CModalHeader>
          <CModalBody className="p-0">
            <CCard>
              <CCardBody>
                <div className="input-row">
                  <CFormLabel className="product-image-label" htmlFor="product-image">Product Image</CFormLabel>
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
                  <CFormLabel htmlFor="product-name">Product Name</CFormLabel>
                  <CFormInput id="product-name" value={product_name} onChange={e => {
                    this.setState({product_name: e.target.value})
                  }} name="product-name" placeholder=""/>
                </div>
                <div className="input-row">
                  <CFormLabel htmlFor="product-name-kana">Product Name (Kana)</CFormLabel>
                  <CFormInput id="product-name-kana" value={product_name_kana} onChange={e => {
                    this.setState({product_name_kana: e.target.value})
                  }} name="product-name-kana" placeholder=""/>
                </div>
                <div className="input-row">
                  <CFormLabel htmlFor="product-price">Price ($)</CFormLabel>
                  <CFormInput id="product-price" type={"number"} value={price} onChange={e => {
                    this.setState({price: e.target.value})
                  }} name="product-price" placeholder=""/>
                </div>
                <div className="input-row">
                  <CFormLabel htmlFor="product-description">Product Description</CFormLabel>
                  <CFormInput id="product-description" value={caption} onChange={e => {
                    this.setState({caption: e.target.value})
                  }} name="caption" placeholder=""/>
                </div>
                <div className="input-row">
                  <CFormLabel htmlFor="size">Sizes</CFormLabel>
                  <CFormInput id="size" value = {size} onChange={e => { this.setState({size: e.target.value}) }}  name="size" placeholder="" />
                  <div className="text-right mt-2">
                    <CButton color="primary" onClick={() => this.onAddSize()} disabled={size.trim().length < 1}>+ Add</CButton>
                  </div>
                  <div className="flex-row">
                    {
                      sizes.map((s, index) => <div className="size-container" key={index}>
                        <text key={index} className="size-text">{s}</text>
                        <CIcon icon={cilX} customClassName={"close-icon"} onClick={() => this.removeSize(s)}/>
                      </div>)
                    }
                  </div>
                </div>
                <div className="input-row">
                  <CFormLabel htmlFor="email-address">Colors</CFormLabel>
                  <ImageUpload
                    handleImageSelect={this.handleColorImageSelect}
                    imageSrc={colorImageSrc}
                    setImageSrc={(value) => {
                      this.setState({colorImageSrc: value})
                    }}
                    style={{
                      width: 120,
                      height: 120,
                      background: '#f2f2f2',
                      marginTop: '0.5rem'
                    }}
                  />
                  <CFormInput id="color" value = {color} className={"mt-2"} onChange={e => { this.setState({ color: e.target.value}) }} name="color" placeholder="" />
                  <div className="text-right mt-2">
                      <CButton color="primary" onClick={() => this.onAddColor()} disabled={color.trim().length < 1 || !colorImageSrc}>+ Add</CButton>
                  </div>
                  <div className="flex-row">
                    {
                      colors.map((s, index) => <div className="color-container" key={index}>
                        <CImage src={s.image_url} className={"color-image"}/>
                        <text key={index} className="color-text">{s.text}</text>
                        <CIcon icon={cilX} customClassName={"close-icon"} onClick={() => this.removeColor(s.id)}/>
                      </div>)
                    }
                  </div>
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

export default ProductList
