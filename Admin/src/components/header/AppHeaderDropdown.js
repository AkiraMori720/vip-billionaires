import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle, CHeaderText,
} from '@coreui/react'
import {
  cilAccountLogout
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import default_avatar from './../../assets/images/AvatarPlaceholderProfile.png'
import PropTypes from "prop-types";

const AppHeaderDropdown = ({logout, user}) => {
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <span className="mx-2 text-medium-emphasis">{user?.displayName??''}</span>
        <CAvatar src={(user && user.avatar)?user.avatar:default_avatar} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-2" placement="bottom-end">
        <CDropdownItem onClick={logout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

AppHeaderDropdown.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func
}

export default AppHeaderDropdown
