import React from 'react'
import PropTypes from 'prop-types'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

const MaintenanceList = ({ listData }) => {
  return (
    <CTable>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">#</CTableHeaderCell>
          <CTableHeaderCell scope="col">Unit</CTableHeaderCell>
          <CTableHeaderCell scope="col">Category</CTableHeaderCell>
          <CTableHeaderCell scope="col">Other Details</CTableHeaderCell>
          <CTableHeaderCell scope="col">Status</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {listData.map((o, i) => (
          <CTableRow key={i}>
            <CTableDataCell>{i}</CTableDataCell>
            <CTableDataCell>{o.a}</CTableDataCell>
            <CTableDataCell></CTableDataCell>
            <CTableDataCell></CTableDataCell>
            <CTableDataCell></CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}
MaintenanceList.propTypes = {
  listData: PropTypes.array,
}
export default MaintenanceList
