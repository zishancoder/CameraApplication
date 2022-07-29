
let openRequest = indexedDB.open("MyDataBase");   // To Open indexDB
let db;

openRequest.addEventListener("success",()=>{
    console.log("success");
    db=openRequest.result;   // To get access into db variable.
})

openRequest.addEventListener("error",()=>{
    console.log("error");
})

openRequest.addEventListener("upgradeneeded",()=>{
    console.log("upgraded");
    db=openRequest.result;    // To get access into db variable.
    db.createObjectStore("Video",{keyPath:"id"}); // To Create Object Store
    db.createObjectStore("Image",{keyPath:"id"});
})