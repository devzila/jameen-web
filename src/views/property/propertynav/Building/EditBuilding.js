import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Form, Row, Col } from 'react-bootstrap'
import Select from 'react-select'
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

export default function EditBuilding() {
  const { register, handleSubmit, control, reset, setValue } = useForm()
  const { get, put, response, api } = useFetch()

  const { propertyId, building_id } = useParams()
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    fetchBuilding()
  }, [])

  async function fetchBuilding() {
    const endpoint = await get(
      `/v1/admin/premises/properties/${propertyId}/buildings/${building_id}`,
    )
    if (response.ok) {
      setValue('name', endpoint.data.name)
      setValue('description', endpoint.data.description)
    }
  }

  async function onSubmit(data) {
    const apiResponse = await put(
      `/v1/admin/premises/properties/${propertyId}/buildings/${building_id}`,
      {
        building: data,
      },
    )
    if (response.ok) {
      navigate(`/properties/${propertyId}/Buildings`)
      setVisible(!visible)
      reset()
      toast.success('Building Updated successfully')
    } else {
      setErrors(response.data.errors)
      toast.error(response.data?.message || 'Unknown Error')
    }
  }

  function handleClose() {
    setVisible(false)
    setErrors({})
  }

  return (
    <>
      <CContainer className="bg-white p-1 rounded-1 mt-2 px-4">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col className="pr-3 mt-3" md="12">
              <Form.Group>
                <label>Name</label>
                <Form.Control
                  required
                  placeholder="name"
                  type="text"
                  {...register('name')}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col className="pr-1 mt-3" md="12">
              <Form.Group>
                <label>Description</label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Description"
                  {...register('description')}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <div className="text-center mt-2">
            <CModalFooter>
              <Button
                data-mdb-ripple-init
                type="submit"
                className="btn  btn-primary btn-block custom_theme_button"
              >
                Submit
              </Button>
              <CButton className="custom_grey_button">
                <NavLink className="text-white" to={`/properties/${propertyId}/Buildings`}>
                  Cancel
                </NavLink>
              </CButton>
            </CModalFooter>
          </div>
        </Form>
        <div className="clearfix"></div>
      </CContainer>
    </>
  )
}
