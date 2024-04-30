const APIURL = 'http://localhost:3001';

async function login(credentials){
    const res = await fetch(APIURL+'/api/login', {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });
    if(res.ok){
        const user = await res.json();
        return user;
    }else{
        const errDetails = await res.text();
        throw errDetails;
    }
}

async function logout(){
    const res = await fetch(APIURL+'/api/logout', {
        method:'POST',
        credentials: 'include'
    });
    if(res.ok){
        return true;
    }else{
        return false;
    }
}

async function getUserInfo(){
    try {
        const res = await fetch(APIURL+'/api/session', {
            method:'GET',
            credentials: 'include',
        });
        if(res.ok){
            const user = await res.json();
            return user;
        }else{
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function changeType(newType){
    try {
        const res = await fetch(APIURL+'/api/type', {
            method:'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({'newType':newType})
        });
        if(res.ok){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }

}


export {login, getUserInfo, logout, changeType};