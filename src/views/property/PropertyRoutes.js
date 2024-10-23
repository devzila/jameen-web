import React, { Suspense } from 'react'
import { Navigate, Route, Routes, Link } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import PropertyNav from './propertynav/PropertyNav'
import OverviewContent from '../property/propertynav/OverviewContent'
import Showunit from './unit/ShowUnitModule/ShowUnit'
import ShowContract from './propertynav/Contracts/ShowContracts/ShowContract'
import Buildings from './propertynav/Building/Buildings'
import PropertyUnitTypes from './propertynav/UnitTypes/PropertyUnitTypes'
import Properties from './Properties'
import ShowInvoices from '../finance/ShowInvoices'
import Invoices from './propertynav/Invoices'
import MovingIn from './propertynav/MovingIn/MovingIn'

export default function Property() {
  const PropertyUnit = React.lazy(() => import('../property/unit/Unit'))
  const ParkingLot = React.lazy(() => import('../property/propertynav/ParkingLot'))
  const PropUnitAllotment = React.lazy(() => import('./propertynav/Allotment/PropUnitAllotment'))
  const Contracts = React.lazy(() => import('./propertynav/Contracts/Contracts'))
  const PropMaintenancesCategory = React.lazy(() =>
    import('./propertynav/MaintenanceCategory/PropMaintenancesCat'),
  )
  const ShowMaintance = React.lazy(() => import('../maintenance/ShowMaintance'))
  const Documents = React.lazy(() => import('../property/propertynav/Documents'))
  const Assets = React.lazy(() => import('./propertynav/Assets/Assets'))
  const Template = React.lazy(() => import('./propertynav/Templates/Template'))

  const BillableItems = React.lazy(() =>
    import('./propertynav/UnitTypes/BillableCrud/BilliableItems'),
  )
  return (
    <>
      <PropertyNav />
      <CContainer fluid className="p-0">
        <Routes path="/properties/:propertyId" name="Properties" element={<Properties />}>
          <Route path="/" name="Overview" element={<OverviewContent />} />
          <Route path="overview" name="Overview" element={<OverviewContent />} />
          <Route path="unit" name="Unit" element={<PropertyUnit />} />
          <Route path="unit-types" name="Unit Types" element={<PropertyUnitTypes />} />
          <Route path="unit-types/:unittypeID/billableitems" element={<BillableItems />} />
          <Route path="unit/:unitId" name="Unit" element={<Showunit />} />
          <Route
            path="unit/:unitId/contract/:contractId"
            name="Moving In"
            element={<ShowContract />}
          />

          <Route path="contracts/:contractId" name="Unit" element={<ShowContract />} />
          <Route
            path="contracts/:contractId/invoice/:invoiceId"
            name="Invoice"
            element={<ShowInvoices />}
          />
          <Route path="ParkingLot" name="ParkingLot" element={<ParkingLot />} />
          <Route path="Allotment" name="Allotment" element={<PropUnitAllotment />} />
          <Route path="Contracts" name="Contracts" element={<Contracts />} />
          <Route
            path="maintenance-requests"
            name="Maintenance"
            element={<PropMaintenancesCategory />}
          />
          <Route
            path="maintenance-requests/:maintenanceid"
            name="Maintenance"
            element={<ShowMaintance />}
          />
          <Route path="moving-in" name="Moving In" element={<MovingIn />} />
          <Route path="moving-in/:contractId" name="Moving In" element={<ShowContract />} />
          <Route
            path="moving-in/:contractId/invoice/:invoiceId"
            name="Moving In"
            element={<ShowInvoices />}
          />

          <Route path="Buildings" name="Buildings" element={<Buildings />} />
          <Route path="Documents" name="Documents" element={<Documents />} />
          <Route path="assets" name="Documents" element={<Assets />} />
          <Route path="templates" name="CreditNotes" element={<Template />} />
          <Route path="invoices" name="Invoices" element={<Invoices />} />
          <Route path="invoices/:invoiceId" name="Invoice" element={<ShowInvoices />} />
        </Routes>
      </CContainer>
    </>
  )
}
