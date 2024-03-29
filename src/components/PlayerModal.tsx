/* eslint-disable react/no-unescaped-entities */
import * as React from 'react';
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
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
} from '@mui/material';
import { supabase } from '../../supabase';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

const PlayerModal = ({
  handleClose,
  isOpen,
  rows,
  handleRows,
  build,
  player,
  handleNewEntry,
}: {
  handleClose: () => void;
  isOpen: boolean;
  rows?: any;
  handleRows?: (rows: any) => void;
  build?: any;
  player?: any;
  handleNewEntry?: (newEntry: any, update?: boolean) => void;
}) => {
  const [guilds, setGuilds] = React.useState([]);
  const [selectedGuild, setSelectedGuild] = React.useState({});

  const { t } = useTranslation(['global-table']);

  const weapons = [
    {
      label: t('global-table:player-modal:weapons:greataxe'),
      value: 'greataxe',
    },
    {
      label: t('global-table:player-modal:weapons:greatsword'),
      value: 'greatsword',
    },
    {
      label: t('global-table:player-modal:weapons:warhammer'),
      value: 'warhammer',
    },
    {
      label: t('global-table:player-modal:weapons:spear'),
      value: 'spear',
    },
    {
      label: t('global-table:player-modal:weapons:bow'),
      value: 'bow',
    },
    {
      label: t('global-table:player-modal:weapons:firestaff'),
      value: 'firestaff',
    },
    {
      label: t('global-table:player-modal:weapons:musket'),
      value: 'musket',
    },
    {
      label: t('global-table:player-modal:weapons:hatchet'),
      value: 'hatchet',
    },
    {
      label: t('global-table:player-modal:weapons:lifestaff'),
      value: 'lifestaff',
    },
    {
      label: t('global-table:player-modal:weapons:ice_gauntlet'),
      value: 'ice_gauntlet',
    },
    {
      label: t('global-table:player-modal:weapons:void_gauntlet'),
      value: 'void_gauntlet',
    },
    {
      label: t('global-table:player-modal:weapons:sword_and_shield'),
      value: 'sword_shield',
    },
    {
      label: t('global-table:player-modal:weapons:rapier'),
      value: 'rapier',
    },
    {
      label: t('global-table:player-modal:weapons:blunderbuss'),
      value: 'blunderbuss',
    },
    {
      label: t('global-table:player-modal:weapons:flail_and_shield'),
      value: 'flail_shield',
    },
  ];

  const heartRunes = [
    {
      label: t('global-table:player-modal:heartrunes:stoneform'),
      value: 'stoneform',
    },
    {
      label: t('global-table:player-modal:heartrunes:detonate'),
      value: 'detonate',
    },
    {
      label: t('global-table:player-modal:heartrunes:grasping_vines'),
      value: 'grasping_vines',
    },
    {
      label: t('global-table:player-modal:heartrunes:dark_ascent'),
      value: 'dark_ascent',
    },
    {
      label: t('global-table:player-modal:heartrunes:cannon_blast'),
      value: 'cannon_blast',
    },
    {
      label: t('global-table:player-modal:heartrunes:bile_bomb'),
      value: 'bile_bomb',
    },
    {
      label: t('global-table:player-modal:heartrunes:fire_storm'),
      value: 'fire_storm',
    },
    {
      label: t('global-table:player-modal:heartrunes:devourer'),
      value: 'devourer',
    },
    {
      label: t('global-table:player-modal:heartrunes:primal_fury'),
      value: 'primal_fury',
    },
  ];

  const PlayerSchema = Yup.object().shape({
    class_type: Yup.string(),
    gearscore: Yup.number(),
    first_weapon: Yup.string().required(
      t('global-table:player-modal:first_weapon_error')
    ),
    second_weapon: Yup.string().required(
      t('global-table:player-modal:second_weapon_error')
    ),
    heartrune: Yup.string().required(
      t('global-table:player-modal:heartrune_error')
    ),
    stuff: Yup.string().required('Veuillez renseigner le type de stuff'),
  });

  const formik = useFormik({
    initialValues: {
      id: '',
      class_type: 'dps',
      gearscore: 600,
      first_weapon: '',
      second_weapon: '',
      heartrune: '',
      stuff: 'light',
    },
    validationSchema: PlayerSchema,
    onSubmit: async (values) => {
      addPlayer(values);
    },
  });

  const marks = [
    {
      value: 600,
      label: '600',
    },
    {
      value: 650,
      label: '650',
    },
    {
      value: 675,
      label: '675',
    },
    {
      value: 700,
      label: '700',
    },
  ];

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    values,
    setFieldValue,
    setErrors,
  } = formik;

  const addPlayer = async (values) => {
    values.id = uuidv4();

    console.log(player);

    const { error } = await supabase.from('builds').insert({
      ...values,
      player_id: player.id,
    });

    if (!error) {
      toast.success(`Le build a bien été ajouté`, {
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

      handleRows([
        ...rows,
        {
          id: values.id,
          class_type: values.class_type,
          gearscore: values.gearscore,
          first_weapon: values.first_weapon,
          second_weapon: values.second_weapon,
          heartrune: values.heartrune,
          stuff: values.stuff,
          player: {
            ig_username: player.ig_username,
            guild: player.guild,
            discord: player.discord,
            avatar_url: player.avatar_url,
          },
        },
      ]);

      handleNewEntry({
        id: values.id,
        class_type: values.class_type,
        gearscore: values.gearscore,
        first_weapon: values.first_weapon,
        second_weapon: values.second_weapon,
        heartrune: values.heartrune,
        stuff: values.stuff,
      });

      handleClose();
      formik.resetForm();
    } else {
      toast.error(`Une erreur est survenue lors de l'ajout du build`, {
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

  const editPlayer = async (values) => {
    const { error } = await supabase
      .from('builds')
      .update(values)
      .eq('id', build.id);

    if (!error) {
      toast.success(`Le build a bien été modifié`, {
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

      const updatedRows = rows.map((row) =>
        row.id === values.id ? { ...row, ...values, guild: selectedGuild } : row
      );

      handleRows(updatedRows);

      handleNewEntry(
        {
          id: values.id,
          class_type: values.class_type,
          gearscore: values.gearscore,
          first_weapon: values.first_weapon,
          second_weapon: values.second_weapon,
          heartrune: values.heartrune,
          stuff: values.stuff,
        },
        true
      );

      handleClose();
      formik.resetForm();
    } else {
      toast.error(
        `Une errreur est survenue lors de la modification du joueur.`,
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

    if (build) {
      setFieldValue('id', build.id);
      setFieldValue('class_type', build.class_type);
      setFieldValue('gearscore', build.gearscore);
      setFieldValue('first_weapon', build.first_weapon);
      setFieldValue('second_weapon', build.second_weapon);
      setFieldValue('heartrune', build.heartrune);
      setFieldValue('stuff', build.stuff);
    }
  }, [build]);

  React.useEffect(() => {
    if (isOpen && !build) {
      formik.resetForm();
    }
  }, [isOpen]);

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth>
        <DialogTitle className="flex items-center">
          <Icon height={25} width={25} icon="charm:swords" className="mr-3" />
          {build
            ? t('global-table:player-modal:edit_title')
            : t('global-table:player-modal:add_title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {build
              ? t('global-table:player-modal:edit_subtitle')
              : t('global-table:player-modal:add_subtitle')}
          </DialogContentText>
          <FormikProvider value={formik}>
            <Form
              autoComplete="off"
              noValidate
              onSubmit={handleSubmit}
              className="mt-5"
            >
              <div className="mb-4">
                <FormLabel id="class-type-label" className="font-bold text-md">
                  {t('global-table:player-modal:class_type')}
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="class-type-label"
                  name="class-type"
                  value={values.class_type}
                  onChange={(event) => {
                    setFieldValue('class_type', event.currentTarget.value);
                  }}
                >
                  <FormControlLabel
                    value="dps"
                    control={<Radio size="small" />}
                    label="DPS"
                  />
                  <FormControlLabel
                    value="heal"
                    control={<Radio size="small" />}
                    label="Heal"
                  />
                  <FormControlLabel
                    value="bruiser"
                    control={<Radio size="small" />}
                    label="Bruiser"
                  />
                  <FormControlLabel
                    value="support"
                    control={<Radio size="small" />}
                    label="Support"
                  />
                </RadioGroup>
              </div>
              <FormLabel id="gearscore" className="font-bold text-md">
                Gearscore
              </FormLabel>
              <Slider
                aria-label="Always visible"
                id="gearscore"
                defaultValue={525}
                step={1}
                min={600}
                max={700}
                marks={marks}
                valueLabelDisplay="auto"
                value={values.gearscore}
                onChange={handleSliderChange}
              />
              <FormLabel
                id="radio-buttons-group-label"
                className="font-bold text-md"
              >
                {t('global-table:player-modal:weapons_label')}
              </FormLabel>
              <FormControl
                variant="filled"
                fullWidth
                size="small"
                className="mt-3"
                error={Boolean(errors.first_weapon && touched.first_weapon)}
              >
                <InputLabel id="first-weapon-label">
                  {errors.first_weapon && touched.first_weapon
                    ? errors.first_weapon
                    : t('global-table:player-modal:first_weapon')}
                </InputLabel>
                <Select
                  labelId="first-weapon-label"
                  id="first-weapon"
                  value={values.first_weapon}
                  onChange={(e) =>
                    setFieldValue('first_weapon', e.target.value)
                  }
                >
                  {weapons.map((weapon) => (
                    <MenuItem key={weapon.value} value={weapon.value}>
                      {weapon.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                variant="filled"
                fullWidth
                size="small"
                className="mt-4"
                error={Boolean(errors.second_weapon && touched.second_weapon)}
              >
                <InputLabel id="second-weapon-label">
                  {errors.second_weapon && touched.second_weapon
                    ? errors.second_weapon
                    : t('global-table:player-modal:second_weapon')}
                </InputLabel>
                <Select
                  labelId="second-weapon-label"
                  id="second-weapon"
                  value={values.second_weapon}
                  onChange={(e) =>
                    setFieldValue('second_weapon', e.target.value)
                  }
                >
                  {weapons.map((weapon) => (
                    <MenuItem key={weapon.value} value={weapon.value}>
                      {weapon.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="mt-5">
                <FormLabel id="heartrune-label" className="font-bold text-md">
                  {t('global-table:player-modal:heartrune')}
                </FormLabel>
                <FormControl
                  variant="filled"
                  fullWidth
                  size="small"
                  className={`mt-3 mb-6`}
                  error={Boolean(errors.heartrune && touched.heartrune)}
                >
                  <InputLabel id="heartrune-label">
                    {errors.heartrune && touched.heartrune
                      ? errors.heartrune
                      : t('global-table:player-modal:heartrune')}
                  </InputLabel>
                  <Select
                    labelId="heartrune-label"
                    id="heartrune"
                    value={values.heartrune}
                    onChange={(e) => setFieldValue('heartrune', e.target.value)}
                  >
                    {heartRunes.map((heartrune) => (
                      <MenuItem key={heartrune.value} value={heartrune.value}>
                        {heartrune.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div>
                <FormLabel id="stuff-label" className="font-bold text-md">
                  Stuff
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="stuff-label"
                  name="stuff"
                  value={values.stuff}
                  onChange={(event) => {
                    setFieldValue('stuff', event.currentTarget.value);
                  }}
                >
                  <FormControlLabel
                    value="light"
                    control={<Radio size="small" />}
                    label={t('global-table:player-modal:stuff:light')}
                  />
                  <FormControlLabel
                    value="medium"
                    control={<Radio size="small" />}
                    label={t('global-table:player-modal:stuff:medium')}
                  />
                  <FormControlLabel
                    value="heavy"
                    control={<Radio size="small" />}
                    label={t('global-table:player-modal:stuff:heavy')}
                  />
                </RadioGroup>
              </div>
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
            {t('global-table:player-modal:close')}
          </ButtonBase>
          <ButtonBase
            type="submit"
            onClick={() => (build ? editPlayer(values) : handleSubmit())}
            className="font-bold text-sm px-4 py-1 rounded-sm bg-green-300 text-black"
          >
            <Icon
              height={20}
              width={20}
              icon="ic:outline-save-alt"
              className="mr-3"
            />
            {t('global-table:player-modal:save')}
          </ButtonBase>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PlayerModal;
