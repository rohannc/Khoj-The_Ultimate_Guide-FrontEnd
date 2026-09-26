<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="show"
        class="logout-modal-backdrop"
        @click.self="$emit('cancel')"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        <Transition name="modal-slide">
          <div v-if="show" class="logout-modal-card">

            <!-- Gradient Header -->
            <div class="logout-modal-header" :class="headerClass">
              <!-- Wavy background decoration -->
              <div class="header-wave"></div>

              <!-- Exit icon circle -->
              <div class="header-icon-ring">
                <svg class="header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>

              <h2 id="logout-modal-title" class="header-title">Ready to leave?</h2>

              <!-- Role pill -->
              <div class="header-role-pill">
                <span class="header-role-dot"></span>
                {{ roleName }}
              </div>
            </div>

            <!-- Body -->
            <div class="logout-modal-body">

              <!-- User info row -->
              <div class="user-row" v-if="userName">
                <div class="user-avatar" :class="avatarClass">
                  {{ initials }}
                </div>
                <div class="user-info">
                  <p class="user-name">{{ userName }}</p>
                  <p class="user-role" :class="userRoleClass">{{ roleName }}</p>
                </div>
                <div class="user-status-dot"></div>
              </div>

              <div class="modal-divider"></div>

              <p class="modal-desc">
                You will be securely signed out. All local session data will be cleared from this device.
              </p>

              <!-- Actions: Vertical Stacked Action Sheet -->
              <div class="modal-actions">
                <button
                  id="logout-confirm-btn"
                  class="btn-confirm"
                  @click="$emit('confirm')"
                >
                  <span>Yes, log out</span>
                  <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                      d="M17 16l4-4m0 0l-4-4m4 4H7" />
                  </svg>
                </button>
                <button
                  id="logout-cancel-btn"
                  class="btn-cancel"
                  @click="$emit('cancel')"
                >
                  <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <span>Stay logged in</span>
                </button>
              </div>

            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  show:     { type: Boolean, default: false },
  role:     { type: String,  default: 'patient' },
  userName: { type: String,  default: '' },
});
defineEmits(['confirm', 'cancel']);

const roleName = computed(() => {
  const map = { patient: 'Patient Portal', doctor: 'Doctor Portal', clinic: 'Clinic Portal' };
  return map[props.role] ?? 'KhojHealth';
});

const initials = computed(() => {
  if (!props.userName) return '?';
  return props.userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
});

// patient=blue  |  doctor=amber  |  clinic=green
const headerClass    = computed(() => `header-${props.role}`);
const avatarClass    = computed(() => `avatar-${props.role}`);
const userRoleClass  = computed(() => `role-text-${props.role}`);
</script>

<style scoped>
/* ─── Backdrop ──────────────────────────────────── */
.logout-modal-backdrop {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; align-items: center; justify-content: center; padding: 1rem;
  background: rgba(10, 15, 30, 0.65);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
}

/* ─── Card ──────────────────────────────────────── */
.logout-modal-card {
  width: 100%; max-width: 400px;
  background: #ffffff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow:
    0 32px 80px rgba(0,0,0,0.18),
    0 8px 24px rgba(0,0,0,0.08);
}

