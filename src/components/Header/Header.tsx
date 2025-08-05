'use client';

import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
// import Logo from '@/assets/img/airdrop.png';

export const Header = () => {
  return (
    <nav className="px-8 py-4.5 flex justify-between items-center xl:min-h-[77px]">
      <div className="flex items-center gap-6">
        LOGO
      </div>

      <div className="flex items-center gap-4">
        <ConnectButton
          showBalance={true}
          accountStatus="avatar"
          chainStatus="full"
        />
      </div>
    </nav>
  );
};
