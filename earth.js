const container = document.getElementById("earth-canvas");

if (container && typeof THREE !== "undefined") {

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 2.6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load(
        "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
    );

    const earth = new THREE.Mesh(
        new THREE.SphereGeometry(1, 64, 64),
        new THREE.MeshStandardMaterial({ map: earthTexture })
    );
    scene.add(earth);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(5, 3, 5);
    scene.add(sun);

    const backLight = new THREE.DirectionalLight(0x8b5cf6, 0.4);
    backLight.position.set(-5, -2, -4);
    scene.add(backLight);

    function latLonToVec3(lat, lon, radius) {
        const latRad = lat * Math.PI / 180;
        const lonRad = lon * Math.PI / 180;
        return new THREE.Vector3(
            radius * Math.cos(lonRad) * Math.cos(latRad),
            radius * Math.sin(latRad),
            -radius * Math.sin(lonRad) * Math.cos(latRad)
        );
    }

    const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xff2222 })
    );
    marker.position.copy(latLonToVec3(-7.15, 110.4, 1.02));
    earth.add(marker);

    function animate() {
        requestAnimationFrame(animate);
        if (!earth.userData.dragging) {
            earth.rotation.y += 0.002;
        }
        renderer.render(scene, camera);
    }
    animate();

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    container.addEventListener("pointerdown", (e) => {
        dragging = true;
        earth.userData.dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    });

    window.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        earth.rotation.y += dx * 0.005;
        earth.rotation.x += dy * 0.005;
        lastX = e.clientX;
        lastY = e.clientY;
    });

    window.addEventListener("pointerup", () => {
        dragging = false;
        earth.userData.dragging = false;
    });

    renderer.domElement.style.touchAction = "none";

    function resize() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    window.addEventListener("resize", resize);
}