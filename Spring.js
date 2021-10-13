import * as THREE from './three/build/three.module.js';

const material = new THREE.LineBasicMaterial({
	color: 0x0000ff,
    linewidth: 100
});

export default class Spring
{
    constructor(scene, particle1, particle2)
    {

        this.particle1 = particle1;
        this.particle2 = particle2;
        let pos1 = particle1.position;
        let pos2 = particle2.position;
        const points =  new Float32Array( [
            pos1.x, pos1.y, -1,
            pos2.x, pos2.y, -1
        ] );

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.BufferAttribute( points, 3 ) );
        this.geometry = geometry;

        const line = new THREE.Line( geometry, material );
        scene.add(line);
    }

    update()
    {
        let pos1 = this.particle1.position;
        let pos2 = this.particle2.position;
        const points =  new Float32Array( [
            pos1.x, pos1.y, -1,
            pos2.x, pos2.y, -1
        ] );
        this.geometry.setAttribute('position', new THREE.BufferAttribute(points, 3 ) );
    }
}