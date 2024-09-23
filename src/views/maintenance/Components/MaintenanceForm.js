import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button, Form, Row, Col } from 'react-bootstrap'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { CContainer, CModalFooter, CButton } from '@coreui/react'
import { formatdate, format_react_select } from 'src/services/CommonFunctions'

export default function MaintenanceForm({ handleClose, data_array, refreshData }) {
  const { register, handleSubmit, control, setValue } = useForm()
  const { get, post, response, api } = useFetch()

  const [visible, setVisible] = useState(false)
  const [edit_data, setEditdata] = useState({})
  const [errors, setErrors] = useState({})
  const [properties, setProperties] = useState([])
  const [units_data, setUnits_data] = useState([])
  const [maintenance_cat, setMaintenance_cat] = useState([])

  const [users, setUsers] = useState([])

  useEffect(() => {
    getProperties()
    getMaintenanceCategories()
    getUsers()
    if (data_array[0] === 'edit') {
      getRequestData(data_array[1])
    }
  }, [])
  async function onSubmit(data) {
    const apiResponse = await post(`/v1/admin/maintenance/requests`, {
      request: data,
    })
    if (response.ok) {
      setVisible(!visible)
      handleClose()
      refreshData()
      toast.success('Request Created Successfully')
    } else {
      setErrors(response.data.errors)
      toast(response.data?.message)
    }
  }

  const getProperties = async () => {
    const api = await get(`/v1/admin/premises/properties?limit=-1`)
    if (response.ok) {
      setProperties(format_react_select(api.data, ['id', 'name']))
    }
  }
  const getMaintenanceCategories = async () => {
    const api = await get(`/v1/admin/maintenance/categories?limit=-1`)
    if (response.ok) {
      setMaintenance_cat(format_react_select(api.data, ['id', 'name']))
    }
  }

  const getUsers = async () => {
    const api = await get(`/v1/admin/users?limit=-1`)
    if (response.ok) {
      setUsers(format_react_select(api.data, ['id', 'name']))
    }
  }

  const loadUnits = async (id) => {
    const api = await get(`/v1/admin/premises/properties/${id}/units?limit=-1`)
    if (response.ok) {
      setUnits_data(format_react_select(api.data, ['id', 'unit_no']))
    }
  }

  const getRequestData = async (id) => {
    const api = await get(`/v1/admin/maintenance/requests/${id}`)
    if (response.ok) {
      setEditdata(api.data)
      setValue('category_id', api.data.category.id)
      setValue('property_id', api.data.property_id)
      setValue('assigned_user_id', api.data.assigned_user_id)
    }
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
                  <small className="text-danger"> *{errors ? errors.building_id : null} </small>
                </label>

                <Controller
                  name="property_id"
                  render={({ field }) => (
                    <Select
                      type="text"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      {...field}
                      value={properties.find((c) => c.value === field.value)}
                      onChange={(val) => {
                        field.onChange(val.value)
                        loadUnits(val.value)
                      }}
                      options={properties}
                    />
                  )}
                  control={control}
                />
              </Form.Group>
            </Col>
            <Col className="pr-1 mt-3" md="6">
              <Form.Group>
                <label>
                  Maintenance Category
                  <small className="text-danger"> *{errors ? errors.building_id : null} </small>
                </label>

                <Controller
                  name="category_id"
                  render={({ field }) => (
                    <Select
                      type="text"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      {...field}
                      value={maintenance_cat.find((c) => c.value === field.value)}
                      onChange={(val) => field.onChange(val.value)}
                      options={maintenance_cat}
                    />
                  )}
                  control={control}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className="pr-1 mt-3" md="6">
              <Form.Group>
                <label>
                  Unit No
                  <small className="text-danger"> *{errors ? errors.building_id : null} </small>
                </label>

                <Controller
                  name="unit_id"
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
                <label>
                  Assigned User
                  <small className="text-danger"> *{errors ? errors.building_id : null} </small>
                </label>

                <Controller
                  name="assigned_user_id"
                  render={({ field }) => (
                    <Select
                      type="text"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      {...field}
                      value={users.find((c) => c.value === field.value)}
                      onChange={(val) => field.onChange(val.value)}
                      options={users}
                    />
                  )}
                  control={control}
                />
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
                  defaultValue={edit_data.available_date}
                  type="date"
                  {...register('available_date')}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col className="pr-1 mt-3" md="6">
              <Form.Group>
                <label>Available Time</label>

                <Form.Control
                  defaultValue={edit_data.avialable_time}
                  type="time"
                  {...register('avialable_time')}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            {/* <Col className="pr-1 mt-3" md="6">
              <Form.Group className="mt-4 form-check form-switch">
                <label></label>

                <Form.Control
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  defaultChecked={true}
                  {...register('maintainable_id')}
                ></Form.Control>
              </Form.Group>
            </Col> */}
            <Col className="pr-1 mt-3" md="6">
              <Form.Group>
                <label>Title</label>
                <Form.Control
                  defaultValue={edit_data.title}
                  type="string"
                  {...register('title')}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col className="pr-1 mt-3" md="12">
              <Form.Group>
                <label>Description</label>
                <Form.Control
                  defaultValue={edit_data.description}
                  type="string"
                  {...register('description')}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
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

MaintenanceForm.propTypes = {
  handleClose: PropTypes.func,
  data_array: PropTypes.array,
  refreshData: PropTypes.func,
}
