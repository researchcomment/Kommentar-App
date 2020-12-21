<template>
    <div>
       
        <a-layout id="components-layout-demo-custom-trigger">

             <!-- Menu -->
            <a-layout-sider v-model="collapsed" :trigger="null" collapsible>

                <a-menu theme="dark" mode="inline" v-model="menuKey" >

                    <a-menu-item key="Researcher">
                        <span>default => Reseacher</span>
                    </a-menu-item>

                    <a-menu-item key="Reviewer">
                        <span>Reseacher => Reviewer</span>
                    </a-menu-item>

                    <a-menu-item key="Moderator">
                        <span>Reseacher => Moderator</span>
                    </a-menu-item>
                    
                    <a-menu-item key="Admin">
                        <span>Reseacher => Admin</span>
                    </a-menu-item>
                </a-menu>
            </a-layout-sider>

            <!-- Contents -->
            <a-layout>
                <a-layout-header style="background: #fff; padding: 0">
                    
                    <a-icon
                    class="trigger"
                    :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                    @click="() => (collapsed = !collapsed)"
                    />
                    <!-- Titel -->
                    <span style="margin-top:5vh;margin-left:10vh;font-size:5vh">User Management</span>

                </a-layout-header>

                <a-layout-content
                    :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
                    
                    <!-- Filter -->
                    <input type="text" style="margin-left:10vh" v-model="searchText">
                
                    <!-- Requests -->
                    <a-table  :data-source="filteredUserList[menuKey[0]]" rowKey="username"  >
                          
                        <!-- User Name -->
                        <a-table-column key="username" title="User Name" data-index="username" />
                        
                        <!-- Role -->
                        <a-table-column key="role" title="Role" data-index="role">
                            <template slot-scope="role">
                                <span>
                                    <a-tag v-for="tag in role" :key="tag" :color="getColor(tag)">{{ tag }}</a-tag>
                                </span>
                            </template>
                        </a-table-column>

                        <!-- Update Action -->
                        <a-table-column key="update" title="Update">
                            <template slot-scope="text, user">
                                <span>
                                    <a-button type="dashed" icon="check" @click="updateRole(true,user)">Agree</a-button>
                                    <a-button type="dashed" icon="close" @click="updateRole(false,user)">Refuse</a-button>
                                </span>
                            </template>
                        </a-table-column>
                         
                    </a-table>

                </a-layout-content>
            </a-layout>
        </a-layout>

        
        <div>
            <bottom></bottom>
        </div>
    </div>
    
</template>

<script>
    import bottom from '@/components/footer/bottom';
    export default {

        name: "admin",
        components:{
            bottom
        },
        data(){
            return{
                collapsed: false,
                menuKey:["Researcher"],
               
                searchText:"",
                userList:{},
                
                aftersearch: false,
            }
        },

        computed:{

            /**
             * @returns true, if the current user is Admin
             */
            isAdmin(){

                var login = this.$store.state.account.username;

                if(login){
                    return (this.$store.state.account.role.indexOf("Admin"))>-1; // check whether the logged user is Admin
                }
                else{
                    return false; // not logged => not Admin
                }

            },
            filteredUserList(){
                if(!this.searchText){
                    return this.userList;
                }
                else{
                    console.log(this.userList);
                    var list = Object.keys(this.userList).map(key=>(
                        {[key]:this.userList[key].filter( user =>
                            user.username.includes(this.searchText))
                        })
                    ).reduce( ( prev, curr ) =>  Object.assign(prev,curr));
                    console.log( )
                    return list
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
             * Request the userList from background
             */
            async getUserList(){

                var toRoleList=["Researcher","Reviewer","Moderator","Admin"];

                // get userList from DB
                toRoleList.map((role)=>{
                    
                   this.$store.dispatch("adminAktion/getUserList",{toRole:role}).then((result)=>{
                                           
                        var list = Object.keys(result).map((key) => {
                                var user = result[key];
                                user.key=key;
                                return user;
                        })
                        this.userList[role] =list;
                    }).catch(err => {console.log(err);});
                   
                })
            },

            /**
             * Request the background to change the role of users
             */
            updateRole(agree,user){
                var role=this.menuKey[0];

                this.$store.dispatch("adminAktion/updateRole",{toRole:role,
                                                                 flag:agree,
                                                                    userKey:user.key,});
                this.getUserList();
            
            },


            /**
             * Filter user list
             * 
             * @param userName - username in the list
             * @returns boolean   - true, if it related to search text
             */
            filter(userName){ 
                //console.log(userName)
                //return false
                return userName.indexOf(this.searchText) > -1 ;
            },

            getColor(tag){
                if(tag=="default"){
                    return "green";
                }
                else if(tag=="Researcher"){
                    return "blue";
                }
                else if(tag=="Moderator"){
                    return "orange";
                }
                else if(tag=="Reviewer"){
                    return "purple";
                }
                else if(tag=="Admin"){
                    return "red";
                }
            }
        }
    }
</script>

<style>
/* searchinput style */
.usersearch{
    margin-left:10vh;
}
/* userlist style */
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
    margin-bottom: 5vh;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

</style>