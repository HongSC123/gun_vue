<template>
  <div class="h-100 d-flex align-center justify-space-between">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      Made With
      <VIcon
        icon="mdi-heart-outline"
        color="error"
        size="1.25rem"
        class="mx-1"
      />
      By <a class="text-primary ms-1">라따뚜AI</a>
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-primary d-none">
      <a target="noopener noreferrer" />
      <a target="noopener noreferrer" />
      <a target="noopener noreferrer">건강을 부탁해</a>
    </span>
  </div>
</template>
