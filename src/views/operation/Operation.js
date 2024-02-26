import React from 'react'
import { Accordion, Table } from 'react-bootstrap'
import {
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CAccordionButton,
} from '@coreui/react'

function MyTable() {
  const data = [
    {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      id: 2,
      name: 'Alice',
      email: 'alice@example.com',
      details: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 3,
      name: 'Bob',
      email: 'bob@example.com',
      details:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
  ]
  return (
    <>
      <CAccordion colSpan="3">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <CAccordionItem>
              {data.map((row, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>{row.id}</td>
                    <CAccordionHeader>
                      <CAccordionButton>
                        <td>{row.name}</td>
                      </CAccordionButton>
                    </CAccordionHeader>
                    <td>{row.email}</td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <CAccordionHeader></CAccordionHeader>
                      <CAccordionBody>
                        <div>{row.details}</div>
                      </CAccordionBody>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </CAccordionItem>
          </tbody>
        </Table>
      </CAccordion>
    </>
  )
}

export default MyTable
