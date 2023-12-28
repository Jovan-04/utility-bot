### This is still very much a WIP - feel free to reach out to me if you have any questions

## Using the `harvest` Command

The `harvest` command is used to make the bot harvest crops from the world around it. There are two ways to use the `harvest` command:
  `harvest crop <crop> [-p <x> <y> <z>] [-s <size>]`, or
  `harvest farm <Farm>`

The first option is the simplest, but it'll primarily be used to farm a location in the world once. The second option is a little more complicated, but it makes farming the same location in the world much easier. I'll discuss that in the next section.  
To use the first option, run it as a command just like you would any other. 
* `<crop>` is the block name of the crop you want the bot to farm, such as `carrots` or `potatoes`. you can find a full list in the `destinations.js` file: the static property `SUPPORTED_CROPS` of the `Farm` class.  
* `-p` is short for `point`, and takes three arguments (the x, y, and z coordinates). those are the coordinates of the center of the farm, and the coordinates the bot will search from. if -p is not specified, the bot's current position will be used by default.  
* `-s` is the size of the circle that the bot will search for crops.  
* any crops more than 4 blocks away from the search point vertically will not be considered part of the farm. You can change this distance in the `destinations.js` file by changing the static property of the `Farm` class called `VERT_DIST`.  

For example:
`harvest crop carrots -p 123 45 678 -s 15`  
will harvest carrots in a 15-block radius around the point (123, 45, 678).  

## The `Farm` Class

`Farm` is a class used to make the `harvest` command much easier to use when harvesting from the same place multiple times (as in, a farm you built at your base).  
You can add a new `Farm` to the bot's database in the `farms.js` file by adding another entry to the `module.exports` object. The syntax is as follows:
  `[name]: new Farm(name, center, crop, shape, measurements, baseName),` where:
* `name` is the name of the Farm; case-sensitive, spaces untested; must be the same in both the key and the constructor  
* `center` is a Vec3 representing the center of the farm - e.g. `new Vec3(123, 45, 678)`  
* `crop` is the block name of the crop you want the bot to farm, such as `carrots` or `potatoes`. you can find a full list in the `destinations.js` file: the static property `SUPPORTED_CROPS` of the `Farm` class.  
* `shape` is the shape of the farm - it can be a `square`, `rectangle`, or `circle`. 
* `measurements` is an array containing the necessary measurements for the `Farm`
    * for a square, this is the distance from the center to one of its sides - e.g. `[8]`
    * for a rectangle, these are the distances from the center to the sides (x and then z) - e.g. `[6, 15]`
    * for a circle, this is the radius - e.g. `[10]`
