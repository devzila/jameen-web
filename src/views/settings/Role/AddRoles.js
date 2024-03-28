import React, { useState } from 'react'
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
import { propTypes } from 'react-bootstrap/esm/Image'

export default function AddRoles({ after_submit }) {
  const [visible, setVisible] = useState(false)

  const { register, handleSubmit, control, reset } = useForm()
  const { post, response } = useFetch()

  //post method
  async function onSubmit(data) {
    await post(`/v1/admin/roles`, { role: data })
    if (response.ok) {
      toast('New Role Added: Operation Successful')
      after_submit()
      reset()

      setVisible(!visible)
    } else {
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
        Add Role
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
          <CModalTitle id="StaticBackdropExampleLabel">Add Role </CModalTitle>
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
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Name</label>
                    <Form.Control
                      placeholder="Name"
                      type="text"
                      {...register('name', { required: true })}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-3 mt-3" md="12">
                  <Form.Group>
                    <label>Description</label>
                    <Form.Control
                      required
                      placeholder="Description"
                      type="text"
                      {...register('description')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-center">
                <CModalFooter>
                  <Button data-mdb-ripple-init type="submit" className="btn custom_theme_button">
                    Submit
                  </Button>
                  <CButton
                    color="secondary"
                    className="custom_grey_button"
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

AddRoles.propTypes = {
  after_submit: PropTypes.func,
}
