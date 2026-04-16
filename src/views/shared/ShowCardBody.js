import { CCol, CCard, CListGroupItem, CRow, CCardText, CCardBody, CButton } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import PropTypes from 'prop-types'
export default function ShowCardBody({ data }) {
  return (
    <CCol md="4">
      <CCard className=" p-3 my-3 border-0 theme_color">
        <div className="d-flex w-100 ">
          <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2" />
          <strong className="text-black">Property Details</strong>
        </div>

        <hr className="text-secondary" />
      </CCard>
    </CCol>
  )
}
ShowCardBody.propTypes = {
  data: PropTypes.object,
}
