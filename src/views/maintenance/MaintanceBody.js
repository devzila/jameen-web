import MaintenanceList from './Components/MaintenanceList'
import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { BsThreeDots } from 'react-icons/bs'
import Loading from 'src/components/loading/loading'
import { Row, Col, Dropdown } from 'react-bootstrap'
import { NavLink, useParams } from 'react-router-dom'

import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import CustomDivToggle from '../../components/CustomDivToggle'
// import FilterAccordion from './UnitFunctions/FilterAccordioan'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Loader from 'src/components/loading/loading'

export default function MaintanceBody() {
  const { get, response, error } = useFetch()
  const [maintenance, setMaintenance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loaddMaintenanceRequests()
  }, [])

  async function loaddMaintenanceRequests() {
    let endpoint = await get(`/v1/admin/maintenance/requests`)

    if (response.ok) {
      setLoading(false)
      setMaintenance(endpoint.data)
    }
  }
  return <>{loading ? <Loader /> : <MaintenanceList data={maintenance} />}</>
}
