import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol, CImage,
  CRow,
  CTable, CTableBody,
  CTableCaption, CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from "@coreui/react";
import {getBackendAPI, TBL_POST, TBL_REPORTS, TBL_USER} from "../../lib/backend";
import firebase from "firebase/compat";
import default_avatar from "../../assets/images/AvatarPlaceholderProfile.png";
import {date_str_format} from "../../helper";
import {DocsExample} from "../../components";

class ReportList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
    this.init();
  }

  init = async () => {
    const userSnaps = await firebase.firestore().collection(TBL_USER).get();
    await firebase.firestore().collection(TBL_REPORTS).get().then(snapshot => {
      let data = [];

      const users = [];
      userSnaps.forEach(s => users.push(s.data()));

      snapshot.forEach(doc => {
        let obj = doc.data();
        const reporter = users.find(u => u.userId === obj.userId);
        const user = users.find(u => u.userId === obj.ownerId);
        Object.assign(obj, {id: doc.id, reporter, user});
        data.push(obj);
      })

      this.setState({list: data});
      console.log('reports', data);
    })
  }

  render() {
    const {list} = this.state;
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Reports</strong> <small></small>
            </CCardHeader>
            <CCardBody>
              <CTable caption="top">
                <CTableCaption>List of reports</CTableCaption>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Reporter</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                    {/*<CTableHeaderCell scope="col">PostId</CTableHeaderCell>*/}
                    <CTableHeaderCell scope="col">User</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {
                    list.map((row, index) => (
                      <CTableRow key={row.id}>
                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                        <CTableDataCell>{date_str_format(new Date(row.createdAt.seconds * 1000), 'MM/dd/yy')}</CTableDataCell>
                        <CTableDataCell><CImage src={row.reporter.avatar?row.reporter.avatar:default_avatar} size="md" style={{height: 40, width: 40, borderRadius: 20}}/>{row.reporter.displayName}</CTableDataCell>
                        <CTableDataCell>{row.postId?'Post': 'User'}</CTableDataCell>
                        {/*<CTableDataCell>{row.postId}</CTableDataCell>*/}
                        <CTableDataCell><CImage src={row.user.avatar?row.user.avatar:default_avatar} size="md" style={{height: 40, width: 40, borderRadius: 20}}/>{row.user.displayName}</CTableDataCell>
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

export default ReportList
