import React, { useEffect, useState } from 'react'
import { useFetch } from 'use-http'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { formatdate } from 'src/services/CommonFunctions'
import { Dropdown, Row, Col } from 'react-bootstrap'
import { BsThreeDots } from 'react-icons/bs'
import CustomDivToggle from 'src/components/CustomDivToggle'
import AddInvoiceTemp from './AddInvoiceTemp'

export default function InvoiceTemplate() {
  const { get, response } = useFetch()
  const [inTemp, setInTemp] = useState([])

  useEffect(() => {
    fetchInvoiceTemplates()
  }, [])

  const fetchInvoiceTemplates = async () => {
    let api = await get('v1/admin/template/invoices')
    console.log(api)
    if (response.ok) {
      setInTemp(api.data)
    }
  }
  console.log(inTemp)
  return (
    <>
      <section className="w-100 p-0 mt-0">
        <div>
        <div className="mask d-flex align-items-center h-100">
            <div className="w-100">
              {/* <CNavbar expand="lg" colorScheme="light" className="bg-white">
                <CContainer fluid>
                  <p className="fs-5 "> Invoice Templates</p>
                  <AddInvoiceTemp after_submit={fetchInvoiceTemplates} />
                </CContainer>
              </CNavbar>
              <hr className="p-0 m-0 text-secondary" /> */}
              <div>
                <div className="mask d-flex align-items-center h-100">
                  <div className="w-100">
                    <div className="row justify-content-center">
                      <div className="col-12">
                        <div className="table-responsive bg-white">
                          <table className="table  table-striped mb-0">
                            <thead>
                              <tr>
                                <th className="pt-3 pb-3 border-0">Name</th>
                                <th className="pt-3 pb-3 border-0 text-nowrap">Created At</th>
                                <th className="pt-3 pb-3 border-0 text-nowrap">Updated At</th>
                                <th className="pt-3 pb-3 border-0">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inTemp.map((intemp) => (
                                <tr key={intemp.id}>
                                  <td className="pt-3 text-capitalize">{intemp.name || '-'}</td>
                                  <td className="pt-3 text-nowrap">
                                    {formatdate(intemp.created_at)}
                                  </td>
                                  <td className="pt-3 text-nowrap">
                                    {formatdate(intemp.updated_at)}
                                  </td>
                                  <td>
                                    <Dropdown>
                                      <Dropdown.Toggle
                                        as={CustomDivToggle}
                                        style={{ cursor: 'pointer' }}
                                      >
                                        <BsThreeDots />
                                      </Dropdown.Toggle>
                                    </Dropdown>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
