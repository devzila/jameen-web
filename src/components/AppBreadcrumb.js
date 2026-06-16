import React, { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { AuthContext } from '../contexts/AuthContext'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname
  const navigate = useNavigate()
  const auth = useContext(AuthContext)

  const handleNavigate = (event, href) => {
    event.preventDefault()
    navigate(href)
  }

  function extractLastPart(inputString) {
    const parts = inputString?.split('/')
    return parts[parts.length - 1]
  }

  function breadcrumbHref(pathname) {
    if (pathname === '/finance/invoice') {
      return '/finance'
    }
    return pathname
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = currentPathname
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          href: breadcrumbHref(currentPathname),
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="m-0 ms-1" style={{ '--cui-breadcrumb-divider': "''" }}>
      <CBreadcrumbItem href="/" className="ms-1" onClick={(e) => handleNavigate(e, '/')}>
        <CIcon icon={freeSet.cilHome} />
      </CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            className="text-uppercase "
            {...(breadcrumb.active
              ? { active: true }
              : {
                  href: breadcrumb.href,
                  onClick: (e) => handleNavigate(e, breadcrumb.href),
                })}
            key={index}
          >
            <div className="m-0 p-0">
              <CIcon icon={freeSet.cilChevronRight} className="text-secondary me-1" />
              {extractLastPart(breadcrumb?.name)}
            </div>
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
