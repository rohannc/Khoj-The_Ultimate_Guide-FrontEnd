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
            <div v-if="currentRole === 'doctor'">
              <div class="field">
                <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg></span>
                <input type="text" placeholder="Username" required v-model="doctorData.username" />
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg></span>
                  <input type="password" placeholder="Password" required v-model="doctorData.password" />
                </div>
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg></span>
                  <input type="password" placeholder="Confirm Password" required v-model="doctorData.confirmPassword" />
                </div>
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg></span>
                  <input type="text" placeholder="First Name" required v-model="doctorData.firstName" />
                </div>
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg></span>
                  <input type="text" placeholder="Last Name" required v-model="doctorData.lastName" />
                </div>
              </div>
              <div class="field">
                <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg></span>
                <input type="email" placeholder="Email Address" required v-model="doctorData.email" />
              </div>
              <div class="field custom-dropdown">
                <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg></span>
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
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                      </path>
                    </svg></span>
                  <input type="tel" placeholder="Primary Phone" required v-model="doctorData.primaryPhone" />
                </div>
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                      </path>
                    </svg></span>
                  <input type="tel" placeholder="Secondary Phone" v-model="doctorData.secondaryPhone" />
                </div>
              </div>
              <div class="field">
                <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <line x1="4" y1="9" x2="20" y2="9"></line>
                    <line x1="4" y1="15" x2="20" y2="15"></line>
                    <line x1="10" y1="3" x2="8" y2="21"></line>
                    <line x1="16" y1="3" x2="14" y2="21"></line>
                  </svg></span>
                <input type="text" placeholder="Registration Number" required v-model="doctorData.registrationNumber" />
              </div>
              <div class="field date-picker-wrapper">
                <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg></span>
                <button type="button" class="date-picker-button" @click="isCalendarVisible = !isCalendarVisible">
                  <span>{{ formattedSelectedDate }}</span>
                </button>
              </div>
              <div v-if="isCalendarVisible" class="calendar-container">
                <div class="calendar-header">
                  <button type="button" @click="prevMonth">&lt;</button>
                  <span>{{ calendarHeader }}</span>
                  <button type="button" @click="nextMonth">&gt;</button>
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
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                      </polygon>
                    </svg></span>
                  <input type="text" placeholder="Specializations (press Enter to add)" v-model="currentSpecialization"
                    @keydown.enter.prevent="addSpecialization">
                </div>
                <div class="tags-container">
                  <div v-for="(tag, index) in specializations" :key="index" class="tag">
                    {{ tag }} <span class="remove-tag" @click="removeSpecialization(index)">&times;</span>
                  </div>
                </div>
              </div>
              <div class="tag-field-wrapper">
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg></span>
                  <input type="text" placeholder="Qualifications (press Enter to add)" v-model="currentQualification"
                    @keydown.enter.prevent="addQualification">
                </div>
                <div class="tags-container">
                  <div v-for="(tag, index) in qualifications" :key="index" class="tag">
                    {{ tag }} <span class="remove-tag" @click="removeQualification(index)">&times;</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentRole === 'patient'">
              <div class="field">
                <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg></span>
                <input type="text" placeholder="Username" required v-model="patientData.username" />
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg></span>
                  <input type="password" placeholder="Password" required v-model="patientData.password" />
                </div>
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg></span>
                  <input type="password" placeholder="Confirm Password" required
                    v-model="patientData.confirmPassword" />
                </div>
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg></span>
                  <input type="text" placeholder="First Name" required v-model="patientData.firstName" />
                </div>
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg></span>
                  <input type="text" placeholder="Last Name" required v-model="patientData.lastName" />
                </div>
              </div>
              <div class="field">
                <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg></span>
                <input type="email" placeholder="Email Address" required v-model="patientData.email" />
              </div>
              <div class="field date-picker-wrapper">
                <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg></span>
                <button type="button" class="date-picker-button" @click="isDobCalendarVisible = !isDobCalendarVisible">
                  <span>{{ formattedSelectedDob }}</span>
                </button>
              </div>
              <div v-if="isDobCalendarVisible" class="calendar-container">
                <div class="calendar-header">
                  <button type="button" @click="prevDobMonth">&lt;</button>
                  <span>{{ dobCalendarHeader }}</span>
                  <button type="button" @click="nextDobMonth">&gt;</button>
                </div>
                <div class="calendar-grid">
                  <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
                  <div class="day-cell" v-for="(day, index) in dobCalendarDays" :key="index"
                    :class="{ 'other-month': !day.isCurrentMonth, 'today': day.isToday, 'selected': day.isSelected }"
                    @click="selectDob(day)">
                    {{ day.dayNumber }}
                  </div>
                </div>
              </div>
              <div class="field-group">
                <div class="field custom-dropdown">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg></span>
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
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"></path>
                    </svg></span>
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
                <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg></span>
                <input type="text" placeholder="Street Address" required v-model="patientData.street" />
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg></span>
                  <input type="text" placeholder="City" required v-model="patientData.city" />
                </div>
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg></span>
                  <input type="text" placeholder="State" required v-model="patientData.state" />
                </div>
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg></span>
                  <input type="text" placeholder="Pincode" required v-model="patientData.pincode" />
                </div>
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg></span>
                  <input type="text" placeholder="Country" required v-model="patientData.country" />
                </div>
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                      </path>
                    </svg></span>
                  <input type="tel" placeholder="Primary Phone" required v-model="patientData.primaryPhone" />
                </div>
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                      </path>
                    </svg></span>
                  <input type="tel" placeholder="Secondary Phone" v-model="patientData.secondaryPhone" />
                </div>
              </div>
            </div>

            <div v-if="currentRole === 'clinic'">
              <div class="field">
                <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg></span>
                <input type="text" placeholder="Username" required v-model="clinicData.username" />
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg></span>
                  <input type="password" placeholder="Password" required v-model="clinicData.password" />
                </div>
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg></span>
                  <input type="password" placeholder="Confirm Password" required v-model="clinicData.confirmPassword" />
                </div>
              </div>
              <div class="field">
                <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg></span>
                <input type="text" placeholder="Clinic Name" required v-model="clinicData.name" />
              </div>
              <div class="field">
                <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg></span>
                <input type="email" placeholder="Clinic Email" required v-model="clinicData.email" />
              </div>
              <div class="field">
                <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg></span>
                <input type="text" placeholder="Street Address" required v-model="clinicData.street" />
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg></span>
                  <input type="text" placeholder="City" required v-model="clinicData.city" />
                </div>
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg></span>
                  <input type="text" placeholder="State" required v-model="clinicData.state" />
                </div>
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg></span>
                  <input type="text" placeholder="Pincode" required v-model="clinicData.pincode" />
                </div>
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg></span>
                  <input type="text" placeholder="Country" required v-model="clinicData.country" />
                </div>
              </div>
              <div class="field-group">
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                      </path>
                    </svg></span>
                  <input type="tel" placeholder="Primary Phone" required v-model="clinicData.primaryPhone" />
                </div>
                <div class="field">
                  <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                      </path>
                    </svg></span>
                  <input type="tel" placeholder="Secondary Phone" v-model="clinicData.secondaryPhone" />
                </div>
              </div>
              <div class="field">
                <span class="field-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path
                      d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
                    </path>
                  </svg></span>
                <input type="url" placeholder="Website URL" v-model="clinicData.website" />
              </div>
              <div class="opening-hours">
                <h4>Opening Hours</h4>
                <div class="day-schedule" v-for="(day, index) in openingHours" :key="index">
                  <label class="day-label">{{ day.day }}</label>
                  <div class="time-input-wrapper">
                    <input type="time" class="time-input" v-model="day.open" :disabled="day.isClosed" required />
                    <div class="time-icon">
                      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path fill-rule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span class="time-separator">-</span>
                  <div class="time-input-wrapper">
                    <input type="time" class="time-input" v-model="day.close" :disabled="day.isClosed" required />
                    <div class="time-icon">
                      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path fill-rule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
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
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const signupFormRef = ref(null);
const formHeight = ref(0);

