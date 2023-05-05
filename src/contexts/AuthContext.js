import { createContext } from 'react'
export const AuthContext = createContext('')
export const initialAuthState = {
  isAutheticated: localStorage.getItem('token') !== null,
  user: JSON.parse(localStorage.getItem('user')),
  token: localStorage.getItem('token'),
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload.data.object))
      localStorage.setItem('token', action.payload.data.token)
      return {
        ...state,
        isAutheticated: true,
        user: action.payload.user,
        token: action.payload.token,
      }
    case 'LOGOUT':
      localStorage.clear()
      return { ...state, isAutheticated: false, user: null, token: null }
    default:
      return state
  }
}
