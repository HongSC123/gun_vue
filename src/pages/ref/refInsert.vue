<script setup>
import axios from '@axios';
import { ref } from 'vue';
import { VForm } from 'vuetify/components/VForm';
import { useRouter } from 'vue-router'


axios.defaults.timeout = 0

const numberedSteps = [
  {
    title: '사진 촬영',
    subtitle: '물품을 촬영해 주세요',
  },
  {
    title: '정보 등록',
    subtitle: '정보 확인&유통기한 등록',
  },
  {
    title: '최종 정보 확인',
    subtitle: '',
  },
]

const nameRules = [
  v => !!v || '이름을 입력해주세요.',
]
const quantityRules = [
  v => v > 0 || '수량은 1 이상이어야 합니다.',
]
const dateRules = [
  v => new Date(v) >= new Date() || '유통기한은 오늘 날짜 이후여야 합니다.',
]

const router = useRouter()
const image = ref('')
const imageSrc = ref('')
const currentStep = ref(0)
const isCurrentStepValid = ref(true)
const refAccountForm = ref()
const refPersonalForm = ref()
const refSocialLinkForm = ref()
const dialogVisible = ref(false)
const axiosdialog = ref(false)
const dialogMessage = ref('')
const axiosMessage = ref('')

const file = ref(null)
const rules = [fileList => !fileList || !fileList.length || fileList[0].size < 10000000 || '파일 용량 제한 10 MB!']

const results = ref([])
const detectPhoto = async () => {
  const valid = await refAccountForm.value?.validate()
  if (valid.valid) {
    let formData = new FormData()
    formData.append('image_file', file.value[0])

    console.log('file.value[0]:', file.value[0])
    console.log('formData:', formData)

    try {
      const response = await axios.post('http://192.168.0.131:8000/detect/fruits', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('response.data:', response.data)
      image.value = response.data.image
      imageSrc.value = 'data:image/jpeg;base64,' + response.data.image
      console.log('response.data:', response.data.results)
      results.value = response.data.results.map(item => ({
        ...item,
        endDate: end_date(),
      }))
      
    } catch (error) {
      console.error(error)
    }
    
    currentStep.value++
    isCurrentStepValid.value = true
  } else {
    isCurrentStepValid.value = false
  }
}
const validatePersonalForm = () => {
  if (results.value.length === 0) {
    dialogMessage.value = '최소 1개의 항목을 추가해야 합니다.'
    dialogVisible.value = true
    isCurrentStepValid.value = false
    return
  }
      const invalidMessages = results.value.reduce((messages, item) => {
        const nameMessage = nameRules[0](item.name)
        const quantityMessage = quantityRules[0](item.quantity)
        const dateMessage = dateRules[0](item.endDate)

        if (nameMessage !== true) messages.push(nameMessage)
        if (quantityMessage !== true) messages.push(quantityMessage)
        if (dateMessage !== true) messages.push(dateMessage)

        return messages
      }, [])

      if (invalidMessages.length === 0) {
        currentStep.value++
        isCurrentStepValid.value = true
      } else {
        dialogMessage.value = invalidMessages.join('\n')
        dialogVisible.value = true
        isCurrentStepValid.value = false
      }
    };


function end_date() {
  const today = new Date();
  today.setDate(today.getDate() + 7);
  return today.toISOString().substr(0, 10);
}

const addRow = () => {
  results.value.push({
    name: '',
    quantity: 0,
    endDate: end_date(),
  });
};

const deleteRow = (index) => {
  results.value.splice(index, 1);
};

const handleSubmit = async () => {
  let data = null;
  const submitData = [];
  results.value.forEach((result) => {
    let data = {
      'refName': result.name,
      'refQuan': result.quantity,
      'refEndDate': result.endDate,
      'refPhoto': image.value,
      'memEmail': sessionStorage.getItem('memEmail')
    };
    console.log('sessionStorage.getItem(memEmail):', sessionStorage.getItem('memEmail'));
    submitData.push(data);
  });
  console.log('submitData:', submitData.length)

    await axios.post('/ref/insert', submitData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      axiosMessage.value = '저장이 성공했습니다.';
      console.log('response.data:', response.data)
    })
    .catch((error) => {
      console.error(error);
      axiosMessage.value = '저장에 실패했습니다.';
    })
    .finally(() => {
      axiosdialog.value = true;
    });
};

const closeDialog = () => {
    axiosdialog.value = false;
    router.push({path: '/ref/refList'})
};


</script>


