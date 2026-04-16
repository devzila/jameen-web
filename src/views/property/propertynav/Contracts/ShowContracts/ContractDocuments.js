import React, { useState, useEffect } from 'react'
import { CCol, CCard, CListGroupItem, CRow, CCardText, CTable } from '@coreui/react'
import AddDocuments from './AddDocuments'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { useParams } from 'react-router-dom'
import useFetch from 'use-http'
import CommonModal from 'src/views/shared/CommonModal'

export default function ContractDocuments() {
  const [contract, setContractData] = useState({})
  const { get, response, loading, error } = useFetch()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetchContract()
  }, [])

  const { propertyId, contractId } = useParams()
  const params = useParams()

  const for_moving_in =
    params['*'].split('/')[0] == 'moving-in' || params['*'].split('/')[2] == 'moving_in'

  console.log(for_moving_in)
  const fetchContract = async () => {
    const endpoint = `/v1/admin/premises/properties/${propertyId}/${
      for_moving_in ? 'moving_in' : 'allotments'
    }/${contractId}/documents`

    const data = await get(endpoint)
    if (response.ok) {
      setContractData(data.data)
    }
  }

  function handleClose() {
    setVisible(false)
  }

  return (
    <CCard className="mt-3 border-0">
      <CRow>
        <CCol md="12">
          <CCard className=" p-3  border-0 ">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
                <strong className="text-black">Documents</strong>
              </div>
              <div>
                <AddDocuments after_submit={fetchContract} moving_in={for_moving_in} />
              </div>
            </div>
            <hr className="text-secondary m-0 p-0" />
            {contract?.length > 0 ? (
              <CTable responsive="sm" className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>File</th>
                  </tr>
                </thead>
                <tbody>
                  {contract?.map((document, index) => (
                    <tr key={index}>
                      <td className="text-capitalize">{document.name || '-'}</td>
                      <td>{document.description || '-'}</td>
                      <td>
                        {document.file ? (
                          <CommonModal
                            data={[{ header: document.name, size: 'xl' }]}
                            component={
                              <button
                                type="button"
                                className="theme_color border-0 p-0 btn-outline-light"
                                style={{ background: 'initial' }}
                                data-mdb-ripple-init
                                onClick={() => setVisible(!visible)}
                              >
                                View
                              </button>
                            }
                            visible={visible}
                            body={<img className="p-4" width="100%" src={document.file} />}
                            handleClose={handleClose}
                          />
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </CTable>
            ) : (
              <p className="text-center fst-italic text-secondary bg-white p-3">
                No Documents Found
              </p>
            )}
          </CCard>
        </CCol>
      </CRow>
    </CCard>
  )
}
