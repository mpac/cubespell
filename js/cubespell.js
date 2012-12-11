// CubeSpell by Michael Pacchioli
// Some code taken from three.js cube tutorials

var container, info;
var camera, scene, renderer;
var startTime, endTime;

var cubes = [];
var spheres = [];

var cubeRows = 3;
var cubeColumns = 3;
var cubeNumber = cubeRows * cubeColumns;

var materials = [];

var letters = [
	'a', 'b', 'c', 'd', 'e', 'f',
	'g', 'h', 'i', 'j', 'k', 'l',
	'm', 'n', 'o', 'p', 'q', 'r',
	's', 't', 'u', 'v', 'w', 'x',
	'y', 'z'
]


for ( i = 0; i < 26; i ++ ) {
    materials[ letters[ i ] ] = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/' + letters[ i ] + '.png') } );
}


// from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/random

function getRandomArbitary(min, max) {
    return Math.random() * ( max - min ) + min;
}


function init() {

	container = document.createElement( 'div' );
	container.style.background = ( 'url(http://luxehdwallpaper.com/wallpaper/2012/09/-Outer-Space-Stars-Galaxies-Hd-Wallpaper--.jpg)' );
	
	document.body.appendChild( container );

	info = document.createElement( 'div' );
	
	info.style.color = '#FFFFFF';
	info.style.fontSize = '20px';
	info.style.fontWeight = 'bold';
	
	info.style.position = 'absolute';
	info.style.top = '15px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	
	info.innerHTML = 'CubeSpell';
	
	container.appendChild( info );
	
	input = document.createElement( 'div' );
	
	input.style.color = '#FFFFFF';
	input.style.position = 'absolute';
	input.style.bottom = '20px';
	input.style.width = '100%';
	input.style.textAlign = 'center';
	
	input.innerHTML = 'Unscramble and spell the words:<br/><br/><form id="word-form"><input id="word-field" name="word-field" type="text" maxlength="6" /></form>';
	
	container.appendChild( input );

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
	
	camera.position.x = 500;
	camera.position.y = 400;
	camera.position.z = 1000;

	scene = new THREE.Scene();	

	for ( var i = 0; i < cubeColumns; i ++ ) {
		for ( var j = 0; j < cubeRows; j ++ ) {

			var word = words[Math.floor(Math.random() * words.length)];
			// var word = words[0];
			
			var cubeMaterials = getMaterials(word);
				
			var cubeGeometry = new THREE.CubeGeometry(200, 200, 200, 1, 1, 1);
			var cube = new THREE.Mesh(cubeGeometry, new THREE.MeshFaceMaterial(cubeMaterials));
						
			cube.position.x = cube.position.x + ( i * 500 );
			cube.position.y = 150 + ( j * 350 );
			cube.position.z = cube.position.z - Math.floor(getRandomArbitary(25, 1500));
			
			cube.xRotation = getRandomArbitary( 0.01, 0.05 );
			cube.yRotation = getRandomArbitary( 0.01, 0.05 );			
			cube.zRotation = getRandomArbitary( 0.01, 0.05 );
			
			cube.word = word
			
			cubes.push( cube );
			scene.add( cube );
			
			var sphereGeometry = new THREE.SphereGeometry(225, 20, 20);
			var sphereMaterial = new THREE.MeshBasicMaterial( { color:0xff0000, wireframe: true } );
			
			var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
			
			sphere.position.x = cube.position.x
			sphere.position.y = cube.position.y
			sphere.position.z = cube.position.z
			
			sphere.visible = false;
			
			spheres.push( sphere );
			scene.add( sphere );
		}
	}

	renderer = new THREE.CanvasRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

}


function getMaterials(word) {
	var array = []
	
	for (var i = 0; i < word.length; i ++) {
		letter = word[ i ]
		array[ i ] = materials[ letter ];
	}
	
	return array;
}


function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

	requestAnimationFrame( animate );
	render();

}


function render() {

	for ( var i = 0; i < cubeNumber; i ++ ) {
		cubes[ i ].rotation.x += cubes[ i ].xRotation;
		cubes[ i ].rotation.y += cubes[ i ].yRotation;
		cubes[ i ].rotation.z += cubes[ i ].zRotation;
		
		spheres[ i ].rotation.x += cubes[ i ].xRotation;
		spheres[ i ].rotation.y += cubes[ i ].yRotation;
		spheres[ i ].rotation.z += cubes[ i ].zRotation;		
	}

	renderer.render( scene, camera );

}


function checkGame() {

	var finished = true;

	for (var i = 0; i < cubes.length; i ++) {
		if (cubes[ i ].visible) {
			finished = false;
		}
	}
	
	if (finished) {
		endTime = new Date();
		var time = (endTime - startTime) / 1000;
		
		input.innerHTML = 'Completed in ' + time + ' seconds!';
	}
}

$(document).ready( function() {

	init();

	$( "#word-field" ).keyup( function(e) {
		text = $( "#word-field" ).val();
		
		if (text.length == 6) {
			lowerText = text.toLowerCase();
			upperText = text.toUpperCase();
		
			$( "#word-field" ).val( upperText );
			
			for (var i = 0; i < cubes.length; i ++) {
				if (cubes[ i ].word == lowerText) {
					cubes[ i ].visible = false;
					spheres[ i ].visible = true;
					
					$( '#word-field' ).val('');
					
					checkGame();
				}
			}
		}
	} );

	$(document).click( function() {
		$( "#word-field" ).focus();
	} );

	$( "#word-field" ).focus();	
	
	startTime = new Date();	
	animate();	

} );
