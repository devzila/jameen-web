import React from 'react'
import PropTypes from 'prop-types'
import { Card, Dropdown, Row, Col, Table } from 'react-bootstrap'
import CustomDivToggle from '../../components/CustomDivToggle'
import { BsThreeDots } from 'react-icons/bs'

const UnitListView = ({ units }) => {
  return (
    <Table className="table-hover table-striped">
      <thead>
        <tr>
          <th className="border-0">Unit Number</th>
          <th className="border-0">Bedroom No</th>
          <th className="border-0">Bathroom No</th>
          <th className="border-0">Parking</th>
          <th className="border-0">Year Built</th>
          <th className="border-0">Status</th>
          <th className="border-0">Actions</th>
        </tr>
      </thead>
      <tbody>
        {units.map((unit) => (
          <tr key={unit.id}>
            <td>{unit.unit_no}</td>
            <td>{unit.bedrooms_number}</td>
            <td>{unit.bathrooms_number}</td>
            <td>{String(unit.has_parking)}</td>
            <td>{unit.year_built}</td>
            <td>{unit.status}</td>
            <td>
              <Dropdown key={unit.id}>
                <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                  <BsThreeDots />
                </Dropdown.Toggle>
              </Dropdown>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

UnitListView.propTypes = {
  units: PropTypes.array.isRequired,
}

export default UnitListView
