import GlobalTable from '@/components/GlobalTable';
import { Box } from '@mui/material';
import Head from 'next/head';
import React from 'react';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <Box>
      <Head>
        <title>War Players | New World GuildTool</title>
      </Head>
      <Navbar />

      <GlobalTable />
    </Box>
  );
}
