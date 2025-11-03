const leftSide = document.querySelector('.left-side');
const togglePanoramaBtn = document.getElementById('togglePanorama');
const closePanoramaBtn = document.getElementById('closePanorama');

function openPanorama() {
    leftSide.classList.add('active');
    togglePanoramaBtn.style.display = 'none';
    document.body.style.overflow = 'hidden';
}

function closePanorama() {
    leftSide.classList.remove('active');
    togglePanoramaBtn.style.display = 'flex';
    document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
    if (togglePanoramaBtn) {
        togglePanoramaBtn.addEventListener('click', openPanorama);
    }

    if (closePanoramaBtn) {
        closePanoramaBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closePanorama();
        });
    }

    document.querySelector('#panorama').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    document.querySelector('.zones-navigation').addEventListener('click', (e) => {
        e.stopPropagation();
    });
});
const viewer = pannellum.viewer('panorama', {
    "default": {
        "firstScene": "exterior",
        "sceneFadeDuration": 500
    },
    "scenes": {
        "exterior": {
            "type": "equirectangular",
            "autoLoad": true,
            "minPitch": -10,
            "maxPitch": 10,
            "minYaw": -70,
            "maxYaw": 70,
            "hfov": 90,
            "minHfov": 54,
            "maxHfov": 54,
            "mouseZoom": false,
            "keyboardZoom": false,
            "doubleClickZoom": false,
            "showZoomCtrl": false,
            "haov": 149.87,
            "vaov": 54.15,
            "vOffset": 1.17,
            "panorama": "/ARJE-CodigoBase/App/Recursos/mesasexterior.jpeg",
            "hotSpots": [
                {
                    "pitch": -10,
                    "yaw": 0,
                    "type": "scene",
                    "cssClass": "panorama-volver",
                    "sceneId": "pecera"
                },
                // Mesa 1
                {
                    "pitch": 6,
                    "yaw": -47,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "1",
                },
                // Mesa 2
                {
                    "pitch": 4,
                    "yaw": -38,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "2",
                },
                // Mesa 3
                {
                    "pitch": 0,
                    "yaw": -16,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "3",
                },
                // Mesa 4
                {
                    "pitch": -2,
                    "yaw": 12,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "4",
                },
                // Mesa 5
                {
                    "pitch": -2,
                    "yaw": 34,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "5",
                },// Mesa 6
                {
                    "pitch": -1,
                    "yaw": 47,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "6",
                }
            ]
        },
        "pecera": {
            "type": "equirectangular",
            "autoLoad": true,
            "minPitch": -10,
            "maxPitch": 10,
            "minYaw": -75,
            "maxYaw": 75,
            "hfov": 90,
            "minHfov": 54,
            "maxHfov": 54,
            "mouseZoom": false,
            "keyboardZoom": false,
            "doubleClickZoom": false,
            "showZoomCtrl": false,
            "haov": 149.87,
            "vaov": 54.15,
            "vOffset": 1.17,
            "panorama": "/ARJE-CodigoBase/App/Recursos/mesaspecera.jpg",
            "hotSpots": [
                {
                    "pitch": -10,
                    "yaw": 0,
                    "type": "scene",
                    "cssClass": "panorama-volver",
                    "sceneId": "exterior"
                },
                {
                    "pitch": 0,
                    "yaw": 0,
                    "type": "scene",
                    "cssClass": "panorama-ir",
                    "sceneId": "interior1"
                },
                // Mesa 10
                {
                    "pitch": 6,
                    "yaw": -65,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "10",
                },
                // Mesa 11
                {
                    "pitch": 7,
                    "yaw": -43,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "11",
                },
                // Mesa 12
                {
                    "pitch": 1,
                    "yaw": -63,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "12",
                },
                // Mesa 13
                {
                    "pitch": 4,
                    "yaw": -27,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "13",
                },
                // Mesa 14
                {
                    "pitch": -9,
                    "yaw": 65,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "14",
                },
                // Mesa 15
                {
                    "pitch": 0,
                    "yaw": 37,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "15",
                },
                // Mesa 16
                {
                    "pitch": -4,
                    "yaw": 70,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "16",
                },
                // Mesa 17
                {
                    "pitch": 0,
                    "yaw": 50,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "17",
                },
                // Mesa 18
                {
                    "pitch": -1,
                    "yaw": 65,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "18",
                }
            ]
        },
        "interior1": {
            "type": "equirectangular",
            "autoLoad": true,
            "minPitch": -10,
            "maxPitch": 10,
            "minYaw": -70,
            "maxYaw": 70,
            "hfov": 90,
            "minHfov": 54,
            "maxHfov": 54,
            "mouseZoom": false,
            "keyboardZoom": false,
            "doubleClickZoom": false,
            "showZoomCtrl": false,
            "haov": 149.87,
            "vaov": 54.15,
            "vOffset": 1.17,
            "panorama": "/ARJE-CodigoBase/App/Recursos/mesasinterior1.jpeg",
            "hotSpots": [
                {
                    "pitch": 5,
                    "yaw": 0,
                    "type": "scene",
                    "cssClass": "panorama-ir",
                    "sceneId": "interior2"
                }, {
                    "pitch": -10,
                    "yaw": 0,
                    "type": "scene",
                    "cssClass": "panorama-volver",
                    "sceneId": "pecera"
                },
                // Mesa 20
                {
                    "pitch": 5,
                    "yaw": -62,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "20",
                },
                // Mesa 21
                {
                    "pitch": 4,
                    "yaw": -45,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "21",
                },
                // Mesa 22
                {
                    "pitch": -2,
                    "yaw": -60,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "22",
                },
                // Mesa 23
                {
                    "pitch": 2,
                    "yaw": -30,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "23",
                },
                // Mesa 24
                {
                    "pitch": 2,
                    "yaw": -5,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "24",
                },
                // Mesa 25
                {
                    "pitch": -5,
                    "yaw": 60,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "25",
                },
                // Mesa 26
                {
                    "pitch": 0,
                    "yaw": 37,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "26",
                },
                // Mesa 27
                {
                    "pitch": 2,
                    "yaw": 26,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "27",
                },
            ]
        },
        "interior2": {
            "type": "equirectangular",
            "autoLoad": true,
            "minPitch": -10,
            "maxPitch": 10,
            "minYaw": -70,
            "maxYaw": 70,
            "hfov": 90,
            "minHfov": 54,
            "maxHfov": 54,
            "mouseZoom": false,
            "keyboardZoom": false,
            "doubleClickZoom": false,
            "showZoomCtrl": false,
            "haov": 149.87,
            "vaov": 54.15,
            "vOffset": 1.17,
            "panorama": "/ARJE-CodigoBase/App/Recursos/mesasinterior2.jpeg",
            "hotSpots": [
                {
                    "pitch": 0,
                    "yaw": 0,
                    "type": "scene",
                    "cssClass": "panorama-ir",
                    "sceneId": "interior1"
                },
                // Mesa 20
                {
                    "pitch": 3,
                    "yaw": 40,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "20",
                },
                // Mesa 21
                {
                    "pitch": 0,
                    "yaw": 50,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "21",
                },
                // Mesa 22
                {
                    "pitch": 1,
                    "yaw": 26,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "22",
                },
                // Mesa 23
                {
                    "pitch": -2,
                    "yaw": 37,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "23",
                },
                // Mesa 24
                {
                    "pitch": -5,
                    "yaw": 15,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "24",
                },
                // Mesa 25
                {
                    "pitch": 3,
                    "yaw": -13,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "25",
                },
                // Mesa 26
                {
                    "pitch": 1,
                    "yaw": -23,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "26",
                },
                // Mesa 27
                {
                    "pitch": -2,
                    "yaw": -45,
                    "cssClass": "mesa-marker",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": "27",
                },
            ]
        }
    }
});

document.querySelectorAll('.zone-thumbnail').forEach(thumbnail => {
    thumbnail.addEventListener('click', function () {
        const sceneId = this.getAttribute('data-scene');
        if (sceneId) {
            document.querySelectorAll('.zone-thumbnail').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            viewer.loadScene(sceneId);
        }
    });
});

document.querySelector('.zone-thumbnail[data-scene="exterior"]')?.classList.add('active');

viewer.on('scenechange', function (e) {
    document.querySelectorAll('.zone-thumbnail').forEach(thumbnail => {
        if (thumbnail.getAttribute('data-scene') === e) {
            thumbnail.classList.add('active');
        } else {
            thumbnail.classList.remove('active');
        }
    });
});

function hotspot(hotSpotDiv, args) {
    hotSpotDiv.style.cursor = 'pointer';
    hotSpotDiv.textContent = args;
    const mesa_input = document.getElementById('mesa_id');
    hotSpotDiv.addEventListener('click', function (e) {
        e.stopPropagation();
        mesa_input.value = args;
        mesa_input.select();
        if (window.innerWidth <= 900) {
            closePanorama();
        }
    });
}