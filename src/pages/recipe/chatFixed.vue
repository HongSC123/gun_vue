<template>
    <v-app>
      <v-app-bar app color="red" dark>
        <v-spacer></v-spacer>
        <v-app-bar-title>
          <div align="center" :style="{fontSize: 'xx-large', fontFamily: 'Comic Sans MS'} ">고정 답변 {{$route.params.id}}</div>
        </v-app-bar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-main>
        <v-container>
          <v-row justify="center">
            <VBtn color="primary" variant="tonal" :to="{path: '/'}" class="mr-3">
              메인화면으로
              <VIcon end icon="mdi-home"/>
            </VBtn>
            <VBtn color="success" variant="tonal" :to="{path: 'chatrecipe'}" class="mr-3">
              레시피 검색
              <VIcon end icon="mdi-magnify-plus"/>
            </VBtn>
            <VBtn color="secondary" variant="tonal" :to="{path: 'chatrecent'}" class="mr-3">
              최근 답변
              <VIcon end icon="mdi-history"/>
            </VBtn>
          </v-row>
          <v-row>
            <v-simple-table style="width: 1500px">
              <thead>
                <tr style="font-weight: bolder;">
                    <td style="width: 200px; background-color: #d437e2; color: #fff3f3;">번호</td>
                    <td style="width: 800px; background-color: #d437e2; color: #fff3f3;">검색어</td>
                    <td style="width: 400px; background-color: #d437e2; color: #fff3f3;">작성시간</td>
                    <td style="width: 200px; background-color: #d437e2; color: #fff3f3;">고정해제</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in paginatedList" :key="item.chat_num" @click="movetocontent(item.chat_num)">
                    <td v-if="item.chat_fix === 'Y'">{{ item.chat_num }}</td>
                    <td v-if="item.chat_fix === 'Y'">{{ item.chat_title }}</td>
                    <td v-if="item.chat_fix === 'Y'">{{ item.chat_date }}</td>
                    <td v-if="item.chat_fix === 'Y'" @click="toggleChatFixChange(item)">
                      <v-btn @click.stop="toggleChatFixChange(item)" icon>
                        <v-icon>{{ item.chat_fix === 'Y' ? 'mdi-done' : 'mdi-clear' }}</v-icon>
                      </v-btn>
                    </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-row>
          <v-row style="padding-top: 20px;">
            <v-spacer/>
            <v-btn width="10px" @click="movetopreviouspage"> 
              <v-icon color="red" large> mdi-arrow-left-bold-outline </v-icon>
            </v-btn><br>

            <div v-for="(page, index) in totalpage" :key="page">
              <span v-if="shouldDisplayPage(page)" class="page-number" @click="moveToPage(page)">
                {{ page }}
              </span>
              <span v-if="shouldDisplayPage(page) && index !== totalpage.length - 1" class="space-between"></span>
            </div>

            <v-btn width="10px" @click="movetonextpage"> 
              <v-icon color="red" large> mdi-arrow-right-bold-outline </v-icon>
            </v-btn>
            <v-spacer/>
            <v-col cols="12">
              <input type="search" v-model="searchTerm" placeholder="검색어를 입력하세요" class="v-text-field__input" />
              <v-btn @click="findtitlekeyword">검색</v-btn> <!-- 검색 버튼 클릭 시 search 메소드 호출 -->
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
<<<<<<< HEAD
  import axios from '@axios';
=======
  import axios from 'axios';
>>>>>>> 4ddf6d525558b041793b3298910cbbf706789299
  
  export default {
    data() {
  return {
    contentlist: [], 
<<<<<<< HEAD
    cnt: 0, 
    currentPage: 1, 
    itemsPerPage: 10, 
    memEmail: '', 
    searchTerm: '', // 검색어 상태 값
    searchResults: [] // 검색 결과를 담을 배열
  };
    },
    computed: {
      totalpage() {
    if (this.cnt === 0) {
      return 1;
    } else {
      return Math.ceil(this.cnt / this.itemsPerPage);
    }
  },
  paginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.contentlist.slice(startIndex, endIndex);
  },
=======
    cnt: 0,
    currentPage: 1, 
    itemsPerPage: 10, 
  };
    },
    computed: {
  totalpage() {
        if (this.cnt === 0) {
          return 1;
        } else {
          return Math.ceil(this.cnt / this.itemsPerPage);
        }
      },
      paginatedList() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
          const endIndex = startIndex + this.itemsPerPage;
          return this.contentlist.slice(startIndex, endIndex);
      },
