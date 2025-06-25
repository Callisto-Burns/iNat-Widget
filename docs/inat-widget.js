
// entry point and setup
(function () {

    // insert bootstrap css to head
    const bootstrapCSS = document.createElement('link');
    bootstrapCSS.id = 'bootstrap-css';
    bootstrapCSS.rel = 'stylesheet';
    bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css';
    bootstrapCSS.integrity = 'sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3';
    bootstrapCSS.type = 'text/css';
    bootstrapCSS.crossOrigin="anonymous";
    if (!document.getElementById('bootstrap-css')){
        document.head.appendChild(bootstrapCSS);
    }

    // insert bootstrap js to head
    const bootstrapScript = document.createElement('script');
    bootstrapScript.id = "bootstrap-script"
    bootstrapScript.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js";
    bootstrapScript.integrity = "sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q";
    bootstrapScript.crossOrigin = "anonymous";
    bootstrapScript.defer = true;
    if (!document.getElementById('bootstrap-script')){
        document.head.appendChild(bootstrapScript);
    }

    class ApiClient {

        constructor(){
            this.baseURL = 'https://api.inaturalist.org/v1'
        }

        async getObservations(num, projectId){
            const params = new URLSearchParams({
                project_id: projectId,
                photos: true,
                page: 1,
                per_page: num,
            });
            const jsonObs = await this.get('observations', params)
            return jsonObs
        }

        async getProjectInfo(projectId){
            const params = new URLSearchParams({
                id: projectId,
            })
            const jsonProject = await this.get('projects', params)
            return jsonProject
        }

        async get(url, params){
            try {
                const response = await fetch(`${this.baseURL}/${url}?${params}`)
                const json = await response.json()
                return json
            }
            catch (err) {
                console.error(`GET ${url} failed with params ${params}`, err)
            }
        }
    }

    // perform tasks that must wait for the DOM to load
    const scriptElement = document.currentScript;
    async function onDOMLoaded () {

        // get arguments from load-script tag attributes
        const projectId = scriptElement.getAttribute('data-project-id') ?? '176528';
        const numObs = scriptElement.getAttribute('data-num-obs') ?? '5';
        const carouselTitle = scriptElement.getAttribute('data-title') ?? 'Untitled';
        const carouselHeight = scriptElement.getAttribute('data-height') ?? '400';
        const textFont = scriptElement.getAttribute('data-font') ?? 'Young Serif';
        const textColor = scriptElement.getAttribute('data-color') ?? '#182241';
        const imageSize = scriptElement.getAttribute('data-image-size') ?? 'medium';

        // create the widget container and replace the load-script element
        const widgetContainer = document.createElement('div');
        widgetContainer.setAttribute('class', 'container my-4');
        scriptElement.replaceWith(widgetContainer);

        // fetch project observations data
        const apiClient = new ApiClient()
        const responseJson = await apiClient.getObservations(numObs, projectId)
        const obs = responseJson.results;
        console.log(responseJson)
        console.log(obs);

        // determine the href for the main project page
        const projectInfoJson = await apiClient.getProjectInfo(projectId)
        const projectSlug = projectInfoJson.results[0].slug
        const seeAllHref = `https://www.inaturalist.org/projects/${projectSlug}`

        const uniqueId = Math.random().toString(36).substring(2,9);

        // insert widget html from template
        response = await this.fetch('widget.html');
        let htmlText = await response.text();
        htmlText = htmlText.replace(/{{carousel-title}}/g, carouselTitle)
        htmlText = htmlText.replace(/{{see-all-href}}/g, seeAllHref)
        htmlText = htmlText.replace(/{{unique-id}}/g, uniqueId)
        htmlText = htmlText.replace(/{{font-family}}/g, textFont)
        htmlText = htmlText.replace(/{{font-color}}/g, textColor)
        widgetContainer.innerHTML = htmlText;

        // dynamically assemble the carousel
        const carouselInner = document.getElementById(`carousel-inner-${uniqueId}`);
        const carouselIndicators = document.getElementById(`carousel-indicators-${uniqueId}`);
        let first_img = true;
        let first_ind = true;
        for (let i = 0; i < numObs; i++){

            // images and links
            const imageUrl = obs[i].observation_photos[0].photo.url;
            const highResImageUrl = imageUrl.replace("square", imageSize);
            const obsUri = obs[i].uri;
            const obsName = obs[i].taxon.preferred_common_name
              || obs[i].taxon.name
              || 'Unknown organism';

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
            linkElement.setAttribute('target', '_blank')
            linkElement.setAttribute('rel', 'noopener noreferrer')
            const imageElement = document.createElement('img');
            imageElement.src = highResImageUrl;
            imageElement.classList.add('d-block', 'w-100', 'shadow');
            imageElement.setAttribute('data-holder-rendered', 'true');
            imageElement.setAttribute('style', `height: ${carouselHeight}px; object-fit: cover;`)

            carouselItem.appendChild(linkElement);
            linkElement.appendChild(imageElement);
            carouselInner.appendChild(carouselItem);

            // indicators
            const indicatorElement = document.createElement('button');
            indicatorElement.type='button';
            indicatorElement.setAttribute('data-bs-target', `#inat-carousel-${uniqueId}`);
            indicatorElement.setAttribute('data-bs-slide-to', String(i));
            if (first_ind){
                indicatorElement.setAttribute('class', 'active');
                indicatorElement.setAttribute('aria-current', 'true');
                first_ind = false;
            }
            indicatorElement.setAttribute('aria-label', `Slide ${i+1}`);
            carouselIndicators.appendChild(indicatorElement);

            // captions
            const captionElement = document.createElement('div');
            captionElement.classList.add('carousel-caption', 'd-none', 'd-md-block');
            const captionText = document.createElement('h5');
            captionText.innerHTML = obsName;
            captionElement.appendChild(captionText)
            carouselItem.appendChild(captionElement)

        }
    }
    window.addEventListener('DOMContentLoaded', onDOMLoaded)
})()

