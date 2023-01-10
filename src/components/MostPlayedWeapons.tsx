import { Icon } from '@iconify/react';
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import React from 'react';
import { supabase } from 'supabase';
import { weaponsLabels } from 'utils/weapons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LayoutPosition } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { factionColors } from 'utils/factions';

ChartJS.register(ArcElement, Tooltip, Legend);

const MostPlayedWeapons = () => {
  const [firstWeapons, setfirstWeapons] = React.useState([]);
  const [secondWeapons, setsecondWeapons] = React.useState([]);
  const [guilds, setGuilds] = React.useState([]);
  const [selectedGuild, setSelectedGuild] = React.useState('Toutes les guildes');

  const pieFirstWeaponData = {
    labels: Object.keys(firstWeapons).map((weapon) => weaponsLabels[weapon].label),
    datasets: [
      {
        label: 'Nombre de joueurs',
        data: Object.values(firstWeapons),
        backgroundColor: Object.keys(firstWeapons).map(
          (weapon) => weaponsLabels[weapon].backgroundColor
        ),
        borderColor: Object.keys(firstWeapons).map((weapon) => weaponsLabels[weapon].borderColor),
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
    options: {
      legend: {
        position: 'right',
      },
    },
  };

  const pieSecondWeaponData = {
    labels: Object.keys(secondWeapons).map((weapon) => weaponsLabels[weapon].label),
    datasets: [
      {
        label: 'Nombre de joueurs',
        data: Object.values(secondWeapons),
        backgroundColor: Object.keys(secondWeapons).map(
          (weapon) => weaponsLabels[weapon].backgroundColor
        ),
        borderColor: Object.keys(secondWeapons).map((weapon) => weaponsLabels[weapon].borderColor),
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
    options: {
      legend: {
        position: 'right',
      },
    },
  };

  const pieceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as LayoutPosition,
      },
    },
  };

  React.useEffect(() => {
    const fetchGuilds = async () => {
      const { data } = await supabase.from('guilds').select('*');

      setGuilds(data);
    };

    const fetchWeapons = async (data) => {
      const firstWeapons = data.reduce((acc, player) => {
        const weapon = player.first_weapon;

        if (acc[weapon]) {
          acc[weapon] += 1;
        } else {
          acc[weapon] = 1;
        }

        return acc;
      }, {});

      const secondWeapons = data.reduce((acc, player) => {
        const weapon = player.second_weapon;

        if (acc[weapon]) {
          acc[weapon] += 1;
        } else {
          acc[weapon] = 1;
        }

        return acc;
      }, {});

      setfirstWeapons(firstWeapons);
      setsecondWeapons(secondWeapons);
    };

    const selectRequest = async () => {
      if (selectedGuild !== 'Toutes les guildes') {
        const { data } = await supabase.from('players').select('*').eq('guild', selectedGuild);

        fetchWeapons(data);
      } else {
        const { data } = await supabase.from('players').select('*');

        fetchWeapons(data);
      }
    };

    selectRequest();
    fetchGuilds();
  }, [selectedGuild]);

  let firstWeaponsSortable = [];
  let secondWeaponsSortable = [];

  for (const weapon in firstWeapons) {
    firstWeaponsSortable.push([weapon, firstWeapons[weapon]]);
  }

  for (const weapon in secondWeapons) {
    secondWeaponsSortable.push([weapon, secondWeapons[weapon]]);
  }

  firstWeaponsSortable.sort((a, b) => b[1] - a[1]);
  secondWeaponsSortable.sort((a, b) => b[1] - a[1]);

  const top3FirstWeapons = firstWeaponsSortable.slice(0, 3);
  const top3SecondWeapons = secondWeaponsSortable.slice(0, 3);

  return (
    <>
      <Box className='flex justify-between items-center'>
        <Typography className='uppercase font-black mr-4 text-xl'>
          Stats<span className='font-light'> • Armes</span>
        </Typography>

        <FormControl size='small' className={`w-[20%]`}>
          <InputLabel id='guild-label'>Filtrer par guilde</InputLabel>
          <Select
            label='Filtrer par guilde'
            labelId='guild-label'
            id='guild'
            value={selectedGuild}
            onChange={(e) => setSelectedGuild(e.target.value)}>
            <MenuItem value='Toutes les guildes' className='italic'>
              Toutes les guildes
            </MenuItem>
            {guilds.map((guild) => (
              <MenuItem key={guild.guildName} value={guild.guildName} color={`${factionColors[guild.faction]}`}>
                <span className={`w-3 h-3 rounded-xl mr-2 ${factionColors[guild.faction]}`} />
                {guild.guildName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper className='p-3 mt-5 rounded-md'>
        <Box className='flex'>
          <Box className='w-full text-center'>
            <Typography className='uppercase font-bold text-yellow-400 my-2'>
              Première arme
            </Typography>
            <Box className='flex items-center justify-center'>
              {top3FirstWeapons.map((weapon) => (
                <Box key={weapon[0]} className='text-center mx-4'>
                  <Box className='flex items-center justify-center'>
                    <Typography className='font-black text-[40px] mt-0'>{weapon[1]}</Typography>
                    <Icon icon={weaponsLabels[weapon[0]].icon} className='text-3xl ml-3' />
                  </Box>
                  <Box>
                    <Typography className='text-sm font-light text-gray-400'>
                      {weaponsLabels[weapon[0]].label}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <div className='w-1/2 mx-auto'>
              <Pie data={pieFirstWeaponData} options={pieceOptions} lang='fr' />
            </div>
          </Box>
          <Divider orientation='vertical' flexItem />
          <Box className='w-full text-center'>
            <Typography className='uppercase font-bold text-yellow-400 my-2'>
              Deuxième arme
            </Typography>
            <Box className='flex items-center justify-center'>
              {top3SecondWeapons.map((weapon) => (
                <Box key={weapon[0]} className='text-center mx-4'>
                  <Box className='flex items-center justify-center'>
                    <Typography className='font-black text-[40px] mt-0'>{weapon[1]}</Typography>
                    <Icon icon={weaponsLabels[weapon[0]].icon} className='text-3xl ml-3' />
                  </Box>
                  <Box>
                    <Typography className='text-sm font-light text-gray-400'>
                      {weaponsLabels[weapon[0]].label}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <div className='w-1/2 mx-auto'>
              <Pie data={pieSecondWeaponData} options={pieceOptions} lang='fr' />
            </div>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default MostPlayedWeapons;
