
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const SearchLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="search" />
      <main className="flex-1 container px-4 py-6 md:px-6 md:py-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default SearchLayout;
