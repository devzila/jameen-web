import React from 'react'
import PropTypes from 'prop-types'
import { Card, Dropdown, Row, Col } from 'react-bootstrap'
import GridViewCard from './UnitFunctions/GridViewCard'

const UnitGridView = ({ units }) => {
  return (
    <Row>
      <GridViewCard units={units} />
    </Row>
  )
}

UnitGridView.propTypes = {
  units: PropTypes.array.isRequired,
}

export default UnitGridView
