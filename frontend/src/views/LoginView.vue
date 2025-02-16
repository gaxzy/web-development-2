<template>
  <div>
    <h2>Login</h2>
    <form @submite.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthService from "../services/AuthService";

const email = ref<string>("");
const password = ref<string>("");
const error = ref<string>("");
const router = useRouter();

const handleLogin = async () => {
  try {
    await AuthService.login(email.value, password.value);
    router.push("/dashboard")
  } catch {
    error.value = "Invalid credentials"
  }
}
</script>
