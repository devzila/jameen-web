import React, { useState, useEffect } from 'react'
import { useFetch } from 'use-http'
import { toast } from 'react-toastify'
import Loading from 'src/components/loading/loading'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { Form } from 'react-bootstrap'

import { formatdate } from 'src/services/CommonFunctions'
import { status_color } from 'src/services/CommonFunctions'
import PropTypes from 'prop-types'
import AddManualInvoice from './AddInvoice'
import ShowInvoicePopup from './ShowInvoicePopup'
import ShowInvoices from 'src/views/finance/ShowInvoices'
import CheckPermissions from 'src/permissions/CheckPermissions'

const INVOICE_STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: '1', label: 'Pending' },
  { value: '2', label: 'Due' },
  { value: '3', label: 'Paid' },
  { value: '4', label: 'Partial paid' },
  { value: '5', label: 'Cancelled' },
]

const Invoice = ({ after_submit, contract }) => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  const { propertyId, contractId } = useParams()

  const [searchInput, setSearchInput] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const { get, response } = useFetch()

  function handleClose() {
    setVisible(false)
  }

  useEffect(() => {
    loadManualInvoices()
  }, [propertyId, contractId, searchKeyword, statusFilter])

  async function loadManualInvoices() {
    setLoading(true)
    let endpoint = `/v1/admin/premises/properties/${propertyId}/allotments/${contractId}/invoices`
    const params = []
    if (searchKeyword?.trim()) {
      params.push(`q[number_cont]=${encodeURIComponent(searchKeyword.trim())}`)
    }
    if (statusFilter !== '') {
      params.push(`q[status_eq]=${statusFilter}`)
    }
    if (params.length) {
      endpoint += `?${params.join('&')}`
    }

    const manual_invoices = await get(endpoint)

    if (response.ok) {
      if (manual_invoices.data) {
        setInvoices(manual_invoices.data)
      }
    } else {
      toast.error('We are facing a technical issue at our end.')
    }
    setLoading(false)
  }

  function applySearch(e) {
    e?.preventDefault()
    setSearchKeyword(searchInput.trim())
  }

  function handleSearchInputChange(e) {
    const value = e.target.value
    setSearchInput(value)
    if (value === '') {
      setSearchKeyword('')
    }
  }

  function handleStatusFilterChange(e) {
    setStatusFilter(e.target.value)
  }

  return (
    <>
      <div>
        <section className="w-100">
          <div className="mask d-flex align-items-center h-100">
            <div className="container-fluid p-3  border-0 theme_color">
              <div className="d-flex w-100 justify-content-between align-items-center flex-wrap gap-2">
                <div className="mb-3 mb-md-0">
                  <CIcon icon={freeSet.cilList} size="lg" className="me-2" />
                  <strong className="text-black">Invoices</strong>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
                  <Form.Select
                    aria-label="Filter by invoice status"
                    className="custom_input"
                    style={{ width: 'auto', minWidth: '160px' }}
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                  >
                    {INVOICE_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value || 'all'} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Form.Select>
                  <form className="d-flex" role="search" onSubmit={applySearch}>
                    <input
                      value={searchInput}
                      onChange={handleSearchInputChange}
                      className="form-control custom_input"
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                    />
                    <button className="btn btn-outline-success custom_search_button" type="submit">
                      <CIcon icon={freeSet.cilSearch} />
                    </button>
                  </form>
                  {contract.contract_type == 'allotment' ? (
                    <CheckPermissions
                      component={<AddManualInvoice after_submit={loadManualInvoices} />}
                      keys={['invoice', 'create']}
                    />
                  ) : null}
                </div>
              </div>

              <hr className="p-0 m-0 text-secondary" />
              {loading && invoices.length === 0 ? (
                <Loading />
              ) : invoices.length >= 1 ? (
                <div className="row justify-content-center">
                  <div className="col-12">
                    <div className="table-responsive bg-white">
                      <table className="table table-striped  mb-0">
                        <thead
                          style={{
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overFlow: 'hidden',
                          }}
                        >
                          <tr>
                            <th className="py-3 border-0">Invoice No.</th>
                            <th className="py-3 border-0">Total Amount(Amount + VAT)</th>

                            <th className="py-3 border-0">Invoice Date</th>
                            <th className="py-3 border-0">Period</th>
                            <th className="py-3 border-0">Due Date</th>

                            <th className="py-3 border-0">Status </th>
                          </tr>
                        </thead>

                        <tbody>
                          {invoices?.map((invoice) => (
                            <tr key={invoice.id}>
                              <th className="pt-3 ps-3 border-0" scope="row">
                                <ShowInvoicePopup
                                  data={[{ header: 'Invoice', size: 'lg' }]}
                                  component={
                                    <button
                                      type="button"
                                      className="theme_color border-0 p-0"
                                      data-mdb-ripple-init
                                      onClick={() => setVisible(!visible)}
                                    >
                                      {invoice.number}
                                    </button>
                                  }
                                  visible={visible}
                                  body={<ShowInvoices invoice_id={invoice.id} />}
                                  handleClose={handleClose}
                                />
                              </th>
                              <td className="pt-3">
                                {invoice
                                  ? `${invoice.total_amount} (${
                                      invoice.amount + ' + ' + invoice.vat_amount
                                    })`
                                  : '-' || 0}
                              </td>
                              <td className="pt-3">{formatdate(invoice?.invoice_date) || '-'}</td>
                              <td className="pt-3">
                                {formatdate(invoice?.period_from) +
                                  '/' +
                                  formatdate(invoice?.period_to)}
                              </td>{' '}
                              <td className="pt-3">{invoice?.due_date || '-'}</td>
                              <td className="pt-3">
                                <button className={`request-${status_color(invoice?.status)}`}>
                                  {invoice.status}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {loading && <Loading />}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center fst-italic text-secondary bg-white p-3">
                  No Invoice Found
                </p>
              )}
            </div>
          </div>

          <br></br>
        </section>
      </div>
    </>
  )
}
export default Invoice

Invoice.propTypes = {
  after_submit: PropTypes.func,
  contract: PropTypes.object,
}
