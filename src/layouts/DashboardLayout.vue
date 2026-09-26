<template>
  <div class="min-h-screen bg-[#f8fafc] sm:bg-indigo-50/30 font-sans flex flex-col relative overflow-hidden">
    
    <!-- Decorative background elements -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/20 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-200/20 blur-3xl pointer-events-none"></div>

    <!-- Floating Glass Navbar -->
    <header class="sticky top-0 sm:top-6 z-50 sm:mx-6 lg:mx-auto max-w-[1600px] w-full sm:w-[calc(100%-3rem)] sm:rounded-2xl bg-white/80 backdrop-blur-xl border-b sm:border border-white/60 shadow-sm sm:shadow-lg shadow-indigo-900/5 px-4 sm:px-6 py-3 flex items-center justify-between transition-all">
      
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-indigo-300 text-xl transform hover:rotate-12 transition-transform cursor-pointer">K</div>
        <span class="font-extrabold text-xl tracking-tight text-slate-800 hidden sm:block">KhojHealth</span>
      </div>

      <!-- Desktop Nav (Modern Pill Segmented Controller) -->
      <nav v-if="authStore.userRole === 'patient'" class="hidden md:flex items-center gap-1.5 bg-slate-50/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-md">
        <router-link
          to="/dashboard/patient"
          exact-active-class="bg-white text-indigo-600 shadow-sm shadow-indigo-500/10 font-bold border border-slate-200/60"
          class="relative px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-white/60 transition-all duration-200 flex items-center gap-2 group"
        >
          <svg class="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </router-link>

        <router-link
          to="/dashboard/patient/appointments"
          active-class="bg-white text-indigo-600 shadow-sm shadow-indigo-500/10 font-bold border border-slate-200/60"
          class="relative px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-white/60 transition-all duration-200 flex items-center gap-2 group"
        >
          <svg class="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Appointments</span>
        </router-link>

        <router-link
          to="/dashboard/patient/notifications"
          active-class="bg-white text-indigo-600 shadow-sm shadow-indigo-500/10 font-bold border border-slate-200/60"
          class="relative px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-white/60 transition-all duration-200 flex items-center gap-2 group"
        >
          <svg class="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span>Notifications</span>
        </router-link>

        <router-link
          to="/dashboard/patient/prescriptions"
          active-class="bg-white text-indigo-600 shadow-sm shadow-indigo-500/10 font-bold border border-slate-200/60"
          class="relative px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-white/60 transition-all duration-200 flex items-center gap-2 group"
        >
          <svg class="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <span>Prescriptions</span>
        </router-link>
      </nav>

      <!-- User & Actions -->
      <div class="flex items-center gap-2 sm:gap-4">
         <!-- Notification Button & Dropdown -->
         <div class="relative" ref="notificationDropdownRef">
           <button
             @click="toggleNotificationDropdown"
             id="navbar-notification-btn"
             type="button"
             class="relative p-2.5 text-slate-500 hover:text-indigo-600 transition-all duration-200 rounded-xl hover:bg-indigo-50 focus:outline-none"
             title="Notifications"
           >
             <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
             </svg>
             <Transition
               enter-active-class="transition-all duration-300 ease-out"
               enter-from-class="opacity-0 scale-50"
               enter-to-class="opacity-100 scale-100"
               leave-active-class="transition-all duration-200 ease-in"
               leave-from-class="opacity-100 scale-100"
               leave-to-class="opacity-0 scale-50"
             >
               <span
                 v-if="unreadCount > 0"
                 class="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-600 px-1 text-[10px] font-black text-white shadow-lg shadow-rose-500/40 ring-2 ring-white"
               >
                 {{ unreadCount > 9 ? '9+' : unreadCount }}
               </span>
             </Transition>
           </button>

           <!-- Notifications Dropdown Panel -->
           <Transition
             enter-active-class="transition-all ease-out duration-200"
             enter-from-class="opacity-0 translate-y-2 scale-95"
             enter-to-class="opacity-100 translate-y-0 scale-100"
             leave-active-class="transition-all ease-in duration-150"
             leave-from-class="opacity-100 translate-y-0 scale-100"
             leave-to-class="opacity-0 translate-y-2 scale-95"
           >
             <div
               v-if="isNotificationDropdownOpen"
               class="absolute right-0 mt-5 w-[22rem] sm:w-[26rem] rounded-2xl z-50 overflow-hidden"
               style="box-shadow: 0 20px 60px -10px rgba(99,102,241,0.18), 0 8px 24px -4px rgba(0,0,0,0.12); border: 1px solid rgba(226,232,240,0.8);"
             >
               <!-- Frosted Glass Header -->
               <div class="px-4 py-3.5 flex items-center justify-between" style="background: linear-gradient(135deg, rgba(249,250,251,0.97) 0%, rgba(238,242,255,0.97) 100%); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(226,232,240,0.6);">
                 <div class="flex items-center gap-2.5">
                   <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-300/40">
                     <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                     </svg>
                   </div>
                   <div>
                     <h3 class="text-sm font-extrabold text-slate-800 leading-none">Notifications</h3>
                     <p class="text-[10px] text-slate-400 font-medium mt-0.5">
                       <span v-if="unreadCount > 0" class="text-indigo-500 font-bold">{{ unreadCount }} unread</span>
                       <span v-else>All caught up!</span>
                     </p>
                   </div>
                 </div>
                 <button
                   v-if="unreadCount > 0"
                   @click="markAllAsRead"
                   class="text-[11px] font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-200 hover:border-indigo-600 transition-all duration-200"
                 >
                   Mark all read
                 </button>
               </div>

               <!-- Notification List -->
               <div class="max-h-[26rem] overflow-y-auto overscroll-contain" style="background: rgba(255,255,255,0.98);">
                 <TransitionGroup
                   name="notif"
                   tag="div"
                   class="divide-y divide-slate-100/80 p-2 flex flex-col gap-0.5"
                 >
                   <div
                     v-for="item in recentNotifications"
                     :key="item.id"
                     class="notif-item group flex items-start gap-3 p-3 rounded-xl cursor-default transition-all duration-300"
                     :class="item.isRead
                       ? 'bg-transparent hover:bg-slate-50/60'
                       : 'bg-gradient-to-r from-indigo-50/60 to-blue-50/40 hover:from-indigo-50 hover:to-blue-50/60 border border-indigo-100/60'"
                   >
                     <!-- Icon / Dot -->
                     <div class="flex-shrink-0 mt-0.5">
                       <div
                         class="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300"
                         :class="item.isRead ? 'bg-slate-100' : 'bg-indigo-100 shadow-sm shadow-indigo-200'"
                       >
                         <svg
                           class="w-4 h-4 transition-colors duration-300"
                           :class="item.isRead ? 'text-slate-400' : 'text-indigo-600'"
                           fill="none" viewBox="0 0 24 24" stroke="currentColor"
                         >
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                       </div>
                     </div>

                     <!-- Content -->
                     <div class="flex-1 min-w-0">
                       <div class="flex items-start justify-between gap-2">
                         <p
                           class="text-xs font-bold leading-snug transition-colors duration-300"
                           :class="item.isRead ? 'text-slate-500' : 'text-slate-800'"
                         >{{ item.title || 'Notification' }}</p>
                         <!-- Unread dot -->
                         <span
                           v-if="!item.isRead"
                           class="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-500 mt-1 shadow-sm shadow-indigo-400"
                         />
                       </div>
                       <p
                         class="text-[11px] leading-relaxed mt-0.5 line-clamp-2 transition-colors duration-300"
                         :class="item.isRead ? 'text-slate-400' : 'text-slate-600'"
                       >{{ item.message }}</p>
                       <div class="flex items-center justify-between mt-1.5">
                         <span class="text-[10px] text-slate-400 font-medium">
                           {{ item.time || (item.createdAt ? formatTime(item.createdAt) : 'Just now') }}
                         </span>
                         <!-- Mark as Read -->
                         <Transition
                           enter-active-class="transition-all duration-300 ease-out"
                           enter-from-class="opacity-0 scale-75"
                           enter-to-class="opacity-100 scale-100"
                           leave-active-class="transition-all duration-200 ease-in"
                           leave-from-class="opacity-100 scale-100"
                           leave-to-class="opacity-0 scale-75"
                           mode="out-in"
                         >
                           <button
                             v-if="!item.isRead && !item._marking"
                             key="mark-btn"
                             @click.prevent.stop="markNotificationRead(item)"
                             class="flex items-center gap-1 text-[10px] font-bold text-indigo-500 hover:text-white bg-white hover:bg-indigo-600 px-2 py-1 rounded-lg border border-indigo-200 hover:border-transparent shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                           >
                             <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                             </svg>
                             Mark read
                           </button>
                           <span
                             v-else-if="item._marking"
                             key="marking"
                             class="flex items-center gap-1 text-[10px] font-semibold text-indigo-400 px-1"
                           >
                             <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                             </svg>
                           </span>
                           <span
                             v-else
                             key="read-badge"
                             class="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200"
                           >
                             <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                             </svg>
                             Read
                           </span>
                         </Transition>
                       </div>
                     </div>
                   </div>
                 </TransitionGroup>

                 <div v-if="recentNotifications.length === 0" class="py-12 text-center">
                   <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                     <svg class="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                     </svg>
                   </div>
                   <p class="text-sm font-bold text-slate-400">You're all caught up!</p>
                   <p class="text-xs text-slate-300 mt-1">No new notifications</p>
                 </div>
               </div>

               <!-- Footer -->
               <div class="px-4 py-2.5 text-center" style="background: rgba(248,250,252,0.95); border-top: 1px solid rgba(226,232,240,0.6);">
                 <span class="text-[10px] text-slate-400 font-medium">{{ recentNotifications.length }} unread notification{{ recentNotifications.length !== 1 ? `s` : `` }} shown</span>
               </div>
             </div>
           </Transition>
         </div>
         
         <div class="flex items-center gap-3 sm:border-l border-slate-200 sm:pl-4">
            <div class="hidden lg:block text-right">
               <p class="text-sm font-bold text-slate-800 leading-tight">{{ authStore.user?.firstName || 'Guest' }}</p>
               <p class="text-[10px] uppercase font-black text-indigo-500 tracking-wider">{{ authStore.user?.role || 'Patient' }}</p>
            </div>
            
            <button class="focus:outline-none hover:ring-4 hover:ring-indigo-100 transition-all rounded-xl relative group">
              <img class="w-10 h-10 rounded-xl object-cover shadow-sm" :src="`https://ui-avatars.com/api/?name=${authStore.user?.firstName || 'G'}+${authStore.user?.lastName || 'U'}&background=4f46e5&color=fff`" alt="Avatar">
              <div class="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10"></div>
            </button>
            
            <button @click="showLogoutModal = true" id="navbar-logout-btn" class="hidden sm:flex p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all" title="Logout">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
         </div>

         <!-- Mobile Menu Toggle -->
         <button @click="toggleMobileMenu" class="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl">
           <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
         </button>
      </div>
    </header>

    <!-- Mobile Nav Overlay -->
    <div v-if="isMobileMenuOpen" class="md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-24 px-6 flex flex-col gap-3 animate-fade-in-up">
        <template v-if="authStore.userRole === 'patient'">
          <router-link
            to="/dashboard/patient"
            @click="isMobileMenuOpen = false"
            exact-active-class="bg-indigo-50 text-indigo-600 font-bold border-indigo-200"
            class="px-4 py-3 rounded-2xl border border-slate-100 text-slate-700 font-semibold flex items-center gap-3 transition-colors"
          >
            <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </router-link>

          <router-link
            to="/dashboard/patient/appointments"
            @click="isMobileMenuOpen = false"
            active-class="bg-indigo-50 text-indigo-600 font-bold border-indigo-200"
            class="px-4 py-3 rounded-2xl border border-slate-100 text-slate-700 font-semibold flex items-center gap-3 transition-colors"
          >
            <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upcoming Appointments
          </router-link>

          <router-link
            to="/dashboard/patient/notifications"
            @click="isMobileMenuOpen = false"
            active-class="bg-indigo-50 text-indigo-600 font-bold border-indigo-200"
            class="px-4 py-3 rounded-2xl border border-slate-100 text-slate-700 font-semibold flex items-center gap-3 transition-colors"
          >
            <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            Notifications
          </router-link>

          <router-link
            to="/dashboard/patient/prescriptions"
            @click="isMobileMenuOpen = false"
            active-class="bg-indigo-50 text-indigo-600 font-bold border-indigo-200"
            class="px-4 py-3 rounded-2xl border border-slate-100 text-slate-700 font-semibold flex items-center gap-3 transition-colors"
          >
            <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Recent Prescriptions
          </router-link>
        </template>

        <button @click="showLogoutModal = true" id="mobile-logout-btn" class="mt-auto mb-10 px-6 py-4 rounded-2xl bg-rose-50 text-rose-600 font-bold text-lg flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </button>
    </div>

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-8 sm:py-10 relative z-10 flex flex-col h-full">
      <router-view />
    </main>

    <!-- Minimal Footer -->
    <footer class="max-w-[1600px] mx-auto w-full py-6 px-6 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-xs sm:text-sm font-medium z-10 gap-4">
       <p>&copy; 2026 KhojHealth. All rights reserved.</p>
       <div class="flex gap-6">
         <a href="#" class="hover:text-indigo-600 transition-colors">Privacy Policy</a>
         <a href="#" class="hover:text-indigo-600 transition-colors">Terms of Service</a>
       </div>
    </footer>
    <LogoutModal
      :show="showLogoutModal"
      :role="authStore.userRole || 'patient'"
      :user-name="`${authStore.user?.firstName || ''} ${authStore.user?.lastName || ''}`.trim()"
      @confirm="confirmLogout"
      @cancel="showLogoutModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import LogoutModal from '@/components/LogoutModal.vue';
