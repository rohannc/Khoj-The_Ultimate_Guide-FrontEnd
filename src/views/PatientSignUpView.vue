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
                <input type="text" placeholder="Username" required v-model="patientData.username" />
              </div>
              <div v-if="usernameError" class="field-error-wrapper">
                <p class="error-text">{{ usernameError }}</p>
              </div>

              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><img :src="icons.lock" alt="lock icon"></span>
                  <input type="password" placeholder="Password" required v-model="patientData.password" />
                </div>
                <div class="field">
                  <span class="field-icon"><img :src="icons.lock" alt="lock icon"></span>
                  <input :type="isPasswordVisible ? 'text' : 'password'" placeholder="Confirm Password" required
                    v-model="patientData.confirmPassword" />
                  <button type="button" @click="togglePasswordVisibility" class="password-toggle-btn">
                    <img :src="isPasswordVisible ? icons.eyeSlash : icons.eye" alt="Toggle Password Visibility">
                  </button>
                </div>
              </div>
              <div v-if="passwordError" class="error-text-wrapper">
                <p class="error-text">{{ passwordError }}</p>
              </div>

              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><img :src="icons.user" alt="user icon"></span>
                  <input type="text" placeholder="First Name" required v-model="patientData.firstName" />
                </div>
                <div class="field">
                  <span class="field-icon"><img :src="icons.user" alt="user icon"></span>
                  <input type="text" placeholder="Last Name" required v-model="patientData.lastName" />
                </div>
              </div>
              <div class="field">
                <span class="field-icon"><img :src="icons.email" alt="email icon"></span>
                <input type="email" placeholder="Email Address" required v-model="patientData.email" />
              </div>
              <div v-if="emailError" class="field-error-wrapper">
                <p class="error-text">{{ emailError }}</p>
              </div>

              <div class="field date-picker-wrapper">
                <span class="field-icon"><img :src="icons.calendar" alt="calendar icon"></span>
                <button type="button" class="date-picker-button" @click="isDobCalendarVisible = !isDobCalendarVisible"
                  :class="{ 'has-value': selectedDob }">
                  {{ formattedSelectedDob }}
                </button>
              </div>
              <div v-if="isDobCalendarVisible" class="calendar-container">
                <div class="calendar-header">
                  <button type="button" @click.stop.prevent="prevDobMonth">&lt;</button>
                  <div class="month-year-selects">
                    <div class="custom-calendar-dropdown">
                      <button type="button" class="calendar-dropdown-button" @click="toggleCalendarDropdown('month')">
                        <span>{{ selectedMonthName }}</span>
                        <svg :class="{ active: monthDropdownVisible }" aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 4 4 4-4" />
                        </svg>
                      </button>
                      <ul v-if="monthDropdownVisible" class="calendar-dropdown-menu">
                        <li v-for="(month, index) in months" :key="month" @click="selectMonth(index)">{{ month }}</li>
                      </ul>
                    </div>
                    <div class="custom-calendar-dropdown">
                      <button type="button" class="calendar-dropdown-button" @click="toggleCalendarDropdown('year')">
                        <span>{{ dobCurrentYear }}</span>
                        <svg :class="{ active: yearDropdownVisible }" aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 4 4 4-4" />
                        </svg>
                      </button>
                      <ul v-if="yearDropdownVisible" class="calendar-dropdown-menu">
                        <li v-for="year in years" :key="year" @click="selectYear(year)">{{ year }}</li>
                      </ul>
                    </div>
                  </div>
                  <button type="button" @click.stop.prevent="nextDobMonth">&gt;</button>
                </div>
                <div class="calendar-grid">
                  <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
                  <div class="day-cell" v-for="(day, index) in dobCalendarDays" :key="index"
                    :class="{ 'other-month': !day.isCurrentMonth, 'selected': day.isSelected }" @click="selectDob(day)">
                    {{ day.dayNumber }}
                  </div>
                </div>
              </div>
              <div class="field-group">
                <div class="field custom-dropdown">
                  <span class="field-icon"><img :src="icons.gender" alt="gender icon"></span>
                  <button type="button" class="dropdown-button"
                    :class="{ active: genderDropdownVisible, placeholder: selectedGender === 'Select Gender' }"
                    @click="toggleDropdown('gender')">
                    <span>{{ selectedGender }}</span>
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m1 1 4 4 4-4" />
                    </svg>
                  </button>
                  <ul v-if="genderDropdownVisible" class="dropdown-menu">
                    <li v-for="gender in genderOptions" :key="gender" @click="selectGender(gender)">{{ gender }}</li>
                  </ul>
                </div>
                <div class="field custom-dropdown">
                  <span class="field-icon"><img :src="icons.blood" alt="blood group icon"></span>
                  <button type="button" class="dropdown-button"
                    :class="{ active: bloodGroupDropdownVisible, placeholder: selectedBloodGroup === 'Blood Group' }"
                    @click="toggleDropdown('bloodGroup')">
                    <span>{{ selectedBloodGroup }}</span>
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m1 1 4 4 4-4" />
                    </svg>
                  </button>
                  <ul v-if="bloodGroupDropdownVisible" class="dropdown-menu">
                    <li v-for="group in bloodGroupOptions" :key="group" @click="selectBloodGroup(group)">{{ group }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="field">
                <span class="field-icon"><img :src="icons.location" alt="location icon"></span>
                <input type="text" placeholder="Street Address" required v-model="patientData.street" />
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><img :src="icons.location" alt="location icon"></span>
                  <input type="text" placeholder="City" required v-model="patientData.city" />
                </div>
                <div class="field">
                  <span class="field-icon"><img :src="icons.location" alt="location icon"></span>
                  <input type="text" placeholder="State" required v-model="patientData.state" />
                </div>
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><img :src="icons.location" alt="location icon"></span>
                  <input type="text" placeholder="Pincode" required v-model="patientData.pincode" />
                </div>
                <div class="field">
                  <span class="field-icon"><img :src="icons.location" alt="location icon"></span>
                  <input type="text" placeholder="Country" required v-model="patientData.country" />
                </div>
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><img :src="icons.phone" alt="phone icon"></span>
                  <input type="tel" placeholder="Primary Phone" required v-model="patientData.primaryPhone" />
                </div>
                <div class="field">
                  <span class="field-icon"><img :src="icons.phone" alt="phone icon"></span>
                  <input type="tel" placeholder="Secondary Phone" v-model="patientData.secondaryPhone" />
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
import { ref, computed, watch, nextTick, onMounted } from 'vue';
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

// --- Static Role Data ---
const currentRoleFormatted = 'Patient';
const loginLink = '/login/patient';
const roleIcon = `<img src="https://img.icons8.com/?size=100&id=TSGqpZrEvLju&format=png&color=0059B3" alt="Patient Icon" width="80" height="80">`;

const icons = ref({
  user: 'https://img.icons8.com/?size=100&id=rGhKliUp2Vji&format=png&color=cccccc',
  lock: 'https://img.icons8.com/?size=100&id=qBAODuyTp5A6&format=png&color=cccccc',
  email: 'https://img.icons8.com/?size=100&id=D9x0PpvvT1AL&format=png&color=cccccc',
  location: 'https://img.icons8.com/?size=100&id=Sk4BAluINF9y&format=png&color=cccccc',
  phone: 'https://img.icons8.com/?size=100&id=J9QTpfBIai4P&format=png&color=cccccc',
  calendar: 'https://img.icons8.com/?size=100&id=12776&format=png&color=cccccc',
  gender: 'https://img.icons8.com/?size=100&id=xl7K3pk1ePmn&format=png&color=cccccc',
  blood: 'https://img.icons8.com/?size=100&id=26115&format=png&color=cccccc',
  eye: 'https://img.icons8.com/?size=100&id=mGf7Pc8j48LQ&format=png&color=cccccc',
  eyeSlash: 'https://img.icons8.com/?size=100&id=SQWg80tZBquQ&format=png&color=cccccc',
});


// --- Form Data ---
const patientData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
  primaryPhone: '',
  secondaryPhone: '',
});

