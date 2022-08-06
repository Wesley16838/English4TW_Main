import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { setUserRelaunch, setUserLogout } from "actions/user";
import authDeviceStorage from "services/authDeviceStorage";
import api from "services/api";
import { useQueryClient } from "react-query";

const Layout = ({children}: any) => {
    const dispatch: Dispatch<any> = useDispatch();
    const {isLoggedIn}: any = useSelector(
        (state: any) => state.user,
        shallowEqual
      );
    const queryClient = useQueryClient()

    useEffect(() => {
        const getToken = async () => {
            const result = await authDeviceStorage.getItem("JWT_TOKEN");
            if(result) {
                const payload = JSON.parse(result);
                const hourExpire = 1000 * 60 * 60;
                if(Date.now() - payload.date > hourExpire){
                    console.log('Layout: user logout')
                    dispatch(setUserLogout())
                } else {
                    console.log('Layout: user relaunch')
                    dispatch(setUserRelaunch({token: result}));
                }
            }
        }
        getToken()
    }, [dispatch])

    useEffect(() => {
        const initialUserData = async() => {
            try{
                let token = null;
                const result = await authDeviceStorage.getItem("JWT_TOKEN");
                if(result) token = JSON.parse(result).token
                const userData = await api.get("api/loginFetch", { headers: {"Authorization" : `Bearer ${token}`} })
                const userWord = userData.data.data.today_words.map((word:string[]) => {
                    return word.map((str:string) => {
                        return userData.data.data.today_defs[str]
                    })
                })
                queryClient.setQueryData('saved_words', userData.data.data.words)
                queryClient.setQueryData('user_words', userWord)
            } catch(err){

            }
        }
        if(isLoggedIn) initialUserData()
    }, [isLoggedIn])
    return(
        <>
            {children}
        </>
    )
}

export default Layout;