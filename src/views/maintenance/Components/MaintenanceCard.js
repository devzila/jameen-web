import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'react-bootstrap'
import { CCard } from '@coreui/react'
import { NavLink } from 'react-router-dom'
import { status_color } from 'src/services/CommonFunctions'

export default function MaintenanceCard({ data }) {
  console.log(data)
  return (
    <>
      <Row>
        {data?.map((item) => (
          <Col key={item.id} md="4">
            <CCard className="p-3 rounded-0 mt-2 border-0  shadow-sm cursor-pointer">
              <div className="d-flex justify-content-between align-itmes-center w-100">
                <NavLink to={`${item.id}`} className=" p-0">
                  {item.title || '-'}
                </NavLink>
                <button
                  className=" text-center border-0  rounded-0 text-white"
                  style={{
                    backgroundColor: `${status_color(item?.status)}`,
                    cursor: 'default',
                    width: '120px',
                  }}
                >
                  {item.status || '-'}
                </button>
              </div>
              <small
                className="p-0 text-secondary overflow-hidden"
                title={item.description?.length > 60 ? item.description : ''}
              >
                {item.description?.slice(0, 60) + (item.description.length > 60 ? '...' : '') ||
                  '-'}
              </small>
              <Row>
                <Col md="3">
                  <p>Category </p>
                </Col>
                <Col className="text-secondary ">
                  <p>{item.category?.name || '-'}</p>
                </Col>
              </Row>
              <Row>
                <Col md="3">
                  <p>Priority</p>
                </Col>
                <Col className="text-secondary">
                  <p>{item.category?.priority || '-'}</p>
                </Col>
              </Row>
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
