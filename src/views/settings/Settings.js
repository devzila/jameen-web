import React from 'react'
import { CCard, CCardImage, CCardLink, CCol, CRow } from '@coreui/react'
import MenuItems from './MenuItems'
import logo from '../../assets/images/jameen-logo.png'

const Settings = () => {
  return (
    <>
      <div className="row">
        {MenuItems.map((item, index) => (
          <div key={index} className="col-sm-2 card-deck">
            <div className="card">
              <CCardLink href="#">
                <CCardImage orientation="top" src={logo} />
              </CCardLink>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
export default Settings
