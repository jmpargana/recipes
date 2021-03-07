<template>
  <div class="flex flex-col bg-gray-200 w-full items-center">
    <div class="my-4 sm:my-16"></div>
    <div class="flex flex-col w-3/4 sm:w-1/4 border shadow-md rounded-lg bg-white">
      <div class="text-center m-1 py-4 border-b-2 border-gray-200">
        <h2 class="text-center text-2xl font-semibold text-gray-700">Welcome</h2>
      </div>
      <div class="flex flex-col m-4">
        <input class="mx-2 mt-4 sm:mx-12 py-3 border rounded-md outline-none" type="text" placeholder="User" />
        <input class="mx-2 mt-2 sm:mx-12 py-3 border rounded-md outline-none" type="text" placeholder="Password" />
        <button class="mx-2 my-4 sm:mx-12 py-3 border rounded-sm bg-blue-500 text-white outline-none hover:bg-blue-700">LOGIN</button>
      </div>
      <div class="m-1 border-t-2 border-gray-100 p-4 flex justify-around items-center">
        <button class="text-blue-700 hover:text-blue-900">Sign in!</button>
        <button class="text-gray-500 hover:text-gray-700">Forgot password?</button>
      </div>
    </div>
  </div>
</template>
