import React, { useState } from 'react'
import {
  CModalBody,
  CModalTitle,
  CModalHeader,
  CModal,
  CContainer,
  CModalFooter,
  CButton,
} from '@coreui/react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Select from 'react-select'

export default function InvoicePayment({ invoice }) {
  const { register, handleSubmit, control, reset } = useForm()
  const { post, response } = useFetch()
  const [errors, setErrors] = useState({})

  console.log(invoice)

  const [visible, setVisible] = useState(false)

  async function onSubmit(data) {
    const apiResponse = await post(`/v1/admin/premises/properties/${propertyId}/assets`, {
      asset: data,
    })
    if (response.ok) {
      setVisible(!visible)
      reset()
      toast.success('Payment Successfull')
    } else {
      setErrors(response.data.errors)
      toast.error(response.data?.message)
    }
  }

  function handleClose() {
    setVisible(false)
    setErrors({})
  }

  return (
    <div className="text-center mx-1 ">
      <button
        onClick={() => setVisible(!visible)}
        type="button"
        className="btn custom_theme_button  "
        data-mdb-ripple-init
      >
        Pay
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
          <CModalTitle id="StaticBackdropExampleLabel">Payment</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col className="pr-3 mt-3" md="12">
                  <Form.Group>
                    <label>Amount</label>
                    <Form.Control
                      required
                      value={invoice.amount}
                      placeholder="amount"
                      type="text"
                      {...register('amount')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-3 mt-3" md="12">
                  <Form.Group>
                    <label>Name</label>
                    <Form.Control
                      required
                      value={Date.now()}
                      placeholder="payment_date"
                      type="date"
                      {...register('payment_date')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="12"></Col>
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
          </CContainer>
        </CModalBody>
      </CModal>
    </div>
  )
}

InvoicePayment.propTypes = {
  invoice: PropTypes.object,
}
