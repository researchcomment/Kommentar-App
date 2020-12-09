import firebase from 'firebase/app';
import axios from 'axios';
import worklist from './worklist';

const state = () => ({
    /*
    title: null,
    author: null,
    editor: null,
    chair: null,
    translator: null,
    contributor: null,
    bibliographic: null,
    affiliation: null,
    doi: null,
    */
    commit_private: {
        data: [],
        length: 0
    },
    commit_public: {
        data: [],
        length: 0
    }
})

const url = "http://api.crossref.org/works/";

const getters = {}

function settimestramp(item) {
    if (item.timestamp) {
        return item.timestamp;
    }
    if (item["date-time"]) {
        return new Date(item["date-time"].getTime());
    }
    if (item["date-parts"]) {
        let datet = item["date-parts"];
        return new Date(datet[0], datet[1], datet[2]).getTime();
    }
    return null;
}
function cons_returnValue(item_ref) {
    //actural reference of result list from crossref
    //construct info which needed to be return  
    item_ref.title = item_ref.title ? item_ref.title[0] : null;
    item_ref.author = item_ref.author ? worklist.construct_author(item_ref.author) : null;
    item_ref.domain = item_ref["content-domain"].domain ? item_ref["content-domain"].domain[0] : null;
    item_ref["published-print"] = item_ref["published-print"] ? settimestramp(item_ref["published-print"]) : null;
    item_ref["deposited"] = item_ref["deposited"] ? settimestramp(item_ref["deposited"]) : null;
    item_ref["created"] = item_ref["created"] ? settimestramp(item_ref["created"]) : null;
    return item_ref;
}

//async function return promise
async function get_detail(doi) {
    var search_url = url + doi;
    console.log(search_url);
    return axios.get(search_url).then(res => {
        //get reference : res -> data -> message
        let ref = res.data.message;
        let returnValue = null;
        if (ref) {
            //save current 100 results in items as a list
            console.log("response endding：" + new Date());
            returnValue = cons_returnValue(ref);
        }

        console.log("results construction endding：" + new Date());
        console.log(returnValue);
        return returnValue;
    }).catch(err => {
        console.log(err);
    });
}
async function getDoi_key(doi) {
    //每次打details页面的时候在数据库中寻找对应doi的键并定义当前状态的doi_key,方法sendFromEditorToDatabase进行调用
        //这个定义doi_key的位置需要优化，注意异步操作
        var doi_key = null;
        firebase.database().ref('doi_repository').once('value').then((snapshot) => {
            var doi_found = false;
            snapshot.forEach((childSnapshot) => {
                var doiKey = childSnapshot.key;
                var childDoi = childSnapshot.doi_nr;
                if (childDoi === doi) {
                    doi_found = true;
                    doi_key = doiKey
                }
            })
            if(doi_found === false){
                var newDoiKey = firebase.database().ref('doi_repository').push().key;
                doi_key = newDoiKey
            }
        })
            .catch((error) => {
                console.log(error)
            })
            return doi_key
}

