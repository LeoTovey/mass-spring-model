
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
        this.dt = 1e-1
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
    }

    updateSteps(particles)
    {
        var id = this.numParticles

        // computer force
        for( let i = 0; i < id; i++)
        {
            let g = new THREE.Vector2(0.0, -9.8);
            this.f[i] = g.multiplyScalar(this.particleMass);
        }

        var maxX = 5;
        var maxY = 5;
        var minX = -5;
        var minY = -5;
        
        for( let i = 0; i < id; i++)
        {
            // collide with four walls
            if(this.x[i].x > maxX)
            {
                this.x[i].x = maxX;
                this.v[i].x = 0;
            }

            if(this.x[i].y > maxY)
            {
                this.x[i].y = maxY;
                this.v[i].y = 0;
            }

            if(this.x[i].x < minX)
            {
                this.x[i].x = minX;
                this.v[i].x = 0;
            }

            if(this.x[i].y < minY)
            {
                this.x[i].y = minY;
                this.v[i].y = 0;
            }

            //this.x[i]. ++;
            // computer velocity and position
            var a_dt = this.f[i].divideScalar(this.particleMass).multiplyScalar(this.dt)
            this.v[i] = this.v[i].add(this.v[i].add(a_dt));

            this.x[i] = this.x[i].add(this.v[i].multiplyScalar(this.dt));

            particles[i].position.set(this.x[i].x, this.x[i].y, 0);
        }
    }

    draw()
    {
        console.warn(this.springY)
    }
}