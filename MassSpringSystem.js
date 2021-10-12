
import * as THREE from './three/build/three.module.js';

export default class MassSpringSystem
{
    static instance

    


    constructor()
    {
        MassSpringSystem.instance = this
        this.springY = 1000
        this.dashPotDamping = 100
        this.dragDamping = 1

        this.maxNumParticle = 100
        this.particleMass = 1.0
        this.dt = 1e-3
        this.subSteps = 10
        this.connectionRadius = 0.15

        this.numParticles = 0
        this.x = new Array(this.maxNumParticle)
        this.v = new Array(this.maxNumParticle)
        this.f = new Array(this.maxNumParticle)
        this.restLength = new Array(this.maxNumParticle)

        for(var i = 0; i < this.maxNumParticle; i++) 
        {
            this.restLength[i] = new Array(this.maxNumParticle)
        }
    

    }

    addParticle(pos, fixed)
    {
        if (this.numParticles == this.maxNumParticle) {
            return;
        }

        var id = this.numParticles
        this.x[id] = new THREE.Vector2(pos.x, pos.y)
        this.v[id] = new THREE.Vector2(0, 0)
        this.numParticles++

        for (let i = 0; i < id; i++) {

            var dist = this.x[id].distaNC
            
        }
    }

    draw()
    {
        console.warn(this.springY)
    }
}