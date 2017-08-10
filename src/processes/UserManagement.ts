import Cascade from "../Cascade";

Cascade.start(() => {
});

class UserManagement
{
    static authorizeUser(username:string, password:string, callback:(isAuthorized:boolean, isReadOnly:boolean) => void)
    {
        let userData = Cascade.getStoredValue(username, "users");

        if(!userData)
        {
            if(username === "admin" && password === "bunkerbox")
            {
                if(callback) callback(true, false);
                return;
            }

            if(callback) callback(false, true);
            return;
        }

        if(callback) callback(userData.password === password, userData.readOnly === true);
    }
}
module.exports = UserManagement;

