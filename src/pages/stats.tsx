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
        <Typography className='uppercase font-black mr-4 text-xl'>Stats</Typography>

        <Paper className='p-3 mt-5 rounded-md'>
          <MostPlayedWeapons />
        </Paper>
      </Box>

      <Footer />
    </Box>
  );
};

export default Stats;
