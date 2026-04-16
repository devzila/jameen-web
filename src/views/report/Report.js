import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CCard, CCol, CRow } from '@coreui/react'
import React from 'react'
import { CardHeader, CardText } from 'react-bootstrap'
import ReportCards from './Components/ReportCards'
import { report_card_data } from './Components/ReportCardData'
import RoundedNavbar from '../shared/RoundedNavbar'

const Report = () => {
  return (
    <>
      <RoundedNavbar props={{ icon: freeSet.cilBarChart, header: 'Reports' }} />
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
