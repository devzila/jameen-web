import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { Button, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

const THEME_COLOR = '#00bfcc'

export default function CommentForms({ refresh_callback, id, close_edit_callback }) {
  const { register, handleSubmit, reset } = useForm()
  const { get, post, put, response } = useFetch()
  const { maintenanceid } = useParams()
  const [comment, setComment] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      getCommentData(id)
    }
  }, [id])

  async function onSubmit(formData) {
    setSubmitting(true)
    if (id) {
      await put(`/v1/admin/maintenance/requests/${maintenanceid}/comments/${id}`, {
        comment: formData,
      })
      close_edit_callback()
    } else {
      await post(`/v1/admin/maintenance/requests/${maintenanceid}/comments`, {
        comment: formData,
      })
    }

    if (response.ok) {
      toast.success(`Comment ${id ? 'updated' : 'added'} successfully`)
      refresh_callback()
      reset()
    }
    setSubmitting(false)
  }

  async function getCommentData(commentId) {
    const endpoint = await get(
      `/v1/admin/maintenance/requests/${maintenanceid}/comments/${commentId}`,
    )
    if (response.ok) {
      setComment(endpoint.data || {})
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="d-flex align-items-start flex-wrap" style={{ gap: '10px' }}>
        <div
          className="d-flex align-items-center flex-grow-1"
          style={{
            background: '#f5f7fb',
            borderRadius: '10px',
            padding: '4px 6px 4px 14px',
            minWidth: '220px',
          }}
        >
          <Form.Control
            required
            placeholder="Write a comment..."
            type="text"
            autoComplete="off"
            defaultValue={comment.comment}
            className="border-0 shadow-none"
            style={{ background: 'transparent', outline: 'none' }}
            {...register('comment', { required: 'Comment cannot be blank' })}
          />
        </div>

        <div className="d-flex align-items-center" style={{ gap: '8px' }}>
          {id ? (
            <Button
              type="button"
              variant="light"
              onClick={close_edit_callback}
              style={{ borderRadius: '8px', fontWeight: 600 }}
            >
              Cancel
            </Button>
          ) : null}
          <Button
            type="submit"
            disabled={submitting}
            className="d-flex align-items-center"
            style={{
              gap: '6px',
              background: THEME_COLOR,
              border: 'none',
              borderRadius: '10px',
              height: '38px',
              fontWeight: 600,
            }}
          >
            <CIcon icon={freeSet.cilSend} size="sm" />
            {id ? 'Update' : 'Post'}
          </Button>
        </div>
      </div>
    </Form>
  )
}

CommentForms.propTypes = {
  refresh_callback: PropTypes.func,
  close_edit_callback: PropTypes.func,
  id: PropTypes.number,
}
