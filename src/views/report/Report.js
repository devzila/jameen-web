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
      <div className="d-flex justify-content-center ">
        <h3 className="text-center bg-white rounded-5 shadow-sm p-2 px-5 theme_color">
          <CIcon icon={freeSet.cilBarChart} size="xl" className="mx-2" />
          Reports
        </h3>
      </div>

      <span className="monospace-bold">
        {Object.keys(report_card_data).map((key, index) => (
          <React.Fragment key={index}>
            <h6 className="mt-4 monospace-bold text-capitalize">- {key.replace(/_/g, ' ')}</h6>
            <CRow className="my-2">
              {report_card_data[key].map((item, index) => (
                <ReportCards key={index} data={item} />
              ))}
            </CRow>
          </React.Fragment>
        ))}
      </span>
    </>
  )
}
export default Report
