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
  const { get, post, response } = useFetch()
  const { propertyId } = useParams()
  const [visible, setVisible] = useState(false)
  const [unitData, setUnitData] = useState({})
  const [errors, setErrors] = useState({})
  const [units_data, setUnits_data] = useState([])
  const [buildings_data, setBuildings_data] = useState([])
  // =========================
  // BUILDINGS
  // =========================
  function trimBuildings(buildings) {
    if (buildings) {
      return buildings.map((e) => ({
        value: e?.id,
        label: e?.name,
      }))
    }
    return []
  }
  async function fetchBuildings() {
    const apiResponse = await get(`/v1/admin/premises/properties/${propertyId}/buildings`)
    if (response.ok && apiResponse.data) {
      setBuildings_data(trimBuildings(apiResponse.data))
    } else {
      setBuildings_data([])
    }
  }
  // =========================
  // UNIT TYPES
  // =========================
  async function fetchUnits() {
    const apiResponse = await get(`/v1/admin/premises/properties/${propertyId}/unit_types`)

    if (response.ok && apiResponse.data) {
      const formattedData = apiResponse.data.map((e) => ({
        value: e.id,
        label: e.name,
      }))

      setUnits_data(formattedData)
    } else {
      setUnits_data([])
    }
  }
  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    fetchUnits()
    fetchBuildings()
  }, [])
  // =========================
  // SUBMIT FORM
  // =========================
  async function onSubmit(data) {
    const apiResponse = await post(`/v1/admin/premises/properties/${propertyId}/units`, {
      unit: data,
    })
    if (response.ok) {
      setVisible(false)
      setErrors({})
      after_submit()
      toast.success('Unit added successfully')
    } else {
      setErrors(response.data?.errors || {})
      toast.error(response.data?.message || 'Something went wrong')
    }
  }
  // =========================
  // CLOSE MODAL
  // =========================
  function handleClose() {
    setVisible(false)
    setErrors({})
  }
  return (
    <div>
      <button
        type="button"
        className="btn s-3 custom_theme_button"
        onClick={() => setVisible(true)}
      >
        Add
      </button>
      <CModal
        alignment="center"
        size="xl"
        visible={visible}
        backdrop="static"
        onClose={handleClose}
      >
        <CModalHeader>
          <CModalTitle>Add Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              {/* ROW 1 */}
              <Row>
                {/* UNIT TYPE */}
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Unit Type
                      <small className="text-danger">*{errors?.unit_type_id}</small>
                    </label>
                    <Controller
                      name="unit_type_id"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          className="basic-multi-select"
                          classNamePrefix="select"
                          options={units_data}
                          placeholder="Select Unit Type"
                          value={units_data.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val ? val.value : '')}
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
                {/* UNIT NUMBER */}
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Unit Number
                      <small className="text-danger">*{errors?.unit_no}</small>
                    </label>
                    <Form.Control
                      defaultValue={unitData.no}
                      type="number"
                      {...register('unit_no')}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* ROW 2 */}
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Bathroom No.</label>
                    <Form.Control
                      defaultValue={unitData.bathrooms_number}
                      type="number"
                      {...register('bathrooms_number')}
                    />
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Year Built
                      <small className="text-danger">*{errors?.year_built}</small>
                    </label>
                    <Form.Control
                      defaultValue={unitData.year_built}
                      type="number"
                      {...register('year_built')}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* ROW 3 */}
              <Row>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>
                      Building
                      <small className="text-danger">*{errors?.building_id}</small>
                    </label>
                    <Controller
                      name="building_id"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          className="basic-multi-select"
                          classNamePrefix="select"
                          options={buildings_data}
                          placeholder="Select Building"
                          value={buildings_data.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val ? val.value : '')}
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* ROW 4 */}
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Bedroom No.</label>
                    <Form.Control
                      defaultValue={unitData.bedrooms_number}
                      type="number"
                      {...register('bedrooms_number')}
                    />
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Electricity Account No.</label>
                    <Form.Control
                      defaultValue={unitData.electricity_account_number}
                      type="text"
                      {...register('electricity_account_number')}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* ROW 5 */}
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Water Account No.</label>
                    <Form.Control
                      defaultValue={unitData.water_account_number}
                      type="text"
                      {...register('water_account_number')}
                    />
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Internal Extension No.</label>
                    <Form.Control
                      defaultValue={unitData.internal_extension_number}
                      type="text"
                      {...register('internal_extension_number')}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* FOOTER */}
              <div className="text-center">
                <CModalFooter>
                  <Button type="submit" className="btn btn-primary btn-block custom_theme_button">
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
