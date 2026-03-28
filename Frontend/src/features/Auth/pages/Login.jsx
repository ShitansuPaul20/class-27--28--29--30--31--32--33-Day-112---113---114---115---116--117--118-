import React from 'react'
import FloatingCanvas from '../../shared/components/FloatingCanvas'
import '../../shared/style/global.scss'
import '../style/login.scss'
import FormGroup from '../components/FormGroup'

const login = () => {
  return (
    <main className='login'>
      <FloatingCanvas count={20} minSpeed={0.2} maxSpeed={0.5} minOpacity={0.1} maxOpacity={0.2} />
      <div className='login__container'>
        <h1 className='login__title'>Login</h1>
        <form className='login__form'>
          <FormGroup className='login__form-group' label="Username or Email" id="username" type="text" placeholder="Enter your username or email" required={true} />
          <FormGroup className='login__form-group' label="Password" id="password" type="password" placeholder="Enter your password" required={true} />
          <button type='submit' className='login__form-button'>Login</button>
        </form>
        <p className='login__register-link'>Don't have an account? <a href='/register' className='login__register-link-anchor'>Register here</a></p>
      </div>
    </main>
  )
}

export default login