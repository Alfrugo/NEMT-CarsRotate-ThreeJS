import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' //***
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */

// Debug
// const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.castShadow = true
            child.receiveShadow = true
            console.log(child)
        }
    })
}

/**
 * White scene floor model 
 */
const testPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 32, 32),
    new THREE.MeshStandardMaterial()
)
scene.add(testPlane)

testPlane.rotation.x = - Math.PI * 0.5
testPlane.scale.set(10, 10, 10)
testPlane.position.y = 0.017

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 4.5)
directionalLight.castShadow = true

directionalLight.position.set(-1.564, 2.419, 2.296)
directionalLight.shadow.camera.far = 10
directionalLight.shadow.mapSize.set(1024, 1024)

scene.add(directionalLight)

// animation time
let previousTime = 0

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()  // this is the loader for the glb file
gltfLoader.setDRACOLoader(dracoLoader) // this is the loader for the compressed glb file

let mixer = null
let controls = null

/**
 * Model
 */
gltfLoader.load ('MTM-fleet3-FULL-WHITE-BAKING-joined-materials.glb',
    (gltf) => {
        gltf.scene.position.setX(0)  // this is offsetting the imported scene from Blender to avoid moving keyframes
        gltf.scene.position.setY(0)
        gltf.scene.position.setZ(0)

        gltf.scene.scale.set(1.1, 1.1, 1.1)

        scene.add(gltf.scene)
        updateAllMaterials()
        // console.log(gltf)

        mixer = new THREE.AnimationMixer(gltf.scene)

        const iphone = mixer.clipAction(gltf.animations[0])   // this is the animation clip from Blender from the animations tab there's an array [ ] of animations. 
        const cabYellow = mixer.clipAction(gltf.animations[1])
        const greenRing = mixer.clipAction(gltf.animations[2])
        const purpleBase = mixer.clipAction(gltf.animations[3])
        const sedanWhite1 = mixer.clipAction(gltf.animations[4])
        const sedanWhite2 = mixer.clipAction(gltf.animations[5])
        const vanBig = mixer.clipAction(gltf.animations[6])
        const vanBlack = mixer.clipAction(gltf.animations[7])
        const vanMini1 = mixer.clipAction(gltf.animations[8])
        const vanMini2 = mixer.clipAction(gltf.animations[9])
        const vanMini3 = mixer.clipAction(gltf.animations[10])
        const CameraAction = mixer.clipAction(gltf.animations[11])   // this is the camera animation clip from Blender

        iphone.play()
        cabYellow.play()
        greenRing.play()
        purpleBase.play()
        sedanWhite1.play()
        sedanWhite2.play()
        vanBig.play()
        vanBlack.play()
        vanMini1.play()
        vanMini2.play()
        vanMini3.play()
            
        CameraAction.play() // this is the camera animation clip from Blender 

    }
)


// MOUSE TRACKING CAMERA 

const mouse = new THREE.Vector2();
const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );


function onMouseMove( event ) {

	mouse.x = ( event.clientX - windowHalf.x );
	mouse.y = ( event.clientY - windowHalf.x );
  console.log (mouse)

}

document.addEventListener( 'mousemove', onMouseMove, false );




/**
 * Sizes
 */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
    // width: canvasWidth ,
    // height: canvasHeight
}
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(26, sizes.width / sizes.height, 0.1,  100)
camera.position.set(5,2,5)
camera.lookAt(0,0,0) 
scene.add(camera)




// Controls

// // ORBIT CONTROLS!
// controls = new OrbitControls(camera, canvas) //*** 
// controls.maxDistance = 10


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
    })

scene.background = new THREE.Color(0xffffff)
renderer.setSize(sizes.width, sizes.height)
renderer.physicallyCorrectLights = true  // this is for the lights to be more realistic
renderer.outputEncoding = THREE.sRGBEncoding  // important to make color look right
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.LinearToneMapping
renderer.toneMappingExposure = 1.302

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    camera.position.x = (mouse.x *-0.001) + 5
    camera.position.y = (mouse.y *.001) + 2
    // camera.position.z = (mouse.z *.001) + 5
    camera.lookAt(0,0,0) 
    
    // controls.update()  // this is for orbit controls

    if (mixer !== null){
        mixer.update(deltaTime)
    }
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()