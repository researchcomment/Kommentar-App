<template>
    <div>
        
        <!-- Menu -->
        <a-layout id="components-layout-demo-custom-trigger">
            <a-layout-sider v-model="collapsed" :trigger="null" collapsible>

                <a-menu theme="dark" mode="inline" v-model="menuKey" >

                    <a-menu-item key="allUser">
                        <a-icon type="user" />
                        <span>All User</span>
                    </a-menu-item>

                    <a-menu-item key="dr">
                        <span>default => Reseacher</span>
                    </a-menu-item>

                    <a-menu-item key="rr">
                        <span>Reseacher => Reviewer</span>
                    </a-menu-item>

                    <a-menu-item key="rm">
                        <span>Reseacher => Moderator</span>
                    </a-menu-item>
                    
                    <a-menu-item key="ra">
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
                    
                    <!-- All User -->
                    <!-- Filter -->
                    <input type="text" style="margin-left:10vh" v-model="searchText" v-show="menuKey[0]=='allUser'">
                    <a-table  :data-source="filterUser" rowKey="username" v-show="menuKey[0]=='allUser'" >
                        
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

                                    <a>Researcher</a>
                                    <a-divider type="vertical" />
                                        
                                    <template  v-if="user.role.indexOf('Researcher')>-1">
                                        <a>Reviewer</a>
                                        <a-divider type="vertical" />
                                        <a>Moderator</a>
                                        <a-divider type="vertical" />
                                        <a>Admin</a>
                                    </template>
                                </span>
                            </template>
                        </a-table-column>
                    </a-table>

                    <!-- Requests -->
                    <a-table  :data-source="userList[menuKey[0]]" rowKey="username"  v-show="menuKey[0]!='allUser'">
                        
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

        
    </div>
</template>

<script>

    export default {

        name: "admin",

        data(){
            return{
                collapsed: false,
                menuKey:["allUser"],
               
                searchText:"",
                userList:{
                    allUser:[
                        {   username:"test1",
                            role:["default"],
                        },
                        {   username:"abc",
                            role:['default', 'Researcher', 'Reviewer'],
                        }
                    ],
                    dr:[
                        {   username:"dr",
                            role:["default"],
                        },
                        {   username:"dr1",
                            role:['default', 'Researcher', 'Reviewer'],
                        }
                    ],
                    rr:[
                        {   username:"rr1",
                            role:["default"],
                        },
                        {   username:"rr",
                            role:['default', 'Researcher', 'Reviewer'],
                        }
                    ],
                    rm:[
                        {   username:"rm1",
                            role:["default"],
                        },
                        {   username:"rm",
                            role:['default', 'Researcher', 'Reviewer'],
                        }
                    ],
                    ra:[
                        {   username:"test1",
                            role:["default"],
                        },
                        {   username:"abc",
                            role:['default', 'Researcher', 'Reviewer'],
                        }
                    ],
                    

                },
                changedUserList:new Set(),
                aftersearch: false,
            }
        },

        computed:{

            /**
             * @returns true, if the current user is Admin
             */
            isAdmin(){
                //return true; //! FOR TEST

                var login = this.$store.state.account.username;

                if(login){
                    return (this.$store.state.account.role.indexOf("Admin"))>-1; // check whether the logged user is Admin
                }
                else{
                    return false; // not logged => not Admin
                }

            },
            filterUser(){
                if(!this.searchText){
                    return this.userList["allUser"];
                }
                else{
                    var list=[];
                    for(var user of this.userList["allUser"]){
                        if(user.username.indexOf(this.searchText) > -1){
                            list.push(user);
                        } 
                    }
                    return list;
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
                //要么给我分类搞好  要么给我有from to的

                //! FOR TEST
                // this.userList.allUser = [
                //     {   username:"test1",
                //         role:["default"],
                //     },
                //     {   username:"abc",
                //         role:['default', 'Researcher', 'Reviewer'],
                //     }
                // ];
                
                // this.userList.dr = [
                //     {   username:"test1",
                //         role:["default"],
                //     },
                //     {   username:"abc",
                //         role:['default', 'Researcher', 'Reviewer'],
                //     }
                // ];

            },

            /**
             * ! 涉及后端交互
             * Request the background to change the role of users
             */
            updateRole(agree,user){
               
                // TODO:this.$store.....updateRole(agree,user);
            
            },


            /**
             * Filter user list
             * 
             * @param userName - username in the list
             * @returns boolean   - true, if it related to search text
             */
            filter(userName){
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
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

</style>