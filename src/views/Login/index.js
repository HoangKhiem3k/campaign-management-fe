import React, { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Login.css'
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../store/actions/authActions';
import { Navigate, useNavigate } from 'react-router-dom';
import { ROLES } from '../../config/settingSystem';
export default function Login() {
  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth?.currentUser)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Email must be required").email("Please enter a valid email"),
      password: Yup.string().required("Password must required").min(6, "Password must be at least 6 characters")
    }),
    onSubmit: (values) => {
      dispatch(loginAction(values, navigate));
    }
  })

  if(currentUser){
    return  <Navigate to={'/'} />;
  }
  // if (currentUser && currentUser.permissions.role_type === ROLES.ADMIN) {
  //   return <Navigate to={'/admin'} />;
  // }else{
  //   if(currentUser && currentUser.permissions.role_type === ROLES.ADVERTISER){
  //     return <Navigate to={'/advertiser'} />;
  //   }else{
  //     if(currentUser && currentUser.permissions.role_type === ROLES.DAC_MEMBER){
  //       return <Navigate to={'/dac-member'} />;
  //     }
  //   }
  // }

  return (
    <div className='wraper-login'>
      <div className="cover">
        <form onSubmit={formik.handleSubmit}>
          <h1>WELCOME</h1>
          <div className="form__control">
            <input type="email" name="email" value={formik.values.email} placeholder='Email' onChange={formik.handleChange}></input>
            {formik.errors.email && (
              <p style={{ color: "red" }}>{formik.errors.email}</p>
            )}
          </div>
          <div className="form__control">
            <input type="password" name="password" value={formik.values.password} placeholder='Password' onChange={formik.handleChange}></input>
            {formik.errors.password && (
              <p style={{ color: "red" }}>{formik.errors.password}</p>
            )}
          </div>
          <button type="submit" id="btn-login">Login</button>
          <div className="another-login">
            <div className="facebook">
              <button type="submit" value="Facebook" id="btn-facebook">Facebook</button>
            </div>
            <div className="google">
              <button type="button" value="Google" id="btn-google">Google</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
