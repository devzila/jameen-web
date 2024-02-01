import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'

import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CContainer,
} from '@coreui/react'

import { Form, Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Edit from './EditUnit'

export default function Showunit(propsd) {
  const { propertyId, unitId } = useParams()
  const [visible, setVisible] = useState(false)
  const [unit, setUnit] = useState([])
  const { get, response } = useFetch()

  useEffect(() => {
    getUnitData()
  }, [])
  async function getUnitData() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}`)
    setUnit(api.data)

    if (response.ok) {
      setUnit(api.data)
    }
  }

  return (
    <div>
      <div>helllo </div>
    </div>
  )
}
