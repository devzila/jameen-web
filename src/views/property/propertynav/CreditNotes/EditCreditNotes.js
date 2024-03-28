import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
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

export default function EditCreditNotes({ after_submit, id }) {
  const { register, handleSubmit, control, reset, setValue } = useForm()
  const { get, put, response, api } = useFetch()

  const { propertyId } = useParams()
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    fetchCreditNotes()
  }, [])

  async function fetchCreditNotes() {
    const endpoint = await get(`/v1/admin/template/credit_notes/${id}`)
    console.log(endpoint)
    if (response.ok) {
      setValue('name', endpoint?.data?.name)
      setValue('content', endpoint?.data?.content)
    }
  }

  async function onSubmit(data) {
    const apiResponse = await put(`/v1/admin/template/credit_notes/${id}`, {
      credit_note: data,
    })
    if (response.ok) {
      navigate(`/properties/${propertyId}/CreditNotes`)
      setVisible(!visible)
      after_submit()
      toast.success('Building added successfully')
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
          <CModalTitle id="StaticBackdropExampleLabel">Edit Building</CModalTitle>
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
                      placeholder="name"
                      type="text"
                      {...register('name')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>content</label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="content"
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
                    className="btn  btn-primary btn-block custom_theme_button"
                  >
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

EditCreditNotes.propTypes = {
  after_submit: PropTypes.func,
  id: PropTypes.number,
}