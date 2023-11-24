import DialogTitle from '@mui/material/DialogTitle';
import { Icon } from '@iconify/react';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { ButtonBase, IconButton, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import * as React from 'react';
import { useEffect } from 'react';
import { supabase } from '../../supabase';
import { useTranslation } from 'react-i18next';
import { enWeaponsLabels, frWeaponsLabels } from '../../utils/weapons';
import { useRouter } from 'next/router';
import Chip from '@/components/Chip';
import PlayerModal from '@/components/PlayerModal';
import { toast } from 'react-toastify';

const ManageBuildsModal = ({ isOpen, handleClose, user, rows, handleRows }) => {
  const [builds, setBuilds] = React.useState([]);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = React.useState(false);
  const [player, setPlayer] = React.useState(null);
  const [selectBuildToUpdate, setSelectBuildToUpdate] = React.useState(null);

  const { t } = useTranslation(['common', 'global-table']);
  const router = useRouter();

  const getBuilds = async () => {
    const { data: userData } = await supabase
      .from('players_duplicate')
      .select(
        'id, ig_username, discord, avatar_url, guild:guild_id(id, name, faction)'
      )
      .eq('auth_id', user.id);

    if (!userData.length) {
      return;
    }

    const { data } = await supabase
      .from('builds')
      .select('*')
      .eq('player_id', userData[0].id);

    setPlayer(userData[0]);
    setBuilds(data);
  };

  React.useEffect(() => {
    if (user) {
      getBuilds();
    }
  }, [user]);

  const handleUpdateBuild = async (build: any) => {
    setSelectBuildToUpdate(build);
    setIsPlayerModalOpen(true);
  };

  const handleDeleteBuild = async (buildId: string) => {
    const { data, error } = await supabase
      .from('builds')
      .delete()
      .match({ id: buildId });

    if (error) {
      toast.error(`Une erreur est survenue lors de la suppression du build.`, {
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
    } else {
      toast.success(`Le build a bien été supprimé`, {
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

      setBuilds((prev) => prev.filter((build) => build.id !== buildId));
      handleRows((prev) => prev.filter((row) => row.id !== buildId));
    }
  };

  const handleAddPlayer = () => {
    setIsPlayerModalOpen(true);
  };

  const handleBuildsList = (newEntry: any, update = false) => {
    if (update) {
      setBuilds((prev) =>
        prev.map((build) => {
          if (build.id === newEntry.id) {
            return newEntry;
          }
          return build;
        })
      );
    } else {
      setBuilds((prev) => [...prev, newEntry]);
    }
  };

  useEffect(() => {
    if (!isPlayerModalOpen) {
      setSelectBuildToUpdate(null);
    }
  }, [isPlayerModalOpen]);

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} maxWidth="lg">
        <DialogTitle className="flex items-center">
          <Icon height={25} width={25} icon="charm:swords" className="mr-3" />
          {t('global-table:manage-builds')}
        </DialogTitle>
        <DialogContent className="flex flex-col justify-center">
          <DialogContentText>
            {t('global-table:manage-builds-description')}
          </DialogContentText>

          <div className="flex flex-col mt-5 gap-2 min-w-[600px]">
            {builds.map((build) => (
              <div className="flex items-center justify-between bg-black/50 rounded p-3">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-yellow-500">
                    {build.gearscore}
                  </p>
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
                  <IconButton
                    className="flex items-center text-blue-500 p-1"
                    onClick={() => handleUpdateBuild(build)}
                  >
                    <Icon icon="iconamoon:edit-bold" height={17} width={17} />
                  </IconButton>
                  <IconButton
                    className="flex items-center text-red-500 p-1"
                    onClick={() => handleDeleteBuild(build.id)}
                  >
                    <Icon
                      icon="material-symbols:delete"
                      height={17}
                      width={17}
                    />
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

      <PlayerModal
        isOpen={isPlayerModalOpen}
        handleClose={() => setIsPlayerModalOpen(false)}
        player={player}
        handleNewEntry={handleBuildsList}
        rows={rows}
        handleRows={handleRows}
        build={selectBuildToUpdate}
      />
    </>
  );
};

export default ManageBuildsModal;
