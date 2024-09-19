import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ShowMaintance from './ShowMaintance'
import { Container } from 'react-bootstrap'
import Maintenance from './Maintenance'

export default function MaintenanceRoutes() {
  return (
    <>
      <Container fluid>
        <Routes>
          <Route path="/maintenance-category/:maintenanceid">
            <Route path="*" element={<ShowMaintance />} />
          </Route>
        </Routes>
      </Container>
    </>
  )
}
