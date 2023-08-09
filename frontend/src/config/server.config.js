
import axios from 'axios'

// console.log('Hurry', process.env.REACT_APP_API_URL);
axios.defaults.baseURL = 'http://192.168.10.24:4003/v1/';
if(sessionStorage.getItem("data")){
    const data = JSON.parse(sessionStorage.getItem("data"));
    axios.defaults.headers.common = {'Authorization': `bearer ${data.token}`}
}


export default axios;