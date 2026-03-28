import React from 'react'
import '../../shared/style/global.scss'
import '../style/FormGroup.scss'

const FormGroup = ({ label, id, type, placeholder, required, setValue, value }) => {
  return (
        <div className='form-group'>
          <label htmlFor={id} className='form-label'>
            {label}
          </label>
          <input
            onChange={(e) => setValue(e.target.value)}
            value={value}
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