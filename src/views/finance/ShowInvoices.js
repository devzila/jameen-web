import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useFetch } from 'use-http'
import InvoiceDetail from 'src/components/invoice/InvoiceDetail'
import Loading from 'src/components/loading/loading'

function invoiceEndpoints(invoiceId, propertyId) {
  const base = propertyId
    ? `/v1/admin/premises/properties/${propertyId}/invoices/${invoiceId}`
    : `/v1/admin/invoices/${invoiceId}`

  return { show: base, pdf: `${base}.pdf` }
}

const downloadPdf = (pdfString, fileName) => {
  const blob = new Blob([pdfString], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export default function ShowInvoices({ invoice_id: invoiceIdProp, embedded = false }) {
  const { get, response } = useFetch()
  const getRef = useRef(get)
  const responseRef = useRef(response)
  getRef.current = get
  responseRef.current = response

  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const { invoiceId: invoiceIdParam, propertyId } = useParams()
  const invoiceId = String(invoiceIdProp ?? invoiceIdParam ?? '')

  const invoiceIdRef = useRef(invoiceId)
  const propertyIdRef = useRef(propertyId)
  invoiceIdRef.current = invoiceId
  propertyIdRef.current = propertyId

  const loadInvoice = async ({ showLoading = false } = {}) => {
    const id = invoiceIdRef.current
    if (!id) {
      setLoading(false)
      return
    }

    if (showLoading) {
      setLoading(true)
    }

    const { show } = invoiceEndpoints(id, propertyIdRef.current)
    const api = await getRef.current(show)

    if (responseRef.current.ok) {
      setInvoice(api?.data ?? api)
    }

    setLoading(false)
  }

  useEffect(() => {
    loadInvoice({ showLoading: true })
    // Only re-fetch when the route/prop invoice id or property scope changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId, propertyId])

  async function downloadFile() {
    const { pdf } = invoiceEndpoints(invoiceId, propertyId)
    const api = await get(pdf)
    downloadPdf(api, invoice?.number)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <InvoiceDetail
      invoice={invoice ?? {}}
      onRefresh={() => loadInvoice()}
      onDownload={downloadFile}
      embedded={embedded}
    />
  )
}

ShowInvoices.propTypes = {
  invoice_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  embedded: PropTypes.bool,
}
