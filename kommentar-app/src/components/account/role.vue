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
            
                
                <!-- Reviewer Card -->
                    
<<<<<<< HEAD
                    <a-card hoverable style="width: 250px" v-if="!role.includes('Reviewer') && !update['Reviewer']"  @click="updateRole('Reviewer')">
=======
                    <a-card hoverable style="width: 250px" v-if="!role.includes('Researcher') && !update['Researcher']" @click="updateRole('Reviewer')">
>>>>>>> origin/jjy_szj/release
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

                <!-- Moderator Card -->
<<<<<<< HEAD
                    <a-card hoverable style="width: 250px" v-if="!role.includes('Moderator') && !update['Moderator']"  @click="updateRole('Moderator')">
=======
                    <a-card hoverable style="width: 250px" v-if="!role.includes('Researcher') && !update['Researcher']"  @click="updateRole('Moderator')">
>>>>>>> origin/jjy_szj/release
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

                <!-- Admin Card -->
<<<<<<< HEAD
                    <a-card hoverable style="width: 250px" v-if="!role.includes('Admin') && !update['Admin']"   @click="updateRole('Admin')">
=======
                    <a-card hoverable style="width: 250px" v-if="!role.includes('Researcher') && !update['Researcher']" @click="updateRole('Admin')">
>>>>>>> origin/jjy_szj/release
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
    padding: 0;
}
.rolelist li{
    display: inline-block;
}
.ant-card{
    display: inline-block;
    margin: 2vw;
}
.ant-card .ant-card-body{
    height: 17vh;
    padding-left: 2vw;
    padding-right: 2vw;
    padding-top: 2vh;
    padding-bottom: 2vh;
    overflow-y: scroll;
}

</style>