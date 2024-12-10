import React, { useState } from 'react'
import useFetch from 'use-http'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Form, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'

import { CModalFooter, CContainer } from '@coreui/react'

export default function EditNews({ data, callback }) {
  const { register, handleSubmit, control, reset, setValue } = useForm()
  const { put, response } = useFetch()
  const { postId } = useParams()

  const [errors, setErrors] = useState({})

  async function onSubmit(data) {
    const apiResponse = await put(`/v1/admin/posts/${postId}`, {
      post: data,
    })
    if (response.ok) {
      reset()
      callback()
      toast.success('Post Updated successfully')
    } else {
      setErrors(response.data.errors)
      toast.error(response.data?.message || 'Unknown Error')
    }
  }

  function handleClose() {
    callback()

    setErrors({})
  }

  return (
    <>
      <CContainer className="bg-white p-1 rounded-1 mt-3 px-4">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col className="pr-3 mt-3" md="12">
              <Form.Group>
                <label>Title</label>
                <Form.Control
                  required
                  placeholder="title"
                  type="text"
                  defaultValue={data?.title}
                  {...register('title')}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col className="pr-1 mt-3" md="12">
              <Form.Group>
                <label>Content</label>
                <Form.Control
                  as="textarea"
                  defaultValue={data?.content?.body}
                  rows={25}
                  placeholder="Content"
                  {...register('content.body')}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <div className="text-center my-2">
            <CModalFooter>
              <button type="submit" className="btn custom_theme_button">
                Save
              </button>
              <button onClick={handleClose} className="btn custom_grey_button">
                Cancel
              </button>
            </CModalFooter>
          </div>
        </Form>
        <div className="clearfix"></div>
      </CContainer>
    </>
  )
}

EditNews.propTypes = {
  data: PropTypes.object,
  callback: PropTypes.func,
}
