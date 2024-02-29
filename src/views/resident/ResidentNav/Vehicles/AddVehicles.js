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

export default function AddBillable({ after_submit, residentId }) {
  const { register, handleSubmit, control } = useForm()
  const { get, post, response, api } = useFetch()

  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  async function onSubmit(data) {
    console.log(data)
    const apiResponse = await post(`/v1/admin/members/${residentId}/vehicles`, {
      vehicle: data,
    })
    if (response.ok) {
      setVisible(!visible)
      after_submit()
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

  return (
    <div>
      <button
        type="button"
        className="btn s-3 custom_theme_button "
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Add
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
          <CModalTitle id="StaticBackdropExampleLabel">Add Vehicles</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Brand name
                      <small className="text-danger"> *{errors ? errors.brand_name : null} </small>
                    </label>
                    <Form.Control type="integer" {...register('brand_name')}></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Registration No.
                      <small className="text-danger">
                        {' '}
                        *{errors ? errors.registration_no : null}
                      </small>
                    </label>

                    <Form.Control type="text" {...register('registration_no')}></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Built Year
                      <small className="text-danger ">{errors ? errors.year_built : null}</small>
                    </label>
                    <Form.Control type="text" {...register('year_built')}></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Color
                      <small className="text-danger ">{errors ? errors.color : null}</small>
                    </label>

                    <Form.Control type="integer" {...register('color')}></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Tag No.
                      <small className="text-danger ">{errors ? errors.tag_no : null}</small>
                    </label>

                    <Form.Control type="integer" {...register('tag_number')}></Form.Control>
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

AddBillable.propTypes = {
  after_submit: PropTypes.func,
  residentId: PropTypes.number,
}
