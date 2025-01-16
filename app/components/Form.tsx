'use client'
import { FormEvent } from 'react';
import { useRef, useEffect, useState } from 'react';

export type Currency = {
    currency: string;
    country: string;
}

export default function Form(){
    const amountInputRef = useRef(null);  
    const sourceCurrencyRef = useRef(null);  
    const targetCurrencyRef = useRef(null);  
    const resultRef = useRef(null); 

    const [ availableCurrencies , setAvailableCurrencies ] = useState<any>();
    const [ amountResult , setamountResult ] = useState<number>(0);
    const [ errors, setErrors ] = useState<[string]>([""]);
    
    useEffect(() => {
        async function fecthCurrencies(){
            const url = "https://api.exchangerate.host/list?access_key=" + process.env.NEXT_PUBLIC_API_KEY;
            const result = await fetch(url);
            const currencies = await result.json();
            const currenciesArray = Object.entries(currencies?.currencies).map(([key, value]) => ({ currency: key, country: value }));
            setAvailableCurrencies(currenciesArray);
        }
        fecthCurrencies();
    }, []);

  
    async function onSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
        try {
            const amount = amountInputRef.current?.value;
            if(!amount || isNaN(amount)){
                setErrors(["Amount is empty"]);
                throw "Amount is empty"
            }
            const source = sourceCurrencyRef.current?.value;
            const target = targetCurrencyRef.current?.value;
            const resultInput = resultRef.current;

            const url = "https://api.exchangerate.host/convert?from=" + source + "&to=" + target + "&amount=" + amount + "&access_key=" + process.env.NEXT_PUBLIC_API_KEY;
            const exhangedResult = await fetch(url);
            const result = await exhangedResult.json();
            console.log(result);
            if(result.success){
                setErrors([""]);
                setamountResult(result?.result);
            } else{
                setErrors(["The exchange currency was failed"]);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <form onSubmit={onSubmit} className='flex flex-col md:w-[600px] gap-5'>
          <label className='text-black text-[15px] font-bold'>Amount</label>
          <input 
            className="h-[50px] w-[100%] text-black border-opacity-5"
            ref={amountInputRef}
            type="number" 
            id="price" 
            name="price" 
            min="0" 
            max="10000000" 
            step="0.01" /> 
          <label className="text-black">Choose a source currency: </label>
            <select className='text-black' id='soruce-currencies' ref={sourceCurrencyRef} >
                {availableCurrencies && availableCurrencies.map((currency: Currency, index: number) => {
                    return(
                        <option className='text-black' key={index} value={currency.currency}>{currency.country} - {currency.currency}</option>
                    )
                })}
            </select>
            <label className="text-black">Choose a target currency:</label>
            <select className='text-black' id='target-currencies' ref={targetCurrencyRef}>
                {availableCurrencies && availableCurrencies.map((currency: Currency, index: number) => {
                    return(
                        <option className='text-black' key={index} value={currency.currency}>{currency.country} - {currency.currency}</option>
                    )
                })}
            </select>
            <label className='text-black text-[15px] font-bold'>Result</label>
            <input ref={resultRef} className="h-[50px] w-[100%] text-black border-opacity-5" value={amountResult}/>
            {errors.length > 0 && errors.map((error) => {
                return(
                    <span className='text-red-600'>
                        {error}
                    </span>
                )
            })}
          <button className='h-[50px] w-[100%] bg-black' type='submit'>Exchange</button>
        </form>
    );
}