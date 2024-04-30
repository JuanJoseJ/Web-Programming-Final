const crypto = require('crypto');

class userService {
    userControl = require('../modules/user_control')

    constructor() {
        this.dao = new this.userControl('WA_final.db');
    }

    async getUser(email, password){
        try {
            //The logic is not here because it messed with the timing of the auth
            const user = await this.dao.getUser(email, password);
            if(user){
                return user;
            }else{
                throw {error:"Wrong or missing credentials", code:401}
            }
        } catch (error) {
            throw error;
        }
    }

    async updateType(userId, newType){
        const types = ['FULL_TIME','PART_TIME'];
        try {
            if(!types.includes(newType.toUpperCase())){
                throw {error:'The new type is not valid', code:400};
            }else{
                await this.dao.updateType(userId, newType.toUpperCase());
            }
        } catch (error) {
            throw error;
        }
    }

}

module.exports = userService;