import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
const Dashboard = React.lazy(() => import('../views/dashboard/Dashboard'))
const Finance = React.lazy(() => import('../views/finance/Finance'))
const Residents = React.lazy(() => import('../views/resident/Residents'))
const Unit = React.lazy(() => import('../views/property/unit/Unit'))
const Properties = React.lazy(() => import('../views/property/Properties'))
const Property = React.lazy(() => import('../views/property/Property'))
const OverviewContent = React.lazy(() => import('../views/property/propertynav/OverviewContent'))
const PropertyUnit = React.lazy(() => import('../views/property/propertynav/PropertyUnit'))
const PropertyUnitTypes = React.lazy(() =>
  import('../views/property/propertynav/PropertyUnitTypes'),
)
const ParkingLot = React.lazy(() => import('../views/property/propertynav/ParkingLot'))
const Documents = React.lazy(() => import('../views/property/propertynav/Documents'))
const Billing = React.lazy(() => import('../views/property/propertynav/Billing'))
const Maintenance = React.lazy(() => import('../views/maintenance/Maintenance'))
const Visitor = React.lazy(() => import('../views/visitor/Visitor'))
const Operation = React.lazy(() => import('../views/operation/Operation'))
const News = React.lazy(() => import('../views/news/News'))
const Report = React.lazy(() => import('../views/report/Report'))
const Settings = React.lazy(() => import('../views/settings/Index'))
const Page404 = React.lazy(() => import('../views/Page404'))
const User = React.lazy(() => import('../views/settings/User/User'))
const Role = React.lazy(() => import('../views/settings/Role/Role'))
const MovingOut = React.lazy(() => import('../views/settings/MovingOut'))

const Allotment = React.lazy(() => import('../views/settings/Allotment'))
const ShowUnit = React.lazy(() => import('../views/property/unit/ShowUnitModule/ShowUnit'))
const ShowResidentPage = React.lazy(() => import('../views/resident/ResidentNav/ShowResidentPage'))

const AppContent = () => {
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          <Route path="/" exact={true} name="Dashboard" element={<Dashboard />} />
          <Route path="/finance" name="Finance" element={<Finance />} />
          <Route path="/resident" name="Resident" element={<Residents />} />
          <Route path="/resident/:residentId/*" name="RView" element={<ShowResidentPage />} />
          <Route path="/unit" name="Unit" element={<Unit />} />
          <Route path="/properties" name="Properties" element={<Properties />} />
          <Route path="properties/:propertyId/add" name="Add" element={<Properties />} />
          <Route path="/properties/:propertyId" element={<Property />} />
          <Route path="/properties/:propertyId/units/" name="Unit" element={<Unit />} />

          <Route
            path="/properties/:propertyId/units/:unitId"
            name="ShowUnit"
            element={<ShowUnit />}
          />
          <Route
            path="/property/:propertyId/OverviewContent"
            name="OverviewContent"
            element={<OverviewContent />}
          />
          <Route
            path="/property/:propertyId/PropertyUnit"
            name="PropertyUnit"
            element={<PropertyUnit />}
          />
          <Route
            path="/property/:propertyId/PropertyUnitTypes"
            name="PropertyUnitTypes"
            element={<PropertyUnitTypes />}
          />
          <Route
            path="/property/:propertyId/ParkingLot"
            name="ParkingLot"
            element={<ParkingLot />}
          />
          <Route path="/property/:propertyId/Documents" name="Documents" element={<Documents />} />
          <Route path="/property/:propertyId/Billing" name="Billing" element={<Billing />} />
          <Route path="/maintenance" name="Maintenance" element={<Maintenance />} />
          <Route path="/visitor" name="Visitor" element={<Visitor />} />
          <Route path="/operation" name="Operation" element={<Operation />} />
          <Route path="/news" name="News" element={<News />} />
          <Route path="/report" name="Report" element={<Report />} />
          <Route path="/settings/*" name="Settings" element={<Settings />}>
            <Route path="users" name="User" element={<User />} />
            <Route path="roles" name="Role" element={<Role />} />
            <Route path="allotment" name="Allotment" element={<Allotment />} />
            <Route path="moving-out" name="Moving Out" element={<MovingOut />} />
          </Route>
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
