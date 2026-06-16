import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { useParams } from 'react-router-dom'

const THEME_COLOR = '#00bfcc'
const labelStyle = { fontWeight: 600, color: '#1f2933' }
const cardStyle = {
  background: '#f8fafc',
  border: '1px solid #eef1f5',
  borderRadius: '14px',
  padding: '18px',
}

export default function AllotPropertyParking({ after_submit }) {
  const [visible, setVisible] = useState(false)
  const [vehicle_array] = useState([])
  const [units_array, setUnitsArray] = useState([])
  const [errors, setErrors] = useState({})
  const { propertyId } = useParams()

  const { register, handleSubmit, control, reset } = useForm()
  const { get, post, response } = useFetch()

  useEffect(() => {
    if (visible) {
      loadUnits()
    }
  }, [visible])

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
    await post(`/v1/admin/premises/properties/${propertyId}/parkings`, { parking: data })

    if (response.ok) {
      toast.success('Parking added successfully')
      after_submit()
      reset({
        parking_number: '',
        unit_id: null,
        vehice_id: [],
      })
      setVisible(false)
    } else {
      setErrors(response.data?.errors || {})
      toast.error(response.data?.message || 'Unknown Error')
    }
  }

  async function loadUnits() {
    const api = await get(`/v1/admin/premises/properties/${propertyId}/units?limit=-1`)
    if (response.ok) {
      const formattedUnits = api.data.map((item) => ({
        value: item.id,
        label: `${item.unit_no} - ${item.building ? item.building.name : 'No Building'}`,
      }))
      setUnitsArray(formattedUnits)
    }
  }

  function handleClose() {
    reset({
      parking_number: '',
      unit_id: null,
      vehice_id: [],
    })
    setErrors({})
    setVisible(false)
  }

  return (
    <>
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
        Add Parking
      </button>

      <Modal
        show={visible}
        onHide={handleClose}
        centered
        size="lg"
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
                <CIcon icon={freeSet.cilCarAlt} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                  Add Parking
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  Create a new parking spot for this property
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px' }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div style={cardStyle}>
              <div className="d-flex align-items-center mb-3" style={{ gap: '8px' }}>
                <span
                  style={{
                    width: '4px',
                    height: '18px',
                    background: THEME_COLOR,
                    borderRadius: '2px',
                  }}
                />
                <h6 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                  Parking Details
                </h6>
              </div>

              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Parking Number <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Form.Control
                      placeholder="Parking number"
                      type="text"
                      {...register('parking_number')}
                    />
                    {fieldError('parking_number')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Unit</Form.Label>
                    <Controller
                      name="unit_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={units_array}
                          value={units_array.find((c) => c.value === field.value) || null}
                          onChange={(val) => field.onChange(val?.value)}
                          placeholder="Select unit"
                          isClearable
                        />
                      )}
                      control={control}
                    />
                    {fieldError('unit_id')}
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Vehicle</Form.Label>
                    <Controller
                      name="vehice_id"
                      render={({ field }) => (
                        <Select
                          isMulti
                          className="basic-multi-select"
                          classNamePrefix="select"
                          {...field}
                          options={vehicle_array}
                          placeholder="Vehicle number"
                        />
                      )}
                      control={control}
                    />
                    {fieldError('vehice_id')}
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
    </>
  )
}

AllotPropertyParking.propTypes = {
  after_submit: PropTypes.func,
}
