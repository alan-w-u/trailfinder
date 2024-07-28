import './Auth.css'

function Auth(props) {
  const handleLogin = () => {
    props.setUserID(0)
  };

  return (
    <>
      <div className="auth-box">
        <h1>Log In</h1>
        <div className="input-container">
          <input type="text" name="email" required autocomplete="off" />
          <label htmlFor="email">Email</label>
        </div>
        <div className="input-container">
          <input type="password" name="password" required autocomplete="off" />
          <label htmlFor="password">Password</label>
        </div>
        <button onClick={handleLogin}>Log In</button>
      </div>
    </>
  )
}

export default Auth
