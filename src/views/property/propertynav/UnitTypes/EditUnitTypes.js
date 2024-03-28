import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
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

export default function EditUnitTypes({ after_submit, id }) {
  const { register, handleSubmit, control, setValue } = useForm()
  const { get, put, response } = useFetch()

  const { propertyId } = useParams()
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState({})
  const [unit_type, setUnit_type] = useState()

  function fetchLocalData() {
    const temp_use_type = JSON.parse(localStorage.getItem('meta'))

    const temp2_unit_type = Object.entries(temp_use_type.property_use_types).map((x) => ({
      value: x[0],
      label: x[0],
    }))
    setUnit_type(temp2_unit_type)
  }

  //   { value: 'residential', label: 'residential' },
  //   { value: 'commercial', label: 'commercial' },
  //   { value: 'mixed', label: 'mixed' }

  // use_type: 'residential',

  console.log(unit_type)
  React.useEffect(() => {
    loadUnitsTypes()
    fetchLocalData()
  }, [])

  async function loadUnitsTypes() {
    let endpoint = await get(`/v1/admin/premises/properties/${propertyId}/unit_types/${id}`)
    console.log(endpoint)

    if (response.ok) {
      setValue('name', endpoint?.data?.name)
      setValue('description', endpoint.data.description)
      setValue('use_type', endpoint?.data?.use_type)
      setValue('sqft', endpoint?.data?.sqft)
      setValue(
        'monthly_maintenance_amount_per_sqft',
        endpoint?.data?.monthly_maintenance_amount_per_sqft,
      )
    }
  }

  async function onSubmit(data) {
    console.log(data)
    const apiResponse = await put(`/v1/admin/premises/properties/${propertyId}/unit_types/${id}`, {
      unit_type: data,
    })
    console.log(apiResponse)
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
        className="tooltip_button text-nowrap"
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
          <CModalTitle id="StaticBackdropExampleLabel">Edit Unit Types </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
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
                    <label>Description</label>

                    <Form.Control type="text" {...register('description')}></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Area (sqft.)
                      <small className="text-danger ">*{errors ? errors.sqft : null}</small>
                    </label>
                    <Form.Control type="integer" {...register('sqft')}></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Monthly Maintenace Amout / SQFT.
                      <small className="text-danger ">
                        *{errors ? errors.monthly_maintenance_amount_per_sqft : null}
                      </small>
                    </label>

                    <Form.Control
                      type="integer"
                      {...register('monthly_maintenance_amount_per_sqft')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>
                      Use Type
                      <small className="text-danger"> *{errors ? errors.use_type : null} </small>
                    </label>

                    <Controller
                      name="use_type"
                      render={({ field }) => (
                        <Select
                          type="text"
                          className="basic-multi-select"
                          classNamePrefix="select"
                          {...field}
                          value={unit_type.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                          options={unit_type}
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

EditUnitTypes.propTypes = {
  after_submit: PropTypes.func,
  id: PropTypes.number,
}
