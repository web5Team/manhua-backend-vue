<template>
    <el-dialog title="标签" :visible.sync="open" width="60%" :append-to-body="true" :before-close="handleClose">
      <el-card class="box-card">
        <div slot="header" class="tag__title_bo">
          <span>男生</span>
          <el-button size="mini" type="primary" @click="handleSelAll('boy')">全选</el-button>
        </div>
        <el-button class="tag__but_txt" v-for="(item, index) in boyArr" :key="index" :type="item.active ? 'primary' : ''" size="mini" @click="handleSelTag('boy', item.id)">{{item.name}}</el-button>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="tag__title_bo">
          <span>女生</span>
          <el-button size="mini" type="primary" @click="handleSelAll('girl')">全选</el-button>
        </div>
        <el-button class="tag__but_txt" v-for="(item, index) in girlArr" :key="index" :type="item.active ? 'primary' : ''" size="mini" @click="handleSelTag('girl', item.id)">{{item.name}}</el-button>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSure">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
    model: {
        prop: 'selArr',
        event: 'change'
    },
    props: {
        selArr: {
            type: String,
            default: ''
        },
        open: {
            type: Boolean,
            default: true
        },
        tagArr: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            boyArr: [],
            girlArr: [],
            isBoyAll: false,
            isGirlAll: false
        }
    },
    watch: {
        open(val) {
            if (val) {
                let arr = []
                if (this.selArr) {
                    arr = this.selArr.split(',')
                }
                let boyArr = []
                let selBoyNum = 0
                let girlArr = []
                let selGirlNum = 0
                this.tagArr.forEach(i => {
                    i.active = arr.includes(i.id.toString())
                    if (i.gender === 1) {
                        if (i.active) selBoyNum++
                        boyArr.push(i)
                    }
                    if (i.gender === 2) {
                        if (i.active) selGirlNum++
                        girlArr.push(i)
                    }
                })
                if (boyArr.length === selBoyNum) {
                    this.isBoyAll = true
                }
                if (girlArr.length === selGirlNum) {
                    this.isGirlAll = true
                }
                this.boyArr = boyArr
                this.girlArr = girlArr
            } else {
                this.resetFun()
            }
        }
    },
    methods: {
        handleClose() {
            let selArr = this.tagArr.filter(i => i.active)
            let ids = selArr.map(k => k.id)
            this.$emit('change', ids.join(','))
            this.$emit('update:open', false)
        },
        handleSure() {
            let selArr = this.tagArr.filter(i => i.active)
            let ids = selArr.map(k => k.id)
            this.$emit('change', ids.join(','))
            this.$emit('update:open', false)
        },
        resetFun() {
            this.isBoyAll = false
            this.isGirlAll = false
        },
        handleSelTag(str, id) {
            if (str === 'boy') {
                this.boyArr.forEach(i => {
                    if (i.id === id) {
                        i.active = !i.active
                    }
                })
                this.boyArr = [...this.boyArr]
            } else {
                this.girlArr.forEach(i => {
                    if (i.id === id) {
                        i.active = !i.active
                    }
                })
                this.girlArr = [...this.girlArr]
            }
        },
        handleSelAll(str) {
            if (str === 'boy') {
                this.isBoyAll = !this.isBoyAll
                this.boyArr.forEach(i => {
                    i.active = this.isBoyAll
                })
                this.boyArr = [...this.boyArr]
            } else {
                this.isGirlAll = !this.isGirlAll
                this.girlArr.forEach(i => {
                    i.active = this.isGirlAll
                })
                this.girlArr = [...this.girlArr]
            }
        }
    }
}
</script>

<style lang="scss">
.tag__title_bo {
    display: flex;
    align-items: center;
    justify-content: space-between;

}
.tag__but_txt {
    margin-bottom: 5px;
}
</style>