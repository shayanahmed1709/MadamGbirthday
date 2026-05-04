// wwwroot/BlazorHelpers.js
window.blazorHelpers = {
    isMobile: function () {
        return window.innerWidth <= 768;
    },
    registerResizeCallback: function (dotNetObject) {
        function onResize() {
            try {
                dotNetObject.invokeMethodAsync('OnResize', window.innerWidth <= 768);
            } catch (e) {
                // ignore if .NET object not available
            }
        }
        window.addEventListener('resize', onResize);
        // optional: call once to sync initial state:
        onResize();
    }
};
