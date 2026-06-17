import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
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

export default function EditMaintenance({ afterSubmit, categoryId, isDefault }) {
  const { register, handleSubmit, setValue } = useForm()
  const { get, put, response } = useFetch()
  const [visible, setVisible] = useState(false)
  const [maintenanceCategory, setMaintenanceCategory] = useState({})
  const [errors, setErrors] = useState({})

  async function fetchMaintenanceCategory() {
    const endpoint = await get(`/v1/admin/maintenance/categories/${categoryId}`)
    if (response.ok && endpoint?.data) {
      const category = endpoint.data
      setMaintenanceCategory(category)
      setValue('name', category.name)
      setValue('description', category.description)
      setValue('priority', category.priority || 'high')
      setValue('is_default', category.is_default ? 'true' : 'false')
    }
  }

  useEffect(() => {
    if (visible) {
      fetchMaintenanceCategory()
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
    await put(`/v1/admin/maintenance/categories/${categoryId}`, { category: data })
    if (response.ok) {
      setVisible(false)
      afterSubmit()
      toast.success('Maintenance category updated successfully')
    } else {
      setErrors(response.data?.errors || {})
      toast.error(response.data?.message || 'Unable to update category')
    }
  }

  function handleClose() {
    setVisible(false)
    setErrors({})
  }

  return (
    <>
      <button type="button" className="tooltip_button" onClick={() => setVisible(true)}>
        Edit
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
                <CIcon icon={freeSet.cilPencil} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                  Edit Category
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  {maintenanceCategory.name || 'Update category details'}
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px' }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div style={cardStyle}>
              <SectionTitle>Category Details</SectionTitle>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Name <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      placeholder="Category name"
                      type="text"
                      {...register('name')}
                    />
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
                      {...register('description')}
                    />
                    {fieldError('description')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Priority</Form.Label>
                    <Form.Select {...register('priority')}>
                      <option value="high">High</option>
                      <option value="low">Low</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Is Default</Form.Label>
                    <Form.Select {...register('is_default')}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </Form.Select>
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

EditMaintenance.propTypes = {
  afterSubmit: PropTypes.func,
  categoryId: PropTypes.number,
  isDefault: PropTypes.bool,
}
