import React, { useState } from 'react';
import { getAuthUser, verify, resendCode } from '@/api/auth';

function VerifyPage() {
  const { id, email } = getAuthUser().data;
  const { mutate: mutateVerify } = verify();

  const [code, setCode] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Send only if all fields filled in
    if (!code) alert('Please enter a code!');
    else {
      mutateVerify({ id, email, code });
    }
  };

  return (
    <div className='container'>
      <h1>Verify</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <input type="submit" value="Validate Code" />
      </form>
      <button onClick={async (e) => {
        await resendCode({ id, email });
      }}>
        Resend Code
      </button>
    </div>
  );
}

export default VerifyPage;
