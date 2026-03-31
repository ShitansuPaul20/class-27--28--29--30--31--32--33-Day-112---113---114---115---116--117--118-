import React ,{useState} from 'react'
import FloatingCanvas from '../../shared/components/FloatingCanvas'
import '../../shared/style/global.scss'
import '../style/register.scss'
import FormGroup from '../components/FormGroup'
import { useAuth } from '../hook/useAuth'
import { useNavigate } from 'react-router-dom'

const Register = () => {

  const { loading, handleRegister } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    await handleRegister(username, email, password);
    navigate("/");
  }


  return (
    <main className='register'>
      <FloatingCanvas count={20} minSpeed={0.2} maxSpeed={0.5} minOpacity={0.1} maxOpacity={0.2} />
      <div className='register__container'>
        <h1 className='register__title'>Register</h1>
        <form className='register__form' onSubmit={handleSubmit}>
          <FormGroup 
            setValue={setUsername}
            value={username}
            className='register__form-group' 
            label="Username" 
            id="username" 
            type="text" 
            placeholder="Enter your username" 
            required={true} 
          />
          <FormGroup 
            setValue={setEmail}
            value={email}
            className='register__form-group' 
            label="Email" 
            id="email" 
            type="email" 
            placeholder="Enter your email" 
            required={true} 
          />
          <FormGroup 
            setValue={setPassword}
            value={password}
            className='register__form-group' 
            label="Password" 
            id="password" 
            type="password" 
            placeholder="Enter your password" 
            required={true} 
          />
          <button type='submit' className='register__form-button'>
            {'Register'}
          </button>
        </form>
        <p className='register__login-link'>Already have an account? <a href='/login' className='register__login-link-anchor'>Login here</a></p>
      </div>
    </main>
  )
}

export default Register