import { useState } from 'react';
import './Auth.css'

function Auth(props) {
  const [authMode, setAuthMode] = useState("Log In");
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = () => {
    props.setUserID(0)
  };
  const handleSignUp = () => {

  };
  const toggleAuthMode = () => {
    setAuthMode(authMode === "Log In" ? "Sign Up" : "Log In");
    setShowPassword(false);
  }
  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <div className="auth-box">
        {authMode === "Log In" && (
          <>
            <h1>Log In</h1>
            <form onSubmit={handleLogin}>
              <div className="input-container">
                <input type="text" name="email" required autocomplete="off" />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-container">
                <input type={showPassword ? "text" : "password"} name="password" required autocomplete="off" />
                <label htmlFor="password">Password</label>
              </div>
              <div className="show-password">
                <input type="checkbox" name="showPassword" checked={showPassword} onChange={toggleShowPassword} />
                <span className="checkbox" onClick={toggleShowPassword}></span>
                <label htmlFor="showPassword">Show Password</label>
              </div>
              <button type="submit">Log In</button>
            </form>
            <div className="auth-mode">
              <p>New to TrailFinder?</p>
              <a onClick={toggleAuthMode}>Sign Up</a>
            </div>
          </>
        )}

        {authMode === "Sign Up" && (
          <>
            <h1>Sign Up</h1>
            <form onSubmit={handleSignUp}>
              <div className="input-container">
                <input type="text" name="name" required autocomplete="off" />
                <label htmlFor="name">Full Name</label>
              </div>
              <div className="input-container">
                <input type="text" name="email" required autocomplete="off" />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-container">
                <input type={showPassword ? "text" : "password"} name="password" required autocomplete="off" />
                <label htmlFor="password">Password</label>
              </div>
              <div className="show-password">
                <input type="checkbox" name="showPassword" checked={showPassword} onChange={toggleShowPassword} />
                <span className="checkbox" onClick={toggleShowPassword}></span>
                <label htmlFor="showPassword">Show Password</label>
              </div>
              <button type="submit">Sign Up</button>
            </form>
            <div className="auth-mode">
              <p>Already on TrailFinder?</p>
              <a onClick={toggleAuthMode}>Log In</a>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Auth
