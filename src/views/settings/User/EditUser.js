import React, { useState, useEffect } from 'react'
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

export default function EditUser(propsdata) {
  const [users, setUsers] = useState([])
  const { get, post, put, response } = useFetch()

  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, setValue, watch } = useForm()

  const [userData, setUserData] = useState({})
  const navigate = useNavigate()

  const id = propsdata.userid.id
  useEffect(() => {
    getUserData()
  }, [])
  async function getUserData() {
    let api = await get(`/v1/admin/users/${id}`)
    console.log(api)

    if (response.ok) {
      if (api.data) {
        setValue('name', api.data.user.name)
        setValue('email', api.data.user.email)
        setValue('mobile_number', api.data.user.mobile_number)
        setValue('username', api.data.user.username)
        setValue('password', api.data.user.password)
        setValue('role_id', api.data.user.role.id)
        setValue('assigned_properties', api.data.user.assigned_properties)

        setUsers(api.data.user)
      }
    }
  }
  async function onSubmit(data) {
    const api = await put(`/v1/admin/users/${id}`, { user: data })
    if (response.ok) {
      toast('User Data Edited Successfully')
      setVisible(!visible)
    } else {
      toast(response.data?.message)
    }
  }
  return (
    <>
      <div>
        <button
          style={{
            backgroundColor: 'white',
            marginLeft: '4px',
            width: '90%',
            border: 'none',
            color: '#00bfcc',
          }}
          type="button"
          className="btn btn-tertiary "
          data-mdb-ripple-init
          onClick={() => setVisible(!visible)}
        >
          Edit
        </button>
        <CModal
          alignment="center"
          size="xl"
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">Edit User</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col className="pr-1" md="6">
                    <Form.Group>
                      <label>Name</label>
                      <Form.Control
                        defaultValue={users.name}
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
                      <label>Role</label>
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
    </>
  )
}
