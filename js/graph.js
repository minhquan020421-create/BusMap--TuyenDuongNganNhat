/* Thuật toán chạy trên trạng thái (trạm, tuyến đang đi) để tính đúng phạt chuyển tuyến. */
(function(root){
  const {stops,routes,transferPenaltyKm,averageSpeedKmh}=root.BUS_DATA;
  const byId=Object.fromEntries(stops.map(([id,name,lat,lng,area])=>[id,{id,name,lat,lng,area}]));
  function distance(a,b){const r=Math.PI/180,dlat=(b.lat-a.lat)*r,dlng=(b.lng-a.lng)*r;const h=Math.sin(dlat/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dlng/2)**2;return 6371*2*Math.asin(Math.sqrt(Math.min(1,h)));}
  const adjacency=Object.fromEntries(stops.map(s=>[s[0],[]]));
  for(const route of routes){for(let i=1;i<route.stops.length;i++){const a=route.stops[i-1],b=route.stops[i],km=distance(byId[a],byId[b])*1.25;adjacency[a].push({to:b,route:route.id,km});adjacency[b].push({to:a,route:route.id,km});}}
  function findPath(start,end,penalty=transferPenaltyKm){
    if(!byId[start]||!byId[end]||!Number.isFinite(penalty)||penalty<0)return null;
    if(start===end)return {stops:[start],edges:[],segments:[],km:0,minutes:0,transfers:0,fare:0,cost:0};
    const first=start+'|',dist=new Map([[first,0]]),prev=new Map(),queue=[first];let goal;
    while(queue.length){queue.sort((a,b)=>dist.get(a)-dist.get(b));const key=queue.shift();const [stop,last]=key.split('|');if(stop===end){goal=key;break;}
      for(const edge of adjacency[stop]){const next=edge.to+'|'+edge.route;const cost=dist.get(key)+edge.km+(last&&last!==edge.route?penalty:0);if(cost<(dist.get(next)??Infinity)){dist.set(next,cost);prev.set(next,{key,edge:{from:stop,...edge}});if(!queue.includes(next))queue.push(next);}}
    }
    if(!goal)return null;const edges=[];for(let k=goal;k!==first;){const p=prev.get(k);edges.unshift(p.edge);k=p.key;}
    const segments=[];for(const e of edges){let seg=segments.at(-1);if(!seg||seg.route!==e.route){seg={route:e.route,stops:[e.from],km:0};segments.push(seg);}seg.stops.push(e.to);seg.km+=e.km;}
    const km=edges.reduce((a,e)=>a+e.km,0),transfers=segments.length-1;
    return {stops:[start,...edges.map(e=>e.to)],edges,segments,km,minutes:Math.ceil(km/averageSpeedKmh*60+transfers*4),transfers,fare:segments.reduce((sum,s)=>sum+routes.find(r=>r.id===s.route).fare,0),cost:dist.get(goal)};
  }
  function routeDistance(route){return route.stops.slice(1).reduce((sum,id,i)=>sum+distance(byId[route.stops[i]],byId[id])*1.25,0);}
  root.BusGraph={byId,adjacency,distance,findPath,routeDistance};
})(typeof window!=='undefined'?window:globalThis);
