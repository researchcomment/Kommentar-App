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
                    
                    <h2>Update to {{menuKey[0]}}</h2>

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
                                    <a-button type="dashed" icon="check" @click="openEditor(true,user)">Agree</a-button>
                                    <a-button type="dashed" icon="close" @click="openEditor(false,user)">Refuse</a-button>
                                </span>
                            </template>
                        </a-table-column>
                         
                    </a-table>

                </a-layout-content>
            </a-layout>
        </a-layout>
        
        <!-- Feedback -->
        <a-modal
            :title="tmpUser.username"
            :visible="visible"
            @ok="updateRole"
            @cancel="handleCancel"
            >
            <!-- Input -->
            <quill-editor
                v-model="reason"
                :options="editorOption">
            </quill-editor>
        </a-modal>
        
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
                
                tmpUser:{},
                reason:"",
                agree:true,
                visible:false,
                editorOption: {    // style for quill-editor by Review
                    placeholder: "Write your Reason......   \n(Must fill in, if the request is rejected)",
                    modules:{
                        toolbar:[
                                ['bold', 'italic', 'underline', 'strike'],    // toggled buttons
                                ['blockquote', ], 
                                [{ 'color': [] }],   // front color
                                ]
                            }
                }, 

                
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
                    return this.$store.state.account.role.includes("Admin"); // check whether the logged user is Admin
                }
                else{
                    return false; // not logged => not Admin
                }

            },
            
            filteredUserList(){
                return (!this.searchText?this.userList: Object.keys(this.userList).map(key=>(
                        {[key]:this.userList[key].filter( user =>
                            user.username.includes(this.searchText))
                        })
                    ).reduce( ( prev, curr ) =>  Object.assign(prev,curr),new Object()))
                
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
            updateRole(){
                var role=this.menuKey[0];
                var reason = this.reason;

                if((!this.agree)&&(!reason)){
                    // check if the reason is filled by disagree
                    this.$error({
                            title: 'Error message',
                            content: 'Please write down your Reason (Must fill in, if the request is rejected)',
                    });
                    return;
                }
                if(!reason){
                    reason ="";
                }

                if(this.agree){
                    reason = '<h2 style="color:green">Your Request of Update-Role is accepted</h2>'+ reason;
                }
                else{
                    reason = '<h2 style="color:red">Your Request of Update-Role is denied.</h2>'+ reason;
                }
                
                var request = {toRole:role,
                                flag:this.agree,
                                 userKey:this.tmpUser.key,
                                  feedback_content:reason,}
            
                this.$store.dispatch("adminAktion/updateRole",request).then(()=>{
                    this.handleCancel();
                    this.getUserList();
                }).catch((err)=>{console.log(err)})
        
            },

            openEditor(agree,user){
                this.tmpUser =JSON.parse(JSON.stringify(user));
                this.visible =true;
                this.agree=agree;
            },

            /**
             * reset the comment by Cancel
             * @param comment
             */
            handleCancel(){
                this.tmpUser = {};
                this.reason = "";
                this.agree = true;
                this.visible =false;
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
                return userName.includes(this.searchText) ;
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
        },

        watch:{
            menuKey(){
                this.getUserList();
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