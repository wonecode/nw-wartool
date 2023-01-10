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
  ButtonBase,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { supabase } from '../../supabase';
import { toast } from 'react-toastify';
import { factions } from 'utils/factions';

interface Guild {
  guildName: string;
  faction: string;
}

const GuildModal = ({ handleClose, isOpen }: { handleClose: () => void; isOpen: boolean }) => {
  const GuildSchema = Yup.object().shape({
    guildName: Yup.string().required('Le nom de la guilde est requis'),
    faction: Yup.string().required('Le nom de la faction est requis'),
  });

  const formik = useFormik({
    initialValues: {
      guildName: '',
      faction: factions.syndicate,
    },
    validationSchema: GuildSchema,
    onSubmit: async (values) => {
      addGuild(values);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, values, setFieldValue, setErrors } = formik;

  const addGuild = async (guild: Guild) => {
    let guildName = guild.guildName.trim();

    if (guildName.length > 0) {
      const { error } = await supabase.from('guilds').insert({
        guildName,
        faction: guild.faction,
      });
      if (!error) {
        toast.success(`La guilde ${guildName} a bien été ajoutée`, {
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

        handleClose();
        formik.resetForm();
      } else if (error.code === '23505') {
        setErrors({
          guildName: 'Cette guilde est déjà enregistrée',
        })
      } else {
        toast.error(`Une errreur est survenue lors de l'ajout de la guilde`, {
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
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth>
        <DialogTitle className='flex items-center'>
          <Icon height={25} width={25} icon='mdi:people-group' className='mr-3' />
          Ajouter une guilde
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Afin d'ajouter une guilde à la database, veuillez remplir les champs suivants.
          </DialogContentText>
          <FormikProvider value={formik}>
            <Form autoComplete='off' noValidate onSubmit={handleSubmit} className='mt-5'>
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
                  value={factions.syndicate}
                  control={<Radio size='small' />}
                  label='Les Ombres'
                />
                <FormControlLabel
                  value={factions.marauders}
                  control={<Radio size='small' />}
                  label='Les Maraudeurs'
                />
                <FormControlLabel
                  value={factions.covenant}
                  control={<Radio size='small' />}
                  label='Les Engagés'
                />
              </RadioGroup>
              <TextField
                autoFocus
                margin='dense'
                id='guild-name'
                label='Nom de la guilde'
                type='string'
                className='mt-3'
                fullWidth
                variant='filled'
                size='small'
                {...getFieldProps('guildName')}
                error={Boolean(touched.guildName && errors.guildName)}
                helperText={touched.guildName && errors.guildName}
              />
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

export default GuildModal;
