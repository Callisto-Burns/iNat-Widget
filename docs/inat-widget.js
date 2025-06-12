(function () {
    const currentScript = document.currentScript;
    const username = currentScript.getAttribute('inat-user');
    console.log(username)

    // Optional: find a container or append directly to body

    fetch('widget.html')
        .then(response => response.text())
        .then(html => {

            const personalizedHTML = html.replace(/{{\s*inat-user\s*}}/g, username);

            const iframe = document.createElement('iframe');
            iframe.style.border = 'none';
            iframe.style.width = '100%';
            iframe.style.height = '150px';
            iframe.srcdoc = personalizedHTML;


            document.currentScript.parentNode.insertBefore(iframe, document.currentScript);
        })
        .catch(error => {
            console.error('Failed to load widget:', error);
        });
})();