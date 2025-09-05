<template>
  <div class="auth-page-container">
    <div class="wrapper">
      <div class="role-icon" v-html="roleIcon"></div>

      <div class="title-text">
        <div class="title signup">
          Signup
          <div class="role-subtitle">as a {{ currentRoleFormatted }}</div>
        </div>
      </div>

      <Transition name="alert-fade">
        <div v-if="signupError" class="custom-alert">
          <div class="alert-icon">
            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
              viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
          </div>
          <div class="alert-message">
            {{ signupError }}
          </div>
          <button type="button" class="alert-close-btn" @click="signupError = ''">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          </button>
        </div>
      </Transition>

      <div class="form-container">
        <div class="slide-controls">
          <router-link :to="loginLink" class="slide login">Login</router-link>
          <label class="slide signup">Signup</label>
          <div class="slider-tab"></div>
        </div>
        <div class="form-inner-single" :style="{ height: formHeight ? `${formHeight}px` : 'auto' }">
          <form class="signup" @submit.prevent="handleSignup" ref="signupFormRef">
            <div>
              <div class="field">
                <span class="field-icon"><img :src="icons.user" alt="user icon"></span>
                <input type="text" placeholder="Username" required v-model="clinicData.username" />
              </div>
              <div v-if="usernameError" class="field-error-wrapper">
                <p class="error-text">{{ usernameError }}</p>
              </div>

              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><img :src="icons.lock" alt="lock icon"></span>
                  <input type="password" placeholder="Password" required v-model="clinicData.password" />
                </div>
                <div class="field">
                  <span class="field-icon"><img :src="icons.lock" alt="lock icon"></span>
                  <input :type="isPasswordVisible ? 'text' : 'password'" placeholder="Confirm Password" required
                    v-model="clinicData.confirmPassword" />
                  <button type="button" @click="togglePasswordVisibility" class="password-toggle-btn">
                    <img :src="isPasswordVisible ? icons.eyeSlash : icons.eye" alt="Toggle Password Visibility">
                  </button>
                </div>
              </div>
              <div v-if="passwordError" class="error-text-wrapper">
                <p class="error-text">{{ passwordError }}</p>
              </div>

              <div class="field">
                <span class="field-icon"><img :src="icons.clinic" alt="clinic icon"></span>
                <input type="text" placeholder="Clinic Name" required v-model="clinicData.name" />
              </div>
              <div class="field">
                <span class="field-icon"><img :src="icons.email" alt="email icon"></span>
                <input type="email" placeholder="Clinic Email" required v-model="clinicData.email" />
              </div>
              <div v-if="emailError" class="field-error-wrapper">
                <p class="error-text">{{ emailError }}</p>
              </div>

              <div class="field">
                <span class="field-icon"><img :src="icons.location" alt="location icon"></span>
                <input type="text" placeholder="Street Address" required v-model="clinicData.street" />
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><img :src="icons.location" alt="location icon"></span>
                  <input type="text" placeholder="City" required v-model="clinicData.city" />
                </div>
                <div class="field">
                  <span class="field-icon"><img :src="icons.location" alt="location icon"></span>
                  <input type="text" placeholder="State" required v-model="clinicData.state" />
                </div>
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><img :src="icons.location" alt="location icon"></span>
                  <input type="text" placeholder="Pincode" required v-model="clinicData.pincode" />
                </div>
                <div class="field">
                  <span class="field-icon"><img :src="icons.location" alt="location icon"></span>
                  <input type="text" placeholder="Country" required v-model="clinicData.country" />
                </div>
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><img :src="icons.phone" alt="phone icon"></span>
                  <input type="tel" placeholder="Primary Phone" required v-model="clinicData.primaryPhone" />
                </div>
                <div class="field">
                  <span class="field-icon"><img :src="icons.phone" alt="phone icon"></span>
                  <input type="tel" placeholder="Secondary Phone" v-model="clinicData.secondaryPhone" />
                </div>
              </div>
              <div class="field">
                <span class="field-icon"><img :src="icons.website" alt="website icon"></span>
                <input type="url" placeholder="Website URL" v-model="clinicData.website" />
              </div>
              <div class="opening-hours">
                <h4>Opening Hours</h4>
                <div class="day-schedule" v-for="(day, index) in openingHours" :key="index">
                  <label class="day-label">{{ day.day }}</label>
                  <div class="time-picker-group">
                    <input type="time" :id="'open-time-' + index" class="time-input-new" v-model="day.open"
                      :disabled="day.isClosed" required>
                    <span class="time-input-icon">
                      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path fill-rule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                          clip-rule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <span class="time-separator">-</span>
                  <div class="time-picker-group">
                    <input type="time" :id="'close-time-' + index" class="time-input-new" v-model="day.close"
                      :disabled="day.isClosed" required>
                    <span class="time-input-icon">
                      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path fill-rule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                          clip-rule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <div class="closed-checkbox-wrapper">
                    <input type="checkbox" :id="'closed-' + index" v-model="day.isClosed" />
                    <label :for="'closed-' + index">Closed</label>
                  </div>
                </div>
              </div>
            </div>

            <div class="field btn">
              <div class="btn-layer"></div>
              <button type="submit" :disabled="isLoading || isSuccess">
                <span v-if="!isLoading && !isSuccess">Signup</span>
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
            <div class="login-link">
              Already a member? <router-link :to="loginLink">Login now</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const signupFormRef = ref(null);
