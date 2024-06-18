const container = document.querySelector('.container');
const form = container.querySelector('form');
const fileInput = form.querySelector('input');
const uploadText = form.querySelector("p");
const text = document.querySelector('textarea')
const copyBtn = document.querySelector('.copy');
const closeBtn = document.querySelector('.close');
const body = document.querySelector('body');

function processQR(formData, file) {
    uploadText.innerText = "Scanning QR Code..."
    fetch('http://api.qrserver.com/v1/read-qr-code/', {
        method: "POST",
        body: formData
    }).then(res => res.json())
    .then(result => {
        result = result[0].symbol[0].data
        uploadText.innerText = result ? "Upload or Drop QR Code" : "Not a valid QR Code";
        if(!result) return;
        text.innerText = result;
        form.querySelector('img').src = URL.createObjectURL(file)
        container.classList.add('active');
    });
}

copyBtn.addEventListener('click' , () => {
    if(copyBtn.innerText==="Copy") {
        navigator.clipboard.writeText(text.textContent).then(() => {
            text.disabled=false;
            text.select();
            text.disabled=true;
            copyBtn.innerText= "Copied";
            setTimeout(() => {
                copyBtn.innerText= "Copy";
                window.getSelection().removeAllRanges();
            },4000);
        })
    }
})

function uploadImage(file) {
    if(!file) return;
    let formData = new FormData();
    formData.append("file",file);
    processQR(formData, file);
}

fileInput.addEventListener('change', e => {
    uploadImage(e.target.files[0]);
})

form.addEventListener('click', () => fileInput.click());

closeBtn.addEventListener('click',() => {
    form.reset();
    container.classList.remove('active');
})

container.addEventListener('dragover',e =>{
    e.preventDefault()
    container.style.opacity = '0.5';
});

container.addEventListener('dragleave',e =>{
    e.preventDefault()
    container.style.opacity = '1'
});

body.addEventListener('dragover', e=> e.preventDefault());

body.addEventListener('drop',e=> {
    e.preventDefault();
    container.style.opacity = '1';
    if(container.classList.contains('active')) {
        alert(`Press 'Close' before uploading another image`)
        return;
    }
    console.log(e.dataTransfer.files[0]);
    uploadImage(e.dataTransfer.files[0]);
})