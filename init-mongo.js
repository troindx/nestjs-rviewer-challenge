db.createUser({
    user: "root",
    pwd: "1234",
    roles :[
        {
            role: "readWrite",
            db: "spotlist"
        }
    ]
})
db.createCollection("Users");
db.createCollection("UserLists");
