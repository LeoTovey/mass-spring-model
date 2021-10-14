import * as THREE from './three/build/three.module.js';


const springRadius = 3;
const restLength = 100;

const geometry = new THREE.PlaneGeometry( springRadius, restLength );
const material = new THREE.MeshBasicMaterial( {color: 0xffd7cf, side: THREE.DoubleSide} );


export default class Spring
{
    constructor(scene, particle1, particle2)
    {

        this.particle1 = particle1;
        this.particle2 = particle2;
        let pos1 = particle1.position;
        let pos2 = particle2.position;
        const mesh = new THREE.Mesh( geometry, material );

        let pos = new THREE.Vector2();
        pos.copy(pos1);
        pos.add(pos2);
        pos.multiplyScalar(0.5);
        mesh.position.set(pos.x, pos.y, -1);
        mesh.rotateZ(this.calculateZ());
        this.mesh = mesh;

        scene.add(mesh);
    }

    update()
    {
        let pos1 = this.particle1.position;
        let pos2 = this.particle2.position;
        let pos = new THREE.Vector2();
        pos.copy(pos1);
        pos.add(pos2);
        pos.multiplyScalar(0.5);
        this.mesh.position.set(pos.x, pos.y, -1);
        pos.copy(pos1);
        pos.sub(pos2);
        this.mesh.scale.y = pos.length()/ restLength;
        this.mesh.rotation.z = this.calculateZ();
    }


    calculateZ()
    {
        let pos1 = this.particle1.position;
        let pos2 = this.particle2.position;

        if(pos1.x == pos2.x)
        {
            return 0;
        }
        else
        {
            let k = (pos1.y - pos2.y) / (pos1.x - pos2.x);
            let theta = Math.atan(k);
            //console.log(theta * 180.0 / Math.PI);
            return theta - Math.PI / 2;
        }

    }
}