import { useCallback, useState } from "react";
import {get, post, del, put, API_URL} from "../Utils/API.js"

export default function useFetch() {
    const [isLoading, setIsLoading] = useState(false);

    const REQUEST = async (method, endpoint, body) => {
        if (method === "GET") {
            return GET(endpoint);
        }

        if (method === "POST") {
            return POST(endpoint, body);
        }

        if (method === "DELETE") {
            return DELETE(endpoint, body);
        }

        if (method === "PUT") {
            return PUT(endpoint, body);
        }
    }

    const GET = useCallback(async (endpoint) => {
        setIsLoading(true)
        const response = await get(API_URL + endpoint)
        setIsLoading(false)
        return response
    }, [])

    const POST = useCallback(async (endpoint, body) => {
        setIsLoading(true)
        const response = await post(API_URL + endpoint, body)
        setIsLoading(false)
        return response
    }, [])

    const DELETE = useCallback(async (endpoint, body) => {
        setIsLoading(true)
        const response = await del(API_URL + endpoint, body)
        setIsLoading(false)
        return response
    }, [])

    const PUT = useCallback(async (endpoint, body) => {
        setIsLoading(true)
        const response = await put(API_URL + endpoint, body)
        setIsLoading(false)
        return response
    }, [])

    return {isLoading, REQUEST}
}