const auth = '563492ad6f917000010000015da9d32a28de4c629331e46a7a44fdc5';
const gallery = document.querySelector('.gallery');
const galleryImg = document.querySelector('.gallery-img');
const searchInput = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
const moreButton = document.querySelector('.more');
const opacityChanger = document.getElementById('image-clicked');
const allImages = document.getElementsByClassName('image-container');
const original = document.querySelector('.full-image');
const body = document.querySelector('body');
const exitBtn = document.querySelector('.fa-times');
let page = 1;
let fetchLink = '';
let currentSearch;
let searchValue;

//event listeners
//update the query with whatever they type, and prevent page from refreshing each input
searchInput.addEventListener('input', updateInput);
form.addEventListener('submit', e => {
    e.preventDefault();
    currentSearch = searchValue;
    searchPhotos(searchValue);
})

//not sure why this isn't listed as a regular function uptop but whateva, same thing
//go over this target.value thing, I think this is how you can find a users input value and will help for future purposes
function updateInput(e) {
    searchValue = e.target.value;
}

moreButton.addEventListener('click', loadMore);

//async function that fetches the api and returns json data for further use in the application
async function fetchApi(url) {
    const dataFetch = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: auth
        }
    })
    const data = await dataFetch.json();
    return data;
}

//this function grabs each photo from fetch, then displays them as a gallery
function generatePictures(data) {
    data.photos.forEach(photo => {
        const galleryImg = document.createElement('div');
        galleryImg.classList.add('gallery-img');
        galleryImg.innerHTML = `
        <div class="gallery-info">
            <p> ${photo.photographer} </p>
            <a class="download" href="${photo.src.original}" target="blank">HD Download</a>
        </div>
        <div class="image-container">
        <img src=${photo.src.large}></img>
        </div>
        
        `;

        gallery.append(galleryImg);
        
        for(let i = 0; i < allImages.length; i++) {
    
            allImages[i].addEventListener('click', (data) => {
                
                //remove hover on the image they clicked
                
                allImages[i].style = "pointer-events: none;";
                opacityChanger.classList.add('open')
                original.classList.add('open')
                exitBtn.classList.add('open');
                const originalSrc = data.target.src;
                original.src = originalSrc;
            
                opacityChanger.addEventListener('click', (e) => {
                    if(e.target.classList.contains('open') && e.target == document.querySelector('#image-clicked')) {
                        opacityChanger.classList.remove('open');
                        original.classList.remove('open')
                        exitBtn.classList.remove('open');

                    }
                    allImages[i].style = "pointer-events: all;";  
                })
                
            })
            
           
        
        }

    })
}
console.log(allImages)
//this async function fetches data from curated photos
async function curatedPhotos() {
    fetchLink = 'https://api.pexels.com/v1/curated?per_page=15&page=1';
    const data = await fetchApi(fetchLink);
    generatePictures(data);
}

//this async function fetches data from whatever was queried in the input
async function searchPhotos(query) {
    clear();
    fetchLink = `https://api.pexels.com/v1/search?query=${query}`
    const data = await fetchApi(fetchLink);
    generatePictures(data);
    searchInput.value = query
}

function clear() {
    gallery.innerHTML = '';
    searchInput.value = '';
}

async function loadMore() {
    page++;
    if(currentSearch) {
        fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&page=${page}`;

    }
    else {
        fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
    }
    const data = await fetchApi(fetchLink);
    generatePictures(data);
}

curatedPhotos();