import { PatientService } from '@/services/patient.service';

const authStore = useAuthStore();
const router = useRouter();
const isMobileMenuOpen = ref(false);
const showLogoutModal = ref(false);

// Notification State
const isNotificationDropdownOpen = ref(false);
const notificationDropdownRef = ref(null);
const notificationsList = ref([]);

const unreadCount = computed(() => {
  return notificationsList.value.filter(n => !n.isRead).length;
});

const recentNotifications = computed(() => {
  const unread = notificationsList.value.filter(n => !n.isRead);
  return unread.slice(0, 3);
});

const toggleNotificationDropdown = () => {
  isNotificationDropdownOpen.value = !isNotificationDropdownOpen.value;
  if (isNotificationDropdownOpen.value && notificationsList.value.length === 0) {
    fetchNotifications();
  }
};

const fetchNotifications = async () => {
  try {
    const userId = authStore.user?.userId || authStore.user?.id;
    const username = authStore.user?.username;
    if (!userId && !username) return;

    const list = await PatientService.getNotifications(userId, username);
    if (list && list.length > 0) {
      notificationsList.value = list;
    } else {
      // Fallback to unread notifications from dashboard
      const dash = await PatientService.getDashboardData(userId, username);
      notificationsList.value = (dash.notifications || []).map(n => ({
        ...n,
        isRead: Boolean(n.isRead),
        time: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recently'
      }));
    }
  } catch (err) {
    console.warn('Failed to fetch notifications in layout:', err);
  }
};

