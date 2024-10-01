import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

export default function CommentForms({ refresh_callback, id, close_edit_callback }) {
  const { register, handleSubmit, control, reset } = useForm()
  const { get, post, put, response } = useFetch()
  const { propertyId, maintenanceid } = useParams()

  const [comment, setComment] = useState({})

  useEffect(() => {
    getCommentData(id)
  }, [])
  async function onSubmit(data) {
    if (id) {
      const api = await put(`/v1/admin/maintenance/requests/${maintenanceid}/comments/${id}`, {
        comment: data,
      })
      close_edit_callback()
    } else {
      const api = await post(`/v1/admin/maintenance/requests/${maintenanceid}/comments`, {
        comment: data,
      })
    }
    if (response.ok) {
      toast.success(`Comment ${id ? 'Updated' : 'Added'} Successfully`)
      refresh_callback()
      reset()
    }
  }

  const getCommentData = async () => {
    const endpoint = await get(`/v1/admin/maintenance/requests/${maintenanceid}/comments/${id}`)
    if (response.ok) {
      setComment(endpoint.data)
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col className="pr-1 mt-3" md={id ? '10' : '11'}>
            <Form.Group>
              <Form.Control
                required
                placeholder="Write a comment."
                type="text"
                autocomplete="off"
                defaultValue={comment.comment}
                {...register('comment', { required: 'Comment cannot be blank' })}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1 mt-3" md={id ? '2' : '1'}>
            <Button
              data-mdb-ripple-init
              type="submit"
              className="btn custom_theme_button btn-primary btn-block"
            >
              {id ? 'Update' : 'Post'}
            </Button>
            {id ? (
              <Button
                data-mdb-ripple-init
                className="btn custom_grey_button btn-primary btn-block"
                onClick={() => close_edit_callback()}
              >
                Cancel
              </Button>
            ) : null}
          </Col>
        </Row>
      </Form>
    </>
  )
}

CommentForms.propTypes = {
  refresh_callback: PropTypes.func,
  close_edit_callback: PropTypes.func,
  id: PropTypes.number,
}
