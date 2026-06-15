import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import {
  CCard,
  CListGroupItem,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { toast } from 'react-toastify'
import { formatdate } from 'src/services/CommonFunctions'
import logo from '../../../assets/images/avatars/default.png'

export default function ResNotes() {
  const memberId = 1
  const [residentData, setResidentData] = useState({})
  const [notes, setNotes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [editingNote, setEditingNote] = useState(null)

  const { get, post, put, del, loading } = useFetch()
  const fetchResident = async () => {
    const response = await get(`/v1/admin/members/${memberId}`)

    if (response) {
      setResidentData(response.data || response)
    }
  }
  useEffect(() => {
    fetchResident()
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    const response = await get(`/v1/admin/members/${memberId}/notes/`)

    if (response) {
      const data = response?.data || response
      setNotes(Array.isArray(data) ? data : [])
    }
  }

  const handleAdd = () => {
    setEditingNote(null)
    setNoteText('')
    setShowModal(true)
  }

  const handleEdit = (note) => {
    setEditingNote(note)
    setNoteText(note.content || '')
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!noteText.trim()) {
      toast.error('Please enter a note')
      return
    }

    const payload = {
      note: {
        content: noteText,
      },
    }

    let response

    if (editingNote) {
      response = await put(`/v1/admin/members/${memberId}/notes/${editingNote.id}/`, payload)
    } else {
      response = await post(`/v1/admin/members/${memberId}/notes/`, payload)
    }

    if (response) {
      toast.success(editingNote ? 'Note updated successfully' : 'Note added successfully')

      setShowModal(false)
      setNoteText('')
      setEditingNote(null)

      fetchNotes()
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return
    }

    const response = await del(`/v1/admin/members/${memberId}/notes/${id}/`)

    if (response !== undefined) {
      toast.success('Note deleted successfully')
      fetchNotes()
    }
  }

  return (
    <>
      <CCard className="p-3 border-0 shadow-sm mb-3">
        <CListGroupItem>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
              <strong>Resident Notes</strong>
            </div>

            <CButton
              size="sm"
              style={{
                backgroundColor: '#00bfcc',
                borderColor: '#00bfcc',
                color: '#fff',
              }}
              onClick={handleAdd}
            >
              Add Note
            </CButton>
          </div>

          <hr className="text-secondary mt-2 mb-0" />
        </CListGroupItem>

        <div className="mt-3">
          {notes.length === 0 ? (
            <div className="text-center text-muted py-4">No Notes Found</div>
          ) : (
            notes.map((note) => (
              <CCard
                key={note.id}
                className="border-0 shadow-sm mb-3"
                style={{
                  borderLeft: '4px solid #00bfcc',
                }}
              >
                <div className="p-3">
                  <div className="row align-items-start">
                    {/* Note Content */}
                    <div className="col-md-8">
                      <div className="fw-semibold theme_color mb-2">Note</div>

                      <div
                        className="text-dark"
                        style={{
                          whiteSpace: 'pre-wrap',
                          lineHeight: '1.8',
                          fontSize: '15px',
                          minHeight: '80px',
                        }}
                      >
                        {note.content}
                      </div>
                    </div>

                    {/* Resident Info */}
                    <div className="col-md-4 border-start">
                      <div className="d-flex align-items-center mb-3">
                        <img
                          src={residentData?.avatar || logo}
                          alt="Resident"
                          className="rounded-circle me-3"
                          style={{
                            width: '55px',
                            height: '55px',
                            objectFit: 'cover',
                            border: '2px solid #00bfcc',
                          }}
                        />

                        <div>
                          <div className="fw-bold">{note.created_by?.name || 'System User'}</div>

                          <small className="text-muted d-block">Last Updated</small>

                          <small className="text-muted">
                            {formatdate(note.updated_at || note.created_at)}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CCard>
            ))
          )}
        </div>
      </CCard>

      <CModal visible={showModal} onClose={() => setShowModal(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>{editingNote ? 'Edit Note' : 'Add Note'}</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <label className="mb-2 fw-semibold">Note</label>

          <CFormTextarea
            rows={5}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Enter note here..."
          />
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </CButton>

          <CButton
            style={{
              backgroundColor: '#00bfcc',
              borderColor: '#00bfcc',
              color: '#fff',
            }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