/* ─── Header ────────────────────────────────────── */
.logout-modal-header {
  position: relative;
  padding: 2.5rem 1.5rem 2rem;
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  overflow: hidden;
}
.header-patient { background: linear-gradient(145deg, #3b82f6, #1d4ed8); }
.header-doctor  { background: linear-gradient(145deg, #f59e0b, #d97706); }
.header-clinic  { background: linear-gradient(145deg, #22c55e, #16a34a); }

/* wavy blob decoration */
.header-wave {
  position: absolute;
  width: 200%; height: 200%;
  top: -80%; left: -50%;
  background: rgba(255,255,255,0.06);
  border-radius: 40%;
  animation: wave-spin 12s linear infinite;
  pointer-events: none;
}
@keyframes wave-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* icon circle */
.header-icon-ring {
  position: relative; z-index: 1;
  width: 80px; height: 80px;
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(8px);
  border: 2px solid rgba(255,255,255,0.35);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3);
}
.header-icon {
  width: 36px; height: 36px; color: #fff;
}
.header-title {
  position: relative; z-index: 1;
  font-size: 1.6rem; font-weight: 800;
  color: #fff; letter-spacing: -0.03em; margin: 0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.header-role-pill {
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: 0.4rem;
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.25);
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  font-size: 0.72rem; font-weight: 700;
  color: rgba(255,255,255,0.95);
  letter-spacing: 0.06em; text-transform: uppercase;
}
.header-role-dot {
  width: 6px; height: 6px;
  background: rgba(255,255,255,0.8);
  border-radius: 50%;
  animation: blink 2s ease-in-out infinite;
}
@keyframes blink {
  0%,100% { opacity: 1; } 50% { opacity: 0.4; }
}

/* ─── Body ──────────────────────────────────────── */
.logout-modal-body {
  padding: 1.5rem 1.5rem 1.75rem;
  display: flex; flex-direction: column; gap: 1rem;
}

/* user row */
.user-row {
  display: flex; align-items: center; gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
}
.user-avatar {
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 0.95rem; color: white;
  flex-shrink: 0;
}
.avatar-patient { background: linear-gradient(135deg, #60a5fa, #2563eb); }
.avatar-doctor  { background: linear-gradient(135deg, #fbbf24, #d97706); }
.avatar-clinic  { background: linear-gradient(135deg, #4ade80, #16a34a); }

.user-info { flex: 1; min-width: 0; }
.user-name {
  font-size: 0.9rem; font-weight: 700; color: #0f172a;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.user-role {
  font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
  margin-top: 0.1rem;
}
.role-text-patient { color: #2563eb; }
.role-text-doctor  { color: #d97706; }
.role-text-clinic  { color: #16a34a; }

.user-status-dot {
  width: 8px; height: 8px;
  background: #22c55e; border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
  flex-shrink: 0;
}

.modal-divider { height: 1px; background: #f1f5f9; }

.modal-desc {
  font-size: 0.875rem; color: #64748b;
  line-height: 1.65; margin: 0; text-align: center;
}

/* ─── Buttons: Vertical Stacked Action Sheet ─────── */
.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-top: 0.35rem;
}

.btn-confirm {
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 0.95rem 1.25rem;
  border-radius: 18px;
  border: none;
  background: linear-gradient(135deg, #fb7185 0%, #e11d48 50%, #be123c 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.925rem;
  letter-spacing: 0.015em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
  box-shadow: 0 6px 20px rgba(225, 29, 72, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.btn-confirm::before {
  content: '';
  position: absolute;
  top: 0; left: -100%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  transition: left 0.65s ease;
}

.btn-confirm:hover::before {
  left: 100%;
}

.btn-confirm:hover {
  transform: translateY(-2px) scale(1.015);
  box-shadow: 0 10px 30px rgba(225, 29, 72, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  background: linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #9f1239 100%);
}

.btn-confirm:active {
  transform: translateY(0) scale(0.985);
  box-shadow: 0 3px 12px rgba(225, 29, 72, 0.3);
}

.btn-confirm .btn-icon {
  transition: transform 0.25s cubic-bezier(0.34, 1.5, 0.64, 1);
}

.btn-confirm:hover .btn-icon {
  transform: translateX(4px) scale(1.15);
}

.btn-cancel {
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 0.85rem 1.1rem;
  border-radius: 18px;
  border: 1.5px solid transparent;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-cancel:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #1e293b;
  transform: translateY(-1px);
}

.btn-cancel:active {
  transform: translateY(0);
  background: #f1f5f9;
}

.btn-cancel .btn-icon {
  transition: transform 0.25s ease;
}

.btn-cancel:hover .btn-icon {
  transform: rotate(90deg) scale(1.1);
}

.btn-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* ─── Transitions ───────────────────────────────── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.modal-slide-enter-active { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-slide-leave-active { transition: all 0.18s ease-in; }
.modal-slide-enter-from { opacity: 0; transform: scale(0.88) translateY(28px); }
.modal-slide-leave-to   { opacity: 0; transform: scale(0.95) translateY(12px); }
</style>
