import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useFetch } from 'use-http'

export default function TopCards() {
  const { get, response } = useFetch()

  const [ratings, setRatings] = useState()

  useEffect(() => {
    overallSatisfaction()
  }, [])

  const overallSatisfaction = async () => {
    const api = await get('v1/admin/reports/maintenance_request/overall')
    console.log(api)
    if (api) {
      setRatings(api.data)
    } else {
      // toast.error('Something went wrong')
    }
  }

  return (
    <>
      <Row className="mt-4 text-uppercase text-center">
        <Col className="bg-white mx-1 rounded-3 shadow-lg p-3 text-nowrap mt-2 ">
          <div className="d-flex justify-content-center">
            <CIcon
              icon={freeSet.cilSmile}
              size="3xl"
              className={`d-block mb-2  ${
                ratings?.satisfaction_score >= 50 ? 'text-success' : 'text-danger'
              }`}
            />
          </div>

          <div>Satisfaction Score : {ratings?.satisfaction_score | 0}</div>
        </Col>
        <Col className="bg-white mx-1 rounded-3 shadow-lg p-3 text-nowrap mt-2 ">
          <div className="d-flex justify-content-center">
            <CIcon icon={freeSet.cilSmile} size="3xl" className="d-block  mb-2 text-success" />
          </div>
          <div>Good Ratings : {ratings?.good_ratings || 0}</div>
        </Col>
        <Col className="bg-white mx-1 rounded-3 shadow-lg p-3 text-nowrap mt-2 ">
          <div className="d-flex justify-content-center">
            <CIcon icon={freeSet.cilMeh} size="3xl" className="d-block  mb-2 text-warning  " />
          </div>
          <div>Average Ratings : {ratings?.average_ratings || 0}</div>
        </Col>
        <Col className="bg-white mx-1 rounded-3 shadow-lg p-3 text-nowrap mt-2 ">
          <div className="d-flex justify-content-center">
            <CIcon icon={freeSet.cilSad} size="3xl" className="d-block  mb-2 text-danger" />
          </div>
          <div>Bad Ratings : {ratings?.bad_ratings || 0}</div>
        </Col>
        <Col className="bg-white mx-1 rounded-3 shadow-lg p-3 text-nowrap mt-2 ">
          <div className="d-flex justify-content-center">
            <CIcon icon={freeSet.cilLibrary} size="3xl" className="d-block  mb-2 text-secondary" />{' '}
          </div>
          <div>Total Ratings : {ratings?.total_ratings || 0}</div>
        </Col>
      </Row>
    </>
  )
}
