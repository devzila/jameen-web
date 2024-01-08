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

export default function ShowUser(propsd) {
  const [visible, setVisible] = useState(false)
  const [user, setUser] = useState([])
  const { get, response } = useFetch()

  const id = propsd.userid.id
  useEffect(() => {
    getUserData()
  }, [])
  async function getUserData() {
    let api = await get(`/v1/admin/users/${id}`)
    console.log(api)
    setUser(api.data.user)

    if (response.ok) {
      setUser(api.data.user)
      console.log(user)
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
        Show User
      </button>
      <CModal
        alignment="center"
        size="xl"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">User Data</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Row>
              <Col className="pr-1 mt-4" md="6">
                <Form.Group>
                  <label>Name</label>
                  <Form.Control defaultValue={user.name} type="text" disabled></Form.Control>
                </Form.Group>
              </Col>
              <Col className="pr-1 mt-4" md="6">
                <Form.Group>
                  <label>Email</label>
                  <Form.Control defaultValue={user.email} type="text" disabled></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="pr-1 mt-4" md="6">
                <Form.Group>
                  <label>Username</label>
                  <Form.Control defaultValue={user.username} type="text" disabled></Form.Control>
                </Form.Group>
              </Col>
              <Col className="pr-1 mt-4" md="6">
                <Form.Group>
                  <label>Mobile Number</label>
                  <Form.Control
                    defaultValue={user.mobile_number}
                    type="text"
                    disabled
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <CModalTitle id="StaticBackdropExampleLabel">Compounds</CModalTitle>
            <Row>
              <Col className="pr-1 mt-4" md="6">
                <Form.Group>
                  {/* {user.compounds.map((val) => (
                    <Form.Control defaultValue={val} type="text" disabled></Form.Control>
                  ))} */}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col className="pr-1 mt-4" md="6">
                <Form.Group>
                  <label>Role </label>
                  <Form.Control defaultValue={user.role?.name} type="text" disabled></Form.Control>
                </Form.Group>
              </Col>
              <Col className="pr-1 mt-4" md="6">
                <Form.Group>
                  <label>Created At</label>
                  <Form.Control defaultValue={user.created_at} type="text" disabled></Form.Control>
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
