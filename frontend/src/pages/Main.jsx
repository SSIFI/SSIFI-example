import React, { useState, useCallback } from 'react'
import ChatMode from './../components/ChatMode'
import VoiceMode from './../components/VoiceMode'
import { Box, IconButton } from '@mui/material'
import ToggleOffRoundedIcon from '@mui/icons-material/ToggleOffRounded'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import { postRequest } from '../api/requests.js'
import { Typography } from '../../node_modules/@mui/material/index'
import Modal from '@mui/material/Modal'

const Main = () => {
  const [mode, setMode] = useState(true)
  const [chatList, setChatList] = useState([
    {
      id: 'ssifi',
      chat: '안녕하세요 여러분의 SSIFI 입니다. \n음성 모드에서 대화를 나누어보세요!\n우측 상단 버튼을 통해 채팅도 진행할 수 있습니다 !',
      info: true,
    },
  ])
  const [audioUrls, setAudioUrls] = useState([])
  const [chatContent, setChatContent] = useState('')
  const [ttsLoad, setTTSLoad] = useState(false)
  const [toggable, setToggable] = useState(true)
  const [imageOpen, setImageOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)

  // audioUrl 초기화
  // useCallback으로 부모 컴포넌트에서 함수 정의 후 자식으로 전달
  // https://stackoverflow.com/questions/62464488/how-to-use-a-prop-function-inside-of-useeffect
  const initAudioUrls = useCallback(() => {
    setAudioUrls([])
  }, [])

  const handleImageOpen = () => {
    setImageOpen(true)
  }
  const handleImageClose = () => {
    setImageOpen(false)
  }

  const handleAddChat = async function (data) {
    setTTSLoad(true)
    setChatList(prev => [
      ...prev,
      {
        id: 'me',
        chat: chatContent,
      },
    ])
    setChatContent('')

    setTimeout(async () => {
      setChatList(prev => [
        ...prev,
        {
          id: 'loading',
          chat: '',
        },
      ])
      try {
        let mode = sessionStorage.getItem('mode')
        const context = await postRequest('api/channel/tts/', {
          mode: mode,
          message: data,
          isSaved: sessionStorage.getItem('isSaved'),
          key: sessionStorage.getItem('key'),
        })
        setTTSLoad(false)

        if (sessionStorage.getItem('mode') === 'painter') {
          handleImageOpen()
          setImageUrl(context.data.message)
        }

        setChatList(prev => [
          ...prev.filter(elem => elem.id !== 'loading'),
          {
            id: 'ssifi',
            chat: context.data.message,
            info: false,
            url: context.data.url,
            mode: mode,
          },
        ])
        setAudioUrls(context.data.url)
      } catch {
        console.log('error')
      }
    }, 1000)
  }

  const ImageModal = () => {
    return (
      <Modal open={imageOpen} onClose={handleImageClose}>
        <Box sx={style}>
          <img src={imageUrl} alt="씨피가그린그림" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
      </Modal>
    )
  }

  return (
    <div style={{ height: '100%' }}>
      <ImageModal></ImageModal>
      <Box
        sx={{
          margin: 'auto',
          display: 'flex',
          width: '80%',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '7%',
        }}
      >
        <Typography sx={{ margin: '0 10px', color: 'white', fontSize: '30px' }}>SSIFI</Typography>
        <Typography sx={{ margin: '0 10px', color: 'gray' }}>{mode ? 'Voice Mode' : 'Chat Mode'}</Typography>
        <IconButton disabled={!toggable} variant="outlined" onClick={() => setMode(!mode)}>
          {mode ? (
            <ToggleOffRoundedIcon sx={{ fontSize: '50px', color: 'white' }} />
          ) : (
            <ToggleOnIcon sx={{ fontSize: '50px', color: 'white' }} />
          )}
        </IconButton>
      </Box>
      {mode ? (
        <VoiceMode
          handleAddChat={handleAddChat}
          chatContent={chatContent}
          setChatContent={setChatContent}
          chatList={chatList}
          setChatList={setChatList}
          audioUrls={audioUrls}
          initAudioUrls={initAudioUrls}
          ttsLoad={ttsLoad}
          setToggable={setToggable}
        />
      ) : (
        <ChatMode
          chatList={chatList}
          chatContent={chatContent}
          setChatContent={setChatContent}
          handleAddChat={handleAddChat}
        />
      )}
    </div>
  )
}

export default Main

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}
