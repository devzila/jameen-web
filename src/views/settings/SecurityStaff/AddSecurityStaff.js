import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Select from 'react-select'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { cleanAvatar } from 'src/services/CommonFunctions'

const THEME_COLOR = '#00bfcc'
const labelStyle = { fontWeight: 600, color: '#1f2933' }
const cardStyle = {
  background: '#f8fafc',
  border: '1px solid #eef1f5',
  borderRadius: '14px',
  padding: '18px',
}
const DEFAULT_AVATAR = 'https://bootdey.com/img/Content/avatar/avatar7.png'

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

export default function AddSecurityStaff({ after_submit }) {
  const { register, handleSubmit, control, reset } = useForm()
  const { get, post, response } = useFetch()
  const [visible, setVisible] = useState(false)
  const [imageView, setImageView] = useState('')
  const [properties_data, setProperties_data] = useState([])
  const [errors, setErrors] = useState({})

  async function fetchProperties() {
    const api = await get('/v1/admin/premises/properties')
    if (response.ok) {
      setProperties_data(api.data.map((element) => ({ value: element.id, label: element.name })))
    }
  }

  useEffect(() => {
    if (visible) {
      fetchProperties()
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

  function handleFileSelection(e) {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = function (event) {
        setImageView(event.target.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  async function onSubmit(data) {
    const assigned_properties_data =
      data?.property_ids?.length > 0 ? data.property_ids.map((element) => element.value) : []

    const body = {
      ...data,
      property_ids: assigned_properties_data,
      avatar: { data: imageView },
    }
    const processed_data = cleanAvatar(body)

    await post(`/v1/admin/security_staffs`, { security_staff: processed_data })
    if (response.ok) {
      setVisible(false)
      after_submit()
      reset()
      setImageView('')
      toast.success('Security staff added successfully')
    } else {
      setErrors(response.data?.errors || {})
      toast.error(response.data?.message || 'Unable to add security staff')
    }
  }

  function handleClose() {
    setVisible(false)
    setErrors({})
    setImageView('')
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
        Add Staff
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
                <CIcon icon={freeSet.cilLockLocked} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                  Add Security Staff
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  Create a new security staff account
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px', maxHeight: '75vh', overflowY: 'auto' }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div style={cardStyle}>
              <SectionTitle>Profile</SectionTitle>
              <Row className="g-3 align-items-center">
                <Col md={3} className="text-center">
                  <img
                    alt="Avatar"
                    src={imageView || DEFAULT_AVATAR}
                    style={{
                      width: '96px',
                      height: '96px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      border: '3px solid #eef1f5',
                    }}
                  />
                </Col>
                <Col md={9}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={labelStyle}>
                          Name <span style={{ color: '#e03131' }}>*</span>
                        </Form.Label>
                        <Form.Control placeholder="Full name" type="text" {...register('name')} />
                        {fieldError('name')}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={labelStyle}>Avatar Image</Form.Label>
                        <Form.Control
                          type="file"
                          accept=".jpg, .jpeg, .png"
                          onChange={handleFileSelection}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group
                        className="d-flex align-items-center"
                        style={{ gap: '10px', marginTop: '8px' }}
                      >
                        <Form.Check
                          type="switch"
                          id="add-security-active"
                          defaultChecked
                          label="Active"
                          {...register('active')}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>

            <div style={{ ...cardStyle, marginTop: '16px' }}>
              <SectionTitle>Account Details</SectionTitle>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Email <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="abc@example.com"
                      {...register('email')}
                    />
                    {fieldError('email')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Password <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Form.Control
                      placeholder="Password"
                      type="password"
                      {...register('password')}
                    />
                    {fieldError('password')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Mobile No.</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Phone number"
                      {...register('mobile_number')}
                    />
                    {fieldError('mobile_number')}
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div style={{ ...cardStyle, marginTop: '16px' }}>
              <SectionTitle>Access</SectionTitle>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Assigned Properties</Form.Label>
                    <Controller
                      name="property_ids"
                      control={control}
                      render={({ field }) => (
                        <Select
                          isMulti
                          className="basic-multi-select"
                          classNamePrefix="select"
                          {...field}
                          options={properties_data}
                          placeholder="Select properties"
                        />
                      )}
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

AddSecurityStaff.propTypes = {
  after_submit: PropTypes.func,
}
