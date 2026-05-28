const imageUpload = document.getElementById("imageUpload");
const previewImage = document.getElementById("previewImage");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");

const analysis = document.getElementById("analysis");

const mainCaption = document.getElementById("mainCaption");
const altCaptions = document.getElementById("altCaptions");
const objectsDiv = document.getElementById("objects");

const confidenceFill = document.getElementById("confidenceFill");
const confidenceText = document.getElementById("confidenceText");

const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");

const toast = document.getElementById("toast");

let model;

window.onload = async () => {

  setTimeout(()=>{
    document.getElementById("loader").style.display="none";
  },1500);

  model = await mobilenet.load();

};

browseBtn.addEventListener("click",()=>{
  imageUpload.click();
});

dropArea.addEventListener("click",()=>{
  imageUpload.click();
});

imageUpload.addEventListener("change",(e)=>{
  handleImage(e.target.files[0]);
});

dropArea.addEventListener("dragover",(e)=>{
  e.preventDefault();
  dropArea.style.borderColor="#00d2ff";
});

dropArea.addEventListener("dragleave",()=>{
  dropArea.style.borderColor="rgba(255,255,255,0.2)";
});

dropArea.addEventListener("drop",(e)=>{
  e.preventDefault();

  const file = e.dataTransfer.files[0];

  handleImage(file);
});

async function handleImage(file){

  if(!file) return;

  if(!file.type.startsWith("image/")){
    alert("Please upload an image file.");
    return;
  }

  const reader = new FileReader();

  reader.onload = async function(e){

    previewImage.src = e.target.result;

    previewImage.style.display="block";

    analysis.style.display="block";

    const img = new Image();

    img.src = e.target.result;

    img.onload = async ()=>{

      const predictions = await model.classify(img);

      generateCaptions(predictions);

      analysis.style.display="none";
    };

  };

  reader.readAsDataURL(file);
}

function generateCaptions(predictions){

  const main = predictions[0];

  const label = main.className;

  const confidence = Math.round(main.probability * 100);

  mainCaption.textContent =
  `This image appears to contain ${label} with strong visual confidence.`;

  altCaptions.innerHTML="";

  predictions.forEach(item=>{

    const li = document.createElement("li");

    li.textContent =
    `Possible scene involving ${item.className}`;

    altCaptions.appendChild(li);

  });

  objectsDiv.innerHTML="";

  predictions.forEach(item=>{

    const tag = document.createElement("div");

    tag.className="object-tag";

    tag.textContent=item.className;

    objectsDiv.appendChild(tag);

  });

  confidenceFill.style.width = confidence + "%";

  confidenceText.textContent =
  confidence + "% confidence";

  localStorage.setItem(
    "visionCaption",
    mainCaption.textContent
  );
}

copyBtn.addEventListener("click",()=>{

  navigator.clipboard.writeText(
    mainCaption.textContent
  );

  showToast("Caption copied!");
});

downloadBtn.addEventListener("click",()=>{

  const blob = new Blob(
    [mainCaption.textContent],
    {type:"text/plain"}
  );

  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);

  a.download = "caption.txt";

  a.click();
});

clearBtn.addEventListener("click",()=>{

  previewImage.src="";
  previewImage.style.display="none";

  mainCaption.textContent="Waiting for image...";

  altCaptions.innerHTML="";

  objectsDiv.innerHTML="";

  confidenceFill.style.width="0%";

  confidenceText.textContent="0%";
});

function showToast(message){

  toast.textContent = message;

  toast.style.display="block";

  setTimeout(()=>{
    toast.style.display="none";
  },2000);
}

document.getElementById("themeToggle")
.addEventListener("click",()=>{

  document.body.classList.toggle("light");

});

const canvas = document.getElementById("particles");

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];

for(let i=0;i<120;i++){

  particles.push({

    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    radius:Math.random()*2,
    dx:(Math.random()-0.5),
    dy:(Math.random()-0.5)

  });
}

function animateParticles(){

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  particles.forEach(p=>{

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.radius,
      0,
      Math.PI*2
    );

    ctx.fillStyle="#00d2ff";

    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if(
      p.x < 0 ||
      p.x > canvas.width
    ){
      p.dx *= -1;
    }

    if(
      p.y < 0 ||
      p.y > canvas.height
    ){
      p.dy *= -1;
    }

  });

  requestAnimationFrame(
    animateParticles
  );
}

animateParticles();
