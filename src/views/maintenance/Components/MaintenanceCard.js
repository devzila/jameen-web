import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'react-bootstrap'
import { CCard } from '@coreui/react'
import { NavLink } from 'react-router-dom'

export default function MaintenanceCard({ data }) {
  return (
    <>
      <Row>
        {data?.map((item) => (
          <Col key={item.id} md="4">
            <CCard className="p-3 rounded-0 mt-2 border-0  shadow-sm">
              <NavLink to={`${item.id}`} className="mx-2 p-0">
                {item.title || '-'}
              </NavLink>{' '}
            </CCard>
          </Col>
        ))}
      </Row>
    </>
  )
}

MaintenanceCard.propTypes = {
  data: PropTypes.object,
}
