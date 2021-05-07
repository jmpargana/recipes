<template>
  <div class="flex flex-col items-center w-full bg-gray-200">
    <div class="my-4 sm:my-16"></div>
    <div
      class="flex flex-col w-3/4 bg-white border rounded-lg shadow-md md:w-2/5 lg:w-1/4"
    >
      <div class="py-4 m-1 text-center border-b-2 border-gray-200">
        <h2 class="text-2xl font-semibold text-center text-gray-700">
          Welcome
        </h2>
      </div>
      <div class="flex flex-col m-4">
        <input
          required
          v-model="email"
          :class="{ 'ring-2 ring-red-500': invalidMail }"
          class="py-3 mx-2 mt-4 border outline-none sm:mx-12 rounded-md"
          type="email"
          placeholder="User mail"
        />
        <input
          required
          v-model="pass"
          class="py-3 mx-2 mt-2 border outline-none sm:mx-12 rounded-md"
          type="text"
          placeholder="Password"
        />
        <input
          v-model="passRepeat"
          v-if="signIn"
          :class="{ 'ring-2 ring-red-500': invalidPass }"
          class="py-3 mx-2 mt-2 border outline-none sm:mx-12 rounded-md"
          type="text"
          placeholder="Repeat password"
        />
        <button
          class="py-3 mx-2 my-4 text-white bg-blue-500 border rounded-sm outline-none sm:mx-12 hover:bg-blue-700"
          @click="submit"
        >
          {{ signIn ? "SIGN IN" : "LOGIN" }}
        </button>
      </div>
      <div
        class="flex items-center justify-around p-4 m-1 border-t-2 border-gray-100"
      >
        <button class="text-blue-700 hover:text-blue-900" @click="toggleSignIn">
          {{ signIn ? "Login" : "Sign in!" }}
        </button>
        <button class="text-gray-500 hover:text-gray-700">
          Forgot password?
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";

const api = process.env.VUE_APP_API_ENDPOINT ?? "http://localhost:3000/api";

export default {
  setup() {
    const store = useStore();
    const signIn = ref(false);
    const invalidMail = ref(false);
    const invalidPass = ref(false);
    const email = ref("");
    const pass = ref("");
    const passRepeat = ref("");

    const toggleSignIn = () => {
      signIn.value = !signIn.value;
    };

    const validateEmail = () =>
      /^\w+([.-]?]w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email.value);

    const submit = () => {
      if (!validateEmail()) {
        invalidMail.value = true;
        return;
      }
      if (signIn.value && pass.value !== passRepeat.value) {
        invalidPass.value = true;
        return;
      }
      invalidMail.value = false;
      invalidPass.value = false;

      // Calls API to register or login
      signIn.value ? callSignIn() : callLogin();
    };

    const callLogin = async () => {
      console.log("Calling backend in: ", api);
      const res = await axios.post(api + "/login", {
        email,
        password: pass,
      });
      if (res.status !== 200) {
        alert("Could not login!");
        return;
      }
    };

    const callSignIn = async () => {
      const res = await axios.post(api + "/register", {
        email,
        password: pass,
      });
      if (res.status !== 200) {
        alert("Could not register!");
        return;
      }
      console.log(store);
    };

    return {
      signIn,
      toggleSignIn,
      validateEmail,
      email,
      pass,
      passRepeat,
      submit,
      invalidMail,
      invalidPass,
    };
  },
};
</script>
