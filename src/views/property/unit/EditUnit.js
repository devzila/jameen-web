import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
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

export default function Edit({ unitId, after_submit }) {
  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, setValue, control, reset } = useForm()
  const { propertyId } = useParams()
  const { get, put, response } = useFetch()
  const [unitData, setUnitData] = useState({})
  const [units_data, setUnits_data] = useState([])

  useEffect(() => {
    if (visible) {
      getUnitData()
      fetchUnitsTypes()
    }
  }, [visible])

  async function getUnitData() {
    try {
      const api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}`)
      if (response.ok) {
        const data = api.data
        setUnitData(data)
        setValue('unit_no', data.unit_no || '')
        setValue('bedrooms_number', data.bedrooms_number || '')
        setValue('bathrooms_number', data.bathrooms_number || '')
        setValue('year_built', data.year_built || '')
        setValue('status', data.status || '')
        setValue('electricity_account_number', data.electricity_account_number || '')
        setValue('water_account_number', data.water_account_number || '')
        setValue('internal_extension_number', data.internal_extension_number || '')
        setValue('unit_type_id', data.unit_type?.id)
      } else {
        toast('Unable to load data.')
      }
    } catch (e) {
      toast.error('Unable to load unit data.')
    }
  }

  async function fetchUnitsTypes() {
    const api = await get(`/v1/admin/premises/properties/${propertyId}/unit_types`)
    if (response.ok) {
      setUnits_data(trimUnits(api))
    }
  }

  function trimUnits(units) {
    return (
      units.data?.map((e) => ({
        value: e.id,
        label: e.name,
      })) || []
    )
  }

  async function onSubmit(data) {
    await put(`/v1/admin/premises/properties/${propertyId}/units/${unitId}`, {
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

  function openModal() {
    setVisible(true)
  }

  function closeModal() {
    setVisible(false)
    reset()
  }

  return (
    <>
      <button
        type="button"
        className="btn custom_theme_button"
        data-mdb-ripple-init
        onClick={openModal}
      >
        Edit
      </button>

      <Modal
        show={visible}
        onHide={closeModal}
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
                <CIcon icon={freeSet.cilPencil} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                  Edit Unit
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  {unitData?.unit_no ? `Unit ${unitData.unit_no}` : 'Update unit information'}
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
                    <Form.Label style={labelStyle}>Unit Type</Form.Label>
                    <Controller
                      name="unit_type_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={units_data}
                          value={units_data.find((c) => c.value === field.value) || null}
                          onChange={(val) => field.onChange(val?.value)}
                          placeholder="Select unit type"
                        />
                      )}
                      control={control}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Unit Number</Form.Label>
                    <Form.Control type="text" {...register('unit_no')} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Bedroom Number</Form.Label>
                    <Form.Control type="number" {...register('bedrooms_number')} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Bathroom Number</Form.Label>
                    <Form.Control type="number" {...register('bathrooms_number')} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Year Built</Form.Label>
                    <Form.Control type="number" {...register('year_built')} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Status</Form.Label>
                    <Form.Control type="text" {...register('status')} />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div style={cardStyle}>
              <SectionTitle>Account Details</SectionTitle>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Electricity Account Number</Form.Label>
                    <Form.Control type="text" {...register('electricity_account_number')} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Water Account Number</Form.Label>
                    <Form.Control type="text" {...register('water_account_number')} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Internal Extension Number</Form.Label>
                    <Form.Control type="text" {...register('internal_extension_number')} />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <Modal.Footer style={{ border: 'none', padding: '16px 0 0' }}>
              <Button
                variant="light"
                onClick={closeModal}
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

Edit.propTypes = {
  unitId: PropTypes.string,
  after_submit: PropTypes.func,
}
