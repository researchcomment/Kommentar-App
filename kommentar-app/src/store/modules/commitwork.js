import firebase from 'firebase/app';
import axios from 'axios';
import worklist from './worklist';

const state = () => ({
    title: null,
    author: null,
    editor: null,
    chair: null,
    translator: null,
    contributor: null,
    bibliographic: null,
    affiliation: null,
    doi: null,
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

function settimestramp(item){
    if (item.timestamp){
        return item.timestamp;
    }
    if (item["date-time"]){
        return new Date(item["date-time"].getTime());
    }
    if (item["date-parts"]){
        let datet=item["date-parts"];
        return new Date(datet[0],datet[1],datet[2]).getTime();
    }
    return null;
}
function cons_returnValue(item_ref) {
        //actural reference of result list from crossref
        //construct info which needed to be return  
    item_ref.title = item_ref.title ? item_ref.title[0] : null;
    item_ref.author = item_ref.author ? worklist.construct_author(item_ref.author) :null;
    item_ref.domain = item_ref["content-domain"].domain ? item_ref["content-domain"].domain[0]:null;
    item_ref["published-print"] = item_ref["published-print"] ? settimestramp(item_ref["published-print"]):null;
    item_ref["deposited"] = item_ref["deposited"] ? settimestramp(item_ref["deposited"]):null;
    item_ref["created"] = item_ref["created"] ? settimestramp(item_ref["created"]):null;
    
    return item_ref;
    
}

//async function return promise
async function get_detail(doi) {
    var search_url = url+doi;
    console.log(search_url);
    return axios.get(search_url).then(res => {
        //get reference : res -> data -> message
        let ref = res.data.message;
        let returnValue=null;
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

const actions = {
    async askfordetail({ commit, state, rootState}, { doi, username }) {
        //set the information to the state,filter it into title author and doi(may changed from google firebase side)
        //commit('setlist',list)

        //首先每次调用此方法的时候，应该在DB收集所有doi为给入doi的comments条目
        /*
        var commentsList = [];
        firebase.database().ref('/editor_content/').once('value').then((snapshot) => {
            snapshot.forEach(childSnapshot => {
                var childKey = childSnapshot.key;
                var childVal = childSnapshot.val();
                var childDoi = childVal.doi_nr;
                var comments 
                if(childDoi === doi){
                    commentsList.push()
                }
                console.log(childDoi)
            })
        })
        */

        //由于和search结果页面无法同步，而是重新搜索doi关键字，所以信息一致性不能保证

        //give the first 5 commit of each part, can reuse changepage
        let returnValue = await get_detail(doi);
        return returnValue;
    },

    changepage({ commit, state }, { flag, from, to }) {
        //use from and to to search out the matched answer
        //flag shows whether it is private one or a public one
        let returnValue = {
            data: [
                {
                    content: "This is a Bad Day!",
                    author: "John"
                }
            ],
        }
        return returnValue;
    },
    
    //create new Entry in realtime-DB for Editor-Input 
    sendFromEditorToDatabase({ commit, state }, { doi, username, content }) {
        //set content with doi username to database
        const userKey = firebase.auth().currentUser.uid;
        var aData = new Date();
        const value = aData.getFullYear() + "-" + (aData.getMonth() + 1) + "-" + aData.getDate();
        const entry = {
            doi_nr: doi,
            userId: userKey,
            usr: username,
            details: content,
            time: value
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
    },
    //load comments for work from realtime Database
    loadOfficialComments({ commit, state }, { doi }) {
        firebase.database().ref('/')
    }

}

const mutations = {

    setlist(state, list) {
        state.list = list
    },

    setusername(state, username) {
        state.username = username
    }

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}