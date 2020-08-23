<template>
  <div class="login-form">
    <k-form :model="model" :rules="rules" ref="loginForm">
      <k-form-item label="用户名" prop="username">
        <k-input v-model="model.username" placeholder="请输入用户名"></k-input>
      </k-form-item>
      <k-form-item label="年龄" prop="age">
        <k-input type="text" v-model="model.age"></k-input>
      </k-form-item>
      <k-form-item label="密码" prop="password">
        <k-input v-model="model.password" type="password"></k-input>
      </k-form-item>
      <k-form-item>
        <button @click="onLogin">提交</button>
      </k-form-item>
    </k-form>
    <!-- .sync和v-model有和区别？ -->
    {{model}}
  </div>
</template>

<script>
import KInput from "@/components/form/KInput.vue";
import KFormItem from "@/components/form/KFormItem.vue";
import KForm from "@/components/form/KForm.vue";
// import Notice from "@/components/notice/notice.vue";


export default {
  data() {
    return {
      model: { username: "tom", password: "", age: '' },
      rules: {
        username: [{ required: true, message: "必填项" }],
        password: [{ required: true, message: "必填项" }],

      }
    };
  },
  components: {
    KInput,
    KFormItem,
    KForm,
  },
  methods: {
    onLogin() {
      this.$refs.loginForm.validate(isValid => {
        if (isValid) {
          alert("请求登录！");
        } else {
          alert("校验失败！");
        }
        // this.$create(Notice, {
        //   title: "社会你杨哥喊你来搬砖",
        //   message: isValid ? "提请求登录！" : "校验失败！",
        //   duration: 2000
        // }).show();
      });
    }
  }
};
</script>

<style scoped>
.login-form {
  padding: 10px 15px;
}
</style>