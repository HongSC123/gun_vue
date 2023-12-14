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
    <input type="search" placeholder="레시피를 검색하고 싶은 요리 이름을 적어주세요!" v-model="userMessage" />
    <button @click="sendMessage">전송</button>
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
      const memEmail = sessionStorage.getItem('memEmail'); 

      if (isRecipeRelated) {
        this.userMessage = '';

        let userQuery = message;

        if (!/레시피|요리법/.test(message)) {
          const searchKeyword = message + ' 계량까지 한 레시피와 1인분 열량을 알려줘';
          this.chatHistory.unshift({ sender: '나', content: searchKeyword, message : message, isUserMessage: true });
          userQuery = message;
          message = searchKeyword;
        }

        const aiResponse = await this.fetchAIResponse(message);
        this.addMessage('라따뚜AI', aiResponse, false);

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
      } else if (message.toLowerCase() === '냉장고') {
        try {
          const fridgeResponse = await axios.post('http://localhost:8888/fridgeInfo', {
            memEmail: memEmail,
            message: `${message} 넣은 다이어트 레시피 알려줘`
          });

          const recommendedRecipe = this.processFridgeInfo(fridgeResponse.data);
          this.addMessage('라따뚜AI', recommendedRecipe, false);
        } catch (error) {
          console.error('냉장고 정보를 가져오는 중 에러:', error);
        }

      } else {
        this.addMessage('나', message, true);
        this.addMessage('라따뚜AI', '죄송합니다. 레시피 관련 질문이나 음식 이름이 아닌 경우, 한글로 검색하지 않으신 경우엔 답변드리지 못합니다.', false);
      }
      this.userMessage = '';
    },
    processFridgeInfo(fridgeData) {
      // 받아온 냉장고 정보를 처리하고, 추천 레시피를 반환하는 함수
      // 여기서는 받은 데이터를 가공하여 추천 레시피를 생성하는 과정을 구현합니다.
      // 예시: 받아온 데이터를 기반으로 추천 레시피 생성
      const recommendedRecipe = '냉장고에 있는 식재료를 활용한 다이어트 레시피 추천: ...';
      return recommendedRecipe;
    }
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
  height: 700px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  background-image: url('../../assets/images/bg.jpeg');
  background-size: cover; 
  background-position: center; 
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
  background: linear-gradient(to right, #FFF176, #FFD700); 
  border-radius: 15px; 
  padding: 10px; 
  margin-bottom: 10px; 
  color: black;
  max-width: 70%;
  align-self: flex-end; 
}

.ai-message {
  background: linear-gradient(to right, #53a157, #32CD32);
  border-radius: 15px; 
  padding: 10px; 
  margin-bottom: 10px;
  color: white;
  max-width: 70%;
  align-self: flex-start;
}
</style>