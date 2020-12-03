<template>
    <div>
        Title: {{Title}}
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        props:["doi"],
        data(){
            return{

            }
        },
        computed:{
            Title(){
                return axios.get("http://api.crossref.org/works/" + this.doi).then(res => {
                    return res.data.message.title[0];
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>