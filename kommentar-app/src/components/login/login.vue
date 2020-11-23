<template>
    <div>
        <el-button type="primary" @click="dialogFormVisible = true" round> Login </el-button>
        <!-- [login Button]
        点击会弹出 login table
            [login Table
            username：
            password:
            (register button)]
            点一下会弹出注册表单 -->

        <el-dialog title="Login" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="Username" :label-width="formLabelWidth">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="Password" :label-width="formLabelWidth">
                    <el-input v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click.native="confirm">Confirm</el-button>
            </div>
        </el-dialog>

      
    </div>
</template>

<script>

    export default {

        data(){
            return{
                formLabelWidth: '120px',
                dialogFormVisible: false,
                form:{
                    username:"",
                    password:"",
                },
            }
        },
        methods:{
            confirm(){
                if(!this.form.username||!this.form.password){    //check if the form is filled
                    this.$message.warning('Username/Password can not be empty.');
                }

                this.$store.dispatch('account/login',this.form).then((result) => {    //get the information from database
                    if(result.flag){
                        //login success
                        this.dialogFormVisible = false;
                        this.$message({
                            message: 'Successfully logged in',
                            type: 'success'
                        });
                        
                    }
                    else{
                        this.$message.error(result.msg);
                    }
                });
            },
        }
    }
</script>

<style>

</style>