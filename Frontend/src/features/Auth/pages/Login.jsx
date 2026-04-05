import React, { useState, useEffect } from 'react'
import FloatingCanvas from '../../shared/components/FloatingCanvas'
import '../../shared/style/global.scss'
import '../style/login.scss'
import FormGroup from '../components/FormGroup'
import { useAuth } from '../hook/useAuth'
import { useNavigate } from 'react-router-dom'
import { loginWithGoogle } from '../services/auth.api'

const Login = () => {
  const { loading, handleLogin, setLoading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const params = new URLSearchParams(window.location.search)
  const googleError = params.get('error')

  useEffect(() => {
    if (setLoading) setLoading(false)
  }, [setLoading])

  async function handleSubmit(e) {
    e.preventDefault()
    await handleLogin(email, password)
    navigate('/')
  }

  return (
    <main className='login'>
      <FloatingCanvas count={20} minSpeed={0.2} maxSpeed={0.5} minOpacity={0.1} maxOpacity={0.2} />
      <div className='login__container'>
        <h1 className='login__title'>Login</h1>

        {googleError === 'not_registered' && (
          <p className="error-msg">❌ No account found. Please register first.</p>
        )}
        {googleError === 'gmail_only' && (
          <p className="error-msg">❌ Only Gmail accounts are allowed.</p>
        )}

        <form className='login__form' onSubmit={handleSubmit}>
          <FormGroup
            setValue={setEmail}
            value={email}
            className='login__form-group'
            label="Username or Email"
            id="username"
            type="text"
            placeholder="Enter your username or email"
            required={true}
          />
          <FormGroup
            setValue={setPassword}
            value={password}
            className='login__form-group'
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            required={true}
          />
          <button type='submit' className='login__form-button'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="google-btn"
          onClick={() => loginWithGoogle('login')}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Login with Google
        </button>

        <p className='login__register-link'>
          Don't have an account? <a href='/register' className='login__register-link-anchor'>Register here</a>
        </p>
      </div>
    </main>
  )
}

export default Login