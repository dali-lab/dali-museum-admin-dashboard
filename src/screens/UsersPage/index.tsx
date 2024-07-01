import React, { useState } from 'react';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import PageHeader from '../../components/PageHeader';
import { createUser, getUser, updateUser, deleteUser } from '../../redux/slices/usersSlice';
import { UserScopes } from '../../types/users';
import { ROUTES } from '../../utils/constants';

function UsersPage() {
  const { loading, selectedUser } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  const [getId, setGetId] = useState<string>('');
  const handleGetUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!getId) alert('Please enter an id!');
    else {
      dispatch(getUser({ id: getId }));
    }
  };

  const [createEmail, setCreateEmail] = useState<string>('');
  const [createPassword, setCreatePassword] = useState<string>('');
  const [createName, setCreateName] = useState<string>('');
  const handleCreateUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Send only if all fields filled in
    if (!createEmail) alert('Please enter an email!');
    else if (!createPassword) alert('Please enter a password!');
    else if (!createName) alert('Please enter a name!');
    else {
      dispatch(createUser({ email: createEmail, password: createPassword, name: createName }));
    }
  };

  const [updateId, setUpdateId] = useState<string>('');
  const [updateEmail, setUpdateEmail] = useState<string>('');
  const [updatePassword, setUpdatePassword] = useState<string>('');
  const [updateName, setUpdateName] = useState<string>('');
  const [updateRole, setUpdateRole] = useState<string>('');
  const handleUpdateUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!updateId) alert('Please enter an id!');
    if (!updateEmail) alert('Please enter an email!');
    else if (!updatePassword) alert('Please enter a password!');
    else if (!updateName) alert('Please enter a name!');
    else if (!updateRole) alert('Please enter a scope!');
    else {
      dispatch(updateUser({ id: updateId, email: updateEmail, password: updatePassword, role: updateRole as UserScopes }));
    }
  };

  const [deleteId, setDeleteId] = useState<string>('');
  const handleDeleteUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!deleteId) alert('Please enter a id!');
    else {
      dispatch(deleteUser({ id: deleteId }));
    }
  };

  return (
    <div className='container'>
      <PageHeader title={'Resource Page'} toLink={ROUTES.HOME}>
      </PageHeader>
      { loading
        ? <p>Loading...</p>
        : (
          <>
            {
              selectedUser 
                ? <h5>Current selected user: {selectedUser.id}, {selectedUser.email}, {selectedUser.name}, {selectedUser.role}</h5>
                : <h5>Current selected user:</h5>
            }
            <form onSubmit={handleGetUserSubmit}>
              <input type="text" placeholder="id" value={getId} onChange={(e) => setGetId(e.target.value)} />
              <input type="submit" value="Get User" />
            </form>
            <form onSubmit={handleCreateUserSubmit}>
              <input type="email" placeholder="Email" value={createEmail} onChange={(e) => setCreateEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} />
              <input type="text" placeholder="Name" value={createName} onChange={(e) => setCreateName(e.target.value)} />
              <input type="submit" value="Create User" />
            </form>
            <form onSubmit={handleUpdateUserSubmit}>
              <input type="text" placeholder="id" value={updateId} onChange={(e) => setUpdateId(e.target.value)} />
              <input type="email" placeholder="Email" value={updateEmail} onChange={(e) => setUpdateEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={updatePassword} onChange={(e) => setUpdatePassword(e.target.value)} />
              <input type="text" placeholder="Name" value={updateName} onChange={(e) => setUpdateName(e.target.value)} />
              <select onChange={(e) => setUpdateRole(e.target.value)}>
                <option value={UserScopes.Unverified}>{UserScopes.Unverified}</option>
                <option value={UserScopes.User}>{UserScopes.User}</option>
                <option value={UserScopes.Admin}>{UserScopes.Admin}</option>
              </select>
              <input type="submit" value="Update User" />
            </form>
            <form onSubmit={handleDeleteUserSubmit}>
              <input type="text" placeholder="id" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
              <input type="submit" value="Delete User" />
            </form>
          </>
        )
      }
    </div>
  );
}

export default UsersPage;
