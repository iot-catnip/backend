const axios = require("axios");

export const loginRoutine = user => new Promise ((resolve, reject) => {
    axios({url: '/api/login', data: user, method: 'POST' })
        .then(resp => {
            //check if response is correct
            if (resp.data.success){
                const token = resp.data.token
                localStorage.setItem('user-token', token) // store the token in localstorage
                axios.defaults.headers.common['Authorization'] = token
                resolve(resp)
            }
            //Logout to avoid unexpect connexion
            logoutRoutine.then(()=>{
                reject(resp)
            })
        })
        .catch(err => {
            //Logout to avoid unexpect connexion
            logoutRoutine.then(()=>{
                reject(err)
            })
        })
})

export const logoutRoutine = new Promise ((resolve) => {
    localStorage.removeItem('user-token')
    // remove the axios default header
    delete axios.defaults.headers.common['Authorization']
    resolve(true)
})