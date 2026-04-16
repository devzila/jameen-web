import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Form, Row, Col, Container } from 'react-bootstrap'
import Select from 'react-select'
import PropTypes, { element } from 'prop-types'
import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import jameenlogo from '../../../assets/images/jameen-logo.png'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CContainer,
  CRow,
} from '@coreui/react'

export default function ReportModals({ component }) {
  const { register, handleSubmit, control } = useForm()
  const { get, post, response, api } = useFetch()
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState({})

  function handleClose() {
    setVisible(false)
    setErrors({})
  }
  return (
    <div>
      <div onClick={() => setVisible(!visible)}>{component}</div>
      <CModal
        alignment="center"
        fullscreen
        visible={visible}
        backdrop="static"
        onClose={handleClose}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <div className="px-3 d-flex justify-content-between w-100">
            <div onClick={() => setVisible(!visible)} className="text-secondary">
              <CIcon icon={freeSet.cilArrowLeft} size="xxl" />
            </div>
            <div className="theme_color">
              <CIcon icon={freeSet.cilPrint} className="mx-2" size="xxl" />
              <CIcon icon={freeSet.cilLibrary} className="mx-2" size="xxl" />
            </div>
          </div>
        </CModalHeader>
        <CModalBody className="p-0">
          <div>
            <Row>
              <Col md="3" className="vh-100 custom_border border-top-0">
                <div className=" p-4">
                  <h4 className="theme_color">Filters </h4>
                  <br />
                  <div className="text-secondary">
                    <Col className="pr-1 mt-2">
                      <Form.Group>
                        <p className="m-0">Property</p>
                        <Controller
                          name="property"
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={[]}
                              value={[].find((c) => c.value === field.value)}
                              onChange={(val) => field.onChange(val.value)}
                            />
                          )}
                          control={control}
                          placeholder="Role"
                        />
                      </Form.Group>
                    </Col>
                    <Col className="pr-1 mt-2">
                      <Form.Group>
                        <p className="m-0">Unit Type</p>
                        <Controller
                          name="unit_type"
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={[]}
                              value={[].find((c) => c.value === field.value)}
                              onChange={(val) => field.onChange(val.value)}
                            />
                          )}
                          control={control}
                          placeholder="Select Unit Type"
                        />
                      </Form.Group>
                    </Col>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button className="btn mt-3 custom_theme_button">Apply</button>
                    <button className="btn mt-3 custom_grey_button">Reset</button>
                  </div>
                </div>
              </Col>
              <Col md="9">
                <div className="mt-2 ps-3 theme_color d-flex align-items-end">
                  <img src={jameenlogo} style={{ width: '40px', height: '40px' }} />
                  <h4 className="px-4 m-0">Jammen </h4>
                </div>
                <div className="p-4">
                  <Container className="custom_border">
                    <p className="fst-italic text-center text-secondary m-5 p-5">Under Progress</p>
                  </Container>
                </div>
              </Col>
            </Row>
          </div>
        </CModalBody>
      </CModal>
    </div>
  )
}

ReportModals.propTypes = {
  component: PropTypes.element,
}
