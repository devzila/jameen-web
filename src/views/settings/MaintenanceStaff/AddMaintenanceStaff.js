import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button, Form, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
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

export default function AddMaintenanceStaff({ after_submit }) {
  const { register, handleSubmit, control, reset } = useForm()
  const { post, get, response } = useFetch()

  const [properties_data, setProperties_data] = useState([])

  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState({})

  async function onSubmit(data) {
    const assigned_properties_data =
      data?.property_ids?.length > 0 ? data.property_ids.map((element) => element.value) : []

    const body = { ...data, property_ids: assigned_properties_data }
    await post(`/v1/admin/maintenance_staffs`, {
      maintenance_staff: body,
    })
    if (response.ok) {
      setVisible(!visible)
      after_submit()
      reset()

      toast('Item added successfully')
    } else {
      setErrors(response.data.errors)
      toast(response.data?.message)
    }
  }
  function handleClose() {
    setVisible(false)
    setErrors({})
  }

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
  }, [])

  return (
    <div>
      <button
        type="button"
        className="btn s-3 custom_theme_button "
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Add Staff
      </button>
      <CModal
        alignment="center"
        size="xl"
        visible={visible}
        backdrop="static"
        onClose={handleClose}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Add Maintenance Staff</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col className="pr-1 " md="2">
                  <Form.Group className=" form-check form-switch">
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
                    <Form.Control type="text" {...register('name')}></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Email
                      <small className="text-danger"> *{errors ? errors.email : null}</small>
                    </label>

                    <Form.Control type="text" {...register('email')}></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Username
                      <small className="text-danger ">*{errors ? errors.username : null}</small>
                    </label>
                    <Form.Control type="text" {...register('username')}></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Password
                      <small className="text-danger ">{errors ? errors.password : null}</small>
                    </label>
                    <Form.Control type="password" {...register('password')}></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Mobile No.
                      <small className="text-danger">*{errors ? errors.mobile_number : null}</small>
                    </label>

                    <Form.Control type="text" {...register('mobile_number')}></Form.Control>
                  </Form.Group>
                </Col>
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

              <div className="text-center">
                <CModalFooter>
                  <Button
                    data-mdb-ripple-init
                    type="submit"
                    className="btn  btn-primary btn-block custom_theme_button"
                  >
                    Submit
                  </Button>
                  <CButton
                    className="custom_grey_button"
                    color="secondary"
                    style={{ border: '0px', color: 'white' }}
                    onClick={handleClose}
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

AddMaintenanceStaff.propTypes = {
  after_submit: PropTypes.func,
}
