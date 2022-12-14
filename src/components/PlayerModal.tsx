/* eslint-disable react/no-unescaped-entities */
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Icon } from '@iconify/react';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Autocomplete,
  Box,
  ButtonBase,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Typography,
} from '@mui/material';
import { supabase } from '../../supabase';
import { toast } from 'react-toastify';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { v4 as uuidv4 } from 'uuid';
import { factionColors } from 'utils/factions';

const weapons = [
  {
    label: 'Non renseigné',
    value: 'none',
  },
  {
    label: 'Hache double',
    value: 'greataxe',
  },
  {
    label: 'Épée longue',
    value: 'greatsword',
  },
  {
    label: "Marteau d'armes",
    value: 'warhammer',
  },
  {
    label: 'Lance',
    value: 'spear',
  },
  {
    label: 'Arc',
    value: 'bow',
  },
  {
    label: 'Bâton de feu',
    value: 'firestaff',
  },
  {
    label: 'Mousquet',
    value: 'musket',
  },
  {
    label: 'Hachette',
    value: 'hatchet',
  },
  {
    label: 'Bâton de vie',
    value: 'lifestaff',
  },
  {
    label: 'Gantelet de glace',
    value: 'ice_gauntlet',
  },
  {
    label: 'Gantelet du néant',
    value: 'void_gauntlet',
  },
  {
    label: 'Épée & bouclier',
    value: 'sword_shield',
  },
  {
    label: 'Rapière',
    value: 'rapier',
  },
  {
    label: 'Tromblon',
    value: 'blunderbuss',
  },
];

