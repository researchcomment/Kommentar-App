import firebase from 'firebase/app';
import axios from 'axios';

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

const getters = {}

const actions = {
    askfordetail({ commit, state, rootState}, { doi, username }) {
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

        //直接使用doi向crossref发送
      
        

        //give the first 5 commit of each part, can reuse changepage
        let returnValue = {
            title: "The 'book' of my own ",
            author: "You know WHO !!!",
            editor: "Harry Potter",
            chair: "Ron Weasley",
            translator: "Hermine Granger",
            contributor: "Albus Dumbledore",
            bibliographic: "///",
            affiliation: ",",
            doi: "1232334234",
            commit_private: {
                data: [
                    {
                        content: "This is a new Day!",
                        author: "Merker"
                    }
                ],
                length: 1
            },
            commit_public: {
                data: [
                    {
                        content: "This is a Bad Day!",
                        author: "John"
                    }
                ],
                length: 1
            }
        }
        //if possible, we can use state instead
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
    async sendFromEditorToDatabase({ commit, state }, { doi, username, content }) {
        const details = 
        await axios.get("http://api.crossref.org/works/10.4324/9781315175041").then(res=>{
            console.log(res.data.message);
            var mes = res.data.message;
            let returnValue = {
                title: mes['title'],
                author: mes['author'],
                url: mes['URL'],
                ISBN: mes['ISBN'],
                DOI: mes['DOI']
            }
            return returnValue
        })
        
        console.log(details)
        
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