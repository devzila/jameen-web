import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

export default function TopCards() {
  return (
    <Row className="mt-2 text-uppercase p-2">
      <Col className="bg-white mx-1 rounded-1 shadow-sm p-3 text-nowrap mt-2 ">
        <div className="d-flex justify-content-between">
          <b>ALL ISSUES</b>
          <CIcon icon={freeSet.cilNotes} size="xxl" className="d-block  mb-2 theme_color" />
        </div>
        <div>
          <h3>{null || 0}</h3>
          <div>
            <Row className="mt-3">
              <Col md="4">
                <small className="fw-light "> PENDING </small>
              </Col>
              <Col md="2">{null || 0}</Col>
              <Col md="4">
                <small className="fw-light "> CANCELLED </small>
              </Col>
              <Col md="2">{null || 0}</Col>
            </Row>
            <Row className="mt-2">
              <Col md="4">
                <small className="fw-light "> ASSIGNED </small>
              </Col>
              <Col md="2">{null || 0}</Col>
              <Col md="4">
                <small className="fw-light "> IN PROGRESS </small>
              </Col>
              <Col md="2">{null || 0}</Col>
            </Row>
            <Row className="mt-2">
              <Col md="4">
                <small className="fw-light "> REJECTED BEFORE </small>
              </Col>
              <Col md="2">{null || 0}</Col>
            </Row>
          </div>
        </div>
      </Col>
      <Col className="bg-white mx-1 rounded-1 shadow-sm p-3 text-nowrap mt-2 ">
        <div className="d-flex justify-content-between">
          <b>PENDING ISSUES</b>
          <CIcon icon={freeSet.cilNotes} size="xxl" className="d-block  mb-2 theme_color" />
        </div>
        <div>
          <h3>{null || 0}</h3>
        </div>
      </Col>
      <Col className="bg-white mx-1 rounded-1 shadow-sm p-3 text-nowrap mt-2 ">
        <div className="d-flex justify-content-between">
          <b>CLOSED ISSUES</b>

          <CIcon icon={freeSet.cilNotes} size="xxl" className="d-block  mb-2 theme_color" />
        </div>
        <div>
          <h3>{null || 0}</h3>
        </div>
      </Col>
      <Col className="bg-white mx-1 rounded-1 shadow-sm p-3 text-nowrap mt-2 ">
        <div className="d-flex justify-content-between">
          <b>CONFIRMED TICKETS</b>
          <CIcon icon={freeSet.cilNotes} size="xxl" className="d-block  mb-2 theme_color" />
        </div>
        <div>
          <h3>{null || 0}</h3>
        </div>
      </Col>
    </Row>
  )
}
