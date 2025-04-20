<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-blue-700 text-white shadow-md">
      <nav
        class="container mx-auto px-4 py-3 flex justify-between items-center"
      >
        <div class="flex items-center space-x-4">
          <NuxtLink to="/" class="text-xl font-bold"
            >📈 股票付款模擬平台</NuxtLink
          >
        </div>
        <div class="flex items-center space-x-6">
          <NuxtLink to="/" class="hover:text-blue-200">搜尋個股</NuxtLink>
          <NuxtLink to="/cart" class="hover:text-blue-200">購物車</NuxtLink>
          <NuxtLink to="/admin/orders" class="hover:text-blue-200"
            >交易紀錄</NuxtLink
          >
        </div>
      </nav>
    </header>

    <main class="container mx-auto px-4 py-6 flex-grow">
      <slot />
    </main>

    <footer class="bg-gray-100 text-gray-600 py-6">
      <div class="container mx-auto px-4 text-center">
        <p>股票付款模擬平台 &copy; {{ new Date().getFullYear() }}</p>
        <p class="text-sm mt-2">使用 TWSE API 與 ECPay 測試環境</p>
      </div>
    </footer>
  </div>
</template>