const formHeight = ref(0);
const router = useRouter();
const authStore = useAuthStore();

// --- Form State ---
const isLoading = ref(false);
const isSuccess = ref(false);
const signupError = ref('');
const isPasswordVisible = ref(false);

// --- Static Role Data ---
const currentRoleFormatted = 'Clinic';
const loginLink = '/login/clinic';
const roleIcon = `<img src="https://img.icons8.com/?size=100&id=4x8OkOlUcmfl&format=png&color=0059B3" alt="Clinic Icon" width="80" height="80">`;

// --- Dynamic Icon URLs ---
const icons = ref({
  user: 'https://img.icons8.com/?size=100&id=rGhKliUp2Vji&format=png&color=cccccc',
  lock: 'https://img.icons8.com/?size=100&id=qBAODuyTp5A6&format=png&color=cccccc',
  clinic: 'https://img.icons8.com/?size=100&id=EVUofezGYZIf&format=png&color=cccccc',
  email: 'https://img.icons8.com/?size=100&id=D9x0PpvvT1AL&format=png&color=cccccc',
  location: 'https://img.icons8.com/?size=100&id=Sk4BAluINF9y&format=png&color=cccccc',
  phone: 'https://img.icons8.com/?size=100&id=J9QTpfBIai4P&format=png&color=cccccc',
  website: 'https://img.icons8.com/?size=100&id=XZq0ctcsjbHB&format=png&color=cccccc',
  eye: 'https://img.icons8.com/?size=100&id=mGf7Pc8j48LQ&format=png&color=cccccc',
  eyeSlash: 'https://img.icons8.com/?size=100&id=SQWg80tZBquQ&format=png&color=cccccc',
});

// --- Form Data ---
const clinicData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  email: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
  primaryPhone: '',
  secondaryPhone: '',
  website: '',
});

// --- Field-specific Validation State ---
const passwordError = ref('');
const usernameError = ref('');
const emailError = ref('');

const openingHours = ref([
  { day: 'Monday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Tuesday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Wednesday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Thursday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Friday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Saturday', open: '09:00', close: '13:00', isClosed: false },
  { day: 'Sunday', open: '00:00', close: '00:00', isClosed: true },
]);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

// --- Helper to format 24h time to 12h AM/PM format ---
const formatTime12h = (time24h) => {
  if (!time24h) return '';
  let [hours, minutes] = time24h.split(':');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`;
};

// --- Form Submission Logic ---
const handleSignup = async () => {
  // Clear all previous errors
  passwordError.value = '';
  usernameError.value = '';
  emailError.value = '';
  signupError.value = '';

  if (clinicData.value.password !== clinicData.value.confirmPassword) {
    passwordError.value = "Passwords do not match.";
    return;
  }

  isLoading.value = true;
  isSuccess.value = false;

  const phoneNumbers = [];
  if (clinicData.value.primaryPhone) phoneNumbers.push({ number: clinicData.value.primaryPhone });
  if (clinicData.value.secondaryPhone) phoneNumbers.push({ number: clinicData.value.secondaryPhone });

  const formattedHours = {};
  openingHours.value.forEach(day => {
    if (day.isClosed) {
      formattedHours[day.day] = 'Closed';
    } else {
      const openTime = formatTime12h(day.open);
      const closeTime = formatTime12h(day.close);
      formattedHours[day.day] = `${openTime} - ${closeTime}`;
    }
  });

  const formData = {
    username: clinicData.value.username,
    password: clinicData.value.password,
    emailId: clinicData.value.email,
    name: clinicData.value.name,
    street: clinicData.value.street,
    city: clinicData.value.city,
    state: clinicData.value.state,
    pinCode: clinicData.value.pincode,
    country: clinicData.value.country,
    phoneNumbers: phoneNumbers,
    website: clinicData.value.website,
    openingHours: formattedHours,
  };

  const apiCall = fetch(`http://localhost:8080/api/auth/register/clinic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const [response] = await Promise.all([apiCall, minLoadingTime]);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'An unknown error occurred.');
    }

    isLoading.value = false;
    isSuccess.value = true;

    const userToStore = {
      username: result.username,
      role: result.registeredUserType.toLowerCase()
    };
    authStore.login(userToStore, result.token);

    setTimeout(() => {
      router.push(`/dashboard/${userToStore.role}`);
    }, 1500);

  } catch (error) {
    isLoading.value = false;
    const errorMessage = error.message;
    if (errorMessage.toLowerCase().includes('username')) {
      usernameError.value = errorMessage;
    } else if (errorMessage.toLowerCase().includes('email')) {
      emailError.value = errorMessage;
    } else {
      signupError.value = errorMessage;
    }
  }
};


