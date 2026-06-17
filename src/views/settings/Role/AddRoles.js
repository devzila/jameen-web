import React, { useState } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
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

export default function AddRoles({ after_submit }) {
  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, reset } = useForm()
  const { post, response } = useFetch()

  async function onSubmit(data) {
    await post(`/v1/admin/roles`, { role: data })
    if (response.ok) {
      toast.success('New role added successfully')
      after_submit()
      reset()
      setVisible(false)
    } else {
      toast.error(response.data?.message || 'Unable to add role')
    }
  }

  function handleClose() {
    setVisible(false)
    reset()
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
          flexShrink: 0,
        }}
      >
        <CIcon icon={freeSet.cilPlus} size="sm" />
        Add Role
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
                <CIcon icon={freeSet.cilPeople} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>Add Role</span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  Create a new role with permissions
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px' }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div style={cardStyle}>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Name <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Form.Control
                      placeholder="Role name"
                      type="text"
                      {...register('name', { required: true })}
                    />
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

AddRoles.propTypes = {
  after_submit: PropTypes.func,
}
