// src/App.jsx
import React from 'react';
import './index.css';
import { Section } from '@radix-ui/themes';
import Header  from './components/pages/Header';
import Hero from './components/pages/Hero';
const App = () => {
  return (
    <>
     <Section className="h-screen bg-[#EBEEE9]">
     <Header />
     <Hero />
    </Section>
    
    </>
      
  );
};

export default App;
