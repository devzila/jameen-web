import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
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

export default function EditResidents({ id, after_submit }) {
  const [resident, setResident] = useState({})
  const [visible, setVisible] = useState(false)
  const [imageView, setImageView] = useState('')
  const [identityProof, setIdentityProof] = useState(null)

  const { register, handleSubmit, setValue, control, reset } = useForm()
  const { get, put, response } = useFetch()

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

    const reader = new FileReader()
    reader.onload = function (event) {
      setIdentityProof({
        data: event.target.result,
        name: selectedFile.name,
        type: selectedFile.type,
      })
    }
    reader.readAsDataURL(selectedFile)
  }

  async function loadResident() {
    const api = await get(`/v1/admin/members/${id}`)

    if (response.ok) {
      const data = api.data
      setResident(data)
      setIdentityProof({
        name: data.identity_proof_doc_name || '',
        data: data.identity_proof_doc || '',
      })
      setValue('first_name', data.first_name)
      setValue('last_name', data.last_name)
      setValue('email', data.email)
      setValue('phone_number', data.phone_number)
      setValue('password', data.first_name)
      setValue('gender', data.gender)
      setValue('dob', data.dob)
    } else {
      toast.error(api?.message || 'Unable to load resident')
    }
  }

  useEffect(() => {
    if (visible) {
      loadResident()
    }
  }, [visible])

  const onSubmit = async (data) => {
    const { avatar, identity_proof_doc, ...rest } = data
    const body = {
      ...rest,
      identity_proof_doc: identityProof,
    }

    if (imageView) {
      body.avatar = { data: imageView }
    }

    await put(`/v1/admin/members/${id}`, { member: body })

    if (response.ok) {
      toast.success('Resident updated successfully')
      setVisible(false)
      after_submit?.()
    } else {
      toast.error(response.data?.message || 'Unable to update resident')
    }
  }

  function handleClose() {
    setVisible(false)
    setImageView('')
    reset()
  }

  const avatarSrc = imageView || resident?.avatar || DEFAULT_AVATAR
  const residentName = [resident.first_name, resident.last_name].filter(Boolean).join(' ')

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
                  Edit Resident
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  {residentName || 'Update resident details'}
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
                    src={avatarSrc}
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
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Last Name</Form.Label>
                    <Form.Control placeholder="Last name" type="text" {...register('last_name')} />
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
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Date of Birth</Form.Label>
                    <Form.Control type="date" {...register('dob')} />
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
                      {...register('email')}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Password</Form.Label>
                    <Form.Control
                      placeholder="Password"
                      type="password"
                      {...register('password')}
                    />
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

                {resident?.identity_proof_doc ? (
                  <div className="mt-2">
                    <strong>Existing file:</strong>{' '}
                    <a href={resident.identity_proof_doc} target="_blank" rel="noreferrer">
                      {resident.identity_proof_doc_name}
                    </a>
                  </div>
                ) : null}
                {identityProof?.name && identityProof.name !== resident?.identity_proof_doc_name ? (
                  <div className="mt-1 text-success">Selected file: {identityProof.name}</div>
                ) : null}
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

EditResidents.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  after_submit: PropTypes.func,
}
