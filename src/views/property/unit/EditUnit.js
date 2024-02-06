import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
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
import { Button, Form, Row, Col } from 'react-bootstrap'

export default function Edit(propsdata) {
  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, setValue, control } = useForm()
  const { propertyId } = useParams()
  const { get, put, response } = useFetch()
  const [unitData, setUnitData] = useState({})
  const [units_data, setUnits_data] = useState([])

  const id = propsdata.unitid.id

  useEffect(() => {
    getUnitData()
    fetchUnits() // Assuming you want to populate the unit types for the dropdown
  }, [])

  async function getUnitData() {
    try {
      const api = await get(`/v1/admin/premises/properties/${propertyId}/units/${id}`)
      if (response.ok) {
        const unit = api.data?.unit || {}
        setUnitData(unit)
        setValue('unit_no', unit.unit_no || '')
        setValue('bedrooms_number', unit.bedrooms_number || '')
        setValue('bathrooms_number', unit.bathrooms_number || '')
        setValue('year_built', unit.year_built || '')
        setValue('status', unit.status || '')
        setValue('electricity_account_number', unit.electricity_account_number || '')
        setValue('water_account_number', unit.water_account_number || '')
        setValue('internal_extension_number', unit.internal_extension_number || '')
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function fetchUnits() {
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
    const api = await put(`/v1/admin/premises/properties/${propertyId}/units/${id}`, { unit: data })
    if (response.ok) {
      toast('Unit Data Edited Successfully')
      setVisible(false)
    } else {
      toast(response.data?.message || 'Failed to edit unit data')
    }
  }

  return (
    <>
      <div>
        <button
          style={{
            backgroundColor: 'white',
            marginLeft: '4px',
            width: '90%',
            border: 'none',
            color: '#00bfcc',
          }}
          type="button"
          className="btn btn-tertiary"
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
                            value={units_data.find((c) => c.label === unitData.unit_type_name)}
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
                      className="btn btn-primary btn-block"
                      style={{ marginTop: '5px', backgroundColor: '#00bfcc', border: 'none' }}
                    >
                      Submit
                    </Button>
                    <CButton
                      style={{ color: 'white', backgroundColor: 'gray', border: 'none' }}
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