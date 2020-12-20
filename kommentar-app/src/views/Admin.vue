<template>
    <div>
        
        <!-- Menu -->
        <a-layout id="components-layout-demo-custom-trigger">
            <a-layout-sider v-model="collapsed" :trigger="null" collapsible>

                <a-menu theme="dark" mode="inline" v-model="menuKey" >

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
                    
                    <!-- Filter -->
                    <input type="text" style="margin-left:10vh" v-model="searchText">
                
                    <!-- Requests -->
                    <a-table  :data-source="userList[menuKey[0]]" rowKey="username" @onFilter="filter(username)">
                        
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
                menuKey:["dr"],
               
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
                    dr:[],
                    rm:[],
                    rr:[],
                    ra:[],
                };

                this.$store.dispatch("adminAktion/getUserList",{toRole:"Researcher"}).then((result)=>{
                    if(result){
                        for(var key in result){
                            var user = result[key];
                            user.key=key;
                            this.userList.dr.push(user);
                        }
                    }
                    
                }).catch(err => {console.log(err);});

                this.$store.dispatch("adminAktion/getUserList",{toRole:"Reviewer"}).then((result)=>{
                    for(var key in result){
                        var user = result[key];
                        user.key=key;
                        this.userList.rr.push(user);

                    }
                }).catch(err => {console.log(err);});

                this.$store.dispatch("adminAktion/getUserList",{toRole:"Moderator"}).then((result)=>{
                    for(var key in result){
                        var user = result[key];
                        user.key=key;
                        this.userList.rm.push(user);

                    }
                }).catch(err => {
                                console.log(err);});
              
                
                this.$store.dispatch("adminAktion/getUserList",{toRole:"Admin"}).then((result)=>{
                    for(var key in result){
                        var user = result[key];
                        user.key=key;
                        this.userList.ra.push(user);

                    }
                }).catch(err => {
                                console.log(err);});
                

            },

            /**
             * Request the background to change the role of users
             */
            updateRole(agree,user){
                var role="";
                if(this.menuKey=="dr"){
                    role="Researcher";
                }
                else if(this.menuKey=="rm"){
                   role="Moderator";     
                }
                else if(this.menuKey=="rr"){
                    role="Reviewer";
                }
                else if(this.menuKey=="ra"){
                    role="Admin";
                }
               
                this.$store.dispatch("adminAktion/updateRole",{toRole:role,
                                                                flag:agree,
                                                                    userKey:user.key,});
                
            
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