import GlobalTable from '@/components/GlobalTable';
import { Box } from '@mui/material';
import Head from 'next/head';
import React from 'react';
import Navbar from '../../components/Navbar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useTranslation } from 'react-i18next';

type Props = {
  // Add custom props here
};

export default function Staff(
  _props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { t } = useTranslation(['common']);

  return (
    <Box>
      <Head>
        <title>Staff | New World GuildTool</title>
      </Head>
      <Navbar />
    </Box>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'fr', [
      'common',
      'global-table',
      'stats',
    ])),
  },
});
