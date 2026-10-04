<template>
  <div class="max-w-7xl mx-auto w-full animate-fade-in font-sans pb-20">
    
    <!-- Top Header -->
    <div class="flex items-center justify-between mb-8 md:mb-12">
      <div>
        <button @click="router.push('/dashboard/doctor')" class="text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-2 mb-4">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Back to Dashboard
        </button>
        <div class="flex items-center gap-3">
          <h1 class="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Doctor Account</h1>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/70 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Verified Practitioner
          </span>
        </div>
        <p class="text-slate-500 mt-3 text-base md:text-lg">Manage your medical license, professional credentials, and clinic charges.</p>
      </div>

      <div v-if="!isLoading" class="hidden md:block">
        <button v-if="!isEditing" @click="toggleEdit" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-md shadow-indigo-200 transition-all duration-200 flex items-center gap-2 cursor-pointer">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          Edit Profile
        </button>
        <div v-else class="flex items-center gap-3">
          <button @click="cancelEdit" class="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-3 rounded-2xl font-bold transition-all text-sm">
            Cancel
          </button>
          <button @click="saveProfile" :disabled="isSaving" class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold shadow-md shadow-emerald-200 transition-all text-sm flex items-center gap-2">
            <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast-fade">
      <div v-if="message.text" :class="`fixed top-6 right-6 z-[100] max-w-md p-4 rounded-2xl flex items-start gap-3 shadow-2xl transition-all ${message.type === 'error' ? 'bg-white text-rose-800 border-l-4 border-l-rose-500' : 'bg-white text-emerald-800 border-l-4 border-l-emerald-500'}`">
        <svg v-if="message.type === 'success'" class="w-6 h-6 shrink-0 mt-0.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <svg v-else class="w-6 h-6 shrink-0 mt-0.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <div class="flex-grow">
          <h4 class="font-bold text-base text-slate-800">{{ message.type === 'success' ? 'Success' : 'Error' }}</h4>
          <p class="text-sm mt-1 text-slate-600 font-medium">{{ message.text }}</p>
        </div>
        <button @click="message.text = ''" class="shrink-0 text-slate-400 hover:text-slate-600">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </Transition>

    <!-- Main Content Grid -->
    <div class="space-y-8 animate-fade-in-up">
      
      <!-- Doctor Summary Header Card -->
      <div class="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 md:gap-10 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-80 h-80 bg-indigo-50/70 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-80 pointer-events-none"></div>

        <!-- Avatar -->
        <div class="w-28 h-28 md:w-36 md:h-36 shrink-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-full flex items-center justify-center text-4xl md:text-5xl font-black text-white shadow-xl shadow-indigo-300 relative z-10 border-4 border-white">
          {{ formData.firstName?.charAt(0) || 'D' }}{{ formData.lastName?.charAt(0) || '' }}
        </div>

        <div class="flex-grow text-center md:text-left space-y-3 z-10 w-full">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 class="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                Dr. {{ formData.firstName }} {{ formData.lastName }}
              </h2>
              <p class="text-indigo-600 font-bold text-sm md:text-base mt-1">
                {{ formData.specializations || 'Specialist Practitioner' }} &bull; {{ formData.qualifications || 'MBBS, MD' }}
              </p>
            </div>
            <div class="flex md:flex-col items-center md:items-end justify-center gap-1.5 bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-2xl">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Medical License</span>
              <span class="text-sm font-extrabold text-slate-800 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl border border-indigo-100">
                #{{ formData.registrationNumber || 'DOC-REG-9821' }}
              </span>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-sm text-slate-600 font-medium">
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              {{ formData.yearsOfExperience ?? 0 }} Years Experience
            </span>
            <span v-if="formData.emailId">&bull;</span>
            <span v-if="formData.emailId" class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              {{ formData.emailId }}
            </span>
            <span v-if="formData.primaryMobile">&bull;</span>
            <span v-if="formData.primaryMobile" class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              {{ formData.primaryMobile }}
            </span>
            <span v-if="formData.secondaryMobile">&bull;</span>
            <span v-if="formData.secondaryMobile" class="flex items-center gap-1.5 text-slate-500">
              <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              {{ formData.secondaryMobile }}
            </span>
          </div>
        </div>
      </div>

      <!-- 2 Columns: Credentials & Profile Details -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Left: Professional Credentials -->
        <div class="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col gap-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h3 class="text-xl font-extrabold text-slate-900">Professional Credentials</h3>
              <p class="text-xs text-slate-400 mt-0.5">Clinical qualifications and specialties</p>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
            </div>
          </div>

          <div class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Specializations</label>
              <input
                v-if="isEditing"
                v-model="formData.specializations"
                type="text"
                placeholder="e.g. Cardiology, Internal Medicine"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
              />
              <p v-else class="text-base font-bold text-slate-800">{{ formData.specializations || 'Cardiologist & Physician' }}</p>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Qualifications & Degrees</label>
              <input
                v-if="isEditing"
                v-model="formData.qualifications"
                type="text"
                placeholder="e.g. MBBS, MD (Cardiology), Fellowship (UK)"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
              />
              <p v-else class="text-base font-bold text-slate-800">{{ formData.qualifications || 'MBBS, MD (Cardiology)' }}</p>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Years of Experience</label>
                <input
                  v-if="isEditing"
                  v-model.number="formData.yearsOfExperience"
                  type="number"
                  min="0"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                />
                <p v-else class="text-base font-bold text-slate-800">{{ formData.yearsOfExperience ?? 0 }} Years</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Contact & Security -->
        <div class="flex flex-col gap-8">
          
          <!-- Contact Info -->
          <div class="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between border-b border-slate-100 pb-5 mb-5">
              <div>
                <h3 class="text-xl font-extrabold text-slate-900">Contact & Communications</h3>
                <p class="text-xs text-slate-400 mt-0.5">Doctor direct contact channels</p>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Official Email</label>
                <input
                  v-if="isEditing"
                  v-model="formData.emailId"
                  type="email"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                />
                <p v-else class="text-base font-bold text-slate-800">{{ formData.emailId || '—' }}</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Primary Mobile (10 Digits)</label>
                  <input
                    v-if="isEditing"
                    v-model="formData.primaryMobile"
                    type="tel"
                    maxlength="10"
                    placeholder="e.g. 9876543210"
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                  />
                  <p v-else class="text-base font-bold text-slate-800">{{ formData.primaryMobile || '—' }}</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Secondary Mobile (10 Digits)</label>
                  <input
                    v-if="isEditing"
                    v-model="formData.secondaryMobile"
                    type="tel"
                    maxlength="10"
                    placeholder="e.g. 9123456780"
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                  />
                  <p v-else class="text-base font-bold text-slate-800">{{ formData.secondaryMobile || '—' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Security & Password -->
          <div class="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between border-b border-slate-100 pb-5 mb-5">
              <div>
                <h3 class="text-xl font-extrabold text-slate-900">Security & Credentials</h3>
                <p class="text-xs text-slate-400 mt-0.5">Password and session controls</p>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-base font-bold text-slate-900">Password</h4>
                <p class="text-xs text-slate-400 mt-0.5">Change your practitioner login password regularly.</p>
              </div>
              <button
                @click="openPasswordModal = true"
                class="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition-all"
              >
                Change Password
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- Password Modal -->
    <Teleport to="body">
      <div v-if="openPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" @click.self="openPasswordModal = false">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-extrabold text-slate-900">Update Password</h3>
            <button @click="openPasswordModal = false" class="text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <form @submit.prevent="updatePassword" class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Current Password</label>
              <input v-model="passwordForm.currentPassword" type="password" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">New Password (Min 8 Characters)</label>
              <input v-model="passwordForm.newPassword" type="password" required minlength="8" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" />
            </div>
            <div class="pt-3 flex justify-end gap-3">
              <button type="button" @click="openPasswordModal = false" class="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200">Save</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { DoctorService } from '@/services/doctor.service';

const router = useRouter();
const authStore = useAuthStore();

const isLoading = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const openPasswordModal = ref(false);

const message = reactive({ text: '', type: '' });
const passwordForm = reactive({ currentPassword: '', newPassword: '' });

const formData = reactive({
  firstName: '',
  lastName: '',
  emailId: '',
  primaryMobile: '',
  secondaryMobile: '',
  registrationNumber: '',
  specializations: '',
  qualifications: '',
  yearsOfExperience: 0
});

const originalData = ref({});

const loadProfile = async () => {
  isLoading.value = true;
  message.text = '';
  try {
    const doctorId = authStore.user?.userId || authStore.user?.id;
    let data = null;
    if (doctorId) {
      try {
        data = await DoctorService.getDoctorById(doctorId);
      } catch (err) {
        console.warn('API doctor fetch failed, using authStore and defaults', err);
      }
    }

    const source = data || authStore.user || {};
    formData.firstName = source.firstName || '';
    formData.lastName = source.lastName || '';
    formData.emailId = source.emailId || source.email || '';
    formData.primaryMobile = source.primaryMobile || source.phone || '';
    formData.secondaryMobile = source.secondaryMobile || '';
    formData.registrationNumber = source.registrationNumber || '';
    formData.specializations = source.specializations || '';
    formData.qualifications = source.qualifications || '';
    formData.yearsOfExperience = source.yearsOfExperience ?? source.experienceYears ?? 0;

    originalData.value = JSON.parse(JSON.stringify(formData));
  } finally {
    isLoading.value = false;
  }
};

const toggleEdit = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  Object.assign(formData, originalData.value);
  isEditing.value = false;
};

const saveProfile = async () => {
  isSaving.value = true;
  message.text = '';
  try {
    const doctorId = authStore.user?.userId || authStore.user?.id;
    
    // Sanitize phone numbers to exactly 10 digits as required by backend schema
    const cleanPrimary = (formData.primaryMobile || '').replace(/\D/g, '').slice(-10);
    const cleanSecondary = (formData.secondaryMobile || '').replace(/\D/g, '').slice(-10);

    if (cleanPrimary.length !== 10) {
      throw new Error('Primary mobile number must be exactly 10 digits.');
    }

    const payload = {
      username: authStore.user?.username,
      firstName: formData.firstName?.trim(),
      lastName: formData.lastName?.trim(),
      emailId: formData.emailId?.trim(),
      primaryMobile: cleanPrimary,
      secondaryMobile: cleanSecondary || undefined,
      specializations: formData.specializations?.trim(),
      qualifications: formData.qualifications?.trim(),
      registrationNumber: formData.registrationNumber?.trim(),
      experienceYears: Number(formData.yearsOfExperience) || 0,
      gender: authStore.user?.gender || undefined,
      registrationIssueDate: authStore.user?.registrationIssueDate || undefined
    };

    if (doctorId) {
      await DoctorService.updateDoctorProfile(doctorId, payload);
    }

    // Reflect clean data back to local form and store
    formData.primaryMobile = cleanPrimary;
    formData.secondaryMobile = cleanSecondary;

    authStore.updateUser({
      ...authStore.user,
      firstName: formData.firstName,
      lastName: formData.lastName,
      emailId: formData.emailId,
      primaryMobile: cleanPrimary,
      secondaryMobile: cleanSecondary,
      specializations: formData.specializations,
      qualifications: formData.qualifications,
      registrationNumber: formData.registrationNumber,
      yearsOfExperience: formData.yearsOfExperience
    });

    originalData.value = JSON.parse(JSON.stringify(formData));
    isEditing.value = false;
    message.text = 'Doctor profile updated successfully!';
    message.type = 'success';
  } catch (err) {
    message.text = err.response?.data?.message || err.message || 'Failed to update profile. Please try again.';
    message.type = 'error';
  } finally {
    isSaving.value = false;
  }
};

const updatePassword = async () => {
  if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
    message.text = 'New password must be at least 8 characters long.';
    message.type = 'error';
    return;
  }

  try {
    const doctorId = authStore.user?.userId || authStore.user?.id;
    if (doctorId) {
      await DoctorService.updateDoctorPassword(doctorId, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
    }
    openPasswordModal.value = false;
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    message.text = 'Password updated successfully!';
    message.type = 'success';
  } catch (err) {
    message.text = err.response?.data?.message || 'Could not update password. Please check your current password.';
    message.type = 'error';
  }
};

onMounted(loadProfile);
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.35s ease-out forwards; }

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
