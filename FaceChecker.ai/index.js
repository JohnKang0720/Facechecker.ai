

let canvass = document.querySelector('#canvas');
const camera = document.querySelector('#video');
const contect = canvass.getContext("2d");
const contect2 = canvass.getContext("2d");
const imgg = document.querySelector('#imgconvert');
const btndownload = document.getElementById('downloads');
var constraints = {audio: true, video:true};


//1. Audio detection
//2, 
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
var recognition = new SpeechRecognition()

document.body.onclick = function(){
  recognition.start()
}

recognition.onstart = function(){
  console.log("Voice activated")
}

recognition.onresult = function(event){
  if(event.results[0][0].transcript == "hey"){
    contect.drawImage(camera, 100,50,200,150);
    const Uri =  canvass.toDataURL();
    console.log(Uri);
    imgconvert.src = Uri;
  }
  if(event.results[0][0].transcript == "next"){
    contect2.drawImage(camera, 100,200,200,150);
  const Uri =  canvass.toDataURL();
console.log(Uri);
imgconvert.src = Uri;
}
  console.log("Ended")
}
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
  navigator.mediaDevices.getUserMedia (constraints).then((stream) => {
camera.srcObject = stream;
camera.play();

  });
}
document.getElementById('SAVEIMAGE').addEventListener("click", () => {
contect.drawImage(camera, 100,50,200,150);
const Uri =  canvass.toDataURL();
console.log(Uri);
imgconvert.src = Uri;


})
document.getElementById('SAVEIMG2').addEventListener("click", () =>{
  contect2.drawImage(camera, 100,200,200,150);
  const Uri =  canvass.toDataURL();
console.log(Uri);
imgconvert.src = Uri;


})

document.getElementById('downloads').addEventListener("click", () => {
    if(window.navigator.msSaveBlob){
        window.navigator.msSaveBlob(canvass.msToBlob(), "profile.png" );
    }else{
const d = document.createElement('a');

d.href = document.getElementById('canvas').toDataURL();
d.download = "profile.png";
d.click();

console.log(d.href);
    }
})
const imguploadd = document.getElementById('imgupload');

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
   faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
   
]).then(init)

async function init(){
  
  const divv = document.createElement('div');
  divv.style.position = 'relative'
  divv.setAttribute("id", "newimg");
  divv.setAttribute("style", "margin-top: -50px;");
  document.body.append(divv);
const labelleddes = await realdetection();
const facematcher = new faceapi.FaceMatcher(labelleddes, 0.7);
let image
let canvas
//
  imguploadd.addEventListener('change', async () => {
    imguploadd.disabled = true;
 if (image) image.remove()
    if (canvas) canvas.remove()
    img = await faceapi.bufferToImage(imguploadd.files[0]);
   divv.append(img);
    canvas = faceapi.createCanvasFromMedia(img);
   canvas.setAttribute("id", "newcan");

  divv.append(canvas);
  const size = {width: img.width, height: img.height};
  faceapi.matchDimensions(canvas, size);
   const detection = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
   console.log(detection.length);
   const resizeddetections = faceapi.resizeResults(detection, size);
   const results = resizeddetections.map(d => facematcher.findBestMatch(d.descriptor));
  console.log(results);
   if(results[0]['_label']  !== results[1]['_label']){
    animation();
    }else{
        animation2();
    }

   results.forEach((results, i) => {
       const box = resizeddetections[i].detection.box
    const drawbox = new faceapi.draw.DrawBox(box, {label: results.toString()});
    drawbox.draw(canvas);
   })
   


  })
  
  

}
function realdetection(){
    const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
    return Promise.all(
      labels.map(async label => {
         
         const descriptions = []
        for (let i = 1; i <= 2; i++) {
          const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`) //upload mine on github
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
          descriptions.push(detections.descriptor)
            
        }
     
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
      })
)

  }
  function animation(){
    document.getElementById('xsign').style.opacity = "1"
      audio = new Audio("zapsplat_household_alarm_clock_digital_beeps_002_60069.mp3")
      audio.play();
    
    //add audio
    
   }
   function animation2(){
       document.getElementById('ysign').style.visibility = "visible";
       audio = new Audio("zapsplat_multimedia_game_tone_harp_warm_positive_correct_win_001_50712.mp3")
       audio.play();
   }
  
  
