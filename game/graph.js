class DirectedGraph {
  constructor(edges) {
    assert(edges instanceof Map);
    this.vertices = new Set(edges.keys());
    this.edges = edges;

    for (const neighbours of edges.values()) {
      assert(neighbours instanceof Array);
      for (const neighbour of neighbours) {
        assert(this.vertices.has(neighbour));
      }
    }
  }
}

class LineForest extends DirectedGraph {
  // A directed acyclic graph where the maximum indegree and outdegree of every
  // vertex is 1. That is, a forest of lines.
  // This kind of graph has a special form where we can list it as an array of
  // arrays, where [a, b, ...] corresponds to the directed line a -> b -> ...

  constructor(edges) {
    super(edges);

    this.successors = new Map();
    this.roots = new Set(this.vertices);
    for (const [vertex, neighbours] of this.edges.entries()) {
      assert(neighbours.length <= 1);
      if (neighbours.length === 1) {
        const neighbour = neighbours[0];
        this.successors.set(vertex, neighbour);
        // Validate: maximum indegree is 1
        assert(this.roots.has(neighbour));
        this.roots.delete(neighbour);
      }
    }

    const reachable = new Set();
    this.lines = Array.from(this.roots).map((root) => {
      const line = [];
      let vertex = root;
      while (vertex !== undefined) {
        reachable.add(vertex);
        line.push(vertex);
        vertex = this.successors.get(vertex);
      }
      return line;
    });

    // Validate: no cycles
    assert(setsEqual(this.vertices, reachable));
  }
}
