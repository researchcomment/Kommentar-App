<template>
    <div>
        {{data}}
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        
        data(){
            return{
                data:"home"
            }
        },
        mounted(){
            //test   crossref API
            axios.get("http://api.crossref.org/members/98").then(res=>{
                this.data=res.data;
            })
        }
    }
</script>

<style>

</style>