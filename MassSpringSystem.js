
import * as THREE from './three/build/three.module.js';
import Particle from './Particle.js';
import Spring from './Spring.js';
export default class MassSpringSystem
{
    static instance

    constructor()
    {
        MassSpringSystem.instance = this
        this.springY = 100
        this.dashPotDamping = 1
        //this.dragDamping = 1

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
        this.springs = new Array(this.maxNumParticle);
        
        for(let i = 0; i < this.maxNumParticle; i++) 
        {
            this.springs[i] = new Array(this.maxNumParticle)
            for (let j = 0; j < this.maxNumParticle; j++) 
            {
                this.springs[i][j] = null;
            }
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
                let spring = new Spring(scene, this.particles[id], this.particles[i]);
                this.springs[i][id] = spring;
                this.springs[id][i] = spring;
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
            let thisParticle = this.particles[i];
            if(thisParticle.fixed)
            {
                continue;
            }
            let g = new THREE.Vector2(0.0, -2.8);
            thisParticle.force = g.multiplyScalar(this.particleMass);

            // Vector2f x_ij = m_x[i] - m_x[j];
            // Vector2f d = x_ij.Normalized();

            // // spring force
            // m_f[i] += -m_springY * (x_ij.Length() / m_restLength[i][j] - 1.0f) * d;

            // // dashpot damping
            // //todo: add dashpot damping
            // float v_rel = Dot((m_v[i] - m_v[j]), d);
            // m_f[i] += - m_dashPotDamping * v_rel * d;
            for( let j = 0; j < id; j++)
            {
                let anotherParticle = this.particles[j];
                let spring = this.springs[i][j];
                if(spring)
                {
                    let x_ij = new THREE.Vector2();
                    x_ij.copy(thisParticle.position);
                    x_ij.sub(anotherParticle.position);

                    let n = new THREE.Vector2();
                    n.copy(x_ij);
                    n.normalize();

                    //spring force
                    let springForce = new THREE.Vector2();
                    springForce.copy(n);
                    let k = -this.springY * (spring.length / spring.restLength - 1.0);
                    springForce.multiplyScalar(k);                 
                    thisParticle.force.add(springForce);

                    //dashpot damping
                    let v_ij = new THREE.Vector2();
                    v_ij.copy(thisParticle.velocity);
                    v_ij.sub(anotherParticle.velocity);
                    let v_rel = v_ij.dot(n);
                    let force = new THREE.Vector2();
                    force.copy(n);
                    force.multiplyScalar(- this.dashPotDamping * v_rel);
                    thisParticle.force.add(force);
                }
            }
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
        }


        // update springs postion
        for (let i = 0; i < this.maxNumParticle; i++) 
        {
            for (let j = i+1; j < this.maxNumParticle; j++) 
            {
                let spring = this.springs[i][j];
                if(spring)
                {
                    spring.update();
                }
            }
            
        }
    }

    draw()
    {
        //console.warn(this.springY)
    }
}