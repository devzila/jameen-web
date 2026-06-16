import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilTrash, cilUserPlus } from '@coreui/icons'

const THEME_COLOR = '#00bfcc'

const ARRIVAL_TIME_OPTIONS = [
  { value: 1, label: '6AM - 10AM' },
  { value: 2, label: '10AM - 02PM' },
  { value: 3, label: '02PM - 06PM' },
  { value: 4, label: '06PM - 10PM' },
  { value: 5, label: '10PM - 12AM' },
  { value: 6, label: '12AM - 6AM' },
]

const PURPOSE_OPTIONS = [
  { value: 1, label: 'Family / Friends' },
  { value: 2, label: 'Delivery' },
  { value: 3, label: 'Domestic Help' },
  { value: 4, label: 'Maintenance / Repair' },
  { value: 5, label: 'Society Staff' },
  { value: 6, label: 'Healthcare' },
  { value: 7, label: 'Tutor / Trainer' },
  { value: 8, label: 'Business / Professional' },
  { value: 9, label: 'Property Viewing' },
  { value: 10, label: 'Moving / Shifting' },
  { value: 11, label: 'Government / Utility' },
  { value: 12, label: 'Event / Function' },
  { value: 13, label: 'Pet Service' },
  { value: 14, label: 'Vehicle Service' },
  { value: 15, label: 'Other' },
]

const EMPTY_VISITOR = { name: '', phone_number: '', email: '' }

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

