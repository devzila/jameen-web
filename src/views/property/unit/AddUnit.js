import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
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

SectionTitle.propTypes = {
  children: PropTypes.node,
}

function Add({ after_submit }) {
  const { register, handleSubmit, control, reset } = useForm()
  const { get, post, response } = useFetch()
  const { propertyId } = useParams()
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState({})
  const [units_data, setUnits_data] = useState([])
  const [buildings_data, setBuildings_data] = useState([])

  useEffect(() => {
    if (visible) {
      fetchUnits()
      fetchBuildings()
    }
  }, [visible])

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

  function fieldError(name) {
    const message = errors?.[name]?.[0]
    if (!message) return null
    return (
      <small className="text-danger d-block" style={{ marginTop: '4px' }}>
        {message}
      </small>
    )
  }

  async function onSubmit(data) {
    setErrors({})
    await post(`/v1/admin/premises/properties/${propertyId}/units`, {
      unit: data,
    })

    if (response.ok) {
      reset()
      setVisible(false)
      after_submit()
      toast.success('Unit added successfully')
    } else {
      setErrors(response.data?.errors || {})
      toast.error(response.data?.message || 'Something went wrong')
    }
  }

  function handleClose() {
    reset()
    setVisible(false)
    setErrors({})
  }

  function openModal() {
    setVisible(true)
  }

  return (
    <div>
      <button
        type="button"
        className="btn d-flex align-items-center"
        onClick={openModal}
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
                <CIcon icon={freeSet.cilHome} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>Add Unit</span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  Create a new unit for this property
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px' }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ ...cardStyle, marginBottom: '14px' }}>
              <SectionTitle>Unit Details</SectionTitle>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Unit Type <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Controller
                      name="unit_type_id"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          classNamePrefix="select"
                          options={units_data}
                          placeholder="Select unit type"
                          value={units_data.find((c) => c.value === field.value) || null}
                          onChange={(val) => field.onChange(val ? val.value : '')}
                        />
                      )}
                    />
                    {fieldError('unit_type_id')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Unit Number <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Form.Control type="number" {...register('unit_no')} />
                    {fieldError('unit_no')}
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Building <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Controller
                      name="building_id"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          classNamePrefix="select"
                          options={buildings_data}
                          placeholder="Select building"
                          value={buildings_data.find((c) => c.value === field.value) || null}
                          onChange={(val) => field.onChange(val ? val.value : '')}
                        />
                      )}
                    />
                    {fieldError('building_id')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Bedroom No.</Form.Label>
                    <Form.Control type="number" {...register('bedrooms_number')} />
                    {fieldError('bedrooms_number')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Bathroom No.</Form.Label>
                    <Form.Control type="number" {...register('bathrooms_number')} />
                    {fieldError('bathrooms_number')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Year Built <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Form.Control type="number" {...register('year_built')} />
                    {fieldError('year_built')}
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div style={cardStyle}>
              <SectionTitle>Account Details</SectionTitle>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Electricity Account No.</Form.Label>
                    <Form.Control type="text" {...register('electricity_account_number')} />
                    {fieldError('electricity_account_number')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Water Account No.</Form.Label>
                    <Form.Control type="text" {...register('water_account_number')} />
                    {fieldError('water_account_number')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Internal Extension No.</Form.Label>
                    <Form.Control type="text" {...register('internal_extension_number')} />
                    {fieldError('internal_extension_number')}
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

export default Add

Add.propTypes = {
  after_submit: PropTypes.func,
}
