import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer } from '@coreui/react'
import ShowMaintance from 'src/views/maintenance/ShowMaintance'
import Loading from 'src/components/loading/loading'

// routes config
const Dashboard = React.lazy(() => import('../views/dashboard/Dashboard'))
const Finance = React.lazy(() => import('../views/finance/Finance'))
const Residents = React.lazy(() => import('../views/resident/Residents'))
const Unit = React.lazy(() => import('../views/property/unit/Unit'))
const Properties = React.lazy(() => import('../views/property/Properties'))
const PropertyRoutes = React.lazy(() => import('../views/property/PropertyRoutes'))
const MaintenanceCategory = React.lazy(() => import('../views/maintenance/Maintenance'))
const MaintenaceRoutes = React.lazy(() => import('../views/maintenance/MaintenanceRoutes'))
const Visitor = React.lazy(() => import('../views/visitor/Visitor'))
const News = React.lazy(() => import('../views/news/News'))
const NewsRoutes = React.lazy(() => import('../views/news/NewsRoutes'))

const Report = React.lazy(() => import('../views/report/Report'))
const SettingsRoutes = React.lazy(() => import('../views/settings/SettingRoutes'))
const Page404 = React.lazy(() => import('../views/Page404'))

const ShowUnit = React.lazy(() => import('../views/property/unit/ShowUnitModule/ShowUnit'))
const ResidentRoutes = React.lazy(() => import('../views/resident/ResidentNav/ResidentRoutes'))
const ShowInvoices = React.lazy(() => import('../views/finance/ShowInvoices'))
const DashboardRoutes = React.lazy(() => import('../views/dashboard/DashboardRoutes'))

const AppContent = () => {
  return (
    <CContainer fluid>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" exact={true} name="Dashboard" element={<Dashboard />} />
          <Route path="login" element={<Navigate to="/dashboard/overview" />} />

          <Route path="/finance" name="Finance" element={<Finance />} />
          <Route path="/finance/invoice/:invoiceId" element={<ShowInvoices />} />
          <Route path="/resident" name="Resident" element={<Residents />} />
          <Route path="/resident/:residentId/*" name="RView" element={<ResidentRoutes />} />
          <Route path="/properties" name="Properties" element={<Properties />} />
          <Route path="/properties/:propertyId/*" element={<PropertyRoutes />} />
          <Route path="/properties/:propertyId/units/" name="Unit" element={<Unit />} />

          <Route
            path="/properties/:propertyId/units/:unitId"
            name="ShowUnit"
            element={<ShowUnit />}
          />
          <Route path="/dashboard" name="Dashboard" element={<Dashboard />} />
          <Route path="/dashboard/*" name="Dashboard" element={<Dashboard />} />

          <Route path="/maintenance-request" name="Maintenance" element={<MaintenanceCategory />} />
          <Route
            path="/maintenance-request/:maintenanceid"
            name="Maintenance"
            element={<ShowMaintance />}
          />
          <Route path="/visitor" name="Visitor" element={<Visitor />} />
          <Route path="/news" name="News" element={<News />} />
          <Route path="/news/:postId/*" name="Post" element={<NewsRoutes />} />

          <Route path="/report" name="Report" element={<Report />} />
          <Route path="/settings/*" name="Settings" element={<SettingsRoutes />} />

          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
