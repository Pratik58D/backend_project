// microtask --> process.nextTick , promises  (highest priority)
// -->Microtasks are tasks that execute immediately after the current script finishes and before any macrotasks. They have higher priority

// macro task  --> setTimeout , setInterval , setImmne,fs.readFile((Lower Priority))
// ----> Macrotasks (also called tasks) execute one at a time in the event loop queue, after all microtasks are done.




// timers -> pending callbacks ->idle,prepare -> poll -> check -> close callback

import fs from "fs";
import crypto from  "crypto";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Reconstruct __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);

console.log('1.script start');


setTimeout(()=>{
   console.log('2.settimeout called here(this is macro task)') 
},0)

setTimeout(()=>{
   console.log('3.settimeout called here(this is macro task)') 
},0)

setImmediate(()=>{
    console.log("4.setImmidiate callback (check)")
})

Promise.resolve().then(()=>{
    console.log("5. promise resolved (micro task)");
})


process.nextTick(()=>{
    console.log("6. process.nexttick callback (microtask)");
})

fs.readFile(__filename,()=>{
    console.log("7.file read operation(I/o)")
})

crypto.pbkdf2('secret', "salt", 10000 , 64 , "sha512",(err , key)=>{
    if(err) throw err
    console.log("8.crypto.pbkdf2 operation completed (cpu intensive task).")
})


console.log("9.script ends")


