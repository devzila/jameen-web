import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
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

export default function AddNews({ after_submit }) {
  const [visible, setVisible] = useState(false)
  const [properties_data, setProperties_data] = useState([])
  const [errors, setErrors] = useState({})
  const [postTypes, setPostTypes] = useState([])

  const { register, handleSubmit, control, reset } = useForm()
  const { get, post, response } = useFetch()

  async function fetchProperties() {
    const api = await get('/v1/admin/premises/properties')
    if (response.ok) {
      setProperties_data(api.data.map((element) => ({ value: element.id, label: element.name })))
    }
  }

  function fetchPostCategory() {
    const meta = localStorage.getItem('meta')
    if (meta) {
      const postdata = JSON.parse(meta)?.post_categories
      const processed_data = Object.entries(postdata || {}).map(([key, value]) => ({
        label: key,
        value: value,
      }))
      setPostTypes(processed_data)
    }
  }

  useEffect(() => {
    if (visible) {
      fetchProperties()
      fetchPostCategory()
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
    const assigned_properties_data =
      data?.property_ids?.length > 0 ? data.property_ids.map((element) => element.value) : []

    const body = { ...data, property_ids: assigned_properties_data }
    await post(`/v1/admin/posts`, { post: body })

    if (response.ok) {
      toast.success('Post added successfully')
      after_submit()
      reset()
      setVisible(false)
    } else {
      setErrors(response.data?.errors || {})
      toast.error(response.data?.message || 'Unable to add post')
    }
  }

  function handleClose() {
    setVisible(false)
    setErrors({})
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
        Add Post
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
                <CIcon icon={freeSet.cilNewspaper} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>Add Post</span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  Create a new news post
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px', maxHeight: '75vh', overflowY: 'auto' }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div style={cardStyle}>
              <SectionTitle>Post Details</SectionTitle>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Title <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      placeholder="Post title"
                      type="text"
                      {...register('title')}
                    />
                    {fieldError('title')}
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Post Type <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={postTypes}
                          value={postTypes.find((c) => c.value === field.value) || null}
                          onChange={(val) => field.onChange(val?.value)}
                          placeholder="Select post type"
                        />
                      )}
                    />
                    {fieldError('category')}
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

            <div style={{ ...cardStyle, marginTop: '16px' }}>
              <SectionTitle>Content</SectionTitle>
              <Form.Group>
                <Form.Label style={labelStyle}>Body</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={12}
                  placeholder="Write post content..."
                  style={{ resize: 'none' }}
                  {...register('content')}
                />
                {fieldError('content')}
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

AddNews.propTypes = {
  after_submit: PropTypes.func,
}
