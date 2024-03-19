import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
const Dashboard = React.lazy(() => import('../views/dashboard/Dashboard'))
const Finance = React.lazy(() => import('../views/finance/Finance'))
const Residents = React.lazy(() => import('../views/resident/Residents'))
const Unit = React.lazy(() => import('../views/property/unit/Unit'))
const Properties = React.lazy(() => import('../views/property/Properties'))
const PropertyRoutes = React.lazy(() => import('../views/property/PropertyRoutes'))
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
const ResidentRoutes = React.lazy(() => import('../views/resident/ResidentNav/ResidentRoutes'))
const ShowInvoices = React.lazy(() => import('../views/finance/ShowInvoices'))

const AppContent = () => {
  return (
    <CContainer fluid>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          <Route path="/" exact={true} name="Dashboard" element={<Dashboard />} />
          <Route path="/finance" name="Finance" element={<Finance />} />
          <Route path="/finance/:invoiceId/view" element={<ShowInvoices />} />
          <Route path="/resident" name="Resident" element={<Residents />} />
          <Route path="/resident/:residentId/*" name="RView" element={<ResidentRoutes />} />
          <Route path="/unit" name="Unit" element={<Unit />} />
          <Route path="/properties" name="Properties" element={<Properties />} />
          <Route path="/properties/:propertyId/*" element={<PropertyRoutes />} />
          <Route path="/properties/:propertyId/units/" name="Unit" element={<Unit />} />

          <Route
            path="/properties/:propertyId/units/:unitId"
            name="ShowUnit"
            element={<ShowUnit />}
          />
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
