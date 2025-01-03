import React, { useState, useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useRecoilState } from 'recoil'
import Chat from '../components/chat/Chat'
import { memberInfo } from '../state/authState'
import ChatRoomsList from '../components/chat/ChatRoomsList'
import { getChatRooms, getPreMessages } from '../services/chatApi'

const ChatPage: React.FC = () => {
  const [auth] = useRecoilState(memberInfo)
  const [messages, setMessages] = useState<any[]>([])
  const [sentMessages, setSentMessages] = useState<any[]>([])
  const [activeRoom, setActiveRoom] = useState<number | null>(null) 
  const [chatRooms, setChatRooms] = useState<any[]>([])
  const clientRef = useRef<Client | null>(null)

  // 채팅방 목록 조회
  const fetchChatRoomsData = async () => {
    if (!auth.accessToken) return
    const data = await getChatRooms(auth.accessToken)
    const rooms = data.result.map((room: any) => ({
        id: room.roomId,
        name: room.name,
    }))
        setChatRooms(rooms)
  }

  // 이전 메시지 조회
  const fetchMessagesData = async () => {
    if (!auth.accessToken || activeRoom === null || activeRoom <= 0) return
    const data = await getPreMessages(auth.accessToken, activeRoom)
    const fetchedMessages = data.result.map((response: any) => ({
        id: response.chatId,
        content: response.message,
        senderId: response.author.id,
        profileImage: response.author.profileImage,
        nickname: response.author.nickname,
        createdAt: response.createdAt,
    }))
    setMessages(fetchedMessages)
  }

  useEffect(() => {
    if (auth.accessToken) {
      fetchChatRoomsData()
    }
  }, [auth.accessToken])

  useEffect(() => {
    if (!auth.accessToken || activeRoom === null) return
    fetchMessagesData()

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(`${process.env.REACT_APP_SEVER_URL}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
      onConnect: () => {
        console.log('STOMP 연결 성공')

        stompClient.subscribe(`/sub/chat.${activeRoom}`, (message) => {
          console.log('Received message:', message.body)
          try {
            const newMessage = JSON.parse(message.body)
            setMessages((prevMessages) => addMessageIfUnique(prevMessages, newMessage))
          } catch (error) {
            console.error('Error parsing message:', error)
          }
        })
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        alert("세션이 만료되었습니다.");
        window.location.href = "/";
      },

      onDisconnect: () => {
        console.log('STOMP connection disconnected')
      },
    })

    clientRef.current = stompClient
    stompClient.activate()

    return () => {
      stompClient.deactivate()
    }
  }, [auth.accessToken, activeRoom])

  const addMessageIfUnique = (prevMessages: any[], newMessage: any) => {
    if (!prevMessages.some((msg) => msg.id === newMessage.chatId)) {
      return [...prevMessages, {
        id: newMessage.chatId,
        content: newMessage.message,
        senderId: newMessage.author.id,
        profileImage: newMessage.author.profileImage,
        nickname: newMessage.author.nickname,
        createdAt: newMessage.createdAt,
      }]
    }
    return prevMessages
  }
  const handleSendMessage = (content: string) => {
    if (clientRef.current && content.trim()) {
        try {
            const newMessage = { content };
            setSentMessages((prevSent) => [...prevSent, newMessage]);
      
            // STOMP 메시지 발행
            clientRef.current.publish({
              destination: `/pub/chat.${activeRoom}`,
              body: JSON.stringify({
                message: content,
                roomId: activeRoom,
              }),
              headers: {
                Authorization: `Bearer ${auth.accessToken}`,
              },
            });
        } catch (error: any) {
            if(error.response?.status === 401) {
                alert('세션이 만료되었습니다.');
                window.location.href = '/';
            }
        }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row h-screen">
        <ChatRoomsList
          chatRooms={chatRooms}
          activeRoom={activeRoom !== null ? activeRoom : -1}
          setActiveRoom={setActiveRoom}
        />

        {activeRoom !== null ? (
          <div className="w-full lg:w-2/3 xl:w-3/4 bg-gray-50 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <Chat
                currentUserId={auth.id}
                messages={messages}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        ) : (
          <div className="w-full lg:w-2/3 xl:w-3/4 bg-gray-50 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">채팅방을 선택해주세요.</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-center text-gray-500">채팅방을 선택하면 대화가 시작됩니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage
