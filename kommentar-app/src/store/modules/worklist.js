import axios from 'axios'

const state = () => ({
    list: [],
    length: 0
})

const getters = {}
const url = "http://api.crossref.org/work?";
const actions = {
    search({ commit, state }, { keyword }) {
        //set the information to the state,filter it into title author and doi(may changed from google firebase side)
        //commit('setlist',list)

        //give the first 10 information(Todo), can reuse changepage
        /*let returnValue = {
            list: [{
                title: "The 'book' of my own ",
                author: "You know WHO !!!",
                doi: "1232334234"
            }],
            length: 1
        }*/
        keyword = keyword.split(" ");
        keyword = keyword.join("+");
        var search_url = url + "query=" + keyword + "&rows=10";
        let response;
        axios.get(search_url).then(res => {
            response = res.data;
        });
        let returnValue = {
            list: [],
            length: 0
        };
        for (i = 0; i < 10; i++) {
            var path = response.message.items[i];
            if (path) {
                returnValue.list.push({
                    title: path.title[0],
                    author: path.author[0].given + " " + path.author[0].family,
                    doi: path.DOI
                });
                returnValue.length++;
            } else {
                break;
            }
        }
        commit("setlist", list);
        commit("setlength", length);
        return returnValue;
    },

    changepage({ commit, state }, { from, to }) {
        //use from and to to search out the matched answer
        let returnValue = {
            list: [{
                title: "The 'book' of my own ",
                author: "You know WHO !!!",
                doi: "1232334234"
            }]
        }
        return returnValue;
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