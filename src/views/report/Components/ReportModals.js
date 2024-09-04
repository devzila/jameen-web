import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Form, Row, Col } from 'react-bootstrap'
import Select from 'react-select'
import PropTypes, { element } from 'prop-types'
import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
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
            <div>
              <CModalTitle id="StaticBackdropExampleLabel">To do...</CModalTitle>
            </div>
            <div className="theme_color">
              <CIcon icon={freeSet.cilPrint} className="mx-2" size="xxl" />
              <CIcon icon={freeSet.cilLibrary} className="mx-2" size="xxl" />
            </div>
          </div>
        </CModalHeader>
        <CModalBody className="p-0">
          <CContainer fluid>
            <Row>
              <Col md="3" className="vh-100 shadow-lg">
                <b className="p-5">Filters </b>
              </Col>
              <Col md="9">
                <p>Body</p>
              </Col>
            </Row>
          </CContainer>
        </CModalBody>
      </CModal>
    </div>
  )
}

ReportModals.propTypes = {
  component: PropTypes.element,
}
