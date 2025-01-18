import React from 'react';
import './styles.scss';

interface AppPhotoProps {
  url: string,
  children?: React.ReactNode;
}

const AppPhoto = ({ url, children }: AppPhotoProps) => {
  return (
    <div className="app-photo">
      <img className='img' src={url} alt='default' />
      {<>{children}</>}
    </div>
  );
};

export default AppPhoto;