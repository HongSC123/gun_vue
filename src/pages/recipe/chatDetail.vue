<template>
    <v-app>
      <v-app-bar app color="red" dark>
        <v-spacer></v-spacer>
        <v-app-bar-title>
          <div align="center" :style="{fontSize:'xx-large'} ">상세 레시피 {{$route.params.id}}</div>
        </v-app-bar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-main>
        <v-container>
          <v-row>
            <v-col cols="12" md="1">
              <v-btn color="cyan" @click="movetomain"
                     :style="{height:'50px', width:'90px', fontWeight:'bold', fontSize:'large'}">홈으로</v-btn>
            </v-col>
            <v-col cols="12" md="10">
              <v-card>
                <div class="chat-info">
                  <p>번호: {{ chat_num }}</p>
                  <p>작성일: {{ chat_date }}</p>
                  <p>고정여부: {{ chat_fix }}</p>
                  <p>제목: {{ chat_title }}</p>
                  <p>내용: {{ chat_content }}</p>
                </div>
                <v-row justify="center">
                  <v-btn width="100px" style="margin-left: 470px; margin-bottom:20px;" @click="moveback">뒤로가기</v-btn>
                  <v-btn width="100px" style="margin-left: 30px; margin-bottom:20px;" @click.stop="toggleChatFixChange(item)">고정여부변경</v-btn>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="12" md="1"/>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data(){
      return {
        chat_num: '',  //번호
        chat_date: '',		// 작성자
        chat_title: '',		// 글 제목
        chat_content: '',			// 글 내용
        chat_fix: '',		// 고정 여부
      }
    },
    mounted() {
      const chat_num = this.$route.query.chat_num; // chat_num
      axios({
  url: `http://localhost:8888/recipe/chatdetail?chat_num=${chat_num}`,
  method: "GET",
        // params: {
        //   chat_num: this.$route.query.id
        // }
      }).then(res => {
        // 받아온 데이터를 변수에 할당합니다.
        this.chat_num = res.data.chat_num;
        this.chat_date = res.data.chat_date;
        this.chat_title = res.data.chat_title;
        this.chat_content = res.data.chat_content;
        this.chat_fix = res.data.chat_fix;
      }).catch(err => {
        alert(err);
      });
    },
    methods: {
      moveback() {
        window.history.back();	// window.history.back()을 통해 뒤로가기
      },
      async toggleChatFixChange() {
      try {
        const newFixStatus = this.chat_fix === 'Y' ? 'N' : 'Y'; // chat_fix 값을 반전시킴
        const response = await fetch(`/chatupdate/${this.chat_num}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: newFixStatus // 변경된 상태를 JSON 형태로 전송
        });

        if (response.ok) {
          // 서버로부터 응답이 성공적으로 온 경우에만 로컬 데이터를 업데이트합니다.
          this.chat_fix = newFixStatus; // 상태를 업데이트
        } else {
          throw new Error('업데이트 실패');
        }
      } catch (error) {
        console.error('업데이트 에러:', error);
      }
    },
      movetomain() {
        window.location.href='/';
      },
    },
  };
  </script>
  <style>
  .chat-info {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
  }
  .chat-info p {
    margin: 5px 0;
  }
  .chat-info p:first-child {
    font-weight: bold;
  }
  </style>