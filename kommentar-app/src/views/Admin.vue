<template>
<div>
    <div class="mainadmin">
        <div class="box1"></div>

        <div class="box2"></div>
        <a-layout style="display:none">
        <a-layout-header style="display:none">Header</a-layout-header>
       <a-layout>
           <!-- Menu -->
            <a-layout-sider width="20vw">

                <a-menu theme="dark" mode="inline" v-model="menuKey" >

                    <a-menu-item key="Researcher">
                        <span>default => Reseacher</span>
                    </a-menu-item>

                    <a-menu-item key="Moderator">
                        <span>Reseacher => Reviewer</span>
                    </a-menu-item>

                    <a-menu-item key="Reviewer">
                        <span>Reseacher => Moderator</span>
                    </a-menu-item>
                    
                    <a-menu-item key="Admin">
                        <span>Reseacher => Admin</span>
                    </a-menu-item>
                </a-menu>
            </a-layout-sider>

            <!-- Contents -->
            <a-layout-content  width="70vw" style="height:88vh">
                <div style="background: #fff; padding: 0">
                    
                    
                    <!-- Titel -->
                    <span style="margin-top:2vh;font-size:3vw">User Management</span>

                </div>
                <!-- Filter -->
                <input type="text" style="" v-model="searchText">
                <div :style="{ margin: '2vh 2vw', padding: '0', background: '#fff',width:'50vw'}">
                    
                    
                
                    <!-- Requests -->
                    <a-table  :data-source="userList[menuKey[0]]" rowKey="username"  >
                          
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

                </div>
            </a-layout-content>
       </a-layout>
        

             
        

        <a-layout-footer style="display:none">
        
        </a-layout-footer>
    </a-layout>
    </div>
    
    <bottom></bottom>
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
            filterUser(){
                // if(!this.searchText){
                //     return this.userList["allUser"];
                // }
                // else{
                //     var list=[];
                //     for(var user of this.userList["allUser"]){
                //         if(user.username.indexOf(this.searchText) > -1){
                //             list.push(user);
                //         } 
                //     }
                //     return list;
                // }
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

                // get userList from DB

                this.userList={
                    Researcher:[],
                    Moderator:[],
                    Reviewer:[],
                    Admin:[],
                };

                this.$store.dispatch("adminAktion/getUserList",{toRole:"Researcher"}).then((result)=>{
                    if(result){
                        for(var key in result){
                            var user = result[key];
                            user.key=key;
                            this.userList.Researcher.push(user);
                        }
                    }
                    
                }).catch(err => {console.log(err);});

                this.$store.dispatch("adminAktion/getUserList",{toRole:"Reviewer"}).then((result)=>{
                    for(var key in result){
                        var user = result[key];
                        user.key=key;
                        this.userList.Reviewer.push(user);

                    }
                }).catch(err => {console.log(err);});

                this.$store.dispatch("adminAktion/getUserList",{toRole:"Moderator"}).then((result)=>{
                    for(var key in result){
                        var user = result[key];
                        user.key=key;
                        this.userList.Moderator.push(user);

                    }
                }).catch(err => {
                                console.log(err);});
              
                
                this.$store.dispatch("adminAktion/getUserList",{toRole:"Admin"}).then((result)=>{
                    for(var key in result){
                        var user = result[key];
                        user.key=key;
                        this.userList.Admin.push(user);

                    }
                }).catch(err => {
                                console.log(err);});
                

            },

            /**
             * Request the background to change the role of users
             */
            updateRole(agree,user){
                var role=this.menuKey[0];

                this.$store.dispatch("adminAktion/updateRole",{toRole:role,
                                                                 flag:agree,
                                                                    userKey:user.key,});
                var index = this.userList[role].indexOf(user);
                if (index > -1) {
                        this.userList[role].splice(index, 1);
                }
            
            },


            /**
             * Filter user list
             * 
             * @param userName - username in the list
             * @returns boolean   - true, if it related to search text
             */
            onFilter(userName){ 
                console.log(userName)
                return false
                // return userName.indexOf(this.searchText) > -1 ;
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
#components-layout-demo-basic {
  text-align: center;
}
#components-layout-demo-basic .ant-layout-header,
#components-layout-demo-basic .ant-layout-footer {
  background: #7dbcea;
  color: #fff;
}
#components-layout-demo-basic .ant-layout-footer {
  line-height: 1.5;
}
#components-layout-demo-basic .ant-layout-sider {
  background: #3ba0e9;
  color: #fff;
  line-height: 120px;
  min-width: 20vw;
}
#components-layout-demo-basic .ant-layout-content {
  background: rgba(16, 142, 233, 1);
  color: #fff;
  min-height: 120px;
  line-height: 120px;
  width: 70vw;
}
#components-layout-demo-basic > .ant-layout {
  margin-bottom: 48px;
}
#components-layout-demo-basic > .ant-layout:last-child {
  margin: 0;
}
.mainadmin{
    min-height: 88vh;
    font-size: 0;
    width: 98vw;
    height: 88vh;
}
.box1{
    width: 30vw;
    height: 80vh;
    background-color:red;
    float: left;
    vertical-align: top;
}
.box2{
    width: 60vw;
    height: 80vh;
    background-color:blue;
    float: left;
    vertical-align: top;
}
</style>