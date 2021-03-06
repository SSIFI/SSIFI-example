import { Box, Typography } from '@mui/material'
import React, { useState, useEffect, useRef } from 'react'
import { faSatelliteDish } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IconButton from '@mui/material/IconButton'
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import MicIcon from '@mui/icons-material/Mic'
import { SyncLoader } from '../../node_modules/react-spinners/index'
import { Slide } from '../../node_modules/@mui/material/index'

import '../style/VoiceMode.css'
import ChatList from './ChatList'
import Moon from './Moon'
import { postRequest } from '../api/requests'
import AudioReactRecorder, { RecordState } from './AudioRecorder'
import ModeList from './ModeList'
import { useNavigate } from '../../node_modules/react-router-dom/index'

const VoiceMode = ({
  chatContent,
  handleAddChat,
  setChatContent,
  chatList,
  audioUrls,
  initAudioUrls,
  ttsLoad,
  setToggable,
  changeAiMode,
  modeList,
}) => {
  const [open, setOpen] = useState(false)
  const [onRec, setOnRec] = useState(false)
  const [recordState, setRecordState] = useState('')
  const [sttLoad, setSTTLoad] = useState(false)
  const [ssifiTalk, setssifiTalk] = useState(false)
  const [audio] = useState(new Audio())
  const navigate = useNavigate()

  const checked = useRef(null)
  const voiceText = useRef(null)

  const handleTextBox = () => {
    checked.current.click()
  }
  const handleVoiceText = () => {
    voiceText.current.style = 'display: block'
    voiceText.current.focus()
  }
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleRec = () => {
    start()
    setOnRec(!onRec)
    handleTextBox()
  }

  // 채팅 모드로 전환 시 audioUrls 배열 초기화
  useEffect(() => {
    return () => {
      setRecordState(RecordState.NONE)
      setssifiTalk(false)
      initAudioUrls()
      if (audio && audio.currentTime > 0) {
        audio.pause()
      }
    }
  }, [initAudioUrls, audio])

  useEffect(() => {
    try {
      if (audioUrls.length !== 0) {
        let audioIndex = 0
        audio.src = audioUrls[audioIndex]
        audio.currentTime = 0

        audio.addEventListener('playing', () => {
          console.log('오디오 재생 중')
          setssifiTalk(true)
        })

        audio.addEventListener('ended', () => {
          if (audioIndex < audioUrls.length - 1) {
            audioIndex += 1
            audio.src = audioUrls[audioIndex]
            audio.play()
          } else {
            setssifiTalk(false)
            audio.pause()
          }
        })
        audio.play()

        return audio.removeEventListener('ended', () => {
          console.log('audio play unmounted')
        })
      }
    } catch {
      console.log('error')
    }
  }, [audioUrls, audio])

  const start = () => {
    setSTTLoad(true)
    setToggable(false)
    setRecordState(RecordState.START)
    console.log('녹음 시작!')
  }

  const onStop = async audioData => {
    const audioFile = new File([audioData.blob], 'voice.wav', { lastModified: new Date().getTime(), type: 'audio/wav' })
    try {
      console.log(audioFile)
      const formData = new FormData()
      formData.append('speech', audioFile)
      formData.append('key', sessionStorage.getItem('key'))
      const response = await postRequest(`/api/channel/stt/`, formData)

      setChatContent(response.data.message)
      setToggable(true)

      console.log('응답 결과:', response.data) // 응답 텍스트 결과
      setSTTLoad(false)
      setRecordState(RecordState.NONE)
    } catch (err) {
      setSTTLoad(false)
      setOnRec(false)

      handleTextBox()
      if (err.response.status === 401) {
        alert('세션이 만료되었습니다.')
        sessionStorage.removeItem('key')
        navigate('/')
      }
    }
  }

  const onSendTTS = () => {
    handleAddChat(chatContent)
    setOnRec(false)

    handleTextBox()
  }

  const chatBox = (
    <Box sx={{ p: 4 }} className="chat-box">
      <IconButton sx={{ width: '100%' }} onClick={handleClose}>
        <ExpandMoreRoundedIcon style={{ color: 'white' }} />
      </IconButton>
      <ModeList changeAiMode={changeAiMode} modeList={modeList} />
      <ChatList chatList={chatList} modeList={modeList} />
    </Box>
  )

  const ttsLoadingPage = (
    <Box className="tts-loader">
      <div className="main_box">
        <div className="dot" />
        <div className="parent">
          <div className="child">
            <div className="subchild" />
          </div>
        </div>
      </div>
      <Typography sx={{ color: 'white' }}>음성을 우주로 보내고 있어요.</Typography>
    </Box>
  )

  return (
    <div className="voiceWrapper" onClick={open ? handleClose : null}>
      <Moon ssifiTalk={ssifiTalk} />

      <AudioReactRecorder state={recordState} onStop={onStop} />

      <input ref={checked} type="checkbox" id="stt-wrapper" />

      <Box className="stt-wrapper">
        {onRec ? (
          <Box className="stt-result">
            <Typography component="div" sx={{ color: 'white', width: '75%', paddingTop: '10px' }}>
              {sttLoad ? (
                <SyncLoader
                  color={'#ffffff'}
                  loading={sttLoad}
                  css={{ display: 'block', margin: '0 auto' }}
                  size={10}
                  margin={8}
                />
              ) : (
                <Box>
                  <input
                    className="voice-text-input"
                    ref={voiceText}
                    type="text"
                    value={chatContent}
                    maxLength="80"
                    onChange={e => setChatContent(e.target.value)}
                  />
                  <p
                    className="voice-text-box"
                    onClick={() => {
                      handleVoiceText()
                    }}
                    disabled={sttLoad}
                  >
                    {chatContent}
                  </p>
                </Box>
              )}
            </Typography>
            <IconButton onClick={onSendTTS} disabled={sttLoad}>
              <FontAwesomeIcon
                icon={faSatelliteDish}
                size="xl"
                style={sttLoad ? { color: 'gray' } : { color: 'white' }}
              />
            </IconButton>
          </Box>
        ) : (
          <Box className="mic-btn">
            <IconButton onClick={handleRec} style={{ borderRedius: '13px', border: '1px solid white' }}>
              <MicIcon sx={{ fontSize: '50px', color: 'white' }} />
            </IconButton>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton sx={{ position: 'fixed', bottom: '0', width: '320px' }} onClick={handleOpen}>
          <ExpandLessRoundedIcon style={{ display: open ? 'none' : undefined, color: 'white' }} />
        </IconButton>
      </Box>
      {ttsLoad && ttsLoadingPage}
      <Slide direction="up" in={open} mountOnEnter>
        {chatBox}
      </Slide>
    </div>
  )
}

export default VoiceMode
