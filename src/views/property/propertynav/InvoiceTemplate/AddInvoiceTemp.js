import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
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

import { Button, Form, Row, Col } from 'react-bootstrap'

import InvoiceTemple from './InvoiceTem'

export default function AddInvoiceTemp({ after_submit }) {
  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, control, watch, reset } = useForm()
  const { get, post, response } = useFetch()

  async function onSubmit(data) {
    const apiResponse = await post(`/v1/admin/tempate/invoices`, { invoice: data })

    console.log(response)

    if (response.ok) {
      toast.success('Template added successfully')
      setVisible(!visible)
      after_submit()
      reset()
    } else {
      toast(apiResponse.data?.message)
    }
  }

  return (
    <>
      <div>
        <button
          type="button"
          className="btn s-3 custom_theme_button "
          data-mdb-ripple-init
          onClick={() => setVisible(!visible)}
        >
          Add Property
        </button>
        <CModal
          alignment="center"
          size="xl"
          visible={visible}
          backdrop="static"
          onClose={() => setVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">Add Template</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col className="pr-1 m-3" md="12">
                    <Form.Group>
                      <label>Name</label>
                      <Form.Control
                        required
                        placeholder="Name"
                        type="text"
                        {...register('name', { required: ' Name is required.' })}
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
                    <CButton className="custom_grey_button" onClick={() => setVisible(false)}>
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
    </>
  )
}

AddInvoiceTemp.propTypes = {
  after_submit: PropTypes.func,
}
