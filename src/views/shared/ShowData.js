import { CCol, CCard, CListGroupItem, CRow, CCardText, CCardBody, CButton } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import PropTypes from 'prop-types'

export default function ShowCards({ data }) {
  return (
    <CRow className="">
      {data.map((item) => (
        <CCol className="p-3 mt-0 fw-light">
          Property
          <CCardText className="fw-normal text-black text-capitalize">
            {data?.property?.name || '-'}
          </CCardText>
        </CCol>
      ))}
    </CRow>
  )
}

ShowCards.propTypes = {
  data: PropTypes.object,
}
