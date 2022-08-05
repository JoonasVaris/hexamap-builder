# hexamap-builder

Generetas and reads hexagon maps made of hexagons with a wonky coordinate system.
Each hexa has xy-coordinates and it knows it's neighbours.
I made this for DnD purposes.

This does not generate any graphics (yet).

## Usage

`generateHexagonJSON` with wanted final height.
It generates an array of `Hexagons`.

```ts
export interface Hexagon {
  id: number;
  x: number;
  y: number;
  neighbourIds: number[];
}
```

`NeighbourIds` can be used to determine which Hexagons are valid
hexas to move to -- Neat!

<img width="273" alt="image" src="https://user-images.githubusercontent.com/53940550/183081202-0add7304-5e07-431e-af65-866f050b0228.png">

## Coordinate system

Hexagons can't be presented with a single xy-coordinate if you place a hexagon
on each coordinate.

Hexagons have six neighbours but each "square" on a standard xy-plane has 8 neighbouring
tiles if you count the diagonal ones.

```
|_|_|_|
|_|H|_|
|_|_|_|
```

My solution to this is to place each row on its own Y-coordinate

<img width="392" alt="image" src="https://user-images.githubusercontent.com/53940550/183078704-64471237-38c4-4ab0-b52a-0e232bd93217.png">

And use following notation:

<img width="282" alt="image" src="https://user-images.githubusercontent.com/53940550/183078873-349305ba-613e-4175-ad7b-cebd56a5e12f.png">

This way we end up occupying every other coordinate pair in xy-coordinates as illustrated below
```
|_|_|H|_|_|
|_|H|_|H|_|
|H|_|H|_|H|
|_|H|_|H|_|
|_|_|H|_|_|
```

Hexagon (H) and its neighbouring hexagons (N) 
```
|_|_|N|_|_|
|_|N|_|N|_|
|_|_|H|_|_|
|_|N|_|N|_|
|_|_|N|_|_|
```

## Note

This can only generate infomation for these:
 __
/  \
\__/

Not these:
 /\
|  |
 \/

I thought the first looks neater.
