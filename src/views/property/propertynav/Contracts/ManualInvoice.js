import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Form, Row, Col } from 'react-bootstrap'
import Select from 'react-select'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CContainer,
} from '@coreui/react'

function ManualInvoice({ after_submit, allotmentId }) {
  const { register, handleSubmit, control } = useForm()
  const { get, post, response, api } = useFetch()

  const { propertyId } = useParams()
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState({})

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'breakups',
  })
  useEffect(() => {
    append()
  }, [])

  async function onSubmit(data) {
    const apiResponse = await post(
      `/v1/admin/premises/properties/${propertyId}/allotments/${allotmentId}/invoices`,
      {
        invoice: data,
      },
    )
    if (response.ok) {
      setVisible(!visible)
      after_submit()
      toast.success('Invoice added successfully')
    } else {
      setErrors(response.data.errors)
      toast(response.data?.message)
    }
  }
  function handleClose() {
    setVisible(false)
    setErrors({})
  }

  return (
    <div>
      <button
        type="button"
        className=" tooltip_button "
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Manual Invoice
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
          <CModalTitle id="StaticBackdropExampleLabel">Add Manual Invoice</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Invoice Date
                      <small className="text-danger"> *{errors ? errors.unit_no : null} </small>
                    </label>
                    <Form.Control type="date" {...register('invoice_date')}></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label> Due Date</label>

                    <Form.Control type="date" {...register('due_date')}></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Period From</label>
                    <Form.Control type="date" {...register('period_from')}></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Period To
                      <small className="text-danger "> *{errors ? errors.year_built : null} </small>
                    </label>

                    <Form.Control type="date" {...register('period_to')}></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                {fields?.map((field, index) => (
                  <Row key={field.id}>
                    <b className="mt-4"> </b>
                    <Col className="pr-1 mt-3" md="4">
                      <Form.Group>
                        <b>Item Name</b>
                        <Form.Control
                          required
                          placeholder=" Name"
                          type="text"
                          {...register(`breakups.${index}.item_name`)}
                        ></Form.Control>
                      </Form.Group>
                    </Col>

                    <Col className="pr-1 mt-3" md="4">
                      <Form.Group>
                        <label>Amount</label>
                        <Form.Control
                          placeholder="- - - -"
                          type="number"
                          min="0"
                          {...register(`breakups.${index}.amount`)}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1 mt-3" md="3">
                      <Form.Group>
                        <label>VAT Amount</label>
                        <Form.Control
                          placeholder="- - - -"
                          type="number"
                          min="0"
                          max="30"
                          {...register(`breakups.${index}.vat_percent`)}
                        ></Form.Control>
                      </Form.Group>
                    </Col>

                    <Col className="mt-4">
                      {fields.length > 1 && (
                        <Col className="justify-content-center mt-2" md="1">
                          <CIcon
                            className="mt-3"
                            onClick={() => remove(index)}
                            icon={freeSet.cilDelete}
                            size="xl"
                            style={{ '--ci-primary-color': 'red' }}
                          />
                        </Col>
                      )}
                    </Col>
                  </Row>
                ))}
              </Row>
              <Col className="m-3 d-flex justify-content-center border-0 bg-white">
                <CButton
                  style={{
                    border: '0px',
                    color: '#00bfcc',
                    backgroundColor: 'white',
                    boxShadow: '5px  5px 20px ',
                    borderRadius: '26px',
                  }}
                  onClick={() => append()}
                >
                  <CIcon className="mt-1 mx-1" icon={freeSet.cilPlus} />
                  Add More Item
                </CButton>
              </Col>

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
    </div>
  )
}

export default ManualInvoice

ManualInvoice.propTypes = {
  after_submit: PropTypes.func,
  allotmentId: PropTypes.number,
}
