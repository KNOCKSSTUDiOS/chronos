import * as THREE from 'three';

let container, camera, scene, renderer;
let video, texture, material, mesh;
let playlistIndex = 0;

const masterVideos = [
    'omni-V.mp4',
    'omni-v1.mp4',
    'Meta_AI_AQOm30hz4tu9gv6wOctJDjqc8gt4HTxN2nXZOGpcVsAs9ycCo-TlhTCVNh0rCiRK4Ae8c6jePGT3oyXoBwSXK1OM_20261028_221246.mp4',
    'AQN8Lh_UvBmkN3G0XqXO4rzuV7L6BE2YWdTQHwHFjQNwgg52Z08kL1vk86hfR1cK6SGUj1vQzJT8h3ziqwjoX_n4e5B5mjYcKflaKD8.mp4'
];

init();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0A0A0A);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 500;

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(0.5, 1, 1).normalize();
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    container.appendChild(renderer.domElement);

    video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.playsInline = true;
    video.muted = true;
    video.autoplay = true;
    video.style.display = 'none';
    document.body.appendChild(video);

    loadNextMasterVideo();

    texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.BoxGeometry(480, 204, 100);
    const mat = new THREE.MeshBasicMaterial({ map: texture });
    mesh = new THREE.Mesh(geometry, mat);
    scene.add(mesh);

    window.addEventListener('resize', onWindowResize);
}

function loadNextMasterVideo() {
    if (masterVideos.length === 0) return;
    video.src = masterVideos[playlistIndex];
    video.play().catch(err => console.log("Playback error:", err));
    
    video.onended = () => {
        playlistIndex = (playlistIndex + 1) % masterVideos.length;
        loadNextMasterVideo();
    };
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    mesh.rotation.y += 0.002;
    renderer.render(scene, camera);
}
