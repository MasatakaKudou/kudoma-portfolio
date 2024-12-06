import React from 'react';
import Image from 'mui-image';

interface AccountLogoProps {
  src: string;
  url: string;
  name: string;
}

export const AccountLogo: React.FC<AccountLogoProps> = ({src, url, name}) => {
  return (
    <a href={url} style={{ margin: '5px' }}>
      <Image src={src} alt={name} fit='contain' height={45} width={45} />
    </a>
  );
};
