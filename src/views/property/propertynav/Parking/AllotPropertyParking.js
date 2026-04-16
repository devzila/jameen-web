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
import { useParams } from 'react-router-dom'
import { format_react_select } from 'src/services/CommonFunctions'

export default function AllotPropertyParking({ after_submit }) {
  const [visible, setVisible] = useState(false)
  const [vehicle_array, setVehicle_array] = useState([])
  const [units_array, setUnitsArray] = useState([])
  const [errors, setErrors] = useState({})
  const { propertyId } = useParams()

  const { register, handleSubmit, control, reset } = useForm()
  const { get, post, response } = useFetch()

  useEffect(() => {
    loadUnits()
  }, [])

  async function onSubmit(data) {
    await post(`/v1/admin/premises/properties/${propertyId}/parkings`, { parking: data })
    if (response.ok) {
      toast('Parking Added Successfully')
      after_submit()
      reset()

      setVisible(!visible)
    } else {
      setErrors(response.data.errors)
      toast(response.data?.message)
    }
  }

  const loadUnits = async () => {
    const api = await get(`/v1/admin/premises/properties/${propertyId}/units?limit=-1`)
    if (response.ok) {
      setUnitsArray(format_react_select(api.data, ['id', 'unit_no']))
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
        Add Parking
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
                <Col className="pr-3 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Parking Number
                      <small className="text-danger">
                        *{errors ? errors.parking_number?.join(', ') : null}
                      </small>
                    </label>
                    <Form.Control
                      placeholder="Parking Number"
                      type="text"
                      {...register('parking_number')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Unit
                      <small className="text-danger"> *{errors ? errors.role : null} </small>
                    </label>
                    <Controller
                      name="unit_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={units_array}
                          value={units_array.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                        />
                      )}
                      control={control}
                      placeholder="Role"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Vehicle</label>

                    <Controller
                      name="vehice_id"
                      render={({ field }) => (
                        <Select
                          isMulti
                          type="text"
                          className="basic-multi-select"
                          classNamePrefix="select"
                          {...field}
                          options={vehicle_array}
                        />
                      )}
                      control={control}
                      placeholder="Vehicle Number"
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

AllotPropertyParking.propTypes = {
  after_submit: PropTypes.func,
}
