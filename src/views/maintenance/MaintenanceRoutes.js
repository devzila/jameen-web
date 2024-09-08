import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ShowMaintance from './ShowMaintance'
import { Container } from 'react-bootstrap'

export default function MaintenanceRoutes() {
  return (
    <>
      <Container fluid>
        <Routes path="/" name="Maintenance" element={<ShowMaintance />}>
          <Route path="/" name="Maintenance" element={<ShowMaintance />} />
        </Routes>
      </Container>
    </>
  )
}
