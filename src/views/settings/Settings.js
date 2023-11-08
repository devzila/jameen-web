import React from 'react'
import Nav from './nav'
import { CCard, CCardBody } from '@coreui/react'

const Settings = () => {
  return (
    <>
      <Nav />
      <br />
      <CCard>
        <CCardBody>
          <h1>Settings</h1>
        </CCardBody>
      </CCard>
    </>
  )
}
export default Settings
