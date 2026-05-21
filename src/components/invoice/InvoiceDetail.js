import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import PropTypes from 'prop-types'
import React from 'react'
import CheckPermissions from 'src/permissions/CheckPermissions'
import { formatdate, status_color } from 'src/services/CommonFunctions'
import InvoiceCancel from 'src/views/finance/InvoiceCancel'
import InvoicePayment from 'src/views/finance/InvoicePayment'
import InvoiceStatusAside from 'src/components/invoice/screens/InvoiceStatusAside'

export default function InvoiceDetail({
  invoice,
  onRefresh,
  onDownload,
  showActions = true,
  embedded = false,
}) {
  const wrapperClass = embedded ? '' : 'container mt-4 mb-5 rounded-0'

  return (
    <div className={wrapperClass}>
      <div className="row g-3 g-lg-4 align-items-stretch">
        <div className="col-12 col-lg-7 d-flex">
          <div className="card rounded-1 flex-grow-1 w-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between ">
                <button type="button" className={`request-${status_color(invoice?.status)}`}>
                  {invoice?.status || '-'}
                </button>

                {showActions ? (
                  <div className="d-flex align-items-center">
                    <CIcon
                      icon={freeSet.cilPrint}
                      className="theme_color"
                      size="xxl"
                      onClick={onDownload}
                      title="Download"
                    />
                    {invoice?.status === 'pending' ? (
                      <>
                        <CheckPermissions
                          component={<InvoicePayment invoice={invoice} aftersubmit={onRefresh} />}
                          keys={['invoice', 'can_mark_as_paid']}
                        />
                        <CheckPermissions
                          component={<InvoiceCancel id={invoice.id} aftersubmit={onRefresh} />}
                          keys={['invoice', 'cancel']}
                        />
                      </>
                    ) : null}
                  </div>
                ) : null}
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

              {invoice?.status === 'paid' ? (
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

        <div className="col-12 col-lg-5 d-flex">
          <div className="card rounded-1 flex-grow-1 w-100">
            <div className="card-body p-4">
              <InvoiceStatusAside
                status={invoice?.status}
                invoiceId={invoice?.id}
                onRefresh={onRefresh}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

InvoiceDetail.propTypes = {
  invoice: PropTypes.object.isRequired,
  onRefresh: PropTypes.func,
  onDownload: PropTypes.func,
  showActions: PropTypes.bool,
  embedded: PropTypes.bool,
}
