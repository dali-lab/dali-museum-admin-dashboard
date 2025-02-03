import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { UserScopes } from "@/types/users";
import { ROUTES } from "@/utils/constants";
import { getUser, createUser, updateUser, deleteUser } from "@/api/users";
import useBoundStore from "@/store";

function PaintingsPage() {
  const [getId, setGetId] = useState<string>("");

  const { data: selectedUser, isLoading: isUsersLoading } = getUser(getId);
  const { mutate: mutateCreateUser } = createUser();
  const { mutate: mutateUpdateUser } = updateUser();
  const { mutate: mutateDeleteUser } = deleteUser();

  const bearCount = useBoundStore((state) => state.bearCount);
  const fishCount = useBoundStore((state) => state.fishCount);

  const addBear = useBoundStore((state) => state.addBear);
  const addFish = useBoundStore((state) => state.addFish);

  const handleGetUserSubmit = () => {
    if (!getId) alert("Please enter an id!");
    // else {
    //   dispatch(getUser({ id: getId }));
    // }
  };

  const [createEmail, setCreateEmail] = useState<string>("");
  const [createPassword, setCreatePassword] = useState<string>("");
  const [createName, setCreateName] = useState<string>("");
  const handleCreateUserSubmit = () => {
    // Send only if all fields filled in
    if (!createEmail) alert("Please enter an email!");
    else if (!createPassword) alert("Please enter a password!");
    else if (!createName) alert("Please enter a name!");
    else {
      mutateCreateUser({
        email: createEmail,
        password: createPassword,
        name: createName,
      });
    }
  };

  const [updateId, setUpdateId] = useState<string>("");
  const [updateEmail, setUpdateEmail] = useState<string>("");
  const [updatePassword, setUpdatePassword] = useState<string>("");
  const [updateName, setUpdateName] = useState<string>("");
  const [updateRole, setUpdateRole] = useState<string>(UserScopes.Unverified);
  const handleUpdateUserSubmit = () => {
    if (!updateId) alert("Please enter an id!");
    if (!updateEmail) alert("Please enter an email!");
    else if (!updatePassword) alert("Please enter a password!");
    else if (!updateName) alert("Please enter a name!");
    else if (!updateRole) alert("Please enter a scope!");
    else {
      mutateUpdateUser({
        id: updateId,
        email: updateEmail,
        password: updatePassword,
        role: updateRole as UserScopes,
      });
    }
  };

  const [deleteId, setDeleteId] = useState<string>("");
  const handleDeleteUserSubmit = () => {
    if (!deleteId) alert("Please enter a id!");
    else {
      mutateDeleteUser({ id: deleteId });
    }
  };

  return (
    <div className="container">
      <PageHeader
        title={"Resource Page"}
        toLink={ROUTES.DASHBOARD}
      ></PageHeader>

      <div>
        (bears, fish) = ({bearCount}, {fishCount})
      </div>
      <button onClick={() => addBear()}>Add bear</button>
      <button onClick={() => addFish()}>Add fish</button>

      {isUsersLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {selectedUser ? (
            <h5>
              Current selected user: {selectedUser.id}, {selectedUser.email},{" "}
              {selectedUser.name}, {selectedUser.role}
            </h5>
          ) : (
            <h5>Current selected user:</h5>
          )}
          <form onSubmit={handleGetUserSubmit}>
            <input
              type="text"
              placeholder="id"
              value={getId}
              onChange={(e) => setGetId(e.target.value)}
            />
            <input type="submit" value="Get User" />
          </form>
          <form onSubmit={handleCreateUserSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={createEmail}
              onChange={(e) => setCreateEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={createPassword}
              onChange={(e) => setCreatePassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Name"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
            />
            <input type="submit" value="Create User" />
          </form>
          <form onSubmit={handleUpdateUserSubmit}>
            <input
              type="text"
              placeholder="id"
              value={updateId}
              onChange={(e) => setUpdateId(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={updateEmail}
              onChange={(e) => setUpdateEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={updatePassword}
              onChange={(e) => setUpdatePassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Name"
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}
            />
            <select onChange={(e) => setUpdateRole(e.target.value)}>
              <option value={UserScopes.Unverified}>
                {UserScopes.Unverified}
              </option>
              {/* <option value={UserScopes.User}>{UserScopes.User}</option> */}
              <option value={UserScopes.Admin}>{UserScopes.Admin}</option>
            </select>
            <input type="submit" value="Update User" />
          </form>
          <form onSubmit={handleDeleteUserSubmit}>
            <input
              type="text"
              placeholder="id"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
            />
            <input type="submit" value="Delete User" />
          </form>
        </>
      )}
    </div>
  );
}

export default PaintingsPage;
