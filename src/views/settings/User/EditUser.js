import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
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
import { Button, Form, Row, Col } from 'react-bootstrap'

export default function EditUser(propsdata) {
  const [users, setUsers] = useState([])
  const { get, put, response } = useFetch()

  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, setValue, watch, control } = useForm()

  const [userData, setUserData] = useState({})
  const [roles, setRoles] = useState([])
  const [properties_data, setProperties_data] = useState([])

  //roles

  let rolesarray = []
  function trimRoles(rolesdata) {
    rolesdata.forEach((element) => {
      rolesarray.push({ value: element.id, label: element.name })
    })
    return rolesarray
  }

  async function fetchRoles() {
    const api = await get('/v1/admin/roles')
    if (response.ok) {
      setRoles(trimRoles(api.data.roles))
    }
  }

  //properties

  let properties_array = []
  function trimProperties(properties) {
    properties.forEach((element) => {
      properties_array.push({ value: element.id, label: element.name + ', ' + element.city })
    })
    return properties_array
  }

  async function fetchProperties() {
    const api = await get('/v1/admin/premises/properties')
    if (response.ok) {
      setProperties_data(trimProperties(api.data.properties))
    }
  }

  const id = propsdata.userid.id

  useEffect(() => {
    getUserData()
    fetchRoles()
    fetchProperties()
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
        setValue('active', api.data.user.active)
        setValue('compounds', api.data.user.compounds)
      }
    }
  }
  async function onSubmit(data) {
    console.log(data)

    const api = await put(`/v1/admin/users/${id}`, { user: data })
    console.log(api)
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
          backdrop="static"
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
                  <Col className="pr-1 mt-1" md="6">
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
                  <Col className="pr-1 mt-4" md="4">
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
                  <Col className="pr-1 mt-3" md="6">
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
                  <Col className="pr-1 mt-3" md="6">
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
                  <Col className="pr-1 mt-3" md="6">
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
                  <Col className="pr-1 mt-3" md="6">
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
                <Row>
                  <Col className="pr-1 mt-3" md="12">
                    <Form.Group>
                      <label>Assigned Properties</label>

                      <Controller
                        name="compounds"
                        render={({ field }) => (
                          <Select
                            isMulti
                            className="basic-multi-select"
                            classNamePrefix="select"
                            {...field}
                            options={properties_data}
                            // value={roles.find((c) => c.value === field.value)}
                            // onChange={(val) => field.onChange(val.value)}
                          />
                        )}
                        control={control}
                        placeholder="Assigned Properties"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {/* Modal part 2 role */}
                <CModalTitle className="mt-3" id="StaticBackdropExampleLabel">
                  Role
                </CModalTitle>

                <Row>
                  <Col className="pr-1 mt-1" md="12">
                    <Form.Group>
                      <Controller
                        name="role_id"
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={roles}
                            value={roles.find((c) => c.value === field.value)}
                            onChange={(val) => field.onChange(val.value)}
                          />
                        )}
                        control={control}
                        placeholder="Role"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="text-center">
                  <CModalFooter>
                    <Button
                      data-mdb-ripple-init
                      type="submit"
                      className="btn  btn-primary btn-block"
                      style={{ marginTop: '5px', backgroundColor: '#00bfcc', border: 'none' }}
                    >
                      Submit
                    </Button>
                    <CButton
                      style={{ color: 'white', backgroundColor: 'gray', border: 'none' }}
                      onClick={() => setVisible(false)}
                    >
                      Close
                    </CButton>
                  </CModalFooter>
                </div>
                <div className="clearfix"></div>
              </Form>
            </CContainer>
          </CModalBody>
        </CModal>
      </div>
    </>
  )
}
