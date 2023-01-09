import Navbar from '@/components/Navbar';
import { Box, Paper, Typography } from '@mui/material';
import React from 'react';
import Head from 'next/head';
import MostPlayedWeapons from '@/components/MostPlayedWeapons';
import Footer from '@/components/Footer';

const Stats = () => {
  return (
    <Box>
      <Head>
        <title>Stats | New World GuildTool</title>
      </Head>

      <Navbar />

      <Box className='m-5'>
        <MostPlayedWeapons />
      </Box>

      <Footer />
    </Box>
  );
};

export default Stats;
