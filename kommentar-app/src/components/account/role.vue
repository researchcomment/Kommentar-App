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
        <a-card hoverable style="width: 250px" v-if="!role.includes('Researcher') && !update['Researcher']"  @click="updateRole('Researcher')">
            <img
            slot="cover"
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />

             <a-card-meta title="Researcher"/>
             <b>Authority:</b> allowed to request for a persistent ID for a comment
             <b>Characteristics:</b> a “Normal User” who verifies his identity.

            <template slot="actions" class="ant-card-actions">
                <span>
                    <b>I Want it</b>
                    <a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96"></a-icon>
                </span>
            </template>
  
        </a-card>
       

        <p></p>


        <!-- Options for the user, who is already a researcher -->
        <div v-show="role.includes('Researcher')">
            
            <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
                
                <!-- Reviewer Card -->
                <a-col :span="8"  v-if="!role.includes('Reviewer') && !update['Reviewer']">
                    
                    <a-card hoverable style="width: 250px"  @click="updateRole('Reviewer')">
                        <img
                        slot="cover"
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        />

                        <a-card-meta title="Reviewer" />
                        <b>Authority:</b> allowed to assign a persistent ID for a comment

                        <template slot="actions" class="ant-card-actions" >
                            <span>
                                <b>I Want it</b>
                                <a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96"></a-icon>
                            </span>
                        </template>
                    
                    </a-card>
                </a-col>

                <!-- Moderator Card -->
                <a-col :span="8"  v-if="!role.includes('Moderator') && !update['Moderator']">
                    <a-card hoverable style="width: 250px"   @click="updateRole('Moderator')">
                        <img
                        slot="cover"
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        />

                        <!-- Introduction -->
                        <a-card-meta title="Moderator"></a-card-meta>
                        <b>Authority:</b> allowed to delete or mark “non-binding comment” so that this comment not visible to other users
                        
                        <!-- Action -->
                        <template slot="actions" class="ant-card-actions">
                            <span>
                                <b>I Want it</b>
                                <a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96"></a-icon>
                            </span>
                        </template>
            
                    </a-card>
                </a-col>

                <!-- Admin Card -->
                <a-col :span="8" v-if="!role.includes('Admin') && !update['Admin']">
                    <a-card hoverable style="width: 250px"    @click="updateRole('Admin')">
                        <img
                        slot="cover"
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        />

                        <a-card-meta title="Admin" > </a-card-meta>

                        <b>Authority:</b>
                            all
                        <b>Characteristics:</b>
                            User can assign the authorities

                        <template slot="actions" class="ant-card-actions">
                            <span>
                                <b>I Want it</b>
                                <a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96"></a-icon>
                            </span>
                        </template>
                    </a-card>
                </a-col>
            </a-row>

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