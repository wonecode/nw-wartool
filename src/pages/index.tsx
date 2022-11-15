import GlobalTable from '@/components/GlobalTable';
import { Box } from '@mui/material';
import Head from 'next/head';
import React from 'react';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <Box>
      <Head>
        <title>New World Wartool</title>
      </Head>
      <Navbar />

      <GlobalTable />
    </Box>
  );
}
