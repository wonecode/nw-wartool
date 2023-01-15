import GlobalTable from '@/components/GlobalTable';
import { Box } from '@mui/material';
import Head from 'next/head';
import React from 'react';
import Navbar from '../components/Navbar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';

type Props = {
  // Add custom props here
};

export default function Home(_props: InferGetStaticPropsType<typeof getStaticProps>) {
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

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'fr', ['common', 'global-table', 'stats'])),
  },
});