>>>>>>> 4ddf6d525558b041793b3298910cbbf706789299
    },
    mounted() {
    this.memEmail = sessionStorage.getItem('memEmail'); // memEmail 변수 할당 수정
    console.log('memEmail:', this.memEmail);
  const id = this.$route.params.id;
  axios.get(`http://localhost:8888/chatrecent?memEmail=${this.memEmail}`, {
    params: {
      boardnum: this.$route.params.id,
      page: this.$route.query.page,
    }
  })
  .then(response => {
    this.contentlist = response.data; 
  })
  .catch(error => {
    alert(error);
  });

<<<<<<< HEAD
  axios.get(`http://localhost:8888/chatycount?memEmail=${this.memEmail}`, {
=======
axios.get(`http://localhost:8888/chatYcount?memEmail=${this.memEmail}`, {
>>>>>>> 4ddf6d525558b041793b3298910cbbf706789299
  params: {
    boardnum: this.$route.params.id,
  }
})
<<<<<<< HEAD
.then(response => {
  this.cnt = response.data; 
})
.catch(error => {
  alert(error);
});
=======
>>>>>>> 4ddf6d525558b041793b3298910cbbf706789299
    },
    methods: {
    async findtitlekeyword() {
  console.log('Search method called!');
  console.log('Search Term:', this.searchTerm);
  console.log('Email:', this.memEmail);
  
  try {
    const response = await axios.get(`http://localhost:8888/find`, {
      params: {
        searchTerm: this.searchTerm,
        memEmail: this.memEmail,
      }
    });

    this.contentlist = response.data;
    console.log('응답 데이터:', response.data);
  } catch (error) {
    console.error('검색 요청 에러:', error);
  }
},
      async toggleChatFixChange(item) {
    try {
      const newFixStatus = item.chat_fix === 'Y' ? 'N' : 'Y'; 
      const response = await fetch(`/chatupdate/${item.chat_num}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: newFixStatus 
      });

      if (response.ok) {
       
        item.chat_fix = newFixStatus; 
      } else {
        throw new Error('업데이트 실패');
      }
    } catch (error) {
      console.error('업데이트 에러:', error);
    }
  },
      movetomain() {
        window.location.href="/"
      },
      movetochatrecipe() {
        window.location.href = '/recipe/chatrecipe';
      },
      movetochatrecent() {
        window.location.href = '/recipe/chatrecent';
      },
      movetocontent(chat_num) {
        this.$router.push({ path: '/recipe/chatdetail', query: { chat_num: chat_num } });
      },
      movetopreviouspage() {
    if (this.currentPage > 1) {
<<<<<<< HEAD
      this.currentPage--;
=======
      this.currentPage--; 
>>>>>>> 4ddf6d525558b041793b3298910cbbf706789299
      this.$router.push({ query: { page: this.currentPage } }); 
    } else {
      alert('첫번째 페이지입니다!');
    }
  },
  movetonextpage() {
    if (this.currentPage < this.totalpage) {
      this.currentPage++; 
      this.$router.push({ query: { page: this.currentPage } }); 
    } else {
      alert('마지막 페이지입니다!');
    }
  },
  shouldDisplayPage(page) {
      const maxPageItems = 5; 
      const currentPage = this.currentPage;
      const totalPages = this.totalpage;

      if (totalPages <= maxPageItems) {
        return true; 
      }

      const halfMax = Math.floor(maxPageItems / 2);
      const firstPage = Math.max(currentPage - halfMax, 1);
      const lastPage = Math.min(firstPage + maxPageItems - 1, totalPages);

      return page >= firstPage && page <= lastPage;
    },

    moveToPage(page) {
    this.currentPage = page; 
    this.$router.push({ query: { page: page } }); 
  },
  },
          async toggleChatFixStatus(item) {
      if (item.chat_fix === 'Y') {
        try {
          const newFixStatus = item.chat_fix === 'Y' ? 'N' : 'Y'; 
          const response = await fetch(`/chatupdate/${item.chat_num}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: newFixStatus 
          });

          if (response.ok) {
            item.chat_fix = newFixStatus; 
                    } else {
            throw new Error('업데이트 실패');
          }
        } catch (error) {
          console.error('업데이트 에러:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .tr,td {
    border: 1px solid;
    text-align: center;
  }
  .page-number {
  margin-left : 5px;
  margin-right: 5px; 
}
.space-between {
  display: inline-block;
  width: 10px; 
}
  </style>