import axios from 'axios';
const state = () => ({
    list: [],
    length: 0

})
const url = "http://api.crossref.org/works?query=";
const getters = {}

var items = [];
var cache = 100;
var result_length = 0;

function isNull(obj) {
    if (obj) {
        return false;
    } else {
        return true;
    }
}
//parameter is a referrence of a list of authors
//output is a string of author like: alice ; bob ; eve
function construct_author(author_ref) {
    var length = author_ref.length;
    let author = [];
    for (let i = 0; i < length; i++) {
        author.push(
            isNull(author_ref[i.given]) ? author_ref[i].family : author_ref[i].given + " " + author_ref[i].family
        )
    }
    author = author.join(" ; ");
    return author;
}

function cons_returnValue(returnValue, from, to) {
    if (items[to]) {
        for (var i = from; i < to; i++) {
            //actural reference of result list from crossref
            var item_ref = items[i];
            //construct info which needed to be return
            var _title = !isNull(item_ref.title) ? item_ref.title[0] : "unkown";
            var _author = !isNull(item_ref.author) ? construct_author(item_ref.author) : "unkown";
            var _doi = !isNull(item_ref.DOI) ? item_ref.DOI : "unkown";
            returnValue.list.push({
                title: _title,
                author: _author,
                doi: _doi
            });
        }
        return returnValue;
    } else {
        for (var i = from; i < items.length; i++) {
            //actural reference of result list from crossref
            var item_ref = items[i];
            //construct info which needed to be return
            var _title = !isNull(item_ref.title) ? item_ref.title[0] : "unkown";
            var _author = !isNull(item_ref.author) ? construct_author(item_ref.author) : "unkown";
            var _doi = !isNull(item_ref.DOI) ? item_ref.DOI : "unkown";
            returnValue.list.push({
                title: _title,
                author: _author,
                doi: _doi
            });
        }
        return returnValue;
    }
}

//async function return promise
async function get_worklist(keyword, rows, offset, date) {
    if (offset % cache == 0) {
        //convert keyword in this format list : keyword1+keyword2+...
        keyword = keyword.split(" ");
        keyword = keyword.join("+");
        let datefrom = date.from.getFullYear() + "-" +
            ((date.from.getMonth() + 1) < 10 ? "0" : "") + (date.from.getMonth() + 1) +
            "-" + (date.from.getDate() < 10 ? "0" : "") + date.from.getDate();
        let dateto = date.to.getFullYear() + "-" +
            ((date.to.getMonth() + 1) < 10 ? "0" : "") + (date.to.getMonth() + 1) + "-" +
            (date.to.getDate() < 10 ? "0" : "") + date.to.getDate();
        var search_url = url + keyword + "&filter=from-update-date:" + datefrom +
            ",until-update-date:" + dateto +
            "&rows=" + cache + "&offset=" + offset;
        console.log(search_url);
        let returnValue = {
            list: [],
            length: 0
        };
        return axios.get(search_url).then(res => {
            //get reference : res -> data -> message
            let ref = res.data.message;
            if (!isNull(ref)) {
                //save current 100 results in items as a list
                items = ref.items;
                returnValue = cons_returnValue(returnValue, offset % cache, offset % cache + rows);
                returnValue.length = ref["total-results"];
                result_length = returnValue.length;
                console.log("结果数目：" + result_length);
            }
            return returnValue;
        }).catch(err => {
            console.log(err);
        });
    } else {
        let returnValue = {
            list: [],
            length: 0
        };
        returnValue = cons_returnValue(items, returnValue, offset % cache, offset % cache + rows);
        returnValue.length = result_length;
        return returnValue;
    }
}

const actions = {
    async search({ commit, state }, { keyword, from, to, date }) {
        //set the information to the state,filter it into title author and doi(may changed from google firebase side)
        //commit('setlist',list)
        console.log("keyword is : " + keyword);
        //give the first 10 information(Todo), can reuse changepage
        let pagefrom = 0;
        let pageto = 10;
        if (from)
            pagefrom = from;
        if (to)
            pageto = to;
        //wait inorder to know the setlest and setset will not earlier then them
        let returnValue = await get_worklist(keyword, pageto - pagefrom, pagefrom, date);
        commit('setlist', returnValue.list);
        return returnValue;
    },

    changepage({ commit, state }, { from, to }) {

        let returnValue = get_worklist(last_keyword, to - from, from, date.from, data.to);
        commit('setlist', returnValue.list);
        return returnValue;
    }


}

const mutations = {

    setlist(state, list) {
        state.list = list
    },
    setset(state, set) {
        state.set = set
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