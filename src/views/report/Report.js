import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CCard, CCol, CRow } from '@coreui/react'
import React from 'react'
import { CardHeader, CardText } from 'react-bootstrap'
import ReportCards from './Components/ReportCards'
import { report_card_data } from './Components/ReportCardData'

const Report = () => {
  return (
    <>
      <div className="d-flex justify-content-center">
        <h3 className="text-center bg-white rounded-5 shadow-sm p-2 px-5 theme_color">Reports</h3>
      </div>
      <h6 className="mt-2"> - Unit Reports</h6>

      <CRow className="my-3">
        {report_card_data.unit_reports.map((item, index) => (
          <ReportCards key={index} data={item} />
        ))}
      </CRow>

      <h6> - Collection Report</h6>
      <CRow className="my-3 d-flex">
        {report_card_data.collection_reports.map((item, index) => (
          <ReportCards key={index} data={item} />
        ))}
      </CRow>

      <h6>- Customer balance report</h6>
      <CRow className="my-3">
        {report_card_data.unit_reports.map((item, index) => (
          <ReportCards key={index} data={item} />
        ))}
      </CRow>

      <h6>- Maintenance order report</h6>
      <CRow className="my-3">
        {report_card_data.unit_reports.map((item, index) => (
          <ReportCards key={index} data={item} />
        ))}
      </CRow>
      <h6>-Resident Report</h6>
      <CRow className="my-3">
        {report_card_data.unit_reports.map((item, index) => (
          <ReportCards key={index} data={item} />
        ))}
      </CRow>
    </>
  )
}
export default Report
