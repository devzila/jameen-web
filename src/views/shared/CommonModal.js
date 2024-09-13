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

export default function CommonModal({ component, data, body }) {
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
      <button
        type="button"
        className="btn s-3 custom_theme_button "
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        {component}
      </button>
      <CModal
        alignment="center"
        visible={visible}
        size={data.size}
        backdrop="static"
        onClose={handleClose}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <div className="px-3 d-flex justify-content-between w-100">
            <div className=" d-flex text-secondary">
              <h4>{data.header}</h4>
            </div>
            <div className="theme_color">
              <p>{''}</p>
            </div>
          </div>
        </CModalHeader>
        <CModalBody className="p-0">
          <div>{body}</div>
        </CModalBody>
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
      </CModal>
    </div>
  )
}

CommonModal.propTypes = {
  component: PropTypes.element,
  body: PropTypes.element,
  data: PropTypes.object,
}
