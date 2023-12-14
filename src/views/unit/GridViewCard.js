import React from 'react'
import PropTypes from 'prop-types'
import { Card, Row, Col } from 'react-bootstrap'

const GridViewCard = ({ units }) => {
  return (
    <>
      {units.map((unit) => (
        <Col key={unit.id} xs={12} md={6} lg={4}>
          <Card className="mb-4">
            <Card.Img variant="top" src="/images/sample.jpg" alt={`Unit ${unit.unit_no}`} />
            <Card.Body>
              <Card.Title>{unit.unit_no}</Card.Title>
              <Card.Text>
                <strong>Bedroom No:</strong> {unit.bedrooms_number}
                <br />
                <strong>Bathroom No:</strong> {unit.bathrooms_number}
                <br />
                <strong>Parking:</strong> {unit.has_parking ? 'Yes' : 'No'}
                <br />
                <strong>Year Built:</strong> {unit.year_built}
                <br />
                <strong>Status:</strong> {unit.status}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </>
  )
}

GridViewCard.propTypes = {
  units: PropTypes.array.isRequired,
}

export default GridViewCard
