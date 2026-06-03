import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import Paginate from 'src/components/Pagination'
import Loading from 'src/components/loading/loading'
import { formatdate } from 'src/services/CommonFunctions'

const CreditNotes = () => {
  const [creditNotes, setCreditNotes] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [formData, setFormData] = useState({
    contract_id: '',
    amount: '',
    description: '',
  })

  const { get, post, put, response } = useFetch()

  useEffect(() => {
    loadCreditNotes()
  }, [currentPage, searchKeyword])

  const loadCreditNotes = async () => {
    setLoading(true)
    let endpoint = `/v1/admin/credit_notes?page=${currentPage}`
    if (searchKeyword?.trim()) {
      endpoint += `&q[description_cont]=${encodeURIComponent(searchKeyword.trim())}`
    }

    const apiResponse = await get(endpoint)
    if (response.ok && apiResponse?.data) {
      setCreditNotes(apiResponse.data)
      setPagination(apiResponse.pagination)
    } else {
      toast.error('Unable to load credit notes.')
    }
    setLoading(false)
  }

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1)
  }

  const handleSearchInputChange = (e) => {
    const value = e.target.value
    setSearchInput(value)
    if (value === '') {
      setSearchKeyword('')
      setCurrentPage(1)
    }
  }

  const applySearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    setSearchKeyword(searchInput.trim())
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({ contract_id: '', amount: '', description: '' })
  }

  const loadCreditNote = async (id) => {
    setLoading(true)
    const apiResponse = await get(`/v1/admin/credit_notes/${id}`)
    if (response.ok && apiResponse?.data) {
      const note = apiResponse.data
      setFormData({
        contract_id: note.contract_id || '',
        amount: note.amount || '',
        description: note.description || '',
      })
      setEditingId(note.id)
    } else {
      toast.error('Unable to load credit note details.')
    }
    setLoading(false)
  }

  const saveCreditNote = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      credit_note: {
        contract_id: formData.contract_id,
        amount: formData.amount,
        description: formData.description,
      },
    }

    const apiResponse = editingId
      ? await put(`/v1/admin/credit_notes/${editingId}`, payload)
      : await post('/v1/admin/credit_notes', payload)

    if (response.ok) {
      toast.success(`Credit note ${editingId ? 'updated' : 'created'} successfully.`)
      resetForm()
      loadCreditNotes()
    } else {
      toast.error(apiResponse?.message || response?.data?.message || 'Unable to save credit note.')
    }
    setSaving(false)
  }

  return (
    <>
      <div className="container-fluid">
        <section className="w-100 p-0 mt-2">
          <CNavbar expand="lg" colorScheme="light" className="bg-white">
            <CContainer fluid>
              <CNavbarBrand href="#">Credit Notes</CNavbarBrand>
              <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap">
                <form className="d-flex" role="search" onSubmit={applySearch}>
                  <input
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    className="form-control custom_input"
                    type="search"
                    placeholder="Search by description"
                    aria-label="Search"
                  />
                  <button className="btn btn-outline-success custom_search_button" type="submit">
                    Search
                  </button>
                </form>
              </div>
            </CContainer>
          </CNavbar>

          <hr className="text-secondary m-0" />

          <div className="row">
            <div className="col-lg-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h5>{editingId ? 'Edit Credit Note' : 'New Credit Note'}</h5>
                <Form onSubmit={saveCreditNote}>
                  <Form.Group className="mb-3" controlId="contractId">
                    <Form.Label>Contract ID</Form.Label>
                    <Form.Control
                      type="number"
                      name="contract_id"
                      value={formData.contract_id}
                      onChange={handleFormChange}
                      placeholder="Enter contract ID"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="amount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="amount"
                      value={formData.amount}
                      onChange={handleFormChange}
                      placeholder="Enter amount"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Enter description"
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button type="submit" className="custom_theme_button" disabled={saving}>
                      {editingId ? 'Update' : 'Create'}
                    </Button>
                    <Button variant="secondary" type="button" onClick={resetForm} disabled={saving}>
                      Clear
                    </Button>
                  </div>
                </Form>
                <small className="text-muted d-block mt-3">
                  Use the contract ID from an existing allotment contract.
                </small>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="table-responsive bg-white rounded shadow-sm">
                <table className="table table-striped mb-0">
                  <thead>
                    <tr>
                      <th className="py-3 border-0">ID</th>
                      <th className="py-3 border-0">Contract ID</th>
                      <th className="py-3 border-0">Amount</th>
                      <th className="py-3 border-0">Description</th>
                      <th className="py-3 border-0">Created</th>
                      <th className="py-3 border-0">Updated</th>
                      <th className="py-3 border-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditNotes.length > 0 ? (
                      creditNotes.map((note) => (
                        <tr key={note.id}>
                          <td className="py-2">{note.id}</td>
                          <td className="py-2">{note.contract_id || '-'}</td>
                          <td className="py-2">{note.amount || '-'}</td>
                          <td className="py-2">{note.description || '-'}</td>
                          <td className="py-2">{formatdate(note.created_at) || '-'}</td>
                          <td className="py-2">{formatdate(note.updated_at) || '-'}</td>
                          <td className="py-2">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => loadCreditNote(note.id)}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          No credit notes found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {loading && <Loading />}
              </div>
            </div>
          </div>

          <br />
          <CNavbar colorScheme="light" className="bg-light d-flex justify-content-center">
            <Row>
              <Col md="12">
                {pagination?.total_pages > 1 ? (
                  <Paginate
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={pagination.per_page}
                    pageCount={pagination.total_pages}
                    forcePage={currentPage - 1}
                  />
                ) : (
                  <br />
                )}
              </Col>
            </Row>
          </CNavbar>
        </section>
      </div>
    </>
  )
}

export default CreditNotes