// --- Role-based Form Data (Aligned with form fields) ---
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
  registrationNumber: '',
});


const openingHours = ref([
  { day: 'Monday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Tuesday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Wednesday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Thursday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Friday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Saturday', open: '09:00', close: '13:00', isClosed: false },
  { day: 'Sunday', open: '00:00', close: '00:00', isClosed: true },
]);

// State for custom dropdowns
const genderDropdownVisible = ref(false);
const bloodGroupDropdownVisible = ref(false);
const selectedGender = ref('Select Gender');
const selectedBloodGroup = ref('Blood Group');

const genderOptions = ['Male', 'Female', 'Other'];
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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


// --- Registration Date Calendar Logic ---
const isCalendarVisible = ref(false);
const selectedDate = ref(null);
const regDate = new Date();
const currentMonth = ref(regDate.getMonth());
const currentYear = ref(regDate.getFullYear());
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const calendarHeader = computed(() => {
  return new Date(currentYear.value, currentMonth.value).toLocaleString('default', { month: 'long', year: 'numeric' });
});

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
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

// --- Date of Birth Calendar Logic for Patient ---
const isDobCalendarVisible = ref(false);
const selectedDob = ref(null);
const dobDate = new Date();
const dobCurrentMonth = ref(dobDate.getMonth());
const dobCurrentYear = ref(dobDate.getFullYear());

