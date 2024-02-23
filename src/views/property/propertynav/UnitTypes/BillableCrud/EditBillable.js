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

export default function EditBillable({ after_submit, id }) {
  const { register, handleSubmit, control, setValue } = useForm()
  const { get, put, response } = useFetch()

  const { propertyId, unittypeID } = useParams()
  const [visible, setVisible] = useState(false)
  const [unitData, setUnitData] = useState({})
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const [billable_data, setBillable_data] = useState({})

  const billable_array = [
    { value: 'fixed', label: 'Fixed' },
    { value: 'percentage', label: 'Percentage' },
  ]

  useEffect(() => {
    fetchBillableItems()
  }, [propertyId, visible])

  async function fetchBillableItems() {
    try {
      const billableItemsData = await get(
        `/v1/admin/premises/properties/${propertyId}/unit_types/${unittypeID}/billable_items/${id}}`,
      )
      console.log(billableItemsData)
      if (response.ok) {
        setBillable_data(billableItemsData.data)
        setValue('billable_type', billable_data.billable_type)

        console.log(billable_data)
      }
    } catch (error) {
      console.error('Error fetching billable items:', error)
    }
  }

  async function onSubmit(data) {
    console.log(data)
    const apiResponse = await put(
      `/v1/admin/premises/properties/${propertyId}/unit_types/${unittypeID}/billable_items/${id}`,
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
  console.log(billable_data)

  return (
    <div>
      <button
        type="button"
        className="tooltip_button"
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
                    <Form.Control
                      defaultValue={billable_data.name}
                      type="integer"
                      {...register('name')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Description</label>

                    <Form.Control
                      type="text"
                      defaultValue={billable_data.description}
                      {...register('description')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Monthly Amount
                      <small className="text-danger ">
                        *{errors ? errors.monthly_amount : null}
                      </small>
                    </label>
                    <Form.Control
                      type="number"
                      defaultValue={billable_data.monthly_amount}
                      {...register('monthly_amount')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      VAT Percentage
                      <small className="text-danger ">*{errors ? errors.vat_percent : null}</small>
                    </label>

                    <Form.Control
                      type="integer"
                      defaultValue={billable_data.vat_percent}
                      {...register('vat_percent')}
                    ></Form.Control>
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

EditBillable.propTypes = {
  after_submit: PropTypes.func,
  id: PropTypes.number,
  unittypeID: PropTypes.number,
}
