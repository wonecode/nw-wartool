/* eslint-disable @next/next/no-img-element */
import Navbar from '@/components/Navbar';
import { Box, Divider, Typography } from '@mui/material';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { supabase } from 'supabase';
import { Clear } from '@mui/icons-material';
import { frWeaponsLabels } from 'utils/weapons';

type Props = {
  // Add custom props here
};

const FindPlayer = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [players, setPlayers] = React.useState([]);
  const { t } = useTranslation(['common']);

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from('players')
      .select(
        'id, ig_username, gearscore, guild:guild_id(name, faction), main_bis_class, first_weapon'
      )
      .eq('main_bis_class', 'main')
      .order('ig_username', { ascending: true });

    if (error) {
      console.log(error);
    } else {
      console.log(data);
      setPlayers(data);
    }
  };

  React.useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <Box>
      <Head>
        <title>{t('common:stats-sublinks:find-player')} | GuildTool</title>
      </Head>
      <Navbar />

      <div className='h-[76vh] p-5 flex flex-col items-center justify-center'>
        <img
          src='/assets/gradient-right-dark.svg'
          alt='gradient dark background'
          className='block fixed -top-[35%] -right-[45%] max-w-[100%] -z-10'
        />
        <img
          src='/assets/gradient-left-dark.svg'
          alt='gradient dark background'
          className='block fixed -bottom-1/2 -left-[10%] -right-1/2 max-w-[100%] -z-10'
        />
        <div className='w-1/2'>
          <Typography className='font-black uppercase text-2xl mb-2 flex items-center'>
            <Icon icon='ic:outline-search' className='mr-2 text-yellow-500' />
            <span
              className='bg-gradient-to-r bg-clip-text  text-transparent 
            from-gray-100 via-gray-300 to-gray-100 animate-text'>
              {t('common:stats-sublinks:find-player')}
            </span>
          </Typography>
        </div>

        <Autocomplete
          freeSolo
          id='free-solo-2-demo'
          className='w-1/2 shadow-lg'
          disableClearable
          groupBy={(option) => option.guild.name}
          clearIcon={<Clear color='primary' />}
          blurOnSelect='touch'
          getOptionLabel={(option) => option.ig_username}
          options={players.map((player) => player)}
          renderOption={(props, option) => {
            return (
            <Box component='li' sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              <Icon icon={frWeaponsLabels[option.first_weapon].icon} width={20} height={20} className='mr-3' />
              <div className='flex flex-col'>
                <Typography className='text-sm font-bold'>{option.ig_username}</Typography>
                <Typography className='text-xs text-gray-400'>Gearscore {option.gearscore}</Typography>
              </div>
              <Divider />
            </Box>
  )}}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                type: 'search',
                style: {
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(255, 255, 255, 0.077)',
                },
              }}
            />
          )}
        />
      </div>
    </Box>
  );
};

export default FindPlayer;

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'fr', ['common', 'global-table', 'stats'])),
  },
});
