<template>
  <div class="flex flex-col bg-gray-200 w-full items-center">
    <div class="my-4 sm:my-16"></div>
    <div
      class="flex flex-col w-3/4 md:w-2/5 lg:w-1/4 border shadow-md rounded-lg bg-white"
    >
      <div class="text-center m-1 py-4 border-b-2 border-gray-200">
        <h2 class="text-center text-2xl font-semibold text-gray-700">
          Welcome
        </h2>
      </div>
      <div class="flex flex-col m-4">
        <input
          required
          v-model="email"
          :class="{ 'ring-2 ring-red-500': invalidMail }"
          class="mx-2 mt-4 sm:mx-12 py-3 border rounded-md outline-none"
          type="email"
          placeholder="User mail"
        />
        <input
          required
          v-model="pass"
          class="mx-2 mt-2 sm:mx-12 py-3 border rounded-md outline-none"
          type="text"
          placeholder="Password"
        />
        <input
          v-model="passRepeat"
          v-if="signIn"
          :class="{ 'ring-2 ring-red-500': invalidPass }"
          class="mx-2 mt-2 sm:mx-12 py-3 border rounded-md outline-none"
          type="text"
          placeholder="Repeat password"
        />
        <button
          class="mx-2 my-4 sm:mx-12 py-3 border rounded-sm bg-blue-500 text-white outline-none hover:bg-blue-700"
          @click="submit"
        >
          {{ signIn ? "SIGN IN" : "LOGIN" }}
        </button>
      </div>
      <div
        class="m-1 border-t-2 border-gray-100 p-4 flex justify-around items-center"
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
      const res = await axios.post(api + "/login", { email, password: pass });
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
