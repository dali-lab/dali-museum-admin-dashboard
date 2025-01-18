import React from 'react';
import AppPhoto from '@/components/AppPhoto';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import DaliDarkImg from '@/assets/dali_dark.png';
import { SERVER_URL } from '@/utils/constants';
import { logout } from '@/api/auth';
import useBoundStore from '@/store';
import { getAuthUser, initCredentials, jwtSignIn } from '@/api/auth';

function FrontPage() {
  const { authenticated, role } = getAuthUser().data;

  const { mutate: mutateLogout } = logout();
  const bearCount = useBoundStore((state) => state.bearCount);
  const fishCount = useBoundStore((state) => state.fishCount);

  const addBear = useBoundStore((state) => state.addBear);
  const addFish = useBoundStore((state) => state.addFish);
  
  return (
    <div className='container'>
      <AppPhoto
        url={DaliDarkImg}
      >
      </AppPhoto>
      <div>
        <h1>DALI Crud Template</h1>
      </div>
      <div>
        Using SERVER_URL = {SERVER_URL}
      </div>
      {
        !authenticated && 
          <>
            <Link to={ROUTES.SIGNIN}>
              <h1>Sign In</h1>
            </Link>
            <Link to={ROUTES.SIGNUP}>
              <h1>Sign Up</h1>
            </Link>
            <Link to={ROUTES.VERIFY}>
              <h1>Verify</h1>
            </Link>
          </>
      }
      {
        authenticated &&
        <>
          <Link to={ROUTES.USERS}>
            <h1>Users (admin only)</h1>
          </Link>
          <Link to={ROUTES.RESOURCES}>
            <h1>Resources (user or admin)</h1>
          </Link>
          <button onClick={() => mutateLogout()}>Logout</button>
          <div>
            (bears, fish) = ({bearCount}, {fishCount})
          </div>
          <button onClick={() => addBear()}>Add bear</button>
          <button onClick={() => addFish()}>Add fish</button>
        </>
      }
    </div>
  );
}

export default FrontPage;
