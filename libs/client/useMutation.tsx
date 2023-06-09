import { useState } from "react"

interface IMutation { 
    loading : boolean,
    data ?: undefined | any,
    error ?: undefined | any
}

type UseMutationResult = [(data:any)=> void, IMutation]

export default function useMutation(url : string) : UseMutationResult {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<undefined | any>(undefined);
    const [error, setError] = useState<undefined | any>(undefined);
     
    const mutation = (data : any) => {
        setLoading(true);
        fetch(url, {
          method: 'POST',
          body : JSON.stringify(data),
          // 백엔드의 req.body에는 email이 있지만 req.body.email을 찍어보면 undefined-> 이를 해결하기위해 client에서 headers 설정 필수
          headers: {
            'Content-Type' : "application/json"
          }
        }).then((response) => response.json().catch(()=>{}))
        .then((json) => setData(json))
        .catch((err) => setError(err))
        .finally(() => setLoading(false))
        
    }
    return [mutation, { loading, data, error }]
}