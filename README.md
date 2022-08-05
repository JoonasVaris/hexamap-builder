# hexamap-builder

Generetas and reads hexagon maps with a wonky coordinate system.
Each hexa has xy-coordinates and it knows it's neighbours.
I made this for DnD purposes.

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

## Coordinate system

Hexagons can't be presented with a single xy-coordinate if you place a hexagon
on each coordinate.

Hexagons have six neighbours but each "square" on a standard xy-plane has 8 neighbouring
tiles if you count the diagonal ones.

```
|_|_|_|
|_|X|_|
|_|_|_|
```
