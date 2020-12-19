<template>
    <div v-if="username">


        <!-- Role Request -->
        <h3>Update Role</h3>
        <p>I want to be a </p>
       

        <!-- Researcher Card -->
       
        <a-card hoverable style="width: 200px" v-if="role.indexOf('Researcher')<0"  @click="updateRole('Researcher')">
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
            <a-card hoverable style="width: 200px"  v-if="role.indexOf('Reviewer')<0" @click="updateRole('Reviewer')">
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
            <a-card hoverable style="width: 200px"  v-if="role.indexOf('Moderator')<0"  @click="updateRole('Moderator')">
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
            <a-card hoverable style="width: 200px"  v-if="role.indexOf('Admin')<0"  @click="updateRole('Admin')">
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

        <!-- <a-modal v-model="visible" title="Basic Modal" @ok="handleOk">
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </a-modal> -->
     

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

        },
        

        methods:{



            /**
             * send role request according to the click action 
             * @param role - the role which the user selects
             */
            updateRole(role){
                var msg = 'Do you want to update to the Role '+ role + '?';
                //open a Modal
                this.$confirm({
                        title: "Update Role Request",
                        content: msg,
                        onOk() {
                            console.log(role);
                            // var result = this.$store.dispatch("askFromUser/updateRole",role)
                            // .catch(err => {
                            //         alert.log(err);
                            //             });
                            // return new Promise((resolve, reject) => {
                            //     setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                            // }).catch(() => console.log('Oops errors!'));
                        },
                        onCancel() {},
                    });


            },

        }

        
    }
</script>

<style lang="scss" scoped>

</style>