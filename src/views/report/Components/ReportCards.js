import React, { useState } from 'react'
import { CCard, CCol, CRow } from '@coreui/react'
import PropTypes from 'prop-types'
import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ReportModals from './ReportModals'

export default function ReportCards(props) {
  console.log()
  return (
    <CCol md="4" className="mt-3">
      <ReportModals
        component={
          <CCard className="p-3 rounded-0 border-0 shadow-sm pb-5">
            <CRow>
              <CCol md="2">
                <CIcon size="xl" className="me-2 theme_color " icon={freeSet.cilJustifyLeft} />
              </CCol>
              <CCol>
                <div className="m-0 p-0 text-nowrap">
                  <b>{props.data.header}</b>
                  <br />
                  <sub className="text-secondary">{props.data.sub_header}</sub>
                </div>
              </CCol>
            </CRow>
          </CCard>
        }
      />
    </CCol>
  )
}

ReportCards.propTypes = {
  data: PropTypes.object,
}
