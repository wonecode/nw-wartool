import DialogTitle from '@mui/material/DialogTitle';
import { Icon } from '@iconify/react';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { ButtonBase } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import * as React from 'react';
import { signIn } from 'next-auth/react';
import { supabase } from '../../supabase';

const LoginModal = ({ isOpen, handleClose }) => {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
    });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle className="flex items-center">
        <Icon height={25} width={25} icon="tabler:login" className="mr-3" />
        Se connecter
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Veuillez vous connecter afin d&lsquo;accéder à l&lsquo;ensemble des
          fonctionnalités
        </DialogContentText>

        <ButtonBase
          onClick={login}
          className="py-3 w-full mt-4 bg-[#5865F2] rounded mb-2 font-medium"
        >
          <Icon
            height={25}
            width={25}
            icon="ic:baseline-discord"
            className="mr-3"
          />
          Continuer avec Discord
        </ButtonBase>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
