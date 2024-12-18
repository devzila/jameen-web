import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { Button, Form, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'

import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CContainer,
} from '@coreui/react'

export default function AddNews({ after_submit }) {
  const [visible, setVisible] = useState(false)
  const [properties_data, setProperties_data] = useState([])
  const [errors, setErrors] = useState({})
  const [postTypes, setPostTypes] = useState([])

  const { register, handleSubmit, control, reset } = useForm()
  const { get, post, response } = useFetch()

  let properties_array = []
  function trimProperties(properties) {
    properties.forEach((element) => {
      properties_array.push({ value: element.id, label: element.name })
    })
    return properties_array
  }
  //fetch properties
  async function fetchProperties() {
    const api = await get('/v1/admin/premises/properties')
    if (response.ok) {
      setProperties_data(trimProperties(api.data))
    }
  }

  useEffect(() => {
    fetchProperties()
    fetchPostCategory()
  }, [])

  const fetchPostCategory = () => {
    const meta = localStorage.getItem('meta')
    if (meta) {
      const postdata = JSON.parse(meta)?.post_categories
      const processed_data = Object.entries(postdata).map(([key, value]) => ({
        label: key,
        value: value,
      }))

      setPostTypes(processed_data)
    }
  }
  async function onSubmit(data) {
    const assigned_properties_data =
      data?.property_ids?.length > 0 ? data.property_ids.map((element) => element.value) : []

    const body = { ...data, property_ids: assigned_properties_data }
    await post(`/v1/admin/posts`, { post: body })
    if (response.ok) {
      toast('Post added successfully')
      after_submit()
      reset()
      setVisible(!visible)
    } else {
      setErrors(response.data.errors)
      toast(response.data?.message)
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn flex s-3 custom_theme_button"
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Add Post
      </button>
      <CModal
        alignment="center"
        size="xl"
        visible={visible}
        backdrop="static"
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampsleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Add Post </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Title</label>
                    <Form.Control
                      required
                      placeholder="title"
                      type="text"
                      {...register('title')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>
                      Post Type
                      <small className="text-danger"> *{errors ? errors.role : null} </small>
                    </label>
                    <Controller
                      name="category"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={postTypes}
                          value={postTypes.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                        />
                      )}
                      control={control}
                      placeholder="Role"
                    />
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Assigned Properties</label>

                    <Controller
                      name="property_ids"
                      render={({ field }) => (
                        <Select
                          isMulti
                          type="text"
                          className="basic-multi-select"
                          classNamePrefix="select"
                          {...field}
                          options={properties_data}
                        />
                      )}
                      control={control}
                      placeholder="Assigned Properties"
                    />
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Content</label>
                    <Form.Control
                      as="textarea"
                      rows={20}
                      placeholder="Content"
                      {...register('content')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-center">
                <CModalFooter>
                  <Button
                    data-mdb-ripple-init
                    type="submit"
                    className="btn custom_theme_button btn-primary btn-block"
                  >
                    Submit
                  </Button>
                  <CButton
                    className="custom_grey_button"
                    color="secondary"
                    onClick={() => setVisible(false)}
                  >
                    Close
                  </CButton>
                </CModalFooter>
              </div>
            </Form>
            <div className="clearfix"></div>
          </CContainer>
        </CModalBody>
      </CModal>
    </div>
  )
}

AddNews.propTypes = {
  after_submit: PropTypes.func,
}
