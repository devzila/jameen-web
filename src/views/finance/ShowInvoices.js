import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { formatdate } from 'src/services/CommonFunctions'
import { UseFetch, useFetch } from 'use-http'

export default function ShowInvoices() {
  const { get, response } = useFetch()
  const [invoice, setInvoice] = useState({})
  const { invoiceId } = useParams()

  const getInvoice = async () => {
    const api = await get(`/v1/admin/invoices/${invoiceId}`)
    console.log(api)
    if (response.ok) {
      setInvoice(api.data)
    }
  }

  useEffect(() => {
    getInvoice()
  }, [])
  return (
    <div className="container mt-6 mb-7">
      <div className="row justify-content-center">
        <div className="col-lg-12 col-xl-7">
          <div className="card">
            <div className="card-body p-5">
              <h2>Hey ,</h2>
              <p className="fs-sm font-monospace">
                This is the receipt for a payment of <strong>{invoice?.amount || '-'}</strong> (INR)
                you made to Jameen.
              </p>

              <div className="border-top border-gray-200 pt-4 mt-4">
                <div className="row">
                  <div className="col-md-6">
                    <div className="text-muted mb-2">Invoice No.</div>
                    <strong>{invoice?.number || '-'}</strong>
                  </div>

                  <div className="col-md-6 text-md-end">
                    <div className="text-muted mb-2">Invoice Date</div>
                    <strong>{formatdate(invoice?.invoice_date || '-')}</strong>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="text-muted mb-2">Invoice Period</div>
                    <strong>
                      {(formatdate(invoice?.period_from) + ' - ' || '-') +
                        formatdate(invoice?.period_to) || '- Present'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* <div className="border-top border-gray-200 mt-4 py-4">
                <div className="row">
                  <div className="col-md-6">
                    <div className="text-muted mb-2">Client</div>
                    <strong>John McClane</strong>
                    <p className="fs-sm">
                      989 5th Avenue, New York, 55832
                      <br />
                      <a href="#!" className="text-purple">
                        john@email.com
                      </a>
                    </p>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <div className="text-muted mb-2">Payment To</div>
                    <strong>Themes LLC</strong>
                    <p className="fs-sm">
                      9th Avenue, San Francisco 99383
                      <br />
                      <a href="#!" className="text-purple">
                        themes@email.com
                      </a>
                    </p>
                  </div>
                </div>
              </div> */}

              <table className="table border-bottom border-gray-200 mt-3">
                <thead>
                  <tr>
                    <th scope="col" className="fs-sm text-dark text-uppercase-bold-sm px-0">
                      Description
                    </th>

                    <th
                      scope="col"
                      className="fs-sm text-dark text-uppercase-bold-sm text-end px-0"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="fs-sm text-dark text-uppercase-bold-sm text-end px-0"
                    >
                      VAT
                    </th>
                    <th
                      scope="col"
                      className="fs-sm text-dark text-uppercase-bold-sm text-end px-0"
                    >
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
                        <small>({items?.item_type || '-'})</small>
                      </td>
                      <td className="text-end px-0 font-monospace">{items?.quantity || '-'}</td>

                      <td className="text-end px-0 font-monospace">{items?.vat_amount || '-'}</td>
                      <td className="text-end px-0 font-monospace">{items?.discount || '-'}</td>
                      <td className="text-end px-0 font-monospace">{items?.amount || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-5">
                <div className="d-flex justify-content-end">
                  <p className="text-muted me-3">Subtotal:</p>
                  <span>{invoice?.amount || '-'}</span>
                </div>
                <div className="d-flex justify-content-end">
                  <p className="text-muted me-3">VAT:</p>
                  <span>{invoice?.vat_amount}</span>
                </div>
                <div className="d-flex justify-content-end ">
                  <h5 className="me-3">Total:</h5>
                  <h5 className="text-success font-monospace">{invoice?.total_amount || '-'}</h5>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                fetch(`/v1/admin/invoices/${invoice.id}.pdf`)
              }}
              className="custom_theme_button btn"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// data: {
//   id: 1,
//   amount: '2220.0',
//   vat_amount: '78.6',
//   total_amount: '2298.6',
//   invoice_date: '2024-03-20',
//   number: 'PHS1',
//   period_from: '2024-02-01',
//   period_to: '2024-02-29',
//   status: 'pending',
//   created_at: '2024-03-20T05:30:03.379Z',
//   updated_at: '2024-03-20T05:30:03.379Z',
//   payments: [],
//   breakups: [
//     {
//       id: 1,
//       invoice_id: 1,
//       billable_item_id: null,
//       item_name: 'Maintenance Fee',
//       item_type: 'maintenance_fee',
//       quantity: 1,
//       amount: '1350.0',
//       vat_amount: '0.0',
//       discount: '0.0',
//       created_at: '2024-03-20T05:30:03.400Z',
//       updated_at: '2024-03-20T05:30:03.400Z'
//     },
//     {
//       id: 2,
//       invoice_id: 1,
//       billable_item_id: 24,
//       item_name: 'Club',
//       item_type: 'billable',
//       quantity: 1,
//       amount: '270.0',
//       vat_amount: '48.6',
//       discount: '0.0',
//       created_at: '2024-03-20T05:30:03.407Z',
//       updated_at: '2024-03-20T05:30:03.407Z'
//     },
//     {
//       id: 3,
//       invoice_id: 1,
//       billable_item_id: 23,
//       item_name: 'Internet',
//       item_type: 'billable',
//       quantity: 1,
//       amount: '600.0',
//       vat_amount: '30.0',
//       discount: '0.0',
//       created_at: '2024-03-20T05:30:03.411Z',
//       updated_at: '2024-03-20T05:30:03.411Z'
//     }
//   ]
// }
