let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let timer = document.querySelector(".timer");
let filters = document.querySelectorAll(".filter");
let filterLayer = document.querySelector(".filter-layer");

let filterColour="transparent";
let recordFlag = false;
let recording;
let recordedChunks=[];

/**--------------------------To caputure stream from microphone and camera------------------------ */
navigator.mediaDevices.getUserMedia({audio:true,video:true}).then(function (strem) {

    video.srcObject=strem; // To display steam inside Video player
    recording = new MediaRecorder(strem);

    recording.addEventListener("start",()=>{
        recordedChunks=[];
    })
    recording.addEventListener("dataavailable",(e)=>{
        recordedChunks.push(e.data);
    })
    recording.addEventListener("stop",()=>{
        download();
    })
})

/**---------------------------------Functionality of record Btn-------------------------------- */
recordBtnCont.addEventListener("click",()=>{
    recordFlag=!recordFlag;

    if(recordFlag)
    {
        recordBtn.classList.add("scale-record");
        startRecording();
        startTimer();
    }
    else
    {
        recordBtn.classList.remove("scale-record");
        stopRecording();
        stopTimer();
    }
})


function startRecording(){
    if(recording==undefined)return;

    recording.start();
}

function stopRecording(){

    if(recording==undefined)return;
    recording.stop();
}


function download(){
      const blob = new Blob(recordedChunks, {
        type: "video/mp4"
      });

      if(db){
        let id = shortid();
        let dbTransaction = db.transaction("Video","readwrite");
        let videoStorage=dbTransaction.objectStore("Video");
        let newVideoData = {
            id:`vid-${id}`,
            data:blob
        }
        videoStorage.add(newVideoData);
      }
    //   const url = URL.createObjectURL(blob);
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = "Recording.mp4";
    //   a.click();
}




/**----------------------------------Timer Funtionality--------------------------------------- */
let count=0;
let timerId;
function startTimer()
{
    count=0;
    timerId=setInterval(()=>{
        let totalSeconds=count;
        let hours = Number.parseInt(totalSeconds/3600);
        totalSeconds=totalSeconds%3600
        let mins = Number.parseInt(totalSeconds/60);
        totalSeconds=totalSeconds%60;
        let seconds = totalSeconds;
    
        hours = (hours<10)?`0${hours}`:hours;
        mins = (mins<10)?`0${mins}`:mins;
        seconds = (seconds<10)?`0${seconds}`:seconds;
        timer.innerText=`${hours}:${mins}:${seconds}`;
        count++;
    },1000)
}

function stopTimer()
{
    clearInterval(timerId);
    timer.innerText='00:00:00';
}

/**------------------------------Capture Btn Funtionality------------------------------------- */

captureBtnCont.addEventListener("click",()=>{
    captureBtn.classList.add("scale-capture");
    let canvas = document.createElement("canvas");
    canvas.height=video.videoHeight;
    canvas.width=video.videoWidth;
    let tool = canvas.getContext('2d');

    tool.drawImage(video,0,0,canvas.width,canvas.height);
    tool.rect(0,0,canvas.width,canvas.height);
    tool.fillStyle = filterColour;
    tool.fill();
    let imageUrl = canvas.toDataURL();

    if(db){
        let id = shortid();
        let dbTransaction = db.transaction("Image","readwrite");
        let ImageStorage=dbTransaction.objectStore("Image");
        let newImageData = {
            id:`img-${id}`,
            data:imageUrl
        }
        ImageStorage.add(newImageData);
    }
    // console.log(imageUrl);
    // const a = document.createElement("a");
    //   a.href = imageUrl;
    //   a.download = "image.jpg";
    //   a.click();
    setTimeout(()=>{
        captureBtn.classList.remove("scale-capture");
    },500)
})

/**------------------Filter Functionality-------------------------------------------------- */

filters.forEach((filter)=>{
    filter.addEventListener("click",()=>{
        filterColour = getComputedStyle(filter).backgroundColor;
        filterLayer.style.backgroundColor=filterColour;
    })
})