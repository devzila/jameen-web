import React, { Suspense } from 'react'
import { Navigate, Route, Routes, Link, Outlet } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import PropertyNav from './propertynav/PropertyNav'
import OverviewContent from '../property/propertynav/OverviewContent'
import Showunit from './unit/ShowUnitModule/ShowUnit'

export default function Property() {
  const PropertyUnit = React.lazy(() => import('../property/unit/Unit'))
  const PropertyUnitTypes = React.lazy(() => import('./propertynav/UnitTypes/PropertyUnitTypes'))
  const Buildings = React.lazy(() => import('./propertynav/Building/Buildings'))
  const ParkingLot = React.lazy(() => import('../property/propertynav/ParkingLot'))
  const PropUnitAllotment = React.lazy(() => import('./propertynav/Allotment/PropUnitAllotment'))
  const Contracts = React.lazy(() => import('./propertynav/Contracts/Contracts'))
  const Documents = React.lazy(() => import('../property/propertynav/Documents'))
  const Invoices = React.lazy(() => import('./propertynav/Invoices'))
  const Assets = React.lazy(() => import('./propertynav/Assets/Assets'))

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
          <Route path="unit-types" name="Unit Types" element={<PropertyUnitTypes />} />
          <Route path="unit-types/:unittypeID/billableitems" element={<BillableItems />} />
          <Route path="unit/:unitId" name="Unit" element={<Showunit />} />{' '}
          {/* Move this route up */}
          <Route path="ParkingLot" name="ParkingLot" element={<ParkingLot />} />
          <Route path="Allotment" name="Allotment" element={<PropUnitAllotment />} />
          <Route path="Contracts" name="Contracts" element={<Contracts />} />
          <Route path="Buildings" name="Buildings" element={<Buildings />} />
          <Route path="Documents" name="Documents" element={<Documents />} />
          <Route path="assets" name="Documents" element={<Assets />} />

          <Route path="Invoices" name="Invoices" element={<Invoices />} />
        </Routes>
      </CContainer>
    </>
  )
}
