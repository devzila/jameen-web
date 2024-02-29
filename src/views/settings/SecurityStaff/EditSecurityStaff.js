import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
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

export default function EditSecurityStaff({ after_submit, id }) {
  const { register, handleSubmit, setValue } = useForm()
  const { get, put, response } = useFetch()

  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchSecurityStaff()
  }, [])

  async function fetchSecurityStaff() {
    try {
      const securityStaffData = await get(`/v1/admin/security_staffs/${id}`)
      console.log(securityStaffData)
      if (securityStaffData && securityStaffData.data) {
        setValue('name', securityStaffData.data.name)
        setValue('email', securityStaffData.data.email)
        setValue('mobile_number', securityStaffData.data.mobile_number)
        setValue('username', securityStaffData.data.username)
      }
    } catch (error) {
      console.error('Error fetching Security Staff:', error)
    }
  }

  async function onSubmit(data) {
    console.log(data)
    await put(`/v1/admin/security_staffs/${id}`, {
      security_staff: data,
    })
    if (response.ok) {
      setVisible(!visible)
      after_submit()
      toast('Staff added successfully')
    } else {
      setErrors(response.data.errors)
      toast(response.data?.message)
    }
  }
  function handleClose() {
    setVisible(false)
    setErrors({})
  }

  return (
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
        onClose={handleClose}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Edit Security Staff</CModalTitle>
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
                      <small className="text-danger">{errors ? errors.mobile_number : null}</small>
                    </label>

                    <Form.Control type="text" {...register('mobile_number')}></Form.Control>
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

EditSecurityStaff.propTypes = {
  after_submit: PropTypes.func,
  id: PropTypes.number,
}
