import * as THREE from 'three';

const radius = 5;
const particleGeometry = new THREE.CircleGeometry( radius, 32 );
const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xff8da3 });  // greenish blue


export default class Particle
{
    constructor(pos, fixed)
    {
        //二维向量
        this.position = pos;
        this.velocity = new THREE.Vector2(0, 0);
        this.force = new THREE.Vector2(0, 0);
        this.fixed = fixed;
        this.mesh = new THREE.Mesh(particleGeometry, particleMaterial);
        this.mesh.position.set(pos.x, pos.y, 1);
    }

    updateMeshPosition()
    {
        this.mesh.position.set(this.position.x, this.position.y, 1);
    }
}