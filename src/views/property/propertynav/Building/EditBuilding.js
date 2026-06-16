import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm } from 'react-hook-form'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Form, Row, Col } from 'react-bootstrap'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

const THEME_COLOR = '#00bfcc'
const labelStyle = { fontWeight: 600, color: '#1f2933' }
const cardStyle = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0,0,0,.05)',
  padding: '24px',
}

export default function EditBuilding() {
  const { register, handleSubmit, setValue } = useForm()
  const nameField = register('name')
  const descriptionField = register('description')
  const { get, put, response } = useFetch()
  const { propertyId, building_id } = useParams()
  const [errors, setErrors] = useState({})
  const [buildingName, setBuildingName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchBuilding()
  }, [])

  async function fetchBuilding() {
    const endpoint = await get(
      `/v1/admin/premises/properties/${propertyId}/buildings/${building_id}`,
    )
    if (response.ok) {
      setBuildingName(endpoint.data.name || '')
      setValue('name', endpoint.data.name)
      setValue('description', endpoint.data.description)
    }
  }

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
    setErrors({})
    await put(`/v1/admin/premises/properties/${propertyId}/buildings/${building_id}`, {
      building: data,
    })

    if (response.ok) {
      navigate(`/properties/${propertyId}/Buildings`)
      toast.success('Building updated successfully')
    } else {
      setErrors(response.data?.errors || {})
      toast.error(response.data?.message || 'Unknown Error')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Hero */}
      <div
        style={{
          ...cardStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <div className="d-flex align-items-center" style={{ gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #0098a3 100%)`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CIcon icon={freeSet.cilPencil} size="xl" />
          </div>
          <div>
            <h4 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
              Edit Building
            </h4>
            <div style={{ color: '#8a94a6', marginTop: '4px' }}>
              {buildingName || 'Update building information'}
            </div>
          </div>
        </div>

        <NavLink
          to={`/properties/${propertyId}/Buildings`}
          className="btn d-flex align-items-center"
          style={{
            gap: '6px',
            background: '#f5f7fb',
            color: '#495057',
            borderRadius: '10px',
            height: '40px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <CIcon icon={freeSet.cilArrowLeft} size="sm" />
          Back
        </NavLink>
      </div>

      {/* Form */}
      <div style={cardStyle}>
        <div className="d-flex align-items-center mb-3" style={{ gap: '8px' }}>
          <span
            style={{ width: '4px', height: '18px', background: THEME_COLOR, borderRadius: '2px' }}
          />
          <h6 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
            Building Details
          </h6>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #eef1f5',
              borderRadius: '14px',
              padding: '18px',
            }}
          >
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>
                    Name <span style={{ color: '#e03131' }}>*</span>
                  </Form.Label>
                  <Form.Control required placeholder="Building name" type="text" {...nameField} />
                  {fieldError('name')}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Description"
                    style={{ resize: 'none' }}
                    {...descriptionField}
                  />
                  {fieldError('description')}
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="d-flex justify-content-end" style={{ gap: '10px', marginTop: '20px' }}>
            <NavLink
              to={`/properties/${propertyId}/Buildings`}
              className="btn btn-light"
              style={{ borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}
            >
              Cancel
            </NavLink>
            <Button
              type="submit"
              style={{
                background: THEME_COLOR,
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
