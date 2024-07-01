import React, { useState } from 'react';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { resendCode, verify } from '../../redux/slices/authSlice';

function VerifyPage() {
  const dispatch = useAppDispatch();
  const { id, email } = useAppSelector((state) => state.auth);
  const [code, setCode] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Send only if all fields filled in
    if (!code) alert('Please enter a code!');
    else {
      dispatch(verify({ id, email, code }));
    }
  };

  return (
    <div className='container'>
      <h1>Verify</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <input type="submit" value="Validate Code" />
      </form>
      <button onClick={(e) => dispatch(resendCode({ id, email }))}>Resend Code</button>
    </div>
  );
}

export default VerifyPage;
