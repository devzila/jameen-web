import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import useFetch from 'use-http'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function TopCards({ refresh, filter_callback }) {
  const { get, post, response } = useFetch()
  const [allData, setAllData] = useState({})
  const [last30Days, setlast30Days] = useState({})

  const [filter_query, setFilterQuery] = useState('')

  const [active, setActive] = useState([false, false, false, false, false, true])

  const { propertyId } = useParams()

  useEffect(() => {
    getStatsData()
  }, [refresh])

  const getStatsData = async () => {
    console.log(propertyId)

    const endpoint = propertyId
      ? `/v1/admin/premises/properties/${propertyId}/maintenance_request_stats`
      : `/v1/admin/maintenance/stats`

    const api = await get(endpoint)
    if (response.ok) {
      setAllData(api.all)
      setlast30Days(api.last_30days)
      console.log(api)
    }
  }

  const applyFilters = (type, date = false) => {
    let query = `&q[status_eq]=${type}`

    if (date) {
      const current_date = new Date()
      const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(current_date)
      query += `&q[created_at_gteq]=${formattedDate.toString()}`
    }
    const active_data = [false, false, false, false, false, false]
    active_data[type] = true
    setActive(active_data)
    filter_callback(query)
  }
  return (
    <Row className=" text-uppercase p-2">
      <Col
        className={`bg-white mx-1 rounded-1 shadow-sm p-3 text-nowrap mt-2 ${
          active['5'] ? 'theme_color' : null
        }`}
        onClick={() => applyFilters('')}
      >
        <div className="d-flex justify-content-between">
          <b>ALL ISSUES</b>
          <CIcon icon={freeSet.cilNotes} size="xxl" className="d-block  mb-2 theme_color" />
        </div>
        <div>
          <h3>{null || 0}</h3>
          <div>
            <Row className="mt-2" onClick={() => applyFilters('', true)}>
              <Col md="6">
                <small className="fw-light "> Last 30 days : </small>
              </Col>
              <Col md="2">{null || 0}</Col>
            </Row>
          </div>
        </div>
      </Col>
      <Col
        className={`bg-white mx-1 rounded-1 shadow-sm p-3 text-nowrap mt-2 ${
          active[0] ? 'theme_color' : null
        }`}
        onClick={() => applyFilters('0')}
      >
        <div className="d-flex justify-content-between">
          <b>PENDING ISSUES</b>
          <CIcon icon={freeSet.cilNotes} size="xxl" className="d-block  mb-2 theme_color" />
        </div>
        <div>
          <h3>{allData?.requested || 0}</h3>
        </div>
        <Row className="mt-2" onClick={() => applyFilters('0', true)}>
          <Col md="6">
            <small className="fw-light "> Last 30 days : </small>
          </Col>
          <Col md="2">{last30Days?.requested || 0}</Col>
        </Row>
      </Col>{' '}
      <Col
        c
        className={`bg-white mx-1 rounded-1 shadow-sm p-3 text-nowrap mt-2 ${
          active[2] ? 'theme_color' : null
        }`}
        onClick={() => applyFilters('2')}
      >
        <div className="d-flex justify-content-between">
          <b>Cancelled</b>
          <CIcon icon={freeSet.cilNotes} size="xxl" className="d-block  mb-2 theme_color" />
        </div>
        <div>
          <h3>{allData?.cancelled || 0}</h3>
        </div>
        <Row className="mt-2" onClick={() => applyFilters('2', true)}>
          <Col md="6">
            <small className="fw-light "> Last 30 days : </small>
          </Col>
          <Col md="2">{last30Days?.cancelled || 0}</Col>
        </Row>
      </Col>
      <Col
        className={`bg-white mx-1 rounded-1 shadow-sm p-3 text-nowrap mt-2 ${
          active[1] ? 'theme_color' : null
        }`}
        onClick={() => applyFilters('1')}
      >
        <div className="d-flex justify-content-between">
          <b>In Progress</b>
          <CIcon icon={freeSet.cilNotes} size="xxl" className="d-block  mb-2 theme_color" />
        </div>
        <div>
          <h3>{allData?.in_progress || 0}</h3>
        </div>
        <Row className="mt-2" onClick={() => applyFilters('1', true)}>
          <Col md="6">
            <small className="fw-light "> Last 30 days : </small>
          </Col>
          <Col md="2">{last30Days?.in_progress || 0}</Col>
        </Row>
      </Col>
      <Col
        className={`bg-white mx-1 rounded-1 shadow-sm p-3 text-nowrap mt-2 ${
          active[3] ? 'theme_color' : null
        }`}
        onClick={() => applyFilters('3')}
      >
        <div className="d-flex justify-content-between">
          <b>CLOSED ISSUES</b>

          <CIcon icon={freeSet.cilNotes} size="xxl" className="d-block  mb-2 theme_color" />
        </div>
        <div>
          <h3>{allData?.resolved || 0}</h3>
        </div>
        <Row className="mt-2" onClick={() => applyFilters('3', true)}>
          <Col md="6">
            <small className="fw-light "> Last 30 days : </small>
          </Col>
          <Col md="2">{last30Days?.resolved || 0}</Col>
        </Row>
      </Col>
      <Col
        className={`bg-white mx-1 rounded-1 shadow-sm p-3 text-nowrap mt-2 ${
          active[4] ? 'theme_color' : null
        }`}
        onClick={() => applyFilters('4')}
      >
        <div className="d-flex justify-content-between">
          <b>Re-open</b>
          <CIcon icon={freeSet.cilNotes} size="xxl" className="d-block  mb-2 theme_color" />
        </div>
        <div>
          <h3>{allData?.reopen || 0}</h3>
        </div>
        <Row className="mt-2" onClick={() => applyFilters('4', true)}>
          <Col md="6">
            <small className="fw-light "> Last 30 days : </small>
          </Col>
          <Col md="2">{last30Days?.reopen || 0}</Col>
        </Row>
      </Col>
    </Row>
  )
}

TopCards.propTypes = {
  refresh: PropTypes.bool,
  filter_callback: PropTypes.func,
}
