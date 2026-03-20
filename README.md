# Pathfinding Visualizer

This is a simple project where I implemented pathfinding algorithms like BFS and Dijkstra and visualized how they work on a grid.

The idea is to simulate how real-world systems find routes between two points.

## What this project does

- Finds shortest path using BFS
- Finds optimal path using Dijkstra (considering traffic)
- Shows how nodes are explored step by step
- Allows user interaction with the grid

## Features

- Create walls (blocked paths)
- Add traffic (weighted nodes)
- Drag start and end positions
- Adjust speed of visualization
- Clear and reset grid

## Algorithms used

BFS:
- Works for unweighted graphs
- Finds shortest path
- Time complexity: O(V + E)

Dijkstra:
- Works for weighted graphs
- Finds minimum cost path
- Time complexity: O(V^2)

## How to use

1. Click on cells:
   - First click → wall
   - Second click → traffic
2. Drag the start (green) and end (red) nodes
3. Click on:
   - Run BFS
   - Run Dijkstra
4. Use the speed slider to control animation
5. Click clear to reset

## Real-world idea

This is similar to how apps like Swiggy or Zomato find the best route for delivery by considering distance and traffic.

## Tech used

- HTML
- CSS
- JavaScript

## Live Demo

(Add your link here after deploying)

## Author

SAISUDHAGAVIDI
