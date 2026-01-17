<template>
  <div class="change-pwd-container">
    <h1>修改密码（强力推荐！）</h1>
    <form @submit.prevent="handleChangePassword">
      <div class="form-group">
        <label>旧密码：</label>
        <input type="password" v-model="oldPassword" required class="input-field">
      </div>
      <div class="form-group">
        <label>新密码：</label>
        <input
            type="password"
            v-model="newPassword"
            required
            @input="validatePasswordStrength"
            class="input-field"
        >
        <span v-if="passwordStrengthError" class="error-message">{{ passwordStrengthError }}</span>
      </div>
      <div class="form-group">
        <label>确认新密码：</label>
        <input type="password" v-model="confirmPassword" required class="input-field">
        <span v-if="passwordMatchError" class="error-message">{{ passwordMatchError }}</span>
      </div>
      <button type="submit" :disabled="isFormDisabled" class="submit-btn">提交修改</button>
      <div v-if="errorMsg" class="error-message fade-in">{{ errorMsg }}</div>
      <div v-if="successMsg" class="success-message fade-in">{{ successMsg }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from "../api/api.js";

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const passwordStrengthError = ref('')
const passwordMatchError = ref('')
const isFormDisabled = ref(false)

const validatePasswordStrength = () => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  passwordStrengthError.value = !regex.test(newPassword.value)
      ? '新密码必须包含字母和数字，且至少8个字符长！'
      : '';
}

const validatePasswordsMatch = () => {
  passwordMatchError.value = newPassword.value !== confirmPassword.value
      ? '新密码与确认密码不一致！'
      : '';
}

const handleChangePassword = async () => {
  errorMsg.value = successMsg.value = '';
  validatePasswordsMatch();
  validatePasswordStrength();

  if (passwordStrengthError.value || passwordMatchError.value) return;

  isFormDisabled.value = true;

  try {
    const response = await api.post('/user/change-pwd', {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });

    successMsg.value = response.data.message;
    oldPassword.value = newPassword.value = confirmPassword.value = ''; // 清空输入框
  } catch (error) {
    errorMsg.value = error.response?.data?.error || '密码修改失败！';
  } finally {
    isFormDisabled.value = false;
  }
}
</script>

<style scoped>
.change-pwd-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #444;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background-color: #1e1e1e;
  color: #ddd;
  transition: background-color 0.3s ease;
}

h1 {
  text-align: center;
  color: #00d9ff;
  margin-bottom: 1.5rem;
  animation: fadeIn 1s ease-out;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #bbb;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #555;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #333;
  color: #ddd;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #00d9ff;
  outline: none;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #00d9ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: transform 0.2s ease-in-out;
}

button:hover {
  background-color: #007bbf;
  transform: scale(1.05);
}

button:disabled {
  background-color: #444;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
}

.success-message {
  color: #2ecc71;
  font-size: 0.9rem;
}

.fade-in {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>