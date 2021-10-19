import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
    baseURL : "https://www.icaland.id"
})
instance.defaults.headers.common['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');
instance.defaults.headers.common['Access-Control-Allow-Origin'] = "*";
export default instance;