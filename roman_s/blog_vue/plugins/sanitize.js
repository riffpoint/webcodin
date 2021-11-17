import Vue from 'vue';
import VSanitize from "v-sanitize";
 
Vue.use(VSanitize, { allowedTags: ['strong', 'p', 'br', 'ul', 'li'] });
