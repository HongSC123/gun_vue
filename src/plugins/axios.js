import { useRouter } from 'vue-router'
import axios from 'e:/gun_workspace/gun_vue/node_modules/axios/index'

const router = useRouter()

// axios 인스턴스 생성
const axiosIns = axios.create({
  // 여기에 헤더 등을 추가하세요
  // ================================
  baseURL: 'http://localhost:8888',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },

  // headers: {'X-Custom-Header': 'foobar'}
})

// ℹ️ 로그인 후 각 요청에 인증 헤더를 보내기 위한 요청 인터셉터 추가
axiosIns.interceptors.request.use(config => {
  // 로컬 스토리지에서 토큰을 가져옵니다.
  const token = sessionStorage.getItem('accessToken')
  const refresh = sessionStorage.getItem('refreshToken')
  const loginType = sessionStorage.getItem('loginType')

  // 토큰이 존재하는 경우
  if (token) {
    // 요청 헤더를 가져오고, 헤더가 정의되지 않은 경우 빈 객체를 할당합니다.
    config.headers = config.headers || {}

    // 인증 헤더를 설정합니다.
    // ℹ️ JSON.parse는 토큰을 문자열로 변환합니다.
    //config.headers.Authorization = token ? `Bearer ${JSON.parse(token)}` : ''
    if(loginType === 'KAKAO'){
      config.headers.Authorization = `Kakao ${token}`
    }else{
      config.headers.Authorization = `Bearer ${token}`
    }
    
    config.headers['memEmail'] = `${sessionStorage.getItem('memEmail')}`
    
    // 리프레시 토큰을 요청 헤더에 추가합니다.
    config.headers['refresh'] = `${refresh}`
    
    // console.log(config.headers.Authorization)
    // console.log(config.headers.common['refresh'])

    // 토큰의 로그인 타입을 헤더에 추가합니다.
    
    config.headers['loginType'] = `${loginType}`
    
  }

  // 수정된 구성을 반환합니다.
  return config
})

// ℹ️ 401 응답을 처리하기 위한 응답 인터셉터 추가
axiosIns.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // 에러 처리
    if (error.response.status === 701 || error.response.status === 702 ) {
      const errorCode = error.response.status
      const refreshToken = sessionStorage.getItem('refreshToken')
      const accessToken = sessionStorage.getItem('accessToken')

      // 비동기 함수 내부에서 처리
      return (async () => {
        try {
          const response = await axios.post('/newtoken', {
            refresh: refreshToken,
            access: accessToken,
            error: errorCode,
          })
          

          if(response.data.error != null){
            
            return Promise.reject(refreshError)
          }

          if(error.response.status === 701){
            sessionStorage.setItem('accessToken', response.data.accessToken)
          }else if(error.response.status === 702){
            sessionStorage.setItem('refreshToken', response.data.refreshToken)
          }

          
          return axios(error.config)
        } catch (refreshError) {

          return Promise.reject(refreshError)
        }
      })()
    }else if(error.response.status === 703) {
      router.push('/login')

    }else {
      return Promise.reject(error)
    }
  },
)

export default axiosIns
