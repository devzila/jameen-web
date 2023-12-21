import React from 'react'
import { CForm, CButton, CFormInput, CNavbar, CContainer, CNavbarBrand } from '@coreui/react'

export default function Role() {
  return (
    <section style={{ width: '100%', padding: '0px' }}>
      <CNavbar expand="lg" colorScheme="light" className="bg-light">
        <CContainer fluid>
          <CNavbarBrand href="#">Role</CNavbarBrand>
          {/* <CButton color="success" variant="outline">
            Actions
          </CButton> */}
          <CForm className="d-flex">
            <CFormInput type="search" className="me-2" placeholder="Search" />
            <CButton type="submit" color="success" variant="outline">
              Search
            </CButton>
          </CForm>
        </CContainer>
      </CNavbar>
      <div>
        <div className="mask d-flex align-items-center h-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="table-responsive bg-white">
                  <table className="table mb-0">
                    <thead
                      style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overFlow: 'hidden' }}
                    >
                      <tr>
                        <th scope="col">EMPLOYEES</th>
                        <th scope="col">POSITION</th>
                        <th scope="col">CONTACTS</th>
                        <th scope="col">AGE</th>
                        <th scope="col">ADDRESS</th>
                        <th scope="col">SALARY</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row" style={{ color: '#666666' }}>
                          Tiger Nixon
                        </th>
                        <td>System Architect</td>
                        <td>tnixon12@example.com</td>
                        <td>61</td>
                        <td>Edinburgh</td>
                        <td>$320,800</td>
                      </tr>
                      <tr>
                        <th scope="row" style={{ color: '#666666' }}>
                          Sonya Frost
                        </th>
                        <td>Software Engineer</td>
                        <td>sfrost34@example.com</td>
                        <td>23</td>
                        <td>Edinburgh</td>
                        <td>$103,600</td>
                      </tr>
                      <tr>
                        <th scope="row" style={{ color: '#666666' }}>
                          Jena Gaines
                        </th>
                        <td>Office Manager</td>
                        <td>jgaines75@example.com</td>
                        <td>30</td>
                        <td>London</td>
                        <td>$90,560</td>
                      </tr>
                      <tr>
                        <th scope="row" style={{ color: '#666666' }}>
                          Quinn Flynn
                        </th>
                        <td>Support Lead</td>
                        <td>qflyn09@example.com</td>
                        <td>22</td>
                        <td>Edinburgh</td>
                        <td>$342,000</td>
                      </tr>
                      <tr>
                        <th scope="row" style={{ color: '#666666' }}>
                          Charde Marshall
                        </th>
                        <td>Regional Director</td>
                        <td>cmarshall28@example.com</td>
                        <td>36</td>
                        <td>San Francisco</td>
                        <td>$470,600</td>
                      </tr>
                      <tr>
                        <th scope="row" style={{ color: '#666666' }}>
                          Haley Kennedy
                        </th>
                        <td>Senior Marketing Designer</td>
                        <td>hkennedy63@example.com</td>
                        <td>43</td>
                        <td>London</td>
                        <td>$313,500</td>
                      </tr>
                      <tr>
                        <th scope="row" style={{ color: '#666666' }}>
                          Tatyana Fitzpatrick
                        </th>
                        <td>Regional Director</td>
                        <td>tfitzpatrick00@example.com</td>
                        <td>19</td>
                        <td>Warsaw</td>
                        <td>$385,750</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
