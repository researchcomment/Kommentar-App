<template>
    <div class="mainadmin">
    <a-layout style="height:95vh">
        <a-layout-header style="display:none">
            
        </a-layout-header>
        <a-layout>
           <!-- Menu -->
            <a-layout-sider width="20%">
                <a-menu theme="dark" mode="inline" v-model="menuKey">

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
            <a-layout-content style="height:88vh,overflow:hidden">
                <div style="background: #fff; padding: 0">
                    
                    
                    <!-- Titel -->
                    <span style="margin-top:2vh;margin-bottom:2vh;font-size:4vw;margin-left:2vw;font-weight:500">User Management</span>

                </div>
                <!-- Filter -->
                <div :style="{ margin: '2vh 1vw', padding: '0', background: '#fff',width:'76vw'}">
                    
                    
                    <h2 style="margin-top:2vh;margin-bottom:2vh;font-size:2vw;margin-left:1vw;font-weight:500">Update to {{menuKey[0]}}</h2>

                    <!-- Filter -->
                    <a-input ref="userNameInput" v-model="searchText" placeholder="Search user">
                        <a-icon slot="prefix" type="user" />
                    </a-input>
                    
                
                    <!-- Requests -->
                    <a-table  :data-source="filteredUserList[menuKey[0]]" rowKey="username">
                          
                        <!-- User Name -->
                        <a-table-column key="username" title="User Name" data-index="username" width="10vw"/>
                        
                        <!-- Role -->
                        <a-table-column key="role" title="Role" data-index="role" width="10vw">
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
                                    <a-button type="dashed" icon="check" @click="openEditor(true,user)" style="display:block;margin-bottom:1vw;padding:0 2vw">Agree</a-button>
                                    <a-button type="dashed" icon="close" @click="openEditor(false,user)" style="display:block;padding:0 2vw">Refuse</a-button>
                                </span>
                            </template>
                        </a-table-column>
                    </a-table>
                </div>
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
                                [{ 'color': [] }],   // font color
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
            async getUserList(key){
                var toRoleList=[];
                if(!key){
                    toRoleList=["Researcher","Reviewer","Moderator","Admin"];
                }
                else{
                    toRoleList=[key];
                }

                this.userList={
                    Researcher:[],
                    Moderator:[],
                    Reviewer:[],
                    Admin:[],
                };
                
                // get userList from DB
                toRoleList.map((role)=>{
                    
                   this.$store.dispatch("adminAktion/getUserList",{toRole:role}).then((result)=>{
                        let user ;                   
                        var list = Object.keys(result).map((key) => {
                                user = result[key];
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
                    this.getUserList(role);
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
            menuKey(newValue){
                this.getUserList(newValue[0]);
    
            },

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
}
#components-layout-demo-basic > .ant-layout {
  margin-bottom: 48px;
}
#components-layout-demo-basic > .ant-layout:last-child {
  margin: 0;
}
.mainadmin{
    width: 99vw;
    overflow: hidden;
    white-space: nowrap;
    min-height: 88vh;
}
.mainadmin .ant-input-affix-wrapper{
    width: 30vw;
    margin-left: 0.8vw;
    margin-bottom: 1vw;
}
.mainadmin .ant-table-thead tr th{
    padding: 2vw;
}
.mainadmin .ant-table-body{
    overflow-x: scroll;
}
.mainadmin .ant-table table{
    width: 76vw;
    
}
.mainadmin .ant-table-tbody tr td{
    padding: 2vw;
    
    
}
.mainadmin .ant-table-tbody .ant-table-row-cell-break-word{
    width: 5vw;
    white-space:nowrap; 
    overflow:hidden; 
    text-overflow:ellipsis;
}
.mainadmin .ant-table-tbody .ant-tag{
    display: block;
    margin-top: 1vw;
}
.mainadmin .ant-table-pagination.ant-pagination{
    margin: 2vw 1vw;
}
</style>