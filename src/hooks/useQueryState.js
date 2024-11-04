import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const useQueryState = (param, initialValue) => {
  const router = useRouter();
  const { query, pathname, isReady } = router; 
  
  const [value, setValue] = useState(initialValue);

  console.log(isReady,value,query[param])
  useEffect(() => {
    if (!isReady) return;

    const paramValue = query[param];
    let parsedValue;
    
    if (paramValue) {
        parsedValue = paramValue
    } else {
      parsedValue = initialValue;
    }

   if(parsedValue != value) setValue(parsedValue); 
  }, [isReady, query[param]]); 

  useEffect(() => {
    if (!isReady) return; 
    const currentParams = { ...query }; 

    if (value !== null && value !== undefined && value !== "") {
      currentParams[param] = value;
    } else {
      delete currentParams[param];
    }

    router.replace({ pathname, query: currentParams }, undefined, { shallow: true });
  }, [value]); 

  return [value, setValue];
};

export default useQueryState;
