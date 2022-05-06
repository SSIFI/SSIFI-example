import React, { useState } from 'react'
import ChatMode from './../components/ChatMode'
import VoiceMode from './../components/VoiceMode'
import { Box, IconButton } from '@mui/material'
import ToggleOffRoundedIcon from '@mui/icons-material/ToggleOffRounded'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import { postRequest } from '../api/requests.js'

const Main = () => {
  const [mode, setMode] = useState(true)
  const [chatList, setChatList] = useState([])
  const [audioUrls, setAudioUrls] = useState([])
  const [chatContent, setChatContent] = useState('')

  const handleAddChat = async function (data) {
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
        const context = await postRequest('api/channel/tts/', { mode: 'test', message: data })
        setChatList(prev => [
          ...prev.filter(elem => elem.id !== 'loading'),
          {
            id: 'ssifi',
            chat: context.data.message,
          },
        ])
        setAudioUrls(context.data.url)
      } catch {
        console.log('error')
      }
    }, 1000)
  }

  return (
    <div style={{ height: '100%' }}>
      <Box sx={{ margin: '0 0 0 auto', display: 'flex', justifyContent: 'end' }}>
        <IconButton variant="outlined" onClick={() => setMode(!mode)}>
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