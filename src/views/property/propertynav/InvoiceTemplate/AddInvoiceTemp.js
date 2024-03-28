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

export default function AddInvoiceTemp() {
  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, control, watch, reset } = useForm()
  const { get, post, response } = useFetch()

  return (
    <>
      <button
        type="button"
        className="btn s-3 custom_theme_button "
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Create Template
      </button>
      <CModal visible={visible}>
        <CModalBody></CModalBody>
      </CModal>
    </>
  )
}
