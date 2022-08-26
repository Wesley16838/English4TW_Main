import authDeviceStorage from "services/authDeviceStorage";
export const getToken = async () => {
  const userInfo = await authDeviceStorage.getItem("JWT_TOKEN");
  const token = userInfo && JSON.parse(userInfo).token;
  return token;
};

export const isCloseToBottom = (data: any) => {
  const { layoutMeasurement, contentOffset, contentSize } = data.nativeEvent
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

export const isCloseToTop = (data: any) => {
  const { contentOffset } = data.nativeEvent
  return contentOffset.y < 100
}