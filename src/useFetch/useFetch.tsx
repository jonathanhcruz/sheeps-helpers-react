import { useEffect, useState } from 'react';
import { UseFetchPropsModel } from '../models/UseFetchPropsModel';
import { UseFetchReturnModel } from '../models/UseFetchReturnModel';

// utils
import { fetchData } from 'src/utils/fetchData';

export function useFetch<DinamicType>({
    dataRequest,
    dependencies= []
}: UseFetchPropsModel): UseFetchReturnModel<DinamicType> {

    const [data, setData] = useState<DinamicType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<{
        message: string;
        error: unknown;
        existError: boolean;
    }>({
        message: dataRequest.messageError ?? '',
        error: null,
        existError: false,
    });
    const [controllerFetch, setControllerFetch] = useState<AbortController | null>(null);

    useEffect(() => {
        const abortController = new AbortController();
        setControllerFetch(abortController);
        setLoading(true);

        // Fetch
        fetchData({dataRequest, setData, setLoading, setError, abortController});
    }, [...dependencies]);

    const handleCancelRequest = () => {
        controllerFetch?.abort();
        setError({
            message: 'request cancel',
            error: {
                status: 499,
                statusText: 'request cancel'
            },
            existError: true,
        });
    }
    
    return {data, loading, error, handleCancelRequest} as UseFetchReturnModel<DinamicType>;
}