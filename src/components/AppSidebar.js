import React, { useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import logo from '../assets/images/jameen-logo.png'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../SideBarContent'
import { AuthContext } from 'src/contexts/AuthContext'

const DEFAULT_COMPANY_NAME = 'Jameen'
const COMPANY_NAME_STYLE = {
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'block',
  WebkitMaskImage: 'linear-gradient(to right, black 92%, transparent 100%)',
  maskImage: 'linear-gradient(to right, black 92%, transparent 100%)',
}

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const authState = useContext(AuthContext)?.state
  const companyFromState = authState?.company

  let companyFromStorage = null
  try {
    companyFromStorage = JSON.parse(localStorage.getItem('company'))
  } catch (_error) {
    companyFromStorage = null
  }

  const company = companyFromState || companyFromStorage
  const companyName = company?.name || DEFAULT_COMPANY_NAME
  const companyLogo = company?.logo_url || logo

  return (
    <CSidebar
      position="fixed"
      unfoldable={!unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" style={{ overflow: 'hidden' }} to="/">
        <img
          src={companyLogo}
          height={35}
          style={{ textAlign: 'left' }}
          alt={`${companyName} Logo`}
        />

        <p className="sidebar-brand-full mx-2 my-0" style={COMPANY_NAME_STYLE} title={companyName}>
          {companyName}
        </p>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
