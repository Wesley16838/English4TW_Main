import authDeviceStorage from "services/authDeviceStorage";
export const getToken = async () => {
    const userInfo = await authDeviceStorage.getItem("JWT_TOKEN");
    const token = userInfo && JSON.parse(userInfo).token
    return token
}