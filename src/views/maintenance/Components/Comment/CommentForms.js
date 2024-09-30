import React from 'react'
import useFetch from 'use-http'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

export default function CommentForms({ refresh_callback }) {
  const { register, handleSubmit, control, reset } = useForm()
  const { get, post, response } = useFetch()
  const { propertyId, maintenanceid } = useParams()

  async function onSubmit(data) {
    const api = await post(`/v1/admin/maintenance/requests/${maintenanceid}/comments`, {
      comment: data,
    })
    if (response.ok) {
      toast.success('Comment Added Successfully')
      refresh_callback()
      reset()
    }
  }
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col className="pr-1 mt-3" md="10">
            <Form.Group>
              <Form.Control
                required
                placeholder="Write a comment."
                type="text"
                {...register('comment', { required: 'Comment cannot be blank' })}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col className="pr-1 mt-3" md="2">
            <Button
              data-mdb-ripple-init
              type="submit"
              className="btn custom_theme_button btn-primary btn-block"
            >
              Post
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

CommentForms.propTypes = {
  refresh_callback: PropTypes.func,
}
