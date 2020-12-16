<template>
    <div>
        <!-- Titel -->
        <h3 style="margin-top:5vh;margin-left:10vh;font-size:5vh">User Management</h3>
        
        <!-- Filter -->
        <input type="text" style="margin-left:10vh" v-model="searchText">
       

        <!-- User List -->
        <div  v-for="(user, index) in userList" v-show="filter(user.username)" v-bind:key="index"  class="userlists">
            <div >
                <p>Username:{{user.username}}</p>
                <mt-checklist
                    v-model="user.role"
                    :options="['default', 'Researcher', 'Reviewer','Moderator','Admin']"
                    @change="addChangedUserList(index)">
                </mt-checklist>
            </div>
           
        </div>
       
        <!-- Button -->
        <mt-button class="combtn" type="danger" @click.native="updateRole">Confirm</mt-button>
        
    </div>
</template>

<script>

    export default {

        name: "admin",

        data(){
            return{
                searchText:"",
                userList:[
                    {   username:"test1",
                        role:["default"],
                    },
                    {   username:"abc",
                        role:['default', 'Researcher', 'Reviewer'],
                    }
                ],
                changedUserList:new Set(),
                aftersearch: false,
            }
        },
        computed:{

            /**
             * @returns true, if the current user is Admin
             */
            isAdmin(){
                return true; //! FOR TEST

                var login = this.$store.state.account.username;

                if(login){
                    return (this.$store.state.account.role.indexOf("Admin"))>-1; // check whether the logged user is Admin
                }
                else{
                    return false; // not logged => not Admin
                }

            }

        },

        beforeRouteEnter (to, from, next) {
            
            // check whether the user is authenticated,
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

                // get userList from DB
                // TODO:this.$store.....getUserList();

                //! FOR TEST
                this.userList = [
                    {   username:"test1",
                        role:["default"],
                    },
                    {   username:"abc",
                        role:['default', 'Researcher', 'Reviewer'],
                    }
                ];

            },

            /**
             * ! 涉及后端交互
             * Request the background to change the role of users
             */
            updateRole(){
               
               // Submit an update request for each changed user
                for(var index of this.changedUserList){
                    var user = this.userList[index];

                    // TODO:this.$store.....updateRole(user.username,user.role);
                    // user.username,user.role 直接这样写填进去就行

                }

            },

            /** add index of the changed user to the Set
             * @param index  the index of the changed user in this.userList
             */
            addChangedUserList(index){
                this.changedUserList.add(index);
                console.log(index)
            },

            /**
             * Filter user list
             * 
             * @param userName - username in the list
             * @returns boolean   - true, if it related to search text
             */
            filter(userName){
                return userName.indexOf(this.searchText) > -1 ;
            }
        }
    }
</script>

<style>
.userlists{
    margin: 10vh;
    border: 1px solid rgba(0,0,0,.125);
    padding: 2vh;
    border-radius: .25rem;

}
.userlists .mint-checklist .mint-cell .mint-cell-wrapper{
  cursor: default;
  background-image: none;
}
.userlists .mint-checklist .mint-cell{
  background-image: none;
}
.combtn{
    display: block;
    margin-left: 10vh;
}
</style>