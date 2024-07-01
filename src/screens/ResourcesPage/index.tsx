import React, { useState } from 'react';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import PageHeader from '../../components/PageHeader';
import { 
  getAllResources, 
  createResource, 
  updateResource, 
  deleteResource, 
  IResource, 
} from '../../redux/slices/resourcesSlice';
import { ROUTES } from '../../utils/constants';

function ResourcePage() {
  const { loading, all } = useAppSelector((state) => state.resources);
  const dispatch = useAppDispatch();
  
  const handleGetAllResourcesSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(getAllResources({}));
  };

  const [createTitle, setCreateTitle] = useState<string>('');
  const [createDescription, setCreateDescription] = useState<string>('');
  const [createValue, setCreateValue] = useState<string>('');
  const handleCreateResourceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Send only if all fields filled in
    if (!createTitle) alert('Please enter a title!');
    else if (!createDescription) alert('Please enter a description!');
    else if (!createValue) alert('Please enter a value!');
    else {
      dispatch(createResource({ title: createTitle, description: createDescription, value: parseFloat(createValue) }));
    }
  };

  const [updateId, setUpdateId] = useState<string>('');
  const [updateTitle, setUpdateTitle] = useState<string>('');
  const [updateDescription, setUpdateDescription] = useState<string>('');
  const [updateValue, setUpdateValue] = useState<string>('');
  const handleUpdateResourceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!updateId) alert('Please enter a id!');
    if (!updateTitle) alert('Please enter a title!');
    else if (!updateDescription) alert('Please enter a description!');
    else if (!updateValue) alert('Please enter a value!');
    else {
      dispatch(updateResource({ id: updateId, title: updateTitle, description: updateDescription, value: parseFloat(updateValue) }));
    }
  };

  const [deleteId, setDeleteId] = useState<string>('');
  const handleDeleteResourceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!deleteId) alert('Please enter a id!');
    else {
      dispatch(deleteResource({ id: deleteId }));
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
            <form onSubmit={handleGetAllResourcesSubmit}>
              <button type="submit">Get All Resources</button>
            </form>
            <div>
              {
                Object.values(all).map((r: IResource) => <h5>{r.id}, {r.title}, {r.description}, {r.value}</h5>)
              }
            </div>
            <form onSubmit={handleCreateResourceSubmit}>
              <input type="text" placeholder="Title" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} />
              <input type="text" placeholder="Description" value={createDescription} onChange={(e) => setCreateDescription(e.target.value)} />
              <input type="text" placeholder="Value" value={createValue} onChange={(e) => setCreateValue(e.target.value)} />
              <input type="submit" value="Create Resource" />
            </form>
            <form onSubmit={handleUpdateResourceSubmit}>
              <input type="text" placeholder="id" value={updateId} onChange={(e) => setUpdateId(e.target.value)} />
              <input type="text" placeholder="Title" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} />
              <input type="text" placeholder="Description" value={updateDescription} onChange={(e) => setUpdateDescription(e.target.value)} />
              <input type="text" placeholder="Value" value={updateValue} onChange={(e) => setUpdateValue(e.target.value)} />
              <input type="submit" value="Update Resource" />
            </form>
            <form onSubmit={handleDeleteResourceSubmit}>
              <input type="text" placeholder="id" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
              <input type="submit" value="Delete Resource" />
            </form>
          </>
        )
      }
    </div>
  );
}

export default ResourcePage;
