/* eslint-disable react/no-unescaped-entities */
import { Icon } from '@iconify/react';
import {
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

const AdvertisementModal = ({
  isOpen,
  handleClose,
  status,
}: {
  isOpen: boolean;
  handleClose: () => void;
  status: string;
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'>
      <DialogTitle className='flex items-center' aria-labelledby='alert-dialog-title'>
        {status === 'delete' ? (
          <>
            <Icon height={25} width={25} icon='clarity:trash-solid' className='mr-3' />
            Supression d'un joueur
          </>
        ) : (
          <>
            <Icon height={25} width={25} icon='material-symbols:edit' className='mr-3' />
            Édition d'un joueur
          </>
        )}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Pour des mesures de sécurité, cette action nécessite l'intervention de <span className='font-bold'>Wone#5234</span>,
          envoies lui un message sur Discord avec les modifications à effectuer.
        </DialogContentText>
      </DialogContent>
      <DialogActions className='m-4 mt-2'>
        <ButtonBase
          onClick={handleClose}
          className='font-bold text-sm px-4 py-1 rounded-sm bg-slate-100 text-black'>
          <Icon height={20} width={20} icon='line-md:confirm-circle' className='mr-3' />
          Confirmer
        </ButtonBase>
      </DialogActions>
    </Dialog>
  );
};

export default AdvertisementModal;
