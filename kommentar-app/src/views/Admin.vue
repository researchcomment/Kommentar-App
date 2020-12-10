<template>
    <div>
        <mt-button type="danger" @click.native="updateRole">Confirm</mt-button>

        <!-- user List -->
        <li  v-for="(user, index) in userList" v-bind:key="index">
            <div>
                <p>Username:{{user.username}}</p>
                <mt-checklist
                    v-model="user.role"
                    :options="['default', 'Researcher', 'Reviewer','Moderator','Admin']"
                    @change="addChangedUserList(index)">
                </mt-checklist>  
                
            </div>
        </li>
       
    </div>
</template>

<script>
    export default {
        name: "admin",
        data(){
            return{
                userList:[
                    {   username:"test1",
                        role:["default"],
                    },
                    {   username:"test1",
                        role:['default', 'Researcher', 'Reviewer'],
                    }
                ],
                changedUserList:new Set(),
            }
        },
        computed:{
            isAdmin(){
                return true; //!for test

                var login = this.$store.state.account.username;
                if(login){
                    //check whether the logged user is Admin
                    return (this.$store.state.account.role.indexOf("Admin"))>-1;
                }
                else{
                    return false;
                }  
            }
        },
        beforeRouteEnter (to, from, next) {
            //check whether the user is authenticated,
             next(vm => {
                if(!vm.isAdmin){
                    alert("illegal access error");
                    next('/');
                }
                else next()
            })  
        },
        mounted(){
            this.getUserList();
        },
        methods:{
            /**
             * ! 涉及后端交互
             * Request the userList from background
             */
            getUserList(){
                this.userList = [
                    {   username:"test1",
                        role:["default"],
                    },
                    {   username:"test1",
                        role:['default', 'Researcher', 'Reviewer'],
                    }
                ];
            },

            /**
             * ! 涉及后端交互
             * Request the background to change the role of users
             */
            updateRole(){
                for(var index of this.changedUserList){
                    var user = this.userList[index];
                    //this.$store.....updateRole(user.username,user.role);
                }
            },

            /**add index to the Set
             * @param index  the index of the changed user in this.userList
             */
            addChangedUserList(index){
                this.changedUserList.add(index);
            },
        }
    }
</script>

<style>

</style>