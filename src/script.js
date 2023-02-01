import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { CubeCamera, MixOperation } from 'three'



// Canvas
const canvas = document.querySelector('canvas.webgl')

// const canvasWidth = document.getElementById('canvas2').clientWidth
// const canvasHeight = document.getElementById('canvas2').clientHeight

const canvasWidth = 600 
const canvasHeight = 400





const scene = new THREE.Scene()

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
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null
let controls = null

/**
 * Material
 */
 const bakedTexture = textureLoader.load('baked.jpg')
 bakedTexture.flipY = false

 const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

/**
 * Model
 */
gltfLoader.load ('MTM-fleet3-FULL WHITE-BAKING-joined.glb',
    (gltf) => {
        gltf.scene.traverse((child) => {
            child.material = bakedMaterial
            })
        gltf.scene.position.setX(0)  // this is offsetting the imported scene from Blender to avoid moving keyframes
        gltf.scene.position.setY(0)
        gltf.scene.position.setZ(0)

        scene.add(gltf.scene)
        console.log(gltf)

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
       
        const CameraAction = mixer.clipAction(gltf.animations[11])   // this this the camera animation clip from Blender



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

/**
 * Sizes
 */


const sizes = {
    // width: window.innerWidth,
    // height: window.innerHeight
    width: canvasWidth ,
    height: canvasHeight
}
// window.addEventListener('resize', () =>
// {
//     // Update sizes
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight

//     // Update camera
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height)
// })


window.addEventListener('resize', () =>
{
    // // Update sizes
    // sizes.width = 600
    // sizes.height = 600
    // // Update camera
    // camera.aspect = sizes.width / sizes.height
    // camera.updateProjectionMatrix()

    // Update renderer
    // renderer.setSize(sizes.width, sizes.height)
    renderer.setSize(600    , 400)

})



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(26, 1.5, 0.1, 100)


camera.position.set(0,0,0)


scene.add(camera)

// Controls
controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

controls.target.set(3,0.1,0.6);  // when using orbit controls, this CONTROSLS THE POSITION OF THE CAMERA is is the position of the camera when the page loads
controls.update();
 
controls.screenSpacePanning = false
controls.minAzimuthAngle = 0 // **** IMPORTANT this controls the rotation of the camera on horizontal axis when both min and max are the same, there's no movement possible. 
controls.maxAzimuthAngle = 1.56  
// controls.maxAzimuthAngle = Math.PI / 2

// controls.maxPolarAngle = Math.PI / 2.45
// controls.minPolarAngle = Math.PI / 2.55

controls.maxDistance = 3
controls.minDistance = 1
// var gridXZ = new THREE.GridHelper(10, 1);
//     scene.add(gridXZ);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})

scene.background = new THREE.Color(0xffffff)
renderer.setSize(600, 400)
// if (sizes.width <= 800) {
//     renderer.setSize(sizes.width * 0.5, sizes.height*0.5)
// }
// else {renderer.setSize(sizes.width, sizes.height)}
// // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    
    controls.update()

   

    if (mixer !== null){
        mixer.update(deltaTime)
    }
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()