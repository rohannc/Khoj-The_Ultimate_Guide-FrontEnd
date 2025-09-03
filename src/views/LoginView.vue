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
              <input type="password" placeholder="Password" v-model="loginData.password" required />
            </div>

            <div v-if="loginError" class="login-error-wrapper">
              <p class="error-text">{{ loginError }}</p>
            </div>

            <div class="pass-link"><a href="#">Forgot password?</a></div>
            <div class="field btn">
              <div class="btn-layer"></div>
              <input type="submit" value="Login" />
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
import { useRoute } from 'vue-router';

const route = useRoute();
const loginFormRef = ref(null);
const formHeight = ref(0);

// --- NEW: State for login error message ---
const loginError = ref('');

// --- Dynamic Icon URLs ---
const icons = ref({
  user: 'https://img.icons8.com/?size=100&id=rGhKliUp2Vji&format=png&color=000000',
  lock: 'https://img.icons8.com/?size=100&id=qBAODuyTp5A6&format=png&color=000000',
});

// Reactive data for login form
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
  return currentRole.value.charAt(0).toUpperCase() + currentRole.value.slice(1);
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
  // Clear previous error on a new attempt
  loginError.value = '';

  const payload = {
    username: loginData.value.username,
    password: loginData.value.password,
  };

  const API_URL = 'http://localhost:8080/api/auth/login';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // Use the error message from the backend's generic response
      const errorData = await response.json().catch(() => ({ message: 'Login failed. Please check your credentials.' }));
      throw new Error(errorData.message || "Invalid username or password.");
    }

    const result = await response.json();
    console.log('Success:', result);
    alert('Login successful!');

    // Example: Store token and redirect
    // localStorage.setItem('authToken', result.token);
    // router.push('/dashboard');

  } catch (error) {
    console.error('Error:', error);
    // Set the error message to be displayed on the form
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

// UPDATED: Watcher now includes loginError to adjust height if an error appears
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
  padding-right: 20px;
  border-radius: 15px;
  border: 1px solid lightgrey;
  border-bottom-width: 2px;
  font-size: 17px;
  transition: all 0.3s ease;
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

form .btn input[type='submit'] {
  height: 100%;
  width: 100%;
  z-index: 1;
  position: relative;
  background: none;
  border: none;
  color: #fff;
  padding-left: 0;
  border-radius: 15px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
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

/* NEW: Error Message Styles */
.login-error-wrapper {
  margin-top: 15px;
  text-align: center;
}

.error-text {
  color: #D93025;
  font-size: 14px;
}
</style>
