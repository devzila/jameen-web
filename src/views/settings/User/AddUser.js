import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { Button, Form, Row, Col } from 'react-bootstrap'
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
import { cleanAvatar } from 'src/services/CommonFunctions'

export default function UserForm({ after_submit }) {
  const [visible, setVisible] = useState(false)
  const [imageView, setImageView] = useState('')
  const [properties_data, setProperties_data] = useState([])
  const [roles_data, setRoles_data] = useState([])
  const [errors, setErrors] = useState({})

  const { register, handleSubmit, control, reset } = useForm()
  const { get, post, response } = useFetch()

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

  let properties_array = []
  function trimProperties(properties) {
    properties.forEach((element) => {
      properties_array.push({ value: element.id, label: element.name })
    })
    return properties_array
  }
  //fetch properties
  async function fetchProperties() {
    const api = await get('/v1/admin/premises/properties')
    if (response.ok) {
      setProperties_data(trimProperties(api.data))
    }
  }

  useEffect(() => {
    fetchProperties()
    fetchRoles()
  }, [])

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

  //post method
  async function onSubmit(data) {
    const assigned_properties_data =
      data?.property_ids?.length > 0 ? data.property_ids.map((element) => element.value) : []

    const body = { ...data, property_ids: assigned_properties_data, avatar: { data: imageView } }
    const processed_data = cleanAvatar(body)
    await post(`/v1/admin/users`, { user: processed_data })
    if (response.ok) {
      toast('user added Successfully')
      after_submit()
      reset()

      setVisible(!visible)
    } else {
      setErrors(response.data.errors)
      toast(response.data?.message)
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn flex s-3 custom_theme_button"
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Add User
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
          <CModalTitle id="StaticBackdropExampleLabel">Add User </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <div className="col text-center">
                  <img
                    alt="Avatar Image"
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
                      imageView ? imageView : 'https://bootdey.com/img/Content/avatar/avatar7.png'
                    }
                    data-original-title="Usuario"
                  />
                </div>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="2">
                  <Form.Group className="mt-4 form-check form-switch">
                    <label>Active</label>

                    <Form.Control
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      defaultChecked={true}
                      {...register('active')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Name
                      <small className="text-danger"> *{errors ? errors.name : null} </small>
                    </label>
                    <Form.Control
                      placeholder="Full Name"
                      type="text"
                      {...register('name')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
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
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Email
                      <small className="text-danger"> *{errors ? errors.email : null} </small>
                    </label>
                    <Form.Control
                      placeholder="abc@example.com"
                      type="text"
                      {...register('email')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Password
                      <small className="text-danger"> *{errors ? errors.password : null} </small>
                    </label>
                    <Form.Control
                      placeholder="Password"
                      type="password"
                      {...register('password')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Phone No{' '}
                      <small className="text-danger">
                        {' '}
                        *{errors ? errors.mobile_number : null}{' '}
                      </small>
                    </label>
                    <Form.Control
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
                      name="property_ids"
                      render={({ field }) => (
                        <Select
                          isMulti
                          type="text"
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

              <Row>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>
                      Role
                      <small className="text-danger"> *{errors ? errors.role : null} </small>
                    </label>
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
                  <Button
                    data-mdb-ripple-init
                    type="submit"
                    className="btn custom_theme_button btn-primary btn-block"
                  >
                    Submit
                  </Button>
                  <CButton
                    className="custom_grey_button"
                    color="secondary"
                    onClick={() => setVisible(false)}
                  >
                    Close
                  </CButton>
                </CModalFooter>
              </div>
            </Form>
            <div className="clearfix"></div>
          </CContainer>
        </CModalBody>
      </CModal>
    </div>
  )
}

UserForm.propTypes = {
  after_submit: PropTypes.func,
}
