const crypto = require('crypto');

class userControl {
    sqlite = require('sqlite3');
    
    constructor(dbName){
        this.db = new this.sqlite.Database('./database/'+dbName, (err)=>{
            if (err) throw {error:err, code:500}
        })
    }

    createUserTable(){
        return new Promise((resolve, reject) => {
            const query = `CREATE TABLE IF NOT EXISTS USERS(
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                NAME TEXT NOT NULL,
                EMAIL TEXT UNIQUE NOT NULL,
                PASSWORDHASH TEXT NOT NULL,
                TYPE    TEXT    NOT NULL
                                CHECK (TYPE IN ('FULL_TIME', 'PART_TIME') ),
                SALT TEXT NOT NULL
            );`;
            this.db.run(query, (err) => {
                if(err){
                    reject({error:err, code:500})
                    return
                }
                resolve(true)
            });
        });
    }

    async getUser(email, password){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USERS WHERE EMAIL = ?';
                this.db.all(sql, [email], (err, rows) => {
                    if (err) { 
                        console.log(err)
                        reject({error:err, code:500}); 
                    }else if (rows.length <= 0) { 
                        reject({error:'No user matched the credentials', code:404});
                    }else{
                        let user = rows[0];
                        crypto.scrypt(password, user.SALT, 64, function(err, hashedPassword) {
                            if (err) reject({error:err, code:500});
                            if(!crypto.timingSafeEqual(Buffer.from(user.PASSWORDHASH, 'hex'), hashedPassword)){
                                resolve(false); 
                            }else{
                                user = {
                                    id:user.ID,
                                    name:user.NAME,
                                    email:user.EMAIL,
                                    type:user.TYPE
                                }
                                resolve(user);
                            }
                        });
                    }
            });
        });
    }

    async updateType(userId, newType){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE USERS SET TYPE = ? WHERE ID = ?;';
                this.db.all(sql, [newType, userId], (err, rows) => {
                    if (err) { 
                        reject({error:err, code:500});
                    }else{
                        resolve(true);
                    }
                });
        });
    }

}

module.exports = userControl;