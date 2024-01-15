import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'

import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CContainer,
} from '@coreui/react'

import { Form, Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

export default function Showunit(propsd) {
  const { propertyId } = useParams()
  const [visible, setVisible] = useState(false)
  const [unit, setUnit] = useState([])
  const { get, response } = useFetch()

  const id = propsd.unitid.id
  useEffect(() => {
    getUnitData()
  }, [])
  async function getUnitData() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${id}`)
    setUnit(api.data)

    if (response.ok) {
      setUnit(api.data)
      console.log(unit)
    }
  }

  return (
    <div>
      <button
        style={{
          color: '#00bfcc',
          backgroundColor: 'white',
          marginLeft: '4px',
          width: '90%',
          border: 'none',
        }}
        type="button"
        className="btn btn-tertiary "
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Show unit
      </button>
      <CModal
        alignment="center"
        size="xl"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">unit Data</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Row>
              <Col className="pr-1 mt-4" md="6">
                <Form.Group>
                  <label>Bedroom No</label>
                  <Form.Control
                    defaultValue={unit.bedrooms_number}
                    type="text"
                    disabled
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col className="pr-1 mt-4" md="6">
                <Form.Group>
                  <label>Bathroom No</label>
                  <Form.Control
                    defaultValue={unit.bathrooms_number}
                    type="text"
                    disabled
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="pr-1 mt-4" md="6">
                <Form.Group>
                  <label>Year Built</label>
                  <Form.Control defaultValue={unit.year_built} type="text" disabled></Form.Control>
                </Form.Group>
              </Col>
              <Col className="pr-1 mt-4" md="6">
                <Form.Group>
                  <label>Owner</label>
                  <Form.Control
                    defaultValue={unit.resident_units}
                    type="text"
                    disabled
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="pr-1 mt-4" md="6">
                <Form.Group>
                  <label>Status </label>
                  <Form.Control defaultValue={unit.status} type="text" disabled></Form.Control>
                </Form.Group>
              </Col>
              <Col className="pr-1 mt-4" md="6">
                <Form.Group>
                  <label>Created At</label>
                  <Form.Control defaultValue={unit.created_at} type="text" disabled></Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center">
              <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                  Close
                </CButton>
              </CModalFooter>
            </div>

            <div className="clearfix"></div>
          </CContainer>
        </CModalBody>
      </CModal>
    </div>
  )
}
