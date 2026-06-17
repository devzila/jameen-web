import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button, Form, Row, Col, Modal } from 'react-bootstrap'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { format_react_select } from 'src/services/CommonFunctions'
import { useParams } from 'react-router-dom'

const THEME_COLOR = '#00bfcc'
const labelStyle = { fontWeight: 600, color: '#1f2933' }
const cardStyle = {
  background: '#f8fafc',
  border: '1px solid #eef1f5',
  borderRadius: '14px',
  padding: '18px',
}

function SectionTitle({ children }) {
  return (
    <div className="d-flex align-items-center mb-3" style={{ gap: '8px' }}>
      <span
        style={{ width: '4px', height: '18px', background: THEME_COLOR, borderRadius: '2px' }}
      />
      <h6 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
        {children}
      </h6>
    </div>
  )
}

SectionTitle.propTypes = {
  children: PropTypes.node,
}

export default function MaintenanceForm({ handleClose, data_array, refreshData }) {
  const { propertyId } = useParams()
  const isEdit = data_array[0] === 'edit'

  const { register, handleSubmit, control, setValue } = useForm()
  const { get, post, put, response } = useFetch()

  const [edit_data, setEditdata] = useState({})
  const [errors, setErrors] = useState({})
  const [properties, setProperties] = useState([])
  const [units_data, setUnits_data] = useState([])
  const [maintenance_cat, setMaintenance_cat] = useState([])
  const [users, setUsers] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getProperties()
    getMaintenanceCategories()
    getUsers()
    if (isEdit) {
      getRequestData(data_array[1])
    }
  }, [])

  function fieldError(name) {
    const message = errors?.[name]?.[0] || (errors?.[name] && String(errors[name]))
    if (!message) return null
    return (
      <small className="text-danger d-block" style={{ marginTop: '4px' }}>
        {message}
      </small>
    )
  }

  async function onSubmit(data) {
    setSubmitting(true)
    setErrors({})

    if (isEdit) {
      await put(`/v1/admin/maintenance/requests/${data_array[1]}`, {
        request: data,
      })
    } else {
      await post(`/v1/admin/maintenance/requests`, {
        request: data,
      })
    }

    if (response.ok) {
      handleClose()
      refreshData()
      toast.success(isEdit ? 'Request updated successfully' : 'Request created successfully')
    } else {
      setErrors(response.data?.errors || {})
      toast.error(response.data?.message || 'Unknown Error')
    }
    setSubmitting(false)
  }

  async function getProperties() {
    const api = await get(`/v1/admin/premises/properties?limit=-1`)
    if (response.ok) {
      setProperties(format_react_select(api.data, ['id', 'name']))
      setValue('property_id', Number(propertyId))
      if (propertyId) {
        loadUnits(propertyId)
      }
    }
  }

  async function getMaintenanceCategories() {
    const api = await get(`/v1/admin/maintenance/categories?limit=-1`)
    if (response.ok) {
      setMaintenance_cat(format_react_select(api.data, ['id', 'name']))
    }
  }

  async function getUsers() {
    const endpoint = propertyId
      ? `/v1/admin/premises/${propertyId}/actors/maintenance_staffs?limit=-1`
      : `v1/admin/maintenance_staffs?limit=-1`
    const api = await get(endpoint)

    if (response.ok) {
      setUsers(format_react_select(api.data, ['id', 'name']))
    }
  }

  async function loadUnits(id) {
    const api = await get(`/v1/admin/premises/properties/${id}/units?limit=-1`)
    if (response.ok) {
      const formattedUnits = api.data.map((item) => ({
        value: item.id,
        label: `${item.unit_no} - ${item.building?.name || 'No Building'}`,
      }))
      setUnits_data(formattedUnits)
    }
  }

  async function getRequestData(requestId) {
    const api = await get(`/v1/admin/maintenance/requests/${requestId}`)
    if (response.ok) {
      setEditdata(api.data)
      setValue('category_id', api.data.category.id)
      setValue('property_id', api.data.property_id)
      setValue('unit_id', api.data.unit_id)
      setValue('assigned_user_id', api.data.assigned_user_id)
      setValue('title', api.data.title)
      setValue('description', api.data.description)
      setValue('available_date', api.data.available_date)
      setValue('avialable_time', api.data.avialable_time)
      loadUnits(api.data.property_id)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ ...cardStyle, marginBottom: '16px' }}>
        <SectionTitle>Request Details</SectionTitle>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label style={labelStyle}>
                Property <span style={{ color: '#e03131' }}>*</span>
              </Form.Label>
              <Controller
                name="property_id"
                render={({ field }) => (
                  <Select
                    isDisabled={Boolean(propertyId)}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    {...field}
                    value={properties.find((c) => c.value === field.value) || null}
                    onChange={(val) => {
                      field.onChange(val?.value)
                      loadUnits(val?.value)
                    }}
                    options={properties}
                    placeholder="Select property"
                  />
                )}
                control={control}
              />
              {fieldError('property_id')}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label style={labelStyle}>
                Maintenance Category <span style={{ color: '#e03131' }}>*</span>
              </Form.Label>
              <Controller
                name="category_id"
                render={({ field }) => (
                  <Select
                    className="basic-multi-select"
                    classNamePrefix="select"
                    {...field}
                    value={maintenance_cat.find((c) => c.value === field.value) || null}
                    onChange={(val) => field.onChange(val?.value)}
                    options={maintenance_cat}
                    placeholder="Select category"
                  />
                )}
                control={control}
              />
              {fieldError('category_id')}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label style={labelStyle}>
                Unit No <span style={{ color: '#e03131' }}>*</span>
              </Form.Label>
              <Controller
                name="unit_id"
                render={({ field }) => (
                  <Select
                    isSearchable
                    className="basic-multi-select"
                    classNamePrefix="select"
                    {...field}
                    value={units_data.find((c) => c.value === field.value) || null}
                    onChange={(val) => field.onChange(val?.value)}
                    options={units_data}
                    placeholder="Select unit"
                  />
                )}
                control={control}
              />
              {fieldError('unit_id')}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label style={labelStyle}>
                Assigned User <span style={{ color: '#e03131' }}>*</span>
              </Form.Label>
              <Controller
                name="assigned_user_id"
                render={({ field }) => (
                  <Select
                    className="basic-multi-select"
                    classNamePrefix="select"
                    {...field}
                    value={users.find((c) => c.value === field.value) || null}
                    onChange={(val) => field.onChange(val?.value)}
                    options={users}
                    placeholder="Select staff"
                  />
                )}
                control={control}
              />
              {fieldError('assigned_user_id')}
            </Form.Group>
          </Col>
        </Row>
      </div>

      <div style={cardStyle}>
        <SectionTitle>Schedule &amp; Description</SectionTitle>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label style={labelStyle}>Available Date</Form.Label>
              <Form.Control
                defaultValue={edit_data.available_date}
                type="date"
                {...register('available_date')}
              />
              {fieldError('available_date')}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label style={labelStyle}>Available Time</Form.Label>
              <Form.Control
                defaultValue={edit_data.avialable_time}
                type="time"
                {...register('avialable_time')}
              />
              {fieldError('avialable_time')}
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group>
              <Form.Label style={labelStyle}>
                Title <span style={{ color: '#e03131' }}>*</span>
              </Form.Label>
              <Form.Control
                defaultValue={edit_data.title}
                type="text"
                placeholder="Request title"
                {...register('title')}
              />
              {fieldError('title')}
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group>
              <Form.Label style={labelStyle}>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                defaultValue={edit_data.description}
                placeholder="Describe the maintenance issue"
                style={{ resize: 'none' }}
                {...register('description')}
              />
              {fieldError('description')}
            </Form.Group>
          </Col>
        </Row>
      </div>

      <Modal.Footer style={{ border: 'none', padding: '16px 0 0' }}>
        <Button
          variant="light"
          onClick={handleClose}
          style={{ borderRadius: '8px', fontWeight: 600 }}
        >
          Close
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          style={{
            background: THEME_COLOR,
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
          }}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Modal.Footer>
    </Form>
  )
}

MaintenanceForm.propTypes = {
  handleClose: PropTypes.func,
  data_array: PropTypes.array,
  refreshData: PropTypes.func,
  api_endpoint: PropTypes.func,
}
