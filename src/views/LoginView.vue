<template>
  <div class="auth-page-container">
    <div class="wrapper">
      <div class="role-icon" v-html="roleIcon"></div>

      <div class="title-text">
        <div class="title login">
          Login
          <div class="role-subtitle">as a {{ currentRoleFormatted }}</div>
        </div>
      </div>

      <Transition name="alert-fade">
        <div v-if="loginError" class="custom-alert">
          <div class="alert-icon">
            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
              viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
          </div>
          <div class="alert-message">
            {{ loginError }}
          </div>
          <button type="button" class="alert-close-btn" @click="loginError = ''">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          </button>
        </div>
      </Transition>

      <div class="form-container">
        <div class="slide-controls">
          <label class="slide login">Login</label>
          <router-link :to="signupLink" class="slide signup">Signup</router-link>
          <div class="slider-tab"></div>
        </div>
        <div class="form-inner-single" :style="{ height: formHeight ? `${formHeight}px` : 'auto' }">
          <form class="login" @submit.prevent="handleLogin" ref="loginFormRef">
            <div class="field">
              <span class="field-icon"><img :src="icons.user" alt="user icon"></span>
              <input type="text" placeholder="Username or Email" v-model="loginData.username" required />
            </div>
            <div class="field">
              <span class="field-icon"><img :src="icons.lock" alt="lock icon"></span>
              <input :type="isPasswordVisible ? 'text' : 'password'" placeholder="Password" v-model="loginData.password"
                required />
              <button type="button" @click="togglePasswordVisibility" class="password-toggle-btn">
                <img :src="isPasswordVisible ? icons.eyeSlash : icons.eye" alt="Toggle Password Visibility">
              </button>
            </div>

            <div class="pass-link"><a href="#">Forgot password?</a></div>
            <div class="field btn">
              <div class="btn-layer"></div>
              <button type="submit" :disabled="isLoading || isSuccess">
                <span v-if="!isLoading && !isSuccess">Login</span>
                <div v-if="isLoading" role="status" class="spinner">
                  <svg aria-hidden="true" class="spinner-svg" viewBox="0 0 100 101" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor" />
                  </svg>
                </div>
                <div v-if="isSuccess" class="success-animation-wrapper">
                  <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                    <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
              </button>
            </div>
            <div class="signup-link">
              Not a member? <router-link :to="signupLink">Signup now</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const loginFormRef = ref(null);
const formHeight = ref(0);

// --- State for Animations and Errors ---
const isLoading = ref(false);
const isSuccess = ref(false);
const loginError = ref('');
const isPasswordVisible = ref(false);

const icons = ref({
  user: 'https://img.icons8.com/?size=100&id=rGhKliUp2Vji&format=png&color=cccccc',
  lock: 'https://img.icons8.com/?size=100&id=qBAODuyTp5A6&format=png&color=cccccc',
  eye: 'https://img.icons8.com/?size=100&id=mGf7Pc8j48LQ&format=png&color=cccccc',
  eyeSlash: 'https://img.icons8.com/?size=100&id=SQWg80tZBquQ&format=png&color=cccccc',
});

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const loginData = ref({
  username: '',
  password: ''
});

const currentRole = computed(() => {
  const role = route.params.role;
  return ['doctor', 'patient', 'clinic'].includes(role) ? role : 'default';
});

const signupLink = computed(() => `/signup/${currentRole.value}`);

const currentRoleFormatted = computed(() => {
  if (!currentRole.value || currentRole.value === 'default') return 'User';
  return currentRole.value.charAt(0).toUpperCase() + currentRole.value.slice(1).toLowerCase();
});

const roleIcon = computed(() => {
  switch (currentRole.value) {
    case 'doctor':
      return `<img src="https://img.icons8.com/?size=100&id=Dm8KPoTMqylb&format=png&color=0059B3" alt="Medical Doctor Icon" width="80" height="80">`;
    case 'patient':
      return `<img src="https://img.icons8.com/?size=100&id=TSGqpZrEvLju&format=png&color=0059B3" alt="Patient Icon" width="80" height="80">`;
    case 'clinic':
      return `<img src="https://img.icons8.com/?size=100&id=4x8OkOlUcmfl&format=png&color=0059B3" alt="Clinic Icon" width="80" height="80">`;
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
  }
});

const handleLogin = async () => {
  // 1. Reset state
  loginError.value = '';
  isLoading.value = true;
  isSuccess.value = false;

  const payload = {
    username: loginData.value.username,
    password: loginData.value.password,
  };

  const API_URL = 'http://localhost:8080/api/auth/login';

  // For better UX, ensure the loading spinner shows for a minimum time
  const apiCall = fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const [response] = await Promise.all([apiCall, minLoadingTime]);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Invalid username or password.");
    }

    const userRole = result.userType?.toLowerCase();

    if (!userRole || !['doctor', 'patient', 'clinic'].includes(userRole)) {
      throw new Error("A valid user role was not provided by the server.");
    }

    // 2. Handle Success State
    isLoading.value = false;
    isSuccess.value = true;

    const userToStore = {
      username: result.username,
      role: userRole
    };

    authStore.login(userToStore, result.token);

    // 3. Redirect after success animation
    setTimeout(() => {
      console.log(userRole);
      const dashboardPath = `/dashboard/${userRole}`;
      router.push(dashboardPath);
    }, 1500);

  } catch (error) {
    // 4. Handle Error State
    isLoading.value = false;
    isSuccess.value = false;
    loginError.value = error.message;
  }
};

