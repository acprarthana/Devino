// import Skull from "./Skull";

// export default function StageCard({ stage, index }) {
//   return (
//     <div
//       className="card-horror"
//       style={{
//         textAlign: "center",
//         padding: "36px 18px",
//         background: "#0d0000",
//         border: "1px solid #8b0000",
//         transition: "all 0.3s ease",
//         boxShadow: "0 0 10px rgba(255,0,0,0.15)",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           marginBottom: "16px",
//         }}
//       >
//         <Skull size={50} />
//       </div>

//       <div
//         style={{
//           fontSize: "1.2rem",
//           color: "#8b0000",
//           fontFamily: "Creepster, cursive",
//           marginBottom: "6px",
//         }}
//       >
//         {stage.icon}
//       </div>

//       <h3
//         style={{
//           fontFamily: "Creepster, cursive",
//           fontSize: "1.35rem",
//           color: "#ff2020",
//           marginBottom: "10px",
//           letterSpacing: "2px",
//         }}
//       >
//         {stage.title}
//       </h3>

//       <p
//         style={{
//           color: "#b0a0a0",
//           fontSize: "0.9rem",
//           lineHeight: 1.7,
//         }}
//       >
//         {stage.desc}
//       </p>

//       <div
//         style={{
//           marginTop: "18px",
//           padding: "6px 14px",
//           background: "#1a0505",
//           border: "1px solid #8b0000",
//           display: "inline-block",
//           fontSize: "0.75rem",
//           color: "#999",
//           letterSpacing: "1px",
//         }}
//       >
//         STAGE {index + 1}
//       </div>
//     </div>
//   );
// }

// import Link from 'next/link';

// export default function StageCard({ stage, isLocked, isCurrent, projectId }) {
//   const cardStyle = isLocked 
//     ? "opacity-40 grayscale cursor-not-allowed border-gray-800" 
//     : isCurrent 
//     ? "border-red-600 shadow-[0_0_15px_rgba(255,0,0,0.5)] scale-105" 
//     : "border-green-900 opacity-80";

//   return (
//     <div className={`p-6 border-2 transition-all duration-500 rounded-lg bg-zinc-950 ${cardStyle}`}>
//       <div className="text-sm font-mono text-red-500 mb-2">STAGE 0{stage.id}</div>
//       <h3 className="text-xl font-bold mb-4">{stage.name}</h3>
//       <p className="text-xs text-gray-400 mb-6">{stage.desc}</p>
      
//       {!isLocked ? (
//        <Link href={`/projects/${projectId}/stage/${stage.id}`}>
//       <button className="...">
//         {isCurrent ? "Enter the Abyss" : "Revisit Stage"}
//       </button>
//     </Link>
//       ) : (
//         <div className="text-center text-gray-600 py-2 border border-dashed border-gray-700 uppercase text-xs">
//           Locked 🔒
//         </div>
//       )}
//     </div>
//   );
// }


import Link from 'next/link';

export default function StageCard({ stage, projectId, isLocked, isCurrent }) {
  // If projectId is undefined, we show a 'Loading' state instead of a broken link
  if (!projectId) {
    return <div className="p-6 border-2 border-zinc-900 animate-pulse bg-zinc-950">Loading...</div>;
  }

  return (
    <div className={`p-6 border-2 transition-all duration-500 rounded-lg bg-zinc-950 
      ${isLocked ? 'border-zinc-900 opacity-25' : 'border-red-900'} 
      ${isCurrent ? 'border-red-600 shadow-[0_0_15px_rgba(255,0,0,0.4)]' : ''}`}>
      
      <h3 className="text-white font-horror text-xl mb-4">{stage.name}</h3>

      {!isLocked ? (
        <Link href={`/projects/${projectId}/stages/${stage.id}/submit`}>
          <button className="w-full py-2 bg-red-700 hover:bg-red-600 text-white font-bold uppercase text-[10px] tracking-widest">
            {isCurrent ? "Enter the Abyss" : "Review"}
          </button>
        </Link>
      ) : (
        <div className="text-zinc-700 text-center py-2 text-[10px] uppercase border border-dashed border-zinc-800">
          Locked 🔒
        </div>
      )}
    </div>
  );
}