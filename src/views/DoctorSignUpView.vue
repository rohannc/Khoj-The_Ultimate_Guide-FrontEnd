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
                <input type="text" placeholder="Username" required v-model="doctorData.username" />
              </div>
              <div v-if="usernameError" class="field-error-wrapper">
                <p class="error-text">{{ usernameError }}</p>
              </div>

              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><img :src="icons.lock" alt="lock icon"></span>
                  <input type="password" placeholder="Password" required v-model="doctorData.password" />
                </div>
                <div class="field">
                  <span class="field-icon"><img :src="icons.lock" alt="lock icon"></span>
                  <input type="password" placeholder="Confirm Password" required v-model="doctorData.confirmPassword" />
                </div>
              </div>
              <div v-if="passwordError" class="error-text-wrapper">
                <p class="error-text">{{ passwordError }}</p>
              </div>

              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><img :src="icons.user" alt="user icon"></span>
                  <input type="text" placeholder="First Name" required v-model="doctorData.firstName" />
                </div>
                <div class="field">
                  <span class="field-icon"><img :src="icons.user" alt="user icon"></span>
                  <input type="text" placeholder="Last Name" required v-model="doctorData.lastName" />
                </div>
              </div>
              <div class="field">
                <span class="field-icon"><img :src="icons.email" alt="email icon"></span>
                <input type="email" placeholder="Email Address" required v-model="doctorData.email" />
              </div>
              <div v-if="emailError" class="field-error-wrapper">
                <p class="error-text">{{ emailError }}</p>
              </div>

              <div class="field custom-dropdown">
                <span class="field-icon"><img :src="icons.gender" alt="gender icon"></span>
                <button type="button" class="dropdown-button"
                  :class="{ active: genderDropdownVisible, placeholder: selectedGender === 'Select Gender' }"
                  @click="toggleMainDropdown('gender')">
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
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><img :src="icons.phone" alt="phone icon"></span>
                  <input type="tel" placeholder="Primary Phone" required v-model="doctorData.primaryPhone" />
                </div>
                <div class="field">
                  <span class="field-icon"><img :src="icons.phone" alt="phone icon"></span>
                  <input type="tel" placeholder="Secondary Phone" v-model="doctorData.secondaryPhone" />
                </div>
              </div>
              <div class="field">
                <span class="field-icon"><img :src="icons.registration" alt="registration icon"></span>
                <input type="text" placeholder="Registration Number" required v-model="doctorData.registrationNumber" />
              </div>

              <div class="field date-picker-wrapper">
                <span class="field-icon"><img :src="icons.calendar" alt="calendar icon"></span>
                <button type="button" class="date-picker-button" @click="isCalendarVisible = !isCalendarVisible"
                  :class="{ 'has-value': selectedDate }">
                  {{ formattedSelectedDate }}
                </button>
              </div>
              <div v-if="isCalendarVisible" class="calendar-container">
                <div class="calendar-header">
                  <button type="button" @click.stop.prevent="prevMonth">&lt;</button>
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
                        <span>{{ currentYear }}</span>
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
                  <button type="button" @click.stop.prevent="nextMonth">&gt;</button>
                </div>
                <div class="calendar-grid">
                  <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
                  <div class="day-cell" v-for="(day, index) in calendarDays" :key="index"
                    :class="{ 'other-month': !day.isCurrentMonth, 'today': day.isToday, 'selected': day.isSelected }"
                    @click="selectDate(day)">
                    {{ day.dayNumber }}
                  </div>
                </div>
              </div>
              <div class="tag-field-wrapper">
                <div class="field">
                  <span class="field-icon"><img :src="icons.specialization" alt="specialization icon"></span>
                  <input type="text" placeholder="Specializations - Type and Press Enter"
                    v-model="currentSpecialization" @keydown.enter.prevent="addSpecialization">
                </div>
                <div class="tags-container">
                  <div v-for="(tag, index) in specializations" :key="index" class="tag">
                    {{ tag }} <span class="remove-tag" @click="removeSpecialization(index)">&times;</span>
                  </div>
                </div>
              </div>
              <div class="tag-field-wrapper">
                <div class="field">
                  <span class="field-icon"><img :src="icons.qualification" alt="qualification icon"></span>
                  <input type="text" placeholder="Qualifications - Type and Press Enter" v-model="currentQualification"
                    @keydown.enter.prevent="addQualification">
                </div>
                <div class="tags-container">
                  <div v-for="(tag, index) in qualifications" :key="index" class="tag">
                    {{ tag }} <span class="remove-tag" @click="removeQualification(index)">&times;</span>
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
import { ref, computed, watch, nextTick, onMounted } from 'vue';

const signupFormRef = ref(null);
const formHeight = ref(0);

// --- Static Role Data ---
const currentRoleFormatted = 'Doctor';
const loginLink = '/login/doctor';
const roleIcon = `<img src="https://img.icons8.com/?size=100&id=Dm8KPoTMqylb&format=png&color=0059B3" alt="Medical Doctor Icon" width="80" height="80">`;

// --- Dynamic Icon URLs ---
const icons = ref({
  user: 'https://img.icons8.com/?size=100&id=rGhKliUp2Vji&format=png&color=000000',
  lock: 'https://img.icons8.com/?size=100&id=qBAODuyTp5A6&format=png&color=000000',
  email: 'https://img.icons8.com/?size=100&id=D9x0PpvvT1AL&format=png&color=000000',
  phone: 'https://img.icons8.com/?size=100&id=J9QTpfBIai4P&format=png&color=000000',
  calendar: 'https://img.icons8.com/?size=100&id=12776&format=png&color=000000',
  gender: 'https://img.icons8.com/?size=100&id=xl7K3pk1ePmn&format=png&color=000000',
  registration: 'https://img.icons8.com/?size=100&id=edehkE8AAo9h&format=png&color=000000',
  specialization: 'https://img.icons8.com/?size=100&id=14871&format=png&color=000000',
  qualification: 'https://img.icons8.com/?size=100&id=T5ATsUangzQW&format=png&color=000000'
});

