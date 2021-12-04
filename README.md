# Toy Earth Moon Sun Simulation

Hey, I hope you enjoy playing with this simple simulation. It's important to note that a lot of values in this simulation are not to scale (especially distances and sizes). I've prioritized making things look nice and easy to play with rather than accurate.

Of course, you know that the Sun does not revolve around the Earth as the Moon does, but from Earth's perspective this is a good enough approximation for our toy model.

Times are also not accurate but at least I strived to make them _relatively_ accurate: A Moon revolution and/or rotation will take 28 Earth's rotations (which should keep the moon Tidally locked to Earth as in real life). The Sun will also take 365.25 Earth rotations. The Sun's rotational period is just a random number I chose. I got tired...

Earth's tilt (which is 23.4 degrees and is the reason we have seasons) is also accurate, so you should see that the poles get alternatively lit by the sun as time goes by. The Moon's Orbital tilt (the Moon's orbit as seen edge on does not align with the plane that contains the Earth and the Sun, rather it tilts about 5 degrees) is also more or less accurate.

You'll see very frequent eclipses in the simulation, this is due to many facts, the most important one is that I have modeled the Sun's light as a plane which is not true (the Sun emits light that propagates in a Sphere and not a Plane), this coupled with the fact that distances are for beauty and not accuracy and other orbital elements not being modeled at all yields way more eclipses than you should expect in real life.

Eclipses also look different given all the above, and also because we have an Atmosphere with many amazing properties that I chose not to model (meaning I don't yet have the slightest clue as to how to do it). Although the Earth has clouds, this is just a cloud layer and not a true atmosphere which (alongside many other things I did not include in the simulation such as accurate distances and lighting) would give the edges of the eclipse their distinctive difuseness in the edges.

Having said all this, the TLDR is just: **This looks very little like reality for a lot of reasons but I hope you can enjoy it anyway**.

Start the simulation by [clicking here](https://ewajs.github.io/threejs-tutorial/dist/)

# Why?

Everyone has a first stab at something. This is mine with Three.js.
The boilerplate webpack and threejs configuration is taken from [https://github.com/designcourse/threejs-webpack-starter](https://github.com/designcourse/threejs-webpack-starter)
