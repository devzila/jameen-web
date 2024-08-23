import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { formatdate } from 'src/services/CommonFunctions'
import { UseFetch, useFetch } from 'use-http'
import { status_color } from 'src/services/CommonFunctions'
import InvoiceCancel from './InvoiceCancel'
import InvoicePayment from './InvoicePayment'
export default function ShowInvoices() {
  const { get, response } = useFetch()
  const [invoice, setInvoice] = useState({})
  const { invoiceId } = useParams()

  const getInvoice = async () => {
    const api = await get(`/v1/admin/invoices/${invoiceId}`)

    if (response.ok) {
      setInvoice(api.data)
    }
  }

  async function downloadFile() {
    const api = await get(`/v1/admin/invoices/${invoiceId}.pdf`)
    downloadPdf(api, invoice.number)
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

  useEffect(() => {
    getInvoice()
  }, [])
  return (
    <div className="container mt-6 mb-7 rounded-0">
      <div className="row justify-content-center">
        <div className="col-lg-12 col-xl-7">
          <div className="card rounded-1 mb-2">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between ">
                <button
                  className=" text-center border-0 rounded-0 text-white"
                  style={{
                    backgroundColor: `${status_color(invoice?.status)}`,
                    cursor: 'pointer',
                    width: '120px',
                  }}
                >
                  {invoice?.status || '-'}
                </button>

                <div className="d-flex align-items-center">
                  <CIcon
                    icon={freeSet.cilPrint}
                    className="theme_color"
                    size="xxl"
                    onClick={downloadFile}
                    title="Download"
                  />
                  {invoice?.status === 'pending' ? (
                    <>
                      <InvoicePayment invoice={invoice} aftersubmit={getInvoice} />
                      <InvoiceCancel id={invoice.id} aftersubmit={getInvoice} />
                    </>
                  ) : null}
                </div>
              </div>
              <div className="border-bottom border-top border-gray-200 pt-4 mt-4">
                <div className="row">
                  <div className="col-md-6">
                    <div className="text-muted ">Invoice No.</div>
                    <strong>{invoice?.number || '-'}</strong>
                  </div>

                  <div className="col-md-6 text-md-end">
                    <div className="text-muted mt-2 ">Invoice Date</div>
                    <strong>{formatdate(invoice?.invoice_date || '-')}</strong>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="text-muted ">Invoice Period</div>
                    <strong>
                      {(formatdate(invoice?.period_from) + ' - ' || '-') +
                        formatdate(invoice?.period_to) || '- Present'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className=" table table-striped border-bottom border-gray-200 ">
                  <thead>
                    <tr>
                      <th className="fs-sm text-dark text-uppercase-bold-sm px-1">Description</th>

                      <th className="fs-sm text-dark text-uppercase-bold-sm text-end px-1">VAT</th>
                      <th className="fs-sm text-dark text-uppercase-bold-sm text-end px-1">
                        Discount
                      </th>
                      <th
                        scope="col"
                        className="fs-sm text-dark text-uppercase-bold-sm text-end px-0"
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-monospace fw-light">
                    {invoice?.breakups?.map((items) => (
                      <tr key={items.id}>
                        <td className="px-0">
                          {items?.item_name || '-'}
                          <small>({items?.item_type?.replace(/_/g, ' ') || '-'})</small>
                        </td>

                        <td className="text-end px-1 font-monospace">{items?.vat_amount || '-'}</td>
                        <td className="text-end px-1 font-monospace">{items?.discount || '-'}</td>
                        <td className="text-end px-1 font-monospace">{items?.amount || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-0 ">
                <div className="d-flex justify-content-end">
                  <p className="text-muted me-3">Subtotal:</p>
                  <span>{invoice?.amount || '-'}</span>
                </div>
                <div className="d-flex justify-content-end ">
                  <p className="text-muted me-3">VAT:</p>
                  <span>{invoice?.vat_amount}</span>
                </div>
                <div className="d-flex justify-content-end ">
                  <h5 className="me-2 mt-0">Total:</h5>
                  <h5 className="text-success font-monospace">{invoice?.total_amount || '-'}</h5>
                </div>
              </div>
              <div className="border-top border-gray-200 pt-2">
                <div className="fw-bold mb-1">Transactions</div>
              </div>

              {invoice.status === 'paid' ? (
                <div className="table-responsive ">
                  <table className=" table table-striped border-bottom border-gray-200 ">
                    <thead>
                      <tr>
                        <th className="fs-sm text-dark text-uppercase-bold-sm px-1">Amount</th>
                        <th className="fs-sm text-dark text-uppercase-bold-sm px-1">Date</th>

                        <th className="fs-sm text-dark text-uppercase-bold-sm  text-center px-1">
                          Payment Type
                        </th>
                        <th className="fs-sm text-dark text-uppercase-bold-sm  text-end px-1">
                          Voucher No
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-monospace fw-light">
                      {invoice?.payments?.map((trans, index) => (
                        <React.Fragment key={index}>
                          {trans.transactions?.map((data, dataIndex) => (
                            <tr key={dataIndex}>
                              <td className="text-start px-1 font-monospace">
                                {trans?.amount || '-'}
                              </td>
                              <td className="text-start px-1 font-monospace">
                                {data?.date || '-'}
                              </td>
                              <td className=" px-1 font-monospace">
                                {data?.type?.split('::')[3] || '-'}
                              </td>
                              <td className="text-end px-1 font-monospace">
                                {data?.voucher_number || '-'}
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
