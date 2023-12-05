<template>
  <div id="chat-container">
    <div id="chat-messages">
      <div v-for="(msg, index) in chatHistory" :key="index" :class="msg.isUserMessage ? 'user-message' : 'ai-message'">
        {{ msg.sender }}: {{ msg.message }}
      </div>
    </div>
    <div id="user-input">
      <input type="text" placeholder="레시피를 검색하고 싶은 요리 이름을 적어주세요!" v-model="userMessage" @keydown.enter="sendMessage" />
      <button @click="sendMessage">전송</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      userMessage: '',
      chatHistory: [],
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
    // console.log('API 응답:', response); // 응답 확인용 로그
    const data = await response.json();
    // console.log('API 응답 데이터:', data); // 응답 데이터 확인용 로그

        if (data && Array.isArray(data.choices) && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
          const aiResponse = data.choices[0].message.content;
          return aiResponse;
        } else {
          throw new Error('Invalid or empty API response');
        }
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
        this.userMessage = '';

        if (!/레시피|요리법/.test(message)) {
          const searchKeyword = message + ' 계량까지 한 레시피와 1인분 열량을 알려줘';
          this.chatHistory.unshift({ sender: '나', content: searchKeyword, message: message, isUserMessage: true });
          message = searchKeyword;
        }

        try {
          const aiResponse = await this.fetchAIResponse(message);

          if (aiResponse !== 'OpenAI API 호출 중 오류 발생') {
            this.addMessage('라따뚜AI', aiResponse, false);
            //백엔드로 전송
            if (aiResponse.match(/[a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z]+/)) {
    try {
        const response = await axios.post('http://localhost:8888/insert', {
            data: aiResponse // 전송할 데이터
        });
        console.log('백엔드로 데이터 전송:', response.data);
    } catch (error) {
        console.error('백엔드로 전송 실패:', error);
    }
}
            
          } else {
            this.addMessage('나', message, true);
            this.addMessage('라따뚜AI', '죄송합니다. API 호출 중 오류가 발생했습니다.', false);
          }
        } catch (error) {
          console.error('API 요청 중 오류:', error);
          this.addMessage('나', message, true);
          this.addMessage('라따뚜AI', '죄송합니다. API 호출 중 오류가 발생했습니다.', false);
        }
      } else {
        this.addMessage('나', message, true);
        this.addMessage('라따뚜AI', '죄송합니다. 레시피 관련 질문이나 음식 이름이 아닌 경우, 한글로 검색하지 않으신 경우엔 답변드리지 못합니다.', false);
      }
      this.userMessage = '';
    },
  },
  mounted() {
    this.addMessage('라따뚜AI', '안녕하세요! 어떤 레시피를 검색하고 싶으세요? 음식 이름만 말해주시면 조리법과 1인분 열량을 알려드리겠습니다!');
    document.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
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