import React, { useEffect } from 'react'
import '../style/welcome.scss'

const Welcome = () => {
  console.log('Welcome component mounted');

  useEffect(() => {
    console.log('Welcome useEffect running - setting timer for 3 seconds');
    const timer = setTimeout(() => {
      console.log('3 seconds passed - setting localStorage and redirecting');
      localStorage.setItem('welcomeShown', 'true');
      // Using window.location to force page reload
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
