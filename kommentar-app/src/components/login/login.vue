<template>
    <div>

        <div class="login1" @click="dialogFormVisible=true"> Login<span class="iconfont icon-denglu" style="font-size: inherit"></span></div>
    
        <mt-popup class="popform" v-model="dialogFormVisible" popup-transition="popup-fade">
            <h3 class="formtitle">Welcome!</h3>
            <mt-field class="fieldarea" label="Username" placeholder="Enter your E-Mail" v-model="form.username"></mt-field>
            <mt-field class="fieldarea" label="Password" placeholder="Enter your password" v-model="form.password"></mt-field>
            <div class="cbuttons">
                <el-button class="onebtn" type="primary" @click.native="confirm" >Confirm</el-button>
                <el-button class="onebtn" @click="dialogFormVisible = false">Cancel</el-button>
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
 .login1{
    width: auto;
    height: 50px;
    color: #fff;
 }
 .popform{
     width:70%;
     cursor:default;
 }
 .fieldarea{
     margin: 3% 5%;
 }
 .popform .mint-cell:hover{
     color: #6A6A6A;
     cursor: default;
 }
.popform .mint-cell .mint-cell-title{
    color: black;
    
}
.mint-cell .mint-cell-value{
    border-bottom: 1px solid #d9d9d9;
    margin-top: 2vh;
    margin-bottom: 2vh;
}
.mint-popup .mint-cell .mint-cell-wrapper{
    background-image: none;
    display: block;
}
.cbuttons .el-button{
    float: right;
    margin-bottom: 5%;
    margin-left: 3%;
 }
 .cbuttons{
     width: auto;
     margin: 3% 3%;
     padding-left: 3%;
 }
 .formtitle{
     margin-left: 6%;
     margin-top: 7%;
     height: 2.5vh;
     line-height: 2.5vh;
     font-size: 3vh;
     margin-bottom: 2vh;
 }
</style>
