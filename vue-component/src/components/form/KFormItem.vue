<template>
    <div>
        <!-- label -->
        <label v-if="label">{{label}}</label>
        <slot></slot>
        <!-- 错误信息 -->
        <p class="error" v-if="error">{{error}}</p>
        
    </div>
</template>

<script>
    import Schema from 'async-validator';

    export default {
        inject: ['form'],
        props: {
            label: {
                type: String,
                default: ''
            },
            prop: {
                type: String
            }
        },
        data() {
            return {
                error: ''
            }
        },
        mounted() {
            this.$on('validate', () => {
                this.validate();
            })
        },
        methods: {
            validate() {
                // 0.获取校验规则和当前值
                const rules = this.form.rules[this.prop];
                const value = this.form.model[this.prop];
                // 1.创建Schema实例
                // this指向当前组件实例，this.prop是当前项的key
                const schema = new Schema({
                    // [xxx] 计算属性
                    [this.prop]: rules 
                })
                // 2.使用该实例执行校验
                return schema.validate({
                    [this.prop]: value
                }, errors => {
                    if (errors) {
                        this.error = errors[0].message;
                    } else {
                        this.error = ''
                    }
                })
            }
        },
    }
</script>

<style scoped>
.error{
    color: #f00;
}
</style>