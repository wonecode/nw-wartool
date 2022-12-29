import { Icon } from '@iconify/react';
import { Box, Divider, Typography } from '@mui/material';
import React from 'react';
import { supabase } from 'supabase';
import { weaponsLabels } from 'utils/weapons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LayoutPosition } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const MostPlayedWeapons = () => {
  const [firstWeapons, setfirstWeapons] = React.useState([]);
  const [secondWeapons, setsecondWeapons] = React.useState([]);

  const pieFirstWeaponData = {
    labels: Object.keys(firstWeapons).map((weapon) => weaponsLabels[weapon].label),
    datasets: [
      {
        label: 'Nombre de joueurs',
        data: Object.values(firstWeapons),
        backgroundColor: Object.keys(firstWeapons).map((weapon) => weaponsLabels[weapon].backgroundColor),
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
        backgroundColor: Object.keys(secondWeapons).map((weapon) => weaponsLabels[weapon].backgroundColor),
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
    const fetchWeapons = async () => {
      const { data } = await supabase.from('players').select('*');

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

    fetchWeapons();
  }, []);

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
    <Box className='flex'>
      <Box className='w-full text-center'>
        <Typography className='uppercase font-bold text-yellow-400 my-2'>Première arme</Typography>
        <Box className='flex items-center justify-center'>
          {top3FirstWeapons.map((weapon) => (
            <Box key={weapon[0]} className='text-center mx-4'>
              <Box className='flex items-center justify-center'>
                <Typography className='font-black text-[40px] mt-0'>{weapon[1]}</Typography>
                <Icon icon={weaponsLabels[weapon[0]].icon} className='text-3xl ml-3' />
              </Box>
              <Box>
                <Typography className='text-sm font-light'>
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
        <Typography className='uppercase font-bold text-yellow-400 my-2'>Deuxième arme</Typography>
        <Box className='flex items-center justify-center'>
          {top3SecondWeapons.map((weapon) => (
            <Box key={weapon[0]} className='text-center mx-4'>
              <Box className='flex items-center justify-center'>
                <Typography className='font-black text-[40px] mt-0'>{weapon[1]}</Typography>
                <Icon icon={weaponsLabels[weapon[0]].icon} className='text-3xl ml-3' />
              </Box>
              <Box>
                <Typography className='text-sm font-light'>
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
  );
};

export default MostPlayedWeapons;
