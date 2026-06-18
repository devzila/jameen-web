import React, { useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'
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

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

export default function AddResidents({ after_submit }) {
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState({})
  const [imageView, setImageView] = useState('')
  const [identityProofDoc, setIdentityProof] = useState(null)

  const { register, handleSubmit, control, reset } = useForm()
  const { post, response } = useFetch()

  function fieldError(name) {
    const message = errors?.[name]?.[0] || (errors?.[name] && String(errors[name]))
    if (!message) return null
    return (
      <small className="text-danger d-block" style={{ marginTop: '4px' }}>
        {message}
      </small>
    )
  }

  const handleFileSelection = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = function (event) {
        setImageView(event.target.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleIdentityProof = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Only JPG, PNG and PDF files are allowed')
      return
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB')
      return
    }
    setIdentityProof(selectedFile)
  }

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('member[first_name]', data.first_name)
    formData.append('member[last_name]', data.last_name)
    formData.append('member[email]', data.email)
    formData.append('member[phone_number]', data.phone_number)
    formData.append('member[password]', data.password)
    formData.append('member[gender]', data.gender)
    formData.append('member[dob]', data.dob)

    if (imageView) {
      formData.append('member[avatar]', imageView)
    }
    if (identityProofDoc) {
      formData.append('member[identity_proof_doc]', identityProofDoc)
    }

    await post('/v1/admin/members', formData)

    if (response.ok) {
      toast.success('Resident added successfully')
      reset()
      setImageView('')
      setIdentityProof(null)
      setVisible(false)
      after_submit?.()
    } else {
      setErrors(response.data?.errors || {})
      toast.error(response.data?.message || 'Something went wrong')
    }
  }

  function handleClose() {
    setVisible(false)
    setErrors({})
    setImageView('')
    setIdentityProof(null)
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
        Add Resident
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
                <CIcon icon={freeSet.cilUserPlus} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                  Add Resident
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  Create a new resident account
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px', maxHeight: '75vh', overflowY: 'auto' }}>
          <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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
                  <Form.Group>
                    <Form.Label style={labelStyle}>Avatar Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      onChange={handleFileSelection}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div style={{ ...cardStyle, marginTop: '16px' }}>
              <SectionTitle>Personal Details</SectionTitle>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>First Name</Form.Label>
                    <Form.Control
                      placeholder="First name"
                      type="text"
                      {...register('first_name')}
                    />
                    {fieldError('first_name')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Last Name</Form.Label>
                    <Form.Control placeholder="Last name" type="text" {...register('last_name')} />
                    {fieldError('last_name')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Phone No</Form.Label>
                    <Form.Control
                      placeholder="Phone number"
                      type="text"
                      {...register('phone_number')}
                    />
                    {fieldError('phone_number')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Date of Birth</Form.Label>
                    <Form.Control type="date" {...register('dob')} />
                    {fieldError('dob')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Gender</Form.Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={genderOptions}
                          value={genderOptions.find((c) => c.value === field.value) || null}
                          onChange={(val) => field.onChange(val?.value)}
                          placeholder="Select gender"
                        />
                      )}
                    />
                    {fieldError('gender')}
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div style={{ ...cardStyle, marginTop: '16px' }}>
              <SectionTitle>Account</SectionTitle>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Email</Form.Label>
                    <Form.Control
                      placeholder="abc@example.com"
                      type="email"
                      autoComplete="off"
                      {...register('email')}
                    />
                    {fieldError('email')}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Password</Form.Label>
                    <Form.Control
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
                      {...register('password')}
                    />
                    {fieldError('password')}
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div style={{ ...cardStyle, marginTop: '16px' }}>
              <SectionTitle>Documents</SectionTitle>
              <Form.Group>
                <Form.Label style={labelStyle}>Identity Proof (Optional)</Form.Label>
                <Form.Control
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleIdentityProof}
                />
                <small className="text-muted">Upload JPEG, PNG or PDF file (max 5MB)</small>
              </Form.Group>
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

AddResidents.propTypes = {
  after_submit: PropTypes.func,
}
