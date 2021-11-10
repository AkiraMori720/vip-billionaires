import React from 'react'
import {
  CCard, CCardBody, CCardHeader,
  CCol, CImage, CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from "@coreui/react";
import {DB_ACTION_UPDATE, getBackendAPI, TBL_POST, TBL_USER} from "../../lib/backend";
import firebase from "firebase/compat/app";
import default_avatar from "../../assets/images/AvatarPlaceholderProfile.png";
import {date_str_format} from "../../helper";


class PostList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
    this.init();
  }

  init = async () => {
    const userSnaps = await firebase.firestore().collection(TBL_USER).get();
    await firebase.firestore().collection(TBL_POST).get().then(snapshot => {
      let data = [];

      const users = [];
      userSnaps.forEach(s => users.push(s.data()));

      snapshot.forEach(doc => {
        let obj = doc.data();
        const owner = users.find(u => u.userId === obj.userId);
        Object.assign(obj, {id: doc.id, owner});
        data.push(obj);
      })

      this.setState({list: data});
      console.log('posts', data);
    })
  }

  toggleBlock = (id, block) => {
    const update = {id, block};
    getBackendAPI().setData(TBL_POST, DB_ACTION_UPDATE, update).then(() => {
      this.init();
    })
  }

  render() {
    const {list} = this.state;
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Posts</strong> <small></small>
            </CCardHeader>
            <CCardBody>
              <CTable caption="top">
                <CTableCaption>List of posts</CTableCaption>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">CreatedAt</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Owner</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{textAlign: "center"}}>Type</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{textAlign: "center"}}>Thumbnail</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Text</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Likes</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Comments</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{textAlign: 'center'}}>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {
                    list.map((row, index) => (
                      <CTableRow key={row.id}>
                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                        <CTableDataCell>{date_str_format(new Date(row.date.seconds * 1000), 'dd/mm/yy')}</CTableDataCell>
                        <CTableDataCell><CImage src={row.owner.avatar?row.owner.avatar:default_avatar} size="md" style={{height: 40, width: 40, borderRadius: 20}}/><span>{row.owner.displayName}</span></CTableDataCell>
                        <CTableDataCell style={{textAlign: "center"}}>{row.type}</CTableDataCell>
                        <CTableDataCell style={{textAlign: "center"}}><CImage fluid src={row.photo??row.thumbnail} style={{maxHeight: 200}}/></CTableDataCell>
                        <CTableDataCell>{row.text}</CTableDataCell>
                        <CTableDataCell>{row.likes?.length??0}</CTableDataCell>
                        <CTableDataCell>{row.comments?.length??0}</CTableDataCell>
                        <CTableDataCell style={{textAlign: 'center'}}>
                          {
                            row.block?
                              <button type="button" className="btn btn-outline-danger" onClick={() => this.toggleBlock(row.id, false)}>Unblock</button>
                              :
                              <button type="button" className="btn btn-outline-primary" onClick={() => this.toggleBlock(row.id, true)}>Block</button>
                          }
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
    );
  }
}

export default PostList
