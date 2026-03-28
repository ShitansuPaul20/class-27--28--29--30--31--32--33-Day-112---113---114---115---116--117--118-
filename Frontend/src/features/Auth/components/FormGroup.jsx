import React from 'react'
import '../../shared/style/global.scss'
import '../style/FormGroup.scss'

const FormGroup = ({ label, id, type, placeholder, required }) => {
  return (
        <div className='form-group'>
          <label htmlFor={id} className='form-label'>
            {label}
          </label>
          <input
            type={type}
            id={id}
            className='form-input'
            placeholder={placeholder}
            required={required}
          />
        </div>
  )
}

export default FormGroup