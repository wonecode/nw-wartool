import Navbar from '@/components/Navbar';
import { Box, Paper, Typography } from '@mui/material';
import React from 'react';
import Head from 'next/head';
import MostPlayedWeapons from '@/components/MostPlayedWeapons';
import Footer from '@/components/Footer';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

type Props = {};

const Weapons = () => {
  const { t } = useTranslation(['common']);

  return (
    <Box>
      <Head>
        <title>{t('common:stats-sublinks:weapons')} | GuildTool</title>
      </Head>

      <Navbar />

      <Box className='m-5'>
        <MostPlayedWeapons />
      </Box>

      <Footer />
    </Box>
  );
};

export default Weapons;

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'fr', ['common', 'global-table', 'stats'])),
  },
});
