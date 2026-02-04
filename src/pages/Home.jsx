import React from 'react';
import Hero from '../components/Hero/Hero';
import Philosophy from '../components/Philosophy/Philosophy';
import Capabilities from '../components/Capabilities/Capabilities';
import PortfolioPreview from '../components/PortfolioPreview/PortfolioPreview';

const Home = () => {
    return (
        <main>
            <Hero />
            <Philosophy />
            <Capabilities />
            <PortfolioPreview />
        </main>
    );
};

export default Home;
