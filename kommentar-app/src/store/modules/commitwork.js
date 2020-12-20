import firebase from "firebase/app";
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
        //version 2
        //找到userkey
        let userKey = firebase.auth().currentUser.uid;
        var aData = new Date();//utc
        //uhrzeit, die Zeit von verschiedenen Regionen anzupassen.
        const value = aData.getFullYear() + "-" + (aData.getMonth() + 1) + "-" + aData.getDate();
        const newComent = {
            //doi is optional
            doi_nr: doi,
            PermanentID:"",
            type: 'unofficial',
            status:{            //status=[]
                Review:false,
                PID:false
            }, 
               // ["in Review", "ask for PID",...] 
            active:true,    // the Admin can hide the comments
            author:author,
            content: content,
            likes: 0,
            dislikes: 0,
            createDate: value,
            user_id:userKey,
        }
        let doiKey=doi.replaceAll(".","'");
        //在doi资料库中生成一个评论的key,并把key加入用户数据的comments项中
        //replace . as ' to use in key, it too slow to check all the database to find out the current doi
        
        let comments_key = firebase.database().ref('doi_repository/' + doiKey + '/comments').push(newComent).key;
        return firebase.database().ref('users/' + userKey + '/comments/' + comments_key).set({
            type: 'unofficial',
            doi: doi
        }).catch((error) => {
            //for debug only, will be finished later
            console.log(error.message);
        });
           
    },

    //load comments for work from realtime Database
    async loadComments({ commit, state }, { doi, rankType, username,type}) {
        //rankType: 'submittime', 'onlyfromCurrentUser'
        let result=[];  
        let doiKey=doi.replaceAll(".","'");
        return firebase
            .database()
            .ref('doi_repository/' + doiKey + '/comments')
            .once('value')
            .then((snapshot) => {
                return snapshot.val();
            }).catch((error) => {
                //for debug only, will be finished later
                console.log(error.message);
            });
    },

   
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