export default function AddVisitor({ after_submit }) {
  const [visible, setVisible] = useState(false)
  const [properties, setProperties] = useState([])
  const [units, setUnits] = useState([])
  const [unitsLoading, setUnitsLoading] = useState(false)

  const { register, handleSubmit, control, reset, setValue } = useForm({
    defaultValues: { visitors_attributes: [EMPTY_VISITOR] },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'visitors_attributes' })

  const { get, post, response } = useFetch()

  useEffect(() => {
    if (visible) {
      loadProperties()
    }
  }, [visible])

  async function loadProperties() {
    const api = await get('/v1/admin/premises/properties?limit=-1')
    if (response.ok) {
      const list = api?.data ?? api ?? []
      setProperties(list.map((p) => ({ value: p.id, label: p.name })))
    } else {
      toast.error('Unable to load properties')
    }
  }

  async function loadUnits(propertyId) {
    if (!propertyId) {
      setUnits([])
      return
    }
    setUnitsLoading(true)
    const api = await get(`/v1/admin/premises/properties/${propertyId}/units?limit=-1`)
    if (response.ok) {
      const list = api?.data ?? api ?? []
      setUnits(
        list.map((u) => ({
          value: u.id,
          label: u.building?.name ? `${u.unit_no} (${u.building.name})` : u.unit_no,
        })),
      )
    } else {
      setUnits([])
      toast.error('Unable to load units')
    }
    setUnitsLoading(false)
  }

  async function onSubmit(data) {
    const payload = {
      visit: {
        unit_id: data.unit_id,
        no_of_visitors: data.no_of_visitors,
        vehicle_number: data.vehicle_number,
        purpose: data.purpose,
        expected_arrival_time: data.expected_arrival_time,
        arrival_date: data.arrival_date,
        visitors_attributes: data.visitors_attributes,
      },
    }

    await post('/v1/admin/visits', payload)

    if (response.ok) {
      toast('Visitor Added Successfully')
      reset({ visitors_attributes: [EMPTY_VISITOR] })
      setUnits([])
      setVisible(false)
      if (after_submit) {
        after_submit()
      }
    } else {
      toast.error(response.data?.message || 'Unable to add visitor')
    }
  }

  const cardStyle = {
    background: '#f8fafc',
    border: '1px solid #eef1f5',
    borderRadius: '14px',
    padding: '18px',
  }

  return (
    <div>
      <button
        type="button"
        className="btn s-3 custom_theme_button"
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Add Visitor
      </button>

      <Modal
        show={visible}
        onHide={() => setVisible(false)}
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
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.25)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CIcon icon={cilUserPlus} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                  Add Visitor
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  Create a new visit entry
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ background: '#ffffff', padding: '24px' }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div style={cardStyle}>
              <SectionTitle>Visit Information</SectionTitle>
              <Row>
                <Col className="mb-3" md="6">
                  <Form.Group>
                    <label className="mb-1 text-muted small">Property</label>
                    <Controller
                      name="property_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={properties}
                          value={properties.find((c) => c.value === field.value) || null}
                          onChange={(val) => {
                            field.onChange(val?.value)
                            setValue('unit_id', null)
                            loadUnits(val?.value)
                          }}
                          placeholder="Select Property"
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
                <Col className="mb-3" md="6">
                  <Form.Group>
                    <label className="mb-1 text-muted small">Unit</label>
                    <Controller
                      name="unit_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={units}
                          isLoading={unitsLoading}
                          value={units.find((c) => c.value === field.value) || null}
                          onChange={(val) => field.onChange(val?.value)}
                          placeholder="Select Unit"
                          noOptionsMessage={() => 'Select a property first'}
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
                <Col className="mb-3" md="4">
                  <Form.Group>
                    <label className="mb-1 text-muted small">Number of Visitors</label>
                    <Form.Control
                      placeholder="0"
                      type="number"
                      min="1"
                      {...register('no_of_visitors')}
                    />
                  </Form.Group>
                </Col>
                <Col className="mb-3" md="4">
                  <Form.Group>
                    <label className="mb-1 text-muted small">Vehicle Number</label>
                    <Form.Control
                      placeholder="HR03 AA 1086"
                      type="text"
                      {...register('vehicle_number')}
                    />
                  </Form.Group>
                </Col>
                <Col className="mb-3" md="4">
                  <Form.Group>
                    <label className="mb-1 text-muted small">Expected Arrival Time</label>
                    <Controller
                      name="expected_arrival_time"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={ARRIVAL_TIME_OPTIONS}
                          value={ARRIVAL_TIME_OPTIONS.find((c) => c.value === field.value) || null}
                          onChange={(val) => field.onChange(val?.value)}
                          placeholder="Select Time Slot"
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
                <Col className="mb-3" md="6">
                  <Form.Group>
                    <label className="mb-1 text-muted small">Arrival Date</label>
                    <Form.Control type="date" {...register('arrival_date')} />
                  </Form.Group>
                </Col>
                <Col className="mb-3" md="6">
                  <Form.Group>
                    <label className="mb-1 text-muted small">Purpose</label>
                    <Controller
                      name="purpose"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={PURPOSE_OPTIONS}
                          value={PURPOSE_OPTIONS.find((c) => c.value === field.value) || null}
                          onChange={(val) => field.onChange(val?.value)}
                          placeholder="Select Purpose"
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div style={{ ...cardStyle, marginTop: '20px' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <SectionTitle>Visitors</SectionTitle>
                <button
                  type="button"
                  className="btn custom_theme_button d-flex align-items-center"
                  onClick={() => append(EMPTY_VISITOR)}
                >
                  <CIcon icon={cilPlus} size="sm" className="me-1" />
                  Add Visitor
                </button>
              </div>

              {fields.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #eef1f5',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    marginBottom: '10px',
                  }}
                >
                  <Row className="align-items-end">
                    <Col md="4">
                      <Form.Group>
                        <label className="mb-1 text-muted small">Name</label>
                        <Form.Control
                          placeholder="Full Name"
                          type="text"
                          {...register(`visitors_attributes.${index}.name`)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md="3">
                      <Form.Group>
                        <label className="mb-1 text-muted small">Phone Number</label>
                        <Form.Control
                          placeholder="Phone Number"
                          type="text"
                          {...register(`visitors_attributes.${index}.phone_number`)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md="4">
                      <Form.Group>
                        <label className="mb-1 text-muted small">Email</label>
                        <Form.Control
                          placeholder="email@example.com"
                          type="email"
                          {...register(`visitors_attributes.${index}.email`)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md="1" className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn custom_red_button"
                        disabled={fields.length === 1}
                        onClick={() => remove(index)}
                        title="Remove visitor"
                      >
                        <CIcon icon={cilTrash} size="sm" />
                      </button>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-end mt-4" style={{ gap: '10px' }}>
              <Button className="custom_grey_button" onClick={() => setVisible(false)}>
                Close
              </Button>
              <Button type="submit" className="custom_theme_button">
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

AddVisitor.propTypes = {
  after_submit: PropTypes.func,
}
