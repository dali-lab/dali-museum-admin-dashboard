import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsBoxArrowLeft } from 'react-icons/bs';
import './styles.scss';

interface AppPhotoProps {
  title: string,
  toLink: string,
  children?: React.ReactNode;
}

const PageHeader = ({ title, toLink, children }: AppPhotoProps) => {
  const navigate = useNavigate();
  return (
    <div className='page-header'>
      <BsBoxArrowLeft
        className='button'
        onClick={() => navigate(toLink)}
        style={{ fontSize: '40' }}
      />
      <h1>{title}</h1>
      {<>{children}</>}
    </div>
  );
};

export default PageHeader;