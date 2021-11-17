<template>
  <!-- <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58" style="&#10;" :class="`loader-${color}`">
    <g fill="none" fill-rule="evenodd">
      <g transform="translate(2 1)" stroke="#FFF" stroke-width="1.5">
        <circle cx="42.601" cy="11.462" r="5" fill-opacity="1" fill="#fff">
          <animate attributeName="fill-opacity" begin="0s" dur="2s" values="1;0;0;0;0;0;0;0" calcMode="linear" repeatCount="indefinite"/>
        </circle>
        <circle cx="49.063" cy="27.063" r="5" fill-opacity="0" fill="#fff">
          <animate attributeName="fill-opacity" begin="0s" dur="2s" values="0;1;0;0;0;0;0;0" calcMode="linear" repeatCount="indefinite"/>
        </circle>
        <circle cx="42.601" cy="42.663" r="5" fill-opacity="0" fill="#fff">
          <animate attributeName="fill-opacity" begin="0s" dur="2s" values="0;0;1;0;0;0;0;0" calcMode="linear" repeatCount="indefinite"/>
        </circle>
        <circle cx="27" cy="49.125" r="5" fill-opacity="0" fill="#fff">
          <animate attributeName="fill-opacity" begin="0s" dur="2s" values="0;0;0;1;0;0;0;0" calcMode="linear" repeatCount="indefinite"/>
        </circle>
        <circle cx="11.399" cy="42.663" r="5" fill-opacity="0" fill="#fff">
          <animate attributeName="fill-opacity" begin="0s" dur="2s" values="0;0;0;0;1;0;0;0" calcMode="linear" repeatCount="indefinite"/>
        </circle>
        <circle cx="4.938" cy="27.063" r="5" fill-opacity="0" fill="#fff">
          <animate attributeName="fill-opacity" begin="0s" dur="2s" values="0;0;0;0;0;1;0;0" calcMode="linear" repeatCount="indefinite"/>
        </circle>
        <circle cx="11.399" cy="11.462" r="5" fill-opacity="0" fill="#fff">
          <animate attributeName="fill-opacity" begin="0s" dur="2s" values="0;0;0;0;0;0;1;0" calcMode="linear" repeatCount="indefinite"/>
        </circle>
        <circle cx="27" cy="5" r="5" fill-opacity="0" fill="#fff">
          <animate attributeName="fill-opacity" begin="0s" dur="2s" values="0;0;0;0;0;0;0;1" calcMode="linear" repeatCount="indefinite"/>
        </circle>
      </g>
    </g>
  </svg> -->
  <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" stroke="#fff" class="loader-custom" :class="`loader-${color}`">
    <g fill="none" fill-rule="evenodd">
      <g transform="translate(1 1)" stroke-width="2">
        <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/>
        </path>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: true
    }
  }
}
</script>
