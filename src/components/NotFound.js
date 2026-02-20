import React from 'react'
import '../Css/apps.css'

const NotFound = () => {
    console.log("NotFound");
    return (
     <div className="container-fluid">
        <div class="mars"></div>
<img src="https://assets.codepen.io/1538474/404.svg" class="logo-404" />
<img src="https://assets.codepen.io/1538474/meteor.svg" class="meteor" />
<p class="title">Oh no!!</p>
<p class="subtitle">
	This Screen is Not Authorized for You..!
</p>
<img src="https://assets.codepen.io/1538474/astronaut.svg" class="astronaut" />
<img src="https://assets.codepen.io/1538474/spaceship.svg" class="spaceship" />
        </div>
    )
}

export default NotFound