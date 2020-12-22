<template>
    <div v-if="username" class="rolepage">


        <!-- Role Request -->
        <h3>Update Role</h3>
        <p>Role-Request in Checking</p>
        <ul class="rolelist">
            <li>
                <a-tag v-show="update['Researcher']" class="tags">Researcher</a-tag>
            </li>
            <li>
                <a-tag v-show="update['Moderator']" class="tags">Moderator</a-tag>
            </li>
            <li>
                <a-tag v-show="update['Reviewer']" class="tags">Reviewer</a-tag>
            </li>
            <li>
                <a-tag v-show="update['Admin']" class="tags">Admin</a-tag>
            </li>
            
            
            
            
        </ul>
        
        <p>I want to be a </p>
       

        <!-- Researcher Card -->
        <a-card hoverable style="width: 200px" v-if="role.indexOf('Researcher')<0 && !update['Researcher']"  @click="updateRole('Researcher')">
            <img
            slot="cover"
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />

            <template slot="actions" class="ant-card-actions">
                <span>
                    <b>I Want it</b>
                    <a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96"></a-icon>
                </span>
            </template>

            <a-card-meta title="Researcher" description="what a Researcher can do : balabla">
            </a-card-meta>
        </a-card>
       

        <p></p>

        <!-- Options for the user, who is already a researcher -->
        <div v-show="role.indexOf('Researcher')>-1">
            
            <!-- Reviewer Card -->
            <a-card hoverable style="width: 200px"  v-if="role.indexOf('Reviewer')<0 && !update['Reviewer']" @click="updateRole('Reviewer')">
                <img
                slot="cover"
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
                <template slot="actions" class="ant-card-actions" >
                    <span>
                        <b>I Want it</b>
                        <a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96"></a-icon>
                    </span>
                </template>
                <a-card-meta title="Reviewer" description="what a Reviewer can do : balabla">
                
                </a-card-meta>
            </a-card>

            <!-- Moderator Card -->
            <a-card hoverable style="width: 200px"  v-if="role.indexOf('Moderator')<0&& !update['Moderator']"  @click="updateRole('Moderator')">
                <img
                slot="cover"
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
                <template slot="actions" class="ant-card-actions">
                    <span>
                        <b>I Want it</b>
                        <a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96"></a-icon>
                    </span>
                </template>
                <a-card-meta title="Moderator" description="what a Moderator can do : balabla">
                
                </a-card-meta>
            </a-card>

            <!-- Admin Card -->
            <a-card hoverable style="width: 200px"  v-if="role.indexOf('Admin')<0 && !update['Admin']"  @click="updateRole('Admin')">
                <img
                slot="cover"
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
                <template slot="actions" class="ant-card-actions">
                    <span>
                        <b>I Want it</b>
                        <a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96"></a-icon>
                    </span>
                </template>
                <a-card-meta title="Admin" description="what a Admin can do : balabla">
                
                </a-card-meta>
            </a-card>

        </div>

    </div>
</template>

<script>
import 'ant-design-vue/dist/antd.css'
import Antd from 'ant-design-vue'
    export default {

        data(){
            return{
                roleInRequest:[],
            }
        },

        computed: {
    
            username() {
                return this.$store.state.account.username;
            },

            role() {
                return this.$store.state.account.role;
            },

            update() {
                return this.$store.state.account.update;
            },

        },

    
        methods:{



            /**
             * send role request according to the click action 
             * @param role - the role which the user selects
             */
            updateRole(role){
                this.$store.dispatch("askFromUser/updateRole",{toRole:role});
                this.update[role]=true;
                this.$notification.open({
                        message: 'Success',
                        description:
                        'Your Request has been submitted.',
                        icon: <a-icon type="smile" style="color: #108ee9" />,
                    });

            },

        }

        
    }
</script>

<style>
.rolepage{
    margin: 2vw;
    height: auto;
}
.rolelist{
    list-style-type: none;
}
.ant-card{
    display: inline-block;
    margin: 2vw;
}
</style>