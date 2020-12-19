<template>
    <div v-if="username">


        <!-- Role Request -->
        <h3>Update Role</h3>
        <p>I want to be a </p>
       

        <!-- Researcher Card -->
       
        <a-card hoverable style="width: 200px"  @click="setRequest('Researcher')" v-show="role.indexOf('Researcher')<0">
            <img
            slot="cover"
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
            <template slot="actions" class="ant-card-actions">
                <b>I Want it</b>
                <a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96" v-show="roleRequest.indexOf('Researcher')>-1"/>
            </template>
            <a-card-meta title="Researcher" description="what a Researcher can do : balabla">
            </a-card-meta>
        </a-card>
       

        <p></p>

        <!-- Options for the user, who is already a researcher -->
        <div v-show="role.indexOf('Researcher')>-1">

            <!-- Reviewer Card -->
            <a-card hoverable style="width: 200px"  v-if="role.indexOf('Reviewer')<0" @click="setRequest('Reviewer')">
                <img
                slot="cover"
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
                <template slot="actions" class="ant-card-actions" >
                    <b>I Want it</b>
                    <a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96" v-show="roleRequest.indexOf('Reviewer')>-1"/>
                </template>
                <a-card-meta title="Reviewer" description="what a Reviewer can do : balabla">
                
                </a-card-meta>
            </a-card>

            <!-- Moderator Card -->
            <a-card hoverable style="width: 200px"  v-if="role.indexOf('Moderator')<0"  @click="setRequest('Moderator')">
                <img
                slot="cover"
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
                <template slot="actions" class="ant-card-actions">
                    <b>I Want it</b>
                    <a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96"  v-show="roleRequest.indexOf('Moderator')>-1"/>
                </template>
                <a-card-meta title="Moderator" description="what a Moderator can do : balabla">
                
                </a-card-meta>
            </a-card>

            <!-- Admin Card -->
            <a-card hoverable style="width: 200px"  v-if="role.indexOf('Admin')<0"  @click="setRequest('Admin')">
                <img
                slot="cover"
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
                <template slot="actions" class="ant-card-actions">
                    <b>I Want it</b>
                    <a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96" v-show="roleRequest.indexOf('Admin')>-1" />
                </template>
                <a-card-meta title="Admin" description="what a Admin can do : balabla">
                
                </a-card-meta>
            </a-card>

        </div>
        <a-button type="dashed" @click="updateRole">confirm</a-button>
     

    </div>
</template>

<script>
    export default {

        data(){
            return{
                roleRequest:[],
            }
        },

        computed: {
    
            username() {
                return this.$store.state.account.username;
            },

            role() {
                return this.$store.state.account.role;
            },

        },
        

        methods:{

            /**
             * ! 涉及后端交互
             * send a request to firebase for update of roles
             */
            updateRole(){
               // TODO:this.$store.....updateRoleRequest(username,this.roleRequest);
               console.log(this.roleRequest)
            },

            /**
             * add/delete role according to the click action 
             * @param role - the role which the user selects
             */
            setRequest(role){
                var index = this.roleRequest.indexOf(role);
                
                if(index>-1){
                    // if already selected
                    this.roleRequest.pop(role);
                }
                else{
                    this.roleRequest.push(role);
                }

            },

        }

        
    }
</script>

<style lang="scss" scoped>

</style>