const updateHeight = () => {
  nextTick(() => {
    if (loginFormRef.value) {
      formHeight.value = loginFormRef.value.scrollHeight;
    }
  });
};

watch([currentRole, loginError], updateHeight);
onMounted(updateHeight);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

::selection {
  background: #1a75ff;
  color: #fff;
}

.auth-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: -webkit-linear-gradient(left, #003366, #004080, #0059b3, #0073e6);
  padding: 20px;
}

.wrapper {
  overflow: hidden;
  max-width: 450px;
  width: 100%;
  background: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.1);
}

.role-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  color: #0059b3;
}

.wrapper .title-text {
  display: flex;
  justify-content: center;
}

.wrapper .title {
  font-size: 35px;
  font-weight: 600;
  text-align: center;
}

.wrapper .title .role-subtitle {
  font-size: 16px;
  font-weight: 400;
  color: #555;
  margin-top: 2px;
  line-height: 1.2;
}

.wrapper .form-container {
  width: 100%;
  overflow: hidden;
}

.form-inner-single {
  transition: height 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.form-inner-single form .field {
  position: relative;
  height: 50px;
  width: 100%;
  margin-top: 20px;
}

.form-inner-single form .field input {
  height: 100%;
  width: 100%;
  outline: none;
  padding-left: 55px;
  border-radius: 15px;
  border: 1px solid lightgrey;
  border-bottom-width: 2px;
  font-size: 17px;
  transition: all 0.3s ease;
}

.form-inner-single form .field input[type="password"] {
  padding-right: 55px;
}

.form-inner-single form .field input[type="text"] {
  padding-right: 20px;
}

.field-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.field-icon img {
  width: 20px;
  height: 20px;
  transition: filter 0.3s ease;
}

.field input:focus~.field-icon img {
  filter: invert(36%) sepia(98%) saturate(2028%) hue-rotate(211deg) brightness(102%) contrast(101%);
}

.form-inner-single form .field input::placeholder {
  color: #999;
  transition: all 0.3s ease;
}

.form-inner-single form .field input:focus::placeholder {
  color: #1a75ff;
}

.form-inner-single form .field input:focus {
  border-color: #1a75ff;
}

.password-toggle-btn {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle-btn img {
  width: 22px;
  height: 22px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.password-toggle-btn:hover img {
  opacity: 0.8;
}

.form-inner-single form .pass-link {
  margin-top: 10px;
  text-align: center;
}

.form-inner-single form .signup-link {
  text-align: center;
  margin-top: 30px;
}

.form-inner-single form .pass-link a,
.form-inner-single form .signup-link a {
  color: #1a75ff;
  text-decoration: none;
}

.form-inner-single form .pass-link a:hover,
.form-inner-single form .signup-link a:hover {
  text-decoration: underline;
}

form .btn {
  height: 50px;
  width: 100%;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  margin-top: 20px;
}

form .btn .btn-layer {
  height: 100%;
  width: 300%;
  position: absolute;
  left: -100%;
  background: -webkit-linear-gradient(right, #003366, #004080, #0059b3, #0073e6);
  border-radius: 15px;
  transition: all 0.4s ease;
}

form .btn:hover .btn-layer {
  left: 0;
}

form .btn button {
  height: 100%;
  width: 100%;
  z-index: 1;
  position: relative;
  background: none;
  border: none;
  color: #fff;
  border-radius: 15px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  padding-left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

form .btn button:disabled {
  cursor: not-allowed;
}

.slide-controls {
  position: relative;
  display: flex;
  height: 50px;
  width: 100%;
  overflow: hidden;
  margin: 30px 0 10px 0;
  justify-content: space-between;
  border: 1px solid lightgrey;
  border-radius: 15px;
}

.slide-controls .slide {
  height: 100%;
  width: 100%;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  line-height: 48px;
  cursor: pointer;
  z-index: 1;
  transition: all 0.6s ease;
  text-decoration: none;
}

.slide-controls .slide.login {
  color: #fff;
}

.slide-controls .slide.signup {
  color: #000;
}

.slide-controls .slider-tab {
  position: absolute;
  height: 100%;
  width: 50%;
  left: 0;
  z-index: 0;
  border-radius: 15px;
  background: -webkit-linear-gradient(left, #003366, #004080, #0059b3, #0073e6);
}

.custom-alert {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #b91c1c;
  background-color: #fee2e2;
  border-radius: 0.5rem;
  margin-top: 20px;
}

.alert-icon {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
}

.alert-message {
  margin-left: 0.75rem;
  font-weight: 500;
}

.alert-close-btn {
  margin-left: auto;
  background-color: transparent;
  border: none;
  color: #ef4444;
  border-radius: 0.5rem;
  padding: 0.375rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  width: 2rem;
  transition: background-color 0.2s;
}

.alert-close-btn:hover {
  background-color: #fecaca;
}

.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Spinner and Success Animation */
.spinner {
  display: inline-block;
  width: 28px;
  height: 28px;
}

.spinner-svg {
  width: 100%;
  height: 100%;
  color: #fff;
  animation: spin 1s linear infinite;
}

.spinner-svg path:first-child {
  fill: rgba(255, 255, 255, 0.3);
}

.spinner-svg path:last-child {
  fill: #fff;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.success-animation-wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.checkmark {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: block;
  stroke-width: 2.5;
  stroke: #fff;
  stroke-miterlimit: 10;
  animation: scale .3s ease-in-out .9s both;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2.5;
  stroke-miterlimit: 10;
  stroke: #fff;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {

  0%,
  100% {
    transform: none;
  }

  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}
</style>
