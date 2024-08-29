import React from 'react';
import Image from 'mui-image';

interface AccountLogoProps {
  src: string;
  url: string;
  name: string;
}

const AccountLogo: React.FC<AccountLogoProps> = ({src, url, name}) => {
  return (
    <a href={url} style={{ margin: '5px' }}>
      <Image src={src} alt={name} height={45} />
    </a>
  );
};
  
export default AccountLogo;
