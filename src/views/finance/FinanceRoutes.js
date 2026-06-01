import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer } from '@coreui/react'
import FinanceNav from './FinanceNav'
import Loading from 'src/components/loading/loading'

export default function FinanceRoutes() {
  const Finance = React.lazy(() => import('./Finance'))
  const CreditNotes = React.lazy(() => import('./credits'))
  const Payments = React.lazy(() => import('./payment'))
  const ShowInvoices = React.lazy(() => import('./ShowInvoices'))

  return (
    <>
      <FinanceNav />
      <CContainer fluid>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Navigate to="/finance/invoices" replace />} />
            <Route path="invoices" name="Invoices" element={<Finance />} />
            <Route path="invoices/:invoiceId" name="Invoice" element={<ShowInvoices />} />
            <Route path="credit-notes" name="Credit Notes" element={<CreditNotes />} />
            <Route path="payments" name="Payments" element={<Payments />} />
            <Route path="*" element={<Navigate to="/finance/invoices" replace />} />
          </Routes>
        </Suspense>
      </CContainer>
    </>
  )
}
