import React, { useState } from 'react'
import useFetch from 'use-http'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Form, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'

const THEME_COLOR = '#00bfcc'
const labelStyle = { fontWeight: 600, color: '#1f2933' }
const cardStyle = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0,0,0,.05)',
  padding: '22px',
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

export default function EditNews({ data, callback }) {
  const { register, handleSubmit, reset } = useForm()
  const { put, response } = useFetch()
  const { postId } = useParams()
  const [errors, setErrors] = useState({})

  function fieldError(name) {
    const message = errors?.[name]?.[0] || (errors?.[name] && String(errors[name]))
    if (!message) return null
    return (
      <small className="text-danger d-block" style={{ marginTop: '4px' }}>
        {message}
      </small>
    )
  }

  async function onSubmit(formData) {
    await put(`/v1/admin/posts/${postId}`, { post: formData })
    if (response.ok) {
      reset()
      callback()
      toast.success('Post updated successfully')
    } else {
      setErrors(response.data?.errors || {})
      toast.error(response.data?.message || 'Unable to update post')
    }
  }

  function handleClose() {
    callback()
    setErrors({})
  }

  return (
    <div style={cardStyle}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <SectionTitle>Edit Post</SectionTitle>
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
                defaultValue={data?.title}
                {...register('title')}
              />
              {fieldError('title')}
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group>
              <Form.Label style={labelStyle}>Content</Form.Label>
              <Form.Control
                as="textarea"
                defaultValue={data?.content?.body}
                rows={20}
                placeholder="Write post content..."
                style={{ resize: 'none' }}
                {...register('content')}
              />
              {fieldError('content')}
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-end" style={{ gap: '10px', marginTop: '16px' }}>
          <Button
            variant="light"
            onClick={handleClose}
            style={{ borderRadius: '8px', fontWeight: 600 }}
          >
            Cancel
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
            Save
          </Button>
        </div>
      </Form>
    </div>
  )
}

EditNews.propTypes = {
  data: PropTypes.object,
  callback: PropTypes.func,
}
