import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CCard, CCol, CRow } from '@coreui/react'
import React from 'react'

const Report = () => {
  return (
    <>
      <h3>Report</h3>
      <h6 className="mt-2">- Unit Reports</h6>
      <CRow className="my-3">
        <CCol md="4" className="mt-3">
          <CCard className="theme_color p-3 rounded-0 border-0 shadow-sm pb-5">
            <CIcon size="xl" className="me-2" icon={freeSet.cilJustifyLeft} />
          </CCard>
        </CCol>
        <CCol md="4" className="mt-3">
          <CCard className="theme_color p-3 rounded-0 border-0 shadow-sm pb-5">
            <CIcon size="xl" className="me-2" icon={freeSet.cilJustifyLeft} />
          </CCard>
        </CCol>
        <CCol md="4" className="mt-3">
          <CCard className="theme_color p-3 rounded-0 border-0 shadow-sm pb-5">
            <CIcon size="xl" className="me-2" icon={freeSet.cilJustifyLeft} />
          </CCard>
        </CCol>
        <CCol md="4" className="mt-3">
          <CCard className="theme_color p-3 rounded-0 border-0 shadow-sm pb-5">
            <CIcon size="xl" className="me-2" icon={freeSet.cilJustifyLeft} />
          </CCard>
        </CCol>
      </CRow>

      <h6>- Collection Reports</h6>
      <CRow className="my-3">
        <CCol md="4" className="mt-3">
          <CCard className="theme_color p-3 rounded-0 border-0 shadow-sm pb-5">
            <CIcon size="xl" className="me-2" icon={freeSet.cilJustifyLeft} />
          </CCard>
        </CCol>
        <CCol md="4" className="mt-3">
          <CCard className="theme_color p-3 rounded-0 border-0 shadow-sm pb-5">
            <CIcon size="xl" className="me-2" icon={freeSet.cilJustifyLeft} />
          </CCard>
        </CCol>
        <CCol md="4" className="mt-3">
          <CCard className="theme_color p-3 rounded-0 border-0 shadow-sm pb-5">
            <CIcon size="xl" className="me-2" icon={freeSet.cilJustifyLeft} />
          </CCard>
        </CCol>
        <CCol md="4" className="mt-3">
          <CCard className="theme_color p-3 rounded-0 border-0 shadow-sm pb-5">
            <CIcon size="xl" className="me-2" icon={freeSet.cilJustifyLeft} />
          </CCard>
        </CCol>
      </CRow>
      <h6>- Resident Reports</h6>
      <CRow className="my-3">
        <CCol md="4" className="mt-3">
          <CCard className="theme_color p-3 rounded-0 border-0 shadow-sm pb-5">
            <CIcon size="xl" className="me-2" icon={freeSet.cilJustifyLeft} />
          </CCard>
        </CCol>
        <CCol md="4" className="mt-3">
          <CCard className="theme_color p-3 rounded-0 border-0 shadow-sm pb-5">
            <CIcon size="xl" className="me-2" icon={freeSet.cilJustifyLeft} />
          </CCard>
        </CCol>
        <CCol md="4" className="mt-3">
          <CCard className="theme_color p-3 rounded-0 border-0 shadow-sm pb-5">
            <CIcon size="xl" className="me-2" icon={freeSet.cilJustifyLeft} />
          </CCard>
        </CCol>
        <CCol md="4" className="mt-3">
          <CCard className="theme_color p-3 rounded-0 border-0 shadow-sm pb-5">
            <CIcon size="xl" className="me-2" icon={freeSet.cilJustifyLeft} />
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
export default Report
