import React from 'react'
import { Provider, useFetch } from 'use-http'
import options from '../Options'
import { AppContent, AppSidebar, AppHeader } from '../components/index'
import { AuthContext, initialAuthState, reducer } from '../contexts/AuthContext'
import Login from '../views/pages/login/Login'

const DefaultLayout = () => {
  const [state, dispatch] = React.useReducer(reducer, initialAuthState)
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {!state.isAutheticated ? (
        <Login />
      ) : (
        <div>
          <Provider url={process.env.REACT_APP_API_URL} options={options}>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
              <AppHeader />
              <div className="body flex-grow-1 px-3">
                <AppContent />
              </div>
            </div>
          </Provider>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export default DefaultLayout
