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

export default function AddBillable({ after_submit, unittypeID }) {
  const { register, handleSubmit, control } = useForm()
  const { get, post, response, api } = useFetch()

  const { propertyId } = useParams()
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const [units_data, setUnits_data] = useState([])

  const vat_array = Array.from({ length: 30 }, (v, i) => ({ value: i + 1, label: i + 1 }))
  const billable_array = [
    { value: 'fixed', label: 'Fixed' },
    { value: 'percentage', label: 'Percentage' },
  ]

  async function onSubmit(data) {
    const apiResponse = await post(
      `/v1/admin/premises/properties/${propertyId}/unit_types/${unittypeID}/billable_items`,
      {
        billable_item: data,
      },
    )
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
          <CModalTitle id="StaticBackdropExampleLabel">Add Item</CModalTitle>
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
                    <Form.Control type="integer" {...register('name')}></Form.Control>
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
                      Monthly Amount{' '}
                      <small className="text-danger ">
                        *{errors ? errors.monthly_amount : null}
                      </small>
                    </label>
                    <Form.Control type="integer" {...register('monthly_amount')}></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      VAT Percentage
                      <small className="text-danger ">*{errors ? errors.vat_percent : null}</small>
                    </label>{' '}
                    <Controller
                      name="vat_percent"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={vat_array}
                          value={vat_array.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                        />
                      )}
                      control={control}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>
                      Billable Type
                      <small className="text-danger"> *{errors ? errors.building_id : null} </small>
                    </label>

                    <Controller
                      name="billable_type"
                      render={({ field }) => (
                        <Select
                          type="text"
                          className="basic-multi-select"
                          classNamePrefix="select"
                          {...field}
                          value={billable_array.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                          options={billable_array}
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

AddBillable.propTypes = {
  after_submit: PropTypes.func,
  unittypeID: PropTypes.number,
}
