

//  ^===================== API KEY
const apiKey = "CKf5W4cw0M8eRnurWuOuUiMJQGQHjBkNzU0WtrWIc52rUKhBxm98YGCA";


//  ^=====================  HTML ELEMENTS
const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector("#search-input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = document.querySelector(".uil-times");
const downloadImgBtn = document.querySelector(".uil-import");
const headTitle = document.querySelector(".head-title ");
const logo = document.querySelector(".content h1");



//  ^===================== VARS
const perPage = 15;
let currentPage = 1;
let searchTerm = null;



//  ^===================== MAIN FUNCTIONS



// ^====== GET IMAGES 
const getImages = (apiURL) => {
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");

    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        if (data.photos.length != 0) {
            generateHTML(data.photos);
            loadMoreBtn.innerText = "Load More";
            loadMoreBtn.classList.remove("disabled");
        } else {
            loadMoreBtn.classList.add("none");
            headTitle.innerHTML = `<span>Value dose not exist</span>`
        }
    }).catch(() => {
        headTitle.innerHTML = `<span>Value dose not exist</span>`
        loadMoreBtn.classList.add("none");

    });
}




// ^====== GRNERATE HTML
const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map(img =>
        `<li class="card" onclick= "showLightbox('${img.photographer}' , '${img.src.large2x}')" >
        <img src="${img.src.large2x}" alt="img">
        <div class="details">
        <div class="photographer">
        <i class="uil uil-camera"></i>
        <span>${img.photographer}</span>
        </div>
        <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
        <i class="uil uil-import"></i>
        </button>
        </div>
        </li>`
    ).join("");
}




// ^====== LOAD MORE IMAGES
const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}` : apiURL;
    getImages(apiURL);
};



// ^====== SEARCH IMAGES
const loadSearchImages = (e) => {
    if (e.target.value == "") return searchTerm = null;
    if (e.key == "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        headTitle.innerHTML = `<h2>Showing results for <span>${e.target.value}</span></h2>`;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}`);

    }
}




// ^====== SHOW LIGHT BOX
const showLightbox = (name, img) => {
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    // setting image url as an attribute for downloading
    downloadImgBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
}




// ^====== HIDE LIGHT BOX
const hideLightBox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}



// ^====== DOWNLOAD IMAGE 
const downloadImg = (imgURL) => {
    // get  image's link
    // convert link to blob and create download link
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a = document.createElement("a");
        // Creates url of passed object (blob)
        a.href = URL.createObjectURL(file);
        // passing current time 
        a.download = new Date().getTime();
        // downlad it
        a.click();
    }).catch(() => alert("Failed to download image!"));
}



// ^====== RELOAD PAGE
function reloadPage() {
    location.reload();
}




getImages(`https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`);
//  ^===================== EVENTS 
loadMoreBtn.addEventListener('click', loadMoreImages);
searchInput.addEventListener('keyup', loadSearchImages);
closeBtn.addEventListener('click', hideLightBox);
downloadImgBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.img));
logo.addEventListener('click', reloadPage);


