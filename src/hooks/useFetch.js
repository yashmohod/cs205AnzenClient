import { useCallback } from "react";
import {get, post, del, put, API_URL} from "../Utils/API.js"

export default function useFetch() {

    const GET = useCallback(async (endpoint) => {
        const response = await get(API_URL + endpoint)
        return response
    }, [])

    const POST = useCallback(async (endpoint, body) => {
        const response = await post(API_URL + endpoint, body)
        return response
    }, [])

    const DELETE = useCallback(async (endpoint, body) => {
        const response = await del(API_URL + endpoint, body)
        return response
    }, [])

    const PUT = useCallback(async (endpoint, body) => {
        const response = await put(API_URL + endpoint, body)
        return response
    }, [])

    return {GET, POST, DELETE, PUT}
}