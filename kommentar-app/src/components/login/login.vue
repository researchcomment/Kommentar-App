<template>
    <div>

        <div class="login" @click="dialogFormVisible=true"> Login<span class="iconfont icon-denglu"></span></div>
        
        <!-- <el-dialog title="Login" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="Username" :label-width="formLabelWidth">
                    <el-input v-model="form.username"  placeholder="Enter your E-Mail" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Password" :label-width="formLabelWidth">
                    <el-input v-model="form.password" placeholder="Enter your password" @keyup.enter.native="confirm" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click.native="confirm" >Confirm</el-button>
            </div>
        </el-dialog> -->

        <mt-popup class="popform" v-model="dialogFormVisible" popup-transition="popup-fade">
            <h3 class="formtitle">Welcome!</h3>
            <mt-field class="fieldarea" label="Username" placeholder="Enter your E-Mail" v-model="form.username"></mt-field>
            <mt-field class="fieldarea" label="Password" placeholder="Enter your password" v-model="form.password"></mt-field>
            <div class="cbuttons">
                <el-button class="onebtn" @click="dialogFormVisible = false">Cancel</el-button>
                <el-button class="onebtn" type="primary" @click.native="confirm" >Confirm</el-button>
            </div>
        </mt-popup>

    </div>
</template>

<script>
    import { Button } from 'mint-ui';
    export default {

        data(){
            return{
                formLabelWidth: '120px',
                dialogFormVisible: false,
                form:{
                    username:"123@gmail.com",  // Change back after testing : ""
                    password:"123123",
                },  
                validationErrors: [],
                firebaseError: ""
            };   
            },
        methods:{
            resetError() {
                this.validationErrors = [];
            },

            /*
            * Check whether the account and password are correct
            */
            confirm(){   
                this.resetError();
                if(!this.form.username||!this.form.password){    //check if the form is filled
                    this.validationErrors.push('Username/Password can not be empty.')
                    this.$message.warning('Username/Password can not be empty.');
                }
                if (this.validationErrors.length <= 0) {
                    this.$store.dispatch('account/login',this.form);
                }
                this.dialogFormVisible=false;
            },
        }
    }
</script>

<style>
 .login{
    width: 100px;
    height: 50px;
    font-size: 15px;
    line-height: 50px;
    color: #fff;
 }
 .popform{
     width:70%;
     cursor:default;
 }
 .fieldarea{
     margin: 3% 5%;
 }
 .onebtn{
     margin: auto 3%;
 }
 .cbuttons{
     margin: 3% 3%;
     padding-left: 3%;
 }
 .formtitle{
     margin: 3%;
 }
</style>
