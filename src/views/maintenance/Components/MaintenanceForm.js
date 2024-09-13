import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button, Form, Row, Col } from 'react-bootstrap'
import Select from 'react-select'
import PropTypes from 'prop-types'

import { CContainer, CModalFooter, CButton } from '@coreui/react'

export default function MaintenanceForm() {
  const { register, handleSubmit, control } = useForm()
  const { get, post, response, api } = useFetch()

  const [visible, setVisible] = useState(false)
  const [data, setdata] = useState({})
  const [errors, setErrors] = useState({})
  const [units_data, setUnits_data] = useState([])
  const [buildings_data, setBuildings_data] = useState([])

  async function onSubmit(data) {
    console.log('triggerd')
    const apiResponse = await post(`/v1/admin/premises/properties`, {
      unit: data,
    })
    if (response.ok) {
      setVisible(!visible)
      // after_submit()
      toast('Unit added successfully')
    } else {
      setErrors(response.data.errors)
      toast(response.data?.message)
    }
  }
  function handleClose() {
    setVisible(false)
    setErrors({})
  }

  //
  return (
    <>
      <CContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col className="pr-1 mt-3" md="6">
              <Form.Group>
                <label>
                  Property
                  <small className="text-danger"> *{errors ? errors.unit_no : null} </small>
                </label>
                <Form.Control
                  defaultValue={data.no}
                  type="integer"
                  {...register('property')}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col className="pr-1 mt-3" md="6">
              <Form.Group>
                <label>Request Type </label>

                <Form.Control
                  defaultValue={data.b}
                  type="integer"
                  {...register('request_type')}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className="pr-1 mt-3" md="6">
              <Form.Group>
                <label>Unit No.</label>
                <Form.Control
                  defaultValue={data.b}
                  type="integer"
                  {...register('unit_no')}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col className="pr-1 mt-3" md="6">
              <Form.Group>
                <label>
                  Tenant
                  <small className="text-danger "> *{errors ? errors.year_built : null} </small>
                </label>

                <Form.Control
                  defaultValue={data.year_built}
                  type="integer"
                  {...register('tenant')}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className="pr-1 mt-3" md="6">
              <Form.Group>
                <label>
                  Available Date
                  <small className="text-danger"> *{errors ? errors.unit_type : null} </small>
                </label>

                <Form.Control
                  defaultValue={data.year_built}
                  type="date"
                  {...register('available_date')}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col className="pr-1 mt-3" md="6">
              <Form.Group>
                <label>Available Time</label>

                <Form.Control
                  defaultValue={data.b}
                  type="time"
                  {...register('avialable_time')}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className="pr-1 mt-3" md="6">
              <Form.Group>
                <label>Required authorization to enter ?</label>
                <Form.Control
                  defaultValue={data.x}
                  type="radio"
                  {...register('authorization')}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col className="pr-1 mt-3" md="6">
              <Form.Group>
                <label>Internal Extension No.</label>
                <Form.Control
                  defaultValue={data.x}
                  type="string"
                  {...register('internal_extension_number')}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col className="pr-1 mt-3" md="12">
              <Form.Group>
                <label>
                  Building
                  <small className="text-danger"> *{errors ? errors.building_id : null} </small>
                </label>

                <Controller
                  name="building_id"
                  render={({ field }) => (
                    <Select
                      type="text"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      {...field}
                      value={[].find((c) => c.value === field.value)}
                      onChange={(val) => field.onChange(val.value)}
                      options={[]}
                    />
                  )}
                  control={control}
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
      </CContainer>
    </>
  )
}
