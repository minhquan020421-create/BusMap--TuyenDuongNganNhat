const assert=require('node:assert/strict');global.window=global;require('../data/network.js');require('../js/graph.js');
const {findPath,adjacency}=BusGraph;let count=0;
for(const a of BUS_DATA.stops)for(const b of BUS_DATA.stops){const p=findPath(a[0],b[0]);assert(p);assert.equal(p.stops[0],a[0]);assert.equal(p.stops.at(-1),b[0]);assert(Math.abs(p.cost-(p.km+p.transfers*BUS_DATA.transferPenaltyKm))<1e-8);for(const e of p.edges)assert(adjacency[e.from].some(x=>x.to===e.to&&x.route===e.route&&x.km===e.km));count++;}
assert.equal(findPath('BT','BT').km,0);assert.equal(findPath('missing','BT'),null);console.log(`${count} cặp trạm hợp lệ; kiểm tra đầu vào và chi phí: OK`);
