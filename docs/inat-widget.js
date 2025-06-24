
// add an id tag to the load script element to access it later after the DOM loads
document.currentScript.id = 'inat-widget-script';

// insert bootstrap css to head
const bootstrapCSS = document.createElement('link');
bootstrapCSS.rel = 'stylesheet';
bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css';
bootstrapCSS.integrity = 'sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3';
bootstrapCSS.type = 'text/css';
bootstrapCSS.crossOrigin="anonymous";
document.head.appendChild(bootstrapCSS);

// insert bootstrap js to head
const bootstrapScript = document.createElement('script');
bootstrapScript.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js";
bootstrapScript.integrity = "sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q";
bootstrapScript.crossOrigin = "anonymous";
bootstrapScript.defer = true;
document.head.appendChild(bootstrapScript);

const base_url = 'https://api.inaturalist.org/v1';

window.addEventListener('DOMContentLoaded', async function () {

    // get arguments from load-script tag attributes
    const scriptElement = document.getElementById('inat-widget-script');
    const username = scriptElement.getAttribute('data-username');
    const projectId = scriptElement.getAttribute('data-project-id');
    const numObs = scriptElement.getAttribute('data-num-obs');

    // create the widget container and replace the load-script element
    const widgetContainer = document.createElement('div');
    widgetContainer.classList.add('container', 'my-5');
    scriptElement.replaceWith(widgetContainer);

    // insert widget html from template
    let response = await this.fetch('widget.html');
    let htmlText = await response.text();
    widgetContainer.innerHTML = htmlText;

    // fetch project observations data
    const params = new URLSearchParams({
        project_id: projectId,
        photos: true,
        page: 1,
        per_page: numObs,
    });
    response = await this.fetch(`${base_url}/observations?${params}`);
    const responseJson = await response.json();
    const obs = responseJson.results;
    console.log(obs);

    // dynamically assemble the carousel
    const carouselInner = document.getElementById('carousel-inner');
    const carouselIndicators = document.getElementById('carousel-indicators');
    let first_img = true;
    let first_ind = true;
    for (let i = 0; i < numObs; i++){

        // images
        const imageUrl = obs[i].observation_photos[0].photo.url;
        const highResImageUrl = imageUrl.replace("square", "medium");
        const obsUri = obs[i].uri;

        const carouselItem = document.createElement('div');
        if (first_img){
            carouselItem.setAttribute('class', 'carousel-item active');
            first_img = false;
        }
        else {
            carouselItem.setAttribute('class', 'carousel-item');
        }

        const linkElement = document.createElement('a');
        linkElement.href = obsUri;
        const imageElement = document.createElement('img');
        imageElement.src = highResImageUrl;
        imageElement.classList.add('d-block', 'w-100');
        imageElement.setAttribute('data-holder-rendered', 'true');
        imageElement.setAttribute('style', 'height: 400px; object-fit: cover;')

        carouselItem.appendChild(linkElement);
        linkElement.appendChild(imageElement);
        carouselInner.appendChild(carouselItem);

        // indicators
        const indicatorElement = document.createElement('button');
        indicatorElement.type='button';
        indicatorElement.setAttribute('data-bs-target', '#inat-carousel');
        indicatorElement.setAttribute('data-bs-slide-to', String(i));
        if (first_ind){
            indicatorElement.setAttribute('class', 'active');
            indicatorElement.setAttribute('aria-current', 'true');
            first_ind = false;
        }
        indicatorElement.setAttribute('aria-label', `Slide ${i+1}`);
        carouselIndicators.appendChild(indicatorElement)
    }
});



