import { useState } from 'react';
import './Auth.css'

function Auth(props) {
  const [authMode, setAuthMode] = useState("Log In");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    const response = await fetch('http://localhost:65535/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      props.setUserID(responseData.userID);
    } else {
      console.log('Invalid credentials');
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    const response = await fetch('http://localhost:65535/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      props.setUserID(responseData.userID);
    } else {
      console.log('Sign up error');
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === "Log In" ? "Sign Up" : "Log In");
    setShowPassword(false);
  };

  return (
    <>
      <div className="auth-container">
        {authMode === "Log In" && (
          <>
            <h1>Log In</h1>
            <form onSubmit={handleLogin}>
              <div className="input-container">
                <input type="email" name="email" required autocomplete="off" placeholder="" onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-container">
                <input type={showPassword ? "text" : "password"} name="password" required autocomplete="off" placeholder="" onChange={(e) => setPassword(e.target.value)} />
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
                <input type="text" name="name" required autocomplete="off" placeholder="" onChange={(e) => setName(e.target.value)} />
                <label htmlFor="name">Full Name</label>
              </div>
              <div className="input-container">
                <input type="email" name="email" required autocomplete="off" placeholder="" onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-container">
                <input type={showPassword ? "text" : "password"} name="password" required autocomplete="off" placeholder="" onChange={(e) => setPassword(e.target.value)} />
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
