<template>
    <div>
        <a-menu v-model="current" mode="horizontal">
            <a-menu-item key="feedback"> <a-icon type="mail" />Feedback </a-menu-item>
            <a-menu-item key="pid" > <a-icon type="appstore" />PID </a-menu-item>
        </a-menu>

        <Feedback v-show="current[0]=='feedback'"></Feedback>
        <PID v-show="current[0]=='pid'"></PID>
    </div>
</template>

<script>
import PID from "@/components/review/pid";
import Feedback from "@/components/review/feedback";
    export default {
        name:"reviewer",
        components: {
            PID,
            Feedback
        },
        data(){
            return{
               current: ['feedback'],
            }
        },

        computed:{

            /**
             * @returns true, if the current user is Reviewer
             */
            isReviewer(){
                var role = this.$store.state.account.role;
                return role? role.includes("Reviewer"):false; // check whether the logged user is Admin
            }

        },

        beforeRouteEnter (to, from, next) {
            
            // check whether the user is authenticated,
             next(vm => {
                if(!vm.isReviewer){
                    alert("illegal access error");
                    next('/');
                }
                else next()
            })  

        },

        mounted(){
            
        },

        methods:{
            
           

        }

        
    }
</script>

<style>

</style>