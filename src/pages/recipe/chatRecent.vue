<template>
  <v-app>
    <v-app-bar app color="red" dark>
      <v-spacer></v-spacer>
      <v-app-bar-title>
        <div align="center" :style="{fontSize: 'xx-large', fontFamily: 'Comic Sans MS'} ">최근 답변 {{$route.params.id}}</div>
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
          <VBtn color="info" variant="tonal" :to="{path: 'chatfixed'}" class="mr-3">
            고정 답변
            <VIcon end icon="mdi-heart"/>
          </VBtn>
        </v-row>
        <v-row>
          <v-simple-table style="width: 1500px">
            <thead>
              <tr style="font-weight: bolder;">
                  <td style="width: 200px; background-color: #E2EFDA; color: #000000;">번호</td>
                  <td style="width: 800px; background-color: #E2EFDA; color: #000000;">검색어</td>
                  <td style="width: 400px; background-color: #E2EFDA; color: #000000;">작성시간</td>
                  <td style="width: 200px; background-color: #E2EFDA; color: #000000;">고정</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginatedList" :key="item.chat_num">
                <td>{{item.chat_num}}</td>
                <td  @click="movetocontent(item.chat_num)">{{item.chat_title}}</td>
                <td>{{item.chat_date}}</td>
                <td @click="toggleChatFixChange(item)">
                  <v-btn @click.stop="toggleChatFixChange(item)" icon color="green">
                    <v-icon>{{ item.chat_fix === 'N' ? 'mdi-pin' : 'mdi-done' }}</v-icon>
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
</v-row>
      </v-container>

    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
export default {
  data() {
  return {
    contentlist: [], 
    cnt: 0, 
    currentPage: 1, 
    itemsPerPage: 10, 
    memEmail: '', 
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

axios.get(`http://localhost:8888/chatcount?memEmail=${this.memEmail}`, {
  params: {
    boardnum: this.$route.params.id,
  }
})
.then(response => {
  this.cnt = response.data; 
})
.catch(error => {
  alert(error);
});
  },
  methods: {
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
    movetochatfixed() {
      window.location.href = '/recipe/chatfixed';
    },
    movetocontent(chat_num) {
  this.$router.push({ path: '/recipe/chatdetail', query: { chat_num: chat_num } });
    },
    movetopreviouspage() {
    if (this.currentPage > 1) {
      this.currentPage--;
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