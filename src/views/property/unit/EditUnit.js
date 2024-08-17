import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
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
import { Button, Form, Row, Col } from 'react-bootstrap'

export default function Edit({ unitId, after_submit }) {
  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, setValue, control } = useForm()
  const { propertyId } = useParams()
  const { get, put, response } = useFetch()
  const [unitData, setUnitData] = useState({})
  const [units_data, setUnits_data] = useState([])

  useEffect(() => {
    getUnitData()
    fetchUnitsTypes() // Assuming you want to populate the unit types for the dropdown
  }, [])

  async function getUnitData() {
    try {
      const api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}`)
      if (response.ok) {
        setUnitData(api.data)
        setValue('unit_no', api.data.unit_no || '-')
        setValue('bedrooms_number', api.data.bedrooms_number || '-')
        setValue('bathrooms_number', api.data.bathrooms_number || '-')
        setValue('year_built', api.data.year_built || '-')
        setValue('status', api.data.status || '-')
        setValue('electricity_account_number', api.data.electricity_account_number || '-')
        setValue('water_account_number', api.data.water_account_number || '-')
        setValue('internal_extension_number', api.data.internal_extension_number || '-')
        setValue('unit_type_id', api.data.unit_type.id)
      } else {
        toast('Unable to load data.')
      }
    } catch (e) {}
  }

  async function fetchUnitsTypes() {
    const api = await get(`/v1/admin/premises/properties/${propertyId}/unit_types`)
    if (response.ok) {
      setUnits_data(trimUnits(api))
    }
  }

  function trimUnits(units) {
    let unit_id_array = []
    units.data.map((e) => {
      unit_id_array.push({ value: e.id, label: e.name })
    })
    return unit_id_array
  }

  async function onSubmit(data) {
    const api = await put(`/v1/admin/premises/properties/${propertyId}/units/${unitId}`, {
      unit: data,
    })
    if (response.ok) {
      toast.success('Unit Data Edited Successfully')
      after_submit()
      setVisible(false)
    } else {
      toast.error(response.data?.message || 'Failed to edit unit data')
    }
  }

  return (
    <>
      <div>
        <button
          type="button"
          className="btn custom_theme_button"
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
          onClose={() => setVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">Edit Unit</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Unit Type</label>
                      <Controller
                        name="unit_type_id"
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={units_data}
                            value={units_data.find((c) => c.value === field.value)}
                            onChange={(val) => field.onChange(val.value)}
                          />
                        )}
                        control={control}
                      />
                    </Form.Group>
                  </Col>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Unit Number</label>
                      <Form.Control
                        defaultValue={unitData.unit_no}
                        type="integer"
                        {...register('unit_no')}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Bedroom Number</label>
                      <Form.Control
                        type="integer"
                        defaultValue={unitData.bedrooms_number}
                        {...register('bedrooms_number')}
                      />
                    </Form.Group>
                  </Col>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Bathroom Number</label>
                      <Form.Control
                        defaultValue={unitData.bathrooms_number}
                        type="integer"
                        {...register('bathrooms_number')}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Year Built</label>
                      <Form.Control
                        defaultValue={unitData.year_built}
                        type="integer"
                        {...register('year_built')}
                      />
                    </Form.Group>
                  </Col>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Status</label>
                      <Form.Control
                        defaultValue={unitData.status}
                        type="text"
                        {...register('status')}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Electricity Account Number</label>
                      <Form.Control
                        defaultValue={unitData.electricity_account_number}
                        type="string"
                        {...register('electricity_account_number')}
                      />
                    </Form.Group>
                  </Col>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Water Account Number</label>
                      <Form.Control
                        defaultValue={unitData.water_account_number}
                        type="string"
                        {...register('water_account_number')}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Internal Extension Number</label>
                      <Form.Control
                        defaultValue={unitData.internal_extension_number}
                        type="string"
                        {...register('internal_extension_number')}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Modal part 2 role */}
                <div className="text-center">
                  <CModalFooter>
                    <Button
                      data-mdb-ripple-init
                      type="submit"
                      className="btn btn-primary btn-block custom_theme_button"
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
                <div className="clearfix"></div>
              </Form>
            </CContainer>
          </CModalBody>
        </CModal>
      </div>
    </>
  )
}

Edit.propTypes = {
  unitId: PropTypes.string,
  after_submit: PropTypes.func,
}
