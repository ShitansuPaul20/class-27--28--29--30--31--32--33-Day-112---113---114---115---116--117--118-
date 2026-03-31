import React, { useEffect } from 'react'
import '../style/welcome.scss'

const Welcome = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('welcomeShown', 'true');
      window.location.href = '/login';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
