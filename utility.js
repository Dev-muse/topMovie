// Debounce func delays api calls
// runs api call after elapsed time on the first input event run
// api call is stopped by clearTimeout only with another input event before elapsed time on setTimeout

const debounce = (func,delay=1000)=>{
    let timeoutId;
    return (...args)=>{
        if(timeoutId){
            clearTimeout(timeoutId)
        }

        // apply function feeds arguments from debounce one at a time
        timeoutId = setTimeout(()=>{
            func.apply(null,args)
        },delay)
    }
}