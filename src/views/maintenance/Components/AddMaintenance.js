import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Form, Row, Col } from 'react-bootstrap'
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
import CommonModal from 'src/views/shared/CommonModal'
import MaintanceBody from '../MaintanceBody'
import MaintenanceForm from './MaintenanceForm'

export default function AddMaintenance() {
  const { register, handleSubmit, control } = useForm()
  const { get, post, response, api } = useFetch()

  const { propertyId } = useParams()
  const [visible, setVisible] = useState(false)
  const [data, setdata] = useState({})
  const [errors, setErrors] = useState({})
  const [units_data, setUnits_data] = useState([])
  const [buildings_data, setBuildings_data] = useState([])

  return (
    <CommonModal
      data={{ header: 'Maintenance Requests', size: 'xl' }}
      component={'Create Request'}
      body={<MaintenanceForm />}
    />
  )
}
