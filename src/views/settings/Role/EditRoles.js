import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import '../../../scss/_roles.scss'
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

export default function EditRoles({ roleId, after_submit }) {
  const [visible, setVisible] = useState(false)
  const [privileges_data, setPrivileges_data] = useState({})
  const [data, setData] = useState({})

  const { register, handleSubmit, setValue } = useForm()
  const { get, put, response } = useFetch()

  async function loadInitialroles() {
    const initialroles = await get(`/v1/admin/roles/${roleId}`)

    if (response.ok && initialroles?.data) {
      setData(initialroles.data)
      if (initialroles.data.privileges) {
        setPrivileges_data(initialroles.data.privileges)
      }
    } else {
      toast.error('Unable to load role details')
    }
  }

  useEffect(() => {
    if (visible) {
      loadInitialroles()
    }
  }, [visible])

  async function onSubmit(formData) {
    await put(`/v1/admin/roles/${roleId}`, { role: formData })
    if (response.ok) {
      toast.success('Role updated successfully')
      after_submit()
      setVisible(false)
    } else {
      toast.error(response.data?.message || 'Unable to update role')
    }
  }

  function handleClose() {
    setVisible(false)
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
                  Edit Role
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  {data.name || 'Update role details and privileges'}
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px', maxHeight: '70vh', overflowY: 'auto' }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div style={cardStyle}>
              <SectionTitle>Role Details</SectionTitle>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Name</Form.Label>
                    <Form.Control
                      defaultValue={data.name}
                      placeholder="Name"
                      type="text"
                      {...register('name')}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Description"
                      style={{ resize: 'none' }}
                      defaultValue={data.description}
                      {...register('description')}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div style={{ ...cardStyle, marginTop: '16px' }}>
              <SectionTitle>Privileges</SectionTitle>
              <Row>
                {Object.entries(privileges_data).map(([outer_keys, outer_values]) => (
                  <Col md={6} key={outer_keys}>
                    <div
                      style={{
                        border: '1px solid #eef1f5',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        marginBottom: '12px',
                      }}
                    >
                      <div
                        style={{
                          background: 'rgba(0,191,204,0.08)',
                          padding: '10px 14px',
                          textTransform: 'capitalize',
                          color: THEME_COLOR,
                          fontWeight: 700,
                          fontSize: '13px',
                        }}
                      >
                        {outer_keys}
                      </div>
                      {Object.entries(outer_values).map(([inner_keys, inner_values]) => (
                        <div
                          key={inner_keys}
                          className="d-flex align-items-center justify-content-between"
                          style={{
                            padding: '10px 14px',
                            borderTop: '1px solid #f2f4f7',
                            textTransform: 'capitalize',
                            fontSize: '13px',
                          }}
                        >
                          <span>{inner_keys.replace(/_/g, ' ')}</span>
                          <label className="checkbox mb-0">
                            <input
                              type="checkbox"
                              {...register(`privileges.${outer_keys}.${inner_keys}`)}
                            />
                            {setValue(`privileges.${outer_keys}.${inner_keys}`, inner_values)}
                            <span className="default" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </Col>
                ))}
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

EditRoles.propTypes = {
  roleId: PropTypes.number,
  after_submit: PropTypes.func,
}
