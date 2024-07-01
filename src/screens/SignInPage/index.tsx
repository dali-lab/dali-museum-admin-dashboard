import React, { useState } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import { signIn } from '../../redux/slices/authSlice';

function SignInPage() {
  const dispatch = useAppDispatch();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Send only if all fields filled in
    if (!email) alert('Please enter an email address!');
    else if (!password) alert('Please enter a password!');
    else {
      dispatch(signIn({ email, password }));
    }
  };

  return (
    <div className='container'>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="submit" value="Sign In" />
      </form>
    </div>
  );
}

export default SignInPage;