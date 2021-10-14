
import * as THREE from './three/build/three.module.js';
import Particle from './Particle.js';
import Spring from './Spring.js';
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
        this.connectionRadius = 75

        this.numParticles = 0

        this.maxX = 0;
        this.maxY = 0;
        this.minX = 0;
        this.minY = 0;

        this.particles = new Array(this.maxNumParticle);
        this.restLength = new Array(this.maxNumParticle);
        this.springs = new Array();
        
        for(var i = 0; i < this.maxNumParticle; i++) 
        {
            this.restLength[i] = new Array(this.maxNumParticle)
        }
    }

    addParticle(scene, pos, fixed)
    {
        if (this.numParticles == this.maxNumParticle) 
        {
            return;
        }

        var id = this.numParticles
        this.particles[id] = new Particle(pos, fixed);
        for(let i = 0; i < id; i++)
        {
            let postion = new THREE.Vector2(); 
            postion.x = this.particles[i].position.x;
            postion.y = this.particles[i].position.y;
            postion = postion.sub(pos);
            //console.log(postion.length());
            if(postion.length() < this.connectionRadius)
            {
                //console.log('add spring');
                this.springs.push(new Spring(scene, this.particles[id], this.particles[i]));
            }
        }
        scene.add(this.particles[id].mesh);
        this.numParticles++
    }

    update()
    {
        var id = this.numParticles

        // computer force
        for( let i = 0; i < id; i++)
        {
            let g = new THREE.Vector2(0.0, -2.8);
            this.particles[i].force = g.multiplyScalar(this.particleMass);
        }

        
        for( let i = 0; i < id; i++)
        {
            let particle = this.particles[i];
            let radius = 50;
            
            //collide with four walls
            if(particle.position.x > (this.maxX - radius))
            {
                particle.position.x = this.maxX;
                particle.velocity.x = 0;
            }

            if(particle.position.y > (this.maxY - radius))
            {
                particle.position.y = this.maxY;
                particle.velocity.y = 0;
            }

            if(particle.position.x < (this.minX + radius))
            {
                particle.position.x = this.minX + radius;
                particle.velocity.x = 0;
            }

            if(particle.position.y < (this.minY + radius))
            {
                particle.position.y = this.minY + radius;
                particle.velocity.y = 0;
            }

            //computer velocity and position

            let force = new THREE.Vector2();
            let velocity = new THREE.Vector2();

            force.copy(particle.force);

            let a = force.divideScalar(this.particleMass);
            let at = a.multiplyScalar(this.dt);
            particle.velocity.add(at);
            velocity.copy(particle.velocity);

            particle.position.add(velocity.multiplyScalar(this.dt));
  
            particle.updateMeshPosition();
            for (let index = 0; index < this.springs.length; index++) {
                const element = this.springs[index];
                element.update();
            }
        }
    }

    draw()
    {
        //console.warn(this.springY)
    }
}