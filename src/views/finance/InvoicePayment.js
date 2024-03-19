import React, { useEffect, useState } from 'react'
import {
  CModalBody,
  CModalTitle,
  CModalHeader,
  CModal,
  CContainer,
  CModalFooter,
  CFormCheck,
  CButton,
} from '@coreui/react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import useFetch from 'use-http'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { PaymentField } from './PaymentType'

export default function InvoicePayment({ invoice }) {
  const { register, handleSubmit, control, reset, setValue, watch } = useForm()
  const { post, response } = useFetch()
  const [errors, setErrors] = useState({})
  const [payment_type, setPayment_type] = useState(undefined)

  useEffect(() => {
    setValue('amount', invoice?.total_amount)
  }, [])

  console.log(invoice)

  const [visible, setVisible] = useState(false)

  async function onSubmit(data) {
    const apiResponse = await post(`/v1/admin/invoices/${invoice.id}/pay`, {
      payment: data,
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
                      placeholder="Amount"
                      type="text"
                      {...register('amount')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-3 mt-3" md="12">
                  <Form.Group>
                    <label>Payment Date</label>
                    <Form.Control
                      required
                      valueAsDate={new Date()}
                      placeholder="payment_date"
                      type="date"
                      {...register('payment_date')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3 d-flex" md="12">
                  <label className="pe-3">Payment Type</label>

                  <CFormCheck
                    type="radio"
                    id="cashRadio"
                    label="Cash"
                    name="payment_type"
                    className="mx-1"
                    checked={payment_type === 'cash'}
                    onChange={() => {
                      setPayment_type('cash')
                      setValue('payment_type', 'cash')
                    }}
                  />
                  <CFormCheck
                    type="radio"
                    id="chequeRadio"
                    className="mx-1"
                    checked={payment_type === 'cheque'}
                    onChange={() => {
                      setPayment_type('cheque')
                      setValue('payment_type', 'cheque')
                    }}
                    label="Cheque"
                  />
                  <CFormCheck
                    type="radio"
                    id="cardRadio"
                    className="mx-1"
                    name="payment_type"
                    checked={payment_type === 'card'}
                    onChange={() => {
                      setPayment_type('card')
                      setValue('payment_type', 'card')
                    }}
                    label="Card"
                  />
                </Col>
              </Row>
              {payment_type ? PaymentField(payment_type, register) : null}

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
