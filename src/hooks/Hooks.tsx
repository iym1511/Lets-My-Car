import { TypedUseSelectorHook, useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store"

// 그냥 useDispatch와 useSelector를 쓰지말고 이걸 불러서 사용하자.
// 원래 하나하나 타입을 지정해줘야하지만 이걸로 그 수고를 덜 수 있다.
export  const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector