import React, { useState } from 'react'
import useFetch from 'use-http'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { Button, Form, Row, Col } from 'react-bootstrap'

import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CContainer,
} from '@coreui/react'

export default function AddVisitor() {
  const [visible, setVisible] = useState(false)

  const { register, handleSubmit, control, reset } = useForm()
  const { post, response } = useFetch()

  const visitorarray = []
  const resident_data = []

  const statusarray = [
    { value: 0, label: 'Requested' },
    { value: 1, label: 'Approved' },
    { value: 2, label: 'Cancelled' },
  ]

  //post method
  async function onSubmit(data) {
    await post(`/v1/admin/visitors`, { visitor: data })
    if (response.ok) {
      toast('New Role Added: Operation Successful')
      reset()

      setVisible(!visible)
    } else {
      toast(response.data?.message)
    }
  }

  return (
    <div>
      <button
        color="#00bfcc"
        type="button"
        className=" btn flex s-3 custom_theme_button"
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Add Visitor
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
          <CModalTitle id="StaticBackdropExampleLabel">Add Visitor </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <div className="col text-center">
                  <p className="text-center display-6" style={{ color: '#00bfcc' }}>
                    JAMEEN
                  </p>
                </div>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>First Name</label>
                    <Form.Control
                      required
                      placeholder="First Name"
                      type="text"
                      {...register('first_name', { required: true })}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Last Name</label>
                    <Form.Control
                      required
                      placeholder="Last Name"
                      type="text"
                      {...register('last_name', { required: ' Name is required.' })}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Email</label>
                    <Form.Control
                      placeholder="abc@example.com"
                      type="text"
                      {...register('email')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Phone No</label>
                    <Form.Control
                      placeholder="Phone Number"
                      type="text"
                      {...register('mobile_number')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-3 mt-3" md="4">
                  <Form.Group>
                    <label>Number Of Visitors</label>
                    <Form.Control
                      required
                      placeholder="0"
                      type="number"
                      {...register('username')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="4">
                  <Form.Group>
                    <label>Plate Number</label>

                    <Form.Control
                      placeholder="-   -   -   -   -   -   -   -   -   "
                      type="text"
                      {...register('plate_number')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="4">
                  <Form.Group>
                    <label>Status</label>
                    <Controller
                      name="status"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={statusarray}
                          value={statusarray.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                        />
                      )}
                      control={control}
                      placeholder="Role"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col className="pr-1 mt-3" md="4">
                  <Form.Group>
                    <label>Unit</label>
                    <Controller
                      name="unit_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={statusarray}
                          value={statusarray.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                        />
                      )}
                      control={control}
                      placeholder="Role"
                    />
                  </Form.Group>
                </Col>

                <Col className="pr-1 mt-3" md="4">
                  <Form.Group>
                    <label>Visit date</label>
                    <Form.Control
                      placeholder="Date of Birth"
                      type="date"
                      {...register('visit_date')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <div className="mt-5 text-center">
                <CModalFooter>
                  <Button data-mdb-ripple-init type="submit" className="custom_theme_button">
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
  )
}
