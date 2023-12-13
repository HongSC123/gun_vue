<template>

      <v-container>
     <v-row justify="center">
            <VBtn color="primary" variant="tonal" :to="{path: '/'}" class="mr-3">
              메인화면으로
              <VIcon end icon="mdi-home"/>
            </VBtn>
            <VBtn color="secondary" variant="tonal" :to="{path: 'chatrecent'}" class="mr-3">
              최근 답변
              <VIcon end icon="mdi-history"/>
            </VBtn>
            <VBtn color="info" variant="tonal" :to="{path: 'chatfixed'}" class="mr-3">
              고정 답변
              <VIcon end icon="mdi-heart"/>
            </VBtn>
          </v-row>
        </v-container>
    <div id="chat-container">
      <div id="chat-messages">
        <div v-for="(msg, index) in chatHistory" :key="index" :class="msg.isUserMessage ? 'user-message' : 'ai-message'">
          {{ msg.sender }} : {{ msg.message }}
        </div>
      </div>
      <div id="user-input">
        <input type="text" placeholder="레시피를 검색하고 싶은 요리 이름을 적어주세요!" v-model="userMessage" />
        <button @click="sendMessage">전송</button>
      </div>
    </div>
    <div id="user-input">
      <input
        v-model="userMessage"
        type="text"
        placeholder="레시피를 검색하고 싶은 요리 이름을 적어주세요!"
      >
      <button @click="sendMessage">
        전송
      </button>
    </div>
  </div>
</template>
  
    
<script>
import axios from '@axios';
  

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
        const response = await fetch(this.apiEndpoint, requestOptions)
        const data = await response.json()
        
        return data.choices[0].message.content
      } catch (error) {
        console.error('OpenAI API 호출 중 오류 발생:', error)
        
        return 'OpenAI API 호출 중 오류 발생'
      }
    },
    async sendMessage() {
      let message = this.userMessage.trim()
  
      if (message.length === 0) return
  

        const isRecipeRelated = /레시피|요리법/.test(message) || /^[가-힣\s]+$/.test(message);
        
        const memEmail = sessionStorage.getItem('memEmail'); 

        if (isRecipeRelated) {
          this.userMessage = '';

          let userQuery = message;


  
        if (!/레시피|요리법/.test(message)) {
          const searchKeyword = message + ' 계량까지 한 레시피와 1인분 열량을 알려줘'

          this.chatHistory.unshift({ sender: '나', content: searchKeyword, message: message, isUserMessage: true })
          userQuery = message
          message = searchKeyword
        }
  
        const aiResponse = await this.fetchAIResponse(message)

        this.addMessage('라따뚜AI', aiResponse, false)
  

          
          if (aiResponse.match(/\d+/)) {
        try {
          const dataToSend = {
              chat_title: userQuery,
              chat_content: aiResponse,
              memEmail: memEmail,
            };

            const response = await axios.post('http://localhost:8888/chatinsert', dataToSend);
            console.log('백엔드로 데이터 전송 성공:', response.data, dataToSend);
          } catch (error) {
            console.error('백엔드로 데이터 전송 실패:', error);

          }
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
  },
}
</script>
    
    <style>
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    block-size: 100vh;
  }

  .message {
    padding: 10px;
    background-color: #e6e6e6;
    border-block-start: 1px solid #ccc;
    margin-block-start: 5px;
  }

  #chat-container {
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    background-image: url("../../assets/images/bg.jpeg");
    background-position: center;
    background-size: cover;
    block-size: 700px;
  }

  .message {
    padding: 10px;
    background-color: #e6e6e6;
    border-block-start: 1px solid #ccc;
    margin-block-start: 5px;
  }

  #chat-container {
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    background-image: url("../../assets/images/bg.jpeg");
    background-position: center; /* 배경 이미지의 위치를 가운데로 정렬 */
    background-size: cover; /* 배경 이미지를 요소에 맞게 조절 */

    /* width: 700px; */
    block-size: 700px;

    /* 다른 배경 속성들을 추가할 수 있음 */
  }

  #chat-messages {
    display: flex;
    flex: 1;
    flex-direction: column-reverse;
    padding: 10px;
    overflow-y: auto;
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
    cursor: pointer;
    padding-block: 10px;
    padding-inline: 15px;
  }

  .user-message {
    align-self: flex-end;
    padding: 10px;
    border-radius: 15px;
    background: linear-gradient(to right, #fff176, #ffd700);
    color: black;
    margin-block-end: 10px;
    max-inline-size: 70%;
  }

  .ai-message {
    align-self: flex-start;
    padding: 10px;
    border-radius: 15px;
    background: linear-gradient(to right, #53a157, #32cd32);
    color: white;
    margin-block-end: 10px;
    max-inline-size: 70%;
  }
    </style>
