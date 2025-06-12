(function () {
    const iframe = document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '150px'; // Adjust based on your widget
    iframe.src = 'https://jcburns-work.github.io/iNat-Widget/widget.html';

    // Optional: find a container or append directly to body
    document.currentScript.parentNode.insertBefore(iframe, document.currentScript);
})();