<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true">
      <el-form-item>
        <!-- <el-input v-model="searchObj.name" placeholder="讲师名" /> -->
        <el-autocomplete
          v-model="searchObj.name"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          class="inline-input"
          placeholder="讲师"
          value-key="name"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="头衔">
          <el-option value="1" label="高级讲师"/>
          <el-option value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="searchObj.joinDateBegin"
          placeholder="开始时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="-">
        <el-date-picker
          v-model="searchObj.joinDateEnd"
          placeholder="结束时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="batchRemove()">批量删除</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="list" :header-cell-style="{textAlign: 'center'}" border stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection"/>
      <el-table-column
        label="#"
        width="50">
        <template slot-scope="scope" >
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="头像" width="100" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" class="user-avatar " style="width:50px;height:50px">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="80" align="center"/>
      <el-table-column label="头衔" width="90" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 1" type="success" size="mini">高级讲师</el-tag>
          <el-tag v-if="scope.row.level === 2" size="mini">首席讲师</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="简介"/>
      <el-table-column prop="career" label="资历" width="400"/>
      <el-table-column prop="sort" label="排序" align="center" width="60" />
      <el-table-column prop="joinDate" label="入驻时间" align="center" width="160" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="changePageSize"
      @current-change="changeCurrentPage"
    />
  </div>
</template>

<script>
import teacherApi from '@/api/teacher'
export default {
  data() {
    return {
      list: [], // 讲师列表
      total: 0, // 数据总数
      page: 1, // 页码
      limit: 5, // 每页数据量
      searchObj: {}, // 查询对象
      multipleSelection: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      teacherApi.pageList(this.page, this.limit, this.searchObj).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },

    changePageSize(size) {
      this.limit = size
      this.fetchData()
    },

    changeCurrentPage(page) {
      this.page = page
      this.fetchData()
    },

    // 重置表单
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },

    removeById(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return teacherApi.removeById(id)
      }).then((response) => {
        this.fetchData()
        this.$message.success(response.message)
      }).catch(error => {
        console.log('error', error)
        // 当取消时会进入catch语句:error = 'cancel'
        // 当后端服务抛出异常时：error = 'error'
        if (error === 'cancel') {
          this.$message.info('取消删除')
        }
      })
    },
    // 批量删除
    batchRemove() {
      console.log('removeRows......')
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，远程调用ajax
        // 遍历selection，将id取出放入id列表
        var idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
        })
        // 调用api
        return teacherApi.batchRemove(idList)
      }).then((response) => {
        this.fetchData()
        this.$message.success(response.message)
      }).catch(error => {
        if (error === 'cancel') {
          this.$message.info('取消删除')
        }
      })
    },
    // 当多选选项发生变化的时候调用
    handleSelectionChange(selection) {
      console.log(selection)
      this.multipleSelection = selection
    },
    querySearch(queryString, callback) {
      console.log(queryString)
      teacherApi.selectNameListByKey(queryString).then(response => {
        callback(response.data.nameList)
      })
    }
  }
}
</script>
