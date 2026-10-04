<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40 font-sans">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <router-link to="/dashboard/doctor" class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </router-link>
        </div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Consultation Revenue & Earnings
          </h1>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Billing Active
          </span>
        </div>
        <p class="text-slate-500 mt-1 font-medium text-xs sm:text-sm">Summary of consultation collections, clinic settlement payouts, and invoices.</p>
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-3">
        <button
          @click="requestPayout"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-200 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          Request Clinic Payout
        </button>
      </div>
    </div>

    <!-- Financial KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[1.75rem] p-5 shadow-sm">
        <span class="text-xs font-bold text-slate-400 uppercase">This Month's Revenue</span>
        <div class="text-3xl font-black text-slate-900 mt-1">₹42,800</div>
        <p class="text-xs text-emerald-600 font-semibold mt-1">↑ +14.2% vs last month</p>
      </div>

      <div class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[1.75rem] p-5 shadow-sm">
        <span class="text-xs font-bold text-slate-400 uppercase">Pending Settlement</span>
        <div class="text-3xl font-black text-amber-600 mt-1">₹14,400</div>
        <p class="text-xs text-slate-500 font-medium mt-1">From 2 affiliated clinics</p>
      </div>

      <div class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[1.75rem] p-5 shadow-sm">
        <span class="text-xs font-bold text-slate-400 uppercase">Total Completed Visits</span>
        <div class="text-3xl font-black text-indigo-600 mt-1">68</div>
        <p class="text-xs text-slate-500 font-medium mt-1">Average ₹630 / consult</p>
      </div>

      <div class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[1.75rem] p-5 shadow-sm">
        <span class="text-xs font-bold text-slate-400 uppercase">Disbursed to Bank</span>
        <div class="text-3xl font-black text-emerald-600 mt-1">₹28,400</div>
        <p class="text-xs text-slate-500 font-medium mt-1">Settled on 20 Sep 2026</p>
      </div>
    </div>

    <!-- Transactions & Payouts Table -->
    <div class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm flex-1 flex flex-col">
      <h3 class="text-lg font-extrabold text-slate-800 mb-4">Recent Consultation Settlements</h3>

      <div class="space-y-3 overflow-y-auto flex-1">
        <div
          v-for="tx in transactions"
          :key="tx.id"
          class="p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ₹
            </div>
            <div>
              <h4 class="font-bold text-sm text-slate-900">{{ tx.patientName }} &bull; {{ tx.clinicName }}</h4>
              <p class="text-xs text-slate-400 mt-0.5">{{ tx.type }} &bull; Inv #{{ tx.invoiceNo }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <span class="text-xs text-slate-400 font-medium">{{ tx.date }}</span>
            <span class="text-sm font-black text-slate-900">₹{{ tx.amount }}</span>
            <span
              class="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase"
              :class="tx.status === 'SETTLED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'"
            >
              {{ tx.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const transactions = ref([
  { id: 'tx-1', patientName: 'Rohan Chakraborty', clinicName: 'Apollo Clinic', invoiceNo: 'INV-9021', type: 'In-Clinic Consult', date: 'Today, 10:45 AM', amount: 600, status: 'SETTLED' },
  { id: 'tx-2', patientName: 'Ananya Sharma', clinicName: 'Fortis Health Point', invoiceNo: 'INV-9022', type: 'Hypertension Follow-up', date: 'Today, 11:30 AM', amount: 800, status: 'SETTLED' },
  { id: 'tx-3', patientName: 'Vikram Patel', clinicName: 'Apollo Clinic', invoiceNo: 'INV-9023', type: 'Post-Op Monitoring', date: 'Today, 02:15 PM', amount: 600, status: 'PENDING' },
  { id: 'tx-4', patientName: 'Pooja Iyer', clinicName: 'Fortis Health Point', invoiceNo: 'INV-9018', type: 'Lipid Profile Review', date: '28 Sep 2026', amount: 800, status: 'SETTLED' },
  { id: 'tx-5', patientName: 'Suresh Menon', clinicName: 'Apollo Clinic', invoiceNo: 'INV-9015', type: 'Comprehensive Cardiac Review', date: '26 Sep 2026', amount: 1200, status: 'SETTLED' },
]);

const requestPayout = () => {
  alert('Payout request of ₹14,400 initiated to registered doctor bank account.');
};
</script>
