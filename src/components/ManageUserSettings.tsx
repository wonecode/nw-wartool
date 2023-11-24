import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Icon } from '@iconify/react';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Form, FormikProvider, useFormik } from 'formik';
import { Box, ButtonBase, FormLabel, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import Autocomplete from '@mui/material/Autocomplete';
import { supabase } from '../../supabase';
import { toast } from 'react-toastify';

interface UserSettingsProps {
  isOpen: boolean;
  handleClose: () => void;
  user: any;
  rows: any;
  handleRows: (rows: any) => void;
  handlePlayerRegistered: () => void;
}

const factionColors = {
  syndicate: 'bg-violet-500',
  marauders: 'bg-green-600',
  covenant: 'bg-yellow-500',
};

const ManageUserSettings = ({
  isOpen,
  handleClose,
  user,
  rows,
  handleRows,
  handlePlayerRegistered,
}: UserSettingsProps) => {
  const [guilds, setGuilds] = React.useState([]);
  const [selectedGuild, setSelectedGuild] = React.useState(null);
  const [player, setPlayer] = React.useState(null);

  const { t } = useTranslation(['common', 'global-table']);
  const router = useRouter();

  const UserInfoSchema = Yup.object().shape({
    ig_username: Yup.string().required(
      t('global-table:player-modal:ig_username_error')
    ),
    guild_id: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      ig_username: '',
      guild_id: '',
    },
    validationSchema: UserInfoSchema,
    onSubmit: async (values) => {
      if (player) {
        const { error } = await supabase
          .from('players_duplicate')
          .update({
            ig_username: values.ig_username,
            guild_id: selectedGuild.id,
            discord: user.user_metadata.full_name,
            avatar_url: user.user_metadata.avatar_url,
            auth_id: user.id,
          })
          .match({ id: player.id });

        if (!error) {
          toast.success(`Vos informations ont bien été modifiées`, {
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

          const rowsToUpdate = rows.filter(
            (row) => row.player.ig_username === player.ig_username
          );

          const updatedRows = rowsToUpdate.map((row) => {
            return {
              ...row,
              player: {
                ...row.player,
                ig_username: values.ig_username,
                guild: selectedGuild,
                avatar_url: user.user_metadata.avatar_url,
              },
            };
          });

          const newRows = rows.filter(
            (row) => row.player.ig_username !== player.ig_username
          );

          handleRows([...newRows, ...updatedRows]);

          handleClose();
        } else {
          toast.error(
            `Une erreur est survenue lors de la modification de vos informations.`,
            {
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
            }
          );
        }
      } else {
        const { error } = await supabase.from('players_duplicate').insert({
          ig_username: values.ig_username,
          guild_id: selectedGuild.id,
          discord: user.user_metadata.full_name,
          avatar_url: user.user_metadata.avatar_url,
          auth_id: user.id,
        });

        if (!error) {
          toast.success(`Vos informations ont bien été modifiées`, {
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

          handlePlayerRegistered();

          handleClose();
        } else {
          toast.error(
            `Une erreur est survenue lors de la modification de vos informations.`,
            {
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
            }
          );
        }
      }
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    values,
    setFieldValue,
    setErrors,
  } = formik;

  useEffect(() => {
    const getGuilds = async () => {
      const { data } = await supabase.from('guilds').select('*');
      setGuilds(data);
    };

    const getPlayer = async () => {
      const { data } = await supabase
        .from('players_duplicate')
        .select('id, ig_username, discord, guild:guild_id(id, name, faction)')
        .eq('auth_id', user.id);

      if (data[0]) {
        setPlayer(data[0]);
        setFieldValue('ig_username', data[0].ig_username);
        setSelectedGuild(data[0].guild);
      }
    };

    getGuilds();

    if (user) getPlayer();
  }, [user]);

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle className="flex items-center">
        <Icon
          height={25}
          width={25}
          icon="iconamoon:settings"
          className="mr-3"
        />
        {t('global-table:manage-user-information')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('global-table:manage-user-information-description')}
        </DialogContentText>
        <FormikProvider value={formik}>
          <Form
            autoComplete="off"
            noValidate
            onSubmit={handleSubmit}
            className="mt-5"
          >
            <TextField
              autoFocus
              margin="dense"
              id="ig_username"
              label={t('global-table:player-modal:ig_username')}
              type="string"
              className="mt-3 mb-4"
              fullWidth
              variant="filled"
              size="small"
              {...getFieldProps('ig_username')}
              error={Boolean(touched.ig_username && errors.ig_username)}
              helperText={touched.ig_username && errors.ig_username}
            />
            <FormLabel id="stuff-label" className="font-bold text-md">
              {t('global-table:player-modal:guild')}
            </FormLabel>
            <Autocomplete
              disablePortal
              id="guild"
              options={guilds}
              placeholder={t('global-table:player-modal:guild_placeholder')}
              size="small"
              fullWidth
              isOptionEqualToValue={(option, value) => option.id === value.id}
              defaultValue={selectedGuild}
              onChange={(event, newValue) => {
                setFieldValue('guild_id', newValue?.id);
                setSelectedGuild(newValue);
              }}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField className="my-2 bg-[#525252]" {...params} />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <div
                    className={`${
                      factionColors[option.faction]
                    } rounded-xl w-3 h-3 mr-2`}
                  />
                  <Typography>{option.name}</Typography>
                </Box>
              )}
            />
          </Form>
        </FormikProvider>
      </DialogContent>
      <DialogActions className="m-4 mt-2">
        <ButtonBase
          onClick={handleClose}
          className="font-bold text-sm px-4 py-1 rounded-sm bg-red-300 text-black"
        >
          <Icon
            height={20}
            width={20}
            icon="mdi:close-thick"
            className="mr-3"
          />
          {t('global-table:guild-modal:close')}
        </ButtonBase>
        <ButtonBase
          type="submit"
          onClick={() => handleSubmit()}
          className="font-bold text-sm px-4 py-1 rounded-sm bg-green-300 text-black"
        >
          <Icon
            height={20}
            width={20}
            icon="ic:outline-save-alt"
            className="mr-3"
          />
          {t('global-table:guild-modal:save')}
        </ButtonBase>
      </DialogActions>
    </Dialog>
  );
};

export default ManageUserSettings;
