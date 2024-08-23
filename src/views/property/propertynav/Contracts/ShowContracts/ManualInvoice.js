import React, { useState, useEffect } from 'react'
import { useFetch } from 'use-http'
import { toast } from 'react-toastify'
import Loading from 'src/components/loading/loading'
import CustomDivToggle from 'src/components/CustomDivToggle'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { BsThreeDots } from 'react-icons/bs'
import { Dropdown, Row, Col } from 'react-bootstrap'
import { NavLink, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import InvoicePayment from 'src/views/finance/InvoicePayment'
import InvoiceCancel from 'src/views/finance/InvoiceCancel'
import { formatdate } from 'src/services/CommonFunctions'
import { status_color } from 'src/services/CommonFunctions'

const ManualInvoice = () => {
  const [invoices, setInvoices] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)

  const { propertyId, contractId } = useParams()

  const [searchKeyword, setSearchKeyword] = useState(null)
  const { get, response } = useFetch()

  useEffect(() => {
    loadManualInvoices()
  }, [currentPage])

  async function loadManualInvoices() {
    const endpoint = `/v1/admin/premises/properties/${propertyId}/allotments/${contractId}/invoices`
    let manual_invoices = await get(endpoint)
    console.log(manual_invoices)

    if (response.ok) {
      if (manual_invoices.data) {
        setLoading(false)
        setInvoices(manual_invoices.data)
      }
    } else if (response.ok) {
      setErrors(true)
      setLoading(false)
      toast.error('Error')
    }
  }

  return (
    <>
      <div>
        <section className="w-100 p-0 mt-2 ">
          <div>
            <div className="mask d-flex align-items-center h-100">
              <div className="container-fluid p-0">
                <CNavbar expand="lg" colorScheme="light" className="bg-white">
                  <CContainer fluid>
                    <CNavbarBrand href="#">Manual Invoices</CNavbarBrand>
                  </CContainer>
                </CNavbar>
                <hr className="p-0 m-0 text-secondary" />
                {invoices.length >= 1 ? (
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
                                  <NavLink to={`invoice/${invoice.id}`}>{invoice.number}</NavLink>
                                </th>
                                <td className="pt-3">
                                  {' '}
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
                                  <button
                                    className=" text-center  text-white border-0 p-0.7 m-0 rounded-0  "
                                    style={{
                                      backgroundColor: `${status_color(invoice.status)}`,

                                      cursor: 'default',
                                      width: '120px',
                                    }}
                                  >
                                    {invoice.status}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {loading ?? <Loading />}
                        {errors == true
                          ? toast('We are facing a technical issue at our end.')
                          : null}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center  fst-italic bg-white p-5">No Invoice Found</p>
                )}
              </div>
            </div>
          </div>
          <br></br>
        </section>
      </div>
    </>
  )
}
export default ManualInvoice
