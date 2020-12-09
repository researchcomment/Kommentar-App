import axios from 'axios';
const state = () => ({
    list: [],
    length: 0

})
const url = "http://api.crossref.org/works?";
const getters = {}

var items = [];
var cache = 100;
var result_length = 0;
var last_offset = -1;
var last_keyword = "";
var last_date = new Date().setFullYear(2019);


//parameter is a referrence of a list of authors
//output is a string of author like: alice ; bob ; eve
function construct_author(author_ref) {
    var length = author_ref.length;
    let author = [];
    for (let i = 0; i < length; i++) {
        author.push(!author_ref[i].given ? author_ref[i].family : author_ref[i].given + " " + author_ref[i].family)
    }
    author = author.join(" ; ");
    return author;
}
//construct results from response
function cons_returnValue(returnValue, from, to) {
    let length = to <= items.length ? to : items.length;

    for (var i = from; i < length; i++) {
        //actural reference of result list from crossref
        var item_ref = items[i];
        //construct info which needed to be return
        var _title = item_ref.title ? item_ref.title[0] : "unkown";
        var _author = item_ref.author ? construct_author(item_ref.author) : "unkown";
        var _doi = item_ref.DOI ? item_ref.DOI : "unkown";
        returnValue.list.push({
            title: _title,
            author: _author,
            doi: _doi
        });
    }
    return returnValue;

}

//async function return promise
//flag=true : send new request, get results from response; 
//falg=false : do not send request, get result from cache
async function get_worklist(keyword, rows, offset, date, type, flag) {
    if (offset % cache == 0 || flag) {
        last_offset = offset;
        last_keyword = keyword;
        last_date = date;
        //convert keyword in this format list : keyword1+keyword2+...
        keyword = keyword.split(" ");
        keyword = keyword.join("+");
        let datefrom = date.from.getFullYear() + "-" +
            ((date.from.getMonth() + 1) < 10 ? "0" : "") + (date.from.getMonth() + 1) +
            "-" + (date.from.getDate() < 10 ? "0" : "") + date.from.getDate();
        let dateto = date.to.getFullYear() + "-" +
            ((date.to.getMonth() + 1) < 10 ? "0" : "") + (date.to.getMonth() + 1) + "-" +
            (date.to.getDate() < 10 ? "0" : "") + date.to.getDate();
        /*var search_url = url + keyword + "&filter=from-update-date:" + datefrom +
            ",until-update-date:" + dateto +
            "&rows=" + cache + "&select=DOI,title,author" + "&offset=" + offset;*/
        var filter_type = type.map(x => "type:" + x).join(",");
        var search_url = url + "filter=from-update-date:" + datefrom +
            ",until-update-date:" + dateto + "&select=DOI,title,author" + "&filter=" + filter_type + "&query=" + keyword + "&rows=" + cache + "&offset=" + offset;
        console.log(search_url);
        let returnValue = {
            list: [],
            length: 0
        };
        console.log("request beginning：" + new Date());
        return axios.get(search_url).then(res => {
            //get reference : res -> data -> message
            let ref = res.data.message;
            if (ref) {
                //save current 100 results in items as a list
                items = ref.items;
                console.log("response endding：" + new Date());
                returnValue = cons_returnValue(returnValue, offset % cache, offset % cache + rows);
                returnValue.length = ref["total-results"];
                result_length = returnValue.length;
            }
            console.log("results construction endding：" + new Date());
            return returnValue;
        }).catch(err => {
            console.log(err);
        });
    } else {
        let returnValue = {
            list: [],
            length: 0
        };
        returnValue = cons_returnValue(returnValue, offset % cache, offset % cache + rows);
        returnValue.length = result_length;
        return returnValue;
    }
}
//type=[""]
//flag=true/false true:new search false:page change
const actions = {
    async search({ commit, state }, { keyword, from, to, date, type, flag }) {
        //set the information to the state,filter it into title author and doi(may changed from google firebase side)
        //commit('setlist',list)
        //give the first 10 information(Todo), can reuse changepage
        let pagefrom = 0;
        let pageto = 10;
        if (from)
            pagefrom = from;
        if (to)
            pageto = to;
        //wait inorder to know the setlest and setset will not earlier then them
        let returnValue = await get_worklist(keyword, pageto - pagefrom, pagefrom, date, type, flag);
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
    mutations,
    construct_author
}