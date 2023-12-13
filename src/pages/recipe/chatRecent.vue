<template>
  <v-app>
    <v-app-bar app color="red" dark>
      <v-spacer></v-spacer>
      <v-app-bar-title>
        <div align="center" :style="{fontSize: 'xx-large', fontFamily: 'Comic Sans MS'} ">최근 답변 {{$route.params.id}}</div>
        <!-- params를 받아올 때는 $route.params.id, 
                query를 받아올 때는 $route.query.id 이런 형식으로 받아옴 -->
      </v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row justify="center">
          <VBtn
            color="primary"
            variant="tonal"
            :to="{path: '/'}"
            class="mr-3"
          >
            메인화면으로
            <VIcon
              end
              icon="mdi-home"
            />
          </VBtn>
          <VBtn
            color="success"
            variant="tonal"
            :to="{path: 'chatrecipe'}"
            class="mr-3"
          >
            레시피 검색
            <VIcon
              end
              icon="mdi-magnify-plus"
            />
          </VBtn>
          <VBtn
            color="info"
            variant="tonal"
            :to="{path: 'chatfixed'}"
            class="mr-3"
          >
            고정 답변
            <VIcon
              end
              icon="mdi-heart"
            />
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
  <v-btn width="10px" @click="movetopreviouspage"> <!-- 이전페이지로 이동 -->
    <v-icon color="red" large> mdi-arrow-left-bold-outline </v-icon>
  </v-btn><br>

  <!-- 페이지 버튼 표시 -->
  <div v-for="(page, index) in totalpage" :key="page">
    <span v-if="shouldDisplayPage(page)" class="page-number" @click="moveToPage(page)">
      {{ page }}
    </span>
    <span v-if="shouldDisplayPage(page) && index !== totalpage.length - 1" class="space-between"></span>
  </div>

  <!-- 페이지 정보 표시 -->
  <!-- <div style="display: flex; align-items: center;">
    <div style="margin-top: 5px; margin-right: 10px; margin-left: 10px;">
      {{ currentPage }} / {{ totalpage }} page 
    </div>
  </div> -->

  <v-btn width="10px" @click="movetonextpage"> <!-- 다음페이지로 이동 -->
    <v-icon color="red" large> mdi-arrow-right-bold-outline </v-icon>
  </v-btn>
  <v-spacer/>
</v-row>
      </v-container>

    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'; // backend와 axios 통신을 위해 필요

export default {
  data() {
  return {
    contentlist: [], // 현재 게시판과 페이지에 맞는 글 리스트들
    cnt: 0, // 현재 게시판의 총 글 개수
    currentPage: 1, // 현재 페이지 번호
    itemsPerPage: 10, // 페이지 당 아이템 수
  };
},
computed: {
  totalpage() {
    // 총 페이지 수 계산
    if (this.cnt === 0) {
      return 1;
    } else {
      return Math.ceil(this.cnt / this.itemsPerPage);
    }
  },
  paginatedList() {
    // 현재 페이지에 따라 contentlist를 필터링하여 반환
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.contentlist.slice(startIndex, endIndex);
  },
},
  mounted() {	// mounted는 페이지가 켜질때 실행됨, 페이지가 켜질때 글 리스트들을 db에서 불러옴
    // $route.params.id로 동적 세그먼트의 id 값을 받아옵니다.
    const id = this.$route.params.id;
    axios.get('http://localhost:8888/chatrecent', {
  params: {
    boardnum: this.$route.params.id,
    page: this.$route.query.page,
  }
})
.then(response => {
  this.contentlist = response.data; // contentlist에 응답 데이터 할당
})
.catch(error => {
  alert(error); // 에러 처리
});

// 위와 같은 방식으로 cnt 값 받아오기
axios.get('http://localhost:8888/chatcount', {
  params: {
    boardnum: this.$route.params.id,
  }
})
.then(response => {
  this.cnt = response.data; // cnt에 응답 데이터 할당
})
.catch(error => {
  alert(error); // 에러 처리
});
  },
  methods: {
    async toggleChatFixChange(item) {
    try {
      const newFixStatus = item.chat_fix === 'Y' ? 'N' : 'Y'; // chat_fix 값을 반전시킴
      const response = await fetch(`/chatupdate/${item.chat_num}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: newFixStatus // 변경된 상태를 JSON 형태로 전송
      });

      if (response.ok) {
        // 서버로부터 응답이 성공적으로 온 경우에만 로컬 데이터를 업데이트합니다.
        item.chat_fix = newFixStatus; // 상태를 업데이트
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
      // window.location.href를 사용하여 특정 URL('/recipe/chatrecipe')로 이동합니다.
      window.location.href = '/recipe/chatrecipe';
    },
    movetochatfixed() {
      // window.location.href를 사용하여 특정 URL('/recipe/chatrecipe')로 이동합니다.
      window.location.href = '/recipe/chatfixed';
    },
    movetocontent(chat_num) {
  this.$router.push({ path: '/recipe/chatdetail', query: { chat_num: chat_num } });
    },
    movetopreviouspage() {
    if (this.currentPage > 1) {
      this.currentPage--; // 현재 페이지 감소
      this.$router.push({ query: { page: this.currentPage } }); // 페이지 변경
    } else {
      alert('첫번째 페이지입니다!');
    }
  },
  movetonextpage() {
    if (this.currentPage < this.totalpage) {
      this.currentPage++; // 현재 페이지 증가
      this.$router.push({ query: { page: this.currentPage } }); // 페이지 변경
    } else {
      alert('마지막 페이지입니다!');
    }
  },
  shouldDisplayPage(page) {
      // 페이지가 너무 많을 경우 일부 페이지만 표시
      const maxPageItems = 5; // 보여줄 최대 페이지 수
      const currentPage = this.currentPage;
      const totalPages = this.totalpage;

      if (totalPages <= maxPageItems) {
        return true; // 전체 페이지 수가 적으면 모두 표시
      }

      const halfMax = Math.floor(maxPageItems / 2);
      const firstPage = Math.max(currentPage - halfMax, 1);
      const lastPage = Math.min(firstPage + maxPageItems - 1, totalPages);

      return page >= firstPage && page <= lastPage;
    },

    moveToPage(page) {
    // 페이지 번호를 클릭하면 해당 페이지로 이동
    this.currentPage = page; // currentPage를 클릭된 페이지로 업데이트
    this.$router.push({ query: { page: page } }); // 페이지 변경
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
  /* 숫자 사이 여백 조절 */
  margin-left : 5px;
  margin-right: 5px; /* 원하는 여백값(px)을 설정하세요 */
}
.space-between {
  /* 숫자 사이 여백 스타일 */
  display: inline-block;
  width: 10px; /* 여백의 너비 설정 */
}
</style>