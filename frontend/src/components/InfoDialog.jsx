import React from 'react'

import { v4 as uuidv4 } from 'uuid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { postRequest } from '../api/requests'

const InfoDialog = ({ open, handleClose, navigate }) => {
  const isSaved = status => {
    sessionStorage.setItem('isSaved', status)
    getKey()
  }

  const getKey = async () => {
    try {
      const response = await postRequest('api/channel/key/', { uuid: uuidv4() })
      sessionStorage.setItem('key', response.data.key)
    } catch {
      console.log('key publish failed')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'정보 제공에 동의하시겠습니까?'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          동의함을 누르시면 SSIFI는 더 나은 학습을 위해 <br />
          사용자의 대화 내용을 보관 및 활용할 수 있습니다. <br />
          동의하지 않으시면 DB에 채팅 내용이 저장되지 않습니다. <br />
          여러분의 채팅 내용은 DB에 암호화되어 안전하게 저장됩니다 <br />
          *동의 여부와 상관없이 서비스를 이용하실 수 있습니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            isSaved(false)
            setTimeout(() => {
              navigate('/main')
              handleClose()
            }, 1000)
          }}
          color="primary"
        >
          동의하지 않음
        </Button>
        <Button
          onClick={() => {
            isSaved(true)
            setTimeout(() => {
              navigate('/main')
              handleClose()
            }, 1000)
          }}
          color="primary"
        >
          동의함
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default InfoDialog
