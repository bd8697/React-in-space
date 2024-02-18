import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { UniversalState, UniversalDispatch } from '../store/UniversalStore';

export const useAppDispatch = () => useDispatch<UniversalDispatch>()

export const useAppSelector: TypedUseSelectorHook<UniversalState> = useSelector

