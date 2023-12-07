@@ 원본

<template>
    <div id="chat-container">
      <div id="chat-messages">
        <!-- 메시지를 표시할 영역 -->
        <div v-for="(msg, index) in chatHistory" :key="index" :class="msg.isUserMessage ? 'user-message' : 'ai-message'">
          {{ msg.sender }} : {{ msg.message }}
        </div>
      </div>
      <div id="user-input">
        <input type="text" placeholder="레시피를 검색하고 싶은 요리 이름을 적어주세요!" v-model="userMessage" />
        <button @click="sendMessage">전송</button>
      </div>
    </div>
  </template>
  
    
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        userMessage: '', // 사용자 입력 메시지를 담을 데이터 속성
        chatHistory: [], // 채팅 기록을 담을 배열
        apiKey: "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",
        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
      };
    },
    methods: {
      handleKeyDown(event) {
        if (event.key === 'Enter') {
          this.sendMessage();
        }
      },
      async addMessage(sender, message, isUserMessage) {
        // 메시지를 채팅 기록에 추가하는 메서드
        this.chatHistory.unshift({ sender, message, isUserMessage });
      },
      async fetchAIResponse(prompt) {
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0.5,
            stop: ["Human", "하지만"],
          }),
        };
        
  
        try {
          const response = await fetch(this.apiEndpoint, requestOptions);
          const data = await response.json();
          const aiResponse = data.choices[0].message.content;
          return aiResponse;
        } catch (error) {
          console.error('OpenAI API 호출 중 오류 발생:', error);
          return 'OpenAI API 호출 중 오류 발생';
        }
      },
      async sendMessage() {
        let message = this.userMessage.trim();
  
        if (message.length === 0) return;
  
        const isRecipeRelated = /레시피|요리법/.test(message) || /^[가-힣\s]+$/.test(message);
  
        if (isRecipeRelated) {
          // this.addMessage('나', message, true);
          this.userMessage = '';

          let userQuery = message; // 사용자의 검색어로 할당

  
          if (!/레시피|요리법/.test(message)) {
            const searchKeyword = message + ' 계량까지 한 레시피와 1인분 열량을 알려줘';
            this.chatHistory.unshift({ sender: '나', content: searchKeyword, message : message, isUserMessage: true });
            userQuery = message;
            message = searchKeyword;
          }
  
          const aiResponse = await this.fetchAIResponse(message);
          this.addMessage('라따뚜AI', aiResponse, false);
  
           // 숫자를 포함하는지 확인
          if (aiResponse.match(/\d+/)) {
        // 데이터를 Java 백엔드로 전송
        try {
          const dataToSend = {
              chat_title: userQuery,
              chat_content: aiResponse
            };

            const response = await axios.post('http://localhost:8888/chatinsert', dataToSend);
            console.log('Data sent to Java backend:', response.data, dataToSend);
          } catch (error) {
            console.error('Error sending data to Java backend:', error);
          }
      }
        } else {
          this.addMessage('나', message, true);
          this.addMessage('라따뚜AI', '죄송합니다. 레시피 관련 질문이나 음식 이름이 아닌 경우, 한글로 검색하지 않으신 경우엔 답변드리지 못합니다.', false);
        }
        this.userMessage = '';
      },
    },
    mounted() {
      // 초기 화면에 인삿말 추가
      this.addMessage('라따뚜AI', '안녕하세요! 어떤 레시피를 검색하고 싶으세요? 음식 이름만 말해주시면 조리법과 1인분 열량을 알려드리겠습니다!');
      // Enter 키 이벤트를 추가합니다.
      document.addEventListener('keydown', this.handleKeyDown);
    },
    beforeUnmount() {
      // 컴포넌트가 삭제되기 전에 이벤트 리스너를 해제합니다.
      document.removeEventListener('keydown', this.handleKeyDown);
    },
  };
  </script>
    
    <style>
    /* 스타일 영역에 CSS를 추가할 수 있습니다. */
    body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
          }
          .message {
              border-top: 1px solid #ccc;
              padding: 10px;
              margin-top: 5px;
              background-color: #e6e6e6;
          }
          #chat-container {
      /* width: 700px; */
      height: 700px;
      display: flex;
      flex-direction: column;
      border: 1px solid #ccc;
      background-image: url('../../assets/images/bg3.jpeg');
      background-size: cover; /* 배경 이미지를 요소에 맞게 조절 */
      background-position: center; /* 배경 이미지의 위치를 가운데로 정렬 */
      /* 다른 배경 속성들을 추가할 수 있음 */
  }
          #chat-messages {
              flex: 1;
              overflow-y: auto;
              padding: 10px;
              display: flex;
              flex-direction: column-reverse;
          }
          #user-input {
              display: flex;
              padding: 10px;
  
          }
          #user-input input {
              flex: 1;
              padding: 10px;
              outline: none;
          }
          #user-input button {
              border: none;
              background-color: #1e88e5;
              color: white;
              padding: 10px 15px;
              cursor: pointer;
          }
  .user-message {
      background: linear-gradient(to right, #FFF176, #FFD700); /* 노란색 배경 */
      border-radius: 15px; /* 말풍선을 둥글게 만듦 */
      padding: 10px; /* 내용과 테두리 간격 */
      margin-bottom: 10px; /* 아래 여백 추가 */
      color: black;
      max-width: 70%; /* 최대 너비 설정 */
      align-self: flex-end; /* 사용자 메시지는 왼쪽으로 정렬 */
  }
  
  .ai-message {
      background: linear-gradient(to right, #53a157, #32CD32); /* 초록색 배경 */
      border-radius: 15px; /* 말풍선을 둥글게 만듦 */
      padding: 10px; /* 내용과 테두리 간격 */
      margin-bottom: 10px; /* 아래 여백 추가 */
      color: white;
      max-width: 70%; /* 최대 너비 설정 */
      align-self: flex-start; /* AI 메시지는 오른쪽으로 정렬 */
  }
    </style>