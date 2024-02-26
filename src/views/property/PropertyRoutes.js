import React, { Suspense } from 'react'
import { Navigate, Route, Routes, Link, Outlet } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import PropertyNav from './propertynav/PropertyNav'
import OverviewContent from '../property/propertynav/OverviewContent'
import Showunit from './unit/ShowUnitModule/ShowUnit'

export default function Property() {
  const PropertyUnit = React.lazy(() => import('../property/propertynav/PropertyUnits'))
  const PropertyUnitTypes = React.lazy(() => import('./propertynav/UnitTypes/PropertyUnitTypes'))
  const ParkingLot = React.lazy(() => import('../property/propertynav/ParkingLot'))
  const Documents = React.lazy(() => import('../property/propertynav/Documents'))
  const Billing = React.lazy(() => import('../property/propertynav/Billing'))
  const BillableItems = React.lazy(() =>
    import('./propertynav/UnitTypes/BillableCrud/BilliableItems'),
  )
  return (
    <>
      <PropertyNav />
      <CContainer lg>
        <Routes>
          <Route path="overview" name="Overview" element={<OverviewContent />} />
          <Route path="unit" name="Unit" element={<PropertyUnit />} />
          <Route path="unit/:unitId" name="Unit" element={<Showunit />} />

          <Route path="unit-types" name="Unit Types" element={<PropertyUnitTypes />} />
          <Route path="ParkingLot" name="ParkingLot" element={<ParkingLot />} />
          <Route path="Documents" name="Documents" element={<Documents />} />
          <Route path="Billing" name="Billing" element={<Billing />} />
          <Route path="unit-types/:unittypeID/billableitems" element={<BillableItems />} />
        </Routes>
      </CContainer>
    </>
  )
}