const actions = {
    async askfordetail({ commit, state, rootState }, { doi, username }) {
       
        return returnValue;
    },

    //create new Entry in realtime-DB for Editor-Input 
    async sendFromEditorToDatabase({ commit, state }, { doi, username, content }) {
        /*
        //set content with doi username to database
        const userKey = firebase.auth().currentUser.uid;
        var aData = new Date();//utc
        //uhrzeit, die Zeit von verschiedenen Regionen anzupassen.
        const value = aData.getFullYear() + "-" + (aData.getMonth() + 1) + "-" + aData.getDate();
        const entry = {
            doi_nr: doi,
            userId: userKey,
            usr: username,
            details: content,
            createDate: value,
            type: 'defaultType'
        }
        //生成一个评论的key,并把key加入用户数据的comments项中
        const commentKey = firebase.database().ref('editor_content').push(entry)
            .then((data) => {
                //读取一次当前用户在DB中的信息,并且更新用户信息中的comments目录
                firebase.database().ref('/users/' + userKey).once('value').then((snapshot) => {
                    var oldComments = snapshot.child('comments');
                    var newComments = JSON.parse(JSON.stringify(oldComments.val()));
                    //这里评论的类型需要加工     
                    newComments[data.key] = "defaultType";
                    //这里直接更新
                    firebase.database().ref('/users/' + userKey + '/comments').set(newComments)
                })
            })
            .catch((error) => {
                //for debug only, will be finished later
                console.log(error.message);
            }).key;
        */

        //version 2
        //set content with doi username to database
        const userKey = firebase.auth().currentUser.uid;
        var aData = new Date();//utc
        //uhrzeit, die Zeit von verschiedenen Regionen anzupassen.
        const value = aData.getFullYear() + "-" + (aData.getMonth() + 1) + "-" + aData.getDate();
        const newComent = {
            //doi is optional
            doi_nr: doi,
            userId: userKey,
            usr: username,
            details: content,
            createDate: value,
            type: 'defaultType'
        }
        //在doi资料库中生成一个评论的key,并把key加入用户数据的comments项中
        //此处只能使用firebase自动配置的key，doi形式不适合作为key

        firebase.database().ref('doi_repository/' + doi_key).push(newComent)
            .then((data) => {
                //读取一次当前用户在DB中的信息,并且更新用户信息中的comments目录
                firebase.database().ref('/users/' + userKey).once('value').then((snapshot) => {
                    var oldComments = snapshot.child('comments');
                    var newComments = JSON.parse(JSON.stringify(oldComments.val()));
                    //这里评论的类型需要加工     
                    newComments[data.key] = "defaultType";
                    //这里直接更新
                    firebase.database().ref('/users/' + userKey + '/comments').set(newComments)
                })
            })
            .catch((error) => {
                //for debug only, will be finished later
                console.log(error.message);
            }).key;
    },

    //load comments for work from realtime Database
    //测试之后发现加载offcial和unofficialComments的方法合并和拆分实现没有性能上的区别，
    //防止随后加入新的不同操作，这里暂时分开写
    async loadUnOfficialComments({ commit, state }, { doi, rankType }) {
        //rankType: 'submittime', 'onlyfromCurrentUser'
        //首先每次调用此方法的时候，应该在DB收集所有doi为给入doi的comments条目
        let resultList = await firebase.database().ref('/editor_content/').once('value').then((snapshot) => {
            var commentsList = [];
            var commentsCurrentUser = [];
            snapshot.forEach(childSnapshot => {
                var childVal = childSnapshot.val();
                var childUsr = childVal.usr;
                var childDoi = childVal.doi_nr;
                var commentType = childVal.type;
                var commentDetail = childVal.details;
                var commentAuthor = childVal.usr;
                if (childDoi === doi && (commentType === "defaultType")) {
                    commentsList.push({ content: commentDetail, author: commentAuthor })
                    //check current username and childusername, not work because login state is not snyc, this.username ist undefined
                    if (childUsr === this.username) {
                        commentsCurrentUser.push({ content: commentDetail, author: commentAuthor })
                    }
                }
            })
            if (rankType === "onlyfromCurrentUser") {
                console.log(commentsCurrentUser)
                return commentsCurrentUser.slice().reverse()
            }
            else {
                return commentsList.slice().reverse()
            }
        })
        return resultList
    },
    async loadOfficialComments({ commit, state }, { doi, rankType }) {
        //rankType: 'submittime', 'onlyfromCurrentUser'
        //首先每次调用此方法的时候，应该在DB收集所有doi为给入doi的comments条目
        let resultList = await firebase.database().ref('/editor_content/').once('value').then((snapshot) => {
            var commentsList = [];
            var commentsCurrentUser = [];
            snapshot.forEach(childSnapshot => {
                var childVal = childSnapshot.val();
                var childUsr = childVal.usr;
                var childDoi = childVal.doi_nr;
                var commentType = childVal.type;
                var commentDetail = childVal.details;
                var commentAuthor = childVal.usr;
                if (childDoi === doi && (commentType === "officalType")) {
                    commentsList.push({ content: commentDetail, author: commentAuthor })
                    //check current username and childusername, not work because login state is not snyc, this.username ist undefined
                    if (childUsr === this.username) {
                        commentsCurrentUser.push({ content: commentDetail, author: commentAuthor })
                    }
                }
            })
            if (rankType === "onlyfromCurrentUser") {
                console.log(commentsCurrentUser)
                return commentsCurrentUser.slice().reverse()
            }
            else {
                return commentsList.slice().reverse()
            }
        })
        return resultList
    }
}

const mutations = {

    setlist(state, list) {
        state.list = list
    },

    setusername(state, username) {
        state.username = username
    },
    setdoi_key(state, doi_key) {
        state.doi_key = doi_key
    }

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}