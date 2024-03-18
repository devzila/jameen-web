import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import useFetch from 'use-http'
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

export default function AddMaintenance({ afterSubmit }) {
  const { register, handleSubmit, reset } = useForm()
  const { post, response } = useFetch()
  const { propertyId } = useParams()
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  async function onSubmit(data) {
    const apiResponse = await post(
      `/v1/admin/premises/properties/${propertyId}/maintenance_categories`,
      {
        category: data,
      },
    )
    if (response.ok) {
      setVisible(false)
      afterSubmit()
      reset()
      toast.success('Maintenance category added successfully')
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
      <Button
        type="button"
        className="btn s-3 custom_theme_button"
        onClick={() => setVisible(true)}
      >
        Add Maintenance
      </Button>
      <CModal
        alignment="center"
        size="xl"
        visible={visible}
        backdrop="static"
        onClose={handleClose}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Add Maintenance Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col className="pr-3 mt-3" md="6">
                  <Form.Group>
                    <label>Name</label>
                    <Form.Control required placeholder="Name" type="text" {...register('name')} />
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Description</label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Description"
                      {...register('description')}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-3 mt-3" md="6">
                  <Form.Group>
                    <label>Priority</label>
                    <Form.Control placeholder="Priority" type="text" {...register('priority')} />
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Is Default</label>
                    <Form.Control as="select" {...register('isDefault')}>
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
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

AddMaintenance.propTypes = {
  afterSubmit: PropTypes.func,
}
