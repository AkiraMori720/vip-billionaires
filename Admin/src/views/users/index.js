import React from 'react'
import {
  CAvatar,
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
import {DB_ACTION_UPDATE, getBackendAPI, TBL_USER} from "../../lib/backend";
import default_avatar from './../../assets/images/AvatarPlaceholderProfile.png'
import {date_str_format} from "../../helper";

class UserList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
    this.init();
  }

  init = async () => {
    getBackendAPI().getData(TBL_USER).then(users => {
      this.setState({list: users});
      console.log('users', users);
    })
  }

  toggleBlock = (id, block) => {
    const update = {id, block};
    getBackendAPI().setData(TBL_USER, DB_ACTION_UPDATE, update).then(() => {
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
              <strong>Users</strong> <small></small>
            </CCardHeader>
            <CCardBody>
              <CTable caption="top">
                <CTableCaption>List of users</CTableCaption>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
                    <CTableHeaderCell scope="col">City</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Zip</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Birthday</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Job</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Company</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Years Of Service</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Salary</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Purpose</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{textAlign: 'center'}}>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {
                    list.map((row, index) => (
                      <CTableRow key={row.id}>
                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                        <CTableDataCell><CImage src={row.avatar?row.avatar:default_avatar} size="md" style={{height: 40, width: 40, borderRadius: 20}}/><span>{row.displayName}</span></CTableDataCell>
                        <CTableDataCell>{row.gender}</CTableDataCell>
                        <CTableDataCell>{row.city}</CTableDataCell>
                        <CTableDataCell>{row.zip}</CTableDataCell>
                        <CTableDataCell>{row.email}</CTableDataCell>
                        <CTableDataCell>{row.birthday?date_str_format(new Date(row.birthday.seconds * 1000), 'dd/mm/yy'): ''}</CTableDataCell>
                        <CTableDataCell>{row.job}</CTableDataCell>
                        <CTableDataCell>{row.company}</CTableDataCell>
                        <CTableDataCell>{row.years_of_service}</CTableDataCell>
                        <CTableDataCell>{row.salary}</CTableDataCell>
                        <CTableDataCell>{row.purpose}</CTableDataCell>
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

export default UserList
