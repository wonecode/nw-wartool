import DialogTitle from '@mui/material/DialogTitle';
import { Icon } from '@iconify/react';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { ButtonBase, IconButton, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import * as React from 'react';
import { supabase } from '../../supabase';
import { useTranslation } from 'react-i18next';
import { enWeaponsLabels, frWeaponsLabels } from '../../utils/weapons';
import { useRouter } from 'next/router';
import Chip from '@/components/Chip';

const ManageBuildsModal = ({ isOpen, handleClose, user, handleAddPlayer }) => {
  const [builds, setBuilds] = React.useState([]);

  const { t } = useTranslation(['common', 'global-table']);
  const router = useRouter();

  const getBuilds = async () => {
    const { data: userData } = await supabase
      .from('players_duplicate')
      .select('*')
      .eq('auth_id', user.id);

    const { data } = await supabase
      .from('builds')
      .select('*')
      .eq('player_id', userData[0].id);

    setBuilds(data);
  };

  React.useEffect(() => {
    if (user) {
      getBuilds();
    }
  }, [user]);

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="lg">
      <DialogTitle className="flex items-center">
        <Icon height={25} width={25} icon="charm:swords" className="mr-3" />
        {t('global-table:manage-builds')}
      </DialogTitle>
      <DialogContent className="flex flex-col justify-center">
        <DialogContentText>
          Vous pouvez ajouter, mettre à jour ou supprimer vos builds ici
        </DialogContentText>

        <div className="flex flex-col mt-5 gap-2 min-w-[600px]">
          {builds.map((build) => (
            <div className="flex items-center justify-between bg-black/50 rounded p-3">
              <div className="flex items-center gap-3">
                <p className="font-medium text-yellow-500">{build.gearscore}</p>
                <p className="text-2xl leading-none text-gray-500">•</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={
                        router.locale === 'fr'
                          ? frWeaponsLabels[build.first_weapon].icon
                          : enWeaponsLabels[build.first_weapon].icon
                      }
                      width={18}
                      height={18}
                    />
                    <Typography className="text-sm">
                      {router.locale === 'fr'
                        ? frWeaponsLabels[build.first_weapon].label
                        : enWeaponsLabels[build.first_weapon].label}
                    </Typography>
                  </div>
                  <p className="text-lg leading-none text-gray-500">/</p>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={
                        router.locale === 'fr'
                          ? frWeaponsLabels[build.second_weapon].icon
                          : enWeaponsLabels[build.second_weapon].icon
                      }
                      width={18}
                      height={18}
                    />
                    <Typography className="text-sm">
                      {router.locale === 'fr'
                        ? frWeaponsLabels[build.second_weapon].label
                        : enWeaponsLabels[build.second_weapon].label}
                    </Typography>
                  </div>
                </div>
                <p className="text-2xl leading-none text-gray-500">•</p>
                <Chip
                  locale={router.locale}
                  status={build.stuff}
                  label={build.stuff}
                />
              </div>
              <div className="flex items-center">
                <IconButton className="flex items-center text-blue-500 p-1">
                  <Icon icon="iconamoon:edit-bold" height={17} width={17} />
                </IconButton>
                <IconButton className="flex items-center text-red-500 p-1">
                  <Icon icon="material-symbols:delete" height={17} width={17} />
                </IconButton>
              </div>
            </div>
          ))}
        </div>

        <ButtonBase
          className="flex items-center justify-center mt-2 gap-2 p-2 rounded bg-black/40 hover:bg-black/30"
          onClick={handleAddPlayer}
        >
          <Icon icon="mdi:plus" height={20} width={20} />
          <Typography className="text-sm">
            {t('global-table:add-build')}
          </Typography>
        </ButtonBase>
      </DialogContent>
    </Dialog>
  );
};

export default ManageBuildsModal;
