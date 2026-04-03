import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/welcome.scss'

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Welcome component mounted');
    const timer = setTimeout(() => {
      console.log('3 seconds passed, setting localStorage and navigating to /login');
      localStorage.setItem('welcomeShown', 'true');
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className='welcome'>
      <div className='welcome__container'>
        <div className='welcome__content'>
          <h1 className='welcome__title'>Welcome to Vibee</h1>
          <div className='welcome__loader'>
            <div className='welcome__spinner'></div>
          </div>
          <p className='welcome__subtitle'>Loading your music experience...</p>
        </div>
      </div>
    </main>
  )
}

export default Welcome
