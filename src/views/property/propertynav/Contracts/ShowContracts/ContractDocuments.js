import React, { useState, useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { useParams } from 'react-router-dom'
import useFetch from 'use-http'
import Loading from 'src/components/loading/loading'
import AddDocuments from './AddDocuments'
import CommonModal from 'src/views/shared/CommonModal'

const THEME_COLOR = '#00bfcc'

const cardStyle = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0,0,0,.05)',
  overflow: 'hidden',
}

const headerCellStyle = {
  color: '#8a94a6',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  borderBottom: '1px solid #eef1f5',
  padding: '14px 16px',
  whiteSpace: 'nowrap',
}

const bodyCellStyle = {
  padding: '14px 16px',
  borderBottom: '1px solid #f2f4f7',
  color: '#1f2933',
  verticalAlign: 'middle',
}

export default function ContractDocuments() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(null)
  const { get, response } = useFetch()
  const { propertyId, contractId } = useParams()
  const params = useParams()

  const pathParts = (params['*'] || '').split('/')
  const for_moving_in = pathParts[0] === 'moving-in' || pathParts[2] === 'moving_in'

  useEffect(() => {
    fetchDocuments()
  }, [propertyId, contractId])

  async function fetchDocuments() {
    setLoading(true)
    const endpoint = `/v1/admin/premises/properties/${propertyId}/${
      for_moving_in ? 'moving_in' : 'allotments'
    }/${contractId}/documents`

    const data = await get(endpoint)
    if (response.ok) {
      setDocuments(data.data || [])
    }
    setLoading(false)
  }

  function handleClose() {
    setSelectedDocumentIndex(null)
  }

  return (
    <div style={{ ...cardStyle, marginTop: '16px' }}>
      <style>{`
        .contract-documents-table tbody tr { transition: background-color .15s ease; }
        .contract-documents-table tbody tr:hover { background-color: #f5fdfe; }
      `}</style>

      <div
        className="d-flex justify-content-between align-items-center flex-wrap"
        style={{ gap: '12px', padding: '20px 24px' }}
      >
        <div className="d-flex align-items-center" style={{ gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(0,191,204,0.12)',
              color: THEME_COLOR,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CIcon icon={freeSet.cilDescription} size="lg" />
          </div>
          <div>
            <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
              Documents
            </h5>
            <small style={{ color: '#8a94a6' }}>{documents.length} total</small>
          </div>
        </div>

        <AddDocuments after_submit={fetchDocuments} moving_in={for_moving_in} />
      </div>

      <div className="table-responsive">
        <table
          className="table contract-documents-table mb-0"
          style={{ borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th style={headerCellStyle}>Name</th>
              <th style={headerCellStyle}>Description</th>
              <th style={headerCellStyle}>File</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document, index) => (
              <tr key={document.id ?? index}>
                <td style={bodyCellStyle} className="text-capitalize fw-semibold">
                  {document.name || '-'}
                </td>
                <td style={bodyCellStyle}>{document.description || '-'}</td>
                <td style={bodyCellStyle}>
                  {document.file ? (
                    <CommonModal
                      data={[{ header: document.name, size: 'xl' }]}
                      component={
                        <button
                          type="button"
                          className="border-0 p-0 fw-semibold"
                          style={{ background: 'initial', color: THEME_COLOR }}
                          onClick={() => setSelectedDocumentIndex(index)}
                        >
                          View
                        </button>
                      }
                      visible={selectedDocumentIndex === index}
                      body={
                        <img className="p-4" width="100%" src={document.file} alt={document.name} />
                      }
                      handleClose={handleClose}
                    />
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
            {!loading && documents.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="text-center text-secondary fst-italic"
                  style={{ padding: '32px' }}
                >
                  No documents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && <Loading />}
      </div>
    </div>
  )
}