const dobCalendarHeader = computed(() => {
  return new Date(dobCurrentYear.value, dobCurrentMonth.value).toLocaleString('default', { month: 'long', year: 'numeric' });
});

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
    const today = new Date();
    const currentDate = new Date(year, month, i);
    daysArray.push({
      dayNumber: i,
      isCurrentMonth: true,
      isToday: today.toDateString() === currentDate.toDateString(),
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

const currentRole = computed(() => {
  const role = route.params.role;
  return ['doctor', 'patient', 'clinic'].includes(role) ? role : 'default';
});

const loginLink = computed(() => `/login/${currentRole.value}`);

const currentRoleFormatted = computed(() => {
  if (!currentRole.value || currentRole.value === 'default') return 'User';
  return currentRole.value.charAt(0).toUpperCase() + currentRole.value.slice(1);
});

const roleIcon = computed(() => {
  switch (currentRole.value) {
    case 'doctor':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9h.5a3.5 3.5 0 0 1 3.5 3.5V12a3.5 3.5 0 0 1-3.5 3.5h-1A3.5 3.5 0 0 1 8 12v-3"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><path d="M8 12v3a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-3"/><circle cx="12" cy="20" r="2"/></svg>`;
    case 'patient':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    case 'clinic':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M12 18h.01"/><path d="m15 9-.5-1-4-1-1 3-2 3 .5 2.5 3 1.5 2-3Z"/></svg>`;
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
  }
});


// --- Helper to format 24h time to 12h AM/PM format ---
const formatTime12h = (time24h) => {
  if (!time24h) return '';
  let [hours, minutes] = time24h.split(':');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`;
};

// --- UPDATED: Form Submission Logic ---
const handleSignup = async () => {
  let formData = {};
  let endpoint = '';
  const role = currentRole.value;

  if (role === 'doctor') {
    if (doctorData.value.password !== doctorData.value.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const phoneNumbers = [];
    if (doctorData.value.primaryPhone) phoneNumbers.push({ number: doctorData.value.primaryPhone });
    if (doctorData.value.secondaryPhone) phoneNumbers.push({ number: doctorData.value.secondaryPhone });

    formData = {
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
      registrationIssueDate: selectedDate.value ? selectedDate.value.toISOString().split('T')[0] : null,
    };
    endpoint = `http://localhost:8080/api/auth/register/doctor`;

  } else if (role === 'patient') {
    if (patientData.value.password !== patientData.value.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const phoneNumbers = [];
    if (patientData.value.primaryPhone) phoneNumbers.push({ number: patientData.value.primaryPhone });
    if (patientData.value.secondaryPhone) phoneNumbers.push({ number: patientData.value.secondaryPhone });

    formData = {
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
    endpoint = `http://localhost:8080/api/auth/register/patient`;

  } else if (role === 'clinic') {
    if (clinicData.value.password !== clinicData.value.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

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

    formData = {
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
    endpoint = `http://localhost:8080/api/auth/register/clinic`;

  } else {
    alert('Invalid role for signup.');
    return;
  }

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
      alert(`Signup successful for ${role}! \nResponse: ${JSON.stringify(result)}`);
    } else {
      const errorData = await response.json();
      alert(`Signup failed: ${errorData.message || response.statusText}`);
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
  [currentRole, genderDropdownVisible, bloodGroupDropdownVisible, openingHours, isCalendarVisible, isDobCalendarVisible, specializations, qualifications],
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
  max-width: 580px;
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
  /* Increased padding */
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
}

.field-icon svg {
  width: 20px;
  height: 20px;
}

.field input:focus~.field-icon,
.field .dropdown-button:focus~.field-icon,
.field .dropdown-button.active~.field-icon,
.field .date-picker-button:focus~.field-icon {
  color: #1a75ff;
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

.terms-and-conditions {
  display: flex;
  align-items: center;
  height: auto !important;
  margin-top: 25px;
}

.terms-and-conditions input {
  width: 16px;
  height: 16px;
  accent-color: #1a75ff;
  cursor: pointer;
}

.terms-and-conditions label {
  margin-left: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
}

.terms-and-conditions a {
  color: #1a75ff;
  text-decoration: none;
}

.terms-and-conditions a:hover {
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
}

.day-label {
  flex-basis: 90px;
  font-weight: 500;
  font-size: 15px;
}

.time-input-wrapper {
  position: relative;
  flex-grow: 1;
}

.time-input {
  height: 45px;
  width: 100%;
  outline: none;
  padding: 0 10px 0 15px;
  border-radius: 10px;
  border: 1px solid lightgrey;
  font-size: 16px;
  transition: all 0.3s ease;
}

.time-input:not(:disabled) {
  cursor: pointer;
}

.time-input:focus {
  border-color: #1a75ff;
}

.time-input:disabled {
  background-color: #f8f8f8;
  cursor: not-allowed;
}

.time-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #999;
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

.date-picker-wrapper {
  position: relative;
}

.date-picker-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  cursor: pointer;
  text-align: left;
  color: #999;
}

.date-picker-button span {
  color: #333;
}

.calendar-container {
  margin: 10px auto 0;
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 15px;
  max-width: 350px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.calendar-header span {
  font-weight: 600;
  font-size: 18px;
}

.calendar-header button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px 10px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  text-align: center;
}

.weekday {
  font-weight: 500;
  color: #999;
}

.day-cell {
  padding: 0;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  margin: auto;
  border-radius: 8px;
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
  font-weight: bold;
  border: 1px solid #1a75ff;
}

.day-cell.selected {
  background-color: #1a75ff;
  color: #fff;
}

.tag-field-wrapper {
  margin-top: 20px;
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
</style>
