import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
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

export default function EditUser({ userId, after_submit }) {
  const [imageView, setImageView] = useState(null)
  const { get, patch, response } = useFetch()
  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, setValue, control } = useForm()
  const [userData, setUserData] = useState({})
  const [roles_data, setRoles_data] = useState([])
  const [properties_data, setProperties_data] = useState([])

  const rolesarray = roles_data.map((element) => ({
    label: element.name.charAt(0).toUpperCase() + element.name.slice(1).replace(/_/g, ' '),
    value: element.id,
  }))

  async function fetchRoles() {
    const api = await get('/v1/admin/roles')
    if (response.ok) {
      setRoles_data(api.data)
    }
  }

  async function fetchProperties() {
    const api = await get('/v1/admin/premises/properties')
    if (response.ok) {
      setProperties_data(
        api.data.map((element) => ({
          value: element.id,
          label: `${element.name}, ${element.city}`,
        })),
      )
    }
  }

  async function getUserData() {
    const api = await get(`/v1/admin/users/${userId}`)

    if (response.ok && api?.data) {
      setValue('name', api.data.name)
      setValue('email', api.data.email)
      setValue('mobile_number', api.data.mobile_number)
      setValue('password', api.data.password)
      setValue('role_id', api.data.role?.id)
      setValue('active', api.data.active)
      setValue(
        'property_ids',
        (api.data.properties || []).map((element) => ({
          value: element.id,
          label: `${element.name}, ${element.city}`,
        })),
      )
      setUserData(api.data)
    }
  }

  useEffect(() => {
    if (visible) {
      fetchProperties()
      fetchRoles()
      getUserData()
    }
  }, [visible])

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

  async function onSubmit(data) {
    const assigned_properties_data = (data?.property_ids || []).map((element) => element.value)
    const body = { ...data, property_ids: assigned_properties_data, avatar: { data: imageView } }

    await patch(`/v1/admin/users/${userId}`, { user: body })
    if (response.ok) {
      toast.success('User updated successfully')
      setVisible(false)
      after_submit()
    } else {
      toast.error(response.data?.message || 'Unable to update user')
    }
  }

  function handleClose() {
    setVisible(false)
    setImageView(null)
  }

  const avatarSrc = imageView || userData.avatar || DEFAULT_AVATAR

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
                  Edit User
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  {userData.name || 'Update user details'}
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
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={labelStyle}>Name</Form.Label>
                        <Form.Control placeholder="Full name" type="text" {...register('name')} />
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
                          id="edit-user-active"
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
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Phone No</Form.Label>
                    <Form.Control
                      placeholder="Phone number"
                      type="text"
                      {...register('mobile_number')}
                    />
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
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Role</Form.Label>
                    <Controller
                      name="role_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={rolesarray}
                          value={rolesarray.find((c) => c.value === field.value) || null}
                          onChange={(val) => field.onChange(val?.value)}
                          placeholder="Select role"
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

EditUser.propTypes = {
  userId: PropTypes.number.isRequired,
  after_submit: PropTypes.func,
}
