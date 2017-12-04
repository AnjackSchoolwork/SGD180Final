
/*
* Entity class
* Base class for enemies and NPCs
* All entites have sprites and (x, y) coordinates
* Sprite image should already be loaded in startup.js
*/
class Entity {
	/*
	* @param {object}	game	- Phaser.Game object
	* @param {int}		x		- X coordinate of entity
	* @param {int}		y		- Y coordinate of entity
	* @param {string}	image	- (Phaser) ID of image to use for sprite
	*/
	constructor(game, group, x, y, image) {
		this.sprite = group.create(x, y, image)
		this.sprite.anchor.set(0.5, 1)
		game.physics.arcade.enable(this.sprite)
		this.sprite.body.gravity.y = 1600
	}
}

