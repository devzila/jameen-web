import React, { useState } from 'react'
import {
  CNavbar,
  CNavbarNav,
  CContainer,
  CNavLink,
  CNavItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
} from '@coreui/react'

function Nav() {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CNavbar expand="lg" colorScheme="white" className="bg-white">
        <CContainer fluid>
          <CNavbarNav>
            <CNavItem>
              <CNavLink href="#" active>
                Users
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#">Roles</CNavLink>
            </CNavItem>
            <CDropdown variant="nav-item" popper={false}>
              <CDropdownToggle color="secondary">Dropdown button</CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem href="#">Action</CDropdownItem>
                <CDropdownItem href="#">Another action</CDropdownItem>
                <CDropdownDivider />
                <CDropdownItem href="#">Something else here</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
            <CNavItem>
              <CNavLink href="#"> Disabled </CNavLink>
            </CNavItem>
          </CNavbarNav>
        </CContainer>
      </CNavbar>
    </>
  )
}
export default Nav
