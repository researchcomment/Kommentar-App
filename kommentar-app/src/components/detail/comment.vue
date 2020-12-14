<template>
    <a-comment>
        <template slot="actions">

            <!-- the number of likes -->
            <span key="comment-basic-like">
                <a-tooltip title="Like">
                <a-icon type="like" :theme="action === 'liked' ? 'filled' : 'outlined'" @click="like"/>
                </a-tooltip>
                <span style="padding-left: '8px';cursor: 'auto'">
                    {{ likes }}
                </span>
            </span>

            <!-- the number of dislikes -->
            <span key="comment-basic-dislike">
                <a-tooltip title="Dislike">
                <a-icon
                    type="dislike"
                    :theme="action === 'disliked' ? 'filled' : 'outlined'"
                    @click="dislike"
                />
                </a-tooltip>
                <span style="padding-left: '8px';cursor: 'auto'">
                {{ dislikes }}
                </span>
            </span>
            <!-- <span key="comment-basic-reply-to">Reply to</span> -->
        </template>
    
        <!-- the detail of this comment -->
            <a slot="author">{{author}}</a>

            <!-- user pictures -->
            <a-avatar
                slot="avatar"
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            />
            
            <p slot="content" v-html="content"></p>
            
            <!-- time -->
            <!-- <a-tooltip slot="datetime" :title="moment().format('YYYY-MM-DD HH:mm:ss')">
                <span>{{ moment().fromNow() }}</span>
            </a-tooltip> -->
    </a-comment>
</template>

<script>

import Antd from 'ant-design-vue'
import Vue from 'vue'
import moment from 'moment';
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd)

    export default {
        props:["comment",],
        data() {
            return {
                author:this.comment.author,
                content:this.comment.content,
                likes: 0,
                dislikes: 0,
                action: null,
                moment,
            };
        },
        methods: {
            like() {
                this.likes += 1;
                this.action = 'liked';
            },
            dislike() {
                this.dislikes += 1;
                this.action = 'disliked';
            },
        },
};
</script>

<style lang="scss" scoped>

</style>