const markNotificationRead = async (notification) => {
  if (!notification || !notification.id || notification.isRead) return;
  notification._marking = true;
  try {
    await PatientService.markNotificationAsRead(notification.id);
    await new Promise(r => setTimeout(r, 350));
    notification.isRead = true;
  } catch (err) {
    console.warn('Error marking notification as read:', err);
  } finally {
    notification._marking = false;
  }
};

const markAllAsRead = async () => {
  const unread = notificationsList.value.filter(n => !n.isRead);
  unread.forEach(n => { n._marking = true; });
  await Promise.allSettled(unread.map(n => PatientService.markNotificationAsRead(n.id)));
  await new Promise(r => setTimeout(r, 350));
  unread.forEach(n => { n.isRead = true; n._marking = false; });
  isNotificationDropdownOpen.value = false;
};

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Handle outside clicks to close notification dropdown
const handleClickOutside = (event) => {
  if (notificationDropdownRef.value && !notificationDropdownRef.value.contains(event.target)) {
    isNotificationDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  fetchNotifications();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const confirmLogout = async () => {
  showLogoutModal.value = false;
  isMobileMenuOpen.value = false;
  // Capture role BEFORE logout clears the user state
  const role = authStore.userRole || 'patient';
  await authStore.logout();
  router.push(`/login/${role}`);
};
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}

/* Notification list TransitionGroup */
.notif-move,
.notif-enter-active,
.notif-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.notif-enter-from {
  opacity: 0;
  transform: translateX(-16px) scale(0.95);
}
.notif-leave-to {
  opacity: 0;
  transform: translateX(16px) scale(0.95);
}
.notif-leave-active {
  position: absolute;
  width: calc(100% - 1rem); /* Accounting for padding/margins if necessary */
}

/* Scrollbar for notification list */
.max-h-\[26rem\]::-webkit-scrollbar {
  width: 4px;
}
.max-h-\[26rem\]::-webkit-scrollbar-track {
  background: transparent;
}
.max-h-\[26rem\]::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 99px;
}
.max-h-\[26rem\]::-webkit-scrollbar-thumb:hover {
  background: #c7d2fe;
}
</style>






