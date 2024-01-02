import React, { useState } from 'react'
import useFetch from 'use-http'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Select from 'react-select'

import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CContainer,
} from '@coreui/react'
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from 'react-bootstrap'

export default function UserForm() {
  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, setValue } = useForm()
  const { get, post, response } = useFetch()

  const [userData, setUserData] = useState({})
  const navigate = useNavigate()

  async function onSubmit(data) {
    console.log(data)
    const api = await post(`/v1/admin/users`, { user: data })
    if (response.ok) {
      setValue('name', api.data.user.name)
      setValue('email', api.data.user.email)
      setValue('mobile_number', api.data.user.mobile_number)
      setValue('username', api.data.user.username)
      setValue('password', api.data.user.password)
      setValue('role_id', api.data.user.role_id)
      setValue('assigned_properties', api.data.user.assigned_properties)

      // setValue('rolename', api.data.user.role.name)

      navigate(`/`)
      toast('user added Successfully')
    } else {
      toast(response.data?.message)
    }
  }

  return (
    <div>
      <button
        style={{ backgroundColor: '#00bfcc', color: 'white', marginLeft: '4px' }}
        color="#00bfcc"
        type="button"
        className="btn  s-3"
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Add User
      </button>
      <CModal
        alignment="center"
        size="xl"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Add User Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col className="pr-1" md="6">
                  <Form.Group>
                    <label>Name</label>
                    <Form.Control
                      defaultValue={userData.name}
                      placeholder="Full Name"
                      type="text"
                      {...register('name')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1" md="4">
                  <Form.Group className="form-check form-switch">
                    <Form.Control
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                      defaultValue={userData.active}
                      {...register('active')}
                    ></Form.Control>
                    <label className="form-check-label">Active</label>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1" md="6">
                  <Form.Group>
                    <label>Username</label>
                    <Form.Control
                      defaultValue={userData.username}
                      placeholder="UserName"
                      type="text"
                      {...register('username')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1" md="6">
                  <Form.Group>
                    <label>Password</label>
                    <Form.Control
                      defaultValue={userData.password}
                      placeholder="Password"
                      type="text"
                      {...register('password')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1" md="6">
                  <Form.Group>
                    <label>Email</label>
                    <Form.Control
                      defaultValue={userData.email}
                      placeholder="abc@example.com"
                      type="text"
                      {...register('email')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1" md="6">
                  <Form.Group>
                    <label>Phone No</label>
                    <Form.Control
                      defaultValue={userData.mobile_number}
                      placeholder="Phone Number"
                      type="text"
                      {...register('mobile_number')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              {/* Modal part 2 role */}
              <CModalTitle id="StaticBackdropExampleLabel">Role</CModalTitle>

              <Row>
                <Col className="pr-1" md="12">
                  <Form.Group>
                    <label>Role ID</label>
                    <Form.Control
                      defaultValue={userData.role_id}
                      placeholder="Role"
                      type="text"
                      {...register('role_id')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <CModalTitle id="StaticBackdropExampleLabel">Assigned Properties</CModalTitle>
              <Row>
                <Col className="pr-1" md="12">
                  <Form.Group>
                    <label></label>
                    <Form.Control
                      defaultValue={userData.assigned_properties}
                      placeholder="Assigned Properties"
                      type="text"
                      {...register('assigned_properties')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-center">
                <Button
                  data-mdb-ripple-init
                  type="submit"
                  className="btn  btn-primary btn-block"
                  style={{ width: '600px', marginTop: '5px' }}
                >
                  Submit
                </Button>
              </div>
              <div className="clearfix"></div>
            </Form>
          </CContainer>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}
