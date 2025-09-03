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
                  <input type="password" placeholder="Confirm Password" required
                    v-model="patientData.confirmPassword" />
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
import { ref, computed, watch, nextTick, onMounted } from 'vue';

const signupFormRef = ref(null);
const formHeight = ref(0);

// --- Static Role Data ---
const currentRoleFormatted = 'Patient';
const loginLink = '/login/patient';
const roleIcon = `<img src="https://img.icons8.com/?size=100&id=TSGqpZrEvLju&format=png&color=0059B3" alt="Patient Icon" width="80" height="80">`;

// --- Dynamic Icon URLs ---
const icons = ref({
  user: 'https://img.icons8.com/?size=100&id=rGhKliUp2Vji&format=png&color=000000',
  lock: 'https://img.icons8.com/?size=100&id=qBAODuyTp5A6&format=png&color=000000',
  email: 'https://img.icons8.com/?size=100&id=D9x0PpvvT1AL&format=png&color=000000',
  location: 'https://img.icons8.com/?size=100&id=Sk4BAluINF9y&format=png&color=000000',
  phone: 'https://img.icons8.com/?size=100&id=J9QTpfBIai4P&format=png&color=000000',
  calendar: 'https://img.icons8.com/?size=100&id=12776&format=png&color=000000',
  gender: 'https://img.icons8.com/?size=100&id=xl7K3pk1ePmn&format=png&color=000000',
  blood: 'https://img.icons8.com/?size=100&id=26115&format=png&color=000000',
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


// State for custom dropdowns
const genderDropdownVisible = ref(false);
const bloodGroupDropdownVisible = ref(false);
const selectedGender = ref('Select Gender');
const selectedBloodGroup = ref('Blood Group');

const genderOptions = ['Male', 'Female', 'Other'];
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// --- Date of Birth Calendar Logic for Patient ---
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
      isToday: false, // Today's date is not marked
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

const prevDobMonth = () => {
  if (dobCurrentMonth.value === 0) {
    dobCurrentMonth.value = 11;
    dobCurrentYear.value--;
  } else {
    dobCurrentMonth.value--;
  }
};

const nextDobMonth = () => {
  if (dobCurrentMonth.value === 11) {
    dobCurrentMonth.value = 0;
    dobCurrentYear.value++;
  } else {
    dobCurrentMonth.value++;
  }
};


const toggleDropdown = (type) => {
  if (type === 'gender') {
    genderDropdownVisible.value = !genderDropdownVisible.value;
    bloodGroupDropdownVisible.value = false;
  } else if (type === 'bloodGroup') {
    bloodGroupDropdownVisible.value = !bloodGroupDropdownVisible.value;
    genderDropdownVisible.value = false;
  }
};

const selectGender = (gender) => {
  selectedGender.value = gender;
  genderDropdownVisible.value = false;
};

const selectBloodGroup = (group) => {
  selectedBloodGroup.value = group;
  bloodGroupDropdownVisible.value = false;
};

const toggleCalendarDropdown = (type) => {
  if (type === 'month') {
    monthDropdownVisible.value = !monthDropdownVisible.value;
    yearDropdownVisible.value = false;
  } else if (type === 'year') {
    yearDropdownVisible.value = !yearDropdownVisible.value;
    monthDropdownVisible.value = false;
  }
};

const selectMonth = (monthIndex) => {
  dobCurrentMonth.value = monthIndex;
  monthDropdownVisible.value = false;
};

const selectYear = (year) => {
  dobCurrentYear.value = year;
  yearDropdownVisible.value = false;
};

// --- Form Submission Logic ---
const handleSignup = async () => {
  // Clear all previous errors on a new submission
  passwordError.value = '';
  usernameError.value = '';
  emailError.value = '';

  // Client-side validation for password match
  if (patientData.value.password !== patientData.value.confirmPassword) {
    passwordError.value = 'Passwords do not match.';
    return;
  }

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
  const endpoint = `http://localhost:8080/api/auth/register/patient`;

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
      alert(`Signup successful for Patient! \nResponse: ${JSON.stringify(result)}`);
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message || 'An unknown error occurred.';

      // NEW: Check error message and set state accordingly
      if (errorMessage.toLowerCase().includes('username')) {
        usernameError.value = errorMessage;
      } else if (errorMessage.toLowerCase().includes('email')) {
        emailError.value = errorMessage;
      } else {
        // Fallback for other errors
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

// --- Watch for password changes ---
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
  // Added usernameError and emailError to the watcher
  [genderDropdownVisible, bloodGroupDropdownVisible, isDobCalendarVisible, passwordError, usernameError, emailError],
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

/* Password Error Styles */
.error-text-wrapper {
  margin-top: 5px;
}

.error-text {
  color: #D93025;
  font-size: 14px;
  text-align: left;
  padding-left: 10px;
}

/* Field-specific Error Styles */
.field-error-wrapper {
  margin-top: 5px;
}
</style>
