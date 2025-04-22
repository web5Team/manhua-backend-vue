<template>
    <div class="rowTextarea_box">
        <div class="l_row"><textarea :id="id" wrap="off" cols="2" disabled></textarea></div>
        <div class="r_box">
            <el-input :id="id + 'dd'" v-model="textContent" type="textarea" :rows="3" />
        </div>
    </div>
</template>

<script>
export default {
  model: {
    prop: 'content',
    event: 'changeContent'
  },
  props: {
    content: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      textContent: '',
      num: ''
    }
  },
  watch: {
    content(val) {
      if (val !== this.textContent) {
        this.textContent = val
        this.handleChange(val)
      }
    },
    textContent(val) {
      this.handleChange(val)
      this.$emit('changeContent', val)
    }
  },
  mounted() {
    const box = document.getElementById(this.id + 'dd')
    box.addEventListener('scroll', this.textScroll, true)
  },
  methods: {
    handleChange(e) {
      var str = e
      str = str.replace(/\r/gi, '')
      str = str.split('\n')
      const n = str.length
      var lineobj = document.getElementById(this.id)
      for (var i = 0; i <= n - 1; i++) {
        if (document.all) {
          this.num += i + '\r\n' // 判断浏览器是否是IE
        } else {
          this.num += i + '\n'
        }
      }
      lineobj.value = this.num
      this.num = ''
    },
    textScroll(e) {
      document.getElementById(this.id).scrollTop = e.target.scrollTop
    }
  }
}
</script>

<style lang="scss">
.rowTextarea_box {
    display: flex;
    .l_row {
        width: 20px;
        border-left: 1px solid #DCDFE6;
        border-top: 1px solid #DCDFE6;
        border-bottom: 1px solid #DCDFE6;
        textarea {
            height:100%;
            width: 100%;
            line-height: 1.5;
            font-size: inherit;
            text-align: center;
            color: #999;
            resize: none;
            outline:none;
            overflow-y: hidden;
            overflow-x: hidden;
            border: 0;
            background: #DCDFE6;
            box-sizing: border-box;
            padding: 5px 2px;
        }
    }
    .r_box {
        flex: 1;
        overflow: hidden;
        textarea {
            padding: 5px 8px 5px 5px;
            border-radius: 0 4px 4px 0;
        }
    }
}
</style>
