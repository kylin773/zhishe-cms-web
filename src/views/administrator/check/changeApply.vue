<template>
  <div>
    <!-- 卡片视图区 -->
    <el-card>
      <div>
        <i class="el-icon-search" />
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          type="primary"
          size="small"
          @click="check"
        >查询</el-button>
        <el-button
          style="float: right; margin-right: 15px"
          size="small"
          @click="renew"
        >重置</el-button>
      </div>
      <div style="margin-top: 30px">
        <el-form
          :inline="true"
          :model="form"
          label-width="100px"
        >
          <el-form-item label="社团名称">
            <el-input
              v-model="form.clubName"
              placeholder
            />
          </el-form-item>
          <el-form-item label="现任社长">
            <el-input
              v-model="form.oldChiefName"
              placeholder
            />
          </el-form-item>
          <el-form-item label="新任社长">
            <el-input
              v-model="form.newChiefName"
              placeholder
            />
          </el-form-item>
          <el-form-item
            label="申请状态"
            prop="state"
          >
            <el-select
              v-model="form.state"
              placeholder="请选择"
            >
              <el-option
                label="待审核"
                value="0"
              />
              <el-option
                label="已批准"
                value="1"
              />
              <el-option
                label="已退回"
                value="2"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-form-item prop="createAt">
              <el-date-picker
                v-model="form.createAt"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width: 90%;"
              />
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card>
      <el-button
        :loading="downloadLoading"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >导出Excel</el-button>
      <!-- 社长换届申请列表 -->
      <el-table :data="changeApplyList" stripe border>
        <el-table-column
          type="index"
          label="#"
        />
        <el-table-column
          label="社团名称"
          prop="clubName"
        />
        <el-table-column
          label="现任社长"
          prop="oldChiefName"
        />
        <el-table-column
          label="新任社长"
          prop="newChiefName"
        />
        <el-table-column
          label="申请时间"
          prop="createAt"
        />
        <el-table-column
          label="申请原因"
          prop="reason"
        />
        <el-table-column
          label="申请状态"
          prop="state"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.state === 0"
              style="text-align: center"
              type="warning"
              :disable-transitions="true"
              effect="dark"
            >{{ scope.row.state | statusFilter }}</el-tag>
            <el-tag
              v-else-if="scope.row.state === 1"
              style="text-align: center"
              type="success"
              :disable-transitions="true"
              effect="dark"
            >{{ scope.row.state | statusFilter }}</el-tag>
            <el-tag
              v-else
              style="text-align: center"
              type="danger"
              :disable-transitions="true"
              effect="dark"
            >{{ scope.row.state | statusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.state === 0"
              type="primary"
              @click="pushToAgree(scope)"
            >批准</el-button>
            <el-button
              v-if="scope.row.state === 0"
              type="primary"
              @click="pushToRefuse(scope)"
            >退回</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        :current-page="queryInfo.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
import { getChangeApplyListData, pushToChangeApply } from '@/api/club'
import { parseTime } from '@/utils'
export default {
  name: 'ChangeApply',
  filters: {
    statusFilter(value) {
      if (value === 0) {
        return '待审核'
      } else if (value === 1) {
        return '已批准'
      } else {
        return '已退回'
      }
    }
  },
  data() {
    return {
      filename: '社长换届申请',
      downloadLoading: false,
      autoWidth: true,
      listLoading: true,
      clubId: 0,
      queryInfo: {
        page: 1,
        limit: 5
      },
      total: 0,
      changeApplyList: [],
      changeApplyExcelList: [],
      form: {
        clubName: '',
        createAt: '',
        state: '',
        oldChiefName: '',
        newChiefName: ''
      }
    }
  },

  created() {
    this.getChangeApplyListData()
  },

  methods: {
    getChangeApplyListData() {
      this.listLoading = true
      const param = {
        clubName: this.form.clubName,
        createAt: this.form.createAt,
        state: this.form.state,
        oldChiefName: this.form.oldChiefName,
        newChiefName: this.form.newChiefName,
        page: this.queryInfo.page,
        limit: this.queryInfo.limit
      }
      getChangeApplyListData(param).then(response => {
        if (response.status === 200) {
          this.$message.success('获取社长换届申请成功')
          this.changeApplyList = response.data.items
          this.total = response.data.totalCount
        } else {
          return this.$message.error('获取社长换届申请失败')
        }
      })
    },

    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.limit = newSize
      this.getChangeApplyListData()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage
      this.getChangeApplyListData()
    },

    // 修改申请状态
    pushToAgree({ $index, row }) {
      const data = {
        id: row.id,
        state: 1
      }
      pushToChangeApply(data).then(response => {
        if (response.status === 204) {
          this.$message.success('审核申请成功')
        } else {
          return this.$message.error('审核申请失败')
        }
      })
      row.state = 1
    },

    pushToRefuse({ $index, row }) {
      const data = {
        id: row.id,
        state: 2
      }
      pushToChangeApply(data).then(response => {
        if (response.status === 204) {
          this.$message.success('审核申请成功')
        } else {
          return this.$message.error('审核申请失败')
        }
      })
      row.state = 2
    },

    // 组合查询
    renew() {
      this.form.clubName = ''
      this.form.createAt = ''
      this.form.state = ''
      this.form.newChiefName = ''
      this.form.oldChiefName = ''
    },

    check() {
      this.queryInfo.page = 1
      this.getChangeApplyListData()
    },

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['社团名称', '现任社长', '新任社长', '申请时间']
        const filterVal = [
          'clubName',
          'oldChiefName',
          'newChiefName',
          'createAt'
        ]
        const param = {
          clubName: this.form.clubName,
          createAt: this.form.createAt,
          state: this.form.state,
          oldChiefName: this.form.oldChiefName,
          newChiefName: this.form.newChiefName,
          page: 1,
          limit: 100000
        }
        getChangeApplyListData(param).then(response => {
          if (response.status === 200) {
            this.changeApplyExcelList = response.data.items
            const list = this.changeApplyExcelList
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: this.filename,
              autoWidth: this.autoWidth,
              bookType: 'xlsx'
            })
            this.downloadLoading = false
          } else {
            return this.$message.error('导出社长换届申请excel失败')
          }
        })
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>

<style scoped lang="scss">
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}

.el-table {
  margin-top: 20px;
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
