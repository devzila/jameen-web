import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { status_color } from 'src/services/CommonFunctions'
import CustomDivToggle from 'src/components/CustomDivToggle'
import { Dropdown } from 'react-bootstrap'
import { BsThreeDots } from 'react-icons/bs'
import AddMaintenance from './AddEditMaintenance'

export default function MaintenanceTable({ data, refreshData }) {
  return (
    <div className="row justify-content-center">
      <div className="col-16">
        <div className="table-responsive bg-white">
          <table className="table  table-striped mb-0">
            <thead
              style={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overFlow: 'hidden',
              }}
            >
              <tr>
                <th className="pt-3 pb-3 border-0  ">Title</th>
                <th className="pt-3 pb-3 border-0  ">Category</th>
                <th className="pt-3 pb-3 border-0  ">Priority</th>
                <th className="pt-3 pb-3 border-0  ">Asignee</th>
                <th className="pt-3 pb-3 border-0  ">Status</th>
                <th className="pt-3 pb-3 border-0  ">Expected Handover Date</th>
                <th className="pt-3 pb-3 border-0  "> Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item) => (
                <tr key={item.id}>
                  <td className="pt-3 pb-2">
                    <NavLink to={`${item.id}`} className="mx-2 p-0">
                      {item.title || '-'}
                    </NavLink>
                  </td>

                  <td className="pt-3 pb-2">{item.category.name || '-'}</td>
                  <td className="pt-3 pb-2">{item.category.priority || '-'}</td>
                  <td className="pt-3 pb-2">{item.assigned_user || '-'}</td>
                  <td className="pt-3 pb-2">
                    <button
                      className=" text-center border-0  rounded-0 text-white"
                      style={{
                        backgroundColor: `${status_color(item?.status)}`,
                        cursor: 'default',
                        width: '120px',
                      }}
                    >
                      {item.status || '-'}
                    </button>
                  </td>

                  <td className="pt-3 pb-2">{item.completion_date || '-'}</td>
                  <td className="pt-3 pb-2 ">
                    <Dropdown key={item.id}>
                      <Dropdown.Toggle as={CustomDivToggle} className="cursor-pointer">
                        <BsThreeDots />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <AddMaintenance type="edit" id={item.id} refreshData={refreshData} />
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* {loading && <Loading />}
          {errors && (
            <p className="text-center small text-danger fst-italic">
              {process.env.REACT_APP_ERROR_MESSAGE}
            </p>
          )} */}
        </div>
      </div>
    </div>
  )
}

MaintenanceTable.propTypes = {
  data: PropTypes.array,
  refreshData: PropTypes.func,
}
