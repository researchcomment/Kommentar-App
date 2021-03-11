<template>
    <div v-if="username" class="rolepage">

        <!-- Role Request -->
        <h3>Upgrade Role</h3>

        <div v-if="allRole">
            You have all Roles!
        </div>

        <div v-if="!allRole">
            <div v-if="roleRequesting">
                <p >Role-Request in Checking</p>
                <ul class="rolelist">
                    <li @click="updateRoleOrCancel('Researcher',true)">
                        <a-tag v-show="update['Researcher']" class="tags">Researcher</a-tag>
                    </li>
                    <li @click="updateRoleOrCancel('Moderator',true)">
                        <a-tag v-show="update['Moderator']" class="tags">Moderator</a-tag>
                    </li>
                    <li @click="updateRoleOrCancel('Reviewer',true)">
                        <a-tag v-show="update['Reviewer']" class="tags">Reviewer</a-tag>
                    </li>
                    <li @click="updateRoleOrCancel('Admin',true)">
                        <a-tag v-show="update['Admin']" class="tags">Admin</a-tag>
                    </li>
                    <br>       
                </ul>
            </div>
            

            <p>I want to be a </p>

            <!-- Researcher Card -->
            <a-card hoverable style="width: 250px" v-if="!role.includes('Researcher') && !update['Researcher']"  @click="updateRoleOrCancel('Researcher',false)">
                <img
                slot="cover"
                alt="Researcher"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />

                <a-card-meta title="Researcher"/>
                <b>Authority:</b> allowed to request for a persistent ID for a comment
                <b>Characteristics:</b> a “Normal User” who verifies his identity.

                <template slot="actions" class="ant-card-actions">
                    <span>
                        <b>Upgrade!</b>
                        <a-icon type="rocket" theme="twoTone" two-tone-color="#eb2f96"></a-icon>
                    </span>
                </template>
    
            </a-card>
        
            <!-- Options for the user, who is already a researcher -->
            <div v-show="role.includes('Researcher')">
                
                <!-- Reviewer Card -->
                <a-card hoverable style="width: 250px" v-if="!role.includes('Reviewer') && !update['Reviewer']"  @click="updateRoleOrCancel('Reviewer',false)">
                    <img
                    slot="cover"
                    alt="Reviewer"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />

                    <a-card-meta title="Reviewer" />
                    <b>Authority:</b> allowed to assign a persistent ID for a comment

                    <template slot="actions" class="ant-card-actions" >
                        <span>
                            <b>Upgrade!</b>
                            <a-icon type="rocket" theme="twoTone" two-tone-color="#eb2f96"></a-icon>
                        </span>
                    </template>
                
                </a-card>

                <!-- Moderator Card -->
                <a-card hoverable style="width: 250px" v-if="!role.includes('Moderator') && !update['Moderator']"  @click="updateRoleOrCancel('Moderator',false)">
                    <img
                    slot="cover"
                    alt="Moderator"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />

                    <!-- Introduction -->
                    <a-card-meta title="Moderator"></a-card-meta>
                    <b>Authority:</b> allowed to delete or mark “non-binding comment” so that this comment not visible to other users
                    
                    <!-- Action -->
                    <template slot="actions" class="ant-card-actions">
                        <span>
                            <b>Upgrade!</b>
                            <a-icon type="rocket" theme="twoTone" two-tone-color="#eb2f96"></a-icon>
                        </span>
                    </template>
        
                </a-card>

                <!-- Admin Card -->
                <a-card hoverable style="width: 250px" v-if="!role.includes('Admin') && !update['Admin']"   @click="updateRoleOrCancel('Admin',false)">
                    <img
                    slot="cover"
                    alt="Admin"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />

                    <a-card-meta title="Admin" > </a-card-meta>

                    <b>Authority:</b>
                        all
                    <b>Characteristics:</b>
                        User can assign the authorities

                    <template slot="actions" class="ant-card-actions">
                        <span>
                            <b>Upgrade!</b>
                            <a-icon type="rocket" theme="twoTone" two-tone-color="#eb2f96"></a-icon>
                        </span>
                    </template>
                </a-card>

            </div>
        </div>
    </div>
</template>

<script>
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

            allRole(){
                return this.role.length >= 5;
            },

            roleRequesting(){
                return (this.update['Researcher']||this.update['Moderator']||this.update['Reviewer'] ||this.update['Admin']);
            }

        },

    
        methods:{

            /**
             * send role request according to the click action 
             * @param role - the role which the user selects
             * @param cancel - whether it is cancel request
             * 
             */
            updateRoleOrCancel(role,cancel){
                let request="askFromUser/updateRole";
                if (cancel)
                    request=request.concat("Cancel");
                this.$store.dispatch(request,{toRole:role});
                this.update[role]=true;
                if (cancel)
                    this.update[role]=false;
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
    margin: 1vw;
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