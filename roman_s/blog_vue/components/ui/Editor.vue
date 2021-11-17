<template>
  <client-only>
    <div class="text-editor" ref="editor-content">
      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <div class="text-editor-menu-bar">
          <button
            v-if="controls.includes('bold')"
            class="text-editor-menu-btn"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
          >
            <!-- <fa :icon="['fas', 'bold']"></fa> -->
            <i class="las la-bold"></i>
          </button>
          <button
            v-if="controls.includes('italic')"
            class="text-editor-menu-btn"
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
          >
            <!-- <fa :icon="['fas', 'italic']"></fa> -->
            <i class="las la-italic"></i>
          </button>
          <button
            v-if="controls.includes('bullet-list')"
            class="text-editor-menu-btn"
            :class="{ 'is-active': isActive.bullet_list() }"
            @click="commands.bullet_list"
          >
            <!-- <fa :icon="['fas', 'list-ul']"></fa> -->
            <i class="las la-list-alt"></i>
          </button>
        </div>
      </editor-menu-bar>
      <editor-content class="text-editor-content" :editor="editor" />
    </div>
  </client-only>
</template>

<script>
import { Editor, EditorMenuBar, EditorContent } from 'tiptap'
import { Bold, Italic, BulletList, ListItem } from 'tiptap-extensions'
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    controls: {
      type: Array,
      required: true
    },
    emitLength: {
      type: Boolean,
    },
  },
  data() {
    return {
      editor: null,
    }
  },
  components: {
    EditorContent,
    EditorMenuBar
  },
  mounted() {
    this.editor = new Editor({
      content: this.value || '',
      extensions: [
        new Bold(),
        new Italic(),
        new BulletList(),
        new ListItem()
      ],
      onUpdate: ({ getHTML }) => {
        this.$emit('input', getHTML())

        this.html = getHTML()
        if (this.html === '<p></p>') this.html = ''
        this.$emit('input', this.html)
      },
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  watch: {
    value (val) {
      if (this.editor && val !== this.value) {
        this.editor.setContent(val, true)
      }

      const length = this.$refs['editor-content'].textContent.trim().length

      if (this.emitLength) {
        this.$emit('editorStringLength', length)
      }

      if (!length) {
        this.editor.setContent('', true)
      } 
    }
  }
}
</script>
