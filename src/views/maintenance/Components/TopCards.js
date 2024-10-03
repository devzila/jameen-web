import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import useFetch from 'use-http'
import { useParams } from 'react-router-dom'

export default function TopCards() {
  const { get, post, response } = useFetch()
  const [allData, setAllData] = useState({})
  const [last30Days, setlast30Days] = useState({})

  const { propertyId } = useParams()

  useEffect(() => {
    getStatsData()
  }, [])

  const getStatsData = async () => {
    console.log(propertyId)

    const endpoint = propertyId
      ? `/v1/admin/premises/properties/${propertyId}/maintenance_request_stats`
      : `/v1/admin/maintenance/stats`

    const api = await get(endpoint)
    if (response.ok) {
      setAllData(api.all)
      setlast30Days(api.last_30days)
    }
  }
  return (
    <Row className=" text-uppercase p-2">
      <Col className="bg-white mx-1 rounded-1 shadow-sm p-3 text-nowrap mt-2 ">
        <div className="d-flex justify-content-between align-items-center">
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
              <Col md="2">{allData?.requested || 0}</Col>
              <Col md="4">
                <small className="fw-light "> CANCELLED </small>
              </Col>
              <Col md="2">{allData?.cancelled || 0}</Col>
            </Row>
            <Row className="mt-2">
              <Col md="4">
                <small className="fw-light "> Resolved </small>
              </Col>
              <Col md="2">{allData?.resolved || 0}</Col>
              <Col md="4">
                <small className="fw-light "> IN PROGRESS </small>
              </Col>
              <Col md="2">{allData?.in_progress || 0}</Col>
            </Row>
            <Row className="mt-2">
              <Col md="6">
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
          <h3>{allData?.requested || 0}</h3>
        </div>
        <Row className="mt-2">
          <Col md="6">
            <small className="fw-light "> Last 30 days : </small>
          </Col>
          <Col md="2">{last30Days?.requested || 0}</Col>
        </Row>
      </Col>{' '}
      <Col className="bg-white mx-1 rounded-1 shadow-sm p-3 text-nowrap mt-2 ">
        <div className="d-flex justify-content-between">
          <b>Cancelled</b>
          <CIcon icon={freeSet.cilNotes} size="xxl" className="d-block  mb-2 theme_color" />
        </div>
        <div>
          <h3>{allData?.cancelled || 0}</h3>
        </div>
        <Row className="mt-2">
          <Col md="6">
            <small className="fw-light "> Last 30 days : </small>
          </Col>
          <Col md="2">{last30Days?.cancelled || 0}</Col>
        </Row>
      </Col>
      <Col className="bg-white mx-1 rounded-1 shadow-sm p-3 text-nowrap mt-2 ">
        <div className="d-flex justify-content-between">
          <b>In Progress</b>
          <CIcon icon={freeSet.cilNotes} size="xxl" className="d-block  mb-2 theme_color" />
        </div>
        <div>
          <h3>{allData?.in_progress || 0}</h3>
        </div>
        <Row className="mt-2">
          <Col md="6">
            <small className="fw-light "> Last 30 days : </small>
          </Col>
          <Col md="2">{last30Days?.in_progress || 0}</Col>
        </Row>
      </Col>
      <Col className="bg-white mx-1 rounded-1 shadow-sm p-3 text-nowrap mt-2 ">
        <div className="d-flex justify-content-between">
          <b>CLOSED ISSUES</b>

          <CIcon icon={freeSet.cilNotes} size="xxl" className="d-block  mb-2 theme_color" />
        </div>
        <div>
          <h3>{allData?.resolved || 0}</h3>
        </div>
        <Row className="mt-2">
          <Col md="6">
            <small className="fw-light "> Last 30 days : </small>
          </Col>
          <Col md="2">{last30Days?.resolved || 0}</Col>
        </Row>
      </Col>
      <Col className="bg-white mx-1 rounded-1 shadow-sm p-3 text-nowrap mt-2 ">
        <div className="d-flex justify-content-between">
          <b>Re-open</b>
          <CIcon icon={freeSet.cilNotes} size="xxl" className="d-block  mb-2 theme_color" />
        </div>
        <div>
          <h3>{allData?.reopen || 0}</h3>
        </div>
        <Row className="mt-2">
          <Col md="6">
            <small className="fw-light "> Last month </small>
          </Col>
          <Col md="2">{last30Days?.reopen || 0}</Col>
        </Row>
      </Col>
    </Row>
  )
}
