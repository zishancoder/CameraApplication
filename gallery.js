setTimeout(()=>{
    if(db)
    {
        //To get Video access saved in index db.
        let dbTransaction = db.transaction(["Video"]);
        let objectStore = dbTransaction.objectStore("Video");
        let request = objectStore.getAll();
        request.onsuccess = (e)=>{
            let videos = request.result;
            let galleryCont = document.querySelector(".gallery-cont");
            videos.forEach((video)=>{
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class","cont");
                mediaElem.setAttribute("id",video.id);
                let url = URL.createObjectURL(video.data);
                mediaElem.innerHTML=`
                <div class="media">
                    <video src="${url}" autoplay loop></video>
                </div>
                <div class="download action-btn">Download</div>
                <div class="delete action-btn">Delete</div>
                `;
                galleryCont.appendChild(mediaElem);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click",downloadListner);
                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click",deleteListner);
            })
        }


        // To get Images from index db
        let dbTransactionImage = db.transaction("Image");
        let imgObjectStore = dbTransactionImage.objectStore("Image");
        let requestImg = imgObjectStore.getAll();
        requestImg.onsuccess = (e)=>{
            let Image = requestImg.result;
            let galleryCont = document.querySelector(".gallery-cont");
            Image.forEach((ImageObj)=>{
                let mediaElem = document.createElement("div");
                let url = ImageObj.data;
                mediaElem.setAttribute("class","cont");
                mediaElem.setAttribute("id",ImageObj.id);
                mediaElem.innerHTML=`
                <div class="media">
                    <img src="${url}">
                </div>
                <div class="download action-btn">Download</div>
                <div class="delete action-btn">Delete</div>
                `;
                galleryCont.appendChild(mediaElem);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click",downloadListner);
                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click",deleteListner);
            })
        }
    }
},200)


function downloadListner(e){
   let id = e.target.parentElement.getAttribute("id");
   let type = id.slice(0,3);
   if(type=="img")
   {
        let dbTransaction = db.transaction("Image","readwrite");
        let ImageObj = dbTransaction.objectStore("Image");
        let imageRequest = ImageObj.get(id);
        imageRequest.onsuccess = (e)=>{
            let imageResult = imageRequest.result;
            let url = imageResult.data;
            let a = document.createElement("a");
            a.href=url;
            a.download="image.jpg";
            a.click();
        }
   }
   else if(type=="vid")
   {
        let dbTransaction = db.transaction("Video","readwrite");
        let videoObj = dbTransaction.objectStore("Video");
        let videoRequest = videoObj.get(id);
        videoRequest.onsuccess = (e)=>{
            let videoResult = videoRequest.result;
            let url = URL.createObjectURL(videoResult.data)
            let a = document.createElement("a");
            a.href=url;
            a.download="video.mp4";
            a.click();
        }
   }
}

function deleteListner(e){
    //DB Removal
   let id = e.target.parentElement.getAttribute("id");
   if(id.slice(0,3)=="img")
   {
        let dbTransaction = db.transaction("Image","readwrite");
        let ImageObj = dbTransaction.objectStore("Image");
        ImageObj.delete(id);
   }
   else if(id.slice(0,3)=="vid")
   {
        let dbTransaction = db.transaction("Video","readwrite");
        let videoObj = dbTransaction.objectStore("Video");
        videoObj.delete(id);
   }

   //UI Removal
   e.target.parentElement.remove();
}