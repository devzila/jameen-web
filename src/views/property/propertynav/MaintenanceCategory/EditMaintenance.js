import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
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

export default function EditMaintenance({ afterSubmit, categoryId, isDefault }) {
  const { register, handleSubmit, control, reset, setValue } = useForm()
  const { get, put, response, api } = useFetch()

  const { propertyId } = useParams()
  const [visible, setVisible] = useState(false)
  const [maintenanceCategory, setMaintenanceCategory] = useState({})
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    fetchMaintenanceCategory()
  }, [])

  async function fetchMaintenanceCategory() {
    const endpoint = await get(
      `/v1/admin/premises/properties/${propertyId}/maintenance_categories/${categoryId}`,
    )
    if (response.ok) {
      setMaintenanceCategory(endpoint.data)
      setValue('name', endpoint.data.name)
      setValue('description', endpoint.data.description)
      setValue('priority', endpoint.data.priority || '') // Set priority value or empty string if not provided
    }
  }

  async function onSubmit(data) {
    const apiResponse = await put(
      `/v1/admin/premises/properties/${propertyId}/maintenance_categories/${categoryId}`,
      {
        category: data,
      },
    )
    if (response.ok) {
      setVisible(false)
      afterSubmit()
      toast.success('Maintenance category updated successfully')
    } else {
      setErrors(response.data.errors)
      toast.error(response.data?.message || 'Unknown Error')
    }
  }

  function handleClose() {
    setVisible(false)
  }

  return (
    <>
      <button
        type="button"
        className="tooltip_button"
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Edit
      </button>
      <CModal
        alignment="center"
        size="xl"
        visible={visible}
        backdrop="static"
        onClose={handleClose}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Edit Maintenance Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col className="pr-3 mt-3" md="12">
                  <Form.Group>
                    <label>Name</label>
                    <Form.Control
                      required
                      placeholder="Name"
                      type="text"
                      defaultValue={maintenanceCategory.name}
                      {...register('name')}
                    />
                  </Form.Group>
                </Col>

                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Description</label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Description"
                      defaultValue={maintenanceCategory.description}
                      {...register('description')}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-3 mt-3" md="6">
                  <Form.Group>
                    <label>Priority</label>
                    <Form.Control as="select" {...register('priority')} defaultValue={isDefault}>
                      <option value="high">High</option>
                      <option value="low">Low</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Is Default</label>
                    <Form.Control
                      as="select"
                      {...register('is_default')}
                      defaultValue={isDefault ? 'true' : 'false'}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-center">
                <CModalFooter>
                  <Button type="submit" className="btn btn-primary btn-block custom_theme_button">
                    Submit
                  </Button>
                  <CButton
                    className="custom_grey_button"
                    color="secondary"
                    style={{ border: '0px', color: 'white' }}
                    onClick={handleClose}
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
    </>
  )
}

EditMaintenance.propTypes = {
  afterSubmit: PropTypes.func,
  categoryId: PropTypes.number,
  isDefault: PropTypes.bool.isRequired,
}
