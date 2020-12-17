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

const url = "https://api.crossref.org/works/";

const getters = {}

function settime(item) {
    let date = null;
    let year = null;
    let month = null;
    if (item.timestamp) {
        date = new Date(item.timestamp)
        year = date.getFullYear();
        month = date.getMonth();
        return year + "-" + month;
    }
    if (item["date-time"]) {
        date = new Date(item["date-time"]);
        year = date.getFullYear();
        month = date.getMonth();
        return year + "-" + month;
        //return new Date(item["date-time"]);
        //return item["date-time"];
    }
    if (item["date-parts"]) {
        let datet = item["date-parts"][0];
        if (datet) {
            //return datet[0] ? datet[1] ? datet[2] ? new Date(datet[0], datet[1], datet[2]) :
            //new Date(datet[0], datet[1]) : new Date(new Date().setFullYear(datet[0])) : null
            //注：new Date() 只传年份，会自动转换为毫秒数
            return datet[0] ? datet[1] ? datet[0] + "-" + datet[1] : datet[0] : null;
        }
        //return new Date(datet[0], datet[1], datet[2]);
    }
    return null;
}

function check_type(book_type, comparator) {
    var arr = book_type.split("-");
    return arr.indexOf(comparator) > -1;
}

function cons_returnValue(item_ref) {
    //actural reference of result list from crossref
    //construct info which needed to be return  
    item_ref.domain = item_ref["content-domain"].domain ? item_ref["content-domain"].domain[0] : null;
    console.log(item_ref);
    let returnValue = {};
    returnValue.title = item_ref.title ? item_ref.title[0] : null;
    returnValue.type = item_ref.type;
    returnValue.author = item_ref.author ? worklist.construct_author(item_ref.author) : null;
    returnValue.publisher = item_ref.publisher;
    returnValue.ISBN = item_ref.ISBN ? item_ref.ISBN[0] : null;
    if (item_ref["published-print"]) {
        returnValue["published-print"] = settime(item_ref["published-print"]);
    } else if (item_ref["published-online"]) {
        returnValue["published-online"] = settime(item_ref["published-online"]);
    } else if (item_ref["created"]) {
        returnValue["created"] = settime(item_ref["created"]);
    } else if (item_ref["deposited"]) {
        returnValue["deposited"] = settime(item_ref["deposited"]);
    }

    if (check_type(returnValue.type, "dissertation")) {
        returnValue.institution = item_ref.institution;
    } else if (check_type(returnValue.type, "book")) {

    }

    returnValue.abstract = item_ref.abstract;
    console.log(returnValue);
    return returnValue;
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
const actions = {
    async askfordetail({ commit, state, rootState }, { doi, username }) {
        //give the first 5 commit of each part, can reuse changepage
        let returnValue = await get_detail(doi);
        return returnValue;
    },

    //create new Entry in realtime-DB for Editor-Input 
    async sendFromEditorToDatabase({ commit, state }, { doi, author, content }) {
        console.log('submit')
        console.log(doi)
        //version 2
        //找到userkey
        let userKey = await firebase.database().ref('users').once('value').then((snapshot) => {
            var result = null;
            snapshot.forEach((childSnapshot) => {
                if(author === childSnapshot.val().username){
                    result = childSnapshot.key;
                }
            })
            return result
        })
        var aData = new Date();//utc
        //uhrzeit, die Zeit von verschiedenen Regionen anzupassen.
        const value = aData.getFullYear() + "-" + (aData.getMonth() + 1) + "-" + aData.getDate();
        const newComent = {
            //doi is optional
            doi_nr: doi,
            PermanentID:"",
            type: 'unofficial',
            status:[""],    // ["in Review", "ask for PID",...] 
            active:true,    // the Admin can hide the comments
            author:author,
            content: content,
            likes: 0,
            dislikes: 0,
            createDate: value,

           
        }
        //在doi资料库中生成一个评论的key,并把key加入用户数据的comments项中
        //此处只能使用firebase自动配置的key，doi形式不适合作为key
        return firebase.database().ref('doi_repository').once('value').then((snapshot) => {
            //snapshot是doiKey
            let got_Doi_Nr = snapshot.forEach((childSnapshot) => {
                var childKey = childSnapshot.key;
                var existed_doi_nr = childSnapshot.val().doi_nr;
                if (existed_doi_nr === doi) {
                    //doi对应的文章已经存在，把新的coment加入comments
                    let comments_key = firebase.database().ref('doi_repository/' + childKey + '/comments').push(newComent).key;
                    firebase.database().ref('users/' + userKey + '/comments/' + comments_key).set({
                        type: 'unofficial'
                    })
                    return true;
                }
                return false;
            })
            if (!got_Doi_Nr) {
                //doi对应的文章不存在，那么加入新的文章doi并插入新的comment到空的comments目录
                let new_Doi_Key = firebase.database().ref('doi_repository').push().key;
                firebase.database().ref('doi_repository/' + new_Doi_Key).set({ doi_nr: doi })
                let comments_key = firebase.database().ref('doi_repository/' + new_Doi_Key + '/comments').push(newComent).key;
                firebase.database().ref('users/' + userKey + '/comments/' + comments_key).set({
                    type: 'unofficial'
                })
            }
        }).catch((error) => {
            //for debug only, will be finished later
            console.log(error.message);
        });
        //firebase.database().ref('doi_repository/' + newDoi_key + '/comments').set(newComent)   
        /*
        firebase.database().ref('doi_repository').push(newComent)
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
    },

    //load comments for work from realtime Database
    //测试之后发现加载offcial和unofficialComments的方法合并和拆分实现没有性能上的区别，
    //防止随后加入新的不同操作，这里暂时分开写
    async loadUnOfficialComments({ commit, state }, { doi, rankType, username}) {
        //rankType: 'submittime', 'onlyfromCurrentUser'
        //首先每次调用此方法的时候，应该在DB收集所有doi为给入doi的comments条目
        
        let doiKey = await firebase.database().ref('doi_repository').once('value').then((snapshot) => {
            var tempresult = null;
            snapshot.forEach((childSnapshot) => {
                var child_doi_nr = childSnapshot.val().doi_nr;
                var childKey = childSnapshot.key;
                if (child_doi_nr === doi) {
                    tempresult = childSnapshot.key;
                }
            })
            return tempresult;
        })
        let result=[];
        if(doiKey){
            result = await firebase
            .database()
            .ref('doi_repository/' + doiKey + '/comments')
            .once('value')
            .then((snapshot) => {
                var commentsList = []
                var commentsList_CurrentUser = []
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.val().type === 'unofficial') {
                        var value=childSnapshot.val();
                        value.UID=childSnapshot.key;
                        commentsList.push(value)
                        if (childSnapshot.val().usr === username) {
                            commentsList_CurrentUser.push(value)
                        }
                    }
                })
                if (rankType === 'onlyfromCurrentUser') {
                    return commentsList_CurrentUser.slice().reverse();
                }
                else {
                    return commentsList.slice().reverse();
                }
            })
        }
        return result
        
        
    },

    async loadOfficialComments({ commit, state }, { doi, rankType, username}) {
        //rankType: 'submittime', 'onlyfromCurrentUser'
        //首先每次调用此方法的时候，应该在DB收集所有doi为给入doi的comments条目
        let doiKey = await firebase.database().ref('doi_repository').once('value').then((snapshot) => {
            var result = null;
            snapshot.forEach((childSnapshot) => {
                var child_doi_nr = childSnapshot.val().doi_nr;
                var childKey = childSnapshot.key;
                if (child_doi_nr === doi) {
                    result = childSnapshot.key;
                }
            })
            return result;
        })
        let result=[];
        if(doiKey){
            result = await firebase
            .database()
            .ref('doi_repository/' + doiKey + '/comments')
            .once('value')
            .then((snapshot) => {
                var commentsList = []
                var commentsList_CurrentUser = []
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.val().type === 'official') {
                        var value=childSnapshot.val();
                        value.UID=childSnapshot.key;
                        commentsList.push(value)
                        if (childSnapshot.val().usr === username) {
                            commentsList_CurrentUser.push(value)
                        }
                    }
                })
                if (rankType === 'onlyfromCurrentUser') {
                    return commentsList_CurrentUser.slice().reverse();
                }
                else {
                    return commentsList.slice().reverse();
                }
            })
        }
        return result
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