// --- Field-specific Validation State ---
const passwordError = ref('');
const usernameError = ref('');
const emailError = ref('');
const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

// --- Dropdown and Calendar Logic ---
const genderDropdownVisible = ref(false);
const bloodGroupDropdownVisible = ref(false);
const selectedGender = ref('Select Gender');
const selectedBloodGroup = ref('Blood Group');

const genderOptions = ['Male', 'Female', 'Other'];
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const isDobCalendarVisible = ref(false);
const selectedDob = ref(null);
const dobDate = new Date();
const dobCurrentMonth = ref(dobDate.getMonth());
const dobCurrentYear = ref(dobDate.getFullYear());
const monthDropdownVisible = ref(false);
const yearDropdownVisible = ref(false);

const months = [...Array(12).keys()].map(i => new Date(0, i).toLocaleString('default', { month: 'long' }));

const years = computed(() => {
  const startYear = new Date().getFullYear() - 100;
  const endYear = new Date().getFullYear();
  return Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);
});

const selectedMonthName = computed(() => months[dobCurrentMonth.value]);

const formattedSelectedDob = computed(() => {
  if (!selectedDob.value) return 'Select Date of Birth';
  return selectedDob.value.toLocaleDateString();
});

const dobCalendarDays = computed(() => {
  const year = dobCurrentYear.value;
  const month = dobCurrentMonth.value;
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push({ dayNumber: '', isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(year, month, i);
    daysArray.push({
      dayNumber: i,
      isCurrentMonth: true,
      isToday: false,
      isSelected: selectedDob.value ? selectedDob.value.toDateString() === currentDate.toDateString() : false,
      date: currentDate
    });
  }
  return daysArray;
});

const selectDob = (day) => {
  if (!day.isCurrentMonth) return;
  selectedDob.value = day.date;
  isDobCalendarVisible.value = false;
};

const prevDobMonth = () => { if (dobCurrentMonth.value === 0) { dobCurrentMonth.value = 11; dobCurrentYear.value--; } else { dobCurrentMonth.value--; } };
const nextDobMonth = () => { if (dobCurrentMonth.value === 11) { dobCurrentMonth.value = 0; dobCurrentYear.value++; } else { dobCurrentMonth.value++; } };
const toggleDropdown = (type) => { if (type === 'gender') { genderDropdownVisible.value = !genderDropdownVisible.value; bloodGroupDropdownVisible.value = false; } else if (type === 'bloodGroup') { bloodGroupDropdownVisible.value = !bloodGroupDropdownVisible.value; genderDropdownVisible.value = false; } };
const selectGender = (gender) => { selectedGender.value = gender; genderDropdownVisible.value = false; };
const selectBloodGroup = (group) => { selectedBloodGroup.value = group; bloodGroupDropdownVisible.value = false; };
const toggleCalendarDropdown = (type) => { if (type === 'month') { monthDropdownVisible.value = !monthDropdownVisible.value; yearDropdownVisible.value = false; } else if (type === 'year') { yearDropdownVisible.value = !yearDropdownVisible.value; monthDropdownVisible.value = false; } };
const selectMonth = (monthIndex) => { dobCurrentMonth.value = monthIndex; monthDropdownVisible.value = false; };
const selectYear = (year) => { dobCurrentYear.value = year; yearDropdownVisible.value = false; };

// --- Main Form Submission Logic ---
const handleSignup = async () => {
  passwordError.value = '';
  usernameError.value = '';
  emailError.value = '';
  signupError.value = '';

  if (patientData.value.password !== patientData.value.confirmPassword) {
    passwordError.value = 'Passwords do not match.';
    return;
  }

  isLoading.value = true;
  isSuccess.value = false;

  const phoneNumbers = [];
  if (patientData.value.primaryPhone) phoneNumbers.push({ number: patientData.value.primaryPhone });
  if (patientData.value.secondaryPhone) phoneNumbers.push({ number: patientData.value.secondaryPhone });

  const formData = {
    username: patientData.value.username,
    password: patientData.value.password,
    emailId: patientData.value.email,
    firstName: patientData.value.firstName,
    lastName: patientData.value.lastName,
    dateOfBirth: selectedDob.value ? selectedDob.value.toISOString().split('T')[0] : null,
    gender: selectedGender.value === 'Select Gender' ? null : selectedGender.value,
    street: patientData.value.street,
    city: patientData.value.city,
    state: patientData.value.state,
    pinCode: patientData.value.pincode,
    country: patientData.value.country,
    phoneNumbers: phoneNumbers,
    bloodGroup: selectedBloodGroup.value === 'Blood Group' ? null : selectedBloodGroup.value,
  };

  const apiCall = fetch(`http://localhost:8080/api/auth/register/patient`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const [response] = await Promise.all([apiCall, minLoadingTime]);
    const result = await response.json();

    console.log(result);

    if (!response.ok) {
      throw new Error(result.message || 'An unknown error occurred.');
    }

    // --- On Success ---
    isLoading.value = false;
    isSuccess.value = true;

    // 1. Prepare user data and token from the API response
    const userToStore = {
      username: result.username,
      role: result.registeredUserType.toLowerCase()
    };

    // 2. THIS IS THE KEY STEP: Call the login action from your Pinia auth store.
    // This saves the user state and token to both Pinia and localStorage.
    authStore.login(userToStore, result.token);

    // 3. Redirect the user to their dashboard after a short delay for the success animation.
    // The router guard will also protect this route, ensuring only authenticated users can access it.
    setTimeout(() => {
      router.push(`/dashboard/${userToStore.role}`);
    }, 1500);

  } catch (error) {
    isLoading.value = false;
    const errorMessage = error.message;
    // Handle specific errors from the backend
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
  [() => patientData.value.password, () => patientData.value.confirmPassword],
  () => {
    if (patientData.value.confirmPassword && patientData.value.password !== patientData.value.confirmPassword) {
      passwordError.value = 'Passwords do not match.';
    } else {
      passwordError.value = '';
    }
  }
);


watch(
  [genderDropdownVisible, bloodGroupDropdownVisible, isDobCalendarVisible, passwordError, usernameError, emailError, signupError],
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

.field input:focus~.field-icon img,
.field .dropdown-button:focus~.field-icon img,
.field .dropdown-button.active~.field-icon img,
.field .date-picker-button:focus~.field-icon img {
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

.password-toggle-btn:hover img {
  opacity: 0.8;
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
  padding-left: 0;
  border-radius: 15px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

form .btn button:disabled {
  cursor: not-allowed;
}


.custom-dropdown {
  position: relative;
}

.dropdown-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  cursor: pointer;
  text-align: left;
}

.dropdown-button:focus,
.dropdown-button.active {
  border-color: #1a75ff;
}

.dropdown-button span {
  color: #333;
}

.dropdown-button.placeholder span {
  color: #999;
}

.dropdown-button svg {
  width: 12px;
  height: 12px;
  margin-left: 0.75rem;
  transition: transform 0.3s ease;
}

.dropdown-button.active svg {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 105%;
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  list-style: none;
  padding: 5px 0;
  max-height: 145px;
  overflow-y: auto;
}

.dropdown-menu li {
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
}

.dropdown-menu li:hover {
  background-color: #f0f5ff;
  color: #1a75ff;
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

.date-picker-button {
  text-align: left;
  background: #fff;
  cursor: pointer;
  color: #999;
}

.date-picker-button.has-value {
  color: #333;
}

.calendar-container {
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 15px;
  margin-top: 10px;
  background-color: #fdfdfd;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.month-year-selects {
  display: flex;
  gap: 10px;
  flex-grow: 1;
  justify-content: center;
  margin: 0 10px;
}

.calendar-header button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
}

.calendar-header button:hover {
  background-color: #f0f0f0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  text-align: center;
}

.weekday {
  font-weight: 500;
  color: #999;
  font-size: 14px;
}

.day-cell {
  padding: 0;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  margin: auto;
  border-radius: 8px;
  font-size: 15px;
}

.day-cell:not(.other-month):hover {
  background-color: #f0f5ff;
}

.day-cell.other-month {
  color: #ccc;
  cursor: default;
}

.day-cell.other-month:hover {
  background-color: transparent;
}

.day-cell.today {
  border: none;
  font-weight: normal;
}

.day-cell.selected {
  background-color: #1a75ff;
  color: #fff;
}

.custom-calendar-dropdown {
  position: relative;
  flex-grow: 1;
}

.calendar-dropdown-button {
  width: 100%;
  height: 40px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
}

.calendar-dropdown-button svg {
  width: 12px;
  height: 12px;
  transition: transform 0.3s ease;
}

.calendar-dropdown-button svg.active {
  transform: rotate(180deg);
}

.calendar-dropdown-menu {
  position: absolute;
  top: 105%;
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 20;
  list-style: none;
  padding: 5px 0;
  max-height: 200px;
  overflow-y: auto;
}

.calendar-dropdown-menu li {
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
}

.calendar-dropdown-menu li:hover {
  background-color: #f0f5ff;
  color: #1a75ff;
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

.alert-close-btn .w-3 {
  width: 0.75rem;
}

.alert-close-btn .h-3 {
  height: 0.75rem;
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
