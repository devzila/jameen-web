import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { Dropdown } from 'react-bootstrap'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { Row, Col } from 'react-bootstrap'
import { BsThreeDots } from 'react-icons/bs'
import { formatdate } from '../../../../services/CommonFunctions'

import CustomDivToggle from 'src/components/CustomDivToggle'
import EditTemplate from './EditTemplate'
import { useParams } from 'react-router-dom'
import AddTemp from './AddTemp'

const CreditNote = () => {
  const { get, response } = useFetch()
  const { propertyId, unitId } = useParams()
  const [creditNotes, setCreditNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectValue, setSelectValue] = useState(null)
  const [selectedOption, setSelectedOption] = useState('credit_notes')
  const [errors, setErrors] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState(null)

  useEffect(() => {
    loadInitialTemplate()
  }, [currentPage, searchKeyword, selectedOption])

  async function loadInitialTemplate(queries) {
    let endpoint = `/v1/admin/template/${selectedOption}`
    if (queries) {
      endpoint += `&type=${queries}`
    }
    if (searchKeyword) {
      endpoint += `&q=${searchKeyword}`
    }
    const initialCreditNotes = await get(endpoint)

    if (response.ok) {
      if (initialCreditNotes.data) {
        setLoading(false)
        setCreditNotes(initialCreditNotes.data)
        setPagination(initialCreditNotes.pagination)
      }
    } else {
      setErrors(true)
      setLoading(false)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  const refreshData = () => {
    loadInitialTemplate()
    setSearchKeyword('')
  }

  const onChange = (event) => {
    const value = event.target.value
    setSelectValue(value)
  }
  const handleOptionChange = (option) => {
    setSelectedOption(option)
  }
  return (
    <>
      <section className="w-100 p-0 mt-2">
        <div>
          <div className="mask d-flex align-items-center w-100">
            <div className="w-100">
              <CNavbar expand="lg" colorScheme="light" className="bg-white">
                <CContainer fluid>
                  <CNavbarBrand>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="secondary"
                        className="custom_theme_button"
                        id="dropdown-basic"
                      >
                        {selectedOption?.replace('_', ' ').toUpperCase()}
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="rounded-0 border-0  shadow-lg">
                        <Dropdown.Item
                          onClick={() => handleOptionChange('credit_notes')}
                          className="theme_color"
                        >
                          Credit Notes
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleOptionChange('invoices')}
                          className="theme_color"
                        >
                          Invoice Template
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </CNavbarBrand>
                  <div className="d-flex justify-content-end">
                    <AddTemp option={selectedOption} after_submit={refreshData} />
                  </div>
                </CContainer>
              </CNavbar>
              <hr className="p-0 m-0 text-secondary" />

              <div className="mask d-flex align-items-center w-100">
                <div className="w-100">
                  <div className=" justify-content-center">
                    <div className="w-100">
                      <div className="table-responsive bg-white">
                        <table className="table table-striped mb-0">
                          <thead>
                            <tr>
                              <th className="pt-3 pb-3 border-0">Name</th>
                              <th className="pt-3 pb-3 border-0 text-nowrap">Created At</th>
                              <th className="pt-3 pb-3 border-0 text-nowrap">Updated At</th>
                              <th className="pt-3 pb-3 border-0">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {creditNotes.map((credit_notes) => (
                              <tr key={credit_notes.id}>
                                <td className="pt-3">{credit_notes.name || '-'}</td>
                                <td className="pt-3 text-nowrap">
                                  {formatdate(credit_notes.created_at)}
                                </td>
                                <td className="pt-3 text-nowrap">
                                  {formatdate(credit_notes.updated_at)}
                                </td>
                                <td>
                                  <Dropdown>
                                    <Dropdown.Toggle
                                      as={CustomDivToggle}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <BsThreeDots />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <EditTemplate
                                        id={credit_notes.id}
                                        after_submit={refreshData}
                                        option={selectedOption}
                                      />
                                    </Dropdown.Menu>
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

              {/* {selectedOption === 'invoicr' && <InvoiceTemplate />} */}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default CreditNote
