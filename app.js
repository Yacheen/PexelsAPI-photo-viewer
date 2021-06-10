const auth = '563492ad6f917000010000015da9d32a28de4c629331e46a7a44fdc5';
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
const moreButton = document.querySelector('.more');
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
            <a href="${photo.src.original}" target="blank">Download</a>
        </div>
        <img src=${photo.src.large}></img>
        
        `;
        gallery.append(galleryImg);
    });
}

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