const updateHeight = () => {
  nextTick(() => {
    if (signupFormRef.value) {
      formHeight.value = signupFormRef.value.scrollHeight;
    }
  });
};

watch(
  [() => clinicData.value.password, () => clinicData.value.confirmPassword],
  () => {
    if (clinicData.value.confirmPassword && clinicData.value.password !== clinicData.value.confirmPassword) {
      passwordError.value = 'Passwords do not match.';
    } else {
      passwordError.value = '';
    }
  }
);

watch(
  [openingHours, passwordError, usernameError, emailError, signupError],
  updateHeight,
  { deep: true }
);

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
  max-width: 700px;
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

.form-inner-single form .field input,
.form-inner-single form .field .dropdown-button,
.form-inner-single form .field .date-picker-button {
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

.form-inner-single form .field input[placeholder="Confirm Password"] {
  padding-right: 55px;
}

.field-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #ccc;
  transition: all 0.3s ease;
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

.form-inner-single form .field-group {
  display: flex;
  gap: 15px;
  width: 100%;
  margin-top: 20px;
}

.form-inner-single form .field-group .field {
  width: 100%;
  margin-top: 0;
}

.form-inner-single form .login-link {
  text-align: center;
  margin-top: 30px;
}

.form-inner-single form .login-link a {
  color: #1a75ff;
  text-decoration: none;
}

.form-inner-single form .login-link a:hover {
  text-decoration: underline;
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

.opening-hours {
  margin-top: 25px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.opening-hours h4 {
  text-align: center;
  font-weight: 500;
  margin-bottom: 15px;
  color: #0059b3;
}

.day-schedule {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  margin-left: 20px;
  margin-right: 20px;
}

.day-label {
  flex-basis: 90px;
  font-weight: 500;
  font-size: 15px;
  flex-shrink: 0;
}

.time-separator {
  font-weight: bold;
}

.closed-checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.closed-checkbox-wrapper input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #1a75ff;
}

.closed-checkbox-wrapper label {
  cursor: pointer;
  font-size: 15px;
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
  color: #000;
}

.slide-controls .slide.signup {
  color: #fff;
}

.slide-controls .slider-tab {
  position: absolute;
  height: 100%;
  width: 50%;
  left: 50%;
  z-index: 0;
  border-radius: 15px;
  background: -webkit-linear-gradient(left, #003366, #004080, #0059b3, #0073e6);
}

.time-picker-group {
  display: flex;
  flex-grow: 1;
  margin: 0px 15px;
}

.time-input-new {
  border-radius: 0.5rem 0 0 0.5rem !important;
  background-color: #F9FAFB;
  border: 1px solid #D1D5DB;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0.625rem;
  width: 100%;
  outline: none;
  transition: all 0.3s ease;
}

.time-input-new:disabled {
  background-color: #f8f8f8;
  cursor: not-allowed;
}

.time-input-new:focus {
  border-color: #3B82F6;
  box-shadow: 0 0 0 1px #3B82F6;
}

.time-input-icon {
  display: inline-flex;
  align-items: center;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  color: #6B7280;
  background-color: #E5E7EB;
  border: 1px solid #D1D5DB;
  border-left: 0;
  border-radius: 0 0.5rem 0.5rem 0;
}

.time-input-icon .w-4 {
  width: 1rem;
}

.time-input-icon .h-4 {
  height: 1rem;
}

.error-text-wrapper {
  margin-top: 5px;
  padding-left: 50%;
  box-sizing: border-box;
}

.error-text {
  color: #D93025;
  font-size: 14px;
  text-align: left;
  padding-left: 10px;
}

.field-error-wrapper {
  margin-top: 5px;
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
