import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'
import PropTypes from 'prop-types'

import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CContainer,
} from '@coreui/react'
import { Button, Form, Row, Col } from 'react-bootstrap'

//function

export default function EditUser({ userId, after_submit }) {
  const [imageView, setImageView] = useState(null)
  const { get, put, patch, response } = useFetch()

  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, setValue, control } = useForm()

  const [userData, setUserData] = useState({})
  const [roles_data, setRoles_data] = useState([])

  const [properties_data, setProperties_data] = useState([])

  //roles

  async function fetchRoles() {
    const api = await get('/v1/admin/roles')
    if (response.ok) {
      setRoles_data(api.data)
    }
  }

  const rolesarray = roles_data.map((element) => ({
    label: element.name.charAt(0).toUpperCase() + element.name.slice(1).replace(/_/g, ' '),
    value: element.id,
  }))

  console.log(rolesarray)
  //properties

  let properties_array = []
  function trimProperties(properties) {
    properties.forEach((element) => {
      properties_array.push({ value: element.id, label: element.name + ', ' + element.city })
    })
    return properties_array
  }

  let selected_properties = []

  function trimProperties2(properties) {
    properties.forEach((element) => {
      selected_properties.push({ value: element.id, label: element.name + ', ' + element.city })
    })
    return selected_properties
  }

  async function fetchProperties() {
    const api = await get('/v1/admin/premises/properties')
    if (response.ok) {
      setProperties_data(trimProperties(api.data))
    }
  }

  useEffect(() => {
    getUserData()
    fetchProperties()
    fetchRoles()
  }, [])

  //Get User Data
  async function getUserData() {
    let api = await get(`/v1/admin/users/${userId}`)
    console.log(api)

    if (response.ok) {
      if (api.data) {
        setValue('name', api.data.name)
        setValue('email', api.data.email)
        setValue('mobile_number', api.data.mobile_number)
        setValue('username', api.data.username)
        setValue('password', api.data.password)
        setValue('role_id', api.data.role.id)
        setValue('active', api.data.active)
        setValue('property_ids', trimProperties2(api.data.properties))
        setValue('avatar', api.data.avatar)
        setUserData(api.data)
      }
    }
  }

  const clearImage = () => {
    setValue('avatar', null)
    setImageView(null)
  }
  //base64
  const handleFileSelection = (e) => {
    const selectedFile = e.target.files[0]

    if (selectedFile) {
      const reader = new FileReader()

      reader.onload = function (e) {
        const base64Result = e.target.result
        setImageView(base64Result)
      }

      reader.readAsDataURL(selectedFile)
    }
  }

  //Form submit ,post
  async function onSubmit(data) {
    const assigned_properties_data = data?.property_ids.map((element) => element.value)
    const body = { ...data, property_ids: assigned_properties_data, avatar: { data: imageView } }

    await patch(`/v1/admin/users/${userId}`, { user: body })
    if (response.ok) {
      toast('User Data Edited Successfully')
      setVisible(!visible)
      after_submit()
    } else {
      toast(response.data?.message)
    }
  }
  return (
    <>
      <div>
        <button
          type="button"
          className="tooltip_button "
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
              <Row>
                <div className="col text-center">
                  <img
                    alt="Avatar"
                    style={{
                      width: '300px',
                      height: '300px',
                      objectFit: 'cover',
                      marginTop: '2%',
                      marginLeft: '4%',
                      borderRadius: '50%',
                    }}
                    title="Avatar"
                    className="img-circle img-thumbnail isTooltip  "
                    src={
                      userData.avatar
                        ? userData.avatar
                        : imageView
                        ? imageView
                        : 'https://bootdey.com/img/Content/avatar/avatar7.png'
                    }
                    data-original-title="Usuario"
                  />
                </div>
              </Row>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Name</label>
                      <Form.Control
                        // defaultValue={users.name}
                        placeholder="Full Name"
                        type="text"
                        {...register('name')}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1 mt-3" md="5">
                    <Form.Group>
                      <label>Avatar Image</label>
                      <Form.Control
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        {...register('avatar')}
                        onChange={(e) => handleFileSelection(e)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md="1"></Col>
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
                  <Col className="pr-1 mt-3" md="4">
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
                  <Col className="pr-1 mt-4" md="2">
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
                  <Col className="pr-1 mt-3" md="12">
                    <Form.Group>
                      <label>Assigned Properties</label>

                      <Controller
                        name="property_ids"
                        render={({ field }) => (
                          <Select
                            defaultValue={selected_properties}
                            isMulti
                            className="basic-multi-select"
                            classNamePrefix="select"
                            {...field}
                            options={properties_data}
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
                            options={rolesarray}
                            value={rolesarray.find((c) => c.value === field.value)}
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
                    <Button data-mdb-ripple-init type="submit" className="custom_theme_button">
                      Submit
                    </Button>
                    <CButton className="custom_grey_button" onClick={() => setVisible(false)}>
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

EditUser.propTypes = {
  userId: PropTypes.number.isRequired,
  after_submit: PropTypes.func,
}
