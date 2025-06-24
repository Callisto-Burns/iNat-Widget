
//<link
// href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
// rel="stylesheet" 
// integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" 
// crossorigin="anonymous">

// add an id tag to the load script element to access it later after the DOM loads
document.currentScript.id = 'inat-widget-script'

const base_url = 'https://api.inaturalist.org/v1'

window.addEventListener('DOMContentLoaded', async function () {

    const scriptElement = document.getElementById('inat-widget-script')
    const username = scriptElement.getAttribute('data-username')
    const projectId = scriptElement.getAttribute('data-project-id')
    const numObs = scriptElement.getAttribute('data-num-obs')

    widgetContainer = document.createElement('div')
    scriptElement.replaceWith(widgetContainer)

    let project_id = 161653

    const params = new URLSearchParams({
        project_id: project_id,
        photos: true,
        page: 1,
        per_page: 10,
    });

    response = await this.fetch(`${base_url}/observations?${params}`)
    responseJson = await response.json()
    observations = await responseJson.results
    console.log(observations)

    observations.forEach(obs => {
        imageUrl = obs.photos[0].url
        console.log(url) 
        imageElement = document.createElement('img')
        imageElement.src = imageUrl
        widgetContainer.appendChild(imageElement)
    });

});

function replaceFields(text, replacements){
    let outText = String(text)
    for (const [key, value] of Object.entries(replacements)) {
        const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        outText = outText.replace(pattern, String(value));
    }
    return outText;
}
