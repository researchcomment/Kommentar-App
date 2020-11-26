<template>
    <div>

        <!-- login Button -->
        <el-button id="btn" type="info" @click="dialogFormVisible=true" round> Login </el-button>
        <!-- <mt-button type="primary" @click="dialogFormVisible=true" round> Login </mt-button> -->
        <!-- After clicking, a login form will pop up -->
        <el-dialog title="Login" :visible.sync="dialogFormVisible">
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
 
</style>