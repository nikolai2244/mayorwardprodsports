
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function Login(){
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const { login } = useAuth();

  function submit(){
    const ok = login(username,password);
    if(!ok) setError("Invalid credentials");
  }

  return <div>
    <h1>Mayor's Picks Login</h1>
    <input placeholder='Username' value={username} onChange={e=>setUsername(e.target.value)} />
    <input placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
    <button onClick={submit}>Login</button>
    {error && <p style={{color:'red'}}>{error}</p>}
  </div>;
}