const PlayerModal = ({
  handleClose,
  isOpen,
  rows,
  handleRows,
}: {
  handleClose: () => void;
  isOpen: boolean;
  rows: any;
  handleRows: (rows: any) => void;
}) => {
  const [showThirdWeaponSelect, setShowThirdWeaponSelect] = React.useState(false);
  const [guilds, setGuilds] = React.useState([]);

  const PlayerSchema = Yup.object().shape({
    ig_username: Yup.string().required('Veuillez renseigner le pseudo IG'),
    discord: Yup.string()
      .matches(/^.{3,32}#[0-9]{4}$/, 'Veuillez renseigner un pseudo Discord valide (ex: John#1234)')
      .required('Veuillez renseigner le pseudo Discord'),
    gearscore: Yup.number(),
    first_weapon: Yup.string().required('Veuillez renseigner la première arme'),
    second_weapon: Yup.string().required('Veuillez renseigner la seconde arme'),
    third_weapon: Yup.string(),
    stuff: Yup.string().required('Veuillez renseigner le type de stuff'),
    guild: Yup.string(),
    faction: Yup.string().required('Veuillez renseigner la faction'),
  });

  const formik = useFormik({
    initialValues: {
      id: '',
      ig_username: '',
      discord: '',
      gearscore: 525,
      first_weapon: '',
      second_weapon: '',
      third_weapon: 'none',
      stuff: 'light',
      guild: '',
      faction: 'marauders',
    },
    validationSchema: PlayerSchema,
    onSubmit: async (values) => {
      addPlayer(values);
    },
  });

  const marks = [
    {
      value: 540,
      label: '540',
    },
    {
      value: 580,
      label: '580',
    },
    {
      value: 600,
      label: '600',
    },
    {
      value: 615,
      label: '615',
    },
  ];

  const { errors, touched, handleSubmit, getFieldProps, values, setFieldValue, setErrors } = formik;

  const addPlayer = async (values) => {
    values.id = uuidv4();

    const { error } = await supabase.from('players').insert(values);

    if (!error) {
      toast.success(`Le joueur ${values.ig_username} a bien été ajouté`, {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        style: {
          fontFamily: 'Montserrat',
          fontSize: '0.8rem',
        },
      });

      handleRows([...rows, values]);

      handleClose();
      formik.resetForm();
    } else if (error.code === '23505') {
      setErrors({
        ig_username: 'Ce joueur est déjà enregistré',
      });
    } else {
      toast.error(`Une errreur est survenue lors de l'ajout du joueur`, {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        style: {
          fontFamily: 'Montserrat',
          fontSize: '0.8rem',
        },
      });
    }
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setFieldValue('gearscore', newValue);
  };

  const fetchGuilds = async () => {
    const { data, error } = await supabase.from('guilds').select('*');
    if (error) {
      toast.error('Une erreur est survenue');
    }
    setGuilds(data);
  };

  React.useEffect(() => {
    fetchGuilds();
  }, []);

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth>
        <DialogTitle className='flex items-center'>
          <Icon
            height={25}
            width={25}
            icon='material-symbols:person-add-rounded'
            className='mr-3'
          />
          Ajouter un joueur
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Afin d'ajouter un joueur à la database, veuillez remplir les champs suivants.
          </DialogContentText>
          <FormikProvider value={formik}>
            <Form autoComplete='off' noValidate onSubmit={handleSubmit} className='mt-5'>
              <TextField
                autoFocus
                margin='dense'
                id='ig_username'
                label='Pseudo IG'
                type='string'
                fullWidth
                variant='filled'
                size='small'
                {...getFieldProps('ig_username')}
                error={Boolean(touched.ig_username && errors.ig_username)}
                helperText={touched.ig_username && errors.ig_username}
              />
              <TextField
                autoFocus
                className='mb-4'
                margin='dense'
                id='discord'
                label='Discord'
                type='string'
                fullWidth
                variant='filled'
                size='small'
                {...getFieldProps('discord')}
                error={Boolean(touched.discord && errors.discord)}
                helperText={touched.discord && errors.discord}
              />
              <FormLabel id='gearscore' className='font-bold text-md'>
                Gearscore
              </FormLabel>
              <Slider
                aria-label='Always visible'
                id='gearscore'
                defaultValue={525}
                step={1}
                min={525}
                max={625}
                marks={marks}
                valueLabelDisplay='auto'
                value={values.gearscore}
                onChange={handleSliderChange}
              />
              <FormLabel id='radio-buttons-group-label' className='font-bold text-md'>
                Armes
              </FormLabel>
              <FormControl
                variant='filled'
                fullWidth
                size='small'
                className='mt-3'
                error={Boolean(errors.first_weapon && touched.first_weapon)}>
                <InputLabel id='first-weapon-label'>
                  {errors.first_weapon && touched.first_weapon
                    ? errors.first_weapon
                    : 'Première arme'}
                </InputLabel>
                <Select
                  labelId='first-weapon-label'
                  id='first-weapon'
                  value={values.first_weapon}
                  onChange={(e) => setFieldValue('first_weapon', e.target.value)}>
                  {weapons.map((weapon) => (
                    <MenuItem key={weapon.value} value={weapon.value}>
                      {weapon.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                variant='filled'
                fullWidth
                size='small'
                className='mt-4'
                error={Boolean(errors.second_weapon && touched.second_weapon)}>
                <InputLabel id='second-weapon-label'>
                  {errors.second_weapon && touched.second_weapon
                    ? errors.second_weapon
                    : 'Deuxième arme'}
                </InputLabel>
                <Select
                  labelId='second-weapon-label'
                  id='second-weapon'
                  value={values.second_weapon}
                  onChange={(e) => setFieldValue('second_weapon', e.target.value)}>
                  {weapons.map((weapon) => (
                    <MenuItem key={weapon.value} value={weapon.value}>
                      {weapon.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                variant='filled'
                fullWidth
                size='small'
                className={`mt-4 ${!showThirdWeaponSelect && 'hidden'} mb-6`}>
                <InputLabel id='third-weapon-label'>Troisième arme</InputLabel>
                <Select
                  labelId='third-weapon-label'
                  id='third-weapon'
                  value={values.third_weapon}
                  onChange={(e) => setFieldValue('third_weapon', e.target.value)}>
                  {weapons.map((weapon) => (
                    <MenuItem key={weapon.value} value={weapon.value}>
                      {weapon.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className={`w-full my-2 text-center ${showThirdWeaponSelect && 'hidden'}`}>
                <ButtonBase
                  className='p-1 rounded-sm'
                  onClick={() => setShowThirdWeaponSelect(true)}>
                  <AddCircleOutlineIcon className='mr-2' />
                  <Typography className='text-sm'>Ajouter une troisième arme</Typography>
                </ButtonBase>
              </div>
              <div>
                <FormLabel id='stuff-label' className='font-bold text-md'>
                  Stuff
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby='stuff-label'
                  name='stuff'
                  value={values.stuff}
                  onChange={(event) => {
                    setFieldValue('stuff', event.currentTarget.value);
                  }}>
                  <FormControlLabel value='light' control={<Radio size='small' />} label='Léger' />
                  <FormControlLabel value='medium' control={<Radio size='small' />} label='Moyen' />
                  <FormControlLabel value='heavy' control={<Radio size='small' />} label='Lourd' />
                </RadioGroup>
              </div>
              <div className='my-4'>
                <FormLabel id='stuff-label' className='font-bold text-md'>
                  Guilde
                </FormLabel>
                <Autocomplete
                  disablePortal
                  id='guild'
                  options={guilds}
                  size='small'
                  fullWidth
                  onChange={(event, newValue) => setFieldValue('guild', newValue?.guildName)}
                  getOptionLabel={(option) => option.guildName}
                  renderInput={(params) => <TextField className='my-2 bg-[#525252]' {...params} />}
                  renderOption={(props, option) => (
                    <Box component='li' {...props}>
                      <div className={`${factionColors[option.faction]} rounded-xl w-3 h-3 mr-2`} />
                      <Typography>{option.guildName}</Typography>
                    </Box>
                  )}
                />
              </div>
              <div className='mt-3'>
                <FormLabel id='radio-buttons-group-label' className='font-bold text-md'>
                  Faction
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby='radio-buttons-group-label'
                  name={'radio-group-factions'}
                  value={values.faction}
                  onChange={(event) => {
                    setFieldValue('faction', event.currentTarget.value);
                  }}>
                  <FormControlLabel
                    value='marauders'
                    control={<Radio size='small' />}
                    label='Les Maraudeurs'
                  />
                  <FormControlLabel
                    value='syndicate'
                    control={<Radio size='small' />}
                    label='Les Ombres'
                  />
                  <FormControlLabel
                    value='covenant'
                    control={<Radio size='small' />}
                    label='Les Engagés'
                  />
                </RadioGroup>
              </div>
            </Form>
          </FormikProvider>
        </DialogContent>
        <DialogActions className='m-4 mt-2'>
          <ButtonBase
            onClick={handleClose}
            className='font-bold text-sm px-4 py-1 rounded-sm bg-red-300 text-black'>
            <Icon height={20} width={20} icon='mdi:close-thick' className='mr-3' />
            Fermer
          </ButtonBase>
          <ButtonBase
            type='submit'
            onClick={() => handleSubmit()}
            className='font-bold text-sm px-4 py-1 rounded-sm bg-green-300 text-black'>
            <Icon height={20} width={20} icon='ic:outline-save-alt' className='mr-3' />
            Enregistrer
          </ButtonBase>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PlayerModal;
