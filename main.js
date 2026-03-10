var i=Object.defineProperty;var p=Object.getOwnPropertyDescriptor;var f=Object.getOwnPropertyNames;var x=Object.prototype.hasOwnProperty;var v=(n,e)=>{for(var t in e)i(n,t,{get:e[t],enumerable:!0})},h=(n,e,t,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of f(e))!x.call(n,r)&&r!==t&&i(n,r,{get:()=>e[r],enumerable:!(o=p(e,r))||o.enumerable});return n};var y=n=>h(i({},"__esModule",{value:!0}),n);var E={};v(E,{default:()=>a});module.exports=y(E);var m=require("obsidian");function d(n,e){return`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<style>
	* { margin: 0; padding: 0; box-sizing: border-box; }
	body {
		background: #1e1e2e;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		height: 100vh;
		font-family: -apple-system, BlinkMacSystemFont, sans-serif;
	}
	#canvas-container {
		flex: 1;
		position: relative;
	}
	canvas {
		width: 100% !important;
		height: 100% !important;
		display: block;
		touch-action: none;
	}
	#status {
		position: absolute;
		top: 8px;
		left: 8px;
		color: #cdd6f4;
		font-size: 12px;
		background: rgba(30, 30, 46, 0.8);
		padding: 4px 8px;
		border-radius: 4px;
		z-index: 10;
	}
	#error {
		display: none;
		color: #f38ba8;
		padding: 16px;
		font-size: 13px;
		white-space: pre-wrap;
		word-break: break-word;
		overflow: auto;
		max-height: 100%;
	}
	#controls {
		display: flex;
		gap: 4px;
		padding: 4px 8px;
		background: #181825;
		justify-content: center;
	}
	#controls button {
		background: #313244;
		color: #cdd6f4;
		border: none;
		padding: 4px 10px;
		border-radius: 4px;
		font-size: 11px;
		cursor: pointer;
		touch-action: manipulation;
	}
	#controls button:active { background: #45475a; }
</style>
</head>
<body>

<div id="canvas-container">
	<div id="status">Loading...</div>
	<div id="error"></div>
</div>
<div id="controls">
	<button onclick="resetCamera()">Reset View</button>
	<button onclick="toggleWireframe()">Wireframe</button>
	<button onclick="toggleAutoRotate()">Auto-Rotate</button>
</div>

<script type="text/javascript">
// Minimal inline JSCAD modeling subset + Three.js rendering
// This avoids heavy CDN dependencies and works offline on mobile

var statusEl = document.getElementById('status');
var errorEl = document.getElementById('error');
var container = document.getElementById('canvas-container');

function showError(msg) {
	errorEl.style.display = 'block';
	errorEl.textContent = 'Error: ' + msg;
	statusEl.style.display = 'none';
}

// Load Three.js from CDN
function loadScript(url) {
	return new Promise(function(resolve, reject) {
		var s = document.createElement('script');
		s.src = url;
		s.onload = resolve;
		s.onerror = function() { reject(new Error('Failed to load: ' + url)); };
		document.head.appendChild(s);
	});
}

async function init() {
	try {
		statusEl.textContent = 'Loading Three.js...';
		await loadScript('https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js');
		await loadScript('https://cdn.jsdelivr.net/npm/three@0.149.0/examples/js/controls/OrbitControls.js');

		statusEl.textContent = 'Loading JSCAD...';
		await loadScript('https://cdn.jsdelivr.net/npm/@jscad/modeling@2.12.2/dist/jscad-modeling.min.js');

		statusEl.textContent = 'Evaluating JSCAD code...';
		runJSCAD();
	} catch (e) {
		showError(e.message || String(e));
	}
}

var scene, camera, renderer, controls, mainMesh;
var wireframeMode = false;
var autoRotate = true;

function runJSCAD() {
	try {
		var modeling = jscadModeling;

		// Create a sandbox with JSCAD modeling API available
		var sandbox = {};
		// Expose top-level JSCAD namespaces
		Object.keys(modeling).forEach(function(key) {
			sandbox[key] = modeling[key];
		});

		// Also expose common shortcuts
		var shortcuts = [
			'cube', 'sphere', 'cylinder', 'torus', 'cuboid', 'roundedCuboid',
			'geodesicSphere', 'ellipsoid', 'roundedCylinder', 'cylinderElliptic',
			'polygon', 'circle', 'rectangle', 'roundedRectangle', 'square', 'star',
			'line', 'arc'
		];

		// Map primitives shortcuts
		if (modeling.primitives) {
			shortcuts.forEach(function(name) {
				if (modeling.primitives[name]) {
					sandbox[name] = modeling.primitives[name];
				}
			});
		}

		// Map boolean shortcuts
		if (modeling.booleans) {
			['union', 'subtract', 'intersect', 'scission'].forEach(function(name) {
				if (modeling.booleans[name]) sandbox[name] = modeling.booleans[name];
			});
		}

		// Map transform shortcuts
		if (modeling.transforms) {
			['translate', 'rotate', 'scale', 'center', 'mirror', 'align'].forEach(function(name) {
				if (modeling.transforms[name]) sandbox[name] = modeling.transforms[name];
			});
		}

		// Map extrusion shortcuts
		if (modeling.extrusions) {
			['extrudeLinear', 'extrudeRotate', 'extrudeRectangular'].forEach(function(name) {
				if (modeling.extrusions[name]) sandbox[name] = modeling.extrusions[name];
			});
		}

		// Map hull shortcuts
		if (modeling.hulls) {
			['hull', 'hullChain'].forEach(function(name) {
				if (modeling.hulls[name]) sandbox[name] = modeling.hulls[name];
			});
		}

		// Map expansion shortcuts
		if (modeling.expansions) {
			['expand', 'offset'].forEach(function(name) {
				if (modeling.expansions[name]) sandbox[name] = modeling.expansions[name];
			});
		}

		// Build function args
		var argNames = Object.keys(sandbox);
		var argValues = argNames.map(function(k) { return sandbox[k]; });

		// The user code should define a main() function or return geometry directly
		var wrappedCode = '"use strict";\\n' + decodeHTMLEntities(\`${n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}\`) + '\\n;if (typeof main === "function") { return main(); }';

		var fn = new Function(argNames.join(','), wrappedCode);
		var result = fn.apply(null, argValues);

		if (!result) {
			showError('JSCAD code must define a main() function that returns geometry.');
			return;
		}

		statusEl.textContent = 'Converting geometry...';

		// Convert JSCAD geometry to triangles via earcut-style tessellation
		var geometries = Array.isArray(result) ? result : [result];
		var allVertices = [];
		var allNormals = [];

		geometries.forEach(function(geom) {
			var polys;
			if (geom.polygons) {
				// 3D geom3
				polys = geom.polygons;
			} else if (modeling.geometries && modeling.geometries.geom3 && modeling.geometries.geom3.toPolygons) {
				try {
					polys = modeling.geometries.geom3.toPolygons(geom);
				} catch(e) {
					// Maybe it's a 2D geometry, try to extrude it
					try {
						var extruded = modeling.extrusions.extrudeLinear({ height: 1 }, geom);
						polys = modeling.geometries.geom3.toPolygons(extruded);
					} catch(e2) {
						console.warn('Could not convert geometry:', e2);
						return;
					}
				}
			} else {
				return;
			}

			if (!polys) return;

			polys.forEach(function(poly) {
				var verts = poly.vertices;
				if (!verts || verts.length < 3) return;

				// Compute face normal
				var v0 = verts[0], v1 = verts[1], v2 = verts[2];
				var ax = v1[0]-v0[0], ay = v1[1]-v0[1], az = v1[2]-v0[2];
				var bx = v2[0]-v0[0], by = v2[1]-v0[1], bz = v2[2]-v0[2];
				var nx = ay*bz - az*by;
				var ny = az*bx - ax*bz;
				var nz = ax*by - ay*bx;
				var len = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
				nx /= len; ny /= len; nz /= len;

				// Fan triangulation for convex polygons
				for (var i = 1; i < verts.length - 1; i++) {
					allVertices.push(
						verts[0][0], verts[0][1], verts[0][2],
						verts[i][0], verts[i][1], verts[i][2],
						verts[i+1][0], verts[i+1][1], verts[i+1][2]
					);
					allNormals.push(nx,ny,nz, nx,ny,nz, nx,ny,nz);
				}
			});
		});

		if (allVertices.length === 0) {
			showError('No renderable 3D geometry produced. Make sure main() returns a 3D shape.');
			return;
		}

		statusEl.textContent = 'Rendering...';
		render3D(new Float32Array(allVertices), new Float32Array(allNormals));
		statusEl.style.display = 'none';

	} catch(e) {
		showError(e.message || String(e));
	}
}

function decodeHTMLEntities(text) {
	var ta = document.createElement('textarea');
	ta.innerHTML = text;
	return ta.value;
}

function render3D(vertices, normals) {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x1e1e2e);

	// Compute bounding box for camera positioning
	var minX=Infinity, minY=Infinity, minZ=Infinity;
	var maxX=-Infinity, maxY=-Infinity, maxZ=-Infinity;
	for (var i = 0; i < vertices.length; i += 3) {
		var x = vertices[i], y = vertices[i+1], z = vertices[i+2];
		if (x < minX) minX = x; if (x > maxX) maxX = x;
		if (y < minY) minY = y; if (y > maxY) maxY = y;
		if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
	}

	var cx = (minX+maxX)/2, cy = (minY+maxY)/2, cz = (minZ+maxZ)/2;
	var size = Math.max(maxX-minX, maxY-minY, maxZ-minZ) || 1;

	camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.01, size * 100);
	camera.position.set(cx + size*1.5, cy + size*1.0, cz + size*1.5);
	camera.lookAt(cx, cy, cz);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	container.appendChild(renderer.domElement);

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target.set(cx, cy, cz);
	controls.enableDamping = true;
	controls.dampingFactor = 0.1;
	controls.autoRotate = autoRotate;
	controls.autoRotateSpeed = 2.0;
	controls.update();

	// Geometry
	var bufferGeom = new THREE.BufferGeometry();
	bufferGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
	bufferGeom.setAttribute('normal', new THREE.BufferAttribute(normals, 3));

	var material = new THREE.MeshPhongMaterial({
		color: 0x89b4fa,
		specular: 0x444444,
		shininess: 30,
		side: THREE.DoubleSide,
		flatShading: true
	});
	mainMesh = new THREE.Mesh(bufferGeom, material);
	scene.add(mainMesh);

	// Lights
	var ambient = new THREE.AmbientLight(0x404040, 1.5);
	scene.add(ambient);

	var dir1 = new THREE.DirectionalLight(0xffffff, 1.0);
	dir1.position.set(size, size*2, size);
	scene.add(dir1);

	var dir2 = new THREE.DirectionalLight(0xffffff, 0.5);
	dir2.position.set(-size, -size, -size);
	scene.add(dir2);

	// Grid helper
	var gridSize = Math.ceil(size * 2);
	var grid = new THREE.GridHelper(gridSize, 20, 0x45475a, 0x313244);
	grid.position.set(cx, minY, cz);
	scene.add(grid);

	// Axes helper
	var axes = new THREE.AxesHelper(size * 0.5);
	axes.position.set(minX, minY, minZ);
	scene.add(axes);

	function animate() {
		requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera);
	}
	animate();

	window.addEventListener('resize', function() {
		camera.aspect = container.clientWidth / container.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.clientWidth, container.clientHeight);
	});
}

function resetCamera() {
	if (controls) {
		controls.reset();
	}
}

function toggleWireframe() {
	if (mainMesh) {
		wireframeMode = !wireframeMode;
		mainMesh.material.wireframe = wireframeMode;
	}
}

function toggleAutoRotate() {
	if (controls) {
		autoRotate = !autoRotate;
		controls.autoRotate = autoRotate;
	}
}

init();
<\/script>
</body>
</html>`}var b=400,a=class extends m.Plugin{async onload(){this.registerMarkdownCodeBlockProcessor("jscad",(e,t,o)=>this.processJscadBlock(e,t,o)),this.registerMarkdownCodeBlockProcessor("openjscad",(e,t,o)=>this.processJscadBlock(e,t,o)),console.log("OpenJSCAD Renderer plugin loaded")}onunload(){console.log("OpenJSCAD Renderer plugin unloaded")}processJscadBlock(e,t,o){let r=b,s=e.match(/^\/\/\s*height:\s*(\d+)/);s&&(r=parseInt(s[1],10));let l=t.createDiv({cls:"jscad-render-wrapper"}),u=l.createEl("iframe",{cls:"jscad-render-iframe",attr:{sandbox:"allow-scripts",frameborder:"0",width:"100%",height:`${r}px`}}),g=d(e,r);u.srcdoc=g;let c=l.createEl("details",{cls:"jscad-source-toggle"});c.createEl("summary",{text:"View JSCAD Source"}),c.createEl("pre").createEl("code",{text:e,cls:"language-javascript"})}};
