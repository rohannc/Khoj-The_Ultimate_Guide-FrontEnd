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
                  <input type="password" placeholder="Confirm Password" required v-model="clinicData.confirmPassword" />
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
              <input type="submit" value="Signup" />
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

const signupFormRef = ref(null);
const formHeight = ref(0);

// --- Static Role Data ---
const currentRoleFormatted = 'Clinic';
const loginLink = '/login/clinic';
const roleIcon = `<img src="https://img.icons8.com/?size=100&id=4x8OkOlUcmfl&format=png&color=0059B3" alt="Clinic Icon" width="80" height="80">`;

// --- Dynamic Icon URLs ---
const icons = ref({
  user: 'https://img.icons8.com/?size=100&id=rGhKliUp2Vji&format=png&color=000000',
  lock: 'https://img.icons8.com/?size=100&id=qBAODuyTp5A6&format=png&color=000000',
  clinic: 'https://img.icons8.com/?size=100&id=EVUofezGYZIf&format=png&color=000000',
  email: 'https://img.icons8.com/?size=100&id=D9x0PpvvT1AL&format=png&color=000000',
  location: 'https://img.icons8.com/?size=100&id=Sk4BAluINF9y&format=png&color=000000',
  phone: 'https://img.icons8.com/?size=100&id=J9QTpfBIai4P&format=png&color=000000',
  website: 'https://img.icons8.com/?size=100&id=XZq0ctcsjbHB&format=png&color=000000',
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

  if (clinicData.value.password !== clinicData.value.confirmPassword) {
    passwordError.value = "Passwords do not match.";
    return;
  }

  const phoneNumbers = [];
  if (clinicData.value.primaryPhone) phoneNumbers.push({ mobileNumber: clinicData.value.primaryPhone });
  if (clinicData.value.secondaryPhone) phoneNumbers.push({ mobileNumber: clinicData.value.secondaryPhone });

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
  const endpoint = `http://localhost:8080/api/auth/register/clinic`;

  console.log('Submitting to:', endpoint);
  console.log('Payload:', JSON.stringify(formData, null, 2));

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const result = await response.json();
      alert(`Signup successful for Clinic! \nResponse: ${JSON.stringify(result)}`);
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message || 'An unknown error occurred.';

      if (errorMessage.toLowerCase().includes('username')) {
        usernameError.value = errorMessage;
      } else if (errorMessage.toLowerCase().includes('email')) {
        emailError.value = errorMessage;
      } else {
        alert(`Signup failed: ${errorMessage}`);
      }
    }
  } catch (error) {
    console.error('An error occurred during signup:', error);
    alert('An error occurred. Please check the console and try again.');
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
  [openingHours, passwordError, usernameError, emailError],
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
  border-radius: 15px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  padding-left: 0;
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

/* Error Message Styles */
.error-text-wrapper {
  margin-top: 5px;
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
</style>