<template>
  <VCard>
    <VCardText>
      <!-- 👉 Stepper -->
      <AppStepper
        v-model:current-step="currentStep"
        :items="numberedSteps"
        align="start"
        :is-active-step-valid="isCurrentStepValid"
      />
    </VCardText>

    <VDivider />

    <VCardText>
      <!-- 👉 stepper content -->
      <!-- 👉 원스탭 -->
      <VWindow
        v-model="currentStep"
        class="disable-tab-transition"
      >
        <VWindowItem>
          <VForm
            ref="refAccountForm"
            @submit.prevent="detectPhoto"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-sm font-weight-medium">
                  사진을 등록해 주세요
                </h6>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VFileInput
                  v-model="file"
                  :rules="rules"
                  :multiple="false"
                  label="Photo"
                  placeholder="사진을 등록해 주세요"
                  prepend-icon="mdi-camera-outline"
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex justify-sm-space-between justify-center flex-wrap gap-4">
                  <VBtn
                    :color="currentStep === 0 ? 'secondary' : 'default'"
                    variant="outlined"
                    disabled
                  >
                    <VIcon
                      icon="mdi-arrow-left"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn
                    :disabled="!file"
                    type="submit"
                  >
                    Next
                    <VIcon
                      icon="mdi-arrow-right"
                      end
                      class="flip-in-rtl"
                    />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
        <!-- 👉 투스탭 -->
        <VWindowItem>
          <VForm ref="refPersonalForm" @submit.prevent="validatePersonalForm">
            <VRow>
              <VCol cols="12">
                <h6 class="text-sm font-weight-medium">
                  물품을 확인해 주세요
                </h6>
                <p class="text-xs mb-0">
                  유통기한, 수량, 물품명을 확인해 주세요
                </p>
              </VCol>

              <VCol cols="12" md="4" >
                <img v-if="imageSrc" :src="imageSrc" alt="Decoded Image" style="width: 30vh; height: 30vh;">
              </VCol>

              <VCol cols="12" md="8">
            <v-data-table  class="elevation-1">
              <VTable
                height="250"
                fixed-header
              >
                <thead>
                  <tr>
                    <th class="text-uppercase">
                      이름
                    </th>
                    <th class="text-uppercase">
                      수량
                    </th>
                    <th class="text-uppercase">
                      유통기한
                    </th>
                    <th>
                    <p></p>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, i) in results" :key="i">
                    <td>
                      <input type="text" v-model="item.name" :rules="nameRules" class="form-control" placeholder="이름을 입력" style="width: 100px;">
                    </td>
                    <td>
                      <input type="number" v-model="item.quantity" :rules="quantityRules" class="form-control" placeholder="수량을 입력" style="width: 100px;">
                    </td>
                    <td>
                      <input type="date" v-model="item.endDate" :rules="dateRules" class="form-control" placeholder="유통기한을 입력" style="width: 100px;">
                    </td>
                    <td>
                      <a href="#" @click="deleteRow(i)">삭제</a>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="4">
                      <a href="#" @click="addRow">추가</a>
                    </td>
                  </tr>
                </tfoot>
              </VTable>
            </v-data-table>
          </VCol>

              <VCol cols="12">
                <div class="d-flex justify-space-between">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--" >
                    <VIcon
                      icon="mdi-chevron-left"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn type="submit">
                    Next
                    <VIcon
                      icon="mdi-chevron-right"
                      end
                      class="flip-in-rtl"
                    />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
        <!-- 👉 쓰리스탭 -->
        <VWindowItem>
          <VForm
            ref="refSocialLinkForm"
            @submit.prevent="handleSubmit"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-sm font-weight-medium">
                  등록할 정보를 확인해 주세요
                </h6>
              </VCol>

              <VCol cols="12" md="2" />

              <VCol cols="12" md="8">
                <VTable
                  height="250"
                  fixed-header
                >
                  <thead>
                    <tr>
                      <th class="text-uppercase">
                        이름
                      </th>
                      <th class="text-uppercase">
                        수량
                      </th>
                      <th class="text-uppercase">
                        유통기한
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="(item, i) in results" :key="i">
                      <td>
                        {{ item.name }}
                      </td>
                      <td>
                        {{ item.quantity }}
                      </td>
                      <td>
                        {{ item.endDate }}
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </VCol>
              <VCol cols="12" md="2" />

              <VCol cols="12">
                <div class="d-flex justify-space-between">
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="currentStep--"
                  >
                    <VIcon
                      icon="mdi-chevron-left"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn
                    color="success"
                    type="submit"
                  >
                    submit
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>

  <v-dialog v-model="dialogVisible" max-width="400">
    <v-card>
      <v-card-title class="headline">{{ dialogMessage }}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialogVisible = false">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="axiosdialog" max-width="400">
    <v-card>
      <v-card-title class="headline">{{ axiosMessage }}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="closeDialog">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>




