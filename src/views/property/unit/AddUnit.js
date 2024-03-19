import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Form, Row, Col } from 'react-bootstrap'
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

function Add({ after_submit }) {
  const { register, handleSubmit, control } = useForm()
  const { get, post, response, api } = useFetch()

  const { propertyId } = useParams()
  const [visible, setVisible] = useState(false)
  const [unitData, setUnitData] = useState({})
  const [errors, setErrors] = useState({})
  const [units_data, setUnits_data] = useState([])
  const [buildings_data, setBuildings_data] = useState([])

  function trimUnits(units) {
    if (units && units.data) {
      return units.data.map((e) => ({
        value: e.unit_type.id,
        label: e.unit_type.name,
      }))
    } else {
      return []
    }
  }

  function trimBuildings(buildings) {
    if (buildings) {
      return buildings.map((e) => ({
        value: e?.id,
        label: e?.name,
      }))
    } else {
      return []
    }
  }

  async function fetchBuildings() {
    const api = await get(`/v1/admin/premises/properties/${propertyId}/buildings`)
    if (response.ok && api.data) {
      setBuildings_data(trimBuildings(api.data))
    } else {
    }
  }

  async function fetchUnits() {
    const api = await get(`/v1/admin/premises/properties/${propertyId}/units`)
    if (response.ok && api.data) {
      setUnits_data(trimUnits(api))
    } else {
    }
  }

  useEffect(() => {
    fetchUnits()
    fetchBuildings()
  }, [])

  async function onSubmit(data) {
    const apiResponse = await post(`/v1/admin/premises/properties/${propertyId}/units`, {
      unit: data,
    })
    if (response.ok) {
      setVisible(!visible)
      after_submit()
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
          <CModalTitle id="StaticBackdropExampleLabel">Add Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Unit-Number
                      <small className="text-danger"> *{errors ? errors.unit_no : null} </small>
                    </label>
                    <Form.Control
                      defaultValue={unitData.no}
                      type="integer"
                      {...register('unit_no')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Bedroom No.</label>

                    <Form.Control
                      defaultValue={unitData.bedrooms_number}
                      type="integer"
                      {...register('bedrooms_number')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Bathroom No.</label>
                    <Form.Control
                      defaultValue={unitData.bathrooms_number}
                      type="integer"
                      {...register('bathrooms_number')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Year Built{' '}
                      <small className="text-danger "> *{errors ? errors.year_built : null} </small>
                    </label>

                    <Form.Control
                      defaultValue={unitData.year_built}
                      type="integer"
                      {...register('year_built')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Unit Type{' '}
                      <small className="text-danger"> *{errors ? errors.unit_type : null} </small>
                    </label>

                    <Controller
                      name="unit_type_id"
                      render={({ field }) => (
                        <Select
                          type="text"
                          className="basic-multi-select"
                          classNamePrefix="select"
                          {...field}
                          value={units_data.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                          options={units_data}
                        />
                      )}
                      control={control}
                    />
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Electricity Account No.</label>

                    <Form.Control
                      defaultValue={unitData.electricity_account_number}
                      type="string"
                      {...register('electricity_account_number')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Water Account No.</label>
                    <Form.Control
                      defaultValue={unitData.water_account_number}
                      type="string"
                      {...register('water_account_number')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Internal Extension No.</label>
                    <Form.Control
                      defaultValue={unitData.internal_extension_number}
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
                          value={buildings_data.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                          options={buildings_data}
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
            <div className="clearfix"></div>
          </CContainer>
        </CModalBody>
      </CModal>
    </div>
  )
}

export default Add

Add.propTypes = {
  after_submit: PropTypes.func,
}
