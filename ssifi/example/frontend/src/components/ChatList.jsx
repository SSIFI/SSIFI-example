import React, { useRef, useEffect } from 'react'
import { Typography } from '@mui/material'
import '../style/ChatList.css'

const ChatList = props => {
  const scrollRef = useRef()

  useEffect(() => {
    scrollToBottom()
  }, [props.chatList])

  const scrollToBottom = () => {
    const { scrollHeight, clientHeight } = scrollRef.current
    scrollRef.current.scrollTop = scrollHeight - clientHeight
  }

  return (
    <div
      className="chatList"
      ref={scrollRef}
      style={{ ...props.style, overflow: 'auto', display: 'flex', flexDirection: 'column' }}
    >
      {props.chatList.map((chatItem, index) => {
        return (
          <div
            key={index}
            style={
              chatItem.id === 'me'
                ? { display: 'flex', justifyContent: 'flex-start' }
                : { display: 'flex', justifyContent: 'flex-end' }
            }
          >
            <div key={index} className={chatItem.id === 'me' ? 'myChat' : 'ssifiChat'}>
              <Typography className="chatContent" style={{ color: 'white' }}>
                {chatItem.chat}
              </Typography>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ChatList
