// GET DATA FROM THE SERVER
async function getData() 
{
  let response = await fetch('https://cdn.contentful.com/spaces/f9xo8mopdqv5/entries?access_token=qhRzmjNkUqjGoxsy5kJxQwl1k6xRjS41B15ShXWW3bE');
  let data = await response.json();
  return data;
};



// SPLIT DATA
const splitContent = function(importedContent) {
    const items = importedContent.items;
    let galleries;
    let generalInfo;

    for (item of items) {
        if ("gallery1" in item.fields) {
            galleries = item.fields;               
        } else {
            generalInfo = item.fields
        }
    };

    return {
        galleries: galleries,
        generalInfo: generalInfo
    }
};




// GET ALL IMAGES URLs
const imagesUrls = function(allData) {
    let urlsArr = [];
    
    allData.Asset.forEach(el => urlsArr.push({
        name: el.fields.title,
        url: el.fields.file.url,
        id: el.sys.id  
    }));

    return urlsArr;
};

// SEPARATE GALLERIES
const sepGalleries = function(someData, imageData) {
    let gallery1 = [];
    let gallery2 = [];
    let gallery3 = [];
    let gallery4 = [];

    const allImages = imagesUrls(imageData);
    
    someData.galleries.gallery1.forEach(el => gallery1.push(el.sys.id));
    someData.galleries.gallery2.forEach(el => gallery2.push(el.sys.id));
    someData.galleries.gallery3.forEach(el => gallery3.push(el.sys.id));
    someData.galleries.gallery4.forEach(el => gallery4.push(el.sys.id));

    // Loop all images & filter galleries IDs:
    let filteredGallery1 = [];
    let filteredGallery2 = [];
    let filteredGallery3 = [];
    let filteredGallery4 = [];

    // Filtering function:
    const filter = function (gallery, filteredGallery) {
        for(let el in allImages){
            for(let elem in gallery){
                if(allImages[el].id === gallery[elem]){
                   filteredGallery.push(allImages[el]);
                  }
            }
         }
         return filteredGallery;
    };

    // Running all galleries through the filter:
    filter(gallery1, filteredGallery1);
    filter(gallery2, filteredGallery2);
    filter(gallery3, filteredGallery3);
    filter(gallery4, filteredGallery4);

    return {
            filteredGallery1,
            filteredGallery2,
            filteredGallery3,
            filteredGallery4
    }
};


// UI CONTROLLER 
const UIcontroller = function(galleries) {
    //Query Selectors:
   const image = document.querySelector('#image');
   const arch = document.querySelector('.archviz');
   const mattePaint = document.querySelector('.mattepaint');
   const photo = document.querySelector('.photography');
   const imgTitle = document.querySelector('.img-title');
   const index = document.querySelector('.index');

   //about-me page:
   const closeBtn = document.querySelector('#closeButton');
   const aboutBtn = document.querySelector('#aboutButton');
   const aboutPage = document.querySelector('#aboutPage');

   const prevButton = document.querySelector('.prev');
   const nextButton = document.querySelector('.next');

   // Incoming Data:
   let gallery1 = galleries.filteredGallery1;
   let gallery2 = galleries.filteredGallery2;
   let gallery3 = galleries.filteredGallery3;
   let gallery4 = galleries.filteredGallery4;
   let currentGallery = gallery1;

    // Image Counter
   let i = 0;

   // intials values:
   image.src = currentGallery[0].url;
   imgTitle.textContent = currentGallery[0].name;
   index.textContent = `${i + 1} / ${currentGallery.length}`;

   //Event  Listeners:
   // 01. selecting galleries:
    arch.addEventListener('click', () => {
       currentGallery = gallery1;
       image.src = currentGallery[0].url;
       imgTitle.textContent = currentGallery[0].name;
       index.textContent = `${0 + 1} / ${currentGallery.length}`;
    });

    mattePaint.addEventListener('click', () => {
        currentGallery = gallery2;
        image.src = currentGallery[0].url;
        imgTitle.textContent = currentGallery[0].name;
        index.textContent = `${0 + 1} / ${currentGallery.length}`;
    });

    photo.addEventListener('click', () => {
        currentGallery = gallery4;
        image.src = currentGallery[0].url;
        imgTitle.textContent = currentGallery[0].name;
        index.textContent = `${0 + 1} / ${currentGallery.length}`;
    });

   // 02. switching through images:
   nextButton.addEventListener('click', () => { 
        if (i < (currentGallery.length - 1)) {
            i++
        } else if (i = (currentGallery.length - 1)) {
            i = 0
        }

        image.src = currentGallery[i].url;
        imgTitle.textContent = currentGallery[i].name;
        index.textContent = `${i + 1} / ${currentGallery.length}`;
   });

   prevButton.addEventListener('click', () => {
        if (i <= (currentGallery.length - 1) && i !== 0) {
            i--
        } else if(i === 0) {
            i = currentGallery.length - 1;
        }
        image.src = currentGallery[i].url;
        imgTitle.textContent = currentGallery[i].name;
        index.textContent = `${i + 1} / ${currentGallery.length}`;
    });

    // open close about-me page
    aboutBtn.addEventListener('click', () => {
        aboutPage.classList.remove("hidden")
    });
    closeBtn.addEventListener('click', () => {
        aboutPage.classList.add("hidden")
    });
};

//about-me page:

let aboutMeContent = function(input) {
        //about-page query selectors
   const aboutTitle = document.querySelector('#title');
   const aboutText = document.querySelector('#text');

   //change content
   aboutTitle.innerText = input.cvtext1;
   aboutText.innerText = input.cvtext2;
};



// INITIALIZATION
(async () => {
    try {
        let responseData = await getData();
        let data = splitContent(responseData);
        
        //Handle Galleries:
        let galleries = sepGalleries(data, responseData.includes);
        let generalInfo = data.generalInfo;

        //Navigate through filtered galleries:
        UIcontroller(galleries);

        //about-me-page
        aboutMeContent(generalInfo);

    } catch (error) {
        console.log(error);
    }
})();