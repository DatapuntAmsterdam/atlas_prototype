import React from 'react';
import ContentPage, { PAGE_NAMES } from './ContentPage';

const Home = () => (
  <ContentPage
    name={PAGE_NAMES.home}
    showFooter
    columnSizes={{
      right: 12,
      middle: 12
    }}
  />
);

export default Home;