// --- Form Data ---
const doctorData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  email: '',
  primaryPhone: '',
  secondaryPhone: '',
  registrationNumber: '',
});

// --- Field-specific Validation State ---
const passwordError = ref('');
const usernameError = ref('');
const emailError = ref('');

// State for custom dropdowns
const genderDropdownVisible = ref(false);
const selectedGender = ref('Select Gender');
const genderOptions = ['Male', 'Female', 'Other'];

// --- Tagging Logic ---
const specializations = ref([]);
const qualifications = ref([]);
const currentSpecialization = ref('');
const currentQualification = ref('');

const addSpecialization = () => {
  const tag = currentSpecialization.value.trim();
  if (tag) {
    specializations.value.push(tag);
    currentSpecialization.value = '';
  }
};
const removeSpecialization = (index) => {
  specializations.value.splice(index, 1);
};
const addQualification = () => {
  const tag = currentQualification.value.trim();
  if (tag) {
    qualifications.value.push(tag);
    currentQualification.value = '';
  }
};
const removeQualification = (index) => {
  qualifications.value.splice(index, 1);
};


// --- CALENDAR LOGIC ---
const isCalendarVisible = ref(false);
const selectedDate = ref(null);
const date = new Date();
const currentMonth = ref(date.getMonth());
const currentYear = ref(date.getFullYear());
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthDropdownVisible = ref(false);
const yearDropdownVisible = ref(false);


const months = [...Array(12).keys()].map(i => new Date(0, i).toLocaleString('default', { month: 'long' }));

const years = computed(() => {
  const startYear = new Date().getFullYear() - 100;
  const endYear = new Date().getFullYear();
  return Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);
});

const selectedMonthName = computed(() => months[currentMonth.value]);

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return 'Select Registration Date';
  return selectedDate.value.toLocaleDateString();
});

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push({ dayNumber: '', isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const today = new Date();
    const currentDate = new Date(year, month, i);
    daysArray.push({
      dayNumber: i,
      isCurrentMonth: true,
      isToday: today.toDateString() === currentDate.toDateString(),
      isSelected: selectedDate.value ? selectedDate.value.toDateString() === currentDate.toDateString() : false,
      date: currentDate
    });
  }
  return daysArray;
});

const selectDate = (day) => {
  if (!day.isCurrentMonth) return;
  selectedDate.value = day.date;
  isCalendarVisible.value = false;
}

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

const toggleMainDropdown = () => {
  genderDropdownVisible.value = !genderDropdownVisible.value;
};

const selectGender = (gender) => {
  selectedGender.value = gender;
  genderDropdownVisible.value = false;
};

const toggleCalendarDropdown = (type) => {
  if (type === 'month') {
    monthDropdownVisible.value = !monthDropdownVisible.value;
    yearDropdownVisible.value = false; // Close the other one
  } else if (type === 'year') {
    yearDropdownVisible.value = !yearDropdownVisible.value;
    monthDropdownVisible.value = false; // Close the other one
  }
};

const selectMonth = (monthIndex) => {
  currentMonth.value = monthIndex;
  monthDropdownVisible.value = false;
};

const selectYear = (year) => {
  currentYear.value = year;
  yearDropdownVisible.value = false;
};

// --- Form Submission Logic ---
const handleSignup = async () => {
  // Clear all previous errors
  passwordError.value = '';
  usernameError.value = '';
  emailError.value = '';

  if (doctorData.value.password !== doctorData.value.confirmPassword) {
    passwordError.value = "Passwords do not match.";
    return;
  }

  if (!selectedDate.value) {
    alert("Please select a registration date.");
    return;
  }

  const phoneNumbers = [];
  if (doctorData.value.primaryPhone) phoneNumbers.push({ number: doctorData.value.primaryPhone });
  if (doctorData.value.secondaryPhone) phoneNumbers.push({ number: doctorData.value.secondaryPhone });

  const formData = {
    username: doctorData.value.username,
    password: doctorData.value.password,
    emailId: doctorData.value.email,
    firstName: doctorData.value.firstName,
    lastName: doctorData.value.lastName,
    gender: selectedGender.value === 'Select Gender' ? null : selectedGender.value,
    specialization: specializations.value,
    qualifications: qualifications.value,
    registrationNumber: doctorData.value.registrationNumber,
    phoneNumbers: phoneNumbers,
    registrationIssueDate: selectedDate.value ? new Date(selectedDate.value).toISOString().split('T')[0] : null,
  };
  const endpoint = `http://localhost:8080/api/auth/register/doctor`;

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
      alert(`Signup successful for Doctor! \nResponse: ${JSON.stringify(result)}`);
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
  [
    genderDropdownVisible,
    isCalendarVisible,
    specializations,
    qualifications,
    passwordError,
    usernameError,
    emailError
  ],
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

.tag-field-wrapper {
  margin-top: 20px;
  margin-bottom: -10px
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tag {
  background-color: #e0eafc;
  color: #1a75ff;
  padding: 5px 10px;
  border-radius: 15px;
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
}

.remove-tag {
  margin-left: 8px;
  cursor: pointer;
  font-weight: bold;
}

/* DATE PICKER STYLES */
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

.day-cell.selected {
  background-color: #1a75ff;
  color: #fff;
}

/* NEW STYLES for Calendar Dropdowns */
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
