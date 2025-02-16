<template>
  <div>
    <h2>Dashboard</h2>
    <p>You are logged in</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import AuthService from "../services/AuthService";

const router = useRouter()

const logout = () => {
  AuthService.logout();
  router.push("/login")
}
</script>
