import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap'
import Select from 'react-select'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

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

SectionTitle.propTypes = { children: PropTypes.node }

export default function AddUnitTypes({ after_submit }) {
  const { register, handleSubmit, control, reset } = useForm()
  const { post, response } = useFetch()
  const { propertyId } = useParams()
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState({})
  const [unit_type, setUnit_type] = useState([])

  useEffect(() => {
    if (visible) {
      fetchLocalData()
    }
  }, [visible])

  function fetchLocalData() {
    const temp_use_type = JSON.parse(localStorage.getItem('meta'))
    const temp2_unit_type = Object.entries(temp_use_type.property_use_types).map((x) => ({
      value: x[0],
      label: x[0],
    }))
    setUnit_type(temp2_unit_type)
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
    await post(`/v1/admin/premises/properties/${propertyId}/unit_types`, {
      unit_type: data,
    })

    if (response.ok) {
      setVisible(false)
      after_submit()
      reset()
      toast.success('Unit type added successfully')
    } else {
      setErrors(response.data?.errors || {})
      toast.error(response.data?.message || 'Unable to add unit type')
    }
  }

  function handleClose() {
    setVisible(false)
    setErrors({})
    reset()
  }

  return (
    <div>
      <button
        type="button"
        className="btn d-flex align-items-center"
        onClick={() => setVisible(true)}
        style={{
          gap: '6px',
          background: THEME_COLOR,
          color: '#fff',
          borderRadius: '10px',
          height: '38px',
          fontWeight: 600,
          border: 'none',
        }}
      >
        <CIcon icon={freeSet.cilPlus} size="sm" />
        Add
      </button>

      <Modal
        show={visible}
        onHide={handleClose}
        centered
        size="xl"
        backdrop="static"
        contentClassName="border-0 overflow-hidden rounded-4"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          style={{
            background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #0098a3 100%)`,
            border: 'none',
            padding: '20px 24px',
            borderTopLeftRadius: 'inherit',
            borderTopRightRadius: 'inherit',
          }}
        >
          <Modal.Title style={{ color: '#fff' }}>
            <div className="d-flex align-items-center" style={{ gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CIcon icon={freeSet.cilLayers} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                  Add Unit Type
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  Create a new unit type for this property
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px' }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ ...cardStyle, marginBottom: '14px' }}>
              <SectionTitle>Basic Information</SectionTitle>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Name <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Form.Control type="text" {...register('name')} />
                    {fieldError('name')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Description</Form.Label>
                    <Form.Control type="text" {...register('description')} />
                    {fieldError('description')}
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Use Type <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Controller
                      name="use_type"
                      render={({ field }) => (
                        <Select
                          classNamePrefix="select"
                          {...field}
                          value={unit_type.find((c) => c.value === field.value) || null}
                          onChange={(val) => field.onChange(val?.value)}
                          options={unit_type}
                          placeholder="Select use type"
                        />
                      )}
                      control={control}
                    />
                    {fieldError('use_type')}
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div style={cardStyle}>
              <SectionTitle>Pricing &amp; Area</SectionTitle>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Area (sqft) <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Form.Control type="number" {...register('sqft')} />
                    {fieldError('sqft')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Monthly Maintenance / SQFT <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        {...register('monthly_maintenance_amount_per_sqft')}
                      />
                    </InputGroup>
                    {fieldError('monthly_maintenance_amount_per_sqft')}
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
                style={{
                  background: THEME_COLOR,
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                }}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

AddUnitTypes.propTypes = {
  after_submit: PropTypes.func,
}
