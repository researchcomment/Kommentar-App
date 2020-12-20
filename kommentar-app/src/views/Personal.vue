<template>
    <div>
        <h1>Personal Information</h1>
        <p>
            <b>Name:</b>
            <span>{{username}}</span>
        </p>
        
        <p>
            <b>Role:</b>
            <a-tag v-for="tag in role" :key="tag" :color="getColor(tag)">{{ tag }}</a-tag>
        </p>
        
        <a-menu v-model="menu" mode="horizontal">
            <a-menu-item key="role"> Role </a-menu-item>
            <a-menu-item key="comments" > Comment </a-menu-item>
            <a-menu-item key="messageBox" > Message Box </a-menu-item>
        </a-menu>
        
        <Role v-show="menu[0]=='role'"></Role>
        <CommentList v-show="menu[0]=='comments'" ></CommentList>
        <messageBox v-show="menu[0]=='messageBox'"></messageBox>

    </div>
</template>

<script>
import Role from "@/components/account/role";
import CommentList from "@/components/account/commentList";
import messageBox from "@/components/account/messageBox";

    export default {
        name: "personal",
        components: {
            Role,
            CommentList,
            messageBox,
        },

        data(){
            return{
                roleRequest:[],
                menu:['role'],
            }
        },

        computed: {
    
            username() {
                return this.$store.state.account.username;
            },

            role() {
                return this.$store.state.account.role;
            },

            menuKey(){       
                return this.$route.query.menu;
            }

        },

        beforeRouteEnter (to, from, next) {
            
            // check whether the user is authenticated,
             next(vm => {
                if(!vm.username){
                    alert("illegal access error");
                    next('/');
                }
                else next()
            })  

        },

        watch:{
            
            menuKey(newValue){
                console.log(newValue)
                if(newValue){
                    this.menu = [newValue];
                }
            },

            
        },
        

        methods:{


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

<style lang="scss" scoped>